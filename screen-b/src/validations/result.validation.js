const Joi = require('joi');

const getInput = {
  params: Joi.object().keys({
    uuid: Joi.string().guid(),
  }),
};

const getOutput = {
  params: Joi.object().keys({
    uuid: Joi.string().guid(),
  }),
};

module.exports = {
  getInput,
  getOutput,
};
