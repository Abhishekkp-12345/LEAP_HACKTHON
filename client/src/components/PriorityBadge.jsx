import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PriorityBadge({ priority, score, rationale }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { translatePriority, t } = useLanguage();

  let badgeClass = 'badge-low';
  let Icon = Info;

  if (priority === 'CRITICAL') {
    badgeClass = 'badge-critical';
    Icon = AlertTriangle;
  } else if (priority === 'HIGH') {
    badgeClass = 'badge-high';
    Icon = AlertCircle;
  } else if (priority === 'MEDIUM') {
    badgeClass = 'badge-medium';
    Icon = Info;
  }

  const translatedPriority = translatePriority(priority);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span 
        className={`badge ${badgeClass}`}
        style={{ cursor: rationale ? 'help' : 'default', userSelect: 'none' }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        title={rationale || `${translatedPriority}`}
      >
        <Icon size={12} />
        {translatedPriority}
        {score !== undefined && score !== null && (
          <span style={{ opacity: 0.8, fontSize: '0.68rem', marginLeft: '3px' }}>
            ({score})
          </span>
        )}
      </span>

      {/* Transparent Rationale Popover */}
      {showTooltip && rationale && (
        <div 
          style={{
            position: 'absolute',
            bottom: '125%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--slate-900)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            width: '260px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            lineHeight: 1.35,
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '3px', color: 'var(--accent-gold)' }}>
            {t('priority_rationale_title')}
          </div>
          {rationale}
        </div>
      )}
    </div>
  );
}
