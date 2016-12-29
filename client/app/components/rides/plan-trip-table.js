// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

// eslint-disable-next-line no-undef
const Google = google;

const {service} = Ember.inject;

export default Ember.Component.extend({
  test: {si: 'o', y: 15},
  store: service('store'),
  ride: null,
  vehicleSelected: null,
  fleetInfo: service('fleet-info'),
  departureAddress: null,
  arrivalAddress: null,
  estimatedDistance: 'NA',
  estimatedDuration: 'NA',
  calculDuration() {
    const ride = this.get('ride');
    if (!ride.get('departurePlace') || !ride.get('arrivalPlace') ||
      !this.get('vehicleSelected')) {
      return;
    }
    const directionsService = new Google.maps.DirectionsService();
    const request = {
      origin: ride.get('departurePlace'),
      destination: ride.get('arrivalPlace'),
      travelMode: Google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, (result, status) => {
      if (status === Google.maps.DirectionsStatus.OK) {
        const leg = result.routes[0].legs[0];
        const distance = leg.distance; // en metre
        // const vehicle = ride.get('vehicleId');
        this.set('estimatedDistance', distance.text);
        this.set('estimatedDuration', distance.value);
      }
    });

  },
  actions: {
    didUpdateDeparture(place) {
      const ride = this.get('ride');
      ride.set('departurePlace', place);
      this.calculDuration();
    },
    didUpdateArrival(place) {
      const ride = this.get('ride');
      ride.set('arrivalPlace', place);
      this.calculDuration();
    },
    updateVehicle(component, id, value) { // jshint ignore:line
      const ride = this.get('ride');
      this.set('vehicleSelected', id);
      ride.set('vehicleId', this.get('store').peekRecord('vehicle-bought', id));
      this.calculDuration();
    },
    invalidDepartureSelection() {

    },
    invalidArrivalSelection() {

    },
    start(ride) {
      if (!ride.get('departurePlace') || !ride.get('arrivalPlace') ||
        !ride.get('vehicleSelected')) {
        return;
      }
      this.sendAction('start', ride);
    }
  }
});
