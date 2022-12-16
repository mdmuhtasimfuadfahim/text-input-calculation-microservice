const RabbitMQLogger = require('./RabbitMQLogger');

class RabbitMQError extends Error {
  constructor(errorCode, topic, message, data, isOperational = true, stack = '') {
    super(message);
    RabbitMQLogger.error(topic, data);
    this.errorCode = errorCode;
    this.statusCode = 400;
    this.data = data;
    this.message = message;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = RabbitMQError;
