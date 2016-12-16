import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Controller.extend({
  toast: service(),
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
          this.store.query('fleet',
            { filter: { simple:
            { owner: this.get('sessionAccount').get('userId') } } })
            .then(fleet => {
              // fleet comes from the store
              let vehicles = fleet.get('vehicles');
              if (!vehicles) {
                vehicles = Ember.A();
              }
              //vehicle is also from the store
              vehicles.pushObject(vehicle);
              fleet.set('vehicles', vehicles);
              return fleet.save();
            })
            .then(() => {
              user.set('money', user.get('money') - vehicle.get('price'));
              user.save();
              this.get('toast').success('Your car have been added to your fleet');
            })
            .catch(err => {
              console.log(err);
            });
        });
    }
  }
});
