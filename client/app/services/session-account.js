// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {inject: {service}, RSVP, isEmpty} = Ember;

export default Ember.Service.extend({
  session: service('session'),
  store: service(),
  user: null,
  userId: Ember.computed('session.data.user_d',
    'session.data.authenticated.account_id', function() {
      if (this.get('session.data.authenticated.account_id')) {
        return this.get('session.data.authenticated.account_id');
      }
      return this.get('session.data.user_id');
  }),
  loadCurrentUser() {
    console.log(this.get('session.data'));
    return new RSVP.Promise((resolve, reject) => {
      const userId = this.get('userId');
      if (!isEmpty(userId)) {
        this.get('store').find('user', userId).then(user => {
          this.set('user', user);
          resolve(user);
        }, reject);
      } else {
        resolve(null);
      }
    });
  },
  getUser() {
    return this.loadCurrentUser();
  },
  getRole() {
    return this.loadCurrentUser().then(user => {
      return user.get('role');
    });
  },
  getName() {
    return this.loadCurrentUser().then(user => {
      return user.get('name');
    });
  }
});
