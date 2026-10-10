'use client';

import React from 'react';
import { Calendar, ClipboardList, User } from 'lucide-react';
import { ActiveNavTab } from '@/types';

interface MobileNavProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenLogin: () => void;
  userLoggedIn?: string | null;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenLogin,
  userLoggedIn,
}) => {
  return (
    <nav className="mobile-bottom-nav">
      {/* 1. Agendar */}
      <button
        type="button"
        className={`mobile-nav-btn ${activeTab === 'agendar' ? 'active' : ''}`}
        onClick={() => onSelectTab('agendar')}
        aria-label="Agendar sessão"
      >
        <Calendar size={20} className="nav-icon-svg" />
        <span className="nav-label-text">Agendar</span>
      </button>

      {/* 2. Lista de Agendamentos / Encaixes */}
      <button
        type="button"
        className={`mobile-nav-btn ${activeTab === 'agendamentos' ? 'active' : ''}`}
        onClick={() => onSelectTab('agendamentos')}
        aria-label="Meus agendamentos"
      >
        <ClipboardList size={21} className="nav-icon-svg" />
      </button>

      {/* 3. Meu Perfil / Login */}
      <button
        type="button"
        className={`mobile-nav-btn ${activeTab === 'perfil' ? 'active' : ''}`}
        onClick={() => {
          if (!userLoggedIn) {
            onOpenLogin();
          } else {
            onSelectTab('perfil');
          }
        }}
        aria-label="Meu perfil"
      >
        <User size={20} className="nav-icon-svg" />
        <span className="nav-label-text">Meu perfil</span>
      </button>
    </nav>
  );
};

