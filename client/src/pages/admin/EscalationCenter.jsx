import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Clock, RefreshCw, UserCheck, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import PriorityBadge from '../../components/PriorityBadge';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function EscalationCenter({ onSelectIssue }) {
  const [issues, setIssues] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanNotice, setScanNotice] = useState(null);
  const { t, translateWard, translateDept } = useLanguage();

  useEffect(() => {
    loadEscalatedIssues();
  }, []);

  async function loadEscalatedIssues() {
    try {
      const res = await api.getIssues({ status: 'ESCALATED' });
      setIssues(res);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleTriggerScan() {
    setScanning(true);
    try {
      const res = await api.triggerEscalationCheck();
      setScanNotice(res.message);
      await loadEscalatedIssues();
      setTimeout(() => setScanNotice(null), 6000);
    } catch (e) {
      alert('Scan error: ' + (e.error || e.message));
    } finally {
      setScanning(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>{t('escalation_title')}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
            {t('escalation_subtitle')}
          </p>
        </div>

        <button 
          className="btn btn-danger btn-sm"
          onClick={handleTriggerScan}
          disabled={scanning}
        >
          <RefreshCw size={14} className={scanning ? 'spin' : ''} />
          {scanning ? t('auditing_overdue') : t('btn_run_escalation_audit')}
        </button>
      </div>

      {scanNotice && (
        <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>
          {scanNotice}
        </div>
      )}

      {/* 3-Tier Hierarchy Infographic Card */}
      <div className="card" style={{ marginBottom: '20px', background: '#fff' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--slate-700)', marginBottom: '12px' }}>
          {t('tier_hierarchy_title')}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div style={{ borderLeft: '4px solid #f59e0b', padding: '10px 12px', background: '#fffbeb', borderRadius: '4px' }}>
            <div style={{ fontWeight: 700, color: '#b45309', fontSize: '0.82rem' }}>{t('level_1_title')}</div>
            <div style={{ fontSize: '0.8rem', color: '#78350f', marginTop: '2px' }}>
              {t('level_1_resp')}
            </div>
          </div>
          <div style={{ borderLeft: '4px solid #ea580c', padding: '10px 12px', background: '#fff7ed', borderRadius: '4px' }}>
            <div style={{ fontWeight: 700, color: '#c2410c', fontSize: '0.82rem' }}>{t('level_2_title')}</div>
            <div style={{ fontSize: '0.8rem', color: '#7c2d12', marginTop: '2px' }}>
              {t('level_2_resp')}
            </div>
          </div>
          <div style={{ borderLeft: '4px solid #dc2626', padding: '10px 12px', background: '#fef2f2', borderRadius: '4px' }}>
            <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '0.82rem' }}>{t('level_3_title')}</div>
            <div style={{ fontSize: '0.8rem', color: '#7f1d1d', marginTop: '2px' }}>
              {t('level_3_resp')}
            </div>
          </div>
        </div>
      </div>

      {/* List of Escalated Issues */}
      <div className="card">
        <div className="card-header">
          <div className="card-title" style={{ color: 'var(--priority-critical)' }}>
            <ShieldAlert size={18} />
            {t('active_escalated_issues')} ({issues.length})
          </div>
        </div>

        {issues.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {issues.map(iss => {
              let historyEvents = [];
              try {
                if (iss.escalation_history) historyEvents = JSON.parse(iss.escalation_history);
              } catch (e) {
                historyEvents = [];
              }

              return (
                <div 
                  key={iss.id} 
                  style={{ 
                    border: '1px solid #fecaca', 
                    borderRadius: '8px', 
                    padding: '14px',
                    background: '#fffaf0' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--priority-critical)' }}>{iss.id}</span>
                        <span className="badge badge-critical">Level {iss.escalation_level} Escalation</span>
                        <PriorityBadge priority={iss.priority} score={iss.priority_score} />
                      </div>
                      <h4 style={{ fontSize: '1.05rem', margin: '4px 0 2px 0' }}>{iss.title}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                        {t('report_location')}: {iss.location_text} • {t('th_ward')}: {translateWard(iss.ward_name)} • {t('th_department')}: {translateDept(iss.department_name)}
                      </div>
                    </div>

                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => onSelectIssue(iss.id)}
                    >
                      {t('btn_track')}
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div style={{ background: '#fef2f2', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem', color: '#991b1b', margin: '8px 0' }}>
                    <div><strong>{t('target_sla_label')}</strong> {new Date(iss.target_completion_date).toLocaleString()}</div>
                    <div><strong>{t('current_authority_label')}</strong> {historyEvents.length > 0 ? historyEvents[historyEvents.length - 1].responsibleAuthority : 'Panchayat Development Officer'}</div>
                  </div>

                  {historyEvents.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '6px' }}>
                      <strong>Escalation History:</strong>
                      {historyEvents.map((ev, i) => (
                        <span key={i} style={{ marginLeft: '6px' }}>
                          [Level {ev.level}: {ev.responsibleAuthority} ({new Date(ev.escalatedAt).toLocaleDateString()})]
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--slate-400)' }}>
            <p>{t('no_escalations_active')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
