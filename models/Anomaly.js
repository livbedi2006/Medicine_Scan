const mongoose = require('mongoose');

const anomalySchema = new mongoose.Schema({
  medicineSerial: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['missing_checkpoint', 'route_jump', 'duplicate_serial', 'expired_stock', 'unknown_origin'],
    required: true
  },
  severity: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  detectedAt: {
    type: Date,
    default: Date.now
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: Date,
  resolvedBy: String
});

module.exports = mongoose.model('Anomaly', anomalySchema);
