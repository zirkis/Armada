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
  },
  model() {
    return Ember.RSVP.hash({
      user: this.get('sessionAccount').getUser(),
      fleet: this.store.query('fleet',
        { filter: { simple:
        { owner: this.get('sessionAccount').get('userId') } } })
    });
  }
});
