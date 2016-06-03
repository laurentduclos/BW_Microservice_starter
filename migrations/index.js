// Load env variables
var mode = process.env.BW_ENV || 'dev';
require('dotenv')
  .config({path: process.env.PWD + '/_config/.' + mode + '.env'});

require("babel-core/register");
require("babel-polyfill");