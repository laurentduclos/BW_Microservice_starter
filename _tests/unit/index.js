// Load env variables
require('dotenv')
  .config({path: __dirname + '/../../_config/.test.env'});

var requireDir = require('require-dir');
requireDir('./', {recurse: true});
//import session from './reducers/session.test';