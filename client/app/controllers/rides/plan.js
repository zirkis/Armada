import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    start(ride) {
      ride.set('departurePlace',
        ride.get('departurePlace').place.formatted_address);
      ride.set('arrivalPlace',
        ride.get('arrivalPlace').place.formatted_address);
      console.log(ride.toJSON());
      // ride.save();
    }
  }
});
