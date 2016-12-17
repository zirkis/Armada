// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Route.extend({
  sessionAccount: service('session-account'),
  title: 'Armada - Profile',
  model() {
    return this.get('sessionAccount').getUser();
  }
});

