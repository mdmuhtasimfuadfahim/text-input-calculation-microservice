const fs = require('fs');
const ApiError = require('../utils/ApiError');

/**
 * Fetch file data
 * @param {String} fileData
 * @returns {Boolean}
 */
const lettersNumbersSpacesDashes = async (fileData) => {
  return /^[A-Za-z0-9 -]*$/.test(fileData);
}

const isNumeric = async (str) => {
  if (typeof str != "string") return false
  return !isNaN(str) && !isNaN(parseFloat(str))
}

const isOperand = async (token) => {
  const ops = ["add", "multiply", "minus", "divide"]
  if (ops.includes(token)) {
    return true;
  }

  return false;
}

const interpret = async (input) => {
  const inputData = input.split(' ');
  let state = 0;

  for (i = 0; i < inputData.length; i++) {
    const t = inputData[i] // to keep things shorter
    if (!isOperand(t)) {
      throw new ApiError(3002, `Epected Operand Data, Got: ${t}`)  
    }

    let a, b;

    const next = inputData[i + 1]
    if (next == "by") {
      a = state
      b = parseFloat(inputData[i + 2])
      i += 2
    } else if (isNumeric(next)) {
      const and = inputData[i + 2] // this should be the "and"
      if (and != "and") {
        throw new ApiError(3002, `Expected "and", Got: ${and}`)
      }
      a = parseFloat(next)
      b = parseFloat(inputData[i + 3])
      i += 3
    } else {
      throw new Error(3002, `Unexpected: ${next}`)  
    }

    switch (t) {
      case "add": 
        state = a + b
        break;
      case "multiply":
        state = a * b
      case "divide":
        state = a / b
      case "minus":
        state = a - b
    }
  }

  return state
}

/**
 * Fetch file data
 * @param {String} filename
 * @returns {Promise<FileData> or Error Code}
 */
const fileOperation = async (file) => {
  try {
    const readFileData = fs.readFileSync(`./uploads/${file.filename}`, 'utf-8');
    const checkInput = await lettersNumbersSpacesDashes(readFileData);
    if(checkInput === true) {
      return 3001;
    } else {
      return readFileData;
    }
  } catch (error) {
    throw new ApiError(1001, output.result);
  }
};

module.exports = fileOperation;