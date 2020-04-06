const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocationSchema = new mongoose.Schema({
  longitude: Number,
  latitude: Number,
  date: String,
  time: Number,
  crowd: {
    type: Number,
    default: 1
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

mongoose.model('Location', LocationSchema);
module.exports = mongoose.model('Location');