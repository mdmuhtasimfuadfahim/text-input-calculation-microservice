const express = require('express');
const validate = require('../../middlewares/validate');
const resultValidation = require('../../validations/result.validation');
const resultController = require('../../controllers/result.controller');

const router = express.Router();

router
  .route('/input/:uuid')
  .get(validate(resultValidation.getInput), resultController.getInput);

router
  .route('/output/:uuid')
  .get(validate(resultValidation.getOutput), resultController.getOutput);

module.exports = router;
