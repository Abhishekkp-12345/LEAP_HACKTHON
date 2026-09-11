import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Camera, 
  ArrowLeft, 
  MapPin, 
  ShieldAlert,
  Send
} from 'lucide-react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function InspectionTaskRunner({ inspectionId, onBack, onComplete }) {
  const [inspectionData, setInspectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [itemNotes, setItemNotes] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const { t, translateWard, translateCategory, translateStatus } = useLanguage();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getInspectionById(inspectionId);
        setInspectionData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (inspectionId) load();
  }, [inspectionId]);

  async function handleRecordResult(item, result) {
    setUpdatingItem(item.id);
    const notes = itemNotes[item.id] || '';

    try {
      const res = await api.submitInspectionItem(inspectionId, item.id, {
        assetId: item.asset_id,
        result,
        notes,
        photoUrl: result === 'NOT_WORKING' ? '/uploads/field-audit-evidence.jpg' : null
      });

      const fresh = await api.getInspectionById(inspectionId);
      setInspectionData(fresh);

      if (res.createdIssue) {
        setToastMessage(`⚡ Proactive Issue Created: ${res.createdIssue.id} (${res.createdIssue.priority} Priority). Auto-routed to maintenance team!`);
      } else {
        setToastMessage(`Asset ${item.asset_id} marked as ${translateStatus(result)}.`);
      }
      setTimeout(() => setToastMessage(null), 6000);
    } catch (e) {
      console.error(e);
      alert('Error updating inspection item: ' + (e.error || e.message));
    } finally {
      setUpdatingItem(null);
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading audit checklist...</div>;
  if (!inspectionData) return <div style={{ padding: '40px', textAlign: 'center' }}>Inspection not found.</div>;

  const { inspection, items } = inspectionData;
  const completedCount = items.filter(i => i.result !== 'PENDING').length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div>
      {/* Toast banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: 'var(--primary-900)',
          color: '#fff',
          padding: '14px 20px',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          maxWidth: '450px'
        }}>
          <CheckCircle2 size={20} color="var(--primary-500)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          <ArrowLeft size={16} />
          {t('btn_back_to_dashboard')}
        </button>

        <StatusBadge status={inspection.status} />
      </div>

      {/* Inspection Summary Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-700)' }}>
              {t('tab_scheduled_inspections')}
            </span>
            <h2 style={{ fontSize: '1.35rem', marginTop: '2px' }}>
              {translateWard(inspection.ward_name)} ({t('audit_date')} {inspection.schedule_date})
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '4px 0 0 0' }}>
              Inspector: <strong>{inspection.inspector_name}</strong> ({inspection.inspector_designation})
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)' }}>
              {completedCount} / {items.length} {t('status_VERIFIED')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{progressPercent}% {t('status_COMPLETED')}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '6px', background: 'var(--slate-200)', borderRadius: '3px', marginTop: '14px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary-600)', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Checklist Items */}
      <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ClipboardCheck size={18} color="var(--primary-700)" />
        {t('tab_scheduled_inspections')} ({items.length})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {items.map(item => {
          const isPending = item.result === 'PENDING';
          const isWorking = item.result === 'WORKING';
          const isAttention = item.result === 'NEEDS_ATTENTION';
          const isNotWorking = item.result === 'NOT_WORKING';

          return (
            <div 
              key={item.id} 
              className="card"
              style={{
                borderLeft: `5px solid ${isWorking ? '#10b981' : isAttention ? '#f59e0b' : isNotWorking ? '#ef4444' : '#cbd5e1'}`,
                backgroundColor: isNotWorking ? '#fffaf0' : '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary-800)', fontSize: '0.9rem' }}>
                      {item.asset_id}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '2px 6px', borderRadius: '4px' }}>
                      {translateCategory(item.asset_type)}
                    </span>
                    {item.asset_is_recurring === 1 && (
                      <span className="badge badge-recurring">
                        ⚠ {t('kpi_recurring_assets')}
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1rem', marginTop: '2px' }}>{item.asset_name}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                    <MapPin size={12} />
                    {item.asset_location} ({item.asset_landmark})
                  </div>
                </div>

                <div>
                  <StatusBadge status={item.result} />
                </div>
              </div>

              {/* Notes Input */}
              <div style={{ marginTop: '10px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={t('report_desc_placeholder')}
                  defaultValue={item.notes || ''}
                  onChange={(e) => setItemNotes({ ...itemNotes, [item.id]: e.target.value })}
                  style={{ fontSize: '0.8rem', padding: '6px 10px', marginBottom: '10px' }}
                />
              </div>

              {/* One-Tap Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-sm"
                  style={{
                    background: isWorking ? '#10b981' : '#f0fdf4',
                    color: isWorking ? '#fff' : '#15803d',
                    border: '1px solid #86efac',
                    fontWeight: 700
                  }}
                  disabled={updatingItem === item.id}
                  onClick={() => handleRecordResult(item, 'WORKING')}
                >
                  <CheckCircle2 size={14} />
                  {translateStatus('WORKING')}
                </button>

                <button
                  className="btn btn-sm"
                  style={{
                    background: isAttention ? '#f59e0b' : '#fffbeb',
                    color: isAttention ? '#fff' : '#b45309',
                    border: '1px solid #fde68a',
                    fontWeight: 700
                  }}
                  disabled={updatingItem === item.id}
                  onClick={() => handleRecordResult(item, 'NEEDS_ATTENTION')}
                >
                  <AlertCircle size={14} />
                  {translateStatus('NEEDS_ATTENTION')}
                </button>

                <button
                  className="btn btn-sm"
                  style={{
                    background: isNotWorking ? '#ef4444' : '#fef2f2',
                    color: isNotWorking ? '#fff' : '#b91c1c',
                    border: '1px solid #fca5a5',
                    fontWeight: 700
                  }}
                  disabled={updatingItem === item.id}
                  onClick={() => handleRecordResult(item, 'NOT_WORKING')}
                >
                  <AlertTriangle size={14} />
                  {translateStatus('NOT_WORKING')}
                </button>
              </div>

              {item.created_issue_id && (
                <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                  ⚡ {t('activity_title')}: <strong>{item.created_issue_id}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
