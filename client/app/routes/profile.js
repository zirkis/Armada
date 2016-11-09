import Ember from 'ember';
import AuthenticatedRouteMixin
  from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {service} = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  sessionAccount: service('session-account'),
  title: function() {
    this.get('sessionAccount').getName()
      .then(name => {
        document.title = name;
      });
    return 'Profile';
  }
});
