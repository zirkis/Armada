import Ember from 'ember';
import AuthenticatedRouteMixin
  from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  sessionAccount: service('session-account'),
  beforeModel() {
    this.get('sessionAccount').getRole()
      .then(role => {
        if (role !== 'admin') {
          this.transitionTo('dashboard');
        }
      });
  },
  model() {
    return this.store.createRecord('vehicle-model', {
      brand: 'Mercedes',
      make: 'AMG',
      price: 50000,
      speed: 250,
      pictureurl: 'http://cdn.wallpapersafari.com/47/5/fPTbA4.jpg'
    });
  }
});
