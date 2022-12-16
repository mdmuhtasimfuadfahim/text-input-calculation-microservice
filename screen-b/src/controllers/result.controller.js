const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { resultService } = require('../services');
const { success } = require('../utils/ApiResponse');

const getInput = catchAsync(async (req, res) => {
  const input = await resultService.getInputByUUID(req.params.uuid);
  if (!input) throw new ApiError(httpStatus.NOT_FOUND, 'Nothing Found');
  else res.status(httpStatus.OK).send(success(input, `Successfully Fetched the Input by uuid ${req.params.uuid}}`));
});

const getOutput = catchAsync(async (req, res) => {
  const output = await resultService.getOutputByUUID(req.params.uuid);
  if (!output) throw new ApiError(httpStatus.NOT_FOUND, 'Nothing Found');
  else res.status(httpStatus.OK).send(success(output, `Successfully Fetched the Output by uuid ${req.params.uuid}}`));
});

module.exports = {
  getInput,
  getOutput,
};
