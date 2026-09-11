import React from 'react';
import { Check, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LifecycleStepper({ status }) {
  const { t, translateStatus } = useLanguage();

  const LIFECYCLE_STEPS = [
    { key: 'REPORTED', label: translateStatus('REPORTED') },
    { key: 'ASSIGNED', label: translateStatus('ASSIGNED') },
    { key: 'IN_PROGRESS', label: translateStatus('IN_PROGRESS') },
    { key: 'RESOLVED', label: translateStatus('RESOLVED') },
    { key: 'CLOSED', label: t('kpi_verified_rate') || translateStatus('CLOSED') }
  ];

  // Map complex statuses to 5 standard steps
  let activeIndex = 0;
  if (status === 'REPORTED' || status === 'VERIFICATION_PENDING' || status === 'VERIFIED') {
    activeIndex = 0;
  } else if (status === 'ASSIGNED') {
    activeIndex = 1;
  } else if (status === 'IN_PROGRESS' || status === 'INSPECTION') {
    activeIndex = 2;
  } else if (status === 'RESOLVED' || status === 'CITIZEN_VERIFICATION') {
    activeIndex = 3;
  } else if (status === 'CLOSED') {
    activeIndex = 4;
  } else if (status === 'REOPENED') {
    activeIndex = 2;
  } else if (status === 'ESCALATED') {
    activeIndex = 1;
  }

  const fillPercent = (activeIndex / (LIFECYCLE_STEPS.length - 1)) * 100;

  return (
    <div style={{ margin: '20px 0' }}>
      {status === 'REOPENED' && (
        <div style={{ 
          background: '#fee2e2', 
          border: '1px solid #fca5a5', 
          borderRadius: '6px', 
          padding: '8px 12px', 
          marginBottom: '14px', 
          fontSize: '0.8rem', 
          color: '#b91c1c', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px' 
        }}>
          <AlertTriangle size={15} />
          <strong>{t('status_REOPENED')}:</strong> Issue returned to field staff for rework.
        </div>
      )}

      {status === 'ESCALATED' && (
        <div style={{ 
          background: '#fef2f2', 
          border: '1px solid #f87171', 
          borderRadius: '6px', 
          padding: '8px 12px', 
          marginBottom: '14px', 
          fontSize: '0.8rem', 
          color: '#dc2626', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px' 
        }}>
          <AlertTriangle size={15} />
          <strong>{t('status_ESCALATED')}:</strong> Overdue past target time. Under administrative review.
        </div>
      )}

      <div className="stepper-container">
        <div className="stepper-progress-line">
          <div className="stepper-progress-fill" style={{ width: `${fillPercent}%` }} />
        </div>

        {LIFECYCLE_STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex || status === 'CLOSED';
          const isCurrent = idx === activeIndex && status !== 'CLOSED';

          let nodeClass = 'step-item';
          if (isCompleted) nodeClass += ' completed';
          if (isCurrent) nodeClass += ' current';

          return (
            <div key={step.key} className={nodeClass}>
              <div className="step-node">
                {isCompleted ? <Check size={14} /> : idx + 1}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
