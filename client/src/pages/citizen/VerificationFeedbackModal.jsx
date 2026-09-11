import React, { useState } from 'react';
import { X, CheckCircle2, RotateCcw, Star, ExternalLink, PartyPopper } from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const SURVEY_FORM_BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSeRrijgsuzn3QB0bv9fbntsJy8m3D46QPVX7pzqr7f4Juugbw/viewform?usp=pp_url&entry.88148858=';

export default function VerificationFeedbackModal({ issue, onClose, onVerified }) {
  const [isResolvedConfirmed, setIsResolvedConfirmed] = useState(true);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();

  if (!issue) return null;

  const surveyUrl = `${SURVEY_FORM_BASE}${encodeURIComponent(issue.id)}`;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.verifyResolution(issue.id, {
        isResolvedConfirmed,
        rating: isResolvedConfirmed ? rating : 1,
        comments,
        feedbackSource: 'INTERNAL_FORM'
      });
      onVerified();
      onClose();
    } catch (err) {
      alert('Failed to record verification: ' + (err.error || 'Server error'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-700)' }}>
              {t('kpi_citizen_satisfaction')} • {issue.id}
            </span>
            <h3 style={{ margin: '3px 0 0 0', fontSize: '1.2rem' }}>
              {t('modal_verify_title')}
            </h3>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
          <div><strong>{t('report_step3')}:</strong> {issue.title}</div>
          <div style={{ color: 'var(--slate-500)', marginTop: '2px' }}><strong>{t('report_location')}:</strong> {issue.location_text}</div>
          {issue.resolution_notes && (
            <div style={{ marginTop: '8px', color: '#047857', background: '#ecfdf5', padding: '8px', borderRadius: '6px' }}>
              <strong>{t('btn_mark_resolved')}:</strong> {issue.resolution_notes}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.95rem' }}>
              {t('modal_verify_question')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                className="btn"
                style={{
                  padding: '14px',
                  background: isResolvedConfirmed ? 'var(--primary-50)' : '#fff',
                  border: `2px solid ${isResolvedConfirmed ? 'var(--primary-700)' : 'var(--slate-200)'}`,
                  color: isResolvedConfirmed ? 'var(--primary-900)' : 'var(--slate-700)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => setIsResolvedConfirmed(true)}
              >
                <CheckCircle2 size={18} color="var(--primary-700)" />
                {t('btn_yes_fixed')}
              </button>

              <button
                type="button"
                className="btn"
                style={{
                  padding: '14px',
                  background: !isResolvedConfirmed ? '#fee2e2' : '#fff',
                  border: `2px solid ${!isResolvedConfirmed ? '#dc2626' : 'var(--slate-200)'}`,
                  color: !isResolvedConfirmed ? '#991b1b' : 'var(--slate-700)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => setIsResolvedConfirmed(false)}
              >
                <RotateCcw size={18} color="#dc2626" />
                {t('btn_no_not_fixed')}
              </button>
            </div>
          </div>

          {isResolvedConfirmed ? (
            <>
              <div className="form-group" style={{ textAlign: 'center', margin: '20px 0' }}>
                <label className="form-label">{t('modal_rating_label')}</label>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: star <= rating ? '#f59e0b' : '#cbd5e1',
                        padding: '4px'
                      }}
                      onClick={() => setRating(star)}
                    >
                      <Star size={28} fill={star <= rating ? '#f59e0b' : 'none'} />
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                  {rating === 5 ? 'Excellent / ಅತ್ಯುತ್ತಮ' : rating === 4 ? 'Good / ಉತ್ತಮ' : rating === 3 ? 'Average / ಸಾಧಾರಣ' : 'Needs Improvement / ಸುಧಾರಣೆ ಅಗತ್ಯ'}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">{t('modal_comments_label')}</label>
                <textarea
                  className="form-textarea"
                  placeholder={t('modal_comments_placeholder')}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  style={{ minHeight: '60px' }}
                />
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                border: '1.5px solid #6ee7b7',
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <PartyPopper size={16} color="#047857" />
                  <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#065f46' }}>
                    Also share your official feedback via Google Form
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#047857', margin: '0 0 10px 0' }}>
                  Help us improve Honnur GP services by completing the official satisfaction survey for <strong>{issue.id}</strong>.
                </p>
                <a
                  href={surveyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ background: '#fff', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#047857', border: '1.5px solid #34d399', fontWeight: 700 }}
                >
                  <ExternalLink size={13} />
                  Open Official Survey — {issue.id}
                </a>
              </div>
            </>
          ) : (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.88rem', color: '#991b1b', marginBottom: '6px' }}>
                {t('modal_reopen_why')}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#7f1d1d', marginBottom: '8px' }}>
                {t('modal_reopen_warning')}
              </p>
              <textarea
                className="form-textarea"
                placeholder={t('modal_reopen_placeholder')}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
                style={{ borderColor: '#fca5a5' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              {t('btn_cancel')}
            </button>
            <button
              type="submit"
              className={`btn ${isResolvedConfirmed ? 'btn-primary' : 'btn-danger'}`}
              disabled={submitting}
            >
              {submitting ? t('report_submitting') : isResolvedConfirmed ? t('btn_confirm_close') : t('btn_reopen_issue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
