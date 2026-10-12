'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  CalendarPlus,
  MessageCircle,
  Plus,
  Send,
  Activity,
  Heart,
  ChevronRight,
  Filter,
  Check,
  Trash2,
  ExternalLink,
  ClipboardList,
  Sparkles,
  Laptop,
  Printer,
  CalendarX,
  ShieldAlert,
  Target
} from 'lucide-react';
import {
  ScheduledAppointment,
  EncaixeRequest,
  PatientMedicalRecord,
  CareType,
  ClinicalEvolution,
  HomeExercise,
  BlockedSlot
} from '@/types';
import {
  generateGoogleCalendarUrl,
  generateWhatsAppReminderUrl
} from '@/utils/calendar';

interface DraDashboardViewProps {
  appointments: ScheduledAppointment[];
  encaixes: EncaixeRequest[];
  medicalRecords: PatientMedicalRecord[];
  blockedSlots?: BlockedSlot[];
  onUpdateAppointments: (appointments: ScheduledAppointment[]) => void;
  onUpdateEncaixes: (encaixes: EncaixeRequest[]) => void;
  onUpdateMedicalRecords: (records: PatientMedicalRecord[]) => void;
  onUpdateBlockedSlots?: (slots: BlockedSlot[]) => void;
  onShowToast: (msg: string) => void;
  userLoggedIn?: string | null;
}

export const DraDashboardView: React.FC<DraDashboardViewProps> = ({
  appointments,
  encaixes,
  medicalRecords,
  blockedSlots = [],
  onUpdateAppointments,
  onUpdateEncaixes,
  onUpdateMedicalRecords,
  onUpdateBlockedSlots,
  onShowToast,
  userLoggedIn,
}) => {
  const [currentTab, setCurrentTab] = useState<'agenda' | 'encaixes' | 'prontuario' | 'bloqueios'>('agenda');

  // Filtros da Agenda
  const [filterCare, setFilterCare] = useState<'todos' | 'fisioterapia' | 'pilates'>('todos');

  // Estado do Prontuário Selecionado
  const [selectedPatientName, setSelectedPatientName] = useState<string>(
    medicalRecords[0]?.patientName || 'Mariana Duarte'
  );

  // Modal de Exportação do Prontuário Oficial em PDF Timbrado
  const [isExportingRecord, setIsExportingRecord] = useState(false);

  // Modal para alocar Encaixe na Agenda
  const [allocatingEncaixe, setAllocatingEncaixe] = useState<EncaixeRequest | null>(null);
  const [allocatedDate, setAllocatedDate] = useState<string>('2026-10-12');
  const [allocatedTime, setAllocatedTime] = useState<string>('11:00');

  // Formulário de Nova Evolução no Prontuário
  const [newConduct, setNewConduct] = useState('');
  const [newPainLevel, setNewPainLevel] = useState(4);
  const [newObservations, setNewObservations] = useState('');

  // Formulário de Novo Exercício para Casa
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [exerciseReps, setExerciseReps] = useState('3 séries de 10 repetições');
  const [exerciseFreq, setExerciseFreq] = useState('1x ao dia');
  const [exerciseInstructions, setExerciseInstructions] = useState('');
  const [exerciseCare, setExerciseCare] = useState<CareType>('fisioterapia');
  const [exerciseCategory, setExerciseCategory] = useState<'fortalecimento' | 'mobilidade' | 'alivio' | 'respiracao'>('mobilidade');
  const [exerciseTarget, setExerciseTarget] = useState('Mobilidade da Coluna & Estabilidade');
  const [exercisePostureTip, setExercisePostureTip] = useState('Mantenha o alinhamento da coluna e respire profundamente sem trancos.');

  // Estado do Bloqueio Rápido de Horários & Folgas
  const [blockDate, setBlockDate] = useState('2026-10-16');
  const [blockShift, setBlockShift] = useState<'dia-todo' | 'manha' | 'tarde'>('dia-todo');
  const [blockReason, setBlockReason] = useState('Manutenção preventiva dos aparelhos Reformer');

  // Paciente selecionado atualmente
  const currentRecord = medicalRecords.find((r) => r.patientName === selectedPatientName) || medicalRecords[0];

  // Ações da Agenda
  const handleMarkComplete = (id: string) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status: 'concluido' as const } : a
    );
    onUpdateAppointments(updated);
    onShowToast('✓ Sessão concluída com sucesso!');
  };

  const handleCancelAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    onUpdateAppointments(updated);
    onShowToast('Agendamento cancelado.');
  };

  // Disparar Lembrete via WhatsApp
  const handleSendReminder = (apt: ScheduledAppointment, type: '24h' | '2h') => {
    const url = generateWhatsAppReminderUrl({
      phone: apt.phone,
      patientName: apt.patientName,
      careType: apt.careType,
      dateDisplay: apt.date,
      timeStr: apt.time,
      type: type,
    });
    window.open(url, '_blank');
    onShowToast(`Lembrete de ${type} gerado para ${apt.patientName}!`);
  };

  // Abrir no Google Agenda
  const handleOpenGoogleCalendar = (apt: ScheduledAppointment) => {
    const careLabel = apt.careType === 'fisioterapia' ? 'Fisioterapia' : 'Pilates';
    const url = generateGoogleCalendarUrl({
      title: `${careLabel} - ${apt.patientName} (Ketllen Souza Fisioterapia)`,
      description: `Sessão de ${careLabel}.\nPaciente: ${apt.patientName}\nTelefone: ${apt.phone}\nObservações: ${apt.notes || 'Nenhuma'}\nCódigo: ${apt.id}`,
      dateIso: apt.date,
      timeStr: apt.time,
      durationMinutes: 50,
    });
    window.open(url, '_blank');
  };

  // Aprovar Encaixe e Transformar em Agendamento
  const handleConfirmAllocation = () => {
    if (!allocatingEncaixe) return;

    const newApt: ScheduledAppointment = {
      id: `ENC-APT-${Date.now().toString().slice(-4)}`,
      careType: allocatingEncaixe.careType,
      date: allocatedDate,
      time: allocatedTime,
      patientName: allocatingEncaixe.patientName,
      phone: allocatingEncaixe.phone,
      status: 'confirmado',
      isEncaixe: true,
      notes: `Encaixe aprovado (Nível de dor relatado: ${allocatingEncaixe.painLevel}/10). Motivo: ${allocatingEncaixe.reason || 'Não informado'}`,
      createdAt: new Date().toISOString(),
    };

    const updatedApts = [newApt, ...appointments];
    const updatedEncaixes = encaixes.map((e) =>
      e.id === allocatingEncaixe.id ? { ...e, status: 'atendido' as const } : e
    );

    onUpdateAppointments(updatedApts);
    onUpdateEncaixes(updatedEncaixes);
    setAllocatingEncaixe(null);

    // Mensagem WhatsApp para avisar paciente
    const cleanPhone = allocatingEncaixe.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const careLabel = allocatingEncaixe.careType === 'fisioterapia' ? 'Fisioterapia' : 'Pilates';
    const msg = encodeURIComponent(
      `Olá, ${allocatingEncaixe.patientName}! 🌿\n\nTemos ótimas notícias da *Ketllen Souza Fisioterapia*: conseguimos um encaixe para você!\n\n📅 *Data:* ${allocatedDate}\n⏰ *Horário:* ${allocatedTime}\n🩺 *Atendimento:* ${careLabel}\n\nPor favor, confirme se você pode comparecer neste horário!`
    );
    window.open(`https://wa.me/${phoneWithCountry}?text=${msg}`, '_blank');

    onShowToast(`✓ Encaixe aprovado! Agendamento criado para ${allocatingEncaixe.patientName}.`);
  };

  // Adicionar Nova Evolução ao Prontuário
  const handleAddEvolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConduct.trim() || !currentRecord) return;

    const newEvol: ClinicalEvolution = {
      id: `EVOL-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      sessionNumber: currentRecord.evolutions.length + 1,
      conduct: newConduct,
      painLevel: newPainLevel,
      observations: newObservations || 'Sessão transcorrida sem intercorrências.',
    };

    const updatedRecords = medicalRecords.map((r) =>
      r.id === currentRecord.id
        ? {
            ...r,
            evolutions: [newEvol, ...r.evolutions],
            updatedAt: new Date().toISOString(),
          }
        : r
    );

    onUpdateMedicalRecords(updatedRecords);
    setNewConduct('');
    setNewObservations('');
    onShowToast('✓ Evolução clínica registrada no prontuário!');
  };

  // Adicionar Novo Exercício para Casa com Guia Visual Postural
  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseTitle.trim() || !currentRecord) return;

    const newEx: HomeExercise = {
      id: `EX-${Date.now()}`,
      title: exerciseTitle,
      repetitions: exerciseReps,
      frequency: exerciseFreq,
      instructions: exerciseInstructions,
      careType: exerciseCare,
      visualGuide: {
        category: exerciseCategory,
        badge: exerciseTarget,
        targetMuscle: exerciseTarget,
        steps: exerciseInstructions.split('\n').filter((s) => s.trim().length > 0),
        postureTips: exercisePostureTip,
        iconType: exerciseCategory === 'respiracao' ? 'breath' : exerciseCategory === 'mobilidade' ? 'spine' : 'strength',
      },
    };

    const updatedRecords = medicalRecords.map((r) =>
      r.id === currentRecord.id
        ? {
            ...r,
            homeExercises: [newEx, ...r.homeExercises],
            updatedAt: new Date().toISOString(),
          }
        : r
    );

    onUpdateMedicalRecords(updatedRecords);
    setIsAddingExercise(false);
    setExerciseTitle('');
    setExerciseInstructions('');
    onShowToast(`✓ Exercício com demonstração visual prescrito para ${currentRecord.patientName}!`);
  };

  // Remover Exercício
  const handleDeleteExercise = (exId: string) => {
    if (!currentRecord) return;
    const updatedRecords = medicalRecords.map((r) =>
      r.id === currentRecord.id
        ? {
            ...r,
            homeExercises: r.homeExercises.filter((x) => x.id !== exId),
          }
        : r
    );
    onUpdateMedicalRecords(updatedRecords);
    onShowToast('Exercício removido.');
  };

  // Bloqueio Rápido de Horários / Folgas
  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate || !blockReason.trim() || !onUpdateBlockedSlots) return;

    const newBlock: BlockedSlot = {
      id: `BLK-${Date.now().toString().slice(-5)}`,
      date: blockDate,
      shift: blockShift,
      reason: blockReason.trim(),
      createdAt: new Date().toISOString(),
    };

    onUpdateBlockedSlots([newBlock, ...blockedSlots]);
    onShowToast(`✓ Data ${blockDate} bloqueada na agenda da clínica!`);
    setBlockReason('');
  };

  const handleRemoveBlock = (blockId: string) => {
    if (!onUpdateBlockedSlots) return;
    onUpdateBlockedSlots(blockedSlots.filter((b) => b.id !== blockId));
    onShowToast('Bloqueio removido. Horários liberados na agenda!');
  };

  const pendingEncaixesCount = encaixes.filter((e) => e.status === 'aguardando').length;

  const filteredAppointments = appointments.filter((a) => {
    if (filterCare === 'todos') return true;
    return a.careType === filterCare;
  });

  return (
    <div className="dra-dashboard-wrapper">
      {/* Cabeçalho do Painel */}
      <div className="dra-header-card">
        <div className="dra-header-text">
          {userLoggedIn?.toLowerCase().includes('webmaster') ? (
            <>
              <div className="dra-badge-pill" style={{ background: '#0284c7', color: '#ffffff' }}>
                <Laptop size={14} />
                <span>PAINEL DE GESTÃO DO SITE & WEBMASTER</span>
              </div>
              <h1 className="dra-main-title">Gestão do Sistema • Lennon (Webmaster)</h1>
              <p className="dra-subtitle">
                Supervisão técnica da clínica, monitoramento dos agendamentos, fila de encaixes e banco de dados.
              </p>
            </>
          ) : (
            <>
              <div className="dra-badge-pill">
                <Sparkles size={14} />
                <span>PAINEL CLÍNICO & GESTÃO EXCLUSIVA</span>
              </div>
              <h1 className="dra-main-title">Espaço Clínico Dra. Ketllen Souza</h1>
              <p className="dra-subtitle">
                Gerencie os atendimentos diários, triagem de encaixes com urgência de dor e prontuários eletrônicos.
              </p>
            </>
          )}
        </div>

        {/* Resumo de Indicadores Rápidos */}
        <div className="dra-stats-grid">
          <div className="dra-stat-box">
            <span className="stat-number">{appointments.length}</span>
            <span className="stat-label">Sessões Agendadas</span>
          </div>
          <div className={`dra-stat-box ${pendingEncaixesCount > 0 ? 'highlight-alert' : ''}`}>
            <span className="stat-number">{pendingEncaixesCount}</span>
            <span className="stat-label">Encaixes Pendentes</span>
          </div>
          <div className="dra-stat-box">
            <span className="stat-number">{medicalRecords.length}</span>
            <span className="stat-label">Prontuários Ativos</span>
          </div>
        </div>
      </div>

      {/* Navegação entre as 3 Abas do Painel */}
      <div className="dra-tabs-bar">
        <button
          type="button"
          className={`dra-tab-btn ${currentTab === 'agenda' ? 'active' : ''}`}
          onClick={() => setCurrentTab('agenda')}
        >
          <Calendar size={18} />
          <span>Agenda & Lembretes</span>
          <span className="tab-pill-count">{appointments.length}</span>
        </button>

        <button
          type="button"
          className={`dra-tab-btn ${currentTab === 'encaixes' ? 'active' : ''}`}
          onClick={() => setCurrentTab('encaixes')}
        >
          <Clock size={18} />
          <span>Fila de Encaixes & Triagem</span>
          {pendingEncaixesCount > 0 && (
            <span className="tab-pill-count alert">{pendingEncaixesCount}</span>
          )}
        </button>

        <button
          type="button"
          className={`dra-tab-btn ${currentTab === 'prontuario' ? 'active' : ''}`}
          onClick={() => setCurrentTab('prontuario')}
        >
          <FileText size={18} />
          <span>Prontuário & Exercícios</span>
        </button>

        <button
          type="button"
          className={`dra-tab-btn ${currentTab === 'bloqueios' ? 'active' : ''}`}
          onClick={() => setCurrentTab('bloqueios')}
        >
          <CalendarX size={18} />
          <span>Bloqueio & Folgas</span>
          {blockedSlots && blockedSlots.length > 0 && (
            <span className="tab-pill-count" style={{ background: '#ef4444', color: '#ffffff' }}>
              {blockedSlots.length}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================
          ABA 1: AGENDA DA CLÍNICA & LEMBRETES DO WHATSAPP / GOOGLE
          ======================================================== */}
      {currentTab === 'agenda' && (
        <div className="dra-agenda-section">
          <div className="agenda-toolbar-row">
            <div className="filter-pill-group">
              <span className="filter-label">Filtrar por:</span>
              <button
                type="button"
                className={`filter-btn ${filterCare === 'todos' ? 'active' : ''}`}
                onClick={() => setFilterCare('todos')}
              >
                Todos
              </button>
              <button
                type="button"
                className={`filter-btn ${filterCare === 'fisioterapia' ? 'active' : ''}`}
                onClick={() => setFilterCare('fisioterapia')}
              >
                Fisioterapia
              </button>
              <button
                type="button"
                className={`filter-btn ${filterCare === 'pilates' ? 'active' : ''}`}
                onClick={() => setFilterCare('pilates')}
              >
                Pilates
              </button>
            </div>
          </div>

          <div className="dra-appointments-table">
            {filteredAppointments.length === 0 ? (
              <div className="empty-state-box">
                <Calendar size={36} className="empty-icon" />
                <h3>Nenhum agendamento encontrado para este filtro</h3>
                <p>Assim que os pacientes agendarem pelo site, eles aparecerão aqui automaticamente.</p>
              </div>
            ) : (
              filteredAppointments.map((apt) => (
                <div key={apt.id} className="dra-appointment-card">
                  <div className="apt-main-info">
                    <div className="apt-time-badge">
                      <span className="apt-time">{apt.time}</span>
                      <span className="apt-date">{apt.date}</span>
                    </div>

                    <div className="apt-patient-details">
                      <div className="patient-name-row">
                        <h3 className="patient-name">{apt.patientName}</h3>
                        <span className={`care-badge-tag ${apt.careType}`}>
                          {apt.careType === 'fisioterapia' ? 'Fisioterapia' : 'Pilates'}
                        </span>
                        {apt.isEncaixe && <span className="encaixe-tag">⚡ Encaixe</span>}
                        {apt.status === 'concluido' && (
                          <span className="status-badge concluido">✓ Realizado</span>
                        )}
                      </div>

                      <p className="patient-contact">
                        📞 {apt.phone} {apt.notes && `• "${apt.notes}"`}
                      </p>
                    </div>
                  </div>

                  {/* Ações Rápidas: Google Agenda, Lembretes WhatsApp e Concluir */}
                  <div className="apt-actions-group">
                    {/* Botão Google Agenda */}
                    <button
                      type="button"
                      className="btn-action-tool gcal"
                      onClick={() => handleOpenGoogleCalendar(apt)}
                      title="Sincronizar e abrir no Google Agenda (Gratuito)"
                    >
                      <CalendarPlus size={15} />
                      <span>Google Agenda</span>
                    </button>

                    {/* Disparar Lembrete WhatsApp */}
                    <div className="reminder-split-btn">
                      <button
                        type="button"
                        className="btn-action-tool whatsapp"
                        onClick={() => handleSendReminder(apt, '24h')}
                        title="Enviar lembrete amigável de 24h antes pelo WhatsApp"
                      >
                        <MessageCircle size={15} />
                        <span>Lembrete 24h</span>
                      </button>
                      <button
                        type="button"
                        className="btn-action-tool whatsapp-sub"
                        onClick={() => handleSendReminder(apt, '2h')}
                        title="Enviar lembrete de 2h antes (para hoje)"
                      >
                        <span>2h</span>
                      </button>
                    </div>

                    {/* Concluir Sessão */}
                    {apt.status !== 'concluido' ? (
                      <button
                        type="button"
                        className="btn-action-tool complete"
                        onClick={() => handleMarkComplete(apt.id)}
                        title="Marcar sessão como concluída"
                      >
                        <CheckCircle2 size={15} />
                        <span>Concluir</span>
                      </button>
                    ) : (
                      <span className="completed-check-label">
                        <Check size={14} /> Atendido
                      </span>
                    )}

                    {/* Cancelar */}
                    <button
                      type="button"
                      className="btn-icon-danger"
                      onClick={() => handleCancelAppointment(apt.id)}
                      title="Desmarcar horário"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 2: GESTÃO DE ENCAIXES & TRIAGEM DE DOR
          ======================================================== */}
      {currentTab === 'encaixes' && (
        <div className="dra-encaixes-section">
          <div className="section-intro-notice">
            <AlertCircle size={18} className="alert-svg" />
            <span>
              Pacientes que não encontraram horários vagos e solicitaram encaixe na grade.
              Priorize pacientes com maior nível de dor (triagem cinesiológica).
            </span>
          </div>

          <div className="encaixes-grid-cards">
            {encaixes.length === 0 ? (
              <div className="empty-state-box">
                <CheckCircle2 size={36} className="empty-icon text-green" />
                <h3>Nenhum pedido de encaixe pendente no momento</h3>
                <p>Todos os pedidos foram atendidos ou a fila de espera está livre.</p>
              </div>
            ) : (
              encaixes.map((enc) => {
                const pain = enc.painLevel ?? 0;
                let painColorClass = 'pain-mild';
                if (pain >= 7) painColorClass = 'pain-severe';
                else if (pain >= 4) painColorClass = 'pain-moderate';

                return (
                  <div key={enc.id} className={`encaixe-triage-card ${enc.status === 'atendido' ? 'atendido' : ''}`}>
                    <div className="triage-card-header">
                      <div>
                        <h3 className="triage-patient-name">{enc.patientName}</h3>
                        <span className="triage-phone">📞 {enc.phone}</span>
                      </div>

                      {/* Termômetro de Dor */}
                      <div className={`pain-gauge-box ${painColorClass}`}>
                        <Activity size={15} />
                        <span>Dor {pain}/10</span>
                      </div>
                    </div>

                    <div className="triage-details-body">
                      <div className="detail-item">
                        <span className="d-label">Especialidade:</span>
                        <span className="d-val">{enc.careType === 'fisioterapia' ? 'Fisioterapia' : 'Pilates'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="d-label">Turno Desejado:</span>
                        <span className="d-val">
                          {enc.preferredShifts.map((s) => s.toUpperCase()).join(', ')}
                        </span>
                      </div>
                      {enc.reason && (
                        <div className="triage-reason-box">
                          <strong>Queixa relatada:</strong> "{enc.reason}"
                        </div>
                      )}
                    </div>

                    <div className="triage-footer-actions">
                      {enc.status !== 'atendido' ? (
                        <>
                          <button
                            type="button"
                            className="btn-allocate-slot"
                            onClick={() => setAllocatingEncaixe(enc)}
                          >
                            <CalendarPlus size={16} />
                            <span>Aprovar & Inserir na Agenda</span>
                          </button>

                          <button
                            type="button"
                            className="btn-call-whatsapp"
                            onClick={() => {
                              const cleanPhone = enc.phone.replace(/\D/g, '');
                              const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
                              const msg = encodeURIComponent(
                                `Olá, ${enc.patientName}! Sou da equipe da *Ketllen Souza Fisioterapia*. Recebemos seu pedido de encaixe. Você tem disponibilidade para esta semana?`
                              );
                              window.open(`https://wa.me/${phoneWithCountry}?text=${msg}`, '_blank');
                            }}
                          >
                            <MessageCircle size={16} />
                            <span>Chamar</span>
                          </button>
                        </>
                      ) : (
                        <div className="already-allocated-badge">
                          <CheckCircle2 size={16} />
                          <span>Encaixe já alocado na agenda</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 3: PRONTUÁRIO ELETRÔNICO & EXERCÍCIOS PARA CASA
          ======================================================== */}
      {currentTab === 'prontuario' && (
        <div className="dra-prontuario-section">
          {/* Barra de Seleção de Paciente */}
          <div className="patient-selector-card">
            <span className="selector-label">Selecione o Paciente:</span>
            <div className="patient-chips-scroll">
              {medicalRecords.map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  className={`patient-select-pill ${rec.patientName === selectedPatientName ? 'active' : ''}`}
                  onClick={() => setSelectedPatientName(rec.patientName)}
                >
                  <UserCheck size={16} />
                  <span>{rec.patientName}</span>
                </button>
              ))}
            </div>
          </div>

          {currentRecord && (
            <div className="prontuario-split-grid">
              {/* Coluna Esquerda: Anamnese e Evoluções Clínicas */}
              <div className="prontuario-main-column">
                <div className="record-header-box">
                  <div className="record-title-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <h2>Prontuário: {currentRecord.patientName}</h2>
                      <span className="record-phone">Contato: {currentRecord.phone} • Código #{currentRecord.id}</span>
                    </div>

                    <button
                      type="button"
                      className="btn-print-official"
                      onClick={() => setIsExportingRecord(true)}
                      title="Exportar Prontuário Timbrado Oficial com CREFITO em PDF"
                    >
                      <Printer size={16} />
                      <span>Exportar Prontuário Oficial (PDF)</span>
                    </button>
                  </div>

                  <div className="clinical-summary-grid">
                    <div className="summary-card">
                      <span className="summary-label">Queixa Principal:</span>
                      <p className="summary-desc">{currentRecord.mainComplaint}</p>
                    </div>
                    <div className="summary-card">
                      <span className="summary-label">Diagnóstico Fisioterapêutico:</span>
                      <p className="summary-desc">{currentRecord.clinicalDiagnosis}</p>
                    </div>
                  </div>
                </div>

                {/* Formulário: Registrar Nova Evolução */}
                <div className="add-evolution-form-box">
                  <h3 className="section-title">
                    <Plus size={16} />
                    <span>Registrar Nova Evolução Clínica</span>
                  </h3>

                  <form onSubmit={handleAddEvolution} className="evolution-form">
                    <div className="form-row">
                      <div className="form-group flex-2">
                        <label className="input-label">Conduta Realizada na Sessão:</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Ex: Liberação miofascial, estabilização de core no Reformer..."
                          value={newConduct}
                          onChange={(e) => setNewConduct(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group flex-1">
                        <label className="input-label">
                          Nível de Dor Pós-Sessão: <strong>{newPainLevel}/10</strong>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={newPainLevel}
                          onChange={(e) => setNewPainLevel(Number(e.target.value))}
                          className="pain-slider-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="input-label">Observações e Resposta do Paciente:</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: Paciente relatou melhora na flexão lombar..."
                        value={newObservations}
                        onChange={(e) => setNewObservations(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn-save-evolution">
                      <Send size={15} />
                      <span>Salvar Evolução no Prontuário</span>
                    </button>
                  </form>
                </div>

                {/* Linha do Tempo de Evoluções */}
                <div className="evolution-timeline">
                  <h3 className="section-title">
                    <ClipboardList size={16} />
                    <span>Histórico de Evolução Clínica ({currentRecord.evolutions.length} sessões)</span>
                  </h3>

                  <div className="timeline-items-list">
                    {currentRecord.evolutions.map((evol) => (
                      <div key={evol.id} className="timeline-card">
                        <div className="timeline-date-badge">
                          <span className="session-number">Sessão {evol.sessionNumber}</span>
                          <span className="session-date">{evol.date}</span>
                        </div>
                        <div className="timeline-content">
                          <p className="conduct-text">
                            <strong>Conduta:</strong> {evol.conduct}
                          </p>
                          <p className="obs-text">
                            <strong>Obs:</strong> {evol.observations}
                          </p>
                          <div className="pain-reported-tag">
                            <Activity size={13} />
                            <span>Dor relatada: {evol.painLevel}/10</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Exercícios e Orientações para Casa (Home Care) */}
              <div className="prontuario-exercises-column">
                <div className="exercises-header-box">
                  <div>
                    <h3 className="exercises-title">Exercícios para Casa</h3>
                    <p className="exercises-sub">
                      Orientações que aparecem diretamente no perfil do paciente.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn-add-exercise-trigger"
                    onClick={() => setIsAddingExercise(!isAddingExercise)}
                  >
                    <Plus size={15} />
                    <span>Prescrever</span>
                  </button>
                </div>

                {/* Formulário para prescrever novo exercício */}
                {isAddingExercise && (
                  <form onSubmit={handleAddExercise} className="new-exercise-card">
                    <h4>Nova Prescrição Domiciliar com Guia Visual</h4>

                    <div className="form-group">
                      <label className="input-label">Nome do Exercício / Orientação:</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: Ponte Pélvica com Ativação de Core"
                        value={exerciseTitle}
                        onChange={(e) => setExerciseTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label className="input-label">Categoria do Guia:</label>
                        <select
                          className="form-select"
                          value={exerciseCategory}
                          onChange={(e) => setExerciseCategory(e.target.value as any)}
                        >
                          <option value="mobilidade">Mobilidade & Articular</option>
                          <option value="fortalecimento">Fortalecimento & Estabilidade</option>
                          <option value="alivio">Alívio & Descompressão</option>
                          <option value="respiracao">Respiração & Core</option>
                        </select>
                      </div>
                      <div className="form-group flex-1">
                        <label className="input-label">Foco Muscular / Região:</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Ex: Glúteos e Lombar"
                          value={exerciseTarget}
                          onChange={(e) => setExerciseTarget(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label className="input-label">Séries / Repetições:</label>
                        <input
                          type="text"
                          className="form-input"
                          value={exerciseReps}
                          onChange={(e) => setExerciseReps(e.target.value)}
                        />
                      </div>
                      <div className="form-group flex-1">
                        <label className="input-label">Frequência Diária:</label>
                        <input
                          type="text"
                          className="form-input"
                          value={exerciseFreq}
                          onChange={(e) => setExerciseFreq(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="input-label">Passo a Passo de Execução (1 por linha):</label>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        placeholder="1. Deite de barriga para cima com pés firmes...&#10;2. Eleve o quadril contraindo os glúteos...&#10;3. Mantenha 3 segundos e retorne com calma..."
                        value={exerciseInstructions}
                        onChange={(e) => setExerciseInstructions(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-label">Dica Postural de Ouro (Atenção do Paciente):</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: Não arqueie a coluna lombar ao subir. O movimento deve ser dos glúteos."
                        value={exercisePostureTip}
                        onChange={(e) => setExercisePostureTip(e.target.value)}
                      />
                    </div>

                    <div className="exercise-form-actions">
                      <button type="submit" className="btn-save-exercise">
                        Salvar e Liberar no App do Paciente
                      </button>
                      <button
                        type="button"
                        className="btn-cancel-flat"
                        onClick={() => setIsAddingExercise(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                {/* Lista de Exercícios Prescritos */}
                <div className="exercises-prescribed-list">
                  {currentRecord.homeExercises.length === 0 ? (
                    <div className="empty-exercise-box">
                      <p>Nenhum exercício domiciliar prescrito ainda.</p>
                    </div>
                  ) : (
                    currentRecord.homeExercises.map((ex) => (
                      <div key={ex.id} className="home-exercise-item-card">
                        <div className="ex-title-row">
                          <h4 className="ex-title">{ex.title}</h4>
                          <button
                            type="button"
                            className="btn-del-exercise"
                            onClick={() => handleDeleteExercise(ex.id)}
                            title="Remover exercício"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="ex-meta-row">
                          <span className="ex-meta-badge">🔁 {ex.repetitions}</span>
                          <span className="ex-meta-badge">⏰ {ex.frequency}</span>
                        </div>

                        <p className="ex-instruction-text">{ex.instructions}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          ABA 4: BLOQUEIO RÁPIDO DE HORÁRIOS & FOLGAS DA CLÍNICA
          ======================================================== */}
      {currentTab === 'bloqueios' && (
        <div className="dra-block-section">
          {/* Card com Formulário de Bloqueio Rápido */}
          <div className="block-form-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="brand-logo-circle" style={{ background: '#fee2e2', color: '#dc2626' }}>
                <CalendarX size={20} />
              </div>
              <div>
                <h3 className="section-title" style={{ margin: 0 }}>Bloqueio Rápido de Horários & Folgas</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Bloqueie datas completas ou turnos na agenda para impedir agendamentos de pacientes (ex: Folgas, Manutenção, Feriados).
                </p>
              </div>
            </div>

            <form onSubmit={handleAddBlock} className="block-form-grid">
              <div className="form-group">
                <label className="input-label">Data a Bloquear:</label>
                <input
                  type="date"
                  className="form-input"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Turno / Período:</label>
                <select
                  className="form-select"
                  value={blockShift}
                  onChange={(e) => setBlockShift(e.target.value as any)}
                >
                  <option value="dia-todo">Dia Todo (Clínica Fechada)</option>
                  <option value="manha">Apenas Manhã (08h às 12h)</option>
                  <option value="tarde">Apenas Tarde (13h às 18h)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Motivo do Bloqueio:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Folga da Dra. Ketllen, Manutenção dos Aparelhos, Congresso..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-add-block">
                <CalendarX size={16} />
                <span>Bloquear Horário</span>
              </button>
            </form>

            {/* Sugestões Rápidas de Motivo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sugestões rápidas:</span>
              {[
                'Folga Programada',
                'Manutenção nos Aparelhos Reformer',
                'Feriado / Recesso Clínico',
                'Congresso de Fisioterapia & Reabilitação',
                'Compromisso Médico'
              ].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setBlockReason(sug)}
                  style={{
                    fontSize: '0.7rem',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 999,
                    padding: '3px 9px',
                    cursor: 'pointer',
                    color: 'var(--text-body)',
                  }}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Bloqueios Ativos */}
          <div className="blocked-slots-container">
            <h3 className="section-title" style={{ marginBottom: 12 }}>
              <ShieldAlert size={16} color="#dc2626" />
              <span>Bloqueios Ativos na Agenda ({blockedSlots.length})</span>
            </h3>

            {blockedSlots.length === 0 ? (
              <div className="empty-appointments-box" style={{ padding: 30 }}>
                <CheckCircle2 size={32} color="#059669" />
                <h4 style={{ margin: '8px 0 4px', fontSize: '1rem', color: 'var(--text-title)' }}>
                  Nenhum bloqueio cadastrado
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Todos os horários da agenda estão livres para receber agendamentos de pacientes.
                </p>
              </div>
            ) : (
              <div className="blocked-slots-list">
                {blockedSlots.map((blk) => (
                  <div key={blk.id} className="blocked-slot-card">
                    <div className="blocked-card-top">
                      <div>
                        <span className="blocked-card-date">
                          📅 {blk.date.split('-').reverse().join('/')}
                        </span>
                        <div style={{ marginTop: 4 }}>
                          <span
                            className={`badge-shift-pill ${
                              blk.shift === 'dia-todo'
                                ? 'badge-shift-dia-todo'
                                : blk.shift === 'manha'
                                ? 'badge-shift-manha'
                                : 'badge-shift-tarde'
                            }`}
                          >
                            {blk.shift === 'dia-todo'
                              ? '🚫 Dia Todo'
                              : blk.shift === 'manha'
                              ? '☀️ Manhã Bloqueada'
                              : '⛅ Tarde Bloqueada'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-remove-block"
                        onClick={() => handleRemoveBlock(blk.id)}
                        title="Liberar horários desta data"
                      >
                        <Trash2 size={13} />
                        <span>Desbloquear</span>
                      </button>
                    </div>

                    <p className="blocked-card-reason">
                      <strong>Motivo:</strong> {blk.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ALOCAR ENCAIXE NA AGENDA
          ======================================================== */}
      {allocatingEncaixe && (
        <div className="modal-backdrop-login" onClick={() => setAllocatingEncaixe(null)}>
          <div className="allocation-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="alloc-header">
              <h3>Alocar Encaixe na Agenda</h3>
              <p>
                Paciente: <strong>{allocatingEncaixe.patientName}</strong> ({allocatingEncaixe.careType})
              </p>
            </div>

            <div className="alloc-form-body">
              <div className="form-group">
                <label className="input-label">Data do Encaixe:</label>
                <input
                  type="date"
                  className="form-input"
                  value={allocatedDate}
                  onChange={(e) => setAllocatedDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="input-label">Horário Confirmado:</label>
                <select
                  className="form-select"
                  value={allocatedTime}
                  onChange={(e) => setAllocatedTime(e.target.value)}
                >
                  <option value="08:00">08:00 (Manhã)</option>
                  <option value="09:00">09:00 (Manhã)</option>
                  <option value="10:00">10:00 (Manhã)</option>
                  <option value="11:00">11:00 (Manhã)</option>
                  <option value="11:30">11:30 (Manhã)</option>
                  <option value="14:00">14:00 (Tarde)</option>
                  <option value="15:00">15:00 (Tarde)</option>
                  <option value="16:00">16:00 (Tarde)</option>
                </select>
              </div>

              <div className="alloc-notice">
                Ao confirmar, o horário será inserido na agenda e uma mensagem no WhatsApp será aberta
                para avisar o paciente com 1 clique!
              </div>

              <div className="alloc-actions-row">
                <button
                  type="button"
                  className="btn-confirm-alloc"
                  onClick={handleConfirmAllocation}
                >
                  Confirmar Encaixe & Notificar Paciente
                </button>
                <button
                  type="button"
                  className="btn-cancel-flat"
                  onClick={() => setAllocatingEncaixe(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL DE EXPORTAÇÃO DE PRONTUÁRIO OFICIAL (TIMBRADO / PDF)
          ======================================================== */}
      {isExportingRecord && currentRecord && (
        <div className="print-medical-modal-backdrop" onClick={() => setIsExportingRecord(false)}>
          <div className="print-medical-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="print-actions-toolbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Printer size={20} color="#34d399" />
                <strong>Prontuário Timbrado Oficial • {currentRecord.patientName}</strong>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn-print-official"
                  onClick={() => window.print()}
                >
                  <Printer size={16} />
                  <span>Imprimir / Salvar em PDF</span>
                </button>
                <button
                  type="button"
                  className="btn-close-print"
                  onClick={() => setIsExportingRecord(false)}
                >
                  Fechar
                </button>
              </div>
            </div>

            <div className="official-timbrado-sheet" id="prontuario-timbrado">
              {/* Cabeçalho Oficial com CREFITO */}
              <div className="timbrado-header">
                <div className="timbrado-brand-block">
                  <h1>CLÍNICA KETLLEN SOUZA</h1>
                  <p>FISIOTERAPIA & PILATES CLÍNICO</p>
                  <span style={{ fontSize: '0.72rem', color: '#475569' }}>
                    Reabilitação Traumato-Ortopédica, Cinesiologia & Reeducação Postural
                  </span>
                </div>
                <div className="timbrado-dra-info">
                  <strong>Dra. Ketllen Souza</strong>
                  <span>Fisioterapeuta • CREFITO-3 / 345892-F</span>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 3 }}>
                    Emitido em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Faixa de Identificação do Paciente */}
              <div className="timbrado-patient-strip">
                <div className="strip-item">
                  <span>Paciente</span>
                  <strong>{currentRecord.patientName}</strong>
                </div>
                <div className="strip-item">
                  <span>Contato Telefônico</span>
                  <strong>{currentRecord.phone}</strong>
                </div>
                <div className="strip-item">
                  <span>Nº Prontuário</span>
                  <strong>#{currentRecord.id}</strong>
                </div>
              </div>

              {/* Seção 1: Avaliação e Anamnese */}
              <div className="timbrado-section">
                <h2 className="timbrado-section-title">1. Diagnóstico Clínico & Objetivos Terapêuticos</h2>
                <div className="timbrado-field-row">
                  <span>Queixa Principal / Motivo da Consulta:</span>
                  <p>{currentRecord.mainComplaint}</p>
                </div>
                <div className="timbrado-field-row">
                  <span>Diagnóstico Cinesiológico-Funcional:</span>
                  <p>{currentRecord.clinicalDiagnosis}</p>
                </div>
                <div className="timbrado-field-row">
                  <span>Objetivos do Tratamento:</span>
                  <p>{currentRecord.therapeuticGoals}</p>
                </div>
              </div>

              {/* Seção 2: Evoluções Clínicas Realizadas */}
              <div className="timbrado-section">
                <h2 className="timbrado-section-title">2. Histórico de Evolução Clínica Realizada</h2>
                <table className="timbrado-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Sessão</th>
                      <th style={{ width: '100px' }}>Data</th>
                      <th>Conduta Terapêutica Aplicada</th>
                      <th style={{ width: '85px' }}>EVA Dor</th>
                      <th>Observações Clínicas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecord.evolutions.map((ev) => (
                      <tr key={ev.id}>
                        <td><strong>Sessão #{ev.sessionNumber}</strong></td>
                        <td>{ev.date}</td>
                        <td>{ev.conduct}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: ev.painLevel <= 3 ? '#059669' : ev.painLevel <= 6 ? '#d97706' : '#dc2626' }}>
                            {ev.painLevel}/10
                          </span>
                        </td>
                        <td>{ev.observations || 'Sem queixas adicionais.'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Seção 3: Prescrição Domiciliar / Exercícios */}
              {currentRecord.homeExercises.length > 0 && (
                <div className="timbrado-section">
                  <h2 className="timbrado-section-title">3. Prescrições Domiciliares & Exercícios para Casa</h2>
                  <table className="timbrado-table">
                    <thead>
                      <tr>
                        <th>Exercício / Orientação</th>
                        <th>Dose & Repetições</th>
                        <th>Frequência</th>
                        <th>Instruções e Recomendações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecord.homeExercises.map((ex) => (
                        <tr key={ex.id}>
                          <td><strong>{ex.title}</strong></td>
                          <td>{ex.repetitions}</td>
                          <td>{ex.frequency}</td>
                          <td>{ex.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Carimbo e Assinatura */}
              <div className="timbrado-signature-block">
                <div className="signature-line" />
                <span className="signature-name">Dra. Ketllen Souza</span>
                <span className="signature-crefito">Fisioterapeuta Responsável • CREFITO-3 / 345892-F</span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: 2 }}>
                  Ketllen Souza Fisioterapia & Pilates • São Paulo / SP
                </span>
              </div>

              {/* Rodapé Legal */}
              <div className="timbrado-footer-notice">
                <span>Documento emitido eletronicamente via Sistema Clínico Ketllen Souza Fisioterapia.</span>
                <span>Validade para fins de acompanhamento fisioterapêutico.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
