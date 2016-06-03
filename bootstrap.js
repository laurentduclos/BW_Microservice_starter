'use strict';

// Check for current mode
var mode = process.env.BW_ENV || 'dev';

// Load Environment variables
require('dotenv')
  .config({path: '_config/.' + mode + '.env'});

// Enable ES6 runtime transpilation via Babel
require("babel-core/register");
require("babel-polyfill");

var debug = require('debug')('bw');

var app = require('./app.js').app;

// Start the app
  app.listen(process.env.API_GATEWAY_PORT, () => {
    console.log(process.env.API_GATEWAY_ADDRESS)
    console.log(process.env.API_GATEWAY_PORT);
    debug("The app is listening to port" + process.env.API_GATEWAY_PORT);
  });

// IF app need access to MongoDB, then the APP start should be wrapped as bellow:
//
//
// var  mongoInit = require('./bw_commons/services/mongoDBConnector').mongoInit;
// mongoInit().then(()=> {
// 	app.listen(process.env.API_GATEWAY_PORT, () => {
//     console.log(process.env.API_GATEWAY_ADDRESS)
//     console.log(process.env.API_GATEWAY_PORT);
// 		debug("The app is listening to port" + process.env.API_GATEWAY_PORT);
// 	});
// })