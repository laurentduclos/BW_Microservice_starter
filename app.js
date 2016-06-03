'use strict';
import initRoutes from "./routes";
import Koa from 'koa';
import debug from 'debug';
const log = debug('bw:MICROSERVCE_NAME_HERE');

let app = new Koa();

initRoutes(app);

export {app};