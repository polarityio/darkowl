module.exports = {
  /**
   * Name of the integration which is displayed in the Polarity integrations user interface
   *
   * @type String
   * @required
   */
  name: 'DarkOwl Vision',
  /**
   * The acronym that appears in the notification window when information from this integration
   * is displayed.  Note that the acronym is included as part of each "tag" in the summary information
   * for the integration.  As a result, it is best to keep it to 4 or less characters.  The casing used
   * here will be carried forward into the notification window.
   *
   * @type String
   * @required
   */
  acronym: 'DOWL',
  /**
   * Description for this integration which is displayed in the Polarity integrations user interface
   *
   * @type String
   * @optional
   */
  description:
    "DarkOwl is the world's leading provider of DARKINT™, darknet intelligence and the world's largest commercially available database of darknet content.",
  entityTypes: ['IPv4', 'domain', 'email', 'MD5', 'SHA1', 'SHA256', 'cve', 'string'],
  customTypes: [
    {
      key: 'username',
      regex: /^[a-zA-Z0-9_.-]{3,}[a-zA-Z]+[0-9]*$/
    },
    {
      key: 'company',
      regex: /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z])[a-zA-Z0-9 '~?!.,&]{2,}$/
    },
    {
      key: 'name',
      regex: /^[a-z ,.'-]+$/i
    },
    {
      key: 'phoneNumber',
      regex: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    },
    {
      key: 'ssn',
      regex: /^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$/
    },
    {
      key: 'creditCard',
      regex:
        /(^3[47][0-9\ \-\_]{13,17}$)|(^(6541|6556)[0-9\ \-\_]{12,16}$)|(^389[0-9\ \-\_]{11,15}$)|(^3(?:0[0-5]|[68][0-9])[0-9\ \-\_]{11,15}$)|(^65[4-9][0-9\ \-\_]{13,17}|64[4-9][0-9\ \-\_]{13,17}|6011[0-9\ \-\_]{12,16}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9\ \-\_]{10,14})$)|(^63[7-9][0-9\ \-\_]{13,17}$)|(^(?:2131|1800|35\d{3})[\d\ \-\_]{11}$)|(^9[0-9\ \-\_]{15,19}$)|(^(6304|6706|6709|6771)[0-9\ \-\_]{12,19}$)|(^(5018|5020|5038|6304|6759|6761|6763)[0-9\ \-\_]{8,19}$)|(^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9\ \-\_]{12,16}))$)|(^(6334|6767)[0-9]{12}|(6334|6767)[0-9]{14}|(6334|6767)[0-9\ \-\_]{15,19}$)|(^(4903|4905|4911|4936|6333|6759)[0-9\ \-\_]{12,16}|(4903|4905|4911|4936|6333|6759)[0-9\ \-\_]{14,18}|(4903|4905|4911|4936|6333|6759)[0-9\ \-\_]{15,19}|564182[0-9\ \-\_]{10,14}|564182[0-9\ \-\_]{12,17}|564182[0-9\ \-\_]{13,17}|633110[0-9\ \-\_]{10,14}|633110[0-9\ \-\_]{12,16}|633110[0-9\ \-\_]{13,17}$)|(^(62[0-9\ \-\_]{14,21})$)|(^4[0-9\ \-\_]{12,16}(?:[0-9]{3})?$)|(^(?:4[0-9\ \-\_]{12,16}(?:[0-9]{3})?|5[1-5][0-9\ \-\_]{14,18})$)/
    }
  ],
  styles: ['./styles/style.less'],
  defaultColor: 'light-pink',
  onDemandOnly: true,
  /**
   * Provide custom component logic and template for rendering the integration details block.  If you do not
   * provide a custom template and/or component then the integration will display data as a table of key value
   * pairs.
   *
   * @type Object
   * @optional
   */
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  request: {
    // Provide the path to your certFile. Leave an empty string to ignore this option.
    // Relative paths are relative to the integration's root directory
    cert: '',
    // Provide the path to your private key. Leave an empty string to ignore this option.
    // Relative paths are relative to the integration's root directory
    key: '',
    // Provide the key passphrase if required.  Leave an empty string to ignore this option.
    // Relative paths are relative to the integration's root directory
    passphrase: '',
    // Provide the Certificate Authority. Leave an empty string to ignore this option.
    // Relative paths are relative to the integration's root directory
    ca: '',
    // An HTTP proxy to be used. Supports proxy Auth with Basic Auth, identical to support for
    // the url parameter (by embedding the auth info in the uri)
    proxy: ''
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  /**
   * Options that are displayed to the user/admin in the Polarity integration user-interface.  Should be structured
   * as an array of option objects.
   *
   * @type Array
   * @optional
   */
  options: [
    {
      key: 'url',
      name: 'Base URL for the DarkOwl API',
      description:
        'The base URL for the DarkOwl API including the schema (i.e., https://)',
      type: 'text',
      default: 'https://api.darkowl.com',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'publicKey',
      name: 'Public Key',
      description: 'Valid DarkOwl Public Key',
      default: '',
      type: 'password',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'privateKey',
      name: 'Private Key',
      description: 'Valid DarkOwl Private Key corresponding to the provided Public Key',
      default: '',
      type: 'password',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'resultCount',
      name: 'Maximum Number of Results',
      description:
        'The maximum number of API search results that will be displayed in the Polarity Overlay window. (Default: 5)',
      default: 5,
      type: 'number',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'sortBy',
      name: 'Sort Results By',
      description:
        'Return the search results in a particular order. Options are Relevancy, Hackishness or Date Crawled (most recent)',
      default: {
        value: 'd',
        display: 'Date Crawled'
      },
      type: 'select',
      options: [
        {
          value: 'r',
          display: 'Relevancy'
        },
        {
          value: 'h',
          display: 'Hackishness'
        },
        {
          value: 'd',
          display: 'Date Crawled'
        }
      ],
      multiple: false,
      userCanEdit: true,
      adminOnly: false
    }
  ]
};
