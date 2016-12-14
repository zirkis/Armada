import Ember from 'ember';

export default Ember.Object.extend({
  name: null,
  vehicles: null,
  ride: null,

  numberOfVehicles: Ember.computed('vehicles', function() {
    if (this.get('vehicles')) {
      return this.get('vehicles').get('length');
    }
    return 0;
  }),
  availableVehicles: Ember.computed('vehicles', 'ride', function() {
    return 0;
  }),
  usedVehicles: Ember.computed('numberOfVehicles', 'availableVehicles', function() {
    return this.get('numberOfVehicles') - this.get('availableVehicles');
  })
});