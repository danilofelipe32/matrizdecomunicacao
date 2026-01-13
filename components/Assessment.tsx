import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Square, CheckSquare, ArrowLeft } from 'lucide-react';
import { questionsData } from '../constants';
import { AnswerData, AnswerStatus } from '../types';

interface AssessmentProps {
  currentSection: string | null;
  activeQuestionIndex: number;
  answers: AnswerData;
  onAnswer: (qId: string, rowId: string, type: 'emergent' | 'mastered' | 'none') => void;
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
  
  // Estado local para controlar o checkbox "Não faz isso" visualmente
  const [doesNotDoIt, setDoesNotDoIt] = useState(false);

  useEffect(() => {
    // Reset state on question change
    setDoesNotDoIt(false);
  }, [currentQuestion.id]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

  if (!currentQuestion) return null;

  const handleToggleDoesNotDo = () => {
    const newState = !doesNotDoIt;
    setDoesNotDoIt(newState);
    
    if (newState) {
      // Se marcou "Não faz isso", define todas as linhas desta questão como 'none' (NU)
      currentQuestion.levels.forEach(lvl => {
        onAnswer(currentQuestion.id, lvl.id, 'none');
      });
    }
  };

  const handleLevelSelection = (rowId: string, status: 'none' | 'emergent' | 'mastered') => {
    if (doesNotDoIt) setDoesNotDoIt(false); // Desmarca "Não faz isso" se selecionar algo
    onAnswer(currentQuestion.id, rowId, status);
  };

  const progress = ((activeQuestionIndex + 1) / currentQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
      
      {/* Header Compacto */}
      <header className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <button onClick={onExit} className="text-slate-500 hover:text-red-600 transition">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                   Seção {currentSection} <span className="font-normal text-slate-500 mx-1">|</span> Questão {activeQuestionIndex + 1}/{currentQuestions.length}
                </h2>
                <div className="w-32 h-1.5 bg-slate-200 rounded-full mt-1">
                   <div className="h-1.5 bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
             </div>
          </div>
          <div className="flex gap-2">
             <button onClick={onPrev} className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-200 text-sm font-medium dark:text-white dark:border-slate-600 dark:hover:bg-slate-700">Anterior</button>
             <button onClick={onNext} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm">Próximo</button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto p-4 md:p-8 w-full">
        
        {/* Card Principal estilo Documento */}
        <div className="bg-white dark:bg-slate-800 p-6 md:p-10 shadow-lg border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto">
          
          {/* Cabeçalho da Questão */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-6 border-slate-200 dark:border-slate-700">
            <div className="flex-1">
               <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                 {currentQuestion.id}: {currentQuestion.title}
               </h1>
            </div>
            
            {/* Checkbox "Não faz isso" */}
            <button 
              onClick={handleToggleDoesNotDo}
              className="flex items-center gap-2 cursor-pointer group"
            >
               <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors ${doesNotDoIt ? 'bg-slate-800 border-slate-800 dark:bg-white dark:border-white' : 'border-slate-400 bg-white dark:bg-slate-700'}`}>
                  {doesNotDoIt && <CheckSquare size={18} className="text-white dark:text-slate-900" />}
               </div>
               <span className="text-lg font-medium text-slate-700 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white">Não faz isso</span>
            </button>
          </div>

          {/* Descrição */}
          <div className="mb-8">
             <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic">
               {currentQuestion.description}
             </p>
             <p className="mt-4 font-medium text-slate-600 dark:text-slate-400">
               O que esse indivíduo faz para mostrar a você que {currentQuestion.title.toLowerCase()}?
             </p>
          </div>

          {/* Tabela de Níveis/Linhas - Estilo PDF */}
          <div className="overflow-hidden border border-slate-800 dark:border-slate-500 rounded-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-200 dark:bg-slate-700 border-b border-slate-800 dark:border-slate-500 text-slate-900 dark:text-white">
                  <th className="p-3 border-r border-slate-800 dark:border-slate-500 w-3/5 font-bold text-sm md:text-base">Comportamento</th>
                  <th className="p-2 border-r border-slate-800 dark:border-slate-500 text-center w-[10%] font-bold">NU</th>
                  <th className="p-2 border-r border-slate-800 dark:border-slate-500 text-center w-[10%] font-bold">E</th>
                  <th className="p-2 text-center w-[10%] font-bold">D</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                {currentQuestion.levels.map((lvl, index) => {
                  const qId = currentQuestion.id;
                  const currentStatus = answers[qId]?.[lvl.id] || 'none'; 
                  const status = doesNotDoIt ? 'none' : currentStatus;
                  
                  // Verifica se é o primeiro item de uma nova categoria
                  const showHeader = index === 0 || lvl.category !== currentQuestion.levels[index - 1].category;

                  return (
                    <React.Fragment key={lvl.id}>
                      {/* Cabeçalho da Categoria (se houver e mudou) */}
                      {showHeader && lvl.category && (
                        <tr className="bg-slate-100 dark:bg-slate-750">
                          <td colSpan={4} className="p-2 pl-3 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-t border-slate-200 dark:border-slate-700">
                            {lvl.category} {lvl.level ? `(Nível ${lvl.level})` : ''}
                          </td>
                        </tr>
                      )}

                      <tr className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                        <td className="p-4 border-r border-slate-800 dark:border-slate-500 align-middle">
                          <div className="text-sm md:text-base font-medium leading-snug">
                            {lvl.label}
                          </div>
                          {lvl.behaviors && lvl.behaviors.length > 0 && (
                             <div className="text-xs text-slate-500 mt-1 pl-2 border-l-2 border-slate-300">
                                {lvl.behaviors.join(', ')}
                             </div>
                          )}
                        </td>
                        
                        {/* Coluna NU (Não Usado) */}
                        <td 
                           className={`p-2 border-r border-slate-800 dark:border-slate-500 text-center align-middle cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${status === 'none' ? 'bg-slate-100 dark:bg-slate-700' : ''}`}
                           onClick={() => handleLevelSelection(lvl.id, 'none')}
                        >
                           <div className="flex justify-center">
                              <div className={`w-6 h-6 rounded-full border-2 border-slate-600 flex items-center justify-center ${status === 'none' ? 'bg-slate-800 border-slate-800 dark:bg-white dark:border-white' : ''}`}>
                                {status === 'none' && <div className="w-2.5 h-2.5 bg-white dark:bg-slate-900 rounded-full"></div>}
                              </div>
                           </div>
                        </td>

                        {/* Coluna E (Emergente) */}
                        <td 
                           className={`p-2 border-r border-slate-800 dark:border-slate-500 text-center align-middle cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors ${status === 'emergent' ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''}`}
                           onClick={() => handleLevelSelection(lvl.id, 'emergent')}
                        >
                           <div className="flex justify-center">
                              <div className={`w-6 h-6 rounded-full border-2 border-slate-600 flex items-center justify-center ${status === 'emergent' ? 'bg-slate-800 border-slate-800 dark:bg-white dark:border-white' : ''}`}>
                                {status === 'emergent' && <div className="w-2.5 h-2.5 bg-white dark:bg-slate-900 rounded-full"></div>}
                              </div>
                           </div>
                        </td>

                        {/* Coluna D (Dominado) */}
                        <td 
                           className={`p-2 text-center align-middle cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${status === 'mastered' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                           onClick={() => handleLevelSelection(lvl.id, 'mastered')}
                        >
                           <div className="flex justify-center">
                              <div className={`w-6 h-6 rounded-full border-2 border-slate-600 flex items-center justify-center ${status === 'mastered' ? 'bg-slate-800 border-slate-800 dark:bg-white dark:border-white' : ''}`}>
                                {status === 'mastered' && <div className="w-2.5 h-2.5 bg-white dark:bg-slate-900 rounded-full"></div>}
                              </div>
                           </div>
                        </td>

                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-xs text-slate-400 italic text-center">
            Legenda: <strong>NU</strong> = Não Usado | <strong>E</strong> = Emergente | <strong>D</strong> = Dominado
          </div>

        </div>
      </main>
    </div>
  );
};

export default Assessment;