'use client';

import React, { useState } from 'react';
import { User, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { PatientUser } from '@/types';

interface MyProfileViewProps {
  currentUser: PatientUser;
  onSaveProfile: (user: PatientUser) => void;
  onShowToast: (msg: string) => void;
  onGoToDraDashboard?: () => void;
}

export const MyProfileView: React.FC<MyProfileViewProps> = ({
  currentUser,
  onSaveProfile,
  onShowToast,
  onGoToDraDashboard,
}) => {
  const [name, setName] = useState(currentUser.name || 'Mariana Duarte');
  const [phone, setPhone] = useState(currentUser.phone || '(11) 98765-4321');
  const [email, setEmail] = useState(currentUser.email || 'mariana.duarte@email.com');
  const [notes, setNotes] = useState(currentUser.notes || 'Dores posturais na região lombar após longas horas de trabalho.');

  const formatPhone = (val: string) => {
    let clean = val.replace(/\D/g, '');
    if (clean.length > 11) clean = clean.slice(0, 11);
    if (clean.length > 6) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
    } else if (clean.length > 2) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    }
    return clean;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name,
      phone,
      email,
      notes,
    });
    onShowToast('✓ Dados do perfil atualizados com sucesso!');
  };

  return (
    <div className="subview-container">
      <div className="subview-header">
        <div>
          <span className="header-kicker">INFORMAÇÕES PESSOAIS</span>
          <h2 className="header-main-title">Meu perfil</h2>
          <p className="header-subtitle">
            Mantenha seus dados atualizados para contato e histórico de atendimento na Ketllen Souza Fisioterapia.
          </p>
        </div>

        {onGoToDraDashboard && (
          <button
            type="button"
            className="btn-new-appointment-top"
            onClick={onGoToDraDashboard}
            style={{ background: '#2d5a4c' }}
          >
            <span>Acessar Painel da Dra.</span>
          </button>
        )}
      </div>

      <div className="profile-card-container">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-avatar-circle">
            <User size={36} color="#047857" />
          </div>

          <div className="login-form-group">
            <label className="login-label">Nome Completo</label>
            <div className="login-input-wrapper">
              <User size={17} className="login-input-icon" />
              <input
                type="text"
                className="login-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label className="login-label">WhatsApp / Celular</label>
            <div className="login-input-wrapper">
              <Phone size={17} className="login-input-icon" />
              <input
                type="tel"
                className="login-input"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label className="login-label">E-mail</label>
            <div className="login-input-wrapper">
              <Mail size={17} className="login-input-icon" />
              <input
                type="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label className="login-label">Histórico de Queixas / Observações Médicas</label>
            <textarea
              className="login-input"
              style={{ paddingLeft: 14, minHeight: 90, paddingTop: 10 }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Hérnia de disco, cirurgias prévias, laudos de exames..."
            />
          </div>

          <button
            type="submit"
            className="btn-submit-booking"
            style={{ marginTop: 8 }}
          >
            <span>Salvar Alterações</span>
          </button>
        </form>
      </div>
    </div>
  );
};

