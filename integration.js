'use strict';

const request = require('request');
const config = require('./config/config');
const async = require('async');
const fs = require('fs');
const crypto = require('crypto');
const moment = require('moment');

let Logger;
let requestWithDefaults;

const MAX_PARALLEL_LOOKUPS = 10;

function startup(logger) {
  let defaults = {};
  Logger = logger;

  const { cert, key, passphrase, ca, proxy, rejectUnauthorized } = config.request;

  if (typeof cert === 'string' && cert.length > 0) {
    defaults.cert = fs.readFileSync(cert);
  }

  if (typeof key === 'string' && key.length > 0) {
    defaults.key = fs.readFileSync(key);
  }

  if (typeof passphrase === 'string' && passphrase.length > 0) {
    defaults.passphrase = passphrase;
  }

  if (typeof ca === 'string' && ca.length > 0) {
    defaults.ca = fs.readFileSync(ca);
  }

  if (typeof proxy === 'string' && proxy.length > 0) {
    defaults.proxy = proxy;
  }

  if (typeof rejectUnauthorized === 'boolean') {
    defaults.rejectUnauthorized = rejectUnauthorized;
  }

  requestWithDefaults = request.defaults(defaults);
}

function doLookup(entities, options, cb) {
  let lookupResults = [];
  let tasks = [];

  for (const entity of entities) {
    if (entity.types.indexOf('custom.phoneNumbers') >= 0) {
      Logger.trace({ added_ent: entity });
    }
  }

  Logger.debug(entities);
  entities.forEach((entity) => {
    let verb = 'GET';
    let path =
      '/api/v1/search?q=' +
      `"${entity.value}"` +
      '&count=' +
      options.resultCount +
      '&sort=' +
      options.sortBy.value +
      '&highlight=true';
    let timestamp = moment.utc().format('ddd, D MMM YYYY HH:mm:ss') + ' GMT';
    let signature = verb + path + timestamp;

    Logger.trace({ signature: signature }, 'String to Hash');

    let hmacSignatureInBase64 = crypto
      .createHmac('sha1', options.privateKey)
      .update(signature)
      .digest('base64');
    let auth_header = 'OWL ' + options.publicKey + ':' + hmacSignatureInBase64;

    Logger.trace({ auth_header: auth_header }, 'Auth Header');

    let requestOptions = {
      method: verb,
      uri: `${options.url}/api/v1/search`,
      qs: {
        q: `"${entity.value}"`,
        count: options.resultCount,
        sort: options.sortBy.value,
        highlight: true
      },
      headers: {
        Authorization: auth_header,
        Date: timestamp
      },
      json: true
    };

    Logger.trace({ requestOptions }, 'Request Options');

    tasks.push(function (done) {
      requestWithDefaults(requestOptions, function (error, res, body) {
        let processedResult = handleRestError(error, entity, res, body);

        if (processedResult.error) {
          done(processedResult);
          return;
        }

        done(null, processedResult);
      });
    });
  });

  async.parallelLimit(tasks, MAX_PARALLEL_LOOKUPS, (err, results) => {
    if (err) {
      Logger.error({ err: err }, 'Error');
      cb(err);
      return;
    }

    results.forEach((result) => {
      if (
        !result ||
        result.body === null ||
        !result.body.results ||
        result.body.results === null ||
        result.body.results.length === 0
      ) {
        lookupResults.push({
          entity: result.entity,
          data: null
        });
      } else {
        result.body.results.forEach((result) => {
          result.hackPercent = Math.round(result.hackishness * 100);
          result.highlight = result.body
            .replace(/<em>/g, '<span class="highlight">')
            .replace(/<\/em>/g, '</span>');
        });

        lookupResults.push({
          entity: result.entity,
          data: {
            summary: [
              `Results: ${result.body.resultCount} of ${result.body.total} total`
            ],
            details: result.body
          }
        });
      }
    });

    //Logger.debug({ lookupResults }, 'Results');
    cb(null, lookupResults);
  });
}

function handleRestError(error, entity, res, body) {
  Logger.trace({ RES: res });
  let result;

  if (error) {
    return {
      error: error,
      detail: 'HTTP Request Error'
    };
  }

  if (res.statusCode === 200) {
    // we got data!
    result = {
      entity: entity,
      body: body
    };
  } else if (res.statusCode === 400) {
    result = {
      error: 'Search is empty or invalid',
      detail: body.message
    };
  } else if (res.statusCode === 403) {
    result = {
      error: 'Unknown or suspicious activity detected',
      detail: body.message
    };
  } else if (res.statusCode === 429) {
    result = {
      error: 'Rate Limit Exceeded',
      detail: body.message
    };
  } else {
    result = {
      error: 'Unexpected Error',
      statusCode: res ? res.statusCode : 'Unknown',
      detail: 'An unexpected error occurred'
    };
  }

  return result;
}

function validateOption(errors, options, optionName, errMessage) {
  if (
    typeof options[optionName].value !== 'string' ||
    (typeof options[optionName].value === 'string' &&
      options[optionName].value.length === 0)
  ) {
    errors.push({
      key: optionName,
      message: errMessage
    });
  }
}

function validateOptions(options, callback) {
  let errors = [];

  validateOption(errors, options, 'url', 'You must provide a valid URL.');
  validateOption(errors, options, 'publicKey', 'You must provide a valid Public Key.');
  validateOption(errors, options, 'privateKey', 'You must provide a valid Private Key.');

  callback(null, errors);
}

module.exports = {
  doLookup: doLookup,
  validateOptions: validateOptions,
  startup: startup
};
