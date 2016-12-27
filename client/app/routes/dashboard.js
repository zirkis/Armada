// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';
import AuthenticatedRouteMixin
  from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {service} = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  sessionAccount: service('session-account'),
  fleetInfo: service('fleet-info'),
  // eslint-disable-next-line bject-shorthand
  title: null,
  beforeModel(transition) {
    this._super(transition);
    return this.get('sessionAccount').getName()
      .then(name => {
        this.set('title', `Armada -  ${name}`);
      });
  },
  model() {
    return Ember.RSVP.hash({
      user: this.get('sessionAccount').getUser(),
      fleetInfo: this.get('fleetInfo')
    });
  }
});
