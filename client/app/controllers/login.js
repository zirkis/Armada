// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Controller.extend({
  session: service('session'),
  actions: {
    authenticate(creds) {
      this.get('session')
        .authenticate('authenticator:oauth2', creds.name, creds.password)
        .catch(err => {
          this.set('errorMessage', err.error || err);
        });
    }
  }
});
