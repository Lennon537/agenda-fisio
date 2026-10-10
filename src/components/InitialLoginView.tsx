'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Leaf,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Moon,
  Sun,
  Activity,
  CheckCircle2,
  Sparkles,
  Calendar
} from 'lucide-react';
import { CLINIC_INFO } from '@/data/clinicData';

interface InitialLoginViewProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLoginSuccess: (userName: string, role: 'patient' | 'admin') => void;
  onContinueAsGuest: () => void;
  onShowToast: (msg: string) => void;
}

export const InitialLoginView: React.FC<InitialLoginViewProps> = ({
  theme,
  onToggleTheme,
  onLoginSuccess,
  onContinueAsGuest,
  onShowToast,
}) => {
  const [role, setRole] = useState<'patient' | 'admin'>('patient');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      onShowToast('Por favor, informe seu WhatsApp ou E-mail.');
      return;
    }

    if (role === 'admin') {
      onLoginSuccess('Dra. Ketlen Siqueira', 'admin');
      onShowToast('✓ Bem-vinda ao sistema, Dra. Ketlen!');
    } else {
      const name = identifier.includes('@')
        ? identifier.split('@')[0]
        : 'Mariana Duarte';
      onLoginSuccess(name, 'patient');
      onShowToast(`✓ Bem-vindo(a) ao seu espaço, ${name}!`);
    }
  };

  const handleQuickPatient = () => {
    setRole('patient');
    setIdentifier('(11) 98765-4321');
    setPassword('123456');
    onShowToast('✓ Dados de paciente preenchidos para demonstração!');
  };

  const handleQuickAdmin = () => {
    setRole('admin');
    setIdentifier('ketlen@ketlenfisio.com.br');
    setPassword('admin2026');
    onShowToast('✓ Dados de fisioterapeuta preenchidos para demonstração!');
  };

  return (
    <div className="initial-login-screen">
      {/* Barra Superior Simples com Alternador de Tema */}
      <header className="login-screen-topbar">
        <div className="brand-logo-combo">
          <div className="brand-logo-circle">
            <Leaf size={22} className="brand-leaf-icon" />
          </div>
          <div className="brand-text-block">
            <h1 className="brand-name">{CLINIC_INFO.name}</h1>
            <span className="brand-sub">{CLINIC_INFO.subName}</span>
          </div>
        </div>

        <div className="login-topbar-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="theme-icon sun-icon" />
            ) : (
              <Moon size={18} className="theme-icon moon-icon" />
            )}
          </button>
        </div>
      </header>

      {/* Conteúdo Central Split Screen */}
      <div className="login-split-container">
        {/* Coluna Esquerda: Formulário de Acesso */}
        <div className="login-form-column">
          <div className="login-form-card">
            <span className="login-kicker-tag">ACESSO AO ESPAÇO DE CUIDADO</span>
            <h2 className="login-hero-title">Entrar no Sistema</h2>
            <p className="login-hero-sub">
              Acesse seu histórico de sessões, evolução clínica e solicitações de encaixe na Ketlen Fisio.
            </p>

            {/* Seletor de Perfil */}
            <div className="login-role-tabs" style={{ marginTop: 20 }}>
              <button
                type="button"
                className={`role-tab-btn ${role === 'patient' ? 'active' : ''}`}
                onClick={() => setRole('patient')}
              >
                <User size={15} />
                <span>Sou Paciente</span>
              </button>
              <button
                type="button"
                className={`role-tab-btn ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setRole('admin')}
              >
                <ShieldCheck size={15} />
                <span>Fisioterapeuta / Equipe</span>
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-form-group">
                <label className="login-label">
                  {role === 'patient' ? 'WhatsApp ou E-mail' : 'E-mail Profissional'}
                </label>
                <div className="login-input-wrapper">
                  {role === 'patient' ? (
                    <Phone size={17} className="login-input-icon" />
                  ) : (
                    <User size={17} className="login-input-icon" />
                  )}
                  <input
                    type="text"
                    className="login-input"
                    placeholder={role === 'patient' ? 'Ex: (11) 98765-4321 ou seu e-mail' : 'Ex: ketlen@ketlenfisio.com.br'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-form-group">
                <div className="password-header-row">
                  <label className="login-label">Senha de Acesso</label>
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => onShowToast('Link de recuperação enviado para seu WhatsApp!')}
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="login-input-wrapper">
                  <Lock size={17} className="login-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="login-input"
                    placeholder="Sua senha secreta"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="remember-row">
                <label className="remember-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Lembrar de mim neste dispositivo</span>
                </label>
              </div>

              <button type="submit" className="btn-login-submit">
                <span>Acessar Espaço Ketlen Fisio</span>
                <ArrowRight size={17} />
              </button>
            </form>

            <div className="login-divider-line">
              <span>ou agende diretamente</span>
            </div>

            {/* Botão de Acesso Imediato sem Login */}
            <button
              type="button"
              className="btn-guest-direct"
              onClick={onContinueAsGuest}
            >
              <Calendar size={16} />
              <span>Acessar Agenda de Sessões & Encaixes</span>
              <ArrowRight size={15} style={{ marginLeft: 'auto' }} />
            </button>

            {/* Demonstração Rápida */}
            <div className="login-demo-helpers" style={{ marginTop: 22 }}>
              <span className="demo-helpers-title">Acesso rápido para testar o sistema:</span>
              <div className="demo-buttons-row">
                <button
                  type="button"
                  className="btn-demo-pill"
                  onClick={handleQuickPatient}
                >
                  👤 Mariana Duarte (Paciente)
                </button>
                <button
                  type="button"
                  className="btn-demo-pill"
                  onClick={handleQuickAdmin}
                >
                  🩺 Dra. Ketlen (Fisioterapeuta)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Showcase Visual & Aparelho de Pilates */}
        <div className="login-showcase-column">
          <div className="showcase-content-box">
            <div className="showcase-card-overlay">
              <span className="hero-tag">FISIOTERAPIA & PILATES</span>
              <h3 className="showcase-title">{CLINIC_INFO.tagline}</h3>
              <p className="showcase-desc">{CLINIC_INFO.subTagline}</p>

              <div className="showcase-features-list">
                <div className="feature-row">
                  <CheckCircle2 size={18} color="#059669" />
                  <span>Atendimento individualizado e fisioterapia humanizada</span>
                </div>
                <div className="feature-row">
                  <CheckCircle2 size={18} color="#059669" />
                  <span>Estúdio completo de Pilates em Aparelhos (Reformer e Cadillac)</span>
                </div>
                <div className="feature-row">
                  <CheckCircle2 size={18} color="#059669" />
                  <span>Sistema inteligente de fila de espera e encaixes por desistência</span>
                </div>
                <div className="feature-row">
                  <CheckCircle2 size={18} color="#059669" />
                  <span>Confirmação instantânea de horário via WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="showcase-image-wrapper">
              <Image
                src="/images/pilates_reformer_banner.jpg"
                alt="Ketlen Fisio Studio"
                width={800}
                height={600}
                className="showcase-bg-image"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
