// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {inject: {service}, RSVP} = Ember;

export default Ember.Service.extend({
  session: service('session'),
  store: service(),
  getCurrentUserId() {
    return this.get('session.data.authenticated.account_id');
  },
  getRole() {
    return new RSVP.Promise(resolve => {
      if (!this.get('session.data.authenticated.account_id')) {
        return resolve(null);
      }
      return this.get('store')
        .findRecord('user', this.get('session.data.authenticated.account_id'))
        .then(user => {
          return resolve(user.get('role'));
        })
        .catch(() => {
          this.get('session').invalidate();
          return resolve(null);
        });
    });
  },
  getUser() {
    return new RSVP.Promise(resolve => {
      if (!this.get('session.data.authenticated.account_id')) {
        return resolve(null);
      }
      return this.get('store')
        .findRecord('user', this.get('session.data.authenticated.account_id'))
        .then(user => {
          return resolve(user);
        })
        .catch(err => {
          console.log(err);
          this.get('session').invalidate();
          return resolve(null);
        });
    });
  },
  getName() {
    return new RSVP.Promise(resolve => {
      if (!this.get('session.data.authenticated.account_id')) {
        return resolve(null);
      }
      return this.get('store')
        .findRecord('user', this.get('session.data.authenticated.account_id'))
        .then(user => {
          return resolve(user.get('name'));
        })
        .catch(err => {
          console.log(err);
          this.get('session').invalidate();
          return resolve(null);
        });
    });
  }
});
