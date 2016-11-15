'use strict';
const User = require('./model/common/users').model;

const db = {
  init() {
    User.findOne({name: 'Admin'}, (err, user) => {
      if (err) {
        console.log(err);
      }

      if (!user) {
        const admin = new User({
          name: 'Admin',
          role: 'admin',
          password: 'admin'
        });
        admin.save();
      }
    });
  }
};

module.exports = db;
