// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {service} = Ember.inject;

const lastRide = (rides, vehicleBought) => {
  const vehiculeRides = rides.filter(ride => {
    return ride.get('vehicleId').get('id') === vehicleBought;
  });
  if (vehiculeRides) {
    return vehiculeRides.sortBy('departureTime')[vehiculeRides.length-1];
  }
  return null;
};
const checkAvailability = (lastRide) => {
  if (!lastRide)  {
    return true;
  }
  // Diff in micro sec
  const timeSincedeparture = Date.now() - lastRide.get('departureTime');
  return lastRide.get('travelTime') > timeSincedeparture/(1000);
};

// TODO          CHECK IF VEHICLE IS USED
// TODO          FIND A GOOD WAY TO FORMAT AVAILABLE VEHICLES
export default Ember.Service.extend({
  store: service('store'),
  sessionAccount: service('session-account'),
  error: false,
  name: null,
  vehicles: null,
  rides: null,
  fleetInfo: null,

  // eslint-disable-next-line prefer-arrow-callback
  usedVehicles: Ember.computed('vehicles', 'rides', function () {
    const rides = this.get('rides');
    const vehicles = this.get('vehicles');
    if (!vehicles) {
      return [];
    }
    const vehiclesLastRide = vehicles.map(vehicle => {
      return lastRide(rides, vehicle.get('id'));
    });
    return vehiclesLastRide.filter(vehicleLastRide => {
      return !checkAvailability(vehicleLastRide);
    });

  }),
  availableVehicles: Ember.computed('vehicles', 'rides',
    // eslint-disable-next-line bject-shorthand
    function () {
      const rides = this.get('rides');
      const vehicles = this.get('vehicles');
      if (!vehicles) {
        return [];
      }
      const vehiclesLastRide = vehicles.map(vehicle => {
        return lastRide(rides, vehicle.get('id'));
      });
      return vehiclesLastRide.filter(vehicleLastRide => {
        return checkAvailability(vehicleLastRide);
      });
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
        vehiclesId = fleet.get('vehicles').map(vehicle => {
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
        this.set('vehicles', vehiclesBought);
        this.set('error', false);
      })
      .catch(() => {
        this.set('error', true);
      });
  }
});
