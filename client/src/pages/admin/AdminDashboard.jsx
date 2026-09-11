import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  ShieldAlert, 
  BarChart3, 
  Plus, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { api } from '../../services/api';
import PriorityBadge from '../../components/PriorityBadge';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminDashboard({ onNavigate, onSelectIssue }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [escalationTriggering, setEscalationTriggering] = useState(false);
  const [escalationNotice, setEscalationNotice] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await api.getAnalytics();
      setMetrics(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleTriggerEscalation() {
    setEscalationTriggering(true);
    try {
      const res = await api.triggerEscalationCheck();
      setEscalationNotice(res.message);
      await loadDashboard();
      setTimeout(() => setEscalationNotice(null), 7000);
    } catch (e) {
      alert(e.error || 'Failed to execute escalation scan');
    } finally {
      setEscalationTriggering(false);
    }
  }

  if (loading || !metrics) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Panchayat Administrative Intelligence...</div>;
  }

  const { kpis, insights } = metrics;

  return (
    <div>
      {/* Escalation notification banner */}
      {escalationNotice && (
        <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <ShieldAlert size={18} />
          <span>{escalationNotice}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--white), #f0fdf4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-700)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('admin_header_subtitle')}
            </span>
            <h2 style={{ marginTop: '2px', fontSize: '1.4rem' }}>
              {t('admin_header_title')}
            </h2>
            <p style={{ margin: '2px 0 0 0', maxWidth: '680px', fontSize: '0.88rem' }}>
              {t('admin_header_model')} <strong>{t('admin_model_flow')}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-outline btn-sm"
              onClick={handleTriggerEscalation}
              disabled={escalationTriggering}
              title="Audit overdue issues against SLA and bump escalation levels"
            >
              <ShieldAlert size={14} color="var(--priority-critical)" />
              {escalationTriggering ? t('auditing_overdue') : t('btn_trigger_escalation')}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('analytics')}>
              <BarChart3 size={14} />
              {t('btn_open_analytics')}
            </button>
          </div>
        </div>
      </div>

      {/* Section 16 High-Value KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><Building2 size={22} /></div>
          <div>
            <div className="kpi-value">{kpis.totalAssets}</div>
            <div className="kpi-label">{t('kpi_total_assets')}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><CheckCircle2 size={22} /></div>
          <div>
            <div className="kpi-value">{kpis.workingAssets} ({kpis.workingAssetsPercent}%)</div>
            <div className="kpi-label">{t('kpi_functional_assets')}</div>
          </div>
        </div>

        <div className="kpi-card purple" style={{ cursor: 'pointer' }} onClick={() => onNavigate('recurring')}>
          <div className="kpi-icon"><ShieldAlert size={22} /></div>
          <div>
            <div className="kpi-value">{kpis.recurringAssets}</div>
            <div className="kpi-label">{t('kpi_recurring_assets')}</div>
          </div>
        </div>

        <div className="kpi-card info">
          <div className="kpi-icon"><Clock size={22} /></div>
          <div>
            <div className="kpi-value">{kpis.openIssues}</div>
            <div className="kpi-label">{t('kpi_active_open')}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><Wrench size={22} /></div>
          <div>
            <div className="kpi-value">{kpis.inProgressIssues}</div>
            <div className="kpi-label">{t('kpi_repairs_progress')}</div>
          </div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-icon"><AlertTriangle size={22} /></div>
          <div>
            <div className="kpi-value">{kpis.pendingVerification}</div>
            <div className="kpi-label">{t('kpi_pending_verification')}</div>
          </div>
        </div>

        <div className="kpi-card danger" style={{ cursor: 'pointer' }} onClick={() => onNavigate('escalations')}>
          <div className="kpi-icon"><ShieldAlert size={22} /></div>
          <div>
            <div className="kpi-value">{kpis.escalatedIssues}</div>
            <div className="kpi-label">{t('kpi_sla_escalated')}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><RotateCcw size={22} /></div>
          <div>
            <div className="kpi-value">{kpis.reopenedIssues}</div>
            <div className="kpi-label">{t('kpi_citizen_reopened')}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><TrendingUp size={22} /></div>
          <div>
            <div className="kpi-value">{kpis.resolutionRate}%</div>
            <div className="kpi-label">{t('kpi_resolution_rate')}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><Clock size={22} /></div>
          <div>
            <div className="kpi-value">{kpis.avgResolutionDays} {t('cadence_days')}</div>
            <div className="kpi-label">{t('kpi_avg_resolution_time')}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><CheckCircle2 size={22} /></div>
          <div>
            <div className="kpi-value">{kpis.citizenSatisfactionRating} / 5.0</div>
            <div className="kpi-label">{t('kpi_citizen_satisfaction')} ({kpis.citizenVerifiedPercent}% {t('kpi_verified_rate')})</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><Sparkles size={22} /></div>
          <div>
            <div className="kpi-value">{kpis.proactiveInspections}</div>
            <div className="kpi-label">{t('kpi_proactive_finds')}</div>
          </div>
        </div>
      </div>

      {/* Section 18: Computed Rule-Based Administrative Insights */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title">
            <Sparkles size={18} color="var(--primary-700)" />
            {t('insights_title')}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            {t('insights_subtitle')}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {insights.map((ins, idx) => (
            <div key={idx} className={`insight-alert ${ins.type}`}>
              <div style={{ marginTop: '2px' }}>
                {ins.type === 'CRITICAL' ? <AlertTriangle size={18} /> :
                 ins.type === 'WARNING' ? <Clock size={18} /> :
                 ins.type === 'PROACTIVE' ? <Sparkles size={18} /> :
                 <CheckCircle2 size={18} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{ins.title}</div>
                <div style={{ fontSize: '0.82rem', marginTop: '2px' }}>{ins.description}</div>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255,255,255,0.7)', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                {ins.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('assets')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem' }}>{t('card_asset_registry_title')}</h3>
              <p style={{ fontSize: '0.82rem', marginTop: '2px' }}>{t('card_asset_registry_desc')}</p>
            </div>
            <ArrowRight size={18} color="var(--primary-700)" />
          </div>
        </div>

        <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('recurring')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#6b21a8' }}>{t('card_recurring_title')}</h3>
              <p style={{ fontSize: '0.82rem', marginTop: '2px' }}>{t('card_recurring_desc')}</p>
            </div>
            <ArrowRight size={18} color="#6b21a8" />
          </div>
        </div>

        <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('inspection_mgmt')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem' }}>{t('card_audits_title')}</h3>
              <p style={{ fontSize: '0.82rem', marginTop: '2px' }}>{t('card_audits_desc')}</p>
            </div>
            <ArrowRight size={18} color="var(--primary-700)" />
          </div>
        </div>
      </div>
    </div>
  );
}
