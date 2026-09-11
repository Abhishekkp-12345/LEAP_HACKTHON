import React, { useState } from 'react';
import { Clock, MapPin, Eye, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import PriorityBadge from '../../components/PriorityBadge';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function MyIssues({ issues = [], user, onSelectIssue, onOpenVerifyModal, onReportClick }) {
  const [filter, setFilter] = useState('ALL');
  const { t } = useLanguage();

  const myIssues = issues.filter(i => {
    const isMine = i.reported_by_user_id === (user ? user.id : '');
    if (!isMine) return false;

    if (filter === 'ACTIVE') return !['RESOLVED', 'CLOSED'].includes(i.status);
    if (filter === 'RESOLVED') return ['RESOLVED', 'CITIZEN_VERIFICATION'].includes(i.status);
    if (filter === 'CLOSED') return i.status === 'CLOSED';
    return true;
  });

  const filterTabs = [
    { id: 'ALL', label: t('filter_all') },
    { id: 'ACTIVE', label: t('filter_active') },
    { id: 'RESOLVED', label: t('filter_resolved') },
    { id: 'CLOSED', label: t('filter_closed') }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>{t('my_issues_title')}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
            {t('my_issues_subtitle')}
          </p>
        </div>

        <button className="btn btn-primary" onClick={onReportClick}>
          {t('btn_report_issue')}
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            className={`btn btn-sm ${filter === tab.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {myIssues.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {myIssues.map(issue => (
            <div key={issue.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
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

                <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginBottom: '12px' }}>
                  {issue.description}
                </p>

                <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={13} />
                    {issue.location_text}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} />
                    {t('reported_on')} {new Date(issue.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--slate-100)' }}>
                  <StatusBadge status={issue.status} />

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(issue.status === 'RESOLVED' || issue.status === 'CITIZEN_VERIFICATION') && (
                      <button 
                        className="btn btn-accent btn-sm"
                        onClick={() => onOpenVerifyModal(issue)}
                      >
                        <CheckCircle2 size={13} />
                        {t('btn_verify')}
                      </button>
                    )}
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => onSelectIssue(issue.id)}
                    >
                      <Eye size={13} />
                      {t('btn_track')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--slate-500)' }}>
          <p>{t('no_issues_found')}</p>
        </div>
      )}
    </div>
  );
}
