// Frontend Integration Script
// This script fetches real data from the MongoDB backend and updates the UI

async function loadDashboardData() {
  try {
    // Fetch statistics from API
    const stats = await api.getStats();
    
    // Update overview statistics
    updateStatCard(0, stats.verifiedToday, 'Trails Verified Today', '+12% from yesterday');
    updateStatCard(1, stats.activeAnomalies, 'Broken Trail Alerts', `${stats.activeAnomalies} active`);
    updateStatCard(2, `${stats.integrityRate}%`, 'Chain Integrity Rate', '+0.3% this week');
    updateStatCard(3, '5', 'Core Actors Onboarded', 'Mfr · Dist · Pharm · User · Reg');
    
    // Update quick stats in sidebar
    updateQuickStats(stats.verifiedToday, stats.activeAnomalies, `${stats.integrityRate}%`, stats.suspicious + stats.fake);
    
    // Update anomaly count badge
    const anomalyCount = document.getElementById('anomaly-count');
    if (anomalyCount) {
      anomalyCount.textContent = stats.activeAnomalies;
    }
    
    console.log('Dashboard data loaded successfully');
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    // Keep default static data if API fails
  }
}

function updateStatCard(index, value, label, trend) {
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards[index]) {
    const valueEl = statCards[index].querySelector('.stat-val');
    const labelEl = statCards[index].querySelector('.stat-lbl');
    const trendEl = statCards[index].querySelector('.stat-trend');
    
    if (valueEl) valueEl.textContent = value;
    if (labelEl) labelEl.textContent = label;
    if (trendEl) trendEl.textContent = trend;
  }
}

function updateQuickStats(verified, trailBreaks, integrity, flagged) {
  const qsItems = document.querySelectorAll('.qs-item');
  if (qsItems[0]) qsItems[0].querySelector('.qs-val').textContent = verified;
  if (qsItems[1]) qsItems[1].querySelector('.qs-val').textContent = trailBreaks;
  if (qsItems[2]) qsItems[2].querySelector('.qs-val').textContent = integrity;
  if (qsItems[3]) qsItems[3].querySelector('.qs-val').textContent = flagged;
}

async function loadRecentActivity() {
  try {
    const data = await api.getMedicines(1, 10);
    const medicines = data.medicines || [];
    
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    // Clear existing activity items
    activityList.innerHTML = '';
    
    // Generate activity items from recent medicines
    for (const medicine of medicines.slice(0, 5)) {
      try {
        const trail = await api.getTrail(medicine.serialNumber);
        const checkpoints = trail || [];
        const anomalies = await api.getAnomalies(medicine.serialNumber);
        
        let statusClass = 'ok';
        let statusText = 'Authentic';
        let iconSvg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>';
        
        if (medicine.status === 'suspicious') {
          statusClass = 'warn';
          statusText = 'Suspicious';
          iconSvg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>';
        } else if (medicine.status === 'fake') {
          statusClass = 'risk';
          statusText = 'Fake';
          iconSvg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
        }
        
        const checkpointCount = checkpoints.length;
        const time = new Date(medicine.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const activityItem = document.createElement('div');
        activityItem.className = 'act-item';
        activityItem.innerHTML = `
          <div class="act-icon" style="background:var(--${statusClass}-bg);color:var(--${statusClass})">${iconSvg}</div>
          <div class="act-info">
            <strong>${medicine.serialNumber} — ${statusText}</strong>
            <span>${checkpointCount}/4 checkpoints · ${medicine.manufacturer}</span>
          </div>
          <div class="act-time">${time}</div>
          <span class="pill ${statusClass}">${statusText}</span>
        `;
        
        activityList.appendChild(activityItem);
      } catch (err) {
        console.error('Error loading activity for medicine:', err);
      }
    }
  } catch (error) {
    console.error('Failed to load recent activity:', error);
  }
}

async function loadAnomalies() {
  try {
    const anomalies = await api.getUnresolvedAnomalies();
    const anomGrid = document.querySelector('.anom-grid');
    
    if (!anomGrid) return;
    
    // Clear existing anomalies
    anomGrid.innerHTML = '';
    
    // Update anomaly count in header
    const anomCountEl = document.querySelector('#page-anomalies .pill');
    if (anomCountEl) {
      anomCountEl.textContent = `${anomalies.length} Active Trail Alerts`;
    }
    
    // Generate anomaly cards
    for (const anomaly of anomalies) {
      const severityClass = anomaly.severity === 'high' ? 'high' : 'medium';
      const iconSvg = anomaly.severity === 'high' 
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>';
      
      const time = new Date(anomaly.detectedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      const anomCard = document.createElement('div');
      anomCard.className = `anom-card ${severityClass}`;
      anomCard.innerHTML = `
        <div class="anom-icon ${severityClass}">${iconSvg}</div>
        <div>
          <div class="anom-title">${anomaly.type.replace('_', ' ').toUpperCase()} — ${anomaly.medicineSerial}</div>
          <div class="anom-desc">${anomaly.description}</div>
          <div class="anom-actions">
            <button class="btn btn-ghost" style="height:32px;font-size:.78rem" onclick="resolveAnomaly(this)">Mark Investigated</button>
            <button class="btn" style="background:var(--${severityClass === 'high' ? 'red' : 'amber'});color:white;height:32px;font-size:.78rem">${severityClass === 'high' ? 'Escalate to Authority' : 'Notify Actor'}</button>
          </div>
        </div>
        <div class="anom-meta">
          <div>${time}</div>
          <span class="pill ${severityClass === 'high' ? 'risk' : 'warn'}">${severityClass.toUpperCase()}</span>
        </div>
      `;
      
      anomGrid.appendChild(anomCard);
    }
  } catch (error) {
    console.error('Failed to load anomalies:', error);
  }
}

async function runRealVerification() {
  const serial = document.getElementById('s-serial').value.trim();
  const loc = document.getElementById('s-location').value;
  const role = document.getElementById('s-role').value;
  
  if (!serial) {
    setResult('error', 'Please enter a serial number');
    return;
  }
  
  try {
    // Animate steps
    animateSteps(true, false);
    
    // Call real API
    const result = await api.verifyTrail(serial);
    
    setTimeout(() => {
      if (result.integrity === 'authentic') {
        setResult('success', `✅ Full trail verified — All ${result.checkpointsFound}/${result.checkpointsExpected} chain-of-custody checkpoints present, GPS-signed, and in the correct sequence. ${result.message}. Safe to dispense.`);
      } else if (result.integrity === 'suspicious') {
        animateSteps(false, true);
        setResult('warn', `⚠️ Broken trail — ${result.message}. Flag for manual review before dispensing.`);
      } else {
        animateSteps(false, false);
        setResult('error', `🚫 No trail found — ${result.message}. Do not dispense. Report to authorities immediately.`);
      }
    }, 1700);
    
  } catch (error) {
    animateSteps(false, false);
    setResult('error', `🚫 Error verifying trail — ${error.message}. Medicine not found in registry.`);
  }
}

// Override the existing runCheck button
document.addEventListener('DOMContentLoaded', () => {
  // Load initial data
  setTimeout(() => {
    loadDashboardData();
    loadRecentActivity();
  }, 500);
  
  // Override the runCheck button
  const runCheckBtn = document.getElementById('runCheck');
  if (runCheckBtn) {
    runCheckBtn.removeEventListener('click', null); // Remove existing listeners
    runCheckBtn.addEventListener('click', runRealVerification);
  }
  
  // Load anomalies when anomalies page is shown
  const anomaliesBtn = document.querySelector('[data-page="anomalies"]');
  if (anomaliesBtn) {
    anomaliesBtn.addEventListener('click', () => {
      setTimeout(loadAnomalies, 100);
    });
  }
  
  // Load data when overview page is shown
  const overviewBtn = document.querySelector('[data-page="overview"]');
  if (overviewBtn) {
    overviewBtn.addEventListener('click', () => {
      setTimeout(() => {
        loadDashboardData();
        loadRecentActivity();
      }, 100);
    });
  }
});

// Make functions globally available
window.loadDashboardData = loadDashboardData;
window.loadAnomalies = loadAnomalies;
window.runRealVerification = runRealVerification;
