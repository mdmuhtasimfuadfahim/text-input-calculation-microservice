const httpStatus = require('http-status');
const { Input, Output } = require('../models');
const { status } = require('../config/status');
const redisHelper = require('./redis.service');
const wait15seconds = require('./delay.service');
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
 * @param {Object} data
 * @returns {Promise<Output>}
 */
const txtInputcalculation = async (data) => {
  let input;
  let output;

  if(data.file !== undefined) {
    input = await createInput(data.text, data.file.filename);
    if(data.file.mimetype !== 'text/plain') {
      output = await createOutput(input._id, 'Only .txt files are allowed', status[2]);
      throw new ApiError(1001, output.result);
    } else {
      output = await createOutput(input._id, 'This is the output', status[0]);
    }
  } else {
    input = await createInput(data.text);
    output = await createOutput(input._id, 'This is the output', status[0]);
  }

  return { input: input.text, output: output.result };
};


/**
 * Take input and give calculation output
 * @param {String} text
 * @param {File} file
 * @returns {Promise<Output>}
 */
const inputServe = async (text, file) => {
  try {
    const data = { text: text, file: file};
    const result = await txtInputcalculation(data).then(await wait15seconds(3000));
    return result;
  } catch (error) {
    throw new ApiError(801, error.message);
  }
};

/**
 * Take input and give calculation output
 * @param {String} text
 * @returns {Promise<Output>}
 */
 const textServe = async (req) => {
  try {
    const data = { text: text };
    const result = await txtInputcalculation(data).then(await wait15seconds(3000));
    return result;
  } catch (error) {
    throw new ApiError(802, error.message);
  }
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
  createInput,
  createOutput,
  txtInputcalculation,
  inputServe,
  textServe,
  queryInputs,
  getInputByUUID,
  queryOutputs,
  getOutputByUUID,
};
