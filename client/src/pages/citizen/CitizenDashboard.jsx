import React from 'react';
import {
  FilePlus,
  CheckCircle2,
  Clock,
  MapPin,
  Wrench,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  PartyPopper
} from 'lucide-react';
import PriorityBadge from '../../components/PriorityBadge';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

const SURVEY_FORM_BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSeRrijgsuzn3QB0bv9fbntsJy8m3D46QPVX7pzqr7f4Juugbw/viewform?usp=pp_url&entry.88148858=';

export default function CitizenDashboard({
  user,
  issues = [],
  onReportClick,
  onSelectIssue,
  onOpenVerifyModal
}) {
  const { t, translateCategory, translateSource } = useLanguage();

  const myIssues = issues.filter(i => i.reported_by_user_id === (user ? user.id : ''));

  const pendingVerificationIssues = issues.filter(i =>
    (i.status === 'RESOLVED' || i.status === 'CITIZEN_VERIFICATION') &&
    (i.reported_by_user_id === (user ? user.id : '') || i.ward_id === (user ? user.ward_id : 'w-2'))
  );

  const recentlyClosedByMe = myIssues
    .filter(i => i.status === 'CLOSED')
    .slice(0, 1);

  return (
    <div>
      {pendingVerificationIssues.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          border: '1px solid #f59e0b',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#f59e0b', color: '#fff', borderRadius: '50%', padding: '8px', display: 'flex' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#92400e', fontSize: '1rem' }}>
                {t('verification_req_banner_title')} ({pendingVerificationIssues.length})
              </h4>
              <p style={{ margin: '2px 0 0 0', color: '#78350f', fontSize: '0.85rem' }}>
                {t('verification_req_banner_desc')} (<strong>{pendingVerificationIssues[0].id}</strong>)
              </p>
            </div>
          </div>
          <button
            className="btn btn-accent btn-sm"
            style={{ fontWeight: 700, padding: '8px 16px' }}
            onClick={() => onOpenVerifyModal(pendingVerificationIssues[0])}
          >
            {t('verify_now_btn')}
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {recentlyClosedByMe.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
          border: '1.5px solid #6ee7b7',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ background: '#047857', color: '#fff', borderRadius: '50%', padding: '10px', display: 'flex', flexShrink: 0 }}>
                <PartyPopper size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#064e3b', fontSize: '1.05rem', fontWeight: 700 }}>
                  Issue Resolved & Closed — Thank You!
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#065f46' }}>
                  Your reported issue <strong>{recentlyClosedByMe[0].id}</strong> has been repaired and verified.
                  Help us improve by filling out the official satisfaction survey below.
                </p>
                <div style={{ marginTop: '10px', padding: '10px 14px', background: '#fff', borderRadius: '8px', border: '1px solid #a7f3d0', fontSize: '0.82rem', color: '#047857' }}>
                  <strong>Issue:</strong> {recentlyClosedByMe[0].title}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
              <a
                href={`${SURVEY_FORM_BASE}${encodeURIComponent(recentlyClosedByMe[0].id)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, padding: '10px 18px', background: '#047857', borderColor: '#047857' }}
              >
                <ExternalLink size={14} />
                Fill Satisfaction Survey
              </a>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', textAlign: 'center' }}>
                (Pre-filled: {recentlyClosedByMe[0].id})
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--white), var(--slate-50))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('role_citizen_desc')}
            </span>
            <h2 style={{ marginTop: '4px', fontSize: '1.4rem' }}>
              {t('citizen_welcome_title')}, {user ? user.name : 'Resident'}
            </h2>
            <p style={{ margin: '4px 0 0 0', maxWidth: '600px' }}>
              {t('citizen_welcome_desc')}
            </p>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={onReportClick}
            style={{ boxShadow: '0 4px 10px rgba(6, 78, 59, 0.25)' }}
          >
            <FilePlus size={18} />
            {t('btn_report_issue')}
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">
            <Clock size={22} />
          </div>
          <div>
            <div className="kpi-value">{myIssues.length}</div>
            <div className="kpi-label">{t('kpi_issues_you_reported')}</div>
          </div>
        </div>

        <div className="kpi-card info">
          <div className="kpi-icon">
            <Wrench size={22} />
          </div>
          <div>
            <div className="kpi-value">
              {issues.filter(i => i.status === 'IN_PROGRESS').length}
            </div>
            <div className="kpi-label">{t('kpi_repairs_progress')}</div>
          </div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-icon">
            <AlertCircle size={22} />
          </div>
          <div>
            <div className="kpi-value">{pendingVerificationIssues.length}</div>
            <div className="kpi-label">{t('kpi_pending_verification')}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="kpi-value">
              {issues.filter(i => i.status === 'CLOSED').length}
            </div>
            <div className="kpi-label">{t('kpi_verified_closed')}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <MapPin size={18} color="var(--primary-700)" />
            {t('activity_title')}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            {t('activity_sub')}
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('table_issue_id')}</th>
                <th>{t('table_category')}</th>
                <th>{t('table_desc_location')}</th>
                <th>{t('table_detection_source')}</th>
                <th>{t('table_priority')}</th>
                <th>{t('table_current_status')}</th>
                <th>{t('table_action')}</th>
              </tr>
            </thead>
            <tbody>
              {issues.slice(0, 7).map((issue) => (
                <tr key={issue.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary-800)' }}>
                    {issue.id}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                      {translateCategory(issue.category)}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{issue.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={11} />
                      {issue.location_text}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.72rem',
                      background: issue.detection_source === 'SCHEDULED_INSPECTION' ? 'var(--primary-50)' : 'var(--slate-100)',
                      color: issue.detection_source === 'SCHEDULED_INSPECTION' ? 'var(--primary-700)' : 'var(--slate-600)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      {translateSource(issue.detection_source)}
                    </span>
                  </td>
                  <td>
                    <PriorityBadge
                      priority={issue.priority}
                      score={issue.priority_score}
                      rationale={issue.priority_rationale}
                    />
                  </td>
                  <td>
                    <StatusBadge status={issue.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onSelectIssue(issue.id)}
                      >
                        {t('btn_track')}
                      </button>
                      {(issue.status === 'RESOLVED' || issue.status === 'CITIZEN_VERIFICATION') && (
                        <button
                          className="btn btn-accent btn-sm"
                          onClick={() => onOpenVerifyModal(issue)}
                        >
                          {t('btn_verify')}
                        </button>
                      )}
                      {issue.status === 'CLOSED' && (
                        <a
                          href={`${SURVEY_FORM_BASE}${encodeURIComponent(issue.id)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#047857', border: '1px solid #34d399' }}
                        >
                          <ExternalLink size={11} /> Survey
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
