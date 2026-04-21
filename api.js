// API Configuration
const API_BASE_URL = 'http://localhost:5000/api/medicines';

// API Functions
const api = {
  // Get medicine by serial number
  async getMedicine(serialNumber) {
    const response = await fetch(`${API_BASE_URL}/serial/${serialNumber}`);
    if (!response.ok) throw new Error('Medicine not found');
    return response.json();
  },

  // Get trail checkpoints for a medicine
  async getTrail(serialNumber) {
    const response = await fetch(`${API_BASE_URL}/trail/${serialNumber}`);
    return response.json();
  },

  // Verify medicine trail
  async verifyTrail(serialNumber) {
    const response = await fetch(`${API_BASE_URL}/verify/${serialNumber}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Verification failed');
    return response.json();
  },

  // Get all medicines
  async getMedicines(page = 1, limit = 20) {
    const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);
    return response.json();
  },

  // Get statistics
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats/overview`);
    return response.json();
  },

  // Get anomalies for a medicine
  async getAnomalies(serialNumber) {
    const response = await fetch(`${API_BASE_URL}/anomaly/${serialNumber}`);
    return response.json();
  },

  // Get all unresolved anomalies
  async getUnresolvedAnomalies() {
    const response = await fetch(`${API_BASE_URL}/anomalies/unresolved`);
    return response.json();
  },

  // Create new medicine
  async createMedicine(medicineData) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicineData)
    });
    if (!response.ok) throw new Error('Failed to create medicine');
    return response.json();
  },

  // Add trail checkpoint
  async addCheckpoint(checkpointData) {
    const response = await fetch(`${API_BASE_URL}/checkpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkpointData)
    });
    if (!response.ok) throw new Error('Failed to add checkpoint');
    return response.json();
  },

  // Create anomaly
  async createAnomaly(anomalyData) {
    const response = await fetch(`${API_BASE_URL}/anomaly`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anomalyData)
    });
    if (!response.ok) throw new Error('Failed to create anomaly');
    return response.json();
  }
};

// Export for use in HTML
window.api = api;
