import Ember from 'ember';

export default Ember.Component.extend({
  vehicle: null,
  actions: {
    createVehicle() {
      this.sendAction('createVehicle', this.get('vehicle'));
    }
  }
});
