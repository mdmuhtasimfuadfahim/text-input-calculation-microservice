const { Input, Output } = require('../models');
const { status } = require('../config/status');
const fileOperation = require('./file.service');
const redisHelper = require('./redis.service');
const ApiError = require('../utils/ApiError');
const PublishEvent = require('../messagebroker/PublishEvent');
const RegisteredTopics = require('../messagebroker/config/RegisteredTopic');
const console = require('console');

/**
 * Create Input
 * @param {String} text
 * @param {String} fileName
 * @returns {Promise<Input>}
 */
 const createInput = async (text, fileName) => {
  try {
    return Input.create({
      text,
      file_path: '/uploads/' + fileName,
    });
  } catch (error) {
    throw new ApiError(2001, error.message);
  }
};

/**
 * Create Output
 * @param {ObjectId} id
 * @param {String} result
 * @param {String} status
 * @returns {Promise<Output>}
 */
 const createOutput = async (id, result, status) => {
  try {
    return Output.create({
      ref_id: id,
      result: result,
      type: status,
    });
  } catch (error) {
    throw new ApiError(2002, error.message);
  }
};

/**
 * Create numberic
 * @param {String} str // string nummeric value
 * @returns {<ConertedNumbericValue>}
 */
const createNumberic = (str) => {
  try {
    if (typeof str != "string") return false;
    return parseFloat(str);
  } catch (error) {
    throw new ApiError(3003, error.message);
  }
};


/**
 * Calculation operation
 * @param {String} data // what is written in the file
 * @returns {<Result>}
 */
const calculation = async (data) => {
  try {
    var expression = data;
    var copy = expression;
  
    expression = expression.replace(/[0-9]+/g, "#").replace(/[\(|\|\.)]/g, "");
    var numbers = copy.split(/[^0-9\.]+/);
    var operators = expression.split("#").filter(function(n){return n});
    let result = 0;
  
    for (i = 0; i < operators.length; i++) {
      let a; 
      if(i === 0) {
        a = createNumberic(numbers[i]);
      } else {
        a = result;
      }
      let op = operators[i];
      let b = createNumberic(numbers[i + 1]);
      switch (op) {
        case "+": 
          result = a + b
          break;
        case "*":
          result = a * b
          break;
        case "-":
          result = a - b
          break;
        case "/":
          result = a / b
          break;
      }
    }
    return result;
  } catch (error) {
    throw new ApiError(3002, error.message);
  }
};


/**
 * Create Output
 * @param {ObjectId} id
 * @param {number} ms // delay in milliseconds
 * @param {String} data
 * @returns {Promise<CalculationResult>}
 */
const calculateOutput = async (id, data, ms) => {
  try {
    var start = new Date().getTime(); // calculation start time
    var end = start; // calculation end time
    let calculationResult;
    while(end < start + ms) {
      if(data === '') {
        calculationResult = '0';
      } else {
        const result = await calculation(data);
        calculationResult = result;
      }
      end = new Date().getTime();
    }
    return await createOutput(id, calculationResult, status[0]);
  } catch (error) {
    throw new ApiError(2004, error.message);
  }
};


/**
 * Take input and give calculation output
 * @param {Object} data
 * @returns {Promise<Output>}
 */
const txtInputCalculation = async (data) => {
  try {
    let input;
    let output;

    if(data.file !== undefined) {
      input = await createInput(data.text, data.file.filename);
      if(data.file.mimetype === 'text/plain' 
        // || data.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        // || data.file.mimetype === 'application/msword' 
        // || data.file.mimetype === 'application/pdf'
      ) {
        const fileData = await fileOperation(data.file);
        if(fileData === 3001) {
          output = await createOutput(input._id, 'File Data are not Valid', status[2]);
          throw new ApiError(1001, output.result);
        } else {
          output = await calculateOutput(input._id, fileData, 1000);
        }
      } else {
        output = await createOutput(input._id, 'Only .txt files are allowed', status[2]);
        throw new ApiError(1001, output.result);
      }
    } else {
      input = await createInput(data.text);
      output = await calculateOutput(input._id, '', 1000);
    }
    return { input: input.text, output: output.result };
  } catch (error) {
    throw new ApiError(2003, error.message);
  }
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
    const result = await txtInputCalculation(data);
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
    const result = await txtInputCalculation(data);
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
  calculateOutput,
  txtInputCalculation,
  inputServe,
  textServe,
  queryInputs,
  getInputByUUID,
  queryOutputs,
  getOutputByUUID,
};
