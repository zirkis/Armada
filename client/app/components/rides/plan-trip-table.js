// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

// eslint-disable-next-line no-undef
const Google = google;

const {service} = Ember.inject;

export default Ember.Component.extend({
  fleetInfo: service('fleet-info'),
  departureAddress: null,
  departure: null,
  arrivalAddress: null,
  arrival: null,
  vehicleSelected: null,
  vehicleSpeed: 1,
  benefice : 0,
  revenueperkm : 0.78,
  distanceTotal: Ember.computed('departure', 'arrival', function () {
    const departure = this.get('departure');
    const arrival = this.get('arrival');
    if (!departure || !arrival) {
      return 0;
    }
    const p1 = new Google.maps.LatLng(departure.lat, departure.lng);
    const p2 = new Google.maps.LatLng(arrival.lat, arrival.lng);
    const distance =
      (Google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000)
        .toFixed(2);
    console.log(distance);
    console.log(`Distance: ${distance}`);
    return Math.round(distance);
  }),
  actions: {
    didUpdateDeparture(place) {
      this.set('departure', place);
    },
    didUpdateArrival(place) {
      this.set('arrival', place);
    },
    updateVehicle(component, id, value) { // jshint ignore:line
      console.log(id);
      this.set('vehicleSelected', id);
      this.set('vehicleSpeed', parseInt(value.split('>')[1].split('<')[0]));
    },
    invalidUserSelection() {

    }
  }
});
