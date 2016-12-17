// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';
import UnauthenticatedRouteMixin
  from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  title: 'Armada - Login'
});
