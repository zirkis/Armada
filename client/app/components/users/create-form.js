// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

export default Ember.Component.extend({
  roles: ['admin', 'user'],
  name: null,
  password: null,
  role: null,
  user: Ember.computed('name', 'password', 'role', function() {
    return {
      name: this.get('name'),
      role: this.get('role'),
      password: this.get('password')
    };
  }),
  actions: {
    updateRole(component, value) { // jshint ignore:line
      this.set('role', value);
    }
  }
});
