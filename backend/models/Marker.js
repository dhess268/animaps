const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const MarkerSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  tags: [{ type: String, required: true }],
  description: { type: String, required: true },
  species: { type: String, required: true }
});


module.exports = mongoose.model('Marker', MarkerSchema);
