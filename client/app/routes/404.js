// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {service} = Ember.inject;

export default Ember.Route.extend({
  session: service('session'),
  title: '404 :)'
});
