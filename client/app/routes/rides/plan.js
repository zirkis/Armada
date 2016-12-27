// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Route.extend({
  sessionAccount: service('session-account'),
  beforeModel(transition) {
    this._super(transition);
    return this.get('sessionAccount').getUser()
      .then(user => {
        this.set('user', user);
        if (user.get('role') === 'admin') {
          this.transitionTo('dashboard');
        }
      });
  },
  model() {
    /*
     this.get('store')
     .query('vehicle-bought', {simple: {id: '585f102160d97e33a233acb4'}})
     .then(vehicles => {
     const ride = this.get('store').createRecord('ride', {
     vehicleId: vehicles.get('firstObject'),
     departurePlace: 'Paris',
     travelTime: 135,
     arrivalPlace: 'Marseille'
     });
     ride.save();

     });
     */
    return true;
  }

});
