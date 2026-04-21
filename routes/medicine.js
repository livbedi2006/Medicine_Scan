const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const TrailCheckpoint = require('../models/TrailCheckpoint');
const Anomaly = require('../models/Anomaly');

// Get medicine by serial number
router.get('/serial/:serialNumber', async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ serialNumber: req.params.serialNumber });
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trail checkpoints for a medicine
router.get('/trail/:serialNumber', async (req, res) => {
  try {
    const checkpoints = await TrailCheckpoint.find({ medicineSerial: req.params.serialNumber })
      .sort({ checkpointNumber: 1 });
    res.json(checkpoints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new medicine
router.post('/', async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    const savedMedicine = await medicine.save();
    res.status(201).json(savedMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add trail checkpoint
router.post('/checkpoint', async (req, res) => {
  try {
    const checkpoint = new TrailCheckpoint(req.body);
    const savedCheckpoint = await checkpoint.save();
    res.status(201).json(savedCheckpoint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Verify medicine trail
router.post('/verify/:serialNumber', async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ serialNumber: req.params.serialNumber });
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const checkpoints = await TrailCheckpoint.find({ medicineSerial: req.params.serialNumber })
      .sort({ checkpointNumber: 1 });

    const anomalies = await Anomaly.find({ medicineSerial: req.params.serialNumber, resolved: false });

    // Determine trail integrity
    const expectedCheckpoints = 4;
    const foundCheckpoints = checkpoints.length;
    
    let integrity = 'authentic';
    let message = 'Full trail intact';

    if (foundCheckpoints === 0) {
      integrity = 'fake';
      message = 'No trail found';
    } else if (foundCheckpoints < expectedCheckpoints) {
      integrity = 'suspicious';
      message = `${expectedCheckpoints - foundCheckpoints} checkpoint(s) missing`;
    } else if (anomalies.length > 0) {
      integrity = 'suspicious';
      message = `Anomalies detected: ${anomalies.length}`;
    }

    // Update medicine status
    medicine.status = integrity;
    await medicine.save();

    res.json({
      medicine,
      checkpoints,
      anomalies,
      integrity,
      message,
      checkpointsFound: foundCheckpoints,
      checkpointsExpected: expectedCheckpoints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all medicines with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const medicines = await Medicine.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Medicine.countDocuments();

    res.json({
      medicines,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalMedicines = await Medicine.countDocuments();
    const authentic = await Medicine.countDocuments({ status: 'authentic' });
    const suspicious = await Medicine.countDocuments({ status: 'suspicious' });
    const fake = await Medicine.countDocuments({ status: 'fake' });
    const expired = await Medicine.countDocuments({ status: 'expired' });
    
    const activeAnomalies = await Anomaly.countDocuments({ resolved: false });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const verifiedToday = await TrailCheckpoint.countDocuments({
      timestamp: { $gte: today }
    });

    res.json({
      totalMedicines,
      authentic,
      suspicious,
      fake,
      expired,
      activeAnomalies,
      verifiedToday,
      integrityRate: totalMedicines > 0 ? ((authentic / totalMedicines) * 100).toFixed(1) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create anomaly
router.post('/anomaly', async (req, res) => {
  try {
    const anomaly = new Anomaly(req.body);
    const savedAnomaly = await anomaly.save();
    res.status(201).json(savedAnomaly);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get anomalies for a medicine
router.get('/anomaly/:serialNumber', async (req, res) => {
  try {
    const anomalies = await Anomaly.find({ medicineSerial: req.params.serialNumber })
      .sort({ detectedAt: -1 });
    res.json(anomalies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all unresolved anomalies
router.get('/anomalies/unresolved', async (req, res) => {
  try {
    const anomalies = await Anomaly.find({ resolved: false })
      .sort({ detectedAt: -1 });
    res.json(anomalies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
