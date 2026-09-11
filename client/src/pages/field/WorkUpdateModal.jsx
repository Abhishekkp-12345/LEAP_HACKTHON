import React, { useState } from 'react';
import { X, Wrench, Camera, CheckCircle2, Clock, Play, FileCheck } from 'lucide-react';
import { api } from '../../services/api';
import PriorityBadge from '../../components/PriorityBadge';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function WorkUpdateModal({ issue, onClose, onUpdated }) {
  const [progressNotes, setProgressNotes] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { t, translateWard } = useLanguage();

  if (!issue) return null;

  async function handleStartWork() {
    setSubmitting(true);
    try {
      await api.startWork(issue.id, progressNotes || 'Field staff arrived on site and commenced repair work.');
      onUpdated();
      onClose();
    } catch (e) {
      alert(e.error || 'Failed to start work');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddNote() {
    if (!progressNotes) return;
    setSubmitting(true);
    try {
      await api.addProgressNote(issue.id, progressNotes);
      onUpdated();
      onClose();
    } catch (e) {
      alert(e.error || 'Failed to add progress note');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMarkResolved() {
    if (!resolutionNotes) {
      alert('Please provide a brief description of the repair work completed.');
      return;
    }
    setSubmitting(true);
    try {
      await api.resolveIssue(issue.id, resolutionNotes, '/uploads/after-repair-evidence.jpg');
      onUpdated();
      onClose();
    } catch (e) {
      alert(e.error || 'Failed to mark resolved');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                {issue.id}
              </span>
              <PriorityBadge priority={issue.priority} score={issue.priority_score} />
              <StatusBadge status={issue.status} />
            </div>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem' }}>
              {issue.title}
            </h3>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Location & Details */}
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.82rem' }}>
          <div><strong>{t('report_location')}:</strong> {issue.location_text} ({translateWard(issue.ward_name)})</div>
          <div><strong>{t('report_step4')}:</strong> {issue.description}</div>
          <div><strong>{t('target_sla')}</strong> {new Date(issue.target_completion_date).toLocaleDateString()}</div>
        </div>

        {/* Action 1: Mark Work Started (if still ASSIGNED / REPORTED) */}
        {issue.status !== 'IN_PROGRESS' && issue.status !== 'RESOLVED' && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px', borderRadius: '8px', marginBottom: '18px' }}>
            <h4 style={{ color: '#065f46', fontSize: '0.92rem', marginBottom: '6px' }}>
              {t('btn_start_work')}
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#047857', marginBottom: '10px' }}>
              Letting the Panchayat and citizen know that work has officially started on site.
            </p>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={handleStartWork}
              disabled={submitting}
            >
              <Play size={14} />
              {t('btn_start_work')}
            </button>
          </div>
        )}

        {/* Action 2: Progress Notes & Evidence */}
        <div className="form-group">
          <label className="form-label">{t('btn_update_work')}</label>
          <textarea
            className="form-textarea"
            placeholder="e.g. Procured replacement 45W luminaire; replacing damaged cable conduit..."
            value={progressNotes}
            onChange={(e) => setProgressNotes(e.target.value)}
            style={{ minHeight: '60px' }}
          />
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--slate-600)', cursor: 'pointer' }}>
              <Camera size={15} color="var(--primary-700)" />
              {t('report_choose_photo')}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setBeforePhoto(e.target.files[0])} />
            </label>
            {beforePhoto && <span style={{ fontSize: '0.75rem', color: 'var(--primary-700)' }}>{t('report_photo_attached')}</span>}

            {issue.status === 'IN_PROGRESS' && (
              <button className="btn btn-outline btn-sm" onClick={handleAddNote} disabled={!progressNotes || submitting}>
                {t('btn_save')}
              </button>
            )}
          </div>
        </div>

        {/* Action 3: Mark Work Completed / RESOLVED */}
        <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '16px', marginTop: '16px' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--slate-900)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileCheck size={18} color="var(--primary-700)" />
            {t('btn_mark_resolved')}
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '10px' }}>
            Document final repair work and submit for citizen verification.
          </p>

          <textarea
            className="form-textarea"
            placeholder="Explain repairs completed (e.g. Replaced burnt capacitor with Philips LED fixture; line voltage tested stable at 230V)..."
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            required
            style={{ minHeight: '70px', marginBottom: '10px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--slate-600)', cursor: 'pointer' }}>
              <Camera size={15} color="var(--primary-700)" />
              {t('report_choose_photo')}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setAfterPhoto(e.target.files[0])} />
            </label>
            {afterPhoto && <span style={{ fontSize: '0.75rem', color: 'var(--primary-700)' }}>{t('report_photo_attached')}</span>}

            <button 
              className="btn btn-primary"
              onClick={handleMarkResolved}
              disabled={submitting}
            >
              <CheckCircle2 size={16} />
              {submitting ? t('report_submitting') : t('btn_mark_resolved')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
