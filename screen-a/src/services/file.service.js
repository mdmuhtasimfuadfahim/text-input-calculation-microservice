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