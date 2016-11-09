'use strict';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const self = process.env.SERVER_IP;

// eslint-disable-next-line new-cap
const rideSchema = new Schema({
  vehiclesId: {type: ObjectId, ref: 'Fleet', required: true},
  departurePlace: {type: String, required: true},
  departureTime: {type: Date, default: Date.now, required: true},
  arrivalPlace: {type: String, required: true}
});

const model = mongoose.model('Ride', rideSchema);

module.exports = {
  schema: rideSchema,
  model,
  registry: {
    urlTemplates: {
      self: `${self}/api/rides/{id}`,
      relationship: `${self}/api/rides/{ownerId}/relationships/{path}`
    }
  }
};
