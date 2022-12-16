const express = require('express');
const validate = require('../../middlewares/validate');
const calculationValidation = require('../../validations/calculation.validation');
const calculationController = require('../../controllers/calculation.controller');

const router = express.Router();

router
  .route('/inputs')
  .post(validate(calculationValidation.input), calculationController.input)
  .get(validate(calculationValidation.getInputs), calculationController.getInputs);

router
  .route('/input/:uuid')
  .get(validate(calculationValidation.getInput), calculationController.getInput);

router
  .route('/outputs')
  .get(validate(calculationValidation.getOutputs), calculationController.getOutputs);

  router
  .route('/output/:uuid')
  .get(validate(calculationValidation.getOutput), calculationController.getOutput);

module.exports = router;
