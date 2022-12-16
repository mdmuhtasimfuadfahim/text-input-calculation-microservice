const Joi = require('joi');
const mongoose = require('mongoose');
const { v4: uuid4 } = require('uuid');
const { objectId } = require('../validations/custom.validation');
const { toJSON, paginate } = require('./plugins');
const { status } = require('../config/status');

const outputSchema = mongoose.Schema(
  {
    ref_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Input',
      required: true,
      unique: true,
      validate(value) {
        if (!Joi.string().custom(objectId)) {
          throw new Error('Invalid Reference ID');
        }
      },
    },
    id: {
      type: String,
      default: uuid4(),
      required: true,
    },
    result: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: status,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
outputSchema.plugin(toJSON);
outputSchema.plugin(paginate);


/**
 * @typedef Output
 */
const Output = mongoose.model('Output', outputSchema);

module.exports = Output;
