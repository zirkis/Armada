const User = require('./model/common/users').model;

const db = {
  init() {
    User.findOne({'name': 'Admin'}, (err, user) => {
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
