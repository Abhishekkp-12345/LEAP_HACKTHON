import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Plus, Calendar, User, MapPin, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function InspectionScheduling({ onStartInspection }) {
  const [inspections, setInspections] = useState([]);
  const [metadata, setMetadata] = useState({ wards: [], staff: [] });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [wardId, setWardId] = useState('w-2');
  const [assignedToUserId, setAssignedToUserId] = useState('u-staff-1');
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { t, translateWard } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [inspRes, metaRes] = await Promise.all([
        api.getInspections(),
        api.getMetadata()
      ]);
      setInspections(inspRes);
      setMetadata(metaRes);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCreateSchedule(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createInspectionSchedule({
        wardId,
        assignedToUserId,
        scheduleDate,
        notes: notes || `Proactive infrastructure audit for Ward ${wardId}`
      });
      setShowScheduleModal(false);
      setNotes('');
      await loadData();
    } catch (e) {
      alert(e.error || 'Failed to schedule audit');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>{t('card_audits_title')}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
            {t('card_audits_desc')}
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)}>
          <Plus size={16} />
          {t('btn_schedule_audit')}
        </button>
      </div>

      {/* Cadence Information Card */}
      <div className="card" style={{ marginBottom: '20px', background: '#f8fafc' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--slate-700)', marginBottom: '8px' }}>
          Configurable Inspection Frequency Model:
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.82rem' }}>
          <div><strong>High-Risk Infrastructure:</strong> Weekly (Every 7 Days)</div>
          <div><strong>Medium-Risk Infrastructure:</strong> Bi-Weekly (Every 14 Days)</div>
          <div><strong>Low-Risk Infrastructure:</strong> Monthly (Every 30 Days)</div>
          <div><strong>Chronic Recurring Assets:</strong> Auto-elevated to Weekly</div>
        </div>
      </div>

      {/* List of Inspections */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Audit ID</th>
              <th>{t('th_ward')}</th>
              <th>Inspector</th>
              <th>{t('audit_date')}</th>
              <th>{t('status_VERIFIED')}</th>
              <th>{t('outages_discovered')}</th>
              <th>{t('th_status')}</th>
              <th>{t('table_action')}</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map(insp => (
              <tr key={insp.id}>
                <td style={{ fontWeight: 700, color: 'var(--primary-800)' }}>{insp.id}</td>
                <td>
                  <strong>{translateWard(insp.ward_name)}</strong>
                </td>
                <td>{insp.inspector_name} ({insp.inspector_designation})</td>
                <td>{insp.schedule_date}</td>
                <td>
                  {insp.checked_items || 0} / {insp.total_items || 0}
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: insp.issues_found > 0 ? 'var(--priority-critical)' : 'var(--primary-700)' }}>
                    {insp.issues_found || 0}
                  </span>
                </td>
                <td>
                  <StatusBadge status={insp.status} />
                </td>
                <td>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => onStartInspection(insp.id)}
                  >
                    {t('btn_review_checklist')}
                    <ArrowRight size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-backdrop" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('btn_schedule_audit')}</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowScheduleModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSchedule}>
              <div className="form-group">
                <label className="form-label">{t('th_ward')}</label>
                <select className="form-select" value={wardId} onChange={(e) => setWardId(e.target.value)}>
                  {metadata.wards.map(w => (
                    <option key={w.id} value={w.id}>{translateWard(w.name)}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('field_staff')}</label>
                <select className="form-select" value={assignedToUserId} onChange={(e) => setAssignedToUserId(e.target.value)}>
                  {metadata.staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.designation})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('audit_date')}</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={scheduleDate} 
                  onChange={(e) => setScheduleDate(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('report_step4')}</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="e.g. Focus on school approach corridor and monsoon stormwater drains..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowScheduleModal(false)}>
                  {t('btn_cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Scheduling...' : t('btn_submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
