'use strict';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Schema = mongoose.Schema;
const self = process.env.SERVER_IP;

// eslint-disable-next-line new-cap
const vehicleSchema = new Schema({
  name: {type: String, required: true, unique: true}
});

const model = mongoose.model('Vehicle', vehicleSchema);

module.exports = {
  schema: vehicleSchema,
  model,
  registry: {
    urlTemplates: {
      self: `${self}/api/vehicles/{id}`,
      relationship: `${self}/api/vehicles/{ownerId}/relationships/{path}`
    }
  }
};
