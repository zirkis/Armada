// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

export default Ember.Component.extend({
  user: {
    name: null,
    password: null,
    role: null
  },
  roles: ['admin', 'user'],

  actions: {
    updateRole(component, value) { // jshint ignore:line
      const user = this.get('user');
      user.role = value;
      this.set('user', user);
    }
  }
});
