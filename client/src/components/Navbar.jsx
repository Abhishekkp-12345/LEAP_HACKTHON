import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Building2,
  Bell,
  UserCheck,
  Languages,
  Wrench,
  ShieldAlert,
  Layers,
  BarChart3,
  FileText,
  MapPin,
  Settings,
  ClipboardCheck,
  Users
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenNotifications, unreadCount = 0 }) {
  const { user, switchRole } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();

  const role = user ? user.role : 'CITIZEN';

  return (
    <header className="navbar">
      <div className="nav-top-banner">
        <span>{t('karnataka_gov_banner')}</span>
        <span>{t('pilot_location_banner')}</span>
      </div>

      <div className="nav-container">
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div className="nav-logo-container">
            <img src="/logo.png" alt="GramSeva Logo" className="nav-logo-img" />
          </div>
          <div className="nav-titles">
            <h1>
              {t('app_title')}
              <span style={{ fontSize: '0.65rem', background: '#047857', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t('proactive_pilot_tag')}
              </span>
            </h1>
            <span>{t('sub_title')} • {t('pilot_location')}</span>
          </div>
        </div>

        <div className="nav-actions">
          <div className="role-switcher" title="Switch demo persona">
            <button
              className={`role-btn ${role === 'CITIZEN' ? 'active' : ''}`}
              onClick={() => { switchRole('CITIZEN'); setActiveTab('dashboard'); }}
            >
              <UserCheck size={14} />
              {t('citizen')}
            </button>
            <button
              className={`role-btn ${role === 'FIELD_STAFF' ? 'active' : ''}`}
              onClick={() => { switchRole('FIELD_STAFF'); setActiveTab('inspections'); }}
            >
              <Wrench size={14} />
              {t('field_staff')}
            </button>
            <button
              className={`role-btn ${role === 'ADMIN' ? 'active' : ''}`}
              onClick={() => { switchRole('ADMIN'); setActiveTab('dashboard'); }}
            >
              <Building2 size={14} />
              {t('admin')}
            </button>
            <button
              className={`role-btn ${role === 'COMMUNITY_OBSERVER' ? 'active' : ''}`}
              onClick={() => { switchRole('COMMUNITY_OBSERVER'); setActiveTab('dashboard'); }}
            >
              <Users size={14} />
              Observer
            </button>
          </div>

          <button className="lang-toggle-btn" onClick={toggleLanguage} title="Switch English / ಕನ್ನಡ">
            <Languages size={15} />
            <span style={{ fontWeight: 700 }}>{lang === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
          </button>

          <button
            className="lang-toggle-btn"
            onClick={onOpenNotifications}
            title={t('modal_notifications_title')}
            style={{ position: 'relative' }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                border: '2px solid #064e3b'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav className="subnav">
        <div className="subnav-container">
          {role === 'CITIZEN' && (
            <>
              <button
                className={`subnav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <Layers size={16} />
                {t('nav_dashboard')}
              </button>
              <button
                className={`subnav-link ${activeTab === 'report' ? 'active' : ''}`}
                onClick={() => setActiveTab('report')}
              >
                <FileText size={16} />
                {t('nav_report')}
              </button>
              <button
                className={`subnav-link ${activeTab === 'my_issues' ? 'active' : ''}`}
                onClick={() => setActiveTab('my_issues')}
              >
                <ClipboardCheck size={16} />
                {t('nav_my_issues')}
              </button>
              <button
                className={`subnav-link ${activeTab === 'map' ? 'active' : ''}`}
                onClick={() => setActiveTab('map')}
              >
                <MapPin size={16} />
                {t('nav_map')}
              </button>
            </>
          )}

          {role === 'FIELD_STAFF' && (
            <>
              <button
                className={`subnav-link ${activeTab === 'inspections' ? 'active' : ''}`}
                onClick={() => setActiveTab('inspections')}
              >
                <ClipboardCheck size={16} />
                {t('nav_inspections')}
              </button>
              <button
                className={`subnav-link ${activeTab === 'work_orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('work_orders')}
              >
                <Wrench size={16} />
                {t('nav_work_orders')}
              </button>
              <button
                className={`subnav-link ${activeTab === 'map' ? 'active' : ''}`}
                onClick={() => setActiveTab('map')}
              >
                <MapPin size={16} />
                {t('nav_map')}
              </button>
            </>
          )}

          {role === 'ADMIN' && (
            <>
              <button
                className={`subnav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <Layers size={16} />
                {t('nav_dashboard')}
              </button>
              <button
                className={`subnav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 size={16} />
                {t('nav_analytics')}
              </button>
              <button
                className={`subnav-link ${activeTab === 'assets' ? 'active' : ''}`}
                onClick={() => setActiveTab('assets')}
              >
                <Building2 size={16} />
                {t('nav_assets')}
              </button>
              <button
                className={`subnav-link ${activeTab === 'recurring' ? 'active' : ''}`}
                onClick={() => setActiveTab('recurring')}
              >
                <ShieldAlert size={16} />
                {t('nav_recurring')}
              </button>
              <button
                className={`subnav-link ${activeTab === 'inspection_mgmt' ? 'active' : ''}`}
                onClick={() => setActiveTab('inspection_mgmt')}
              >
                <ClipboardCheck size={16} />
                {t('nav_inspections')}
              </button>
              <button
                className={`subnav-link ${activeTab === 'escalations' ? 'active' : ''}`}
                onClick={() => setActiveTab('escalations')}
              >
                <ShieldAlert size={16} />
                {t('nav_escalations')}
              </button>
              <button
                className={`subnav-link ${activeTab === 'map' ? 'active' : ''}`}
                onClick={() => setActiveTab('map')}
              >
                <MapPin size={16} />
                {t('nav_map')}
              </button>
              <button
                className={`subnav-link ${activeTab === 'config' ? 'active' : ''}`}
                onClick={() => setActiveTab('config')}
              >
                <Settings size={16} />
                {t('nav_config')}
              </button>
            </>
          )}

          {role === 'COMMUNITY_OBSERVER' && (
            <>
              <button
                className={`subnav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <Layers size={16} />
                Overview
              </button>
              <button
                className={`subnav-link ${activeTab === 'map' ? 'active' : ''}`}
                onClick={() => setActiveTab('map')}
              >
                <MapPin size={16} />
                {t('nav_map')}
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
