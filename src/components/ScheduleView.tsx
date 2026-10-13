'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Activity,
  Leaf,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sun,
  CloudSun,
  ArrowRight,
  Clock,
  ShieldCheck,
  Heart,
  Star,
  MessageSquarePlus,
  CalendarX,
  X,
  CheckCircle2
} from 'lucide-react';
import { CareType, BlockedSlot, ClinicReview } from '@/types';
import { CLINIC_INFO, TIME_SLOTS } from '@/data/clinicData';
import { Modal } from '@/components/Modal';

interface ScheduleViewProps {
  onOpenBookingModal: (careType: CareType, dateIso: string, time: string) => void;
  onOpenEncaixeModal: (careType: CareType) => void;
  blockedSlots?: BlockedSlot[];
  reviews?: ClinicReview[];
  onAddReview?: (review: ClinicReview) => void;
  patientName?: string;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  onOpenBookingModal,
  onOpenEncaixeModal,
  blockedSlots = [],
  reviews = [],
  onAddReview,
  patientName = '',
}) => {
  // Passo 1: Cuidado selecionado
  const [careType, setCareType] = useState<CareType>('fisioterapia');

  // Passo 2: Data selecionada (Outubro 2026, dia 12 por padrão do print)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = Outubro
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(12);

  // Passo 3: Horário selecionado
  const [selectedTime, setSelectedTime] = useState<string>('14:00');

  // Modal de Avaliação do Paciente
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [revName, setRevName] = useState(patientName || 'Mariana Duarte');
  const [revRating, setRevRating] = useState(5);
  const [revCare, setRevCare] = useState<CareType>('fisioterapia');
  const [revComment, setRevComment] = useState('');
  const [revTag, setRevTag] = useState('Alívio da Dor');

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDayNamesFull = [
    'Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira',
    'Quinta-Feira', 'Sexta-Feira', 'Sábado'
  ];

  // Cálculos do Calendário
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayWeekIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Domingo

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Obter texto formatado da data selecionada (ex: Segunda-Feira, 12 De Outubro)
  const selectedDateObj = new Date(currentYear, currentMonth, selectedDayNumber);
  const selectedWeekDayName = weekDayNamesFull[selectedDateObj.getDay()];
  const selectedMonthName = monthNames[currentMonth];
  const dateFormattedDisplay = `${selectedWeekDayName}, ${selectedDayNumber} De ${selectedMonthName}`;

  // Formatar ISO para gravação (YYYY-MM-DD)
  const monthStr = String(currentMonth + 1).padStart(2, '0');
  const dayStr = String(selectedDayNumber).padStart(2, '0');
  const selectedDateIso = `${currentYear}-${monthStr}-${dayStr}`;

  const handleBookingSubmit = () => {
    onOpenBookingModal(careType, selectedDateIso, selectedTime);
  };

  return (
    <div className="schedule-view-wrapper">
      {/* Topo do Conteúdo da Página */}
      <div className="schedule-page-header">
        <div className="header-text-block">
          <span className="header-kicker">CUIDAR DE VOCÊ COMEÇA AQUI</span>
          <h1 className="header-main-title">Agende sua sessão</h1>
          <p className="header-subtitle">Escolha o melhor dia para cuidar do seu movimento.</p>
        </div>

        {/* Badge da data de hoje para Desktop */}
        <div className="today-badge-pill">
          <CalendarIcon size={14} className="badge-calendar-icon" />
          <span>10 de outubro</span>
        </div>
      </div>

      {/* Hero Banner Card com Pilates Reformer */}
      <div className="hero-reformer-card">
        <div className="hero-content-left">
          <span className="hero-tag">FISIOTERAPIA & PILATES</span>
          <h2 className="hero-headline">
            Mais movimento.<br />
            Mais qualidade de<br />
            vida.
          </h2>
          <p className="hero-text">
            Um cuidado próximo, no seu ritmo.<br />
            Estamos aqui para caminhar com você.
          </p>
        </div>

        <div className="hero-image-wrapper">
          <Image
            src="/images/pilates_reformer_banner.jpg"
            alt="Estúdio de Pilates e Fisioterapia Ketllen Souza Fisioterapia com Reformer"
            width={520}
            height={260}
            className="hero-reformer-img"
            priority
          />
        </div>
      </div>

      {/* =========================================================
          ETAPA 1: QUAL CUIDADO VOCÊ PRECISA?
          ========================================================= */}
      <section className="schedule-step-block">
        <div className="step-title-row">
          <div className="step-number-circle">1</div>
          <h2 className="step-title-text">Qual cuidado você precisa?</h2>
        </div>

        <div className="care-types-grid">
          {/* Card Fisioterapia */}
          <button
            type="button"
            className={`care-type-card ${careType === 'fisioterapia' ? 'selected' : ''}`}
            onClick={() => setCareType('fisioterapia')}
          >
            <div className="care-icon-badge fisio-badge">
              <Activity size={22} className="care-icon-svg" />
            </div>
            <div className="care-card-text">
              <h3 className="care-card-title">Fisioterapia</h3>
              <p className="care-card-sub">Cuidado e reabilitação individual</p>
            </div>
            <div className="care-radio-indicator">
              {careType === 'fisioterapia' && <div className="radio-inner-dot" />}
            </div>
          </button>

          {/* Card Pilates */}
          <button
            type="button"
            className={`care-type-card ${careType === 'pilates' ? 'selected' : ''}`}
            onClick={() => setCareType('pilates')}
          >
            <div className="care-icon-badge pilates-badge">
              <Leaf size={22} className="care-icon-svg" />
            </div>
            <div className="care-card-text">
              <h3 className="care-card-title">Pilates</h3>
              <p className="care-card-sub">Equilíbrio, força e bem-estar</p>
            </div>
            <div className="care-radio-indicator">
              {careType === 'pilates' && <div className="radio-inner-dot" />}
            </div>
          </button>
        </div>
      </section>

      {/* =========================================================
          ETAPAS 2 E 3 LADO A LADO EM DESKTOP / EMPILHADAS NO MOBILE
          ========================================================= */}
      <div className="schedule-dual-columns">
        {/* ==========================
            ETAPA 2: ESCOLHA O DIA
            ========================== */}
        <section className="schedule-column-box">
          <div className="step-title-row">
            <div className="step-number-circle">2</div>
            <h2 className="step-title-text">Escolha o dia</h2>
          </div>

          <div className="calendar-card-container">
            {/* Cabeçalho do Mês */}
            <div className="calendar-month-nav">
              <span className="calendar-month-title">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <div className="calendar-nav-buttons">
                <button
                  type="button"
                  className="cal-nav-btn"
                  onClick={handlePrevMonth}
                  aria-label="Mês anterior"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="cal-nav-btn"
                  onClick={handleNextMonth}
                  aria-label="Próximo mês"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Dias da Semana */}
            <div className="calendar-weekdays-row">
              {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((wDay) => (
                <span key={wDay} className="weekday-header-cell">
                  {wDay}
                </span>
              ))}
            </div>

            {/* Grid dos Dias do Mês */}
            <div className="calendar-grid-cells">
              {/* Espaços vazios antes do 1º dia */}
              {Array.from({ length: firstDayWeekIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="calendar-cell-empty" />
              ))}

              {/* Dias numéricos */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const isSelected = selectedDayNumber === dayNum;
                const isToday = dayNum === 10;
                const isPast = dayNum < 10;

                const dayIso = `${currentYear}-${monthStr}-${String(dayNum).padStart(2, '0')}`;
                const dayBlock = blockedSlots.find((b) => b.date === dayIso);

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    className={`calendar-day-button ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${dayBlock ? 'day-blocked' : ''}`}
                    onClick={() => {
                      if (!isPast) {
                        setSelectedDayNumber(dayNum);
                      }
                    }}
                    disabled={isPast}
                    title={dayBlock ? `Clínica Bloqueada: ${dayBlock.reason}` : undefined}
                  >
                    <span>{dayNum}</span>
                  </button>
                );
              })}
            </div>

            {/* Rodapé do Calendário */}
            <div className="calendar-card-footer">
              <div className="cal-legend-left">
                <span className="legend-selected-dot" />
                <span>Dia selecionado</span>
              </div>
              <div className="cal-legend-right" style={{ display: 'flex', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                  <span>Folga / Manutenção</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span className="legend-available-dot" />
                  <span>Datas livres</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================
            ETAPA 3: ESCOLHA O HORÁRIO
            ========================== */}
        <section className="schedule-column-box">
          <div className="step-title-row">
            <div className="step-number-circle">3</div>
            <h2 className="step-title-text">Escolha o horário</h2>
          </div>

          {(() => {
            const currentBlockedSlot = blockedSlots.find((b) => b.date === selectedDateIso);
            const isAllDayBlocked = currentBlockedSlot?.shift === 'dia-todo';
            const isMorningBlocked = isAllDayBlocked || currentBlockedSlot?.shift === 'manha';
            const isAfternoonBlocked = isAllDayBlocked || currentBlockedSlot?.shift === 'tarde';

            return (
              <div className="time-slots-card-container">
                {/* Cabeçalho do Card de Horários */}
                <div className="slots-card-header">
                  <div className="slots-header-text">
                    <h3 className="slots-date-title">{dateFormattedDisplay}</h3>
                    <p className="slots-sub">
                      {careType === 'fisioterapia' ? 'Fisioterapia' : 'Pilates'} · Preferência de horário
                    </p>
                  </div>
                  <span className="demo-tag-badge">Demonstrativo</span>
                </div>

                {/* Banner de Aviso caso haja bloqueio */}
                {currentBlockedSlot && (
                  <div className="blocked-day-notice-box">
                    <CalendarX size={20} style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Horário Bloqueado: {currentBlockedSlot.reason}</strong>
                      <p style={{ margin: '2px 0 0', fontSize: '0.78rem' }}>
                        {isAllDayBlocked
                          ? 'A clínica estará fechada nesta data. Por favor, escolha outro dia no calendário ou solicite um encaixe prioritário abaixo.'
                          : isMorningBlocked
                          ? 'O turno da manhã está em folga/manutenção. Horários da tarde continuam disponíveis.'
                          : 'O turno da tarde está bloqueado. Horários da manhã continuam disponíveis.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Turno Manhã */}
                <div className="slots-shift-group">
                  <div className="shift-label-header">
                    <Sun size={15} className="shift-icon sun" />
                    <span>Manhã {isMorningBlocked && '(Bloqueado)'}</span>
                  </div>
                  <div className="slots-buttons-grid">
                    {TIME_SLOTS.manha.map((timeStr) => (
                      <button
                        key={timeStr}
                        type="button"
                        className={`slot-time-pill ${selectedTime === timeStr ? 'selected' : ''} ${isMorningBlocked ? 'blocked' : ''}`}
                        onClick={() => !isMorningBlocked && setSelectedTime(timeStr)}
                        disabled={isMorningBlocked}
                        title={isMorningBlocked ? 'Manhã bloqueada' : undefined}
                      >
                        {timeStr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Turno Tarde */}
                <div className="slots-shift-group">
                  <div className="shift-label-header">
                    <CloudSun size={15} className="shift-icon cloud-sun" />
                    <span>Tarde {isAfternoonBlocked && '(Bloqueado)'}</span>
                  </div>
                  <div className="slots-buttons-grid">
                    {TIME_SLOTS.tarde.map((timeStr) => (
                      <button
                        key={timeStr}
                        type="button"
                        className={`slot-time-pill ${selectedTime === timeStr ? 'selected' : ''} ${isAfternoonBlocked ? 'blocked' : ''}`}
                        onClick={() => !isAfternoonBlocked && setSelectedTime(timeStr)}
                        disabled={isAfternoonBlocked}
                        title={isAfternoonBlocked ? 'Tarde bloqueada' : undefined}
                      >
                        {timeStr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botão de Solicitar Agendamento */}
                <button
                  type="button"
                  className="btn-submit-booking"
                  onClick={handleBookingSubmit}
                  disabled={isAllDayBlocked}
                  style={isAllDayBlocked ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                >
                  <span>{isAllDayBlocked ? 'Dia Fechado para Atendimento' : 'Solicitar agendamento'}</span>
                  <ArrowRight size={17} />
                </button>

                {/* Aviso informativo com ícone de escudo */}
                <p className="booking-disclaimer">
                  <ShieldCheck size={14} className="disclaimer-shield-icon" />
                  <span>O horário será confirmado pela clínica após o pedido.</span>
                </p>
              </div>
            );
          })()}
        </section>
      </div>

      {/* =========================================================
          SEÇÃO DE AVALIAÇÕES & DEPOIMENTOS REAIS DE PACIENTES
          ========================================================= */}
      <section className="reviews-section-card">
        <div className="reviews-header-strip">
          <div className="reviews-rating-summary">
            <span className="stars-score-large">5.0</span>
            <div>
              <div className="stars-row-yellow">
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Baseado em <strong>{reviews.length || 48} avaliações reais e verificadas</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn-open-review-modal"
            onClick={() => setIsReviewModalOpen(true)}
          >
            <MessageSquarePlus size={16} />
            <span>Deixar Minha Avaliação</span>
          </button>
        </div>

        <div className="reviews-cards-grid">
          {reviews.map((rev) => (
            <div key={rev.id} className="review-testimonial-card">
              <div className="review-patient-header">
                <div>
                  <h4 className="review-patient-name">
                    {rev.patientName}
                    {rev.verified && (
                      <span title="Paciente Verificado" style={{ display: 'inline-flex' }}>
                        <CheckCircle2 size={14} className="verified-icon" />
                      </span>
                    )}
                  </h4>
                  <div className="stars-row-yellow" style={{ marginTop: 2 }}>
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                </div>

                <span className="review-care-badge">
                  {rev.careType === 'fisioterapia' ? 'Fisioterapia' : 'Pilates'}
                </span>
              </div>

              <p className="review-text-quote">"{rev.comment}"</p>

              <div className="review-tags-row">
                {rev.tags.map((tag, idx) => (
                  <span key={idx} className="review-tag-pill">
                    #{tag}
                  </span>
                ))}
              </div>

              <span className="review-date-foot">Publicado em {rev.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          BANNER INFERIOR: NÃO ENCONTROU O MELHOR HORÁRIO? (ENCAIXE)
          ========================================================= */}
      <section className="bottom-encaixe-card">
        <div className="encaixe-top-row">
          <div className="encaixe-icon-round">
            <Clock size={20} className="encaixe-clock-svg" />
          </div>
          <div className="encaixe-text-block">
            <h3 className="encaixe-card-title">Não encontrou o melhor horário?</h3>
            <p className="encaixe-card-desc">Peça um encaixe e aguarde o retorno da clínica.</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-request-encaixe-outline"
          onClick={() => onOpenEncaixeModal(careType)}
        >
          <span>Solicitar encaixe</span>
          <ArrowRight size={15} />
        </button>
      </section>

      {/* Rodapé Final com Frase de Afeto */}
      <footer className="schedule-page-footer">
        <div className="footer-content-split">
          <span className="footer-copyright">© 2026 {CLINIC_INFO.name}</span>
          <span className="footer-motto">
            <Heart size={13} className="footer-heart-icon" />
            <span>Cuidado em cada movimento.</span>
          </span>
        </div>
      </footer>

      {/* =========================================================
          MODAL: DEIXAR AVALIAÇÃO DE PACIENTE (UNIFICADO & RESPONSIVO)
          ========================================================= */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        maxWidth="lg"
        headerIcon={<Star size={20} fill="#d97706" color="#d97706" />}
        title="Compartilhe sua Experiência"
        subtitle="Sua avaliação ajuda novos pacientes a conhecerem nosso cuidado"
        closeButtonAriaLabel="Fechar janela de avaliação"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!revName.trim() || !revComment.trim()) return;

            const newRev: ClinicReview = {
              id: `REV-${Date.now()}`,
              patientName: revName.trim(),
              rating: revRating,
              careType: revCare,
              comment: revComment.trim(),
              tags: [revTag, 'Atendimento Humanizado'],
              date: new Date().toLocaleDateString('pt-BR'),
              verified: true,
            };

            if (onAddReview) {
              onAddReview(newRev);
            }
            setIsReviewModalOpen(false);
            setRevComment('');
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          {/* Avaliação em Estrelas */}
          <div>
            <label className="input-label">Sua Nota:</label>
            <div className="star-rating-selector">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  className="star-interactive-btn"
                  onClick={() => setRevRating(starVal)}
                >
                  <Star
                    size={28}
                    fill={starVal <= revRating ? '#f59e0b' : 'none'}
                    color={starVal <= revRating ? '#f59e0b' : '#cbd5e1'}
                  />
                </button>
              ))}
              <span style={{ fontSize: '0.9rem', fontWeight: 700, marginLeft: 8, alignSelf: 'center' }}>
                {revRating === 5 ? '⭐ Excelente (5/5)' : revRating === 4 ? 'Muito Bom (4/5)' : `${revRating} estrelas`}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Seu Nome:</label>
            <input
              type="text"
              className="form-input"
              value={revName}
              onChange={(e) => setRevName(e.target.value)}
              placeholder="Nome que será exibido"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="input-label">Especialidade Realizada:</label>
              <select
                className="form-select"
                value={revCare}
                onChange={(e) => setRevCare(e.target.value as any)}
              >
                <option value="fisioterapia">Fisioterapia</option>
                <option value="pilates">Pilates</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label className="input-label">Destaque Principal:</label>
              <select
                className="form-select"
                value={revTag}
                onChange={(e) => setRevTag(e.target.value)}
              >
                <option value="Alívio Imediato da Dor">Alívio Imediato da Dor</option>
                <option value="Pilates em Aparelhos">Pilates em Aparelhos</option>
                <option value="Atendimento Humanizado">Atendimento Humanizado</option>
                <option value="Exercícios em Casa">Exercícios em Casa</option>
                <option value="Pontualidade & Estrutura">Pontualidade & Estrutura</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Seu Depoimento:</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Como foi o seu atendimento com a Dra. Ketllen e os resultados obtidos..."
              value={revComment}
              onChange={(e) => setRevComment(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-confirm-alloc" style={{ marginTop: 6 }}>
            Enviar Avaliação
          </button>
        </form>
      </Modal>
    </div>
  );
};

