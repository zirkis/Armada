import Ember from 'ember';

import FleetInfo from '../../objects/fleet-info';

export default Ember.Component.extend({
  hour: new Date().getHours(),
  minutes: new Date().getMinutes(),
  user: null,
  fleet: null,
  fleetInfo: Ember.computed('fleet', function() {
    const fleetInfo = FleetInfo.create({
        name: this.get('fleet').get('name'),
        vehicles: this.get('fleet').get('vehicles')
    });
    return fleetInfo;
  }),
  actions: {
    logout() {
      this.sendAction('logout');
    }
  }
});
