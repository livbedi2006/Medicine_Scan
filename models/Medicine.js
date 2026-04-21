const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  gtin: {
    type: String,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['authentic', 'suspicious', 'fake', 'expired'],
    default: 'authentic'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Medicine', medicineSchema);
