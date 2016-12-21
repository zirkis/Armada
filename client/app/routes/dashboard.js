// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';
import AuthenticatedRouteMixin
  from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {service} = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  sessionAccount: service('session-account'),
  // eslint-disable-next-line bject-shorthand
  title: function () {
    this.get('sessionAccount').getName()
      .then(name => {
        document.title = `Armada -  ${name}`;
      });
  },
  model() {
    return Ember.RSVP.hash({
      user: this.get('sessionAccount').getUser()
    });
  }
});
