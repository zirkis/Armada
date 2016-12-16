import Ember from 'ember';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';

const {RSVP, inject: {service}} = Ember;

export default ToriiAuthenticator.extend({
  store: service('store'),
  session: service('session'),
  torii: service(),
  authenticate(provider, options) {
    this._assertToriiIsPresent();

    return this.get('torii').open(provider, options || {}).then(data => {
      return this._createUserIfNotExist(data.user)
        .then(() => {
          this._authenticateWithProvider(provider, data);
          return data;
        });
    });
  },
  _createUserIfNotExist(user) {
    return new RSVP.Promise((resolve, reject) => {
      const session = this.get('session');
      this._checkIfUserExist(user.email)
        .then(id => {
          if (id) {
            session.set('data.user_id', id);
            resolve(id);
            return;
          }
          this._createUser(user)
            .then(userId => {
              session.set('data.user_id', userId);
              resolve(userId);
            })
            .catch(err => {
              reject(err);
            });
        });
    });
  },
  _checkIfUserExist(email) {
    return new RSVP.Promise(resolve => {
      this.get('store').query('user', {
        filter: {
          simple: {
            email: email
          }
        }
      })
        .then(users => {
          if (users.get('length')) {
            resolve(users.get('firstObject').get('id'));
          } else {
            resolve(null);
          }
        });
    });
  },
  _createFleet(user) {
    return new RSVP.Promise((resolve, reject) => {
      const fleetRecord = this.get('store').createRecord('fleet', {
        name: 'My fleet',
        owner: user
      });
      fleetRecord.save()
        .then(fleet => {
          resolve(fleet);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  _createUser(user) {
    return new RSVP.Promise((resolve, reject) => {
      const userRecord = this.get('store').createRecord('user', {
        role: 'user',
        name: user.name,
        surname: user.name,
        email: user.email,
        money: 12000
      });
      userRecord.save()
        .then(usr => {
          return this._createFleet(usr);
        })
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  invalidate(data) {
    const session = this.get('session');
    session.set('data.userId', null);
    return this.get('torii').close(this._provider, data).then(() => {
      delete this._provider;
    });
  },
});
