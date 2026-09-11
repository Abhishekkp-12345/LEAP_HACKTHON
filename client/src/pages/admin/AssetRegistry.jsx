import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  ShieldAlert, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function AssetRegistry({ assets = [], onSelectAsset, onAddAsset }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [recurringOnly, setRecurringOnly] = useState(false);

  const { t, translateCategory, translateWard, translateDept, translateStatus } = useLanguage();

  const filtered = assets.filter(a => {
    if (wardFilter && a.ward_id !== wardFilter) return false;
    if (typeFilter && a.asset_type !== typeFilter) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    if (recurringOnly && a.is_recurring_flag !== 1) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = a.id.toLowerCase().includes(q) || 
                    a.name.toLowerCase().includes(q) || 
                    (a.location_description && a.location_description.toLowerCase().includes(q)) ||
                    (a.landmark && a.landmark.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>{t('asset_registry_title')}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
            {t('asset_registry_subtitle')}
          </p>
        </div>

        <button className="btn btn-primary" onClick={onAddAsset}>
          <Plus size={16} />
          {t('btn_register_asset')}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--slate-400)" />
          <input 
            type="text" 
            className="form-input" 
            placeholder={t('search_assets_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label">{t('th_ward')}:</span>
          <select className="filter-select" value={wardFilter} onChange={(e) => setWardFilter(e.target.value)}>
            <option value="">{t('all_wards')}</option>
            <option value="w-1">{translateWard('w-1')}</option>
            <option value="w-2">{translateWard('w-2')}</option>
            <option value="w-3">{translateWard('w-3')}</option>
            <option value="w-4">{translateWard('w-4')}</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">{t('th_type')}:</span>
          <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">{t('all_categories')}</option>
            <option value="STREETLIGHT">{t('cat_STREETLIGHT')}</option>
            <option value="WATER_POINT">{t('cat_WATER_POINT')}</option>
            <option value="PUBLIC_TOILET">{t('cat_PUBLIC_TOILET')}</option>
            <option value="ROAD">{t('cat_ROAD')}</option>
            <option value="DRAINAGE">{t('cat_DRAINAGE')}</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">{t('th_status')}:</span>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">{t('all_statuses')}</option>
            <option value="WORKING">{translateStatus('WORKING')}</option>
            <option value="NEEDS_ATTENTION">{translateStatus('NEEDS_ATTENTION')}</option>
            <option value="NOT_WORKING">{translateStatus('NOT_WORKING')}</option>
            <option value="RECURRING_FAILURE">{translateStatus('RECURRING_FAILURE')}</option>
          </select>
        </div>

        <button 
          className={`btn btn-sm ${recurringOnly ? 'btn-accent' : 'btn-outline'}`}
          onClick={() => setRecurringOnly(!recurringOnly)}
        >
          <ShieldAlert size={14} />
          {recurringOnly ? t('showing_recurring_btn') : t('filter_recurring_btn')}
        </button>
      </div>

      {/* Assets Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('th_asset_id')}</th>
              <th>{t('th_asset_name')}</th>
              <th>{t('th_type')}</th>
              <th>{t('th_ward')}</th>
              <th>{t('th_department')}</th>
              <th>{t('th_status')}</th>
              <th>{t('th_cadence')}</th>
              <th>{t('th_failures')}</th>
              <th>{t('table_action')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(asset => (
              <tr key={asset.id}>
                <td>
                  <span style={{ fontWeight: 800, color: 'var(--primary-800)' }}>
                    {asset.id}
                  </span>
                  {asset.is_recurring_flag === 1 && (
                    <span className="badge badge-recurring" style={{ display: 'block', width: 'fit-content', marginTop: '3px' }}>
                      ⚠ {t('kpi_recurring_assets')}
                    </span>
                  )}
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{asset.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                    {asset.location_description} {asset.landmark && `(${asset.landmark})`}
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    {translateCategory(asset.asset_type)}
                  </span>
                </td>
                <td>{translateWard(asset.ward_name)}</td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                    {translateDept(asset.department_name)}
                  </span>
                </td>
                <td>
                  <StatusBadge status={asset.status} />
                </td>
                <td>
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>
                    {t('cadence_every')} {asset.inspection_frequency_days} {t('cadence_days')}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    fontWeight: 700, 
                    color: asset.failure_count >= 3 ? 'var(--priority-critical)' : 'var(--slate-700)' 
                  }}>
                    {asset.failure_count}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => onSelectAsset(asset.id)}
                  >
                    <Eye size={13} />
                    {t('btn_details')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
