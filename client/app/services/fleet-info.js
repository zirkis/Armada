// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Service.extend({
  store: service('store'),
  sessionAccount: service('session-account'),
  error: false,
  name: null,
  vehicles: null,
  rides: null,
  fleet: null,
  fleetInfo: null,

  // eslint-disable-next-line prefer-arrow-callback
  numberOfVehicles: Ember.computed('vehicles', function () {
    if (this.get('vehicles')) {
      return this.get('vehicles').get('length');
    }
    return 0;
  }),
  // eslint-disable-next-line prefer-arrow-callback
  availableVehicles: Ember.computed('vehicles', 'rides', function () {
    return 0;
  }),
  usedVehicles: Ember.computed('numberOfVehicles', 'availableVehicles',
    // eslint-disable-next-line bject-shorthand
    function () {
      return this.get('numberOfVehicles') - this.get('availableVehicles');
    }
  ),
  loadInfo() {
    let vehiclesId = null;
    return this.get('store').query('fleet',
      {filter: {simple: {owner: this.get('sessionAccount').get('userId')}}})
      .then(fleets => {
        const fleet = fleets.get('firstObject');

        if (!fleet) {
          this.set('error', true);
          return;
        }
        this.set('name', fleet.get('name'));
        const vehiclesId = fleet.get('vehicles').map(vehicle => {
          return vehicle.get('id');
        });
        return this.get('store').query('ride',
          {filter: {vehicleId: vehiclesId}});
      })
      .then(rides => {
        this.set('rides', rides);
        return this.get('store').query('vehicle-bought', {
          filter: {id: vehiclesId}
        });
      })
      .then(vehiclesBought => {
        const vehiclesModel = vehiclesBought.map(vehicle => {
          return vehicle.get('model');
        });
        this.set('vehicles', vehiclesModel);
        this.set('error', false);
      })
      .catch(() => {
        this.set('error', true);
      });
  }
});
