# Medify - Medicine Authenticity Platform with MongoDB

A medicine trail track verification system with centralized MongoDB database for supply chain authenticity tracking.

## Features

- **Centralized MongoDB Database**: Store medicine records, trail checkpoints, and anomalies
- **RESTful API**: Express.js backend with comprehensive endpoints
- **Trail Verification**: Verify complete chain-of-custody for medicines
- **Anomaly Detection**: Flag suspicious patterns and broken trails
- **Real-time Statistics**: Track verification rates and system health

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure MongoDB Connection**
   
   Edit the `.env` file to set your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/medify
   PORT=5000
   ```
   
   For MongoDB Atlas (cloud):
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medify
   PORT=5000
   ```

3. **Seed Sample Data**
   
   Populate the database with sample medicine records and trail data:
   ```bash
   node seed.js
   ```

## Running the Application

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The application will be available at: `http://localhost:5000`

## API Endpoints

### Medicine Operations

- `GET /api/medicines` - Get all medicines (with pagination)
- `GET /api/medicines/serial/:serialNumber` - Get medicine by serial number
- `POST /api/medicines` - Create new medicine
- `GET /api/medicines/stats/overview` - Get system statistics

### Trail Operations

- `GET /api/medicines/trail/:serialNumber` - Get trail checkpoints for a medicine
- `POST /api/medicines/checkpoint` - Add trail checkpoint
- `POST /api/medicines/verify/:serialNumber` - Verify medicine trail integrity

### Anomaly Operations

- `GET /api/medicines/anomaly/:serialNumber` - Get anomalies for a medicine
- `GET /api/medicines/anomalies/unresolved` - Get all unresolved anomalies
- `POST /api/medicines/anomaly` - Create new anomaly

## Data Models

### Medicine
- `serialNumber` (unique identifier)
- `gtin` (Global Trade Item Number)
- `batchNumber`
- `manufacturer`
- `expiryDate`
- `productName`
- `status` (authentic, suspicious, fake, expired)

### TrailCheckpoint
- `medicineSerial` (reference to medicine)
- `checkpointNumber`
- `actor` (who performed the handoff)
- `role` (manufacturer, distributor, pharmacist, consumer, regulator)
- `location`
- `gpsCoordinates` (latitude, longitude)
- `timestamp`
- `signature` (digital signature)

### Anomaly
- `medicineSerial` (reference to medicine)
- `type` (missing_checkpoint, route_jump, duplicate_serial, expired_stock, unknown_origin)
- `severity` (high, medium, low)
- `description`
- `detectedAt`
- `resolved` (boolean)

## Frontend Integration

To connect the frontend to the backend API:

1. The `api.js` file is already created with all API functions
2. Add this line to `hack.html` before the main script tag (around line 512):
   ```html
   <script src="api.js"></script>
   ```
3. Update the JavaScript in `hack.html` to use the API functions instead of mock data

Example usage in the frontend:
```javascript
// Verify a medicine trail
const result = await api.verifyTrail('MED-24-AZ91-8831');
console.log(result.integrity); // 'authentic', 'suspicious', or 'fake'

// Get statistics
const stats = await api.getStats();
console.log(stats.totalMedicines, stats.integrityRate);

// Get unresolved anomalies
const anomalies = await api.getUnresolvedAnomalies();
console.log(anomalies);
```

## MongoDB Schema

The database uses three main collections:

1. **medicines** - Product registry with basic medicine information
2. **trailcheckpoints** - Chain-of-custody records with GPS and signatures
3. **anomalies** - Flagged suspicious patterns requiring investigation

Indexes are created on:
- `medicine.serialNumber` (unique)
- `trailcheckpoint.medicineSerial`
- `anomaly.medicineSerial`

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod` (local) or check Atlas connection
- Verify the connection string in `.env`
- Check firewall settings if using remote MongoDB

**Port Already in Use:**
- Change the PORT in `.env` file
- Or kill the process using port 5000: `lsof -ti:5000 | xargs kill`

**Dependencies Issues:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Development

The project structure:
```
.
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── Medicine.js          # Medicine schema
│   ├── TrailCheckpoint.js   # Trail checkpoint schema
│   └── Anomaly.js           # Anomaly schema
├── routes/
│   └── medicine.js          # API routes
├── seed.js                  # Database seeding script
├── server.js                # Express server
├── api.js                   # Frontend API client
├── hack.html                # Frontend UI
├── package.json             # Dependencies
└── .env                     # Environment variables
```

## License

ISC
