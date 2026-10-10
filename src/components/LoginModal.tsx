'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Leaf,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { CLINIC_INFO } from '@/data/clinicData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string, role: 'patient' | 'admin') => void;
  onShowToast: (msg: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
}) => {
  const [role, setRole] = useState<'patient' | 'admin'>('patient');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      onShowToast('Por favor, informe seu WhatsApp ou E-mail.');
      return;
    }

    if (role === 'admin') {
      // Login de profissional/recepção
      onLoginSuccess('Ketlen Siqueira (Fisioterapeuta)', 'admin');
      onShowToast('✓ Bem-vinda ao painel profissional, Dra. Ketlen!');
    } else {
      // Login de paciente
      const name = identifier.includes('@')
        ? identifier.split('@')[0]
        : 'Mariana Duarte';
      onLoginSuccess(name, 'patient');
      onShowToast(`✓ Bem-vindo(a) ao seu espaço, ${name}!`);
    }

    onClose();
  };

  const handleQuickPatientDemo = () => {
    setRole('patient');
    setIdentifier('(11) 98765-4321');
    setPassword('123456');
    onShowToast('✓ Dados de paciente preenchidos para demonstração!');
  };

  const handleQuickAdminDemo = () => {
    setRole('admin');
    setIdentifier('contato@ketlenfisio.com.br');
    setPassword('admin2026');
    onShowToast('✓ Dados de fisioterapeuta preenchidos para demonstração!');
  };

  return (
    <div className="modal-backdrop-login" onClick={onClose}>
      <div className="login-modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Botão de Fechar */}
        <button
          type="button"
          className="login-close-btn"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        {/* Topo com Logo e Marca */}
        <div className="login-modal-header">
          <div className="brand-logo-circle login-logo-circle">
            <Leaf size={24} className="brand-leaf-icon" />
          </div>
          <h2 className="login-title">Acesse seu espaço de cuidado</h2>
          <p className="login-subtitle">
            Acompanhe suas sessões, histórico de tratamento e solicitações de encaixe na Ketlen Fisio.
          </p>
        </div>

        {/* Seletor de Perfil (Paciente ou Profissional) */}
        <div className="login-role-tabs">
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

        {/* Formulário de Login */}
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
              <span>Manter conectado neste dispositivo</span>
            </label>
          </div>

          {/* Botão de Entrar */}
          <button type="submit" className="btn-login-submit">
            <span>Entrar no Espaço</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Atalhos Rápidos para Demonstração */}
        <div className="login-demo-helpers">
          <span className="demo-helpers-title">Preenchimento rápido para testar:</span>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="btn-demo-pill"
              onClick={handleQuickPatientDemo}
            >
              👤 Paciente de Teste
            </button>
            <button
              type="button"
              className="btn-demo-pill"
              onClick={handleQuickAdminDemo}
            >
              🩺 Fisioterapeuta Dra. Ketlen
            </button>
          </div>
        </div>

        {/* Rodapé Acolhedor */}
        <div className="login-modal-footer">
          <p className="login-footer-motto">
            <em>&quot;{CLINIC_INFO.motto}&quot;</em>
          </p>
        </div>
      </div>
    </div>
  );
};
