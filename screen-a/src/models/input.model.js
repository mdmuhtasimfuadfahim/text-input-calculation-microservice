const mongoose = require('mongoose');
const { v4: uuid4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const inputSchema = mongoose.Schema(
  {
    id: {
      type: String,
      default: uuid4(),
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    file_path: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
inputSchema.plugin(toJSON);
inputSchema.plugin(paginate);


/**
 * @typedef Input
 */
const Input = mongoose.model('Input', inputSchema);

module.exports = Input;
