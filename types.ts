
export type ViewState = 'login' | 'landing' | 'registration' | 'triage' | 'assessment' | 'sectionSummary' | 'results';

export type AnswerStatus = 'emergent' | 'mastered' | 'none';

export type Theme = 'light' | 'dark' | 'high-contrast';

export interface AnswerData {
  [questionId: string]: {
    [level: number]: AnswerStatus;
  };
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
  lastModified: number;
  userData: UserData;
  answers: AnswerData;
  currentSection: string | null;
  progress: number;
}

export interface AppState {
  view: ViewState;
  currentRecordId: string | null; // ID da avaliação ativa
  records: AssessmentRecord[];    // Lista de todas as avaliações
  
  // Dados da sessão ativa (espelhados no record atual)
  currentSection: string | null;
  activeQuestionIndex: number;
  answers: AnswerData;
  userData: UserData;
  theme: Theme;
}

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
  userData: initialUserData,
  theme: 'light'
};