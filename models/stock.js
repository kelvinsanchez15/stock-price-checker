const { Schema, model } = require('mongoose');

const stockSchema = new Schema({
  symbol: { type: String, required: true },
  likes: [String],
});

module.exports = model('Stock', stockSchema);
