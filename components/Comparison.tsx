import React, { useMemo } from 'react';
import { ArrowLeft, TrendingUp, Calendar, FileText, Activity, AlertCircle } from 'lucide-react';
import { AssessmentRecord, AssessmentType } from '../types';
import { matrixRows, questionsData } from '../constants';
import { procSections } from '../proc_constants';

interface ComparisonProps {
  records: AssessmentRecord[];
  onBack: () => void;
}

const Comparison: React.FC<ComparisonProps> = ({ records, onBack }) => {
  // Ordena por data (mais antigo primeiro para mostrar evolução)
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => new Date(a.userData.date).getTime() - new Date(b.userData.date).getTime());
  }, [records]);

  const type = sortedRecords[0]?.type || 'MATRIX';
  const isProc = type === 'PROC';

  // --- LÓGICA DE CÁLCULO MATRIZ ---
  const calculateMatrixScore = (record: AssessmentRecord) => {
    let totalMastered = 0;
    let totalItems = 0;
    
    // Cálculo simplificado baseado no Results.tsx
    matrixRows.forEach(row => {
      const questionDef = questionsData.find(q => q.id === row.qId);
      row.levels.forEach(lvlNum => {
        const subLines = questionDef?.levels.filter(l => l.level === lvlNum) || [];
        if (subLines.length > 0) {
            totalItems++;
            let isMastered = false;
            subLines.forEach(line => {
                if (record.answers[row.qId]?.[line.id] === 'mastered') isMastered = true;
            });
            if (isMastered) totalMastered++;
        }
      });
    });
    return { totalMastered, totalItems, percentage: totalItems > 0 ? Math.round((totalMastered/totalItems)*100) : 0 };
  };

  // --- LÓGICA DE CÁLCULO PROC ---
  const calculateProcScore = (record: AssessmentRecord) => {
    const answers = record.procAnswers || {};
    const total = Object.values(answers).reduce((acc, val) => acc + val, 0);
    return { total, max: 200 }; // Max aproximado do PROC
  };

  const comparisonData = useMemo(() => {
    return sortedRecords.map(rec => {
        return {
            id: rec.id,
            date: rec.userData.date,
            age: rec.userData.age,
            score: isProc ? calculateProcScore(rec) : calculateMatrixScore(rec)
        };
    });
  }, [sortedRecords, isProc]);

  const initial = comparisonData[0];
  const final = comparisonData[comparisonData.length - 1];
  
  // Cálculo da Evolução
  let evolution = 0;
  if (isProc) {
      evolution = (final.score as any).total - (initial.score as any).total;
  } else {
      evolution = (final.score as any).totalMastered - (initial.score as any).totalMastered;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white fade-in transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-10 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 font-medium flex items-center gap-2 transition">
            <ArrowLeft size={20} /> Voltar ao Painel
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="text-emerald-500" /> Relatório de Evolução
          </h1>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-8">
        
        {/* Cabeçalho do Paciente */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
            <h2 className="text-2xl font-bold mb-2">{sortedRecords[0].userData.name}</h2>
            <p className="text-slate-500 dark:text-slate-400">Comparativo de {sortedRecords.length} avaliações ({type === 'PROC' ? 'Protocolo PROC' : 'Matriz de Comunicação'})</p>
        </div>

        {/* Cards de Comparação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {comparisonData.map((data, index) => (
                <div key={data.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs font-bold rounded-bl-lg">
                        Avaliação {index + 1}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-4 text-sm">
                        <Calendar size={16} /> {new Date(data.date).toLocaleDateString()}
                    </div>
                    
                    <div className="text-center py-4">
                        {isProc ? (
                            <>
                                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">{(data.score as any).total}</div>
                                <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Pontos (de 200)</div>
                            </>
                        ) : (
                            <>
                                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{(data.score as any).totalMastered}</div>
                                <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Habilidades Dominadas</div>
                                <div className="text-xs text-slate-400 mt-1">{(data.score as any).percentage}% do total</div>
                            </>
                        )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
                        <span className="block"><span className="font-semibold">Idade:</span> {data.age}</span>
                    </div>
                </div>
            ))}

            {/* Card de Resultado da Evolução */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800 flex flex-col justify-center items-center text-center">
                <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-2">Evolução do Período</h3>
                <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    {evolution > 0 ? '+' : ''}{evolution}
                </div>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                    {isProc ? 'Pontos no escore total' : 'Novas habilidades dominadas'}
                </p>
                <div className="mt-4 text-xs text-emerald-600/70 dark:text-emerald-400/70">
                    De {new Date(initial.date).toLocaleDateString()} a {new Date(final.date).toLocaleDateString()}
                </div>
            </div>
        </div>

        {/* Aviso */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3 border border-blue-100 dark:border-blue-800">
            <Activity className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
                <h4 className="font-bold text-blue-800 dark:text-blue-200 text-sm">Análise Comparativa</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Esta comparação foca nos dados quantitativos principais. Para uma análise detalhada qualitativa, recomenda-se abrir cada relatório individualmente e observar as anotações clínicas e itens específicos marcados.
                </p>
            </div>
        </div>

      </main>
    </div>
  );
};

export default Comparison;
