  'use strict';

// Get all routes
import commonRouter from './commonRoutes';

// Pass them to koa app
const initRoutes = (app) => {
	app.use(commonRouter.routes());
}

export default initRoutes