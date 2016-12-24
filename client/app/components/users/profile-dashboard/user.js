// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Component.extend({
  user: null,
  fleetInfo: service('fleet-info'),
  init() {
    this._super(...arguments);
    this.get('fleetInfo').loadInfo();
  },
  actions: {
    logout() {
      this.sendAction('logout');
    }
  }
});
