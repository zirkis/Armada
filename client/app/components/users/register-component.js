// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {computed} = Ember;

export default Ember.Component.extend({
  toast: Ember.inject.service(),
  isSaving: false,
  isDisabled: computed.or('user.validations.isInvalid', 'isSaving'),
  actions: {
    createAccount(user) {
      this.set('isSeNving', true);
      const toast = this.get('toast');
      user.save().then(usr => {
        toast.success(`Welcome, ${usr.get('username')}`,
          'Registration successful');
      }).catch(() => toast.error('Data invalid, maybe the email already exist',
        'Error'));
    }
  }
});
