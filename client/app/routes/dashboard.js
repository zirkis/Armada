// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';
import AuthenticatedRouteMixin
  from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {service} = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  sessionAccount: service('session-account'),
  fleetInfo: service('fleet-info'),
  user: null,
  // eslint-disable-next-line bject-shorthand
  title: null,
  beforeModel() {
    return this.get('sessionAccount').getName()
      .then(name => {
        this.set('title', `Armada -  ${name}`);
      });
  },
  model() {
    return Ember.RSVP.hash({
      user: this.get('user'),
      fleetInfo: this.get('fleetInfo')
    });
  }
});
