

export type ViewState = 'login' | 'landing' | 'registration' | 'triage' | 'assessment' | 'sectionSummary' | 'results' | 'procAssessment' | 'procResults';

export type AnswerStatus = 'emergent' | 'mastered' | 'none';

export type Theme = 'light' | 'dark' | 'high-contrast';

export type AssessmentType = 'MATRIX' | 'PROC';

// --- Matriz Types ---
export interface AnswerData {
  [questionId: string]: {
    [level: number]: AnswerStatus;
  };
}

// --- PROC Types ---
export interface ProcAnswers {
  [questionId: string]: number; // ID da questão -> Valor da pontuação selecionada
}

export interface ProcChecklist {
  [itemId: string]: boolean; // Checkboxes qualitativos
}

export interface UserData {
  name: string;
  age: string;
  gender: string;
  fatherName: string;
  motherName: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  zip: string;
  neighborhood: string;
  diagnosis: string;
  consultationReason: string;
  speechTherapist: string;
  observations: string;
}

export interface AssessmentRecord {
  id: string;
  type: AssessmentType; // Novo campo para distinguir
  lastModified: number;
  userData: UserData;
  answers: AnswerData; // Usado pela Matriz
  procAnswers?: ProcAnswers; // Usado pelo PROC
  procChecklist?: ProcChecklist; // Usado pelo PROC
  currentSection: string | null;
  progress: number;
  clinicalAnalysis?: string; // Campo para persistir o parecer clínico
}

export interface AppState {
  view: ViewState;
  currentRecordId: string | null;
  records: AssessmentRecord[];
  
  // Dados da sessão ativa
  currentSection: string | null;
  activeQuestionIndex: number;
  answers: AnswerData;
  
  // Dados PROC ativos
  procAnswers: ProcAnswers;
  procChecklist: ProcChecklist;

  userData: UserData;
  theme: Theme;
  clinicalAnalysis: string | null; // Estado da análise clínica atual
}

// ... (Resto das interfaces da Matriz mantidas para compatibilidade)
export interface LevelDefinition {
  level: number;
  label: string;
  behaviors: string[];
}

export interface Question {
  id: string;
  section: string;
  title: string;
  description: string;
  levels: LevelDefinition[];
}

export interface MatrixRow {
  category: string;
  label: string;
  qId: string;
  levels: number[];
}

export const initialUserData: UserData = {
  name: '',
  age: '',
  gender: '',
  fatherName: '',
  motherName: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  phone: '',
  email: '',
  street: '',
  number: '',
  zip: '',
  neighborhood: '',
  diagnosis: '',
  consultationReason: '',
  speechTherapist: '',
  observations: ''
};

export const initialState: AppState = {
  view: 'login',
  currentRecordId: null,
  records: [],
  currentSection: null,
  activeQuestionIndex: 0,
  answers: {},
  procAnswers: {},
  procChecklist: {},
  userData: initialUserData,
  theme: 'light',
  clinicalAnalysis: null
};
