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
} from 'lucide-react';
import { CareType } from '@/types';
import { CLINIC_INFO, TIME_SLOTS } from '@/data/clinicData';

interface ScheduleViewProps {
  onOpenBookingModal: (careType: CareType, dateIso: string, time: string) => void;
  onOpenEncaixeModal: (careType: CareType) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  onOpenBookingModal,
  onOpenEncaixeModal,
}) => {
  // Passo 1: Cuidado selecionado
  const [careType, setCareType] = useState<CareType>('fisioterapia');

  // Passo 2: Data selecionada (Outubro 2026, dia 12 por padrão do print)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = Outubro
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(12);

  // Passo 3: Horário selecionado
  const [selectedTime, setSelectedTime] = useState<string>('14:00');

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
            alt="Estúdio de Pilates e Fisioterapia Ketlen Fisio com Reformer"
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

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    className={`calendar-day-button ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
                    onClick={() => {
                      if (!isPast) {
                        setSelectedDayNumber(dayNum);
                      }
                    }}
                    disabled={isPast}
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
              <div className="cal-legend-right">
                <span className="legend-available-dot" />
                <span>Datas para solicitação</span>
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

            {/* Turno Manhã */}
            <div className="slots-shift-group">
              <div className="shift-label-header">
                <Sun size={15} className="shift-icon sun" />
                <span>Manhã</span>
              </div>
              <div className="slots-buttons-grid">
                {TIME_SLOTS.manha.map((timeStr) => (
                  <button
                    key={timeStr}
                    type="button"
                    className={`slot-time-pill ${selectedTime === timeStr ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(timeStr)}
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
                <span>Tarde</span>
              </div>
              <div className="slots-buttons-grid">
                {TIME_SLOTS.tarde.map((timeStr) => (
                  <button
                    key={timeStr}
                    type="button"
                    className={`slot-time-pill ${selectedTime === timeStr ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(timeStr)}
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
            >
              <span>Solicitar agendamento</span>
              <ArrowRight size={17} />
            </button>

            {/* Aviso informativo com ícone de escudo */}
            <p className="booking-disclaimer">
              <ShieldCheck size={14} className="disclaimer-shield-icon" />
              <span>O horário será confirmado pela clínica após o pedido.</span>
            </p>
          </div>
        </section>
      </div>

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
    </div>
  );
};

