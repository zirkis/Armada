import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('dashboard' , {path: '/'});

  this.route('login');
  this.route('register');

  this.route('user', function() {
    this.route('create');
  });

  this.route('profile');

  this.route('users');
  this.route('vehicles', function() {
    this.route('store');
    this.route('create');
  });
  this.route('fleets');

  this.route('404', {path: '/*path'});

});

export default Router;
