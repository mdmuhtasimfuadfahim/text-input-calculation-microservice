const winston = require('winston');

const dateFormat = () => {
  return new Date(Date.now()).toUTCString();
};
class LoggerService {
  constructor() {
    this.log_data = null;
    this.topic = '';

    const logger = winston.createLogger({
      transports: [
        new winston.transports.File({
          filename: `rabbitmq.log`,
        }),
        new winston.transports.Console(),
      ],
      format: winston.format.printf((info) => {
        let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${info.message} | `;
        message = info.data ? `${message}data:${JSON.stringify(info.data)} | ` : message;
        message = this.log_data ? `${message}log_data:${JSON.stringify(this.log_data)} | ` : message;
        return message;
      }),
    });
    this.logger = logger;
  }

  setLogData(logData) {
    this.log_data = logData;
  }

  settopic(topic) {
    this.topic = topic;
  }

  async info(message) {
    this.logger.log('info', message);
  }

  async info(topic, data, message) {
    this.topic = topic;
    this.logger.log('info', message, {
      data,
    });
  }

  async debug(message) {
    this.logger.log('debug', message);
  }

  async debug(message, data) {
    this.logger.log('debug', message, {
      data,
    });
  }

  async error(topic, data, message) {
    this.topic = topic;
    this.logger.log('error', message, {
      data,
    });
  }
}
const RabbitMQLogger = new LoggerService();
module.exports = RabbitMQLogger;
