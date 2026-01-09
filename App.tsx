import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Registration from './components/Registration';
import Triage from './components/Triage';
import Assessment from './components/Assessment';
import SectionSummary from './components/SectionSummary';
import Results from './components/Results';
import { AppState, initialState, AnswerStatus, UserData, Theme, AssessmentRecord, initialUserData } from './types';
import { questionsData } from './constants';

const STORAGE_KEY = 'communication_matrix_db_v1';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);
  const [modal, setModal] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void } | null>(null);

  // Load data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Migração simples ou carregamento
        setState(prev => ({
          ...initialState,
          records: Array.isArray(parsed.records) ? parsed.records : [], // Carrega a lista
          theme: parsed.theme || 'light',
          view: 'login' // Force login screen on reload
        }));
      } catch (e) {
        console.error('Error loading data', e);
      }
    }
  }, []);

  // Save specific record whenever active data changes
  useEffect(() => {
    // Persist to LocalStorage
    // We save the entire state structure (records list + theme preference)
    // But we don't save the "active session" transiently if we are in login
    if (state.view !== 'login') {
       const stateToSave = {
         records: state.records,
         theme: state.theme
       };
       localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [state.records, state.theme, state.view]);

  // Apply Theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'high-contrast');
    
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.theme === 'high-contrast') {
      root.classList.add('dark', 'high-contrast');
    }
  }, [state.theme]);

  // Helper to calculate progress for a record
  const calculateProgress = (answers: any) => {
    const total = questionsData.reduce((acc, q) => acc + q.levels.length, 0);
    let answered = 0;
    Object.values(answers).forEach((q: any) => {
        Object.values(q).forEach((status) => {
            if (status !== 'none') answered++;
        });
    });
    return Math.round((answered / total) * 100);
  };

  // Sync active session data to the records list
  const syncToRecords = (updatedState: Partial<AppState>) => {
    setState(prev => {
        const newState = { ...prev, ...updatedState };
        
        if (newState.currentRecordId) {
            const updatedRecords = prev.records.map(rec => {
                if (rec.id === newState.currentRecordId) {
                    return {
                        ...rec,
                        userData: newState.userData,
                        answers: newState.answers,
                        currentSection: newState.currentSection,
                        lastModified: Date.now(),
                        progress: calculateProgress(newState.answers)
                    };
                }
                return rec;
            });
            return { ...newState, records: updatedRecords };
        }
        return newState;
    });
  };

  const updateView = (view: AppState['view']) => {
    setState(prev => ({ ...prev, view }));
    window.scrollTo(0, 0);
  };

  const handleSetTheme = (theme: Theme) => {
    setState(prev => ({ ...prev, theme }));
  };

  const handleLogin = () => {
    updateView('landing');
  };

  const handleLogout = () => {
    updateView('login');
  };

  // --- RECORD MANAGEMENT ---

  const handleCreateNewRecord = () => {
    const newId = Date.now().toString();
    const newRecord: AssessmentRecord = {
        id: newId,
        lastModified: Date.now(),
        userData: { ...initialUserData, date: new Date().toISOString().split('T')[0] },
        answers: {},
        currentSection: null,
        progress: 0
    };

    setState(prev => ({
        ...prev,
        records: [newRecord, ...prev.records], // Add to top
        currentRecordId: newId,
        userData: newRecord.userData,
        answers: newRecord.answers,
        currentSection: null,
        activeQuestionIndex: 0,
        view: 'registration'
    }));
  };

  const handleSelectRecord = (recordId: string) => {
    const record = state.records.find(r => r.id === recordId);
    if (record) {
        setState(prev => ({
            ...prev,
            currentRecordId: record.id,
            userData: record.userData,
            answers: record.answers,
            currentSection: record.currentSection,
            activeQuestionIndex: 0, // Reset question index when loading
            view: Object.keys(record.answers).length > 0 ? 'results' : 'registration' // Smart redirect
        }));
    }
  };

  const handleEditRecord = (recordId: string) => {
    const record = state.records.find(r => r.id === recordId);
    if (record) {
        setState(prev => ({
            ...prev,
            currentRecordId: record.id,
            userData: record.userData,
            answers: record.answers,
            currentSection: record.currentSection,
            view: 'registration' // Force registration view
        }));
    }
  };

  const handleDeleteRecord = (recordId: string) => {
    setModal({
        open: true,
        title: "Excluir Registro",
        message: "Tem certeza que deseja excluir esta avaliação permanentemente?",
        onConfirm: () => {
            setState(prev => ({
                ...prev,
                records: prev.records.filter(r => r.id !== recordId),
                // If we deleted the active one, reset active state
                ...(prev.currentRecordId === recordId ? {
                    currentRecordId: null,
                    userData: initialUserData,
                    answers: {},
                    currentSection: null
                } : {})
            }));
            setModal(null);
        }
    });
  };

  // --- DATA HANDLERS (Now using syncToRecords) ---

  const handleUpdateUserData = (field: keyof UserData, value: string) => {
    syncToRecords({
        userData: { ...state.userData, [field]: value }
    });
  };

  const handleSetSection = (section: string) => {
    syncToRecords({
        currentSection: section,
        view: 'assessment',
        activeQuestionIndex: 0
    });
    window.scrollTo(0, 0);
  };

  const handleAnswer = (qId: string, level: number, type: 'emergent' | 'mastered') => {
    const currentAnswers = { ...state.answers };
    if (!currentAnswers[qId]) currentAnswers[qId] = {};
    
    const currentStatus = currentAnswers[qId][level];
    let newStatus: AnswerStatus = 'none';

    if (type === 'emergent') {
        newStatus = (currentStatus === 'emergent') ? 'none' : 'emergent';
    } else if (type === 'mastered') {
        newStatus = (currentStatus === 'mastered') ? 'none' : 'mastered';
    }

    currentAnswers[qId][level] = newStatus;
    
    syncToRecords({ answers: currentAnswers });
  };

  const sectionOrder = ['A', 'B', 'C'];

  const handleNextQuestion = () => {
    const currentQuestions = questionsData.filter(q => q.section === state.currentSection);
    
    if (state.activeQuestionIndex < currentQuestions.length - 1) {
      setState(prev => ({ ...prev, activeQuestionIndex: prev.activeQuestionIndex + 1 }));
      window.scrollTo(0, 0);
    } else {
      updateView('sectionSummary');
    }
  };

  const handleSectionComplete = () => {
    const currentSectionIndex = sectionOrder.indexOf(state.currentSection || '');
    
    if (currentSectionIndex !== -1 && currentSectionIndex < sectionOrder.length - 1) {
      const nextSection = sectionOrder[currentSectionIndex + 1];
      syncToRecords({
        currentSection: nextSection,
        activeQuestionIndex: 0,
        view: 'assessment'
      });
      window.scrollTo(0, 0);
    } else {
      updateView('results');
    }
  };

  const handlePrevQuestion = () => {
    if (state.activeQuestionIndex > 0) {
      setState(prev => ({ ...prev, activeQuestionIndex: prev.activeQuestionIndex - 1 }));
      window.scrollTo(0, 0);
    } else {
      const currentSectionIndex = sectionOrder.indexOf(state.currentSection || '');
      if (currentSectionIndex > 0) {
        const prevSection = sectionOrder[currentSectionIndex - 1];
        const prevQuestions = questionsData.filter(q => q.section === prevSection);
        
        setState(prev => ({
            ...prev,
            currentSection: prevSection,
            activeQuestionIndex: prevQuestions.length - 1
        }));
        // Need to sync currentSection back if we changed it going backwards
        // (Though strictly speaking, currentSection in record usually tracks "furthest" or "current" progress. 
        // For simplicity, we just update local state for navigation here).
        window.scrollTo(0, 0);
      } else {
        updateView('triage');
      }
    }
  };

  return (
    <>
      {state.view === 'login' && <Login onLogin={handleLogin} />}
      {state.view === 'landing' && (
        <Dashboard
          records={state.records}
          currentTheme={state.theme}
          onSetTheme={handleSetTheme}
          onNewRecord={handleCreateNewRecord}
          onSelectRecord={handleSelectRecord}
          onEditRecord={handleEditRecord}
          onDeleteRecord={handleDeleteRecord}
          onLogout={handleLogout}
        />
      )}
      {state.view === 'registration' && (
        <Registration
          userData={state.userData}
          onUpdate={handleUpdateUserData}
          onNavigate={updateView}
        />
      )}
      {state.view === 'triage' && (
        <Triage
          onSetSection={handleSetSection}
          onNavigate={updateView}
        />
      )}
      {state.view === 'assessment' && (
        <Assessment
          currentSection={state.currentSection}
          activeQuestionIndex={state.activeQuestionIndex}
          answers={state.answers}
          onAnswer={handleAnswer}
          onNext={handleNextQuestion}
          onPrev={handlePrevQuestion}
          onExit={() => updateView('landing')}
        />
      )}
      {state.view === 'sectionSummary' && state.currentSection && (
        <SectionSummary
          section={state.currentSection}
          answers={state.answers}
          onNext={handleSectionComplete}
          onReview={() => updateView('assessment')}
        />
      )}
      {state.view === 'results' && (
        <Results
          answers={state.answers}
          userData={state.userData}
          onNavigate={updateView}
        />
      )}

      {/* Modal Overlay */}
      {modal && modal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{modal.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{modal.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={modal.onConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-lg shadow-red-600/20 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;