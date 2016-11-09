// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';
import UnauthenticatedRouteMixin from
  'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  title: 'Register',
  model() {
    return this.store.createRecord('user', {
      role: 'user'
    });
  },
  actions: {
    register(user) {
      //user.save(); + auth
    }
  }
});