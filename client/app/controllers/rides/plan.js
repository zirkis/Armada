// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

// eslint-disable-next-line no-undef
const Google = google;

export default Ember.Controller.extend({
  address: null,
  actions: {
    didUpdatePlace(place) {
      const p1 = new Google.maps.LatLng(45.463688, 9.18814);
      const p2 = new Google.maps.LatLng(46.0438317, 9.75936230000002);
      const distance =
        (Google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000)
          .toFixed(2);
      console.log(distance);
      console.log(place);
    },
    invalidUserSelection() {

    }
  }
});
