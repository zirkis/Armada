'use strict';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const self = process.env.SERVER_IP;
// const helpers = require('../helpers');
// const winston = require('winston');

// eslint-disable-next-line new-cap
const userSchema = new Schema({
  name: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, enum: ['admin', 'user'], required: true},
  fleet: {type: ObjectId, ref: 'Fleet'},
  token: {type: String}
});

const model = mongoose.model('User', userSchema);

module.exports = {
  schema: userSchema,
  model,
  registry: {
    urlTemplates: {
      self: `${self}/api/users/{id}`,
      relationship: `${self}/api/users/{ownerId}/relationships/{path}`
    }
    // beforeRender(resource, req) {
    //   const token = req.headers.authorization.replace('Bearer ', '');
    //   if (helpers.isAuthenticated(token)) {
    //     winston.log('trace', 'auth');
    //     if (resource._attrs.token !== token) {
    //       resource.removeAttr('email');
    //     }
    //   }
    //
    //   resource.removeAttr('token');
    //   resource.removeAttr('password');
    //   return resource;
    // }
  },
  actions: {
    login(name, password, token) {
      return model.findOneAndUpdate({name, password},
          {token}).exec();
    },
    getUserByToken(token) {
      return model.findOne({token}).exec();
    }
  }
};
