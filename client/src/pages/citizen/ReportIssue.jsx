import React, { useState } from 'react';
import { 
  FilePlus, 
  Camera, 
  MapPin, 
  Lightbulb, 
  Droplet, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function ReportIssue({ assets = [], onSuccess, onCancel }) {
  const { t, translateCategory, translateWard, translatePriority } = useLanguage();

  const [category, setCategory] = useState('STREETLIGHT');
  const [wardId, setWardId] = useState('w-2');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [landmark, setLandmark] = useState('');
  const [assetId, setAssetId] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const categoriesList = [
    { id: 'STREETLIGHT', label: translateCategory('STREETLIGHT'), icon: Lightbulb },
    { id: 'WATER_POINT', label: translateCategory('WATER_POINT'), icon: Droplet },
    { id: 'DRAINAGE', label: translateCategory('DRAINAGE'), icon: AlertTriangle },
    { id: 'ROAD', label: translateCategory('ROAD'), icon: MapPin },
    { id: 'PUBLIC_TOILET', label: translateCategory('PUBLIC_TOILET'), icon: Trash2 },
    { id: 'OTHER', label: translateCategory('OTHER'), icon: Info }
  ];

  const wardsList = [
    { id: 'w-1', name: translateWard('w-1') },
    { id: 'w-2', name: translateWard('w-2') },
    { id: 'w-3', name: translateWard('w-3') },
    { id: 'w-4', name: translateWard('w-4') }
  ];

  // Filter assets by selected ward and category
  const relevantAssets = assets.filter(a => a.ward_id === wardId && (category === 'OTHER' || a.asset_type === category));

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !description || !locationText) {
      setError(t('report_step4'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        category,
        wardId,
        assetId: assetId || null,
        title,
        description,
        locationText,
        landmark,
        detectionSource: 'CITIZEN_REPORT',
        photoUrl: photoPreview ? '/uploads/citizen-evidence.jpg' : null
      };

      const res = await api.createIssue(payload);
      setSuccessResult(res);
    } catch (err) {
      console.error(err);
      if (err.isDuplicate) {
        setError(`Duplicate Detected: ${err.error}`);
      } else {
        setError(err.error || 'Failed to submit issue. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (successResult) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '30px auto', textAlign: 'center', padding: '36px 24px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CheckCircle2 size={36} />
        </div>
        <h2 style={{ color: 'var(--primary-900)' }}>{t('report_success_title')}</h2>
        <div style={{ background: '#f8fafc', border: '1px solid var(--slate-200)', borderRadius: '8px', padding: '14px', margin: '20px 0' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {t('report_success_complaint_id')}
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-700)' }}>
            {successResult.id}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '4px' }}>
            {t('report_success_priority')} <strong>{translatePriority(successResult.priority)}</strong>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginBottom: '24px' }}>
          {t('report_success_msg')}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => onSuccess(successResult.id)}>
            {t('report_track_btn')}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="card-header">
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>{t('report_title')}</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
            {t('report_subtitle')}
          </p>
        </div>
        {onCancel && (
          <button className="btn btn-outline btn-sm" onClick={onCancel}>
            {t('btn_cancel')}
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '10px 14px', borderRadius: '6px', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Category Picker */}
        <div className="form-group">
          <label className="form-label">{t('report_step1')}</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
            {categoriesList.map(cat => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => { setCategory(cat.id); setAssetId(''); }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `1.5px solid ${isSelected ? 'var(--primary-700)' : 'var(--slate-200)'}`,
                    background: isSelected ? 'var(--primary-50)' : 'var(--white)',
                    color: isSelected ? 'var(--primary-900)' : 'var(--slate-700)',
                    fontWeight: isSelected ? 700 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.82rem'
                  }}
                >
                  <Icon size={16} color={isSelected ? 'var(--primary-700)' : 'var(--slate-400)'} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ward Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">{t('report_step2')}</label>
            <select className="form-select" value={wardId} onChange={(e) => { setWardId(e.target.value); setAssetId(''); }}>
              {wardsList.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('report_link_asset')}</label>
            <select className="form-select" value={assetId} onChange={(e) => setAssetId(e.target.value)}>
              <option value="">{t('report_link_asset_default')}</option>
              {relevantAssets.map(a => (
                <option key={a.id} value={a.id}>{a.id} - {a.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Issue Title */}
        <div className="form-group">
          <label className="form-label">{t('report_step3')}</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder={t('report_title_placeholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">{t('report_step4')}</label>
          <textarea 
            className="form-textarea" 
            placeholder={t('report_desc_placeholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Location & Landmark */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">{t('report_location')}</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder={t('report_location_placeholder')}
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('report_landmark')}</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder={t('report_landmark_placeholder')}
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>
        </div>

        {/* Photo Upload Simulation / Preview */}
        <div className="form-group">
          <label className="form-label">{t('report_photo')}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <label 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid var(--slate-300)',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--slate-700)'
              }}
            >
              <Camera size={16} color="var(--primary-700)" />
              {t('report_choose_photo')}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </label>
            {photoPreview && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={photoPreview} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-700)', fontWeight: 600 }}>{t('report_photo_attached')}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {onCancel && (
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              {t('btn_cancel')}
            </button>
          )}
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? t('report_submitting') : t('report_submit_btn')}
          </button>
        </div>
      </form>
    </div>
  );
}
