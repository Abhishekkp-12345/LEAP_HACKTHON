import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  UserCheck,
  Play,
  CheckCircle2,
  RefreshCw,
  Filter,
  Search,
  MapPin,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
  Wrench,
  Bell
} from 'lucide-react';
import { api } from '../../services/api';
import PriorityBadge from '../../components/PriorityBadge';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

const GOOGLE_FORM_BASE =
  'https://docs.google.com/forms/d/e/1FAIpQLSeRrijgsuzn3QB0bv9fbntsJy8m3D46QPVX7pzqr7f4Juugbw/viewform?usp=pp_url&entry.88148858=';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'REPORTED', label: 'Reported' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'REOPENED', label: 'Reopened' },
  { value: 'ESCALATED', label: 'Escalated' }
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' }
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'STREETLIGHT', label: 'Streetlight' },
  { value: 'WATER_POINT', label: 'Water Point' },
  { value: 'PUBLIC_TOILET', label: 'Public Toilet' },
  { value: 'ROAD', label: 'Road' },
  { value: 'DRAINAGE', label: 'Drainage' }
];

export default function IssueManagement({ onSelectIssue }) {
  const [issues, setIssues] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  // Per-issue assignment state
  const [assignMap, setAssignMap] = useState({});   // { issueId: staffId }
  const [noteMap, setNoteMap] = useState({});        // { issueId: notes }
  const [resolutionMap, setResolutionMap] = useState({}); // { issueId: resolutionText }

  const { t, translateWard } = useLanguage();

  useEffect(() => {
    loadData();
  }, [filterStatus, filterPriority, filterCategory]);

  async function loadData() {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      if (filterCategory) params.category = filterCategory;
      if (search) params.search = search;

      const [issuesRes, metaRes] = await Promise.all([
        api.getIssues(params),
        api.getMetadata()
      ]);
      setIssues(issuesRes || []);
      setStaffList(metaRes.staff || []);
    } catch (e) {
      console.error('IssueManagement loadData error:', e);
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleAssign(issueId) {
    const staffId = assignMap[issueId];
    if (!staffId) { showToast('Please select a staff member first.', 'error'); return; }
    setActionLoading(`assign-${issueId}`);
    try {
      await api.assignIssue(issueId, staffId, noteMap[issueId] || '');
      showToast(`Issue ${issueId} successfully assigned! Staff notified.`);
      await loadData();
    } catch (e) {
      showToast(e.error || 'Failed to assign issue.', 'error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleMarkProcessing(issueId) {
    setActionLoading(`processing-${issueId}`);
    try {
      await api.startWork(issueId, noteMap[issueId] || 'PDO marked issue as In Progress.');
      showToast(`Issue ${issueId} marked as In Progress. Citizen notified.`);
      await loadData();
    } catch (e) {
      showToast(e.error || 'Failed to update status.', 'error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleMarkFixed(issueId, issue) {
    const resNotes = resolutionMap[issueId];
    if (!resNotes) {
      showToast('Please describe the fix applied before marking as fixed.', 'error');
      return;
    }
    setActionLoading(`fixed-${issueId}`);
    try {
      await api.resolveIssue(issueId, resNotes);
      showToast(`✅ Issue ${issueId} marked Fixed! Citizen has been notified to verify & give feedback.`);
      await loadData();
      setExpandedId(null);
    } catch (e) {
      showToast(e.error || 'Failed to mark as fixed.', 'error');
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = issues.filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.id?.toLowerCase().includes(q) ||
      i.title?.toLowerCase().includes(q) ||
      i.location_text?.toLowerCase().includes(q)
    );
  });

  const openCount = issues.filter(i => !['CLOSED', 'RESOLVED'].includes(i.status)).length;
  const unresolvedCritical = issues.filter(i => i.priority === 'CRITICAL' && !['CLOSED', 'RESOLVED'].includes(i.status)).length;

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          background: toast.type === 'error' ? '#fef2f2' : '#ecfdf5',
          border: `1px solid ${toast.type === 'error' ? '#f87171' : '#6ee7b7'}`,
          color: toast.type === 'error' ? '#991b1b' : '#065f46',
          padding: '12px 20px', borderRadius: '10px', maxWidth: '380px',
          fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #fff, #f0f9ff)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-700)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              PDO Control Panel
            </span>
            <h2 style={{ marginTop: '2px', fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardList size={22} color="var(--primary-700)" />
              Issue Management
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              Assign issues to field staff, track progress, and mark resolved to notify citizens.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ea580c' }}>{openCount}</div>
              <div style={{ fontSize: '0.7rem', color: '#9a3412', fontWeight: 600 }}>Open Issues</div>
            </div>
            {unresolvedCritical > 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '8px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626' }}>{unresolvedCritical}</div>
                <div style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: 600 }}>Critical Pending</div>
              </div>
            )}
            <button className="btn btn-outline btn-sm" onClick={loadData}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: '32px', height: '36px' }}
            placeholder="Search by Issue ID, title, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadData()}
          />
        </div>

        <select className="form-select" style={{ height: '36px', minWidth: '150px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select className="form-select" style={{ height: '36px', minWidth: '140px' }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select className="form-select" style={{ height: '36px', minWidth: '150px' }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <button className="btn btn-primary btn-sm" onClick={loadData}>
          <Filter size={14} />
          Apply
        </button>
      </div>

      {/* Issue List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>
          Loading issues...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>
          <ClipboardList size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p>No issues found matching your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(issue => {
            const isExpanded = expandedId === issue.id;
            const isResolved = ['RESOLVED', 'CLOSED'].includes(issue.status);
            const formUrl = `${GOOGLE_FORM_BASE}${encodeURIComponent(issue.id)}`;

            return (
              <div
                key={issue.id}
                style={{
                  border: `1px solid ${issue.priority === 'CRITICAL' ? '#fca5a5' : 'var(--slate-200)'}`,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: issue.priority === 'CRITICAL' ? '#fffaf9' : '#fff',
                  boxShadow: isExpanded ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
                  transition: 'box-shadow 0.2s'
                }}
              >
                {/* Issue Row (always visible) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '12px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    alignItems: 'center'
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                >
                  <div style={{ minWidth: 0 }}>
                    {/* Top row: ID + badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-700)' }}>{issue.id}</span>
                      <PriorityBadge priority={issue.priority} score={issue.priority_score} />
                      <StatusBadge status={issue.status} />
                      {issue.assigned_staff_name && (
                        <span style={{
                          fontSize: '0.72rem', background: '#e0e7ff', color: '#3730a3',
                          borderRadius: '9999px', padding: '2px 8px', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: '4px'
                        }}>
                          <UserCheck size={11} />
                          {issue.assigned_staff_name}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--slate-900)', marginBottom: '4px' }}>
                      {issue.title}
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: 'var(--slate-500)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {issue.location_text}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> SLA: {new Date(issue.target_completion_date).toLocaleDateString()}
                      </span>
                      {issue.category && (
                        <span style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>
                          {issue.category.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand toggle + view button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {isResolved && (
                      <a
                        href={formUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem', color: '#047857', border: '1px solid #34d399', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ExternalLink size={12} />
                        Feedback Form
                      </a>
                    )}
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={e => { e.stopPropagation(); onSelectIssue(issue.id); }}
                    >
                      View
                    </button>
                    {isExpanded ? <ChevronUp size={18} color="var(--slate-400)" /> : <ChevronDown size={18} color="var(--slate-400)" />}
                  </div>
                </div>

                {/* Expanded Action Panel */}
                {isExpanded && (
                  <div style={{
                    borderTop: '1px solid var(--slate-100)',
                    background: 'linear-gradient(to bottom, #f8fafc, #fff)',
                    padding: '16px'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

                      {/* ACTION 1: Assign / Reassign */}
                      <div style={{ background: '#fff', border: '1px solid #e0e7ff', borderRadius: '8px', padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                          <UserCheck size={16} color="#4338ca" />
                          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#312e81' }}>
                            {issue.assigned_staff_name ? 'Reassign Staff' : 'Assign to Staff'}
                          </span>
                        </div>
                        {issue.assigned_staff_name && (
                          <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '8px' }}>
                            Currently: <strong>{issue.assigned_staff_name}</strong> ({issue.assigned_staff_designation})
                          </p>
                        )}
                        <select
                          className="form-select"
                          style={{ marginBottom: '8px', fontSize: '0.82rem' }}
                          value={assignMap[issue.id] || ''}
                          onChange={e => setAssignMap(prev => ({ ...prev, [issue.id]: e.target.value }))}
                        >
                          <option value="">— Select Field Staff —</option>
                          {staffList.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.designation})
                            </option>
                          ))}
                        </select>
                        <input
                          className="form-input"
                          style={{ marginBottom: '8px', fontSize: '0.82rem' }}
                          placeholder="Assignment note (optional)"
                          value={noteMap[issue.id] || ''}
                          onChange={e => setNoteMap(prev => ({ ...prev, [issue.id]: e.target.value }))}
                        />
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ background: '#4338ca', width: '100%', justifyContent: 'center' }}
                          onClick={() => handleAssign(issue.id)}
                          disabled={actionLoading === `assign-${issue.id}` || !assignMap[issue.id]}
                        >
                          <UserCheck size={14} />
                          {actionLoading === `assign-${issue.id}` ? 'Assigning...' : 'Assign & Notify Staff'}
                        </button>
                      </div>

                      {/* ACTION 2: Mark Processing */}
                      {!isResolved && issue.status !== 'IN_PROGRESS' && (
                        <div style={{ background: '#fff', border: '1px solid #fed7aa', borderRadius: '8px', padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                            <Play size={16} color="#ea580c" />
                            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#c2410c' }}>Mark as Processing</span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#92400e', marginBottom: '10px' }}>
                            Notify citizen that work has started on their issue.
                          </p>
                          <button
                            className="btn btn-sm"
                            style={{ background: '#ea580c', color: '#fff', width: '100%', justifyContent: 'center', border: 'none' }}
                            onClick={() => handleMarkProcessing(issue.id)}
                            disabled={actionLoading === `processing-${issue.id}`}
                          >
                            <Wrench size={14} />
                            {actionLoading === `processing-${issue.id}` ? 'Updating...' : 'Mark In Progress'}
                          </button>
                        </div>
                      )}

                      {/* ACTION 3: Mark Fixed */}
                      {!isResolved && (
                        <div style={{ background: '#fff', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                            <CheckCircle2 size={16} color="#047857" />
                            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#065f46' }}>Mark as Fixed</span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#047857', marginBottom: '8px' }}>
                            Citizen will receive a notification with a <strong>Google Form feedback link</strong> to verify the fix.
                          </p>
                          <textarea
                            className="form-textarea"
                            style={{ minHeight: '60px', marginBottom: '8px', fontSize: '0.82rem', borderColor: '#a7f3d0' }}
                            placeholder="Describe what was fixed (e.g. Replaced faulty transformer, restored water supply)..."
                            value={resolutionMap[issue.id] || ''}
                            onChange={e => setResolutionMap(prev => ({ ...prev, [issue.id]: e.target.value }))}
                            required
                          />
                          {/* Preview feedback form link */}
                          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#047857' }}>
                            <Bell size={12} />
                            Citizen will also receive a link to:
                            <a href={formUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#047857', fontWeight: 700 }}>
                              Official Feedback Form ↗
                            </a>
                          </div>
                          <button
                            className="btn btn-sm"
                            style={{ background: '#047857', color: '#fff', width: '100%', justifyContent: 'center', border: 'none' }}
                            onClick={() => handleMarkFixed(issue.id, issue)}
                            disabled={actionLoading === `fixed-${issue.id}` || !resolutionMap[issue.id]}
                          >
                            <CheckCircle2 size={14} />
                            {actionLoading === `fixed-${issue.id}` ? 'Submitting...' : '✓ Mark Fixed & Notify Citizen'}
                          </button>
                        </div>
                      )}

                      {/* Resolved state info */}
                      {isResolved && (
                        <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '14px', gridColumn: '1 / -1' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <CheckCircle2 size={18} color="#047857" />
                            <span style={{ fontWeight: 700, color: '#065f46', fontSize: '0.92rem' }}>
                              Issue Resolved — Awaiting Citizen Verification
                            </span>
                          </div>
                          {issue.resolution_notes && (
                            <p style={{ fontSize: '0.82rem', color: '#047857', margin: '0 0 10px' }}>
                              <strong>Resolution:</strong> {issue.resolution_notes}
                            </p>
                          )}
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <a
                              href={formUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm"
                              style={{ background: '#fff', border: '1.5px solid #34d399', color: '#065f46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}
                            >
                              <ExternalLink size={13} />
                              View Google Feedback Form — {issue.id}
                            </a>
                            <button className="btn btn-outline btn-sm" onClick={() => onSelectIssue(issue.id)}>
                              View Full Timeline
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer legend */}
      <div style={{ marginTop: '24px', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--slate-500)', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <span><strong>Flow:</strong></span>
        <span>📋 Report → 👤 Assign → ▶ Processing → ✅ Mark Fixed → 🔔 Citizen Notified → 📝 Google Form Feedback</span>
      </div>
    </div>
  );
}
