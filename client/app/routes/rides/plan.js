// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    const ride = this.get('store').createRecord('ride', {
      departurePlace: 'Paris',
      travelTime: '135',
      arrivalPlace: 'Marseille'
    });
    console.log(ride);
    ride.save();
    return true;
  }
});
