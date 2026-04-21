const mongoose = require('mongoose');

const trailCheckpointSchema = new mongoose.Schema({
  medicineSerial: {
    type: String,
    required: true,
    index: true
  },
  checkpointNumber: {
    type: Number,
    required: true
  },
  actor: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['manufacturer', 'distributor', 'pharmacist', 'consumer', 'regulator'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  gpsCoordinates: {
    latitude: Number,
    longitude: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  signature: {
    type: String,
    required: true
  },
  notes: String
});

module.exports = mongoose.model('TrailCheckpoint', trailCheckpointSchema);
