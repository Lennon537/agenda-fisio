'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { ScheduleView } from '@/components/ScheduleView';
import { MyAppointmentsView } from '@/components/MyAppointmentsView';
import { MyProfileView } from '@/components/MyProfileView';
import { LoginModal } from '@/components/LoginModal';
import { EncaixeModal } from '@/components/EncaixeModal';
import { BookingConfirmModal } from '@/components/BookingConfirmModal';
import { MobileNav } from '@/components/MobileNav';
import { DraDashboardView } from '@/components/DraDashboardView';
import {
  ActiveNavTab,
  CareType,
  ScheduledAppointment,
  EncaixeRequest,
  PatientUser,
  PatientMedicalRecord,
} from '@/types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_ENCAIXES,
  INITIAL_MEDICAL_RECORDS,
} from '@/data/clinicData';
import { Info } from 'lucide-react';

export default function KetllenSouzaFisioPage() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('agendar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Estado de Autenticação / Tela Inicial de Login
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userLoggedIn, setUserLoggedIn] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'patient' | 'admin'>('patient');

  // Modais
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isEncaixeModalOpen, setIsEncaixeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dados para o agendamento
  const [bookingCareType, setBookingCareType] = useState<CareType>('fisioterapia');
  const [bookingDateIso, setBookingDateIso] = useState<string>('2026-10-12');
  const [bookingTime, setBookingTime] = useState<string>('14:00');

  // Agendamentos, Encaixes e Prontuários
  const [appointments, setAppointments] = useState<ScheduledAppointment[]>([]);
  const [encaixes, setEncaixes] = useState<EncaixeRequest[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<PatientMedicalRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<PatientUser>({
    name: 'Mariana Duarte',
    phone: '(11) 98765-4321',
    email: 'mariana.duarte@email.com',
    notes: 'Dores posturais lombares',
  });


  // Carregar dados salvos no localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('ketlen_theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }

      const savedAuth = localStorage.getItem('ketlen_auth_session');
      if (savedAuth) {
        const authData = JSON.parse(savedAuth);
        setIsAuthenticated(true);
        setUserLoggedIn(authData.name);
        setUserRole(authData.role);
      }

      const savedApts = localStorage.getItem('ketlen_appointments');
      if (savedApts) {
        setAppointments(JSON.parse(savedApts));
      } else {
        setAppointments(INITIAL_APPOINTMENTS);
        localStorage.setItem('ketlen_appointments', JSON.stringify(INITIAL_APPOINTMENTS));
      }

      const savedEncaixes = localStorage.getItem('ketlen_encaixes');
      if (savedEncaixes) {
        setEncaixes(JSON.parse(savedEncaixes));
      } else {
        setEncaixes(INITIAL_ENCAIXES);
        localStorage.setItem('ketlen_encaixes', JSON.stringify(INITIAL_ENCAIXES));
      }

      const savedRecords = localStorage.getItem('ketlen_medical_records');
      if (savedRecords) {
        setMedicalRecords(JSON.parse(savedRecords));
      } else {
        setMedicalRecords(INITIAL_MEDICAL_RECORDS);
        localStorage.setItem('ketlen_medical_records', JSON.stringify(INITIAL_MEDICAL_RECORDS));
      }


      const savedUser = localStorage.getItem('ketlen_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setCurrentUser(u);
      }
    } catch (e) {
      console.error('Erro ao ler localStorage', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  };

  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ketlen_theme', next);
  };

  const handleLoginSuccess = (name: string, role: 'patient' | 'admin') => {
    setIsAuthenticated(true);
    setUserLoggedIn(name);
    setUserRole(role);
    setCurrentUser((prev) => ({ ...prev, name }));
    localStorage.setItem(
      'ketlen_auth_session',
      JSON.stringify({ name, role, timestamp: Date.now() })
    );
    localStorage.setItem('ketlen_user', JSON.stringify({ ...currentUser, name }));

    if (role === 'admin' || name.toLowerCase().includes('ketlen') || name.toLowerCase().includes('ketllen')) {
      setActiveTab('painel-dra');
      showToast('✓ Bem-vinda ao Painel Clínico, Dra. Ketllen!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserLoggedIn(null);
    setUserRole('patient');
    setActiveTab('agendar');
    localStorage.removeItem('ketlen_auth_session');
    showToast('Você saiu do sistema. Até breve!');
  };

  const handleContinueAsGuest = () => {
    handleLoginSuccess('Paciente Convidado', 'patient');
    showToast('✓ Acesso direto liberado! Escolha seu cuidado e horário.');
  };

  const handleOpenBookingModal = (cType: CareType, dateIso: string, timeStr: string) => {
    setBookingCareType(cType);
    setBookingDateIso(dateIso);
    setBookingTime(timeStr);
    setIsBookingModalOpen(true);
  };

  const handleOpenEncaixeModal = (cType: CareType) => {
    setBookingCareType(cType);
    setIsEncaixeModalOpen(true);
  };

  const handleConfirmBooking = (newApt: ScheduledAppointment) => {
    const updated = [newApt, ...appointments];
    setAppointments(updated);
    localStorage.setItem('ketlen_appointments', JSON.stringify(updated));
    if (!userLoggedIn || userLoggedIn === 'Paciente Convidado') {
      setUserLoggedIn(newApt.patientName);
    }
  };

  const handleSubmitEncaixe = (newEnc: EncaixeRequest) => {
    const updated = [newEnc, ...encaixes];
    setEncaixes(updated);
    localStorage.setItem('ketlen_encaixes', JSON.stringify(updated));
  };

  const handleCancelAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    localStorage.setItem('ketlen_appointments', JSON.stringify(updated));
    showToast('Agendamento cancelado com sucesso.');
  };

  const handleSaveProfile = (updatedProfile: PatientUser) => {
    setCurrentUser(updatedProfile);
    setUserLoggedIn(updatedProfile.name);
    localStorage.setItem('ketlen_user', JSON.stringify(updatedProfile));
  };

  // Obter exercícios prescritos para o paciente logado (ou padrão da Mariana)
  const patientMedicalRec = medicalRecords.find(
    (r) => r.patientName.toLowerCase() === (userLoggedIn || currentUser.name).toLowerCase()
  ) || medicalRecords[0];

  // Renderização do Sistema Ketllen Souza Fisioterapia (acesso direto conforme os prints)
  return (
    <div className="ketlen-app-layout">
      {/* Toast Flutuante */}
      {toastMessage && (
        <div className="toast-notification">
          <Info size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Lateral Esquerda (Menu Desktop) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        appointmentsCount={appointments.length}
      />

      {/* Área Principal de Conteúdo */}
      <div className="app-main-wrapper">
        {/* Barra Superior (Top Header) */}
        <TopHeader
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          userLoggedIn={userLoggedIn}
        />

        {/* Visualização Ativa */}
        <main className="app-page-content">
          {activeTab === 'agendar' && (
            <ScheduleView
              onOpenBookingModal={handleOpenBookingModal}
              onOpenEncaixeModal={handleOpenEncaixeModal}
            />
          )}

          {activeTab === 'agendamentos' && (
            <MyAppointmentsView
              appointments={appointments}
              homeExercises={patientMedicalRec?.homeExercises || []}
              onGoToSchedule={() => setActiveTab('agendar')}
              onCancelAppointment={handleCancelAppointment}
            />
          )}

          {activeTab === 'perfil' && (
            <MyProfileView
              currentUser={currentUser}
              onSaveProfile={handleSaveProfile}
              onShowToast={showToast}
              onGoToDraDashboard={() => setActiveTab('painel-dra')}
            />
          )}

          {activeTab === 'painel-dra' && (
            <DraDashboardView
              appointments={appointments}
              encaixes={encaixes}
              medicalRecords={medicalRecords}
              onUpdateAppointments={(apts) => {
                setAppointments(apts);
                localStorage.setItem('ketlen_appointments', JSON.stringify(apts));
              }}
              onUpdateEncaixes={(encs) => {
                setEncaixes(encs);
                localStorage.setItem('ketlen_encaixes', JSON.stringify(encs));
              }}
              onUpdateMedicalRecords={(recs) => {
                setMedicalRecords(recs);
                localStorage.setItem('ketlen_medical_records', JSON.stringify(recs));
              }}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>



      {/* Navegação Inferior para Smartphones (Mobile Nav) */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        userLoggedIn={userLoggedIn}
      />

      {/* Modal Secundário de Alternar Conta */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onShowToast={showToast}
      />

      {/* Modal de Solicitação de Encaixe */}
      <EncaixeModal
        isOpen={isEncaixeModalOpen}
        defaultCareType={bookingCareType}
        onClose={() => setIsEncaixeModalOpen(false)}
        onSubmitEncaixe={handleSubmitEncaixe}
        onShowToast={showToast}
      />

      {/* Modal de Confirmação de Agendamento */}
      <BookingConfirmModal
        isOpen={isBookingModalOpen}
        careType={bookingCareType}
        dateIso={bookingDateIso}
        time={bookingTime}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirmBooking={handleConfirmBooking}
        onShowToast={showToast}
      />
    </div>
  );
}
