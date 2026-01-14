import React, { useMemo } from 'react';
import { CheckCircle, AlertCircle, ArrowRight, Edit } from 'lucide-react';
import { questionsData, sectionDescriptions } from '../constants';
import { AnswerData } from '../types';

interface SectionSummaryProps {
  section: string;
  answers: AnswerData;
  onNext: () => void;
  onReview: () => void;
}

const SectionSummary: React.FC<SectionSummaryProps> = ({ section, answers, onNext, onReview }) => {
  const summaryData = useMemo(() => {
    const sectionQuestions = questionsData.filter(q => q.section === section);
    
    // Aggregate stats by Level
    const levelStats: Record<number, { 
      label: string; 
      total: number; 
      mastered: number; 
      emergent: number; 
      none: number 
    }> = {};

    sectionQuestions.forEach(q => {
      q.levels.forEach(lvl => {
        // Inicializa o objeto de estatísticas para este nível se não existir
        if (!levelStats[lvl.level]) {
          // Busca um rótulo genérico para o nível, tentando pegar o category ou um padrão
          const levelLabel = lvl.category 
            ? `${lvl.category} (Nível ${lvl.level})` 
            : `Nível ${lvl.level}`;

          levelStats[lvl.level] = {
            label: `Nível ${lvl.level}`, // Mantém agrupado por Nível Numérico (I, II, III...)
            total: 0,
            mastered: 0,
            emergent: 0,
            none: 0
          };
        }
        
        levelStats[lvl.level].total += 1;
        
        // CORREÇÃO AQUI: Usa lvl.id em vez de lvl.level para buscar a resposta
        const status = answers[q.id]?.[lvl.id] || 'none';
        
        if (status === 'mastered') levelStats[lvl.level].mastered += 1;
        else if (status === 'emergent') levelStats[lvl.level].emergent += 1;
        else levelStats[lvl.level].none += 1;
      });
    });

    return {
      totalQuestions: sectionQuestions.length,
      // Ordena os níveis numericamente
      levels: Object.entries(levelStats)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([_, val]) => val)
    };
  }, [section, answers]);

  const sectionInfo = sectionDescriptions[section];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans fade-in transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
            <img src="https://i.imgur.com/CSrEIRC.png" alt="Logo" className="w-6 h-6 object-contain" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Resumo da Seção {section}</h1>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto p-6 w-full flex flex-col items-center justify-center">
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-full max-w-2xl">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-slate-900 dark:to-slate-800 p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Seção {section} Concluída!</h2>
            <p className="text-blue-200">{sectionInfo?.title}</p>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Desempenho por Nível</h3>
              
              {summaryData.levels.length === 0 ? (
                 <p className="text-center text-slate-400 py-4">Nenhum dado registrado para esta seção.</p>
              ) : (
                <div className="space-y-4">
                  {summaryData.levels.map((lvl, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-slate-800 dark:text-white">{lvl.label}</span>
                        <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">
                          {lvl.total} Habilidades Avaliadas
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                            <CheckCircle size={16} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="text-xl font-bold text-slate-800 dark:text-white">{lvl.mastered}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dominadas</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                            <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <div>
                            <div className="text-xl font-bold text-slate-800 dark:text-white">{lvl.emergent}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Emergentes</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-center text-slate-500 dark:text-slate-400 text-sm italic mb-8">
              Revise os dados acima. Se estiver tudo correto, avance para a próxima etapa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onReview}
                className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2"
              >
                <Edit size={18} /> Revisar Respostas
              </button>
              <button
                onClick={onNext}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2 transform active:scale-95"
              >
                Próxima Etapa <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default SectionSummary;