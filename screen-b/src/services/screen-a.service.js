const fetch = require('node-fetch');
const ApiError = require('../utils/ApiError');
const config = require('../config/config')

const callScreenA = async (endpoint = '/', body = {}, method = 'POST') => {
  try {
    let response;
    if (method === 'GET') {
      response = await fetch(`${config.base_url}/screen-a/v1//microservice/calculation${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json'},
      });
    } else {
      response = await fetch(`${config.base_url}/screen-a/v1/microservice/calculation${endpoint}`, {
        method,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json'},
      });
    }
    if (response.status >= 400) throw new ApiError(0, `Code Returned: ${response.status}`);
    else return await response.json();
  } catch (err) {
    throw new ApiError(0, err.message);
  }
};

module.exports = { callScreenA };
