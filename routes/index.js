  'use strict';

// Get all routes
import commonRouter from './commonRouter';

// Pass them to koa app
const initRoutes = (app) => {
	app.use(commonRouter.routes());
}

export default initRoutes