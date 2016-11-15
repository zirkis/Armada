import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Controller.extend({
  session: service('session'),
  errorMessage: null,
  actions: {
    register(user) {
      user.save()
        .then(res => {
          return this.get('session')
            .authenticate('authenticator:oauth2',
              res.get('name'), res.get('password'));
        })
        .catch(() => {
          this.set('errorMessage', 'This email is already used');
        });
    }
  }
});
