const httpStatus = require('http-status');
const { Input, Output } = require('../models');
const { status } = require('../config/status');
const redisHelper = require('./redis.service');
const ApiError = require('../utils/ApiError');
const PublishEvent = require('../messagebroker/PublishEvent');
const RegisteredTopics = require('../messagebroker/config/RegisteredTopic');

/**
 * Create Input
 * @param {String} text
 * @param {String} fileName
 * @returns {Promise<Input>}
 */
 const createInput = async (text, fileName) => {
  return Input.create({
    text,
    file_path: '/uploads/' + fileName,
  });
};

/**
 * Create Output
 * @param {ObjectId} id
 * @param {String} result
 * @param {String} status
 * @returns {Promise<Output>}
 */
 const createOutput = async (id, result, status) => {
  return Output.create({
    ref_id: id,
    result: result,
    type: status,
  });
};

/**
 * Take input and give calculation output
 * @param {String} text
 * @param {File} file
 * @returns {Result<Calculation>}
 */
const inputServe = async (text, file) => {
  try {
    const input = await createInput(text, file.filename);
    let output;

    if(file.mimetype !== 'text/plain') {
      output = await createOutput(input._id, 'Only .txt files are allowed', status[2]);
      throw new ApiError(1001, output.result);
    } else {
      output = await createOutput(input._id, 'This is the output', status[0]);
    }

    return { input: input.text, output: output.result };
  } catch (error) {
    throw new ApiError(801, error.message);
  }
};

/**
 * Take input and give calculation output
 * @param {String} text
 * @returns {Result<Calculation>}
 */
 const textServe = async (req) => {
  console.log(req.file)
  console.log(req.body.text)
  // if (await User.isEmailTaken(userBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  // return User.create(userBody);
};

/**
 * Query for inputs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryInputs = async (filter, options) => {
  try {
    const fetchedInputs = await redisHelper(`inputs?limit=${options.limit}&page=${options.page}`, async () => {
      const inputs = await Input.paginate(filter, options, { _id: 0 });
      return inputs;
    });
    await PublishEvent(RegisteredTopics.ALL_INPUTS, fetchedInputs);
    return fetchedInputs;
  } catch (error) {
    throw new ApiError(1010, error.message);
  }
};

/**
 * Get input by uuid
 * @param {UUID} uuid
 * @returns {Promise<Input>}
 */
const getInputByUUID = async (uuid) => {
  try {
    return await redisHelper(`input/${uuid}`, async () => {
      const input = Input.find({ id: uuid }, { projection: { _id: 0 } });
      return input;
    });
  } catch (error) {
    throw new ApiError(1012, error.message);
  }
};

/**
 * Query for outputs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOutputs = async (filter, options) => {
  try {
    const fetchedOutputs = await redisHelper(`outputs?limit=${options.limit}&page=${options.page}&sortBy=${options.sortBy}`, async () => {
      var option = { sort: options.sortBy, populate: 'ref_id', page: options.page, limit: options.limit };
      const outputs = await Output.paginate(filter, option);
      return outputs;
    });
    await PublishEvent(RegisteredTopics.ALL_OUTPUTS, fetchedOutputs);
    return fetchedOutputs;
  } catch (error) {
    throw new ApiError(1011, error.message);
  }
};

/**
 * Get output by uuid
 * @param {UUID} uuid
 * @returns {Promise<Output>}
 */
const getOutputByUUID = async (uuid) => {
  try {
    return await redisHelper(`input/${uuid}`, async () => {
      const output = Output.find({ id: uuid }).populate('ref_id');
      return output;
    });
  } catch (error) {
    throw new ApiError(1013, error.message);
  }
};


module.exports = {
  inputServe,
  textServe,
  queryInputs,
  getInputByUUID,
  queryOutputs,
  getOutputByUUID,
};
