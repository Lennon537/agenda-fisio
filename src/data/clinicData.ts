import { ScheduledAppointment, EncaixeRequest } from '@/types';

export const CLINIC_INFO = {
  name: "Ketllen Souza Fisioterapia",
  subName: "FISIOTERAPIA & PILATES",
  tagline: "Mais movimento. Mais qualidade de vida.",
  subTagline: "Um cuidado próximo, no seu ritmo. Estamos aqui para caminhar com você.",
  phone: "5569992480599", // WhatsApp da clínica
  phoneFormatted: "(69) 99248-0599",
  draPhone: "5569992480599", // WhatsApp Direto da Dra. Ketllen Souza
  draPhoneFormatted: "(69) 99248-0599",
  address: "Av. Paulista, 1500 - São Paulo, SP",
  welcomeText: "Bem-vindo ao seu espaço de cuidado",
  motto: "Seu movimento, nosso cuidado.",
  mottoSub: "Um passo de cada vez, com você.",
  footerNotice: "Ketllen Souza Fisioterapia • Cuidar faz parte."
};

// Horários por padrão do print
export const TIME_SLOTS = {
  manha: ["08:00", "09:00", "10:00", "11:00", "11:30", "12:00"],
  tarde: ["14:00", "15:00", "16:00"]
};

// Mock inicial de agendamentos
export const INITIAL_APPOINTMENTS: ScheduledAppointment[] = [
  {
    id: "KFISIO-7492",
    careType: "fisioterapia",
    date: "2026-10-12",
    time: "10:00",
    patientName: "Mariana Duarte",
    phone: "(11) 98765-4321",
    status: "confirmado",
    isEncaixe: false,
    notes: "Reabilitação lombar e postura",
    createdAt: "2026-10-09T14:20:00Z"
  },
  {
    id: "KFISIO-3819",
    careType: "pilates",
    date: "2026-10-15",
    time: "15:00",
    patientName: "Lucas Vasconcelos",
    phone: "(11) 99123-8877",
    status: "aguardando",
    isEncaixe: true,
    notes: "Encaixe prioritário para aula de Pilates Reformer",
    createdAt: "2026-10-10T08:15:00Z"
  }
];

export const INITIAL_ENCAIXES: EncaixeRequest[] = [
  {
    id: "ENC-101",
    patientName: "Ana Clara Silva",
    phone: "(11) 97711-2233",
    careType: "fisioterapia",
    preferredShifts: ["manha"],
    preferredDate: "2026-10-12",
    painLevel: 8,
    reason: "Crise aguda de dor na coluna ao sentar",
    status: "aguardando",
    createdAt: "2026-10-10T09:30:00Z"
  },
  {
    id: "ENC-102",
    patientName: "Roberto Mendonça",
    phone: "(11) 98844-5566",
    careType: "pilates",
    preferredShifts: ["tarde", "qualquer"],
    preferredDate: "2026-10-13",
    painLevel: 5,
    reason: "Rigidez na cintura escapular pós-trabalho em computador",
    status: "aguardando",
    createdAt: "2026-10-10T10:15:00Z"
  }
];

// Mock inicial de Prontuários Eletrônicos & Exercícios Domiciliares
import { PatientMedicalRecord } from '@/types';

export const INITIAL_MEDICAL_RECORDS: PatientMedicalRecord[] = [
  {
    id: "PRONT-001",
    patientName: "Mariana Duarte",
    phone: "(11) 98765-4321",
    mainComplaint: "Dor lombar mecânica que piora após longas horas sentada no escritório.",
    clinicalDiagnosis: "Lombalgia postural inespecífica com encurtamento da cadeia posterior e hipotonia de transverso abdominal.",
    therapeuticGoals: "Alívio da dor aguda, ativação do core profundo, ganho de mobilidade pélvica e reeducação ergonômica.",
    evolutions: [
      {
        id: "EVOL-1",
        date: "2026-10-05",
        sessionNumber: 1,
        conduct: "Avaliação cinesiológica completa, termoterapia, liberação miofascial quadril lombar e respiração diafragmática.",
        painLevel: 7,
        observations: "Paciente relatou alívio imediato de 40% na mobilidade de flexão lombar ao final da sessão."
      },
      {
        id: "EVOL-2",
        date: "2026-10-09",
        sessionNumber: 2,
        conduct: "Exercícios no Cadillac com foco em estabilização pélvica, tração suave e ponte com faixa elástica.",
        painLevel: 4,
        observations: "Boa adesão aos exercícios domiciliares. Ausência de dor em repouso."
      }
    ],
    homeExercises: [
      {
        id: "EX-1",
        title: "Ponte com Ativação de Glúteos",
        repetitions: "3 séries de 10 repetições",
        frequency: "1 vez ao dia (pela manhã)",
        instructions: "Deitada de barriga para cima com joelhos dobrados, aperte os glúteos e suba o quadril sem arquear a coluna lombar. Mantenha 3 segundos no topo.",
        careType: "fisioterapia",
        visualGuide: {
          category: "fortalecimento",
          badge: "Estabilização Pélvica & Glúteos",
          targetMuscle: "Glúteo máximo, isquiotibiais e core profundo",
          steps: [
            "Deite de costas no tapete, pés alinhados com a largura dos quadris e braços ao lado do corpo.",
            "Acione suavemente o abdômen e aperte os glúteos antes de iniciar o movimento de subida.",
            "Eleve a pelve em linha reta do joelho ao ombro. Segure 3 segundos no topo mantendo a respiração contínua.",
            "Retorne vértebra por vértebra ao chão com controle, sem relaxar de forma brusca."
          ],
          postureTips: "Evite empurrar a barriga para cima exageradamente arquiando a lombar. O movimento deve vir puramente da força dos glúteos.",
          iconType: "strength"
        }
      },
      {
        id: "EX-2",
        title: "Alongamento 'Gato e Camelo' na Cadeira",
        repetitions: "10 repetições suaves com respiração profunda",
        frequency: "A cada 2 horas de trabalho",
        instructions: "Sentada com os pés no chão, curve a coluna expirando e olhe para o umbigo; depois abra o peito inspirando sem forçar o pescoço.",
        careType: "fisioterapia",
        visualGuide: {
          category: "mobilidade",
          badge: "Descompressão & Mobilidade Lombar",
          targetMuscle: "Toda a extensão da coluna torácica, lombar e peitoral",
          steps: [
            "Sente-se na ponta da cadeira com pés firmes no chão e mãos apoiadas nos joelhos.",
            "Inspire profundamente abrindo o peito para frente e projetando os ombros para trás (postura do camelo).",
            "Expire soltando todo o ar enquanto arredonda suavemente a coluna para trás, levando o queixo ao peito (postura do gato).",
            "Mova-se de forma fluida e ritmada acompanhando a respiração sem trancos."
          ],
          postureTips: "Não force a cabeça para trás ao estender. Mantenha o pescoço como uma extensão natural da coluna.",
          iconType: "spine"
        }
      },
      {
        id: "EX-3",
        title: "Respiração Diafragmática 3D",
        repetitions: "10 ciclos respiratórios lentos",
        frequency: "Antes de dormir",
        instructions: "Inspire pelo nariz expandindo as costelas lateralmente sem subir os ombros. Solte o ar suavemente pela boca ativando o abdômen inferior.",
        careType: "pilates",
        visualGuide: {
          category: "respiracao",
          badge: "Controle Autonômico & Core",
          targetMuscle: "Diafragma, transverso do abdômen e assoalho pélvico",
          steps: [
            "Deite-se confortavelmente ou sente-se ereto. Coloque uma mão no peito e outra sobre as costelas inferiores.",
            "Inspire pelo nariz por 4 segundos, sentindo suas costelas expandirem para os lados e para trás.",
            "Mantenha o ar por 2 segundos sem tensão nos ombros e mandíbula.",
            "Exale lentamente pela boca por 6 segundos, sentindo o umbigo suavemente recolher em direção à coluna."
          ],
          postureTips: "Seus ombros não devem subir ao inspirar. A respiração é lateral e tridimensional nas costelas.",
          iconType: "breath"
        }
      }
    ],
    updatedAt: "2026-10-09T15:30:00Z"
  },
  {
    id: "PRONT-002",
    patientName: "Lucas Vasconcelos",
    phone: "(11) 99123-8877",
    mainComplaint: "Tensão cervical e queimação no trapézio decorrente de estresse e postura.",
    clinicalDiagnosis: "Cervicobraquialgia postural com ponto-gatilho miofascial em trapézio superior e elevador da escápula.",
    therapeuticGoals: "Relaxamento da musculatura cervical, mobilização torácica no Reformer e fortalecimento de romboides.",
    evolutions: [
      {
        id: "EVOL-3",
        date: "2026-10-06",
        sessionNumber: 1,
        conduct: "Dry needling em pontos-gatilho de trapézio superior, tração cervical manual e exercícios suaves de mobilidade.",
        painLevel: 6,
        observations: "Paciente relatou sensação de leveza na nuca e melhora na rotação da cabeça."
      }
    ],
    homeExercises: [
      {
        id: "EX-4",
        title: "Retração Escapular (Puxada Dupla)",
        repetitions: "3 séries de 12 repetições",
        frequency: "Diariamente",
        instructions: "Puxe as escápulas uma em direção à outra imaginando segurar uma folha de papel entre elas. Segure 2 segundos e relaxe.",
        careType: "pilates",
        visualGuide: {
          category: "fortalecimento",
          badge: "Alinhamento Cervicotorácico",
          targetMuscle: "Romboides, trapézio médio e estabilizadores escapulares",
          steps: [
            "Em pé ou sentado com postura ereta e olhar no horizonte.",
            "Dobre os cotovelos a 90 graus junto ao tronco.",
            "Puxe os cotovelos para trás apertando as escápulas uma contra a outra.",
            "Mantenha por 2 segundos sentindo a musculatura das costas ativa e retorne suavemente."
          ],
          postureTips: "Não suba os ombros em direção às orelhas. As escápulas devem deslizar para trás e para baixo.",
          iconType: "stretch"
        }
      }
    ],
    updatedAt: "2026-10-06T16:20:00Z"
  }
];

// Mock inicial de Bloqueios de Horários e Folgas da Clínica
import { BlockedSlot, ClinicReview } from '@/types';

export const INITIAL_BLOCKED_SLOTS: BlockedSlot[] = [
  {
    id: "BLK-01",
    date: "2026-10-16",
    shift: "tarde",
    reason: "Manutenção preventiva nos aparelhos de Pilates Reformer",
    createdAt: "2026-10-11T09:00:00Z"
  },
  {
    id: "BLK-02",
    date: "2026-10-23",
    shift: "dia-todo",
    reason: "Participação no Congresso Brasileiro de Fisioterapia & Reabilitação",
    createdAt: "2026-10-10T14:30:00Z"
  }
];

// Mock inicial de Avaliações Reais de Pacientes
export const INITIAL_REVIEWS: ClinicReview[] = [
  {
    id: "REV-01",
    patientName: "Mariana Duarte",
    rating: 5,
    careType: "fisioterapia",
    comment: "Cheguei com uma crise de dor lombar que mal conseguia sentar no trabalho. Em poucas sessões a Dra. Ketllen aliviou a dor e os exercícios para casa que ela passou fizeram toda a diferença!",
    tags: ["Alívio Imediato da Dor", "Atendimento Humanizado", "Exercícios em Casa"],
    date: "09/10/2026",
    verified: true
  },
  {
    id: "REV-02",
    patientName: "Lucas Vasconcelos",
    rating: 5,
    careType: "pilates",
    comment: "O estúdio com Reformer e Cadillac é impecável. A Dra. Ketllen é muito atenciosa e adapta cada exercício para a necessidade de cada um. Não fico mais sem!",
    tags: ["Pilates em Aparelhos", "Pontualidade", "Postura & Flexibilidade"],
    date: "06/10/2026",
    verified: true
  },
  {
    id: "REV-03",
    patientName: "Ana Clara Silva",
    rating: 5,
    careType: "fisioterapia",
    comment: "Consegui um encaixe super rápido pela fila de espera do site. A estrutura da clínica é maravilhosa e o acolhimento é nota dez.",
    tags: ["Fila de Encaixe Ágil", "Excelente Estrutura"],
    date: "02/10/2026",
    verified: true
  }
];

