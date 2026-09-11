import React, { useState, useEffect } from 'react';
import { X, Building2, Clock, Wrench, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function AssetDetailsModal({ assetId, onClose, onSelectIssue }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, translateCategory, translateWard, translateDept, translateStatus } = useLanguage();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getAssetById(assetId);
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (assetId) load();
  }, [assetId]);

  if (!assetId) return null;

  const asset = data ? data.asset : null;
  const issueHistory = data ? data.issueHistory : [];
  const inspectionHistory = data ? data.inspectionHistory : [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                {asset ? asset.id : assetId}
              </span>
              {asset && <StatusBadge status={asset.status} />}
              {asset && asset.is_recurring_flag === 1 && (
                <span className="badge badge-recurring">⚠ {t('kpi_recurring_assets')}</span>
              )}
            </div>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem' }}>
              {asset ? asset.name : 'Loading Asset Profile...'}
            </h3>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading asset profile...</div>
        ) : asset ? (
          <div>
            {/* Recurring Alert Box if flagged */}
            {asset.is_recurring_flag === 1 && (
              <div style={{
                background: '#f5f3ff',
                border: '1.5px solid #c084fc',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b21a8', fontWeight: 700, fontSize: '0.92rem' }}>
                  <ShieldAlert size={18} />
                  {t('recurring_title')} ({asset.failure_count} {t('th_failures')})
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#581c87' }}>
                  {asset.recurring_notes || t('recurring_advisory_desc')}
                </p>
              </div>
            )}

            {/* Asset Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: 'var(--slate-50)', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block' }}>{t('th_type')}</span>
                <strong>{translateCategory(asset.asset_type)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block' }}>{t('report_location')}</span>
                <strong>{asset.location_description}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block' }}>{t('th_ward')}</span>
                <strong>{translateWard(asset.ward_name)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block' }}>{t('th_department')}</span>
                <strong>{translateDept(asset.department_name)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block' }}>{t('th_cadence')}</span>
                <strong>{t('cadence_every')} {asset.inspection_frequency_days} {t('cadence_days')}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block' }}>{t('lifetime_issues')}</span>
                <strong>{asset.failure_count}</strong>
              </div>
            </div>

            {/* Issue & Repair History */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} />
                {t('activity_title')} ({issueHistory.length})
              </h4>
              {issueHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {issueHistory.map(iss => (
                    <div 
                      key={iss.id} 
                      style={{ 
                        background: '#fff', 
                        border: '1px solid var(--slate-200)', 
                        borderRadius: '6px', 
                        padding: '10px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--primary-800)' }}>
                            {iss.id}
                          </span>
                          <PriorityBadge priority={iss.priority} score={iss.priority_score} />
                          <StatusBadge status={iss.status} />
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', marginTop: '2px' }}>{iss.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                          {t('reported_on')} {new Date(iss.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {onSelectIssue && (
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => { onClose(); onSelectIssue(iss.id); }}
                        >
                          {t('btn_track')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>{t('no_issues_found')}</p>
              )}
            </div>

            {/* Recent Scheduled Inspection Checks */}
            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wrench size={16} />
                {t('tab_scheduled_inspections')} ({inspectionHistory.length})
              </h4>
              {inspectionHistory.map(ih => (
                <div key={ih.id} style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{t('audit_date')} {ih.schedule_date}</strong> • Inspector: {ih.inspector_name}
                    {ih.notes && <div style={{ color: 'var(--slate-600)' }}>Notes: {ih.notes}</div>}
                  </div>
                  <StatusBadge status={ih.result} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
