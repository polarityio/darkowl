polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  actions: {
    toggleShowRelated: function (index) {
      this.toggleProperty(`details.results.${index}._showRelated`);
      this.get('block').notifyPropertyChange('data');
    }
  }
});
