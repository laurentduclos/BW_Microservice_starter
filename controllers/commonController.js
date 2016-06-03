'use strict';
import {ValidationError} from '../bw_commons/errors/'
import debug from 'debug';
import multiparter from 'async-busboy';
import parse from 'co-body';
const log = debug('bw');
import * as statuses from '../bw_commons/services/statuses';

/**
 *
 * Common controller regroup endpoint that do not bellong
 *
 * to a specific resources.
 *
 */
const commonController = function(eventRepo) {
  return {

    /**
     * This is a demo handler
     *
     * @endpoint /hello
     * @verb GET
     * @return {JSON}
     */
    index: async function(ctx, next) {
      return ctx.data(200, 'Hello world');
    },

    /**
     *
     * Another demo handler
     *
     * @endpoint /hello/:name
     * @verb POST
     * @payload {JSON} // Can be JSON or multipart
     * @param {String} A username
     *
     */
    hello: async function(ctx, next) {
      const username = ctx.params.name;
      return ctx.data(200, `Hello ${username}`);
    }
  }
}

export default commonController;