const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { calculationService, uploadService } = require('../services');
const { success, error } = require('../utils/ApiResponse');

const input = catchAsync(async (req, res) => {
  uploadService.upload(req, res, async (err) => {
    if (err) {
      res.status(httpStatus.BAD_REQUEST).send(err);
    } else {
      if(req.file !== null) {
        const data = await calculationService.inputServe(req.body.text, req.file);
        if (data === undefined) res.status(httpStatus.OK).send(success([], 'Error Happened'));
        else res.status(httpStatus.OK).send(success(data, 'Calculation is Mathematically Valid'));
      } else {
        const data = await calculationService.textServe(req.body.text);
        res.status(httpStatus.OK).send(success(data, 'Calculation Result'));
      }
    }
  });
});

const getInputs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['text', 'file_path']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const inputs = await calculationService.queryInputs(filter, options);
  if (!inputs) throw new ApiError(httpStatus.NOT_FOUND, 'Nothing Found');
  else res.status(httpStatus.OK).send(success(inputs, 'Successfully Fetched the Inputs'));
});

const getInput = catchAsync(async (req, res) => {
  const input = await calculationService.getInputByUUID(req.params.uuid);
  if (!input) throw new ApiError(httpStatus.NOT_FOUND, 'Nothing Found');
  else res.status(httpStatus.OK).send(success(input, `Successfully Fetched the Input by uuid ${req.params.uuid}}`));
});

const getOutputs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['ref_id', 'result']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const outputs = await calculationService.queryOutputs(filter, options);
  if (!outputs) throw new ApiError(httpStatus.NOT_FOUND, 'Nothing Found');
  else res.status(httpStatus.OK).send(success(outputs, 'Successfully Fetched the Outputs'));
});

const getOutput = catchAsync(async (req, res) => {
  const output = await calculationService.getOutputByUUID(req.params.uuid);
  if (!output) throw new ApiError(httpStatus.NOT_FOUND, 'Nothing Found');
  else res.status(httpStatus.OK).send(success(output, `Successfully Fetched the Output by uuid ${req.params.uuid}}`));
});

module.exports = {
  input,
  getInputs,
  getInput,
  getOutputs,
  getOutput,
};
