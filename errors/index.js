// Create a new object, that prototypally inherits from the Error constructor.
export function ValidationError(message = 'Validation failled') {
  this.name = 'ValidationError';
  this.message = message;
  this.stack = (new Error()).stack;
}
ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;