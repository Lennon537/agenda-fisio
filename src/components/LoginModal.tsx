'use client';

import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Stethoscope,
  Laptop,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { CLINIC_INFO } from '@/data/clinicData';
import { AdminType } from '@/types';
import { Modal } from '@/components/Modal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string, role: 'patient' | 'admin', adminType?: AdminType) => void;
  onShowToast: (msg: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
}) => {
  const [role, setRole] = useState<'patient' | 'admin'>('patient');

  // Paciente
  const [patientInput, setPatientInput] = useState('');
  const [patientName, setPatientName] = useState('');

  // Admin
  const [selectedAdmin, setSelectedAdmin] = useState<AdminType>('dra');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'admin') {
      if (!adminPassword.trim()) {
        onShowToast('Por favor, informe a senha de administrador.');
        return;
      }
      if (adminPassword.trim() !== 'admin2026') {
        onShowToast('❌ Senha de administrador incorreta. Acesso não autorizado.');
        return;
      }
      if (selectedAdmin === 'dra') {
        onLoginSuccess('Dra. Ketllen Souza', 'admin', 'dra');
        onShowToast('✓ Bem-vinda ao painel profissional, Dra. Ketllen!');
      } else {
        onLoginSuccess('Lennon (Webmaster)', 'admin', 'webmaster');
        onShowToast('✓ Painel administrativo de Webmaster ativo!');
      }
    } else {
      if (!patientInput.trim()) {
        onShowToast('Por favor, informe seu WhatsApp ou E-mail.');
        return;
      }
      const name = patientName.trim()
        ? patientName.trim()
        : patientInput.includes('@')
        ? patientInput.split('@')[0]
        : 'Mariana Duarte';
      onLoginSuccess(name, 'patient');
      onShowToast(`✓ Bem-vindo(a) ao seu espaço, ${name}!`);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      headerIcon={<Leaf size={22} className="brand-leaf-icon" />}
      title="Acessar ou Alternar Conta"
      subtitle={
        role === 'patient'
          ? 'Espaço exclusivo para acompanhamento de consultas'
          : 'Acesso restrito para administradores autorizados'
      }
      closeButtonAriaLabel="Fechar janela de login"
      footer={
        <div style={{ textAlign: 'center', width: '100%' }}>
          <p className="login-footer-motto" style={{ margin: 0 }}>
            <em>&quot;{CLINIC_INFO.motto}&quot;</em>
          </p>
        </div>
      }
    >
      {/* Seletor de Perfil (Paciente ou Administrador) */}
      <div className="login-segmented-tabs" style={{ marginBottom: 18 }}>
        <button
          type="button"
          className={`login-segment-btn ${role === 'patient' ? 'active' : ''}`}
          onClick={() => setRole('patient')}
        >
          <User size={15} />
          <span>Sou Paciente</span>
        </button>
        <button
          type="button"
          className={`login-segment-btn ${role === 'admin' ? 'active' : ''}`}
          onClick={() => setRole('admin')}
        >
          <ShieldCheck size={15} />
          <span>Administrador</span>
          <span className="login-admin-counter-pill">2 contas</span>
        </button>
      </div>

      {/* Formulário de Login */}
      <form onSubmit={handleSubmit} className="login-form">
        {role === 'patient' ? (
          <>
            <div className="login-form-group">
              <label className="login-label">WhatsApp ou E-mail</label>
              <div className="login-input-wrapper">
                <Phone size={17} className="login-input-icon" />
                <input
                  type="text"
                  className="login-input"
                  placeholder="Ex: (11) 98765-4321 ou e-mail"
                  value={patientInput}
                  onChange={(e) => setPatientInput(e.target.value)}
                  required
                />
              </div>
            </div>

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
          </>
        ) : (
          <>
            {/* Alerta de 2 Administradores */}
            <div className="admin-security-alert" style={{ marginBottom: 14 }}>
              <div className="admin-alert-icon">
                <ShieldCheck size={16} color="#059669" />
              </div>
              <div className="admin-alert-text">
                <strong>Acesso Restrito: 2 Administradores</strong>
                <span>Apenas a Dra. Ketllen Souza e o Webmaster (Lennon).</span>
              </div>
            </div>

            {/* Seletor Visual dos 2 Administradores */}
            <div className="admin-selector-wrapper" style={{ marginBottom: 14 }}>
              <div className="admin-cards-grid">
                <button
                  type="button"
                  className={`admin-card-btn ${selectedAdmin === 'dra' ? 'active' : ''}`}
                  onClick={() => setSelectedAdmin('dra')}
                >
                  <div className="admin-card-avatar dra-avatar">
                    <Stethoscope size={16} />
                  </div>
                  <div className="admin-card-info">
                    <strong className="admin-card-name">Dra. Ketllen Souza</strong>
                    <span className="admin-card-badge">Fisioterapeuta</span>
                  </div>
                  {selectedAdmin === 'dra' && (
                    <div className="admin-card-check">
                      <CheckCircle2 size={15} />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  className={`admin-card-btn ${selectedAdmin === 'webmaster' ? 'active' : ''}`}
                  onClick={() => setSelectedAdmin('webmaster')}
                >
                  <div className="admin-card-avatar webmaster-avatar">
                    <Laptop size={16} />
                  </div>
                  <div className="admin-card-info">
                    <strong className="admin-card-name">Lennon</strong>
                    <span className="admin-card-badge">Webmaster</span>
                  </div>
                  {selectedAdmin === 'webmaster' && (
                    <div className="admin-card-check">
                      <CheckCircle2 size={15} />
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div className="login-form-group">
              <div className="password-header-row">
                <label className="login-label">Senha do Administrador</label>
              </div>
              <div className="login-input-wrapper">
                <KeyRound size={17} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Digite a senha de administrador"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Botão de Entrar */}
        <button type="submit" className="btn-login-submit" style={{ marginTop: 14 }}>
          <span>
            {role === 'patient'
              ? 'Entrar no Espaço do Paciente'
              : selectedAdmin === 'dra'
              ? 'Entrar no Painel da Dra. Ketllen'
              : 'Entrar como Webmaster'}
          </span>
          <ArrowRight size={16} />
        </button>
      </form>
    </Modal>
  );
};
