import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight, Wrench, CheckCircle2, RotateCcw, Clock } from 'lucide-react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function RecurringAssetsAnalysis({ onSelectAsset }) {
  const [recurringAssets, setRecurringAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, translateWard, translateDept } = useLanguage();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getRecurringAnalysis();
        setRecurringAssets(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>{t('recurring_title')}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
          {t('recurring_subtitle')}
        </p>
      </div>

      {/* Advisory Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
        border: '1.5px solid #c084fc',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6b21a8', fontWeight: 700, fontSize: '1rem' }}>
          <ShieldAlert size={22} />
          <span>{t('recurring_advisory_title')}</span>
        </div>
        <p style={{ margin: '6px 0 0 0', color: '#581c87', fontSize: '0.85rem', lineHeight: 1.5 }}>
          {t('recurring_advisory_desc')}
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Analyzing failure frequencies...</div>
      ) : recurringAssets.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recurringAssets.map(asset => (
            <div 
              key={asset.id} 
              className="card" 
              style={{
                borderLeft: '5px solid #8b5cf6',
                background: asset.id === 'SL-047' ? '#faf5ff' : '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#6b21a8', fontSize: '0.95rem' }}>
                      {asset.id}
                    </span>
                    <span className="badge badge-recurring">
                      ⚠ {asset.failure_count} {t('failures_in_60_days')}
                    </span>
                    <StatusBadge status={asset.status} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginTop: '3px' }}>{asset.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', margin: '2px 0 0 0' }}>
                    {t('report_location')}: <strong>{asset.location_description}</strong> • {t('th_ward')}: <strong>{translateWard(asset.ward_name)}</strong>
                  </p>
                </div>

                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => onSelectAsset(asset.id)}
                >
                  {t('btn_view_full_history')}
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Recurrence Notes & Diagnostic Recommendation */}
              <div style={{ background: '#fff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '12px', margin: '10px 0' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase', marginBottom: '3px' }}>
                  {t('root_cause_rec_title')}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#4c1d95', fontWeight: 500 }}>
                  {asset.recurring_notes || 'Repeated electrical or mechanical fatigue. Conduct full circuit overhaul.'}
                </div>
              </div>

              {/* Failure Metrics */}
              <div style={{ display: 'flex', gap: '18px', fontSize: '0.78rem', color: 'var(--slate-500)', flexWrap: 'wrap' }}>
                <div>{t('lifetime_issues')} <strong>{asset.total_life_issues || asset.failure_count}</strong></div>
                <div>{t('recent_60day_failures')} <strong style={{ color: 'var(--priority-critical)' }}>{asset.recent_failures || asset.failure_count}</strong></div>
                <div>{t('current_cadence')} <strong style={{ color: '#6b21a8' }}>{t('cadence_every')} {asset.inspection_frequency_days} {t('cadence_days')}</strong></div>
                <div>{t('th_department')}: <strong>{translateDept(asset.department_name)}</strong></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>{t('no_recurring_found')}</p>
        </div>
      )}
    </div>
  );
}
