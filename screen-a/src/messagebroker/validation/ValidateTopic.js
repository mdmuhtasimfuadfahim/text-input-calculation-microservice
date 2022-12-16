const RegisteredTopics = require('../config/RegisteredTopic');
const Error = require('../config/RabbitMQError');

const validateTopic = (topic) => {
  const topicList = Object.keys(RegisteredTopics);
  if (!topicList.includes(topic)) {
    throw new KafkaError(0, topic, `Topic ${topic} is not supported`);
  }
};
module.exports = validateTopic;
