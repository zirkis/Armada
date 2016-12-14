// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';
import AuthenticatedRouteMixin
  from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  title: 'Create user',
  actions: {
    createUser(credentials) {
      const user = this.store.createRecord('user', {
        name: credentials.name,
        role: credentials.role,
        password: credentials.password,
        money: 12000
      });
      console.log('coucou');
      console.log(user.get('money'));
      user.save()
        .then(() => {
          this.transitionTo('profile');
        });
    }
  }
});
