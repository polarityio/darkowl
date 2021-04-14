polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  showRelated: false,

  actions: {
    toggleShowRelated: function () {
      this.toggleProperty(`showRelated`);
      this.get('block').notifyPropertyChange('data');
    }
  }
});
