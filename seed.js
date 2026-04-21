require('dotenv').config();
const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');
const TrailCheckpoint = require('./models/TrailCheckpoint');
const Anomaly = require('./models/Anomaly');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await Medicine.deleteMany({});
  await TrailCheckpoint.deleteMany({});
  await Anomaly.deleteMany({});
  console.log('Cleared existing data');

  // Sample medicines
  const medicines = [
    {
      serialNumber: 'MED-24-AZ91-8831',
      gtin: '8901234567890',
      batchNumber: 'AZ91',
      manufacturer: 'MediCo Labs',
      expiryDate: new Date('2026-06-30'),
      productName: 'Paracetamol 500mg',
      status: 'authentic'
    },
    {
      serialNumber: 'MED-24-BC30-2210',
      gtin: '8901234567891',
      batchNumber: 'BC30',
      manufacturer: 'PharmaGen',
      expiryDate: new Date('2026-03-31'),
      productName: 'Amoxicillin 250mg',
      status: 'suspicious'
    },
    {
      serialNumber: 'MED-24-QP11-5510',
      gtin: '8901234567892',
      batchNumber: 'QP11',
      manufacturer: 'SunLife Pharma',
      expiryDate: new Date('2025-12-31'),
      productName: 'Ibuprofen 400mg',
      status: 'authentic'
    },
    {
      serialNumber: 'MED-24-XR77-0041',
      gtin: '8901234567893',
      batchNumber: 'XR77',
      manufacturer: 'MediCo Labs',
      expiryDate: new Date('2026-08-31'),
      productName: 'Omeprazole 20mg',
      status: 'authentic'
    },
    {
      serialNumber: 'MED-24-DX55-7761',
      gtin: '8901234567894',
      batchNumber: 'DX55',
      manufacturer: 'BioRx India',
      expiryDate: new Date('2025-09-30'),
      productName: 'Metformin 500mg',
      status: 'suspicious'
    }
  ];

  const savedMedicines = await Medicine.insertMany(medicines);
  console.log(`${savedMedicines.length} medicines created`);

  // Sample trail checkpoints
  const checkpoints = [
    // MED-24-AZ91-8831 - Full trail
    {
      medicineSerial: 'MED-24-AZ91-8831',
      checkpointNumber: 1,
      actor: 'MediCo Labs',
      role: 'manufacturer',
      location: 'Mumbai',
      gpsCoordinates: { latitude: 19.0, longitude: 72.8 },
      signature: 'SIG-MED-AZ91-1',
      timestamp: new Date('2024-01-12T09:00:00')
    },
    {
      medicineSerial: 'MED-24-AZ91-8831',
      checkpointNumber: 2,
      actor: 'PharmaGen',
      role: 'distributor',
      location: 'Delhi',
      gpsCoordinates: { latitude: 28.6, longitude: 77.2 },
      signature: 'SIG-PG-AZ91-2',
      timestamp: new Date('2024-01-14T14:22:00')
    },
    {
      medicineSerial: 'MED-24-AZ91-8831',
      checkpointNumber: 3,
      actor: 'Chandigarh Transit Hub',
      role: 'distributor',
      location: 'Chandigarh',
      gpsCoordinates: { latitude: 30.7, longitude: 76.7 },
      signature: 'SIG-CTH-AZ91-3',
      timestamp: new Date('2024-01-17T11:05:00')
    },
    {
      medicineSerial: 'MED-24-AZ91-8831',
      checkpointNumber: 4,
      actor: 'Mohali Pharmacy',
      role: 'pharmacist',
      location: 'Mohali',
      gpsCoordinates: { latitude: 30.8, longitude: 76.5 },
      signature: 'SIG-MP-AZ91-4',
      timestamp: new Date('2024-01-19T08:47:00')
    },
    // MED-24-BC30-2210 - Broken trail (missing distributor)
    {
      medicineSerial: 'MED-24-BC30-2210',
      checkpointNumber: 1,
      actor: 'PharmaGen',
      role: 'manufacturer',
      location: 'Delhi',
      gpsCoordinates: { latitude: 28.6, longitude: 77.2 },
      signature: 'SIG-PG-BC30-1',
      timestamp: new Date('2024-01-10T10:00:00')
    },
    {
      medicineSerial: 'MED-24-BC30-2210',
      checkpointNumber: 2,
      actor: 'Chandigarh Pharmacy',
      role: 'pharmacist',
      location: 'Chandigarh',
      gpsCoordinates: { latitude: 30.7, longitude: 76.7 },
      signature: 'SIG-CP-BC30-2',
      timestamp: new Date('2024-01-18T15:30:00')
    },
    // MED-24-QP11-5510 - Full trail
    {
      medicineSerial: 'MED-24-QP11-5510',
      checkpointNumber: 1,
      actor: 'SunLife Pharma',
      role: 'manufacturer',
      location: 'Patiala',
      gpsCoordinates: { latitude: 30.3, longitude: 76.4 },
      signature: 'SIG-SL-QP11-1',
      timestamp: new Date('2024-01-08T08:00:00')
    },
    {
      medicineSerial: 'MED-24-QP11-5510',
      checkpointNumber: 2,
      actor: 'Patiala Distributor',
      role: 'distributor',
      location: 'Patiala',
      gpsCoordinates: { latitude: 30.3, longitude: 76.4 },
      signature: 'SIG-PD-QP11-2',
      timestamp: new Date('2024-01-10T12:00:00')
    },
    {
      medicineSerial: 'MED-24-QP11-5510',
      checkpointNumber: 3,
      actor: 'Ludhiana Hub',
      role: 'distributor',
      location: 'Ludhiana',
      gpsCoordinates: { latitude: 30.9, longitude: 75.9 },
      signature: 'SIG-LH-QP11-3',
      timestamp: new Date('2024-01-13T14:00:00')
    },
    {
      medicineSerial: 'MED-24-QP11-5510',
      checkpointNumber: 4,
      actor: 'Ludhiana Pharmacy',
      role: 'pharmacist',
      location: 'Ludhiana',
      gpsCoordinates: { latitude: 30.9, longitude: 75.9 },
      signature: 'SIG-LP-QP11-4',
      timestamp: new Date('2024-01-16T10:00:00')
    },
    // MED-24-XR77-0041 - Full trail
    {
      medicineSerial: 'MED-24-XR77-0041',
      checkpointNumber: 1,
      actor: 'MediCo Labs',
      role: 'manufacturer',
      location: 'Mumbai',
      gpsCoordinates: { latitude: 19.0, longitude: 72.8 },
      signature: 'SIG-MED-XR77-1',
      timestamp: new Date('2024-01-05T09:00:00')
    },
    {
      medicineSerial: 'MED-24-XR77-0041',
      checkpointNumber: 2,
      actor: 'National Distributor',
      role: 'distributor',
      location: 'Delhi',
      gpsCoordinates: { latitude: 28.6, longitude: 77.2 },
      signature: 'SIG-ND-XR77-2',
      timestamp: new Date('2024-01-08T16:00:00')
    },
    {
      medicineSerial: 'MED-24-XR77-0041',
      checkpointNumber: 3,
      actor: 'Regional Hub',
      role: 'distributor',
      location: 'Chandigarh',
      gpsCoordinates: { latitude: 30.7, longitude: 76.7 },
      signature: 'SIG-RH-XR77-3',
      timestamp: new Date('2024-01-11T11:00:00')
    },
    {
      medicineSerial: 'MED-24-XR77-0041',
      checkpointNumber: 4,
      actor: 'Ludhiana Pharmacy',
      role: 'pharmacist',
      location: 'Ludhiana',
      gpsCoordinates: { latitude: 30.9, longitude: 75.9 },
      signature: 'SIG-LP-XR77-4',
      timestamp: new Date('2024-01-14T09:00:00')
    }
  ];

  const savedCheckpoints = await TrailCheckpoint.insertMany(checkpoints);
  console.log(`${savedCheckpoints.length} trail checkpoints created`);

  // Sample anomalies
  const anomalies = [
    {
      medicineSerial: 'MED-24-BC30-2210',
      type: 'missing_checkpoint',
      severity: 'medium',
      description: 'Distributor checkpoint missing. Medicine jumped from factory to pharmacy.'
    },
    {
      medicineSerial: 'MED-24-DX55-7761',
      type: 'route_jump',
      severity: 'medium',
      description: '340km location jump between checkpoints in under 2 hours - physically impossible.'
    },
    {
      medicineSerial: 'UNK-CLONE-9912',
      type: 'unknown_origin',
      severity: 'high',
      description: 'Serial does not exist in registry. Zero chain history. Suspected counterfeit.'
    }
  ];

  const savedAnomalies = await Anomaly.insertMany(anomalies);
  console.log(`${savedAnomalies.length} anomalies created`);

  console.log('Seed data completed successfully!');
  process.exit();
};

seedData();
