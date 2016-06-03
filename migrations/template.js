'use strict'
require('./');
var mongoInit = require('../middlewares/mongodb').mongoInit;

exports.up = (next) => {
  mongoInit().then((db) => {
    db.createCollection('users', (err, res) => {
      if (err) throw new Error('Could not create users collection');
      console.log('Created Users collection')
      db.close(next);
    })
  })
};

exports.down = (next) => {
  mongoInit().then((db) => {
    db.dropCollection('users', (err, res) => {
      if (err) throw new Error('Could not drop users collection');
      console.log('Dropped Users collection')
      db.close(next);
    });
  });
};
