import React, { useState } from 'react';
import {
  Users,
  MapPin,
  ClipboardCheck,
  Eye,
  AlertTriangle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import PriorityBadge from '../../components/PriorityBadge';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

const SURVEY_BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSeRrijgsuzn3QB0bv9fbntsJy8m3D46QPVX7pzqr7f4Juugbw/viewform?usp=pp_url&entry.88148858=';

const WARD_LABELS = {
  'w-1': 'Ward 1 — Kote & Temple Area',
  'w-2': 'Ward 2 — School & PHC',
  'w-3': 'Ward 3 — Market & Bus Stop',
  'w-4': 'Ward 4 — Colony & Lake',
};

export default function CommunityObserverDashboard({ issues = [], assets = [], onSelectIssue, onSelectAsset }) {
  const [activeSection, setActiveSection] = useState('overview');
  const { translateCategory } = useLanguage();

  const openIssues = issues.filter(i => i.status !== 'CLOSED');
  const closedIssues = issues.filter(i => i.status === 'CLOSED');
  const criticalIssues = issues.filter(i => i.priority === 'CRITICAL' && i.status !== 'CLOSED');
  const proactiveIssues = issues.filter(i => i.detection_source === 'SCHEDULED_INSPECTION');

  const wardSummary = Object.entries(WARD_LABELS).map(([wId, name]) => {
    const wardIssues = issues.filter(i => i.ward_id === wId);
    const wardAssets = assets.filter(a => a.ward_id === wId);
    return {
      id: wId,
      name,
      total: wardIssues.length,
      open: wardIssues.filter(i => i.status !== 'CLOSED').length,
      assets: wardAssets.length,
    };
  });

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'active', label: 'Active Issues' },
    { id: 'resolved', label: 'Resolved Issues' },
    { id: 'ward_summary', label: 'Ward Summary' },
  ];

  return (
    <div>
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Community Observer Portal • Honnur Gram Panchayat
            </span>
            <h2 style={{ marginTop: '4px', fontSize: '1.4rem', color: '#064e3b' }}>
              Namaskara, Panchayat Member
            </h2>
            <p style={{ margin: '4px 0 0 0', maxWidth: '620px', fontSize: '0.88rem', color: '#065f46' }}>
              This portal provides ward-level visibility into all active infrastructure issues,
              proactive monitoring data, and citizen feedback for Honnur Gram Panchayat.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '10px 16px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
            <Users size={20} color="#047857" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Role</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#065f46' }}>Community Observer / Ward Member</div>
            </div>
          </div>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-card warning">
          <div className="kpi-icon"><AlertTriangle size={22} /></div>
          <div>
            <div className="kpi-value">{openIssues.length}</div>
            <div className="kpi-label">Active Issues</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><AlertTriangle size={22} color="#dc2626" /></div>
          <div>
            <div className="kpi-value" style={{ color: '#dc2626' }}>{criticalIssues.length}</div>
            <div className="kpi-label">Critical Priority</div>
          </div>
        </div>
        <div className="kpi-card info">
          <div className="kpi-icon"><ClipboardCheck size={22} /></div>
          <div>
            <div className="kpi-value">{proactiveIssues.length}</div>
            <div className="kpi-label">Proactively Detected</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><CheckCircle2 size={22} /></div>
          <div>
            <div className="kpi-value">{closedIssues.length}</div>
            <div className="kpi-label">Resolved & Closed</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {sections.map(s => (
          <button
            key={s.id}
            className={`btn btn-sm ${activeSection === s.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title"><AlertTriangle size={17} color="#dc2626" /> Critical Issues Requiring Attention</div>
            </div>
            {criticalIssues.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', textAlign: 'center', padding: '24px 0' }}>
                No critical issues at this time.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {criticalIssues.slice(0, 5).map(issue => (
                  <div
                    key={issue.id}
                    style={{ padding: '10px', background: '#fff5f5', borderRadius: '8px', border: '1px solid #fecaca', cursor: 'pointer' }}
                    onClick={() => onSelectIssue(issue.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626' }}>{issue.id}</span>
                      <StatusBadge status={issue.status} />
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: '4px', color: '#1e293b' }}>{issue.title}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={11} /> {issue.location_text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title"><CheckCircle2 size={17} color="#047857" /> Recently Resolved Issues</div>
            </div>
            {closedIssues.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', textAlign: 'center', padding: '24px 0' }}>
                No resolved issues yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {closedIssues.slice(0, 5).map(issue => (
                  <div
                    key={issue.id}
                    style={{ padding: '10px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', cursor: 'pointer' }}
                    onClick={() => onSelectIssue(issue.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857' }}>{issue.id}</span>
                      <a
                        href={`${SURVEY_BASE}${encodeURIComponent(issue.id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.72rem', color: '#047857', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontWeight: 600 }}
                        onClick={e => e.stopPropagation()}
                      >
                        <ExternalLink size={11} /> Survey
                      </a>
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: '4px', color: '#1e293b' }}>{issue.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'active' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Eye size={17} /> All Active Infrastructure Issues</div>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{openIssues.length} issues</span>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>Category</th>
                  <th>Description & Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {openIssues.map(issue => (
                  <tr key={issue.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-800)', fontSize: '0.82rem' }}>{issue.id}</td>
                    <td style={{ fontSize: '0.82rem' }}>{translateCategory(issue.category)}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{issue.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={11} /> {issue.location_text}
                      </div>
                    </td>
                    <td><PriorityBadge priority={issue.priority} score={issue.priority_score} rationale={issue.priority_rationale} /></td>
                    <td><StatusBadge status={issue.status} /></td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => onSelectIssue(issue.id)}>
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {openIssues.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-500)' }}>
                      No active issues at this time.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'resolved' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><CheckCircle2 size={17} /> Resolved Issues — Citizen Survey Links</div>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{closedIssues.length} resolved</span>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.84rem', color: '#065f46' }}>
            Share the pre-filled survey link for each resolved issue with community members to gather public feedback on repair quality.
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Citizen Survey</th>
                </tr>
              </thead>
              <tbody>
                {closedIssues.map(issue => (
                  <tr key={issue.id}>
                    <td style={{ fontWeight: 700, color: '#047857', fontSize: '0.82rem' }}>{issue.id}</td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{issue.title}</td>
                    <td style={{ fontSize: '0.82rem' }}>{translateCategory(issue.category)}</td>
                    <td>
                      <a
                        href={`${SURVEY_BASE}${encodeURIComponent(issue.id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ExternalLink size={12} /> Open Survey ({issue.id})
                      </a>
                    </td>
                  </tr>
                ))}
                {closedIssues.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-500)' }}>
                      No resolved issues yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'ward_summary' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {wardSummary.map(ward => (
            <div key={ward.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ background: 'var(--primary-50)', borderRadius: '8px', padding: '8px', display: 'flex' }}>
                  <MapPin size={18} color="var(--primary-700)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--slate-900)' }}>{ward.name}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)' }}>Honnur Gram Panchayat</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                <div style={{ background: 'var(--slate-50)', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)' }}>{ward.total}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600 }}>Total Issues</div>
                </div>
                <div style={{ background: '#fff7ed', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c2410c' }}>{ward.open}</div>
                  <div style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: 600 }}>Active</div>
                </div>
                <div style={{ background: '#f0fdf4', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857' }}>{ward.assets}</div>
                  <div style={{ fontSize: '0.72rem', color: '#065f46', fontWeight: 600 }}>Assets</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
