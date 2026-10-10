'use client';

import React from 'react';
import {
  ClipboardList,
  Calendar,
  Clock,
  Activity,
  Leaf,
  MessageCircle,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ScheduledAppointment, HomeExercise } from '@/types';
import { CLINIC_INFO } from '@/data/clinicData';
import { generateGoogleCalendarUrl } from '@/utils/calendar';
import { CalendarPlus, Dumbbell, Sparkles } from 'lucide-react';

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
  const handleOpenWhatsApp = (apt: ScheduledAppointment) => {
    const text = encodeURIComponent(
      `Olá! Gostaria de falar sobre meu agendamento na Ketlen Fisio:\n` +
      `Código: #${apt.id}\nData: ${apt.date} às ${apt.time}\nPaciente: ${apt.patientName}`
    );
    window.open(`https://wa.me/${CLINIC_INFO.phone}?text=${text}`, '_blank');
  };

  const handleOpenGoogleCalendar = (apt: ScheduledAppointment) => {
    const careLabel = apt.careType === 'fisioterapia' ? 'Fisioterapia' : 'Pilates';
    const url = generateGoogleCalendarUrl({
      title: `${careLabel} - Ketlen Fisio`,
      description: `Sessão agendada na Ketlen Fisio.\nPaciente: ${apt.patientName}\nCódigo: ${apt.id}\nObservações: ${apt.notes || 'Nenhuma'}`,
      dateIso: apt.date,
      timeStr: apt.time,
      durationMinutes: 50,
    });
    window.open(url, '_blank');
  };

  return (
    <div className="subview-container">
      <div className="subview-header">
        <div>
          <span className="header-kicker">HISTÓRICO E SESSÕES</span>
          <h2 className="header-main-title">Meus agendamentos</h2>
          <p className="header-subtitle">
            Acompanhe suas sessões, adicione ao Google Agenda e veja suas orientações de exercícios para casa.
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

      {appointments.length === 0 ? (
        <div className="empty-subview-card">
          <div className="empty-icon-wrap">
            <ClipboardList size={32} color="#047857" />
          </div>
          <h3 className="empty-title">Você ainda não possui agendamentos</h3>
          <p className="empty-desc">
            Escolha o melhor dia e horário para iniciar seu cuidado e reabilitação conosco.
          </p>
          <button
            type="button"
            className="btn-submit-booking"
            onClick={onGoToSchedule}
            style={{ width: 'auto', padding: '10px 24px' }}
          >
            <span>Agendar Primeira Sessão</span>
          </button>
        </div>
      ) : (
        <div className="appointments-list-cards">
          {appointments.map((apt) => {
            const isFisio = apt.careType === 'fisioterapia';

            return (
              <div key={apt.id} className="appointment-view-card">
                <div className="apt-card-header">
                  <div className="apt-type-badge">
                    {isFisio ? (
                      <>
                        <Activity size={14} color="#047857" />
                        <span>Fisioterapia</span>
                      </>
                    ) : (
                      <>
                        <Leaf size={14} color="#047857" />
                        <span>Pilates</span>
                      </>
                    )}
                  </div>
                  <span className={`apt-status-pill status-${apt.status}`}>
                    {apt.status === 'confirmado' ? '✓ Confirmado' : apt.status === 'concluido' ? '✓ Concluído' : 'Aguardando'}
                  </span>
                </div>

                <div className="apt-card-body">
                  <div className="apt-datetime-box">
                    <div className="apt-date-line">
                      <Calendar size={15} color="#047857" />
                      <strong>{apt.date}</strong>
                    </div>
                    <div className="apt-time-line">
                      <Clock size={15} color="#047857" />
                      <span>{apt.time}</span>
                    </div>
                  </div>

                  <div className="apt-patient-line">
                    <span className="p-name">Paciente: <strong>{apt.patientName}</strong></span>
                    <span className="p-code">Código: #{apt.id}</span>
                  </div>

                  {apt.notes && (
                    <p className="apt-notes-text">
                      <em>Motivo: {apt.notes}</em>
                    </p>
                  )}
                </div>

                {/* Ações da Sessão: Google Agenda + WhatsApp + Cancelar */}
                <div className="apt-card-footer">
                  <button
                    type="button"
                    className="btn-sync-gcal-card"
                    onClick={() => handleOpenGoogleCalendar(apt)}
                    title="Adicionar evento no seu Google Agenda gratuitamente"
                  >
                    <CalendarPlus size={14} />
                    <span>Google Agenda</span>
                  </button>

                  <button
                    type="button"
                    className="btn-talk-whatsapp"
                    onClick={() => handleOpenWhatsApp(apt)}
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    className="btn-cancel-apt"
                    onClick={() => onCancelAppointment(apt.id)}
                  >
                    Desmarcar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SEÇÃO: MINHAS ORIENTAÇÕES & EXERCÍCIOS PARA CASA (PRESCRIÇÃO DA DRA. KETLEN) */}
      {homeExercises.length > 0 && (
        <div className="patient-home-exercises-block">
          <div className="exercises-section-header">
            <div className="icon-leaf-circle">
              <Sparkles size={18} color="#047857" />
            </div>
            <div>
              <h3 className="section-title-clean">Minhas Orientações & Exercícios para Casa</h3>
              <p className="section-sub-clean">
                Prescritos individualmente pela <strong>Dra. Ketlen</strong> para acelerar sua recuperação entre as sessões.
              </p>
            </div>
          </div>

          <div className="patient-exercises-grid">
            {homeExercises.map((ex) => (
              <div key={ex.id} className="patient-exercise-card">
                <div className="p-ex-top">
                  <h4 className="p-ex-title">{ex.title}</h4>
                  <span className="p-ex-tag">{ex.careType === 'fisioterapia' ? 'Fisio' : 'Pilates'}</span>
                </div>

                <div className="p-ex-meta">
                  <span>🔁 {ex.repetitions}</span>
                  <span>⏰ {ex.frequency}</span>
                </div>

                <p className="p-ex-instructions">{ex.instructions}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

