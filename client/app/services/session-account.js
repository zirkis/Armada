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
    const userId = this.get('userId');
    const session = this.get('session');
    if (!isEmpty(userId)) {
      return this.get('store').find('user', userId)
        .then(user => {
          if (!user) {
            session.invalidate();
            return null;
          }
          this.set('user', user);
          return user;
        })
        .catch(() => {
          session.invalidate();
          return null;
        });
    }
    return RSVP.Promise.resolve(null);
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
