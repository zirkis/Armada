import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Controller.extend({
  sessionAccount: service('session-account'),
  error: null,
  actions: {
    buy(vehicle) {
      this.get('sessionAccount').getUser()
        .then(user => {
          if (!user) {
            this.set('error', 'An unexpected error occurred');
            return;
          }
          if (user.get('money') < vehicle.get('price')) {
            this.set('error', 'Not enough money');
            return;
          }
          /*
          let vehicles = user.get('vehicles');
          if (!vehicles) {
            vehicles = Ember.A();
          }
          vehicles.pushObject(vehicle);
          user.set('vehicles', vehicles);
          */
          user.set('money', user.get('money') - vehicle.get('price'));
          user.save();
        });
    }
  }
});
