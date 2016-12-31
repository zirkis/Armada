import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Controller.extend({
  fleetInfo: service('fleet-info'),
  sessionAccount: service('session-account'),
  toast: service(),
  actions: {
    start(ride) {
      const toast = this.get('toast');
      ride.set('departurePlace',
        ride.get('departurePlace').place.formatted_address);
      ride.set('arrivalPlace',
        ride.get('arrivalPlace').place.formatted_address);
      ride.save()
        .then(() => {
          return this.get('sessionAccount').getUser();
        })
        .then(user => {
          user.set('money', user.get('money') + ride.get('benefice'));
          return user.save();
        })
        .then(() => {
          toast.success('Trip created');
        })
        .catch(() => {
          toast.error('Error');
        });
    }
  }
});
