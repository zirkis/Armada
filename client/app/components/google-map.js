// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

export default Ember.Component.extend({
  insertMap: function () {
    const container = this.$('.map-canvas')[0];
    const options = {
      // eslint-disable-next-line no-undef
      center: new window.google.maps.LatLng(
        this.get('latitude'),
        this.get('longitude')
      ),
      zoom: 12
    };
    // eslint-disable-next-line no-new
    new window.google.maps.Map(container, options);
  }.on('didInsertElement')
});
