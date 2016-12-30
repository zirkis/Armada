// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';
import AuthenticatedRouteMixin
  from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {service} = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  sessionAccount: service('session-account'),
  title: 'Plan a ride',
  beforeModel(transition) {
    this._super(transition);
    return this.get('sessionAccount').getUser()
      .then(user => {
        this.set('user', user);
        if (user.get('role') === 'admin') {
          this.transitionTo('dashboard');
        }
      });
  },
  model() {
    return this.get('store').createRecord('ride');
  }
});
