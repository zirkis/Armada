import DS from 'ember-data';
// eslint-disable-next-line import/no-extraneous-dependencies
import ENV from 'client/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  namespace: 'api',
  host: ENV.APP.API_HOST,
  authorizer: 'authorizer:oauth2'
});
