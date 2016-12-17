// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {inject: {service}, RSVP} = Ember;

export default Ember.Controller.extend({
  session: service('session'),
  errorMessage: null,
  actions: {
    register(user) {
      user.save()
        .then(() => {
          return this.send('_createFleet', user);
        })
        .then(() => {
          return this.get('session')
            .authenticate('authenticator:oauth2',
              user.get('name'), user.get('password'));
        })
        .catch(() => {
          this.set('errorMessage', 'This email is already used');
        });
    },
    _createFleet(user) {
      return new RSVP.Promise((resolve, reject) => {
        const fleetRecord = this.get('store').createRecord('fleet', {
          name: 'My fleet',
          owner: user
        });
        fleetRecord.save()
          .then(() => {
            resolve(user);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
});
