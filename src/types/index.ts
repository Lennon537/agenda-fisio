export type CareType = 'fisioterapia' | 'pilates';

export interface BookingSlot {
  id: string;
  time: string;
  shift: 'manha' | 'tarde';
  available: boolean;
}

export interface PatientUser {
  name: string;
  phone: string;
  email?: string;
  isFirstTime?: boolean;
  notes?: string;
}

export interface ScheduledAppointment {
  id: string;
  careType: CareType;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  patientName: string;
  phone: string;
  status: 'confirmado' | 'aguardando' | 'cancelado' | 'concluido';
  isEncaixe?: boolean;
  notes?: string;
  createdAt: string;
}

export interface EncaixeRequest {
  id: string;
  patientName: string;
  phone: string;
  careType: CareType;
  preferredShifts: ('manha' | 'tarde' | 'qualquer')[];
  preferredDate?: string;
  painLevel?: number;
  reason?: string;
  status: 'aguardando' | 'chamado' | 'atendido';
  createdAt: string;
}

// Prontuário e Evolução Clínica
export interface ClinicalEvolution {
  id: string;
  date: string;
  sessionNumber: number;
  conduct: string; // conduta fisioterapêutica realizada
  painLevel: number; // 0 a 10
  observations: string;
}

// Exercícios e Orientações para Casa
export interface HomeExercise {
  id: string;
  title: string;
  repetitions: string;
  frequency: string;
  instructions: string;
  careType: CareType;
}

// Ficha de Prontuário do Paciente
export interface PatientMedicalRecord {
  id: string;
  patientName: string;
  phone: string;
  mainComplaint: string; // Queixa Principal
  clinicalDiagnosis: string; // Diagnóstico Fisioterapêutico / Cinesiológico
  therapeuticGoals: string; // Objetivos do Tratamento
  evolutions: ClinicalEvolution[];
  homeExercises: HomeExercise[];
  updatedAt: string;
}

export type ActiveNavTab = 'agendar' | 'agendamentos' | 'perfil' | 'painel-dra';
export type UserRole = 'patient' | 'admin';

