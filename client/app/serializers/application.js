import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  keyForAttribute(attr) {
    return attr;
  },
  keyForRelationship(rawKey) {
    return rawKey;
  }
});
