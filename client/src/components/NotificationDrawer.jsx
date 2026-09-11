import React from 'react';
import { X, Bell, CheckCheck, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

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
            notifications.map((n) => (
              <div 
                key={n.id}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: n.is_read ? 'var(--slate-50)' : 'var(--primary-50)',
                  border: `1px solid ${n.is_read ? 'var(--slate-200)' : 'var(--primary-100)'}`,
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span style={{ 
                    fontWeight: 700, 
                    fontSize: '0.85rem', 
                    color: n.type === 'ESCALATION' ? 'var(--priority-critical)' : 'var(--slate-900)' 
                  }}>
                    {n.title}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} />
                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--slate-700)', marginBottom: '8px', lineHeight: 1.4 }}>
                  {n.message}
                </p>

                {n.issue_id && (
                  <button 
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#fff' }}
                    onClick={() => {
                      onClose();
                      if (onSelectIssue) onSelectIssue(n.issue_id);
                    }}
                  >
                    {t('btn_track')} {n.issue_id}
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            ))
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
