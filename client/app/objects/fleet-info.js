// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

export default Ember.Object.extend({
  name: null,
  vehicles: null,
  ride: null,

  // eslint-disable-next-line bject-shorthand
  numberOfVehicles: Ember.computed('vehicles', function () {
    if (this.get('vehicles')) {
      return this.get('vehicles').get('length');
    }
    return 0;
  }),
  // eslint-disable-next-line bject-shorthand
  availableVehicles: Ember.computed('vehicles', 'ride', function () {
    return 0;
  }),
  usedVehicles: Ember.computed('numberOfVehicles', 'availableVehicles',
    // eslint-disable-next-line bject-shorthand
    function () {
      return this.get('numberOfVehicles') - this.get('availableVehicles');
    })
});
