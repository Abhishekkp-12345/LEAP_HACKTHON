import React from 'react';
import { X, Bell, CheckCheck, Clock, ShieldAlert, ArrowRight, CheckCircle2, ExternalLink, Wrench } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const GOOGLE_FORM_BASE =
  'https://docs.google.com/forms/d/e/1FAIpQLSeRrijgsuzn3QB0bv9fbntsJy8m3D46QPVX7pzqr7f4Juugbw/viewform?usp=pp_url&entry.88148858=';

export default function NotificationDrawer({ isOpen, onClose, notifications, onRefresh, onSelectIssue }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  async function handleMarkAllRead() {
    try {
      await api.markNotificationRead('all');
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  }

  function getNotifStyle(n) {
    if (n.type === 'VERIFICATION_REQUEST') {
      return {
        bg: n.is_read ? '#f0fdf4' : '#ecfdf5',
        border: '#6ee7b7',
        titleColor: '#065f46'
      };
    }
    if (n.type === 'ESCALATION' || n.title?.includes('⚠')) {
      return { bg: '#fef2f2', border: '#fca5a5', titleColor: '#991b1b' };
    }
    if (n.type === 'ASSIGNMENT') {
      return { bg: '#eff6ff', border: '#bfdbfe', titleColor: '#1e40af' };
    }
    return {
      bg: n.is_read ? 'var(--slate-50)' : 'var(--primary-50)',
      border: n.is_read ? 'var(--slate-200)' : 'var(--primary-100)',
      titleColor: 'var(--slate-900)'
    };
  }

  return (
    <div className="modal-backdrop" style={{ justifyContent: 'flex-end', padding: 0 }} onClick={onClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '420px',
          height: '100vh',
          maxHeight: '100vh',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--primary-700)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t('modal_notifications_title')}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleMarkAllRead}
              title="Mark all notifications as read"
            >
              <CheckCheck size={14} />
              {t('btn_read_all')}
            </button>
            <button className="btn btn-outline btn-sm" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '14px' }}>
          {t('modal_notifications_desc')}
        </p>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications && notifications.length > 0 ? (
            notifications.map((n) => {
              const style = getNotifStyle(n);
              const isVerification = n.type === 'VERIFICATION_REQUEST';
              const formUrl = n.issue_id ? `${GOOGLE_FORM_BASE}${encodeURIComponent(n.issue_id)}` : null;

              return (
                <div
                  key={n.id}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: style.bg,
                    border: `1px solid ${style.border}`,
                    position: 'relative'
                  }}
                >
                  {/* Special banner for resolved/verify notifications */}
                  {isVerification && (
                    <div style={{
                      background: '#047857',
                      color: '#fff',
                      borderRadius: '4px 4px 0 0',
                      padding: '4px 10px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <CheckCircle2 size={12} />
                      YOUR ISSUE HAS BEEN FIXED — ACTION REQUIRED
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: style.titleColor }}>
                      {n.title}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0, marginLeft: '8px' }}>
                      <Clock size={11} />
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--slate-700)', marginBottom: '8px', lineHeight: 1.4 }}>
                    {isVerification
                      ? `Your reported issue has been marked as resolved. Please verify if the problem is actually fixed.`
                      : n.message}
                  </p>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {n.issue_id && (
                      <button
                        className="btn btn-outline btn-sm"
                        style={{
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          background: isVerification ? '#047857' : '#fff',
                          color: isVerification ? '#fff' : undefined,
                          border: isVerification ? '1px solid #047857' : undefined,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onClick={() => {
                          onClose();
                          if (onSelectIssue) onSelectIssue(n.issue_id);
                        }}
                      >
                        {isVerification ? <CheckCircle2 size={12} /> : <ArrowRight size={12} />}
                        {isVerification ? 'Verify & Give Feedback' : `${t('btn_track')} ${n.issue_id}`}
                      </button>
                    )}

                    {/* Google Form quick-link for verification notifications */}
                    {isVerification && formUrl && (
                      <a
                        href={formUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.72rem',
                          padding: '4px 10px',
                          background: '#fff',
                          border: '1px solid #34d399',
                          color: '#047857',
                          borderRadius: '6px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={11} />
                        Official Feedback Form
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--slate-400)' }}>
              <Bell size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p>{t('modal_no_notifications')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
