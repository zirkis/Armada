// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const Google = window.google;

const {inject:{service}, RSVP}= Ember;

export default Ember.Component.extend({
  store: service('store'),
  fleetInfo: null,
  ride: null,
  vehicleSelected: null,
  departureAddress: null,
  arrivalAddress: null,
  estimatedDistance: 'NA',
  estimatedDuration: 'NA',
  estimatedBenefice: 'NA',

  getRideInfo() {
    const ride = this.get('ride');
    if (!ride.get('departurePlace') || !ride.get('arrivalPlace')) {
      return RSVP.Promise.reject('Need more infos');
    }
    const directionsService = new Google.maps.DirectionsService();
    const request = {
      origin: ride.get('departurePlace'),
      destination: ride.get('arrivalPlace'),
      travelMode: Google.maps.TravelMode.DRIVING
    };
    return new RSVP.Promise((resolve, reject) => {
      directionsService.route(request, (result, status) => {
        if (status === Google.maps.DirectionsStatus.OK) {
          const leg = result.routes[0].legs[0];
          return resolve(leg);
        }
        reject('Directions status KO');
      });
    });

  },
  setDuration(leg) {
    const ride = this.get('ride');
    if (!ride.get('departurePlace') || !ride.get('arrivalPlace') ||
      !this.get('vehicleSelected')) {
      return;
    }
    const speed = ride.get('vehicleId.model.speed');
    const coeff = speed / 100;
    const duration = leg.duration;
    this.set('estimatedDuration', `${duration.text} * ${coeff}`);
    ride.set('travelTime', duration.value);
  },
  setDistanceBenefice(leg) {
    const ride = this.get('ride');
    if (!ride.get('departurePlace') || !ride.get('arrivalPlace') ||
      !this.get('vehicleSelected')) {
      return;
    }
    const distance = leg.distance; // en metre
    this.set('estimatedDistance', distance.text);

    const benef = (distance.value / 100);
    this.set('estimatedBenefice', `${benef} €`);
  },
  actions: {
    didUpdateDeparture(place) {
      const ride = this.get('ride');
      ride.set('departurePlace', place);
      this.getRideInfo()
        .then(leg => {
          this.setDistanceBenefice(leg);
          this.setDuration(leg);
        })
        .catch(err => {
          console.log(err);
        });
    },
    didUpdateArrival(place) {
      const ride = this.get('ride');
      ride.set('arrivalPlace', place);
      this.getRideInfo()
        .then(leg => {
          this.setDistanceBenefice(leg);
          this.setDuration(leg);
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateVehicle(component, id, value) { // jshint ignore:line
      const ride = this.get('ride');
      this.set('vehicleSelected', id);
      ride.set('vehicleId', this.get('store').peekRecord('vehicle-bought', id));
      this.getRideInfo()
        .then(leg => {
          this.setDistanceBenefice(leg);
          this.setDuration(leg);
        })
        .catch(err => {
          console.log(err);
        });
    },
    invalidDepartureSelection() {

    },
    invalidArrivalSelection() {

    },
    start(ride) {
      if (!ride.get('departurePlace') || !ride.get('arrivalPlace') ||
        !ride.get('vehicleId') || !ride.get('travelTime')) {
        return;
      }
      this.sendAction('start', ride);
    }
  }
});
