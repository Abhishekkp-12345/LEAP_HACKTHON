import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { api } from './services/api';

import Navbar from './components/Navbar';
import NotificationDrawer from './components/NotificationDrawer';
import VillageMap from './components/VillageMap';

import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportIssue from './pages/citizen/ReportIssue';
import MyIssues from './pages/citizen/MyIssues';
import IssueTrackingModal from './pages/citizen/IssueTrackingModal';
import VerificationFeedbackModal from './pages/citizen/VerificationFeedbackModal';

import FieldDashboard from './pages/field/FieldDashboard';
import InspectionTaskRunner from './pages/field/InspectionTaskRunner';
import WorkUpdateModal from './pages/field/WorkUpdateModal';

import AdminDashboard from './pages/admin/AdminDashboard';
import AssetRegistry from './pages/admin/AssetRegistry';
import AssetDetailsModal from './pages/admin/AssetDetailsModal';
import RecurringAssetsAnalysis from './pages/admin/RecurringAssetsAnalysis';
import EscalationCenter from './pages/admin/EscalationCenter';
import InspectionScheduling from './pages/admin/InspectionScheduling';
import DepartmentRulesConfig from './pages/admin/DepartmentRulesConfig';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';

import CommunityObserverDashboard from './pages/community/CommunityObserverDashboard';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [issues, setIssues] = useState([]);
  const [assets, setAssets] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [verifyingIssue, setVerifyingIssue] = useState(null);
  const [workingIssue, setWorkingIssue] = useState(null);
  const [activeInspectionId, setActiveInspectionId] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);

  const [newAssetData, setNewAssetData] = useState({
    id: '',
    name: '',
    assetType: 'STREETLIGHT',
    wardId: 'w-2',
    departmentId: 'dept-streetlight',
    locationDescription: '',
    landmark: '',
    riskLevel: 'MEDIUM',
    inspectionFrequencyDays: 14
  });

  useEffect(() => {
    if (user && user.role !== 'COMMUNITY_OBSERVER') {
      loadAllData();
    } else if (user && user.role === 'COMMUNITY_OBSERVER') {
      loadPublicData();
    }
  }, [user]);

  async function loadAllData() {
    try {
      const [issuesRes, assetsRes, inspRes, notifRes] = await Promise.all([
        api.getIssues(),
        api.getAssets(),
        api.getInspections(),
        api.getNotifications()
      ]);
      setIssues(issuesRes || []);
      setAssets(assetsRes || []);
      setInspections(inspRes || []);
      setNotifications(notifRes.notifications || []);
      setUnreadNotifCount(notifRes.unreadCount || 0);
    } catch (e) {
      console.error('Failed to load portal data:', e);
    }
  }

  async function loadPublicData() {
    try {
      const [issuesRes, assetsRes] = await Promise.all([
        api.getIssues(),
        api.getAssets()
      ]);
      setIssues(issuesRes || []);
      setAssets(assetsRes || []);
    } catch (e) {
      console.error('Failed to load public data:', e);
    }
  }

  async function handleCreateAssetSubmit(e) {
    e.preventDefault();
    try {
      await api.createAsset(newAssetData);
      setShowAddAssetModal(false);
      setNewAssetData({
        id: '',
        name: '',
        assetType: 'STREETLIGHT',
        wardId: 'w-2',
        departmentId: 'dept-streetlight',
        locationDescription: '',
        landmark: '',
        riskLevel: 'MEDIUM',
        inspectionFrequencyDays: 14
      });
      await loadAllData();
    } catch (err) {
      alert(err.error || 'Failed to create asset');
    }
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="nav-logo-container" style={{ width: '64px', height: '64px', margin: '0 auto 16px', borderRadius: '12px' }}>
            <img src="/logo.png" alt="GramSeva Logo" className="nav-logo-img" />
          </div>
          <h3>{t('app_title')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Initializing Karnataka Village Infrastructure Portal...</p>
        </div>
      </div>
    );
  }

  const role = user ? user.role : 'CITIZEN';

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => { setActiveInspectionId(null); setActiveTab(tab); }}
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadCount={unreadNotifCount}
      />

      <main className="main-content">
        {activeInspectionId ? (
          <InspectionTaskRunner
            inspectionId={activeInspectionId}
            onBack={() => { setActiveInspectionId(null); loadAllData(); }}
            onComplete={() => { setActiveInspectionId(null); loadAllData(); }}
          />
        ) : (
          <>
            {role === 'CITIZEN' && (
              <>
                {activeTab === 'dashboard' && (
                  <CitizenDashboard
                    user={user}
                    issues={issues}
                    onReportClick={() => setActiveTab('report')}
                    onSelectIssue={(id) => setSelectedIssueId(id)}
                    onOpenVerifyModal={(issue) => setVerifyingIssue(issue)}
                  />
                )}
                {activeTab === 'report' && (
                  <ReportIssue
                    assets={assets}
                    onSuccess={(newId) => { loadAllData(); setSelectedIssueId(newId); setActiveTab('dashboard'); }}
                    onCancel={() => setActiveTab('dashboard')}
                  />
                )}
                {activeTab === 'my_issues' && (
                  <MyIssues
                    issues={issues}
                    user={user}
                    onSelectIssue={(id) => setSelectedIssueId(id)}
                    onOpenVerifyModal={(issue) => setVerifyingIssue(issue)}
                    onReportClick={() => setActiveTab('report')}
                  />
                )}
                {activeTab === 'map' && (
                  <VillageMap
                    assets={assets}
                    issues={issues}
                    onSelectAsset={(id) => setSelectedAssetId(id)}
                    onSelectIssue={(id) => setSelectedIssueId(id)}
                  />
                )}
              </>
            )}

            {role === 'FIELD_STAFF' && (
              <>
                {(activeTab === 'dashboard' || activeTab === 'inspections' || activeTab === 'work_orders') && (
                  <FieldDashboard
                    user={user}
                    inspections={inspections}
                    issues={issues}
                    onStartInspection={(id) => setActiveInspectionId(id)}
                    onOpenWorkModal={(issue) => setWorkingIssue(issue)}
                  />
                )}
                {activeTab === 'map' && (
                  <VillageMap
                    assets={assets}
                    issues={issues}
                    onSelectAsset={(id) => setSelectedAssetId(id)}
                    onSelectIssue={(id) => setSelectedIssueId(id)}
                  />
                )}
              </>
            )}

            {role === 'ADMIN' && (
              <>
                {activeTab === 'dashboard' && (
                  <AdminDashboard
                    onNavigate={(tab) => setActiveTab(tab)}
                    onSelectIssue={(id) => setSelectedIssueId(id)}
                  />
                )}
                {activeTab === 'analytics' && (
                  <AnalyticsDashboard />
                )}
                {activeTab === 'assets' && (
                  <AssetRegistry
                    assets={assets}
                    onSelectAsset={(id) => setSelectedAssetId(id)}
                    onAddAsset={() => setShowAddAssetModal(true)}
                  />
                )}
                {activeTab === 'recurring' && (
                  <RecurringAssetsAnalysis
                    onSelectAsset={(id) => setSelectedAssetId(id)}
                  />
                )}
                {activeTab === 'inspection_mgmt' && (
                  <InspectionScheduling
                    onStartInspection={(id) => setActiveInspectionId(id)}
                  />
                )}
                {activeTab === 'escalations' && (
                  <EscalationCenter
                    onSelectIssue={(id) => setSelectedIssueId(id)}
                  />
                )}
                {activeTab === 'map' && (
                  <VillageMap
                    assets={assets}
                    issues={issues}
                    onSelectAsset={(id) => setSelectedAssetId(id)}
                    onSelectIssue={(id) => setSelectedIssueId(id)}
                  />
                )}
                {activeTab === 'config' && (
                  <DepartmentRulesConfig />
                )}
              </>
            )}

            {role === 'COMMUNITY_OBSERVER' && (
              <>
                {activeTab === 'dashboard' && (
                  <CommunityObserverDashboard
                    issues={issues}
                    assets={assets}
                    onSelectIssue={(id) => setSelectedIssueId(id)}
                    onSelectAsset={(id) => setSelectedAssetId(id)}
                  />
                )}
                {activeTab === 'map' && (
                  <VillageMap
                    assets={assets}
                    issues={issues}
                    onSelectAsset={(id) => setSelectedAssetId(id)}
                    onSelectIssue={(id) => setSelectedIssueId(id)}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onRefresh={loadAllData}
        onSelectIssue={(id) => { setSelectedIssueId(id); setNotificationsOpen(false); }}
      />

      {selectedIssueId && (
        <IssueTrackingModal
          issueId={selectedIssueId}
          onClose={() => setSelectedIssueId(null)}
          onOpenVerifyModal={(issue) => setVerifyingIssue(issue)}
        />
      )}

      {verifyingIssue && (
        <VerificationFeedbackModal
          issue={verifyingIssue}
          onClose={() => setVerifyingIssue(null)}
          onVerified={() => { loadAllData(); }}
        />
      )}

      {workingIssue && (
        <WorkUpdateModal
          issue={workingIssue}
          onClose={() => setWorkingIssue(null)}
          onUpdated={() => { loadAllData(); }}
        />
      )}

      {selectedAssetId && (
        <AssetDetailsModal
          assetId={selectedAssetId}
          onClose={() => setSelectedAssetId(null)}
          onSelectIssue={(id) => setSelectedIssueId(id)}
        />
      )}

      {showAddAssetModal && (
        <div className="modal-backdrop" onClick={() => setShowAddAssetModal(false)}>
          <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('btn_register_asset')}</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddAssetModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateAssetSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">{t('th_asset_id')}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. SL-051"
                    value={newAssetData.id}
                    onChange={(e) => setNewAssetData({ ...newAssetData, id: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('th_type')}</label>
                  <select
                    className="form-select"
                    value={newAssetData.assetType}
                    onChange={(e) => setNewAssetData({ ...newAssetData, assetType: e.target.value })}
                  >
                    <option value="STREETLIGHT">{t('cat_STREETLIGHT')}</option>
                    <option value="WATER_POINT">{t('cat_WATER_POINT')}</option>
                    <option value="PUBLIC_TOILET">{t('cat_PUBLIC_TOILET')}</option>
                    <option value="ROAD">{t('cat_ROAD')}</option>
                    <option value="DRAINAGE">{t('cat_DRAINAGE')}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('th_asset_name')}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Streetlight Pole SL-051 (Anganwadi Cross)"
                  value={newAssetData.name}
                  onChange={(e) => setNewAssetData({ ...newAssetData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">{t('th_ward')}</label>
                  <select
                    className="form-select"
                    value={newAssetData.wardId}
                    onChange={(e) => setNewAssetData({ ...newAssetData, wardId: e.target.value })}
                  >
                    <option value="w-1">Ward 1</option>
                    <option value="w-2">Ward 2</option>
                    <option value="w-3">Ward 3</option>
                    <option value="w-4">Ward 4</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('th_department')}</label>
                  <select
                    className="form-select"
                    value={newAssetData.departmentId}
                    onChange={(e) => setNewAssetData({ ...newAssetData, departmentId: e.target.value })}
                  >
                    <option value="dept-streetlight">{t('dept_streetlight')}</option>
                    <option value="dept-water">{t('dept_water')}</option>
                    <option value="dept-sanitation">{t('dept_sanitation')}</option>
                    <option value="dept-roads">{t('dept_roads')}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('report_location')}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ward 2, Behind Anganwadi Center No. 2"
                  value={newAssetData.locationDescription}
                  onChange={(e) => setNewAssetData({ ...newAssetData, locationDescription: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('report_landmark')}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Anganwadi Center 2"
                  value={newAssetData.landmark}
                  onChange={(e) => setNewAssetData({ ...newAssetData, landmark: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddAssetModal(false)}>
                  {t('btn_cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('btn_save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
