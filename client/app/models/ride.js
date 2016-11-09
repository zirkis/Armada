import DS from 'ember-data';

export default DS.Model.extend({
  vehiclesId: DS.belongsTo('vehicle'),
  departurePlace: DS.attr('string'),
  departureTime: DS.attr('date'),
  arrivalPlace: DS.attr('string')
});
