import DS from 'ember-data';

export default DS.Model.extend({
  brand: DS.attr('string'),
  make: DS.attr('string'),
  price: DS.attr('number'),
  speed: DS.attr('number'),
  pictureurl: DS.attr('string')
});
