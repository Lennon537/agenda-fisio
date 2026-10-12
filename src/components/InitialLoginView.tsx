'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Heart,
  Stethoscope,
  Laptop,
  CheckCircle2,
  Calendar,
  Sparkles
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

  // Estado do Paciente
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Estado dos 2 Administradores
  const [selectedAdmin, setSelectedAdmin] = useState<AdminType>('dra');
  const [adminEmail, setAdminEmail] = useState('dra.ketllen@ketllensouza.com.br');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Alternar Administrador
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

    if (!email.trim()) {
      onShowToast('Por favor, informe seu e-mail ou WhatsApp.');
      return;
    }

    const displayName = email.includes('@')
      ? email.split('@')[0]
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
    setEmail('mariana.duarte@email.com');
    setPassword('123456');
    onShowToast('✓ Credenciais da paciente Mariana preenchidas!');
  };

  // Demonstração Rápida: Dra. Ketllen
  const handleQuickDra = () => {
    setRole('admin');
    setSelectedAdmin('dra');
    setAdminEmail('dra.ketllen@ketllensouza.com.br');
    setAdminPassword('admin2026');
    onShowToast('✓ Credenciais da Dra. Ketllen preenchidas!');
  };

  // Demonstração Rápida: Lennon Webmaster
  const handleQuickWebmaster = () => {
    setRole('admin');
    setSelectedAdmin('webmaster');
    setAdminEmail('admin@ketllensouza.com.br');
    setAdminPassword('admin2026');
    onShowToast('✓ Credenciais de Webmaster (Lennon) preenchidas!');
  };

  return (
    <div className="lovable-login-root">
      {/* ==============================================================
          COLUNA ESQUERDA: HERO VISUAL (ESTÚDIO COM REFORMER & BRANDING)
          ============================================================== */}
      <div className="lovable-hero-col">
        {/* Imagem de Fundo com Reformer de Pilates */}
        <div className="lovable-hero-bg">
          <Image
            src="/images/login_hero_studio.jpg"
            alt="Estúdio de Pilates e Fisioterapia Ketllen Souza"
            fill
            priority
            className="lovable-hero-img"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="lovable-hero-overlay" />
        </div>

        {/* Topo Esquerdo: Marca Ketllen Souza Fisioterapia */}
        <div className="lovable-hero-top">
          <div className="lovable-brand-logo-circle">
            <Leaf size={22} className="lovable-leaf-svg" />
          </div>
          <div className="lovable-brand-text">
            <h1 className="lovable-brand-name">
              Ketllen Souza<br />Fisioterapia
            </h1>
            <span className="lovable-brand-sub">FISIOTERAPIA & PILATES</span>
          </div>
        </div>

        {/* Base Esquerda: Título de Impacto & Filosofia */}
        <div className="lovable-hero-bottom">
          <span className="lovable-hero-kicker">CUIDAR DE VOCÊ COMEÇA AQUI</span>
          <h2 className="lovable-hero-title">
            Mais movimento.<br />
            Mais qualidade<br />
            de vida.
          </h2>
          <p className="lovable-hero-sub lovable-desktop-only">
            Um cuidado próximo, no seu ritmo.<br />
            Estamos aqui para caminhar com você.
          </p>

          <div className="lovable-hero-footer-divider lovable-desktop-only">
            <div className="lovable-hero-quote-row">
              <Heart size={16} className="lovable-heart-svg" />
              <span>Seu movimento, nosso cuidado.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          COLUNA DIREITA: PAINEL DE LOGIN (EXATAMENTE COMO NA IMAGEM)
          ============================================================== */}
      <div className="lovable-form-col">
        {/* Barra Superior da Coluna Direita: Abas & Ambiente Seguro */}
        <div className="lovable-form-topbar">
          <div className="lovable-role-switch">
            <button
              type="button"
              className={`lovable-role-tab ${role === 'patient' ? 'active' : ''}`}
              onClick={() => setRole('patient')}
            >
              ESPAÇO DO PACIENTE
            </button>
            <span className="lovable-role-divider">•</span>
            <button
              type="button"
              className={`lovable-role-tab admin-tab ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
              title="Acesso exclusivo para Dra. Ketllen e Lennon Webmaster"
            >
              ADMINISTRADOR (2 CONTAS)
            </button>
          </div>

          <div className="lovable-secure-badge">
            <ShieldCheck size={14} className="lovable-shield-icon" />
            <span>Ambiente seguro</span>
          </div>
        </div>

        {/* Centro da Coluna: Card de Formulário */}
        <div className="lovable-form-center">
          {/* Ícone Central de Folha */}
          <div className="lovable-leaf-badge">
            <Leaf size={24} className="lovable-center-leaf" />
          </div>

          {/* ==========================================================
              FLUXO 1: ESPAÇO DO PACIENTE (100% FIEL À IMAGEM)
              ========================================================== */}
          {role === 'patient' && (
            <div className="lovable-form-box fade-in-quick">
              <div className="lovable-header-text">
                <span className="lovable-kicker-tag">BEM-VINDO AO SEU ESPAÇO DE CUIDADO</span>
                <h3 className="lovable-main-title">Que bom ter você aqui.</h3>
                <p className="lovable-main-sub">Entre para cuidar do seu próximo movimento.</p>
              </div>

              <form onSubmit={handlePatientSubmit} className="lovable-form-body">
                {/* Campo E-mail */}
                <div className="lovable-field-group">
                  <label className="lovable-field-label">E-mail</label>
                  <div className="lovable-input-wrapper">
                    <Mail size={18} className="lovable-input-icon" />
                    <input
                      type="text"
                      className="lovable-input"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                <div className="lovable-field-group">
                  <label className="lovable-field-label">Senha</label>
                  <div className="lovable-input-wrapper">
                    <Lock size={18} className="lovable-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="lovable-input"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="lovable-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Linha Lembrar de mim / Esqueci minha senha */}
                <div className="lovable-options-row">
                  <label className="lovable-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="lovable-checkbox-input"
                    />
                    <span className="lovable-custom-checkbox">
                      {rememberMe && <span className="lovable-check-icon">✓</span>}
                    </span>
                    <span className="lovable-checkbox-text">Lembrar de mim</span>
                  </label>

                  <button
                    type="button"
                    className="lovable-forgot-link"
                    onClick={() => onShowToast('Link de recuperação enviado para seu e-mail cadastrado!')}
                  >
                    Esqueci minha senha
                  </button>
                </div>

                {/* Botão Principal: Entrar na minha conta */}
                <button type="submit" className="lovable-submit-btn">
                  <span>Entrar na minha conta</span>
                  <ArrowRight size={18} className="lovable-submit-arrow" />
                </button>

                {/* Link Secundário: Ainda não tem uma conta? Cadastre-se → */}
                <div className="lovable-signup-row">
                  <span className="lovable-signup-text">Ainda não tem uma conta?</span>
                  <button
                    type="button"
                    className="lovable-signup-link"
                    onClick={onContinueAsGuest}
                  >
                    Cadastre-se <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 2 }} />
                  </button>
                </div>

                {/* Atalho Discreto para Testes */}
                <div className="lovable-quick-test-bar">
                  <button
                    type="button"
                    className="lovable-quick-demo-pill"
                    onClick={handleQuickPatient}
                    title="Preencher com dados de teste da paciente Mariana"
                  >
                    👤 Preencher paciente de teste (Mariana)
                  </button>
                  <button
                    type="button"
                    className="lovable-quick-demo-pill"
                    onClick={onContinueAsGuest}
                    title="Acessar a agenda diretamente sem cadastro"
                  >
                    <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                    Ver agenda como visitante
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==========================================================
              FLUXO 2: ACESSO DE ADMINISTRADOR (EXCLUSIVO 2 PESSOAS)
              ========================================================== */}
          {role === 'admin' && (
            <div className="lovable-form-box fade-in-quick">
              <div className="lovable-header-text">
                <span className="lovable-kicker-tag admin-kicker">ÁREA RESTRITA • 2 ADMINISTRADORES</span>
                <h3 className="lovable-main-title">Painel de Gestão</h3>
                <p className="lovable-main-sub">
                  Acesso exclusivo para <strong>Dra. Ketllen Souza</strong> e <strong>Lennon (Webmaster)</strong>.
                </p>
              </div>

              {/* Seletor Visual dos 2 Administradores */}
              <div className="lovable-admin-switch-cards">
                <button
                  type="button"
                  className={`lovable-admin-card ${selectedAdmin === 'dra' ? 'active' : ''}`}
                  onClick={() => handleSelectAdmin('dra')}
                >
                  <div className="lovable-admin-card-icon dra-icon">
                    <Stethoscope size={18} />
                  </div>
                  <div className="lovable-admin-card-text">
                    <strong>Dra. Ketllen Souza</strong>
                    <span>Fisioterapeuta & Diretora</span>
                  </div>
                  {selectedAdmin === 'dra' && (
                    <CheckCircle2 size={16} className="lovable-admin-check" />
                  )}
                </button>

                <button
                  type="button"
                  className={`lovable-admin-card ${selectedAdmin === 'webmaster' ? 'active' : ''}`}
                  onClick={() => handleSelectAdmin('webmaster')}
                >
                  <div className="lovable-admin-card-icon webmaster-icon">
                    <Laptop size={18} />
                  </div>
                  <div className="lovable-admin-card-text">
                    <strong>Lennon</strong>
                    <span>Webmaster & Suporte do Site</span>
                  </div>
                  {selectedAdmin === 'webmaster' && (
                    <CheckCircle2 size={16} className="lovable-admin-check" />
                  )}
                </button>
              </div>

              <form onSubmit={handleAdminSubmit} className="lovable-form-body">
                {/* Campo E-mail do Administrador */}
                <div className="lovable-field-group">
                  <label className="lovable-field-label">E-mail Autorizado</label>
                  <div className="lovable-input-wrapper">
                    <Mail size={18} className="lovable-input-icon" />
                    <input
                      type="email"
                      className="lovable-input"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                <div className="lovable-field-group">
                  <label className="lovable-field-label">Chave de Segurança / Senha</label>
                  <div className="lovable-input-wrapper">
                    <Lock size={18} className="lovable-input-icon" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      className="lovable-input"
                      placeholder="Senha do administrador (admin2026)"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="lovable-eye-btn"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      tabIndex={-1}
                      aria-label={showAdminPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Botão de Entrar Admin */}
                <button type="submit" className="lovable-submit-btn">
                  <span>
                    {selectedAdmin === 'dra'
                      ? 'Entrar no Painel da Dra. Ketllen'
                      : 'Entrar como Webmaster (Suporte)'}
                  </span>
                  <ArrowRight size={18} className="lovable-submit-arrow" />
                </button>

                {/* Atalhos Rápidos para Teste */}
                <div className="lovable-quick-test-bar">
                  <button
                    type="button"
                    className="lovable-quick-demo-pill"
                    onClick={handleQuickDra}
                  >
                    🩺 Dra. Ketllen (1 clique)
                  </button>
                  <button
                    type="button"
                    className="lovable-quick-demo-pill"
                    onClick={handleQuickWebmaster}
                  >
                    💻 Lennon Webmaster (1 clique)
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Badge Inferior com Coração */}
          <div className="lovable-quote-pill">
            <Heart size={15} className="lovable-quote-heart" />
            <span>Um passo de cada vez, com você.</span>
          </div>
        </div>

        {/* Rodapé da Coluna Direita */}
        <footer className="lovable-form-footer">
          <span className="lovable-footer-copy">© 2026 Ketllen Souza Fisioterapia</span>
          <span className="lovable-footer-bullet">•</span>
          <span className="lovable-footer-motto">
            Feito para cuidar de você <Leaf size={12} className="lovable-footer-leaf" />
          </span>
        </footer>
      </div>
    </div>
  );
};
