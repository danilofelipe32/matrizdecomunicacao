import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle, Info, Keyboard } from 'lucide-react';
import { questionsData, sectionDescriptions } from '../constants';
import { AnswerData, AnswerStatus } from '../types';

interface AssessmentProps {
  currentSection: string | null;
  activeQuestionIndex: number;
  answers: AnswerData;
  onAnswer: (qId: string, level: number, type: 'emergent' | 'mastered') => void;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}

const Assessment: React.FC<AssessmentProps> = ({
  currentSection,
  activeQuestionIndex,
  answers,
  onAnswer,
  onNext,
  onPrev,
  onExit
}) => {
  const currentQuestions = questionsData.filter(q => q.section === currentSection);
  const currentQuestion = currentQuestions[activeQuestionIndex];
  
  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modifiers are pressed to allow browser shortcuts
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

  if (!currentQuestion) return null;

  const progress = ((activeQuestionIndex + 1) / currentQuestions.length) * 100;
  
  const sectionInfo = currentSection ? sectionDescriptions[currentSection] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 shadow-sm transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                Seção {currentSection}
              </span>
              <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Questão {activeQuestionIndex + 1} de {currentQuestions.length}
              </h2>
            </div>
            <button
              onClick={onExit}
              className="text-xs font-medium text-slate-400 hover:text-red-500 transition flex items-center gap-1"
            >
              <RotateCcw size={12} /> Sair
            </button>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto p-4 md:p-6 w-full mb-24">
        
        {/* Section Description Card - Show only on first question of section */}
        {activeQuestionIndex === 0 && sectionInfo && (
            <div className="bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl p-6 mb-6 shadow-sm fade-in">
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-2">{sectionInfo.title}</h2>
                <p className="text-blue-800 dark:text-slate-300 leading-relaxed text-sm md:text-base">{sectionInfo.description}</p>
            </div>
        )}

        <div key={currentQuestion.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-6 fade-in">
          <div className="bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-800 px-6 py-8 md:px-10 border-b border-blue-100/50 dark:border-slate-700">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3">{currentQuestion.title}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{currentQuestion.description}</p>
          </div>
          <div className="p-6 md:p-10 space-y-8 bg-white dark:bg-slate-800">
            {currentQuestion.levels.map((lvl) => {
              const qId = currentQuestion.id;
              const status: AnswerStatus = answers[qId]?.[lvl.level] || 'none';
              
              const emergentClass = status === 'emergent' 
                ? 'bg-yellow-100 border-yellow-400 text-yellow-800 shadow-inner ring-2 ring-yellow-400/20 dark:bg-yellow-900/30 dark:text-yellow-200' 
                : 'bg-white text-slate-400 border-slate-200 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-500 dark:hover:bg-slate-700';
              
              const masteredClass = status === 'mastered' 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-600/20 dark:bg-blue-700 dark:border-blue-700' 
                : 'bg-white text-slate-400 border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-500 dark:hover:bg-slate-700';

              return (
                <div key={lvl.level} className="group border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-blue-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 text-lg flex items-center gap-2">
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                        Nível {lvl.level}
                      </span>
                      {lvl.label}
                    </h3>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={() => onAnswer(qId, lvl.level, 'emergent')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 active:scale-95 ${emergentClass}`}
                      >
                        {status === 'emergent' ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border border-current"></div>}
                        Emergente
                      </button>
                      <button
                        onClick={() => onAnswer(qId, lvl.level, 'mastered')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 active:scale-95 ${masteredClass}`}
                      >
                         {status === 'mastered' ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border border-current"></div>}
                        Dominado
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg text-sm text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                    <span className="font-semibold text-slate-500 dark:text-slate-500 block mb-2 uppercase text-xs tracking-wider flex items-center gap-1">
                      <Info size={12} /> Comportamentos observáveis:
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {lvl.behaviors.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-blue-300 dark:bg-blue-700 rounded-full flex-shrink-0"></span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <button
              onClick={onPrev}
              title="Atalho: Seta Esquerda"
              className="flex items-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <ChevronLeft size={20} /> <span className="hidden sm:inline">Anterior</span>
            </button>
            
            <div className="hidden md:flex text-slate-400 dark:text-slate-500 text-xs items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full">
               <Keyboard size={14} />
               <span>Navegue com as setas do teclado</span>
            </div>

            <button
              onClick={onNext}
              title="Atalho: Seta Direita"
              className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg shadow-red-600/30 font-bold transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              {activeQuestionIndex === currentQuestions.length - 1 ? 'Ver Resultados' : 'Próximo'} <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Assessment;