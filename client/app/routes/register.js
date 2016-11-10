// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';
import UnauthenticatedRouteMixin from
  'ember-simple-auth/mixins/unauthenticated-route-mixin';

const {service} = Ember.inject;

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  session: service('session'),
  title: 'Register',
  errorMessage: null,
  model() {
    return this.store.createRecord('user', {
      role: 'user'
    });
  },
  actions: {
    register(user) {
      user.save()
        .then(res => {
          return this.get('session')
            .authenticate('authenticator:oauth2',
              res.get('name'), res.get('password'));
        })
        .catch(err => {
          this.set('errorMessage', err.error || err);
        });
    }
  }
});