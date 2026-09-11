import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Wrench, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import PriorityBadge from '../../components/PriorityBadge';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function FieldDashboard({ 
  user, 
  inspections = [], 
  issues = [], 
  onStartInspection, 
  onOpenWorkModal 
}) {
  const [activeTab, setActiveTab] = useState('INSPECTIONS');
  const { t, translateWard } = useLanguage();

  // Filter assigned to this staff member
  const myIssues = issues.filter(i => 
    i.assigned_to_user_id === (user ? user.id : '') ||
    (user && user.email.includes('ramesh') && i.category === 'STREETLIGHT') ||
    (user && user.email.includes('suresh') && i.category === 'WATER_POINT') ||
    (user && user.email.includes('basavaraj') && ['DRAINAGE', 'ROAD', 'PUBLIC_TOILET'].includes(i.category))
  );

  const activeRepairs = myIssues.filter(i => !['RESOLVED', 'CLOSED'].includes(i.status));

  return (
    <div>
      {/* Field Staff Header */}
      <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, var(--white), var(--primary-50))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-700)', fontWeight: 700, textTransform: 'uppercase' }}>
              {t('field_header_title')}
            </span>
            <h2 style={{ marginTop: '2px', fontSize: '1.35rem' }}>
              {user ? user.name : 'Field Staff'} ({user ? user.designation : 'Inspector'})
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>
              {t('field_header_desc')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="kpi-card" style={{ padding: '8px 16px', background: '#fff', border: '1px solid var(--slate-200)' }}>
              <div className="kpi-value" style={{ fontSize: '1.25rem', color: 'var(--primary-700)' }}>
                {inspections.filter(i => i.status !== 'COMPLETED').length}
              </div>
              <div className="kpi-label">{t('kpi_audits_pending')}</div>
            </div>
            <div className="kpi-card" style={{ padding: '8px 16px', background: '#fff', border: '1px solid var(--slate-200)' }}>
              <div className="kpi-value" style={{ fontSize: '1.25rem', color: '#ea580c' }}>
                {activeRepairs.length}
              </div>
              <div className="kpi-label">{t('kpi_active_repairs')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          className={`btn ${activeTab === 'INSPECTIONS' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('INSPECTIONS')}
        >
          <ClipboardCheck size={16} />
          {t('tab_scheduled_inspections')} ({inspections.length})
        </button>
        <button
          className={`btn ${activeTab === 'REPAIRS' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('REPAIRS')}
        >
          <Wrench size={16} />
          {t('tab_assigned_repairs')} ({activeRepairs.length})
        </button>
      </div>

      {/* TAB 1: Scheduled Field Inspections */}
      {activeTab === 'INSPECTIONS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {inspections.map(insp => (
            <div key={insp.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                    {insp.id}
                  </span>
                  <StatusBadge status={insp.status} />
                </div>
                <h3 style={{ fontSize: '1.05rem', margin: '4px 0' }}>
                  {translateWard(insp.ward_name)} - {t('nav_inspections')}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', margin: '2px 0 6px 0' }}>
                  {insp.notes || t('citizen_welcome_desc')}
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'flex', gap: '14px' }}>
                  <span>{t('audit_date')} <strong>{insp.schedule_date}</strong></span>
                  <span>{t('assets_checked')} <strong>{insp.checked_items || 0} / {insp.total_items || 5}</strong></span>
                  {insp.issues_found > 0 && (
                    <span style={{ color: 'var(--priority-critical)', fontWeight: 700 }}>
                      ⚠ {insp.issues_found} {t('outages_discovered')}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <button 
                  className="btn btn-primary"
                  onClick={() => onStartInspection(insp.id)}
                >
                  <ClipboardCheck size={16} />
                  {insp.status === 'COMPLETED' ? t('btn_review_checklist') : t('btn_run_audit')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Assigned Repairs */}
      {activeTab === 'REPAIRS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {activeRepairs.map(issue => (
            <div key={issue.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                      {issue.id}
                    </span>
                    <h3 style={{ fontSize: '1rem', marginTop: '2px' }}>{issue.title}</h3>
                  </div>
                  <PriorityBadge 
                    priority={issue.priority} 
                    score={issue.priority_score} 
                    rationale={issue.priority_rationale} 
                  />
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginBottom: '10px' }}>
                  {issue.description}
                </p>

                {issue.asset_is_recurring === 1 && (
                  <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '6px', padding: '6px 10px', fontSize: '0.75rem', color: '#6b21a8', marginBottom: '10px' }}>
                    {t('recurring_asset_warning')}
                  </div>
                )}

                <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={13} />
                    {issue.location_text}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} />
                    {t('target_sla')} <strong>{new Date(issue.target_completion_date).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--slate-100)' }}>
                <StatusBadge status={issue.status} />

                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenWorkModal(issue)}
                >
                  <Wrench size={13} />
                  {t('btn_update_work')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
