/* jshint node: true */

module.exports = environment => {
  const ENV = {
    modulePrefix: 'client',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },
    contentSecurityPolicy: {
      'connect-src': '\'self\' http://localhost:3000',
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
      'font-src': "'self'",
      'img-src': "'self'",
      'report-uri':"'localhost'",
      'style-src': "'self' 'unsafe-inline'",
      'frame-src': "'none'"
    },
    APP: {
      API_HOST: 'http://localhost:3000'
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    moment: {
      outputFormat: 'L'
    },
    'ember-simple-auth': {
      authenticationRoute: 'login',
      routeAfterAuthentication: 'dashboard',
      routeIfAlreadyAuthenticated: 'dashboard'
    }
  };

  ENV['ember-toastr'] = {
    injectAs: 'toast',
    toastrOptions: {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: true,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '4000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    }
  };

  ENV['torii'] = {
    providers: {
      'facebook-oauth2': {
        apiKey: '600326566837912',
        scope: 'email, public_profile',
        clientSecret: 'c72872bf006069482b9e8e4671563e1d',
        redirectUri: 'http://localhost:4200/'
      }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  /*
  if (environment === 'production') {

  }
  */
  return ENV;
};
