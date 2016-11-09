// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

const {computed, defineProperty} = Ember;

export default Ember.Component.extend({
  tagName: '',
  model: null,
  value: null,
  type: 'text',
  valuePath: '',
  placeholder: '',
  validation: null,
  isTyping: false,

  hasContent: computed.notEmpty('value'),
  isInvalid: computed.and('hasContent', 'validation.isInvalid'),

  init() {
    this._super(...arguments);
    const valuePath = this.get('valuePath');
    defineProperty(this, 'validation',
      computed.oneWay(`model.validations.attrs.${valuePath}`));
    defineProperty(this, 'value', computed.alias(`model.${valuePath}`));
  }
});
