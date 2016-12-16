import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Controller.extend({
  session: service('session'),
  hour: new Date().toLocaleTimeString(),
  minutes: new Date().getMinutes(),
  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});
