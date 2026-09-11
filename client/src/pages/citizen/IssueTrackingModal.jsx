import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import LifecycleStepper from '../../components/LifecycleStepper';
import PriorityBadge from '../../components/PriorityBadge';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function IssueTrackingModal({ issueId, onClose, onOpenVerifyModal }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, translateCategory, translateWard, translateDept, translateSource, translateStatus } = useLanguage();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getIssueById(issueId);
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (issueId) load();
  }, [issueId]);

  if (!issueId) return null;

  const issue = data ? data.issue : null;
  const history = data ? data.history : [];
  const feedback = data ? data.feedback : null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                {issue ? issue.id : issueId}
              </span>
              {issue && (
                <PriorityBadge
                  priority={issue.priority}
                  score={issue.priority_score}
                  rationale={issue.priority_rationale}
                />
              )}
            </div>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem' }}>
              {issue ? issue.title : 'Loading Issue Details...'}
            </h3>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading lifecycle data...</div>
        ) : issue ? (
          <div>
            <LifecycleStepper status={issue.status} />

            {(issue.status === 'RESOLVED' || issue.status === 'CITIZEN_VERIFICATION') && (
              <div style={{
                background: '#fef3c7',
                border: '1.5px solid #f59e0b',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: 0, color: '#92400e' }}>{t('verification_req_banner_title')}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#78350f' }}>
                    {t('verification_req_banner_desc')}
                  </p>
                </div>
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => { onClose(); onOpenVerifyModal(issue); }}
                >
                  <CheckCircle2 size={15} />
                  {t('btn_verify')}
                </button>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', background: 'var(--slate-50)', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block' }}>{t('table_category')}</span>
                <strong>{translateCategory(issue.category)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block' }}>{t('th_ward')} & {t('report_landmark')}</span>
                <strong>{translateWard(issue.ward_name)} ({issue.landmark || 'Honnur'})</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block' }}>{t('th_department')}</span>
                <strong>{translateDept(issue.department_name)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block' }}>{t('field_staff')}</span>
                <strong>{issue.assigned_staff_name || 'Unassigned'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block' }}>{t('table_detection_source')}</span>
                <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
                  {translateSource(issue.detection_source)}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block' }}>{t('target_sla')}</span>
                <strong>
                  {issue.target_completion_date ? new Date(issue.target_completion_date).toLocaleDateString() : 'Standard SLA'}
                </strong>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '6px' }}>{t('report_step4')}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', background: '#fff', padding: '10px', border: '1px solid var(--slate-200)', borderRadius: '6px' }}>
                {issue.description}
              </p>
            </div>

            {issue.progress_notes && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '6px' }}>{t('btn_update_work')}</h4>
                <p style={{ fontSize: '0.85rem', color: '#065f46', background: '#ecfdf5', padding: '10px', border: '1px solid #a7f3d0', borderRadius: '6px' }}>
                  {issue.progress_notes}
                </p>
              </div>
            )}

            {issue.resolution_notes && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '6px' }}>{t('btn_mark_resolved')}</h4>
                <p style={{ fontSize: '0.85rem', color: '#1e293b', background: '#f8fafc', padding: '10px', border: '1px solid var(--slate-200)', borderRadius: '6px' }}>
                  {issue.resolution_notes}
                </p>
              </div>
            )}

            {feedback && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#166534', margin: 0 }}>
                    {t('kpi_citizen_satisfaction')}
                  </h4>
                  <span style={{ fontSize: '0.85rem', color: '#eab308' }}>
                    {'★'.repeat(feedback.rating || 5)}{'☆'.repeat(5 - (feedback.rating || 5))}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#14532d', margin: '4px 0 0 0' }}>
                  "{feedback.comments || 'Satisfactorily verified by citizen.'}"
                </p>
              </div>
            )}

            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} />
                {t('modal_track_title')}
              </h4>
              <div style={{ borderLeft: '2px solid var(--slate-200)', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.map(h => (
                  <div key={h.id} style={{ position: 'relative', fontSize: '0.78rem' }}>
                    <div style={{ position: 'absolute', left: '-19px', top: '3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-600)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-500)' }}>
                      <strong>{translateStatus(h.new_status)}</strong>
                      <span>{new Date(h.created_at).toLocaleString()}</span>
                    </div>
                    <p style={{ margin: '2px 0 0 0', color: 'var(--slate-700)' }}>{h.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
