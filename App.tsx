import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Registration from './components/Registration';
import Triage from './components/Triage';
import Assessment from './components/Assessment';
import ProcAssessment from './components/ProcAssessment'; // Novo componente
import SectionSummary from './components/SectionSummary';
import Results from './components/Results';
import ProcResults from './components/ProcResults'; // Novo componente
import { AppState, initialState, AnswerStatus, UserData, Theme, AssessmentRecord, initialUserData, AssessmentType, ProcAnswers, ProcChecklist } from './types';
import { questionsData } from './constants';
import { db } from './db';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);
  const [modal, setModal] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void } | null>(null);

  // Inicializa DB e carrega dados
  useEffect(() => {
    const initApp = async () => {
      try {
        const records = await db.getAllRecords();
        const savedTheme = await db.getTheme();
        
        setState(prev => ({
          ...prev,
          records: records,
          theme: savedTheme,
          view: 'login' // Mantém o login no reload
        }));
      } catch (e) {
        console.error('Erro ao inicializar IndexedDB:', e);
      }
    };
    initApp();
  }, []);

  // Aplica tema visual
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'high-contrast');
    
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.theme === 'high-contrast') {
      root.classList.add('dark', 'high-contrast');
    }
  }, [state.theme]);

  // Helper para calcular progresso
  const calculateProgress = (record: AssessmentRecord) => {
    if (record.type === 'PROC') {
        // Cálculo simplificado para PROC (baseado em campos preenchidos é difícil, vamos deixar manual ou 0/100 para simplificar no momento, ou baseado em se tem respostas)
        const keys = Object.keys(record.procAnswers || {});
        // Total aproximado de items no PROC ~35
        return keys.length > 0 ? (keys.length > 30 ? 100 : Math.round((keys.length / 35) * 100)) : 0;
    } else {
        // Matrix logic
        const total = questionsData.reduce((acc, q) => acc + q.levels.length, 0);
        let answered = 0;
        Object.values(record.answers).forEach((q: any) => {
            Object.values(q).forEach((status) => {
                if (status !== 'none') answered++;
            });
        });
        return Math.round((answered / total) * 100);
    }
  };

  // Sincroniza dados com o Estado e com o IndexedDB
  const syncToRecords = (updatedState: Partial<AppState>) => {
    setState(prev => {
        const newState = { ...prev, ...updatedState };
        
        if (newState.currentRecordId) {
            const updatedRecords = prev.records.map(rec => {
                if (rec.id === newState.currentRecordId) {
                    const updatedRecord: AssessmentRecord = {
                        ...rec,
                        userData: newState.userData,
                        answers: newState.answers, // Matrix
                        procAnswers: newState.procAnswers, // Proc
                        procChecklist: newState.procChecklist, // Proc
                        currentSection: newState.currentSection,
                        lastModified: Date.now(),
                        // Progress calculation depends on type, logic handled inside calculateProgress but passed record needs updating
                    };
                    updatedRecord.progress = calculateProgress(updatedRecord);
                    
                    db.saveRecord(updatedRecord).catch(err => console.error("Erro ao salvar no DB:", err));
                    
                    return updatedRecord;
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
    db.saveTheme(theme).catch(err => console.error("Erro ao salvar tema:", err));
  };

  const handleLogin = () => {
    updateView('landing');
  };

  const handleLogout = () => {
    updateView('login');
  };

  // --- GERENCIAMENTO DE REGISTROS ---

  const handleCreateNewRecord = async (type: AssessmentType = 'MATRIX') => {
    const newId = Date.now().toString();
    const newRecord: AssessmentRecord = {
        id: newId,
        type: type, // Defines if Matrix or PROC
        lastModified: Date.now(),
        userData: { ...initialUserData, date: new Date().toISOString().split('T')[0] },
        answers: {},
        procAnswers: {},
        procChecklist: {},
        currentSection: null,
        progress: 0
    };

    try {
      await db.saveRecord(newRecord);
      
      setState(prev => ({
          ...prev,
          records: [newRecord, ...prev.records],
          currentRecordId: newId,
          userData: newRecord.userData,
          answers: newRecord.answers,
          procAnswers: {},
          procChecklist: {},
          currentSection: null,
          activeQuestionIndex: 0,
          view: 'registration' // Both start with registration
      }));
    } catch (e) {
      alert("Erro ao criar novo registro no banco de dados.");
    }
  };

  const handleSelectRecord = (recordId: string) => {
    const record = state.records.find(r => r.id === recordId);
    if (record) {
        const isProc = record.type === 'PROC';
        const hasStarted = isProc 
            ? (Object.keys(record.procAnswers || {}).length > 0)
            : (Object.keys(record.answers).length > 0);

        setState(prev => ({
            ...prev,
            currentRecordId: record.id,
            userData: record.userData,
            answers: record.answers,
            procAnswers: record.procAnswers || {},
            procChecklist: record.procChecklist || {},
            currentSection: record.currentSection,
            activeQuestionIndex: 0,
            view: hasStarted 
                ? (isProc ? 'procAssessment' : 'results') // If started, go to assessment/results
                : 'registration' // Else registration
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
            procAnswers: record.procAnswers || {},
            procChecklist: record.procChecklist || {},
            currentSection: record.currentSection,
            view: 'registration'
        }));
    }
  };

  const handleDeleteRecord = (recordId: string) => {
    setModal({
        open: true,
        title: "Excluir Registro",
        message: "Tem certeza que deseja excluir esta avaliação permanentemente?",
        onConfirm: async () => {
            try {
              await db.deleteRecord(recordId);
              setState(prev => ({
                  ...prev,
                  records: prev.records.filter(r => r.id !== recordId),
                  ...(prev.currentRecordId === recordId ? {
                      currentRecordId: null,
                      userData: initialUserData,
                      answers: {},
                      procAnswers: {},
                      procChecklist: {},
                      currentSection: null
                  } : {})
              }));
              setModal(null);
            } catch (e) {
              alert("Erro ao excluir registro.");
            }
        }
    });
  };

  // --- DATA HANDLERS ---

  const handleUpdateUserData = (field: keyof UserData, value: string) => {
    syncToRecords({
        userData: { ...state.userData, [field]: value }
    });
  };

  // Navigates after Registration based on type
  const handleRegistrationNext = () => {
      const currentRecord = state.records.find(r => r.id === state.currentRecordId);
      if (currentRecord?.type === 'PROC') {
          updateView('procAssessment');
      } else {
          updateView('triage');
      }
  };

  // --- MATRIX HANDLERS ---

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
    if (type === 'emergent') newStatus = (currentStatus === 'emergent') ? 'none' : 'emergent';
    else if (type === 'mastered') newStatus = (currentStatus === 'mastered') ? 'none' : 'mastered';
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
  
  const handlePrevQuestion = () => {
    if (state.activeQuestionIndex > 0) {
      setState(prev => ({ ...prev, activeQuestionIndex: prev.activeQuestionIndex - 1 }));
      window.scrollTo(0, 0);
    } else {
       const currentSectionIndex = sectionOrder.indexOf(state.currentSection || '');
       if (currentSectionIndex > 0) {
          const prevSection = sectionOrder[currentSectionIndex - 1];
          const prevQuestions = questionsData.filter(q => q.section === prevSection);
          setState(prev => ({ ...prev, currentSection: prevSection, activeQuestionIndex: prevQuestions.length - 1 }));
          window.scrollTo(0, 0);
       } else {
          updateView('triage');
       }
    }
  };

  const handleSectionComplete = () => {
    const currentSectionIndex = sectionOrder.indexOf(state.currentSection || '');
    if (currentSectionIndex !== -1 && currentSectionIndex < sectionOrder.length - 1) {
      const nextSection = sectionOrder[currentSectionIndex + 1];
      syncToRecords({ currentSection: nextSection, activeQuestionIndex: 0, view: 'assessment' });
      window.scrollTo(0, 0);
    } else {
      updateView('results');
    }
  };

  // --- PROC HANDLERS ---
  const handleProcAnswer = (qId: string, value: number) => {
      const newProcAnswers = { ...state.procAnswers, [qId]: value };
      syncToRecords({ procAnswers: newProcAnswers });
  };

  const handleProcChecklist = (itemId: string, checked: boolean) => {
      const newChecklist = { ...state.procChecklist, [itemId]: checked };
      syncToRecords({ procChecklist: newChecklist });
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
          onNavigate={(target) => {
              if (target === 'triage') handleRegistrationNext(); // Smart routing based on type
              else updateView(target);
          }}
        />
      )}
      
      {/* MATRIX VIEWS */}
      {state.view === 'triage' && (
        <Triage onSetSection={handleSetSection} onNavigate={updateView} />
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

      {/* PROC VIEWS */}
      {state.view === 'procAssessment' && (
          <ProcAssessment 
             answers={state.procAnswers}
             checklist={state.procChecklist}
             onUpdateAnswer={handleProcAnswer}
             onUpdateChecklist={handleProcChecklist}
             onExit={() => updateView('landing')}
             onFinish={() => updateView('procResults')}
          />
      )}
      {state.view === 'procResults' && (
          <ProcResults 
             answers={state.procAnswers}
             checklist={state.procChecklist}
             userData={state.userData}
             onNavigate={updateView}
             onEdit={() => updateView('procAssessment')}
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
