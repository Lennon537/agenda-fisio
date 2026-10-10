'use client';

import React from 'react';
import { Calendar, ClipboardList, User, Heart, Leaf } from 'lucide-react';
import { ActiveNavTab } from '@/types';
import { CLINIC_INFO } from '@/data/clinicData';

interface SidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  appointmentsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  appointmentsCount = 0,
}) => {
  return (
    <aside className="app-sidebar">
      {/* Topo com Logo e Marca */}
      <div className="sidebar-brand-box">
        <div className="brand-logo-circle">
          <Leaf size={20} className="brand-leaf-icon" />
        </div>
        <div className="brand-text-block">
          <h1 className="brand-name">{CLINIC_INFO.name}</h1>
          <span className="brand-sub">{CLINIC_INFO.subName}</span>
        </div>
      </div>

      {/* Navegação Principal */}
      <div className="sidebar-menu-wrapper">
        <span className="sidebar-section-label">ESPAÇO DO PACIENTE</span>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'agendar' ? 'active' : ''}`}
            onClick={() => onSelectTab('agendar')}
          >
            <Calendar size={18} className="nav-item-icon" />
            <span className="nav-item-label">Agendar sessão</span>
          </button>

          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'agendamentos' ? 'active' : ''}`}
            onClick={() => onSelectTab('agendamentos')}
          >
            <ClipboardList size={18} className="nav-item-icon" />
            <span className="nav-item-label">Meus agendamentos</span>
            {appointmentsCount > 0 && (
              <span className="nav-badge-count">{appointmentsCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => onSelectTab('perfil')}
          >
            <User size={18} className="nav-item-icon" />
            <span className="nav-item-label">Meu perfil</span>
          </button>
        </nav>

        <span className="sidebar-section-label" style={{ marginTop: 24 }}>GESTÃO & CLÍNICA</span>
        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item-btn dra-nav-btn ${activeTab === 'painel-dra' ? 'active' : ''}`}
            onClick={() => onSelectTab('painel-dra')}
          >
            <Leaf size={18} className="nav-item-icon text-green" />
            <span className="nav-item-label">Painel da Dra. Ketlen</span>
            <span className="nav-badge-dra">Dra</span>
          </button>
        </nav>
      </div>


      {/* Rodapé Acolhedor da Sidebar */}
      <div className="sidebar-footer-box">
        <div className="motto-heart-icon">
          <Heart size={18} className="heart-svg" />
        </div>
        <h4 className="motto-title">{CLINIC_INFO.motto}</h4>
        <p className="motto-sub">{CLINIC_INFO.mottoSub}</p>
        <span className="motto-footer-notice">{CLINIC_INFO.footerNotice}</span>
      </div>
    </aside>
  );
};
