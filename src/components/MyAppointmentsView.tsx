'use client';

import React, { useState } from 'react';
import {
  ClipboardList,
  Calendar,
  Clock,
  Activity,
  Leaf,
  MessageCircle,
  Plus,
  CheckCircle2,
  AlertCircle,
  CalendarPlus,
  Dumbbell,
  Sparkles,
  PlayCircle,
  Eye,
  X,
  Target,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ScheduledAppointment, HomeExercise } from '@/types';
import { CLINIC_INFO } from '@/data/clinicData';
import {
  generateGoogleCalendarUrl,
  openWhatsAppDirect,
  WhatsAppSendMode
} from '@/utils/calendar';

interface MyAppointmentsViewProps {
  appointments: ScheduledAppointment[];
  homeExercises?: HomeExercise[];
  onGoToSchedule: () => void;
  onCancelAppointment: (id: string) => void;
}

export const MyAppointmentsView: React.FC<MyAppointmentsViewProps> = ({
  appointments,
  homeExercises = [],
  onGoToSchedule,
  onCancelAppointment,
}) => {
  const [activeVisualExercise, setActiveVisualExercise] = useState<HomeExercise | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const handleToggleComplete = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenWhatsApp = (apt: ScheduledAppointment, mode: WhatsAppSendMode = 'auto') => {
    const careLabel = apt.careType === 'fisioterapia' ? 'Fisioterapia' : 'Pilates';
    const text =
      `🌿 *CONSULTA AGENDADA • DRA. KETLLEN SOUZA* 🌿\n\n` +
      `Olá, Dra. Ketllen! Gostaria de falar sobre meu agendamento na clínica:\n\n` +
      `📋 *Atendimento:* ${careLabel}\n` +
      `📅 *Data da Consulta:* ${formatDatePretty(apt.date)}\n` +
      `⏰ *Horário Marcado:* ${apt.time} (50 min)\n` +
      `👤 *Paciente:* ${apt.patientName}\n` +
      `🎫 *Código:* #${apt.id}\n\n` +
      `_Tudo certo para a nossa sessão? Muito obrigado(a)!_`;

    openWhatsAppDirect({
      phone: CLINIC_INFO.draPhone || CLINIC_INFO.phone,
      text,
      mode,
    });
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

  const formatDatePretty = (isoStr: string) => {
    try {
      const parts = isoStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      }
      return isoStr;
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="subview-container">
      <div className="subview-header">
        <div>
          <span className="header-kicker">HISTÓRICO & PRÓXIMAS CONSULTAS</span>
          <h2 className="header-main-title">Meus agendamentos</h2>
          <p className="header-subtitle">
            Acompanhe suas sessões marcadas, fila de encaixe e exercícios prescritos.
          </p>
        </div>

        <button
          type="button"
          className="btn-new-appointment-top"
          onClick={onGoToSchedule}
        >
          <Plus size={16} />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Lista de Agendamentos */}
      {appointments.length === 0 ? (
        <div className="empty-appointments-box">
          <div className="empty-icon-circle">
            <Calendar size={28} color="#059669" />
          </div>
          <h3 className="empty-title">Você ainda não possui horários agendados</h3>
          <p className="empty-desc">
            Escolha uma data e horário disponível para iniciar sua recuperação ou suas aulas de Pilates com a Dra. Ketllen.
          </p>
          <button
            type="button"
            className="btn-schedule-now"
            onClick={onGoToSchedule}
          >
            Agendar Primeira Sessão
          </button>
        </div>
      ) : (
        <div className="appointments-list-grid">
          {appointments.map((apt) => {
            const isFisio = apt.careType === 'fisioterapia';

            return (
              <div key={apt.id} className={`appointment-card-full ${isFisio ? 'card-fisio' : 'card-pilates'}`}>
                {/* Topo do Card: Tipo de Cuidado, Encaixe, Código e Status */}
                <div className="apt-card-top-bar">
                  <div className="apt-badges-left">
                    <span className={`apt-badge-care-pill ${isFisio ? 'pill-fisio' : 'pill-pilates'}`}>
                      {isFisio ? <Activity size={14} /> : <Leaf size={14} />}
                      <span>{isFisio ? 'Fisioterapia' : 'Pilates'}</span>
                    </span>

                    {apt.isEncaixe && (
                      <span className="apt-badge-encaixe-pill">
                        <Sparkles size={12} />
                        <span>Encaixe Confirmado</span>
                      </span>
                    )}
                  </div>

                  <div className="apt-badges-right">
                    <span className="apt-code-id">#{apt.id}</span>
                    <span className={`apt-status-tag status-${apt.status}`}>
                      <CheckCircle2 size={13} />
                      <span>{apt.status === 'concluido' ? 'Concluído' : apt.status === 'confirmado' ? 'Confirmado' : apt.status}</span>
                    </span>
                  </div>
                </div>

                {/* Informações Principais: Paciente e Procedimento */}
                <div className="apt-patient-section">
                  <h3 className="apt-patient-title">{apt.patientName}</h3>
                  <span className="apt-care-subtitle">
                    {isFisio ? 'Sessão Individual • Reabilitação & Postura' : 'Pilates Clínico • Estúdio Reformer'}
                  </span>
                </div>

                {/* Caixa em Destaque: Data e Horário */}
                <div className="apt-schedule-highlight-box">
                  <div className="apt-schedule-item">
                    <div className="apt-schedule-icon-wrap">
                      <Calendar size={16} />
                    </div>
                    <div className="apt-schedule-text-col">
                      <span className="apt-schedule-label">Data da Consulta</span>
                      <strong className="apt-schedule-val">{formatDatePretty(apt.date)}</strong>
                    </div>
                  </div>

                  <div className="apt-schedule-divider" />

                  <div className="apt-schedule-item">
                    <div className="apt-schedule-icon-wrap">
                      <Clock size={16} />
                    </div>
                    <div className="apt-schedule-text-col">
                      <span className="apt-schedule-label">Horário Marcado</span>
                      <strong className="apt-schedule-val">{apt.time} (50 min)</strong>
                    </div>
                  </div>
                </div>

                {/* Motivo / Queixa (se houver) */}
                {apt.notes && (
                  <div className="apt-notes-box">
                    <Target size={14} className="apt-notes-icon" />
                    <div className="apt-notes-content">
                      <strong>Motivo informado:</strong> {apt.notes}
                    </div>
                  </div>
                )}

                {/* Ações do Card */}
                <div className="apt-card-actions">
                  <button
                    type="button"
                    className="apt-btn-action apt-btn-calendar"
                    onClick={() => handleOpenGoogleCalendar(apt)}
                    title="Adicionar evento à sua conta do Google Agenda (Gratuito)"
                  >
                    <CalendarPlus size={15} />
                    <span>Google Agenda</span>
                  </button>

                  <button
                    type="button"
                    className="apt-btn-action apt-btn-whatsapp"
                    onClick={() => handleOpenWhatsApp(apt, 'auto')}
                    title="Conversar diretamente com a Dra. Ketllen no WhatsApp"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp Dra. Ketllen</span>
                  </button>

                  <button
                    type="button"
                    className="apt-btn-action apt-btn-cancel"
                    onClick={() => onCancelAppointment(apt.id)}
                    title="Cancelar ou liberar este horário"
                  >
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SEÇÃO: MINHAS ORIENTAÇÕES & EXERCÍCIOS PARA CASA (COM DEMONSTRAÇÃO VISUAL) */}
      {homeExercises.length > 0 && (
        <div className="patient-home-exercises-block">
          <div className="exercises-section-header">
            <div className="icon-leaf-circle">
              <Sparkles size={18} color="#047857" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 className="section-title-clean">Minhas Orientações & Exercícios para Casa</h3>
                <span className="badge-visual-tag">🎥 Com Guia Postural</span>
              </div>
              <p className="section-sub-clean">
                Prescritos individualmente pela <strong>Dra. Ketllen Souza</strong> com passo a passo e dicas posturais.
              </p>
            </div>
          </div>

          <div className="patient-exercises-grid">
            {homeExercises.map((ex) => {
              const isDone = completedIds.includes(ex.id);

              return (
                <div key={ex.id} className={`patient-exercise-card ${isDone ? 'exercise-card-done' : ''}`}>
                  <div className="p-ex-top">
                    <div>
                      <h4 className="p-ex-title">{ex.title}</h4>
                      {ex.visualGuide && (
                        <span className="p-ex-badge-category">
                          {ex.visualGuide.badge}
                        </span>
                      )}
                    </div>
                    <span className="p-ex-tag">{ex.careType === 'fisioterapia' ? 'Fisio' : 'Pilates'}</span>
                  </div>

                  <div className="p-ex-meta">
                    <span>🔁 {ex.repetitions}</span>
                    <span>⏰ {ex.frequency}</span>
                  </div>

                  <p className="p-ex-instructions">{ex.instructions}</p>

                  {ex.visualGuide && (
                    <div className="p-ex-target-muscle">
                      <Target size={13} color="#059669" />
                      <span><strong>Foco:</strong> {ex.visualGuide.targetMuscle}</span>
                    </div>
                  )}

                  {/* Ações do Exercício: Demonstração Visual e Concluir */}
                  <div className="p-ex-actions-row">
                    {ex.visualGuide && (
                      <button
                        type="button"
                        className="btn-ex-visual-guide"
                        onClick={() => setActiveVisualExercise(ex)}
                      >
                        <Eye size={15} />
                        <span>Ver Guia & Postura</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className={`btn-ex-check-done ${isDone ? 'done' : ''}`}
                      onClick={() => handleToggleComplete(ex.id)}
                    >
                      {isDone ? (
                        <>
                          <Check size={14} />
                          <span>Feito Hoje!</span>
                        </>
                      ) : (
                        <span>Marcar como feito</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL DE DEMONSTRAÇÃO VISUAL DO EXERCÍCIO */}
      {activeVisualExercise && activeVisualExercise.visualGuide && (
        <div className="modal-backdrop-login" onClick={() => setActiveVisualExercise(null)}>
          <div className="exercise-visual-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="login-close-btn"
              onClick={() => setActiveVisualExercise(null)}
              aria-label="Fechar Guia"
            >
              <X size={18} />
            </button>

            <div className="ex-modal-header">
              <div className="brand-logo-circle" style={{ background: '#ecfdf5', color: '#047857' }}>
                <Activity size={20} />
              </div>
              <div>
                <span className="ex-modal-tag">GUIA POSTURAL OFICIAL DA DRA. KETLLEN</span>
                <h3 className="ex-modal-title">{activeVisualExercise.title}</h3>
                <span className="ex-modal-subtitle">{activeVisualExercise.visualGuide.badge}</span>
              </div>
            </div>

            {/* Painel de Foco Muscular e Meta */}
            <div className="ex-focus-box">
              <div className="focus-item">
                <Target size={16} color="#059669" />
                <div>
                  <strong>Músculos Trabalhados:</strong>
                  <p>{activeVisualExercise.visualGuide.targetMuscle}</p>
                </div>
              </div>
              <div className="focus-item">
                <Clock size={16} color="#059669" />
                <div>
                  <strong>Dose Diária:</strong>
                  <p>{activeVisualExercise.repetitions} • {activeVisualExercise.frequency}</p>
                </div>
              </div>
            </div>

            {/* Passo a Passo com Marcadores Visuais */}
            <div className="ex-steps-section">
              <h4 className="ex-steps-heading">Passo a Passo da Execução Correta:</h4>
              <div className="ex-steps-timeline">
                {activeVisualExercise.visualGuide.steps.map((step, idx) => (
                  <div key={idx} className="ex-step-item">
                    <div className="step-number-circle">{idx + 1}</div>
                    <div className="step-text-content">
                      <p>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dica Postural de Ouro da Dra. Ketllen */}
            <div className="ex-posture-warning-card">
              <div className="posture-icon-col">
                <ShieldCheck size={20} color="#059669" />
              </div>
              <div className="posture-text-col">
                <strong>Dica Postural da Dra. Ketllen:</strong>
                <p>{activeVisualExercise.visualGuide.postureTips}</p>
              </div>
            </div>

            {/* Botão de Concluir */}
            <button
              type="button"
              className="btn-finish-modal"
              onClick={() => {
                handleToggleComplete(activeVisualExercise.id);
                setActiveVisualExercise(null);
              }}
            >
              <CheckCircle2 size={16} />
              <span>Concluir e Salvar no Meu Histórico</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
