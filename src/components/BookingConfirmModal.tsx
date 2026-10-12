'use client';

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Sparkles,
  CheckCircle2,
  Send,
  MessageCircle,
  Activity,
  Leaf
} from 'lucide-react';
import { CareType, ScheduledAppointment } from '@/types';
import { CLINIC_INFO } from '@/data/clinicData';
import { generateGoogleCalendarUrl } from '@/utils/calendar';

interface BookingConfirmModalProps {
  isOpen: boolean;
  careType: CareType;
  dateIso: string;
  time: string;
  onClose: () => void;
  onConfirmBooking: (appointment: ScheduledAppointment) => void;
  onShowToast: (msg: string) => void;
}

export const BookingConfirmModal: React.FC<BookingConfirmModalProps> = ({
  isOpen,
  careType,
  dateIso,
  time,
  onClose,
  onConfirmBooking,
  onShowToast,
}) => {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [isFirstTime, setIsFirstTime] = useState<'sim' | 'nao'>('sim');
  const [reason, setReason] = useState('');

  const [confirmedAppointment, setConfirmedAppointment] = useState<ScheduledAppointment | null>(null);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    setConfirmedAppointment(null);
    onClose();
  };

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

  const formatDateDisplay = (isoStr: string) => {
    if (!isoStr) return '';
    const parts = isoStr.split('-');
    if (parts.length < 3) return isoStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${days[d.getDay()]}, ${day} de ${months[d.getMonth()]}`;
  };

  const handleOpenGoogleCalendar = (apt: ScheduledAppointment) => {
    const careLabel = apt.careType === 'fisioterapia' ? 'Fisioterapia' : 'Pilates';
    const url = generateGoogleCalendarUrl({
      title: `${careLabel} - Ketllen Souza Fisioterapia`,
      description: `Sessão agendada na Ketllen Souza Fisioterapia.\nPaciente: ${apt.patientName}\nCódigo: ${apt.id}\nObservações: ${apt.notes || 'Nenhuma'}`,
      dateIso: apt.date,
      timeStr: apt.time,
      durationMinutes: 50,
    });
    window.open(url, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      onShowToast('Por favor, informe seu nome completo.');
      return;
    }
    if (phone.length < 14) {
      onShowToast('Por favor, informe um WhatsApp válido com DDD.');
      return;
    }

    const bookingId = `KFISIO-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: ScheduledAppointment = {
      id: bookingId,
      careType,
      date: dateIso,
      time,
      patientName: patientName.trim(),
      phone,
      status: 'confirmado',
      isEncaixe: false,
      notes: reason.trim(),
      createdAt: new Date().toISOString(),
    };

    onConfirmBooking(newAppointment);
    setConfirmedAppointment(newAppointment);

    // Enviar mensagem no WhatsApp da Ketllen Souza Fisioterapia
    const careTitle = careType === 'fisioterapia' ? 'Fisioterapia' : 'Pilates';
    const dateFormatted = formatDateDisplay(dateIso);

    const text =
      `🌿 *AGENDAMENTO DE SESSÃO - KETLLEN SOUZA FISIOTERAPIA* 🌿\n\n` +
      `Olá! Gostaria de confirmar meu agendamento realizado no site:\n\n` +
      `📋 *Cuidado:* ${careTitle}\n` +
      `📅 *Data:* ${dateFormatted}\n` +
      `⏰ *Horário:* ${time}\n\n` +
      `👤 *Paciente:* ${patientName}\n` +
      `📱 *WhatsApp:* ${phone}\n` +
      `✨ *Primeira vez na clínica?* ${isFirstTime === 'sim' ? 'Sim' : 'Não, já sou paciente'}\n` +
      (reason ? `🎯 *Queixa / Motivo:* ${reason}\n` : '') +
      `\n🎫 *Código do Atendimento:* #${bookingId}\n` +
      `\n_Aguardo a confirmação da equipe. Obrigado(a)!_`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${CLINIC_INFO.phone}?text=${encoded}`, '_blank');

    onShowToast(`✓ Agendamento #${bookingId} solicitado com sucesso!`);
  };

  return (
    <div className="modal-backdrop-login" onClick={handleCloseModal}>
      <div className="login-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="login-close-btn"
          onClick={handleCloseModal}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        {confirmedAppointment ? (
          /* TELA DE SUCESSO COM GOOGLE AGENDA */
          <div className="booking-success-view">
            <div className="success-icon-badge">
              <CheckCircle2 size={42} color="#059669" />
            </div>
            <h2 className="success-title">Sessão Solicitada!</h2>
            <p className="success-sub">
              Seu agendamento foi registrado e o WhatsApp da clínica foi aberto para confirmação.
            </p>

            <div className="success-appointment-box">
              <div className="success-row">
                <span>Código:</span>
                <strong>#{confirmedAppointment.id}</strong>
              </div>
              <div className="success-row">
                <span>Data & Horário:</span>
                <strong>{formatDateDisplay(confirmedAppointment.date)} às {confirmedAppointment.time}</strong>
              </div>
              <div className="success-row">
                <span>Paciente:</span>
                <strong>{confirmedAppointment.patientName}</strong>
              </div>
            </div>

            {/* BOTÃO GOOGLE AGENDA (100% GRATUITO) */}
            <div className="calendar-sync-actions">
              <button
                type="button"
                className="btn-add-gcal"
                onClick={() => handleOpenGoogleCalendar(confirmedAppointment)}
              >
                <Calendar size={18} />
                <span>Adicionar ao Google Agenda (Gratuito)</span>
              </button>

              <button
                type="button"
                className="btn-finish-modal"
                onClick={handleCloseModal}
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO DE DADOS DO PACIENTE */
          <>
            <div className="login-modal-header">
              <div className="brand-logo-circle login-logo-circle">
                {careType === 'fisioterapia' ? (
                  <Activity size={24} color="#047857" />
                ) : (
                  <Leaf size={24} color="#047857" />
                )}
              </div>
              <h2 className="login-title">Confirmar Solicitação de Sessão</h2>
              <p className="login-subtitle">
                Revise os detalhes e informe seus dados para reserva do horário na Ketllen Souza Fisioterapia.
              </p>
            </div>

            {/* Resumo da Sessão Escolhida */}
            <div className="booking-review-summary-card">
              <div className="review-item-row">
                <span className="review-label">CUIDADO</span>
                <strong className="review-value" style={{ textTransform: 'capitalize' }}>
                  {careType}
                </strong>
              </div>
              <div className="review-item-row">
                <span className="review-label">DATA & HORÁRIO</span>
                <strong className="review-value" style={{ color: '#047857' }}>
                  {formatDateDisplay(dateIso)} às {time}
                </strong>
              </div>
            </div>

            {/* Formulário do Paciente */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-form-group">
                <label className="login-label">Nome Completo do Paciente *</label>
                <div className="login-input-wrapper">
                  <User size={17} className="login-input-icon" />
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Ex: Mariana Duarte"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-form-group">
                <label className="login-label">WhatsApp para Confirmação *</label>
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

              <div className="login-form-group">
                <label className="login-label">É sua primeira vez na clínica?</label>
                <div className="first-time-radio-group">
                  <button
                    type="button"
                    className={`first-time-pill ${isFirstTime === 'sim' ? 'active' : ''}`}
                    onClick={() => setIsFirstTime('sim')}
                  >
                    Sim, primeira sessão
                  </button>
                  <button
                    type="button"
                    className={`first-time-pill ${isFirstTime === 'nao' ? 'active' : ''}`}
                    onClick={() => setIsFirstTime('nao')}
                  >
                    Não, já sou paciente
                  </button>
                </div>
              </div>

              <div className="login-form-group">
                <label className="login-label">Motivo, dor ou objetivo principal</label>
                <input
                  type="text"
                  className="login-input"
                  style={{ paddingLeft: 14 }}
                  placeholder="Ex: Dores lombares, reabilitação de joelho, pilates..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-login-submit">
                <MessageCircle size={17} />
                <span>Confirmar e Enviar no WhatsApp</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
