const RegisteredTopics = require('./config/RegisteredTopic');
const ValidateTopic = require('./validation/ValidateTopic');
const RabbitMQLogger = require('./config/RabbitMQLogger');
const config = require('../config/config');
const amqp = require('amqplib');

const SubscribeEvent = async () => {
  const amqpServer = config.amqp;
  var connection = await amqp.connect(amqpServer);
  var channel = await connection.createChannel();

  await Object.values(RegisteredTopics).forEach(async (topic) => {
    ValidateTopic(topic);
    await channel.assertQueue(topic);
    try {
      channel.consume(topic, data => {
        const receivedData = Buffer.from(data.content).toString('utf-8');
        RabbitMQLogger.info(topic, receivedData, `Received topic ${topic}`);
        channel.ack(data);
      });
    } catch (error) {
        RabbitMQLogger.info(topic, data, error);
    }
  });
};

module.exports = SubscribeEvent;
