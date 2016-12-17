import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    const vehicule = this.store.createRecord('vehicle-model', {
      brand: 'Mercedes',
      make: 'AMG',
      price: 50000,
      speed: 250
    });
    vehicule.save();
    return 'puuuuuuuuuute';
  }
});
