// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Controller.extend({
  session: service('session'),
  actions: {
    authenticate() {
      const {name, password} = this.getProperties('name', 'password');
      this.get('session').authenticate('authenticator:oauth2', name, password)
        .catch(err => {
          this.set('errorMessage', err.error || err);
        });
    }
  }
});
