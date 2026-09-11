import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Clock, Layers } from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function DepartmentRulesConfig() {
  const [configs, setConfigs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const { t, translateDept } = useLanguage();

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const res = await api.getConfig();
      setConfigs(res.configs || []);
      setDepartments(res.departments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleConfigChange(key, value) {
    setConfigs(configs.map(c => c.key === key ? { ...c, value } : c));
  }

  function handleDeptSlaChange(deptId, field, value) {
    setDepartments(departments.map(d => d.id === deptId ? { ...d, [field]: parseInt(value) || 0 } : d));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateConfig({
        configs,
        departmentSlas: departments
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 4000);
    } catch (e) {
      alert(e.error || 'Failed to update configuration');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading system configuration...</div>;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>{t('nav_config')}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
          Configure rule thresholds, target completion SLAs, and external feedback URLs.
        </p>
      </div>

      {savedNotice && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px', borderRadius: '6px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          Operational rules and department SLAs successfully saved to database.
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Department SLAs Table */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <div className="card-title">
              <Clock size={18} color="var(--primary-700)" />
              {t('th_department')} SLA Target Resolution Times (Hours)
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('th_department')}</th>
                  <th>{t('priority_CRITICAL')} SLA (Hrs)</th>
                  <th>{t('priority_HIGH')} SLA (Hrs)</th>
                  <th>{t('priority_MEDIUM')} SLA (Hrs)</th>
                  <th>{t('priority_LOW')} SLA (Hrs)</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(dept => (
                  <tr key={dept.id}>
                    <td><strong>{translateDept(dept.name)}</strong></td>
                    <td>
                      <input 
                        type="number" 
                        className="form-input" 
                        style={{ width: '80px', padding: '4px 8px' }}
                        value={dept.sla_hours_critical}
                        onChange={(e) => handleDeptSlaChange(dept.id, 'sla_hours_critical', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className="form-input" 
                        style={{ width: '80px', padding: '4px 8px' }}
                        value={dept.sla_hours_high}
                        onChange={(e) => handleDeptSlaChange(dept.id, 'sla_hours_high', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className="form-input" 
                        style={{ width: '80px', padding: '4px 8px' }}
                        value={dept.sla_hours_medium}
                        onChange={(e) => handleDeptSlaChange(dept.id, 'sla_hours_medium', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className="form-input" 
                        style={{ width: '80px', padding: '4px 8px' }}
                        value={dept.sla_hours_low}
                        onChange={(e) => handleDeptSlaChange(dept.id, 'sla_hours_low', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Operational Configs */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <div className="card-title">
              <Settings size={18} color="var(--primary-700)" />
              Proactive Thresholds & External Integrations
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {configs.map(cfg => (
              <div key={cfg.key} className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>
                  {cfg.key}
                  <span style={{ display: 'block', fontWeight: 400, color: 'var(--slate-500)', fontSize: '0.75rem' }}>
                    {cfg.description}
                  </span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={cfg.value}
                  onChange={(e) => handleConfigChange(cfg.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <Save size={18} />
            {saving ? 'Saving...' : t('btn_save')}
          </button>
        </div>
      </form>
    </div>
  );
}
