import React, { useState } from 'react';
import { 
  MapPin, 
  Lightbulb, 
  Droplet, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  X, 
  ExternalLink,
  Layers
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { useLanguage } from '../context/LanguageContext';

export default function VillageMap({ assets = [], issues = [], onSelectAsset, onSelectIssue }) {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const { t, translateWard, translateDept } = useLanguage();

  // Filter assets
  const filteredAssets = assets.filter(a => {
    if (filterType === 'ALL') return true;
    if (filterType === 'RECURRING') return a.is_recurring_flag === 1;
    if (filterType === 'ISSUES') return a.active_issues_count > 0 || a.status !== 'WORKING';
    return a.asset_type === filterType;
  });

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Map Header Controls */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <MapPin color="var(--primary-700)" size={20} />
            {t('map_title')}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
            {t('map_subtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-sm ${filterType === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterType('ALL')}
          >
            {t('map_filter_all')} ({assets.length})
          </button>
          <button 
            className={`btn btn-sm ${filterType === 'ISSUES' ? 'btn-danger' : 'btn-outline'}`}
            onClick={() => setFilterType('ISSUES')}
          >
            {t('map_filter_issues')}
          </button>
          <button 
            className={`btn btn-sm ${filterType === 'RECURRING' ? 'btn-accent' : 'btn-outline'}`}
            onClick={() => setFilterType('RECURRING')}
          >
            {t('map_filter_recurring')}
          </button>
          <button 
            className={`btn btn-sm ${filterType === 'STREETLIGHT' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterType('STREETLIGHT')}
          >
            {t('cat_STREETLIGHT')}
          </button>
          <button 
            className={`btn btn-sm ${filterType === 'WATER_POINT' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterType('WATER_POINT')}
          >
            {t('cat_WATER_POINT')}
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', height: '540px', background: '#f8fafc', overflow: 'hidden' }}>
        {/* Interactive SVG Map Canvas */}
        <svg 
          viewBox="0 0 1000 600" 
          style={{ width: '100%', height: '100%', cursor: 'grab' }}
        >
          {/* Background Grid & Terrain */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="lakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
            <linearGradient id="ward1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0fdf4" />
              <stop offset="100%" stopColor="#e8f5e9" />
            </linearGradient>
            <linearGradient id="ward2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
          </defs>

          <rect width="1000" height="600" fill="url(#grid)" />

          {/* Ward 1: Kote & Temple Area (South West) */}
          <polygon 
            points="60,300 480,300 480,560 60,560" 
            fill="url(#ward1Grad)" 
            stroke="#cbd5e1" 
            strokeWidth="1.5" 
            strokeDasharray="6,4"
          />
          <text x="80" y="330" fill="#047857" fontWeight="700" fontSize="13">{translateWard('w-1').toUpperCase()}</text>

          {/* Ward 2: School & PHC Ward (North West) */}
          <polygon 
            points="60,40 480,40 480,290 60,290" 
            fill="url(#ward2Grad)" 
            stroke="#cbd5e1" 
            strokeWidth="1.5" 
            strokeDasharray="6,4"
          />
          <text x="80" y="70" fill="#b45309" fontWeight="700" fontSize="13">{translateWard('w-2').toUpperCase()}</text>

          {/* Ward 3: Market & Main Road (North East) */}
          <polygon 
            points="490,40 940,40 940,320 490,320" 
            fill="#f8fafc" 
            stroke="#cbd5e1" 
            strokeWidth="1.5" 
            strokeDasharray="6,4"
          />
          <text x="510" y="70" fill="#0369a1" fontWeight="700" fontSize="13">{translateWard('w-3').toUpperCase()}</text>

          {/* Ward 4: Colony & Lake Extension (South East) */}
          <polygon 
            points="490,330 940,330 940,560 490,560" 
            fill="#f0f9ff" 
            stroke="#cbd5e1" 
            strokeWidth="1.5" 
            strokeDasharray="6,4"
          />
          <text x="510" y="360" fill="#6d28d9" fontWeight="700" fontSize="13">{translateWard('w-4').toUpperCase()}</text>

          {/* Village Natural Feature: Honnur Kere (Lake) */}
          <path 
            d="M 680,380 Q 800,360 880,420 Q 920,490 820,530 Q 720,540 680,460 Z" 
            fill="url(#lakeGrad)" 
            stroke="#38bdf8" 
            strokeWidth="2" 
          />
          <text x="750" y="460" fill="#0369a1" fontWeight="700" fontSize="13">ಹೊನ್ನೂರು ಕೆರೆ (Honnur Lake)</text>

          {/* Major Village Roads */}
          <path d="M 60,295 L 940,295" stroke="#94a3b8" strokeWidth="7" fill="none" />
          <path d="M 60,295 L 940,295" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="10,8" fill="none" />
          <text x="320" y="285" fill="#475569" fontWeight="600" fontSize="11">Honnur Main Road</text>

          {/* School Connecting Road */}
          <path d="M 280,295 L 280,80" stroke="#cbd5e1" strokeWidth="5" fill="none" />
          <text x="290" y="190" fill="#64748b" fontWeight="600" fontSize="10" transform="rotate(90, 290, 190)">School Road</text>

          {/* Landmark Building: Govt Higher Primary School */}
          <rect x="230" y="90" width="100" height="60" rx="4" fill="#fed7aa" stroke="#f97316" strokeWidth="2" />
          <text x="240" y="115" fill="#7c2d12" fontWeight="700" fontSize="10">GOVT PRIMARY</text>
          <text x="240" y="130" fill="#7c2d12" fontWeight="700" fontSize="10">SCHOOL</text>

          {/* Landmark Building: Primary Health Centre */}
          <rect x="100" y="150" width="80" height="50" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
          <text x="110" y="175" fill="#991b1b" fontWeight="700" fontSize="9">PHC CLINIC</text>

          {/* Landmark: Sri Ranganatha Swamy Temple */}
          <rect x="160" y="380" width="90" height="60" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="175" y="410" fill="#92400e" fontWeight="700" fontSize="10">TEMPLE</text>

          {/* Landmark: Bus Stand & Market Shandy */}
          <rect x="580" y="120" width="110" height="60" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <text x="590" y="145" fill="#075985" fontWeight="700" fontSize="10">BUS STAND &</text>
          <text x="590" y="160" fill="#075985" fontWeight="700" fontSize="10">MARKET SHANDY</text>

          {/* Asset Markers */}
          {filteredAssets.map((asset) => {
            let x = 300;
            let y = 300;

            if (asset.id === 'SL-047') {
              x = 280; y = 160;
            } else if (asset.id === 'RD-002') {
              x = 280; y = 220;
            } else if (asset.id === 'DR-002') {
              x = 260; y = 140;
            } else if (asset.id === 'WT-003') {
              x = 340; y = 130;
            } else if (asset.id === 'SL-019') {
              x = 140; y = 140;
            } else if (asset.id === 'WT-002') {
              x = 200; y = 450;
            } else if (asset.id === 'SL-012') {
              x = 160; y = 370;
            } else if (asset.id === 'WT-001') {
              x = 540; y = 150;
            } else if (asset.id === 'PT-001') {
              x = 640; y = 190;
            } else if (asset.id === 'DR-001') {
              x = 610; y = 210;
            } else if (asset.id === 'SL-025') {
              x = 660; y = 140;
            } else if (asset.id === 'RD-001') {
              x = 750; y = 295;
            } else if (asset.id === 'SL-038') {
              x = 700; y = 370;
            } else if (asset.id === 'DR-003') {
              x = 780; y = 390;
            } else if (asset.id === 'PT-002') {
              x = 580; y = 440;
            } else if (asset.id === 'WT-004') {
              x = 600; y = 510;
            }

            const isSelected = selectedAsset && selectedAsset.id === asset.id;
            const hasIssue = asset.active_issues_count > 0 || asset.status !== 'WORKING';
            const isRecurring = asset.is_recurring_flag === 1;

            let markerColor = '#10b981';
            if (isRecurring) markerColor = '#8b5cf6';
            else if (asset.status === 'NEEDS_ATTENTION') markerColor = '#f59e0b';
            else if (hasIssue) markerColor = '#ef4444';

            return (
              <g 
                key={asset.id} 
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedAsset(asset)}
              >
                {(isRecurring || hasIssue) && (
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={isSelected ? "22" : "18"} 
                    fill={markerColor} 
                    opacity="0.3"
                  />
                )}

                <circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? "14" : "10"} 
                  fill={markerColor} 
                  stroke="#ffffff" 
                  strokeWidth="2.5" 
                />

                <text 
                  x={x} 
                  y={y - 14} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fontWeight="700" 
                  fill="#0f172a"
                  style={{ textShadow: '0 1px 3px rgba(255,255,255,0.9)' }}
                >
                  {asset.id}
                </text>

                {isRecurring && (
                  <text x={x + 12} y={y - 6} fontSize="12">⚠</text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(4px)',
          padding: '10px 14px',
          borderRadius: '8px',
          border: '1px solid var(--slate-200)',
          fontSize: '0.75rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--slate-700)', marginBottom: '2px' }}>{t('map_legend_title')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            <span>{t('map_legend_working')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            <span>{t('map_legend_issue')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6', display: 'inline-block' }}></span>
            <span>{t('map_legend_recurring')}</span>
          </div>
        </div>

        {/* Clicked Asset Detail Drawer */}
        {selectedAsset && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '320px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(8px)',
            borderRadius: '10px',
            border: '1px solid var(--slate-200)',
            boxShadow: 'var(--shadow-xl)',
            padding: '16px',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                  {selectedAsset.id}
                </span>
                <h4 style={{ margin: '2px 0', fontSize: '0.95rem' }}>{selectedAsset.name}</h4>
              </div>
              <button 
                className="btn btn-outline btn-sm" 
                style={{ padding: '2px 6px' }} 
                onClick={() => setSelectedAsset(null)}
              >
                <X size={14} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '10px' }}>
              {selectedAsset.location_description}
            </p>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              <StatusBadge status={selectedAsset.status} />
              {selectedAsset.is_recurring_flag === 1 && (
                <span className="badge badge-recurring">⚠ {t('kpi_recurring_assets')}</span>
              )}
            </div>

            {selectedAsset.recurring_notes && (
              <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', color: '#5b21b6', marginBottom: '12px' }}>
                {selectedAsset.recurring_notes}
              </div>
            )}

            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '12px' }}>
              <div>{t('th_department')}: <strong>{translateDept(selectedAsset.department_name)}</strong></div>
              <div>{t('th_cadence')}: <strong>{t('cadence_every')} {selectedAsset.inspection_frequency_days} {t('cadence_days')}</strong></div>
              <div>{t('th_failures')}: <strong>{selectedAsset.failure_count}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {onSelectAsset && (
                <button 
                  className="btn btn-primary btn-sm" 
                  style={{ flex: 1 }}
                  onClick={() => onSelectAsset(selectedAsset.id)}
                >
                  {t('btn_details')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
