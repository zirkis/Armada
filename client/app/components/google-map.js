/**
 * Created by Benjamin on 22/12/2016.
 */
import Ember from 'ember';

export default Ember.Component.extend({
  insertMap: function() {
    var container = this.$('.map-canvas')[0];
    var options = {
      center: new window.google.maps.LatLng(
        this.get('latitude'),
        this.get('longitude')
      ),
      zoom: 12
    };
    new window.google.maps.Map(container, options);
  }.on('didInsertElement')
});