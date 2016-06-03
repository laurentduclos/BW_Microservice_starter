'use strict';
import koaJSONResponse from './bw_commons/middlewares/formatJsonResponse';
import initRoutes from "./routes";
import Koa from 'koa';
import debug from 'debug';
const log = debug('bw:MICROSERVCE_NAME_HERE');

let app = new Koa();

// Add data and error method on the context namespace
app = koaJSONResponse(app);

initRoutes(app);

export {app};