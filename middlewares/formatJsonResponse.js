/**
 *
 *  Extend the context namepsace to format JSON API reponses
 *  according to specs: http://jsonapi.org/format
 *
 */

export default function (app) {
  app.context.error = error;
  app.context.data = data;
  return app
}

const error = function (code, message, errors) {
  this.status = code;
  this.body = {
    error: {code, message, meta: errors}
  }
  this.set('Content-Type', 'application/vnd.api+json');
}

const data = function (code, data) {
  this.status = code;
  this.body = {
    data: data
  }
  this.set('Content-Type', 'application/vnd.api+json');
}