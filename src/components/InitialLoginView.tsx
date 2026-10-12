'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Leaf,
  User,
  Phone,
  Mail,
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
  Calendar,
  Stethoscope,
  Laptop,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { CLINIC_INFO } from '@/data/clinicData';
import { AdminType } from '@/types';

interface InitialLoginViewProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLoginSuccess: (userName: string, role: 'patient' | 'admin', adminType?: AdminType) => void;
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

  // Paciente State
  const [patientMode, setPatientMode] = useState<'whatsapp' | 'email'>('whatsapp');
  const [patientInput, setPatientInput] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPassword, setPatientPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Administrador State (Exclusivo para as 2 pessoas cadastradas)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminType>('dra');
  const [adminEmail, setAdminEmail] = useState('dra.ketllen@ketllensouza.com.br');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Manipular seleção do Administrador (Dra. Ketllen ou Lennon/Webmaster)
  const handleSelectAdmin = (type: AdminType) => {
    setSelectedAdmin(type);
    if (type === 'dra') {
      setAdminEmail('dra.ketllen@ketllensouza.com.br');
    } else {
      setAdminEmail('admin@ketllensouza.com.br');
    }
  };

  // Submit de Paciente
  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientInput.trim()) {
      onShowToast(`Por favor, informe seu ${patientMode === 'whatsapp' ? 'WhatsApp' : 'E-mail'}.`);
      return;
    }

    const displayName = patientName.trim()
      ? patientName.trim()
      : patientInput.includes('@')
      ? patientInput.split('@')[0]
      : 'Mariana Duarte';

    onLoginSuccess(displayName, 'patient');
    onShowToast(`✓ Bem-vindo(a) ao seu espaço, ${displayName}!`);
  };

  // Submit de Administrador
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminPassword.trim()) {
      onShowToast('Por favor, informe a senha de administrador.');
      return;
    }

    if (selectedAdmin === 'dra') {
      onLoginSuccess('Dra. Ketllen Souza', 'admin', 'dra');
      onShowToast('✓ Bem-vinda ao Painel Clínico, Dra. Ketllen!');
    } else {
      onLoginSuccess('Lennon (Webmaster)', 'admin', 'webmaster');
      onShowToast('✓ Acesso de Webmaster concedido. Painel administrativo ativo!');
    }
  };

  // Demonstração Rápida: Paciente
  const handleQuickPatient = () => {
    setRole('patient');
    setPatientMode('whatsapp');
    setPatientInput('(11) 98765-4321');
    setPatientName('Mariana Duarte');
    setPatientPassword('123456');
    onShowToast('✓ Dados de paciente (Mariana) preenchidos!');
  };

  // Demonstração Rápida: Dra. Ketllen
  const handleQuickDra = () => {
    setRole('admin');
    setSelectedAdmin('dra');
    setAdminEmail('dra.ketllen@ketllensouza.com.br');
    setAdminPassword('admin2026');
    onShowToast('✓ Dados da Dra. Ketllen preenchidos para demonstração!');
  };

  // Demonstração Rápida: Lennon (Webmaster)
  const handleQuickWebmaster = () => {
    setRole('admin');
    setSelectedAdmin('webmaster');
    setAdminEmail('admin@ketllensouza.com.br');
    setAdminPassword('admin2026');
    onShowToast('✓ Dados do Webmaster (Lennon) preenchidos para demonstração!');
  };

  return (
    <div className="initial-login-screen">
      {/* Barra Superior */}
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
            className="btn-guest-topbar-link"
            onClick={onContinueAsGuest}
            title="Acessar agenda sem realizar login"
          >
            <Calendar size={15} />
            <span className="desktop-only-text">Ver agenda sem login</span>
          </button>

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

      {/* Container Central com Split Screen */}
      <div className="login-split-container">
        {/* Coluna Esquerda: Formulário Moderno */}
        <div className="login-form-column">
          <div className="login-form-card login-glass-card">
            <span className="login-kicker-tag">PORTAL DE ACESSO & AGENDAMENTO</span>
            <h2 className="login-hero-title">Bem-vindo(a)</h2>
            <p className="login-hero-sub">
              {role === 'patient'
                ? 'Acesse seu histórico, agendamentos confirmados e exercícios para casa.'
                : 'Ambiente restrito exclusivo para os 2 administradores autorizados.'}
            </p>

            {/* Seletor Segmentado de Perfil: Paciente vs Administrador */}
            <div className="login-segmented-tabs">
              <button
                type="button"
                className={`login-segment-btn ${role === 'patient' ? 'active' : ''}`}
                onClick={() => setRole('patient')}
              >
                <User size={16} />
                <span>Sou Paciente</span>
              </button>
              <button
                type="button"
                className={`login-segment-btn admin-segment-tab ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setRole('admin')}
              >
                <ShieldCheck size={16} />
                <span>Administrador</span>
                <span className="login-admin-counter-pill">2 contas</span>
              </button>
            </div>

            {/* ==============================================================
                FORMULÁRIO 1: ÁREA DO PACIENTE
                ============================================================== */}
            {role === 'patient' && (
              <form onSubmit={handlePatientSubmit} className="login-form fade-in-section">
                {/* Alternador de Método: WhatsApp ou E-mail */}
                <div className="patient-mode-chips-row">
                  <span className="patient-mode-label">Entrar com:</span>
                  <button
                    type="button"
                    className={`patient-mode-chip ${patientMode === 'whatsapp' ? 'active' : ''}`}
                    onClick={() => {
                      setPatientMode('whatsapp');
                      setPatientInput('');
                    }}
                  >
                    <Phone size={13} />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    className={`patient-mode-chip ${patientMode === 'email' ? 'active' : ''}`}
                    onClick={() => {
                      setPatientMode('email');
                      setPatientInput('');
                    }}
                  >
                    <Mail size={13} />
                    <span>E-mail</span>
                  </button>
                </div>

                {/* Campo Identificador (WhatsApp ou E-mail) */}
                <div className="login-form-group">
                  <label className="login-label">
                    {patientMode === 'whatsapp' ? 'Seu WhatsApp' : 'Seu E-mail'}
                  </label>
                  <div className="login-input-wrapper">
                    {patientMode === 'whatsapp' ? (
                      <Phone size={17} className="login-input-icon" />
                    ) : (
                      <Mail size={17} className="login-input-icon" />
                    )}
                    <input
                      type={patientMode === 'whatsapp' ? 'tel' : 'email'}
                      className="login-input"
                      placeholder={
                        patientMode === 'whatsapp'
                          ? 'Ex: (11) 98765-4321'
                          : 'Ex: seu.nome@email.com'
                      }
                      value={patientInput}
                      onChange={(e) => setPatientInput(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Campo Nome (Opcional ou para personalização) */}
                <div className="login-form-group">
                  <label className="login-label">Nome Completo (Opcional)</label>
                  <div className="login-input-wrapper">
                    <User size={17} className="login-input-icon" />
                    <input
                      type="text"
                      className="login-input"
                      placeholder="Ex: Mariana Duarte"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Lembrar e termos */}
                <div className="remember-row">
                  <label className="remember-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Lembrar meu acesso neste dispositivo</span>
                  </label>
                </div>

                {/* Botão de Entrar Paciente */}
                <button type="submit" className="btn-login-submit">
                  <span>Acessar Espaço do Paciente</span>
                  <ArrowRight size={17} />
                </button>

                {/* Divisor */}
                <div className="login-divider-line">
                  <span>ou continue diretamente</span>
                </div>

                {/* Botão Convidado */}
                <button
                  type="button"
                  className="btn-guest-direct"
                  onClick={onContinueAsGuest}
                >
                  <Calendar size={16} />
                  <span>Agendar sessão sem cadastro</span>
                  <ArrowRight size={15} style={{ marginLeft: 'auto' }} />
                </button>

                {/* Atalho de Demonstração */}
                <div className="login-demo-helpers">
                  <span className="demo-helpers-title">Teste rápido de paciente:</span>
                  <button
                    type="button"
                    className="btn-demo-pill"
                    onClick={handleQuickPatient}
                  >
                    👤 Mariana Duarte (Paciente com sessões)
                  </button>
                </div>
              </form>
            )}

            {/* ==============================================================
                FORMULÁRIO 2: ÁREA DE ADMINISTRADOR (SOMENTE 2 PESSOAS)
                ============================================================== */}
            {role === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="login-form fade-in-section">
                {/* Banner de Segurança & Esclarecimento */}
                <div className="admin-security-alert">
                  <div className="admin-alert-icon">
                    <ShieldCheck size={18} color="#059669" />
                  </div>
                  <div className="admin-alert-text">
                    <strong>Acesso Restrito: 2 Administradores</strong>
                    <span>
                      Cadastrados exclusivamente: <strong>Dra. Ketllen Souza</strong> (Clínica) e{' '}
                      <strong>Lennon</strong> (Webmaster do site).
                    </span>
                  </div>
                </div>

                {/* Seletor Visual dos 2 Administradores */}
                <div className="admin-selector-wrapper">
                  <label className="login-label">Selecione o Administrador:</label>
                  <div className="admin-cards-grid">
                    {/* Card 1: Dra. Ketllen Souza */}
                    <button
                      type="button"
                      className={`admin-card-btn ${selectedAdmin === 'dra' ? 'active' : ''}`}
                      onClick={() => handleSelectAdmin('dra')}
                    >
                      <div className="admin-card-avatar dra-avatar">
                        <Stethoscope size={18} />
                      </div>
                      <div className="admin-card-info">
                        <strong className="admin-card-name">Dra. Ketllen Souza</strong>
                        <span className="admin-card-badge">Fisioterapeuta & Diretora</span>
                      </div>
                      {selectedAdmin === 'dra' && (
                        <div className="admin-card-check">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </button>

                    {/* Card 2: Lennon (Webmaster / Responsável pelo Site) */}
                    <button
                      type="button"
                      className={`admin-card-btn ${selectedAdmin === 'webmaster' ? 'active' : ''}`}
                      onClick={() => handleSelectAdmin('webmaster')}
                    >
                      <div className="admin-card-avatar webmaster-avatar">
                        <Laptop size={18} />
                      </div>
                      <div className="admin-card-info">
                        <strong className="admin-card-name">Lennon</strong>
                        <span className="admin-card-badge">Webmaster & Suporte</span>
                      </div>
                      {selectedAdmin === 'webmaster' && (
                        <div className="admin-card-check">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* E-mail Profissional Vinculado */}
                <div className="login-form-group">
                  <label className="login-label">E-mail Profissional Autorizado</label>
                  <div className="login-input-wrapper">
                    <Mail size={17} className="login-input-icon" />
                    <input
                      type="email"
                      className="login-input"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Senha de Acesso Administrativo */}
                <div className="login-form-group">
                  <div className="password-header-row">
                    <label className="login-label">Chave de Segurança / Senha</label>
                    <button
                      type="button"
                      className="forgot-password-link"
                      onClick={() => onShowToast('Dica de demonstração: use a senha admin2026')}
                    >
                      Esqueceu?
                    </button>
                  </div>
                  <div className="login-input-wrapper">
                    <KeyRound size={17} className="login-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="login-input"
                      placeholder="Senha do administrador (admin2026)"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Botão de Entrar como Administrador */}
                <button type="submit" className="btn-login-submit btn-login-admin">
                  <ShieldCheck size={17} />
                  <span>
                    {selectedAdmin === 'dra'
                      ? 'Entrar no Painel da Dra. Ketllen'
                      : 'Entrar como Webmaster (Suporte)'}
                  </span>
                  <ArrowRight size={17} style={{ marginLeft: 'auto' }} />
                </button>

                {/* Atalhos Rápidos para Testes dos Administradores */}
                <div className="login-demo-helpers">
                  <span className="demo-helpers-title">Preenchimento rápido de teste:</span>
                  <div className="demo-buttons-row">
                    <button
                      type="button"
                      className="btn-demo-pill"
                      onClick={handleQuickDra}
                    >
                      🩺 Dra. Ketllen (1 clique)
                    </button>
                    <button
                      type="button"
                      className="btn-demo-pill"
                      onClick={handleQuickWebmaster}
                    >
                      💻 Lennon Webmaster (1 clique)
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Coluna Direita: Showcase Visual Premium */}
        <div className="login-showcase-column">
          <div className="showcase-content-box">
            <div className="showcase-card-overlay">
              <span className="hero-tag">FISIOTERAPIA & PILATES</span>
              <h3 className="showcase-title">{CLINIC_INFO.tagline}</h3>
              <p className="showcase-desc">{CLINIC_INFO.subTagline}</p>

              <div className="showcase-features-list">
                <div className="feature-row">
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>Atendimento individualizado e fisioterapia humanizada</span>
                </div>
                <div className="feature-row">
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>Estúdio completo de Pilates Reformer & Cadillac</span>
                </div>
                <div className="feature-row">
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>Fila inteligente de encaixes prioritários por nível de dor</span>
                </div>
                <div className="feature-row">
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>Prescrição de exercícios para casa no celular do paciente</span>
                </div>
                <div className="feature-row">
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>Disparo de lembretes e confirmações via WhatsApp</span>
                </div>
              </div>

              {/* Selo de Segurança e Confiabilidade */}
              <div className="showcase-trust-badge">
                <ShieldCheck size={16} color="#6ee7b7" />
                <span>Ambiente protegido com criptografia e prontuário sigiloso</span>
              </div>
            </div>

            <div className="showcase-image-wrapper">
              <Image
                src="/images/pilates_reformer_banner.jpg"
                alt="Estúdio Ketllen Souza Fisioterapia Studio"
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
