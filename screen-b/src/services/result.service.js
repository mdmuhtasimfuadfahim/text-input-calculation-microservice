const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { callScreenA } = require('./screen-a.service');

/**
 * Get input by uuid
 * @param {UUID} uuid
 * @returns {Promise<Input>}
 */
const getInputByUUID = async (uuid) => {
  try {
    const input = await callScreenA(`/input/${uuid}`, {}, 'GET');
    return input.data;
  } catch (error) {
    throw new ApiError(1012, error.message);
  }
};

/**
 * Get output by uuid
 * @param {UUID} uuid
 * @returns {Promise<Output>}
 */
const getOutputByUUID = async (uuid) => {
  try {
    const output = await callScreenA(`/output/${uuid}`, {}, 'GET');;
    return output.data;
  } catch (error) {
    throw new ApiError(1013, error.message);
  }
};

module.exports = {
  getInputByUUID,
  getOutputByUUID,
};
