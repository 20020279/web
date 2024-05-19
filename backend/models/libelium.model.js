const mongoose = require("mongoose");
const { Decimal128 } = require("mongoose/lib/schema/index");

const Schema = mongoose.Schema;

const libeliumSchema = mongoose.Schema({
  sensor: {
    type: String,
    required: true
  },
  value: {
    type: Decimal128,
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: new Date().getTime()
  },
});

module.exports = mongoose.model("libelium", libeliumSchema);  