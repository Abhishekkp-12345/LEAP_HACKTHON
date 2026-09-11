import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  UserCheck, 
  ShieldAlert, 
  RotateCcw, 
  Check 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function StatusBadge({ status }) {
  const { translateStatus } = useLanguage();

  let bg = '#f1f5f9';
  let color = '#475569';
  let border = '#cbd5e1';
  let Icon = Clock;

  switch (status) {
    case 'REPORTED':
      bg = '#f0fdf4'; color = '#15803d'; border = '#bbf7d0';
      Icon = Clock;
      break;
    case 'VERIFICATION_PENDING':
    case 'VERIFIED':
      bg = '#eff6ff'; color = '#1d4ed8'; border = '#bfdbfe';
      Icon = CheckCircle2;
      break;
    case 'ASSIGNED':
      bg = '#e0e7ff'; color = '#4338ca'; border = '#c7d2fe';
      Icon = UserCheck;
      break;
    case 'IN_PROGRESS':
    case 'INSPECTION':
      bg = '#fff7ed'; color = '#c2410c'; border = '#fed7aa';
      Icon = Wrench;
      break;
    case 'RESOLVED':
      bg = '#ecfdf5'; color = '#047857'; border = '#a7f3d0';
      Icon = CheckCircle2;
      break;
    case 'CITIZEN_VERIFICATION':
      bg = '#fef3c7'; color = '#b45309'; border = '#fde68a';
      Icon = UserCheck;
      break;
    case 'CLOSED':
      bg = '#f1f5f9'; color = '#334155'; border = '#cbd5e1';
      Icon = Check;
      break;
    case 'REOPENED':
      bg = '#fee2e2'; color = '#b91c1c'; border = '#fca5a5';
      Icon = RotateCcw;
      break;
    case 'ESCALATED':
      bg = '#fef2f2'; color = '#dc2626'; border = '#f87171';
      Icon = ShieldAlert;
      break;
    case 'WORKING':
      bg = '#f0fdf4'; color = '#15803d'; border = '#86efac';
      Icon = CheckCircle2;
      break;
    case 'NEEDS_ATTENTION':
      bg = '#fffbeb'; color = '#b45309'; border = '#fde68a';
      Icon = AlertCircle;
      break;
    case 'NOT_WORKING':
      bg = '#fef2f2'; color = '#b91c1c'; border = '#fca5a5';
      Icon = ShieldAlert;
      break;
    case 'RECURRING_FAILURE':
      bg = '#f5f3ff'; color = '#6b21a8'; border = '#ddd6fe';
      Icon = ShieldAlert;
      break;
    case 'COMPLETED':
      bg = '#ecfdf5'; color = '#047857'; border = '#a7f3d0';
      Icon = Check;
      break;
    default:
      break;
  }

  const label = translateStatus(status);

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        borderRadius: '9999px',
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`
      }}
    >
      <Icon size={11} />
      {label}
    </span>
  );
}
