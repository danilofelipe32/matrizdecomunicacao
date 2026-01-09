
import React, { useMemo } from 'react';
import { Printer, Edit, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import { UserData, ProcAnswers, ProcChecklist } from '../types';
import { procChecklistSections } from '../proc_constants';

interface ProcResultsProps {
  userData: UserData;
  answers: ProcAnswers;
  checklist: ProcChecklist;
  onNavigate: (view: 'registration' | 'landing') => void;
  onEdit: () => void;
}

const ProcResults: React.FC<ProcResultsProps> = ({ userData, answers, checklist, onNavigate, onEdit }) => {
  
  const scores = useMemo(() => {
    // Helper para somar
    const sum = (ids: string[]) => ids.reduce((acc, id) => acc + (answers[id] || 0), 0);
    
    // 1a
    const s1a = sum(['1a_1', '1a_2', '1a_3', '1a_4', '1a_5']);
    
    // 1b
    const s1b = sum(['1b_1', '1b_2', '1b_3', '1b_4', '1b_5', '1b_6', '1b_7']);
    
    // 1c Logic Complex
    const vocal = answers['1c_vocal'] || 0;
    const gestos = answers['1c_gestos'] || 0;
    const verbal = answers['1c_verbal'] || 0;
    // O PDF diz: max 7 (vocal+gestos) e max 20 (gestos+verbal).
    // Para simplificar e seguir a tabela de resumo que diz Max 70 para Habilidades Comunicativas:
    // 1a(20) + 1b(15) + 1d(15) = 50. Sobra 20 para 1c.
    // Assumimos soma simples com teto de 20 para a seção 1c.
    const raw1c = vocal + gestos + verbal;
    const s1c = Math.min(raw1c, 20);

    // 1d
    const s1d = sum(['1d_1']);
    
    // Total 1
    const total1 = s1a + s1b + s1c + s1d;

    // 2
    const s2 = sum(['2_1']);

    // 3
    const s3a = sum(['3a_1']);
    const s3b = sum(['3b_1']);
    const s3c = sum(['3c_1']);
    const s3d = sum(['3d_gestual', '3d_sonora']);
    const total3 = s3a + s3b + s3c + s3d;

    const grandTotal = total1 + s2 + total3;

    return {
        s1a, s1b, s1c, s1d, total1,
        s2,
        s3a, s3b, s3c, s3d, total3,
        grandTotal,
        // Detalhes 1c para exibição
        vocal, gestos, verbal
    };
  }, [answers]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col font-sans fade-in transition-colors duration-300">
      <header className="bg-purple-900 dark:bg-slate-800 text-white p-4 shadow-md sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
             <FileText size={24} />
             <span className="font-bold text-lg">PROC - Relatório</span>
          </div>
          
          <div className="flex gap-3 flex-wrap justify-center">
            <button onClick={() => window.print()} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded shadow transition flex gap-2 items-center font-medium">
              <Printer size={18} /> Imprimir
            </button>
            <button onClick={onEdit} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition flex gap-2 items-center text-sm">
              <Edit size={16} /> Editar Respostas
            </button>
            <button onClick={() => onNavigate('landing')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition flex gap-2 items-center text-sm shadow-md">
              <ArrowLeft size={16} /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto p-8 w-full print:w-full print:max-w-none print:p-0 print:m-0">
        
        {/* Identificação */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 print:border-0 print:shadow-none">
            <h1 className="text-2xl font-bold text-center mb-2 uppercase text-slate-900 dark:text-white">PROC – Protocolo de Observação Comportamental</h1>
            <p className="text-center text-slate-500 text-sm mb-8">Jaime Zorzi e Simone Hage ( 2004 )</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-200 dark:border-slate-700 pt-4">
                <div><span className="font-bold">Nome:</span> {userData.name}</div>
                <div><span className="font-bold">Data Nasc:</span> {userData.age} (Ref)</div>
                <div><span className="font-bold">Responsável:</span> {userData.motherName}</div>
                <div><span className="font-bold">Data Avaliação:</span> {userData.date}</div>
                <div className="col-span-2"><span className="font-bold">Fonoaudiólogo(a):</span> {userData.speechTherapist}</div>
            </div>
        </div>

        {/* Tabela de Pontuação */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 print:break-inside-avoid">
            <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Pontuação Global</h2>
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                        <tr>
                            <th className="p-3">Aspectos observados</th>
                            <th className="p-3 text-center">Máxima</th>
                            <th className="p-3 text-center">Alcançada</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        <tr>
                            <td className="p-3 font-medium">1. Habilidades comunicativas</td>
                            <td className="p-3 text-center">70</td>
                            <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">{scores.total1}</td>
                        </tr>
                        <tr className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50">
                            <td className="p-2 pl-6">1a. Habilidades dialógicas</td>
                            <td className="p-2 text-center">20</td>
                            <td className="p-2 text-center">{scores.s1a}</td>
                        </tr>
                        <tr className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50">
                            <td className="p-2 pl-6">1b. Funções comunicativas</td>
                            <td className="p-2 text-center">15</td>
                            <td className="p-2 text-center">{scores.s1b}</td>
                        </tr>
                        <tr className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50">
                            <td className="p-2 pl-6">1c. Meios de comunicação</td>
                            <td className="p-2 text-center">20</td>
                            <td className="p-2 text-center">{scores.s1c}</td>
                        </tr>
                         <tr className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50">
                            <td className="p-2 pl-6">1d. Níveis de contextualização</td>
                            <td className="p-2 text-center">15</td>
                            <td className="p-2 text-center">{scores.s1d}</td>
                        </tr>

                        <tr>
                            <td className="p-3 font-medium">2. Compreensão da linguagem oral</td>
                            <td className="p-3 text-center">60</td>
                            <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">{scores.s2}</td>
                        </tr>

                        <tr>
                            <td className="p-3 font-medium">3. Aspectos do desenvolvimento cognitivo</td>
                            <td className="p-3 text-center">70</td>
                            <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">{scores.total3}</td>
                        </tr>
                         <tr className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50">
                            <td className="p-2 pl-6">3a. Manipulação de objetos (10) | 3b. Simbolismo (20)</td>
                            <td className="p-2 text-center">30</td>
                            <td className="p-2 text-center">{scores.s3a + scores.s3b}</td>
                        </tr>
                        <tr className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50">
                            <td className="p-2 pl-6">3c. Organização (20) | 3d. Imitação (20)</td>
                            <td className="p-2 text-center">40</td>
                            <td className="p-2 text-center">{scores.s3c + scores.s3d}</td>
                        </tr>

                        <tr className="bg-slate-100 dark:bg-slate-700 font-bold text-slate-900 dark:text-white text-base">
                            <td className="p-4">Total da pontuação</td>
                            <td className="p-4 text-center">200</td>
                            <td className="p-4 text-center text-xl">{scores.grandTotal}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div className="mt-4 text-xs text-slate-500 italic border p-2 rounded">
                <strong>Detalhe 1c:</strong> Vocalizações ({scores.vocal}) + Gestos ({scores.gestos}) + Verbal ({scores.verbal}). 
                Soma bruta: {scores.vocal + scores.gestos + scores.verbal}. (Teto considerado na soma global: 20).
            </div>
        </div>

        <div className="page-break"></div>

        {/* Análise Qualitativa */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
            <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white border-b pb-2">Análise Qualitativa</h2>
            <div className="grid grid-cols-1 gap-6">
                {procChecklistSections.map(section => (
                    <div key={section.id}>
                        <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">{section.title}</h3>
                        <ul className="space-y-1">
                            {section.items.map(item => (
                                <li key={item.id} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <div className={`mt-0.5 ${checklist[item.id] ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-300'}`}>
                                        {checklist[item.id] ? '[ X ]' : '[   ]'}
                                    </div>
                                    <span className={checklist[item.id] ? 'text-slate-900 dark:text-white font-medium' : ''}>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>

        {/* Observações */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 print:break-inside-avoid">
             <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Conclusões / Observações</h2>
             <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg min-h-[100px] whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                {userData.observations || 'Nenhuma observação registrada.'}
             </div>
        </div>

      </main>
    </div>
  );
};

export default ProcResults;
