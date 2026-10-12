'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  User,
  Phone,
  AlertTriangle,
  ArrowRight,
  Send,
  Sparkles,
  Calendar,
  Smartphone,
  Globe,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { CareType, EncaixeRequest } from '@/types';
import { CLINIC_INFO } from '@/data/clinicData';
import {
  openWhatsAppDirect,
  WhatsAppSendMode,
  isMobileDevice
} from '@/utils/calendar';

interface EncaixeModalProps {
  isOpen: boolean;
  defaultCareType: CareType;
  onClose: () => void;
  onSubmitEncaixe: (request: EncaixeRequest) => void;
  onShowToast: (msg: string) => void;
}

export const EncaixeModal: React.FC<EncaixeModalProps> = ({
  isOpen,
  defaultCareType,
  onClose,
  onSubmitEncaixe,
  onShowToast,
}) => {
  const [careType, setCareType] = useState<CareType>(defaultCareType);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredShift, setPreferredShift] = useState<'manha' | 'tarde' | 'qualquer'>('qualquer');
  const [painLevel, setPainLevel] = useState<number>(7);
  const [reason, setReason] = useState('');
  const [sendMode, setSendMode] = useState<WhatsAppSendMode>('app');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSendMode(isMobileDevice() ? 'app' : 'web');
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

    if (!name.trim()) {
      onShowToast('Por favor, informe seu nome completo.');
      return;
    }
    if (phone.length < 14) {
      onShowToast('Por favor, informe um WhatsApp válido com DDD.');
      return;
    }

    const newEncaixe: EncaixeRequest = {
      id: `ENC-${Math.floor(100 + Math.random() * 900)}`,
      patientName: name.trim(),
      phone,
      careType,
      preferredShifts: [preferredShift],
      painLevel,
      reason: reason.trim() || 'Aguardando encaixe prioritário',
      status: 'aguardando',
      createdAt: new Date().toISOString(),
    };

    onSubmitEncaixe(newEncaixe);

    // Enviar mensagem direta para o WhatsApp da Dra. Ketllen Souza
    const careLabel = careType === 'fisioterapia' ? 'Fisioterapia' : 'Pilates';
    const shiftLabel =
      preferredShift === 'manha'
        ? 'Manhã'
        : preferredShift === 'tarde'
        ? 'Tarde'
        : 'Qualquer horário';

    const text =
      `🌿 *SOLICITAÇÃO DE ENCAIXE • DRA. KETLLEN SOUZA* 🌿\n\n` +
      `Olá, Dra. Ketllen! Gostaria de pedir um encaixe na sua agenda na clínica:\n\n` +
      `📋 *Atendimento:* ${careLabel}\n` +
      `⚡ *Nível de Dor/Desconforto:* ${painLevel}/10\n` +
      `🌅 *Preferência de Turno:* ${shiftLabel}\n` +
      `👤 *Paciente:* ${name}\n` +
      `📱 *Meu WhatsApp:* ${phone}\n` +
      (reason ? `📝 *Queixa / Motivo:* ${reason}\n` : '') +
      `\n🎫 *Código da Fila:* #${newEncaixe.id}\n` +
      `\n_Por favor, me avise caso abra uma desistência na sua agenda! Muito obrigado(a)._`;

    const draNumber = CLINIC_INFO.draPhone || CLINIC_INFO.phone;
    openWhatsAppDirect({
      phone: draNumber,
      text,
      mode: sendMode,
    });

    const modeLabel = sendMode === 'web' ? 'WhatsApp Web' : 'Aplicativo WhatsApp';
    onShowToast(`✓ Solicitação de encaixe enviada para a Dra. Ketllen via ${modeLabel}!`);
    onClose();
  };

  return (
    <div className="modal-backdrop-login" onClick={onClose}>
      <div className="login-modal-sheet modal-encaixe-sheet" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="login-close-btn"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="login-modal-header">
          <div className="encaixe-clock-badge">
            <Clock size={22} color="#047857" />
          </div>
          <h2 className="login-title">Solicitar Encaixe na Agenda</h2>
          <p className="login-subtitle">
            Não encontrou o horário ideal? Cadastre seu interesse e seja avisado(a) no WhatsApp assim que abrir uma vaga por desistência.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Cuidado */}
          <div className="login-form-group">
            <label className="login-label">Cuidado Necessário</label>
            <div className="role-selector-row">
              <button
                type="button"
                className={`role-select-pill ${careType === 'fisioterapia' ? 'active' : ''}`}
                onClick={() => setCareType('fisioterapia')}
              >
                🩺 Fisioterapia
              </button>
              <button
                type="button"
                className={`role-select-pill ${careType === 'pilates' ? 'active' : ''}`}
                onClick={() => setCareType('pilates')}
              >
                🧘‍♀️ Pilates
              </button>
            </div>
          </div>

          {/* Nome */}
          <div className="login-form-group">
            <label className="login-label">Nome Completo *</label>
            <div className="login-input-wrapper">
              <User size={17} className="login-input-icon" />
              <input
                type="text"
                className="login-input"
                placeholder="Ex: Amanda Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="login-form-group">
            <label className="login-label">WhatsApp para Aviso Imediato *</label>
            <div className="login-input-wrapper">
              <Phone size={17} className="login-input-icon" />
              <input
                type="tel"
                className="login-input"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Turno */}
          <div className="login-form-group">
            <label className="login-label">Preferência de Turno</label>
            <div className="shifts-toggle-row">
              <button
                type="button"
                className={`shift-btn ${preferredShift === 'manha' ? 'active' : ''}`}
                onClick={() => setPreferredShift('manha')}
              >
                Manhã
              </button>
              <button
                type="button"
                className={`shift-btn ${preferredShift === 'tarde' ? 'active' : ''}`}
                onClick={() => setPreferredShift('tarde')}
              >
                Tarde
              </button>
              <button
                type="button"
                className={`shift-btn ${preferredShift === 'qualquer' ? 'active' : ''}`}
                onClick={() => setPreferredShift('qualquer')}
              >
                Qualquer Horário
              </button>
            </div>
          </div>

          {/* Escala de Dor */}
          <div className="login-form-group pain-mini-slider-wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="login-label">Nível Atual de Dor / Desconforto</label>
              <span className="pain-counter-tag">{painLevel}/10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={painLevel}
              onChange={(e) => setPainLevel(parseInt(e.target.value, 10))}
              className="pain-range-slider"
            />
          </div>

          {/* Queixa */}
          <div className="login-form-group">
            <label className="login-label">Queixa ou Motivo Principal</label>
            <input
              type="text"
              className="login-input"
              style={{ paddingLeft: 14 }}
              placeholder="Ex: Travamento na lombar, reposição de pilates..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* SELETOR DE CANAL: APLICATIVO VS WHATSAPP WEB */}
          <div className="wa-dispatch-selector-box">
            <div className="wa-dispatch-header">
              <div className="wa-dispatch-title-row">
                <span className="wa-dispatch-label">Enviar diretamente para:</span>
                <span className="wa-dispatch-target-badge">
                  <ShieldCheck size={13} />
                  Dra. Ketllen Souza ({CLINIC_INFO.draPhoneFormatted || CLINIC_INFO.phoneFormatted})
                </span>
              </div>
              <span className="wa-dispatch-sub">
                Escolha por onde deseja abrir a conversa de encaixe:
              </span>
            </div>

            <div className="wa-dispatch-toggle-grid">
              <button
                type="button"
                className={`wa-toggle-card ${sendMode === 'app' ? 'active' : ''}`}
                onClick={() => setSendMode('app')}
              >
                <div className="wa-toggle-icon">
                  <Smartphone size={17} />
                </div>
                <div className="wa-toggle-texts">
                  <strong>Aplicativo WhatsApp</strong>
                  <span>Abre no App do celular ou computador</span>
                </div>
                {sendMode === 'app' && <span className="wa-toggle-check">✓</span>}
              </button>

              <button
                type="button"
                className={`wa-toggle-card ${sendMode === 'web' ? 'active' : ''}`}
                onClick={() => setSendMode('web')}
              >
                <div className="wa-toggle-icon">
                  <Globe size={17} />
                </div>
                <div className="wa-toggle-texts">
                  <strong>WhatsApp Web</strong>
                  <span>Abre direto no navegador (sem instalar)</span>
                </div>
                {sendMode === 'web' && <span className="wa-toggle-check">✓</span>}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-login-submit btn-encaixe-submit btn-wa-submit">
            <MessageCircle size={18} />
            <span>
              Enviar Encaixe para Dra. Ketllen ({sendMode === 'web' ? 'WhatsApp Web' : 'Aplicativo'})
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
