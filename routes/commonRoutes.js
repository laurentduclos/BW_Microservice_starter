'use strict';
import Router from "koa-router";

// Get DI repos if needed
//import {RepoName} from '../repos';

// Get mongoDB access if needed
import {getMongoPool} from '../bw_commons/services/mongoDBConnector.js';

// Controller
import commonController from '../controllers/commonController';

// Instantiate controller with Repo in DI
// With Repo DI
//const controller = commonController(new Event(getMongoPool, 'events'));

// Wihtout Repo DI
const controller = commonController();


// Init router with prefix for these routes
const commonRouter  = new Router({
  //prefix: '/events'
});
commonRouter
  .get('/', controller.index)
  .post('/:name', controller.hello);

export default commonRouter;