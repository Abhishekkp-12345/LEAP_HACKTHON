const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('gramseva_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async switchRole(role) {
    const res = await fetch(`${API_BASE}/auth/switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Metadata
  async getMetadata() {
    const res = await fetch(`${API_BASE}/metadata/wards-departments`);
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Assets
  async getAssets(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/assets?${query}`);
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getAssetById(id) {
    const res = await fetch(`${API_BASE}/assets/${id}`);
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async createAsset(data) {
    const res = await fetch(`${API_BASE}/assets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async updateAsset(id, data) {
    const res = await fetch(`${API_BASE}/assets/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Issues
  async getIssues(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/issues?${query}`);
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getIssueById(id) {
    const res = await fetch(`${API_BASE}/issues/${id}`);
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async createIssue(data) {
    const res = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async assignIssue(id, staffId, notes = '') {
    const res = await fetch(`${API_BASE}/issues/${id}/assign`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ staffId, notes })
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async startWork(id, notes) {
    const res = await fetch(`${API_BASE}/issues/${id}/start-work`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes })
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async addProgressNote(id, notes, photoUrl = null) {
    const res = await fetch(`${API_BASE}/issues/${id}/progress-note`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes, photoUrl })
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async resolveIssue(id, resolutionNotes, afterPhotoUrl = null) {
    const res = await fetch(`${API_BASE}/issues/${id}/resolve`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ resolutionNotes, afterPhotoUrl })
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async verifyResolution(id, data) {
    const res = await fetch(`${API_BASE}/issues/${id}/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Inspections
  async getInspections(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/inspections?${query}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getInspectionById(id) {
    const res = await fetch(`${API_BASE}/inspections/${id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async createInspectionSchedule(data) {
    const res = await fetch(`${API_BASE}/inspections`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async submitInspectionItem(inspectionId, itemId, data) {
    const res = await fetch(`${API_BASE}/inspections/${inspectionId}/items/${itemId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Admin & Analytics
  async getAnalytics(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/analytics?${query}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async triggerEscalationCheck() {
    const res = await fetch(`${API_BASE}/admin/escalations/trigger-check`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getRecurringAnalysis() {
    const res = await fetch(`${API_BASE}/admin/recurring-analysis`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getConfig() {
    const res = await fetch(`${API_BASE}/admin/config`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async updateConfig(data) {
    const res = await fetch(`${API_BASE}/admin/config`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw await res.json();
    return res.json();
  }
};
