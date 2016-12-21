'use strict';
const mongoose = require('mongoose');
const distance = require('google-distance');
mongoose.Promise = require('bluebird');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const self = process.env.SERVER_IP;

// eslint-disable-next-line new-cap
const rideSchema = new Schema({
  vehicleId: {type: ObjectId, ref: 'Fleet', required: true},
  departurePlace: {type: String, required: true},
  departureTime: {type: Date, default: Date.now, required: true},
  travelTime: {type: Number, required: true},
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
    },
    beforeSave: (resource, req, res, superFn) => { // jshint ignore:line
      distance.get(
        {
          origin: 'San Francisco, CA',
          destination: 'San Diego, CA'
        },
        function(err, data) {
          if (err) return console.log(err);
          console.log(data);
        });
      return resource;
    }
  }
};
