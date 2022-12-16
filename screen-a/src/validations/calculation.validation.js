const Joi = require('joi');
const { objectId } = require('./custom.validation');

const input = {
  req: Joi.object().keys({
    text: Joi.string().required(),
  }),
};

const getInputs = {
  query: Joi.object().keys({
    text: Joi.string(),
    file_path: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getInput = {
  params: Joi.object().keys({
    uuid: Joi.string().guid(),
  }),
};

const getOutputs = {
  query: Joi.object().keys({
    ref_id: Joi.custom(objectId),
    input_uuid: Joi.string(),
    result: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOutput = {
  params: Joi.object().keys({
    uuid: Joi.string().guid(),
  }),
};

module.exports = {
  input,
  getInputs,
  getInput,
  getOutputs,
  getOutput,
};
