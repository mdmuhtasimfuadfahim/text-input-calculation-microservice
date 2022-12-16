const express = require('express');
const validate = require('../../middlewares/validate');
const calculationValidation = require('../../validations/calculation.validation');
const calculationController = require('../../controllers/calculation.controller');

const router = express.Router();

router
  .route('/input/:uuid')
  .get(validate(calculationValidation.getInput), calculationController.getInput);

router
  .route('/output/:uuid')
  .get(validate(calculationValidation.getOutput), calculationController.getOutput);

module.exports = router;
