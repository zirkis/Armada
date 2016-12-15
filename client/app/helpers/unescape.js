import Ember from 'ember';

export function unescape(params/*, hash*/) {
  return Ember.String.htmlSafe(params);
}

export default Ember.Helper.helper(unescape);
