import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Controller.extend({
  fleetInfo: service('fleet-info'),
  actions: {
    start(ride) {
      ride.set('departurePlace',
        ride.get('departurePlace').place.formatted_address);
      ride.set('arrivalPlace',
        ride.get('arrivalPlace').place.formatted_address);
      ride.save();
    }
  }
});
