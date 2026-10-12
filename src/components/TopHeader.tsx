'use client';

import React from 'react';
import { Moon, Sun, User, Leaf, LogOut } from 'lucide-react';
import { CLINIC_INFO } from '@/data/clinicData';

interface TopHeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenLogin: () => void;
  onLogout?: () => void;
  userLoggedIn?: string | null;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenLogin,
  onLogout,
  userLoggedIn,
}) => {
  return (
    <header className="top-header">
      {/* Marca no Header (visível principalmente no Mobile ou quando não há sidebar) */}
      <div className="header-brand-block">
        <div className="header-brand-logo">
          <Leaf size={18} className="header-leaf-icon" />
        </div>
        <div className="header-brand-text">
          <span className="header-brand-name">{CLINIC_INFO.name}</span>
          <span className="header-brand-sub">{CLINIC_INFO.subName}</span>
        </div>
      </div>

      {/* Frase de Boas-vindas para Desktop */}
      <div className="header-welcome-desktop">
        <span>{CLINIC_INFO.welcomeText}</span>
      </div>

      {/* Ações à direita: Tema + Botão Entrar / Usuário */}
      <div className="header-actions-right">
        {/* Alternador de Modo Escuro / Modo Claro */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
          aria-label="Alternar tema de cores"
        >
          {theme === 'dark' ? (
            <Sun size={18} className="theme-icon sun-icon" />
          ) : (
            <Moon size={18} className="theme-icon moon-icon" />
          )}
        </button>

        {/* Botão de Usuário ou Login */}
        {userLoggedIn ? (
          <div className="logged-user-chip-group">
            <button
              type="button"
              className="btn-login-outline logged-user-btn"
              onClick={onOpenLogin}
              title="Acessar perfil ou alternar conta"
            >
              <User size={15} />
              <span>
                {userLoggedIn.startsWith('Dra.')
                  ? 'Dra. Ketllen'
                  : userLoggedIn.includes('Webmaster')
                  ? 'Lennon (Admin)'
                  : userLoggedIn.split(' ')[0]}
              </span>
            </button>
            {onLogout && (
              <button
                type="button"
                className="btn-logout-icon"
                onClick={onLogout}
                title="Sair para a tela inicial de login"
                aria-label="Sair"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="btn-login-outline"
            onClick={onOpenLogin}
            title="Entrar no sistema"
          >
            <User size={16} />
            <span>Entrar</span>
          </button>
        )}
      </div>
    </header>
  );
};

