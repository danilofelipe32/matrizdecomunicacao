import React, { useMemo, useState, useEffect } from 'react';
import { Printer, Edit, ArrowLeft, FileText, CheckCircle2, Sparkles, Loader2, Save, Send, X, Share2 } from 'lucide-react';
import { UserData, ProcAnswers, ProcChecklist } from '../types';
import { procChecklistSections } from '../proc_constants';
import { AI_CONTEXT_PROC } from '../constants';

interface ProcResultsProps {
  userData: UserData;
  answers: ProcAnswers;
  checklist: ProcChecklist;
  onNavigate: (view: 'registration' | 'landing') => void;
  onEdit: () => void;
  analysis: string;
  onSaveAnalysis: (text: string) => void;
}

const ProcResults: React.FC<ProcResultsProps> = ({ userData, answers, checklist, onNavigate, onEdit, analysis, onSaveAnalysis }) => {
  // Estado da Análise IA
  const [analysisText, setAnalysisText] = useState<string>(analysis || '');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Atualiza estado local quando a prop muda
  useEffect(() => {
    setAnalysisText(analysis || '');
  }, [analysis]);
  
  // Estado do Modal de Edição
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    text: string;
  }>({ isOpen: false, text: '' });

  const [refinement, setRefinement] = useState({
    showInput: false,
    instruction: '',
    loading: false
  });

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
        vocal, gestos, verbal
    };
  }, [answers]);

  const generateAnalysis = async () => {
    setIsGenerating(true);
    
    const checklistSummary = procChecklistSections.map(section => {
        const checkedItems = section.items.filter(item => checklist[item.id]).map(i => i.text);
        return `${section.title}: ${checkedItems.join(', ') || 'Nenhum item marcado'}`;
    }).join('\n');

    const dataSummary = `
      NOME: ${userData.name}, IDADE: ${userData.age}
      PONTUAÇÃO PROC:
      - TOTAL GERAL: ${scores.grandTotal} / 200
      - 1. HABILIDADES COMUNICATIVAS: ${scores.total1} / 70
         (Dialógicas: ${scores.s1a}, Funções: ${scores.s1b}, Meios: ${scores.s1c}, Contexto: ${scores.s1d})
      - 2. COMPREENSÃO VERBAL: ${scores.s2} / 60
      - 3. COGNITIVO: ${scores.total3} / 70
         (Manipulação/Simbolismo: ${scores.s3a + scores.s3b}, Org/Imitação: ${scores.s3c + scores.s3d})
      
      OBSERVAÇÕES QUALITATIVAS:
      ${checklistSummary}
      
      OBSERVAÇÕES ADICIONAIS: ${userData.observations}
    `;

    const prompt = `
      ${AI_CONTEXT_PROC}
      
      ATUE COMO: Um Fonoaudiólogo Doutor, especialista em avaliação infantil.
      
      TAREFA: Analise os dados do PROC (Protocolo de Observação Comportamental) abaixo e escreva um PARECER CLÍNICO PROFISSIONAL.
      
      DADOS DO PACIENTE:
      ${dataSummary}
      
      DIRETRIZES:
      1. Integre os dados quantitativos com as observações qualitativas.
      2. Analise a defasagem entre as habilidades comunicativas, compreensão e cognição.
      3. Seja conclusivo sobre o perfil comunicativo da criança.
      4. Comece o texto diretamente, sem introduções.
    `;

    try {
      const response = await fetch('https://apifreellm.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });

      const data = await response.json();
      if (data.status === 'success') {
        const text = data.response.trim();
        setAnalysisText(text);
        onSaveAnalysis(text); // Salva automaticamente
      } else {
        alert("Erro ao gerar análise: " + (data.error || "Erro desconhecido"));
      }
    } catch (error) {
      alert("Erro de conexão com o serviço de IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefineText = async () => {
    if (!refinement.instruction.trim()) return;
    setRefinement(prev => ({ ...prev, loading: true }));

    const prompt = `
      ATUE COMO: Fonoaudiólogo Doutor.
      CONTEXTO: Parecer clínico do PROC.
      
      TEXTO ATUAL:
      "${editModal.text}"
      
      INSTRUÇÃO:
      "${refinement.instruction}"
      
      TAREFA: Reescreva aplicando a alteração.
    `;

    try {
      const response = await fetch('https://apifreellm.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setEditModal(prev => ({ ...prev, text: data.response.trim() }));
        setRefinement({ showInput: false, instruction: '', loading: false });
      } else {
        alert("Erro ao refinar: " + data.error);
      }
    } catch {
      alert("Erro de conexão.");
    } finally {
      setRefinement(prev => ({ ...prev, loading: false }));
    }
  };

  const saveAnalysis = () => {
    setAnalysisText(editModal.text);
    onSaveAnalysis(editModal.text); // Salva a edição
    setEditModal({ isOpen: false, text: '' });
  };

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
            <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition flex gap-2 items-center font-medium">
              <Share2 size={18} /> Compartilhar PDF
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
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 print:break-inside-avoid mb-6">
             <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Observações Gerais</h2>
             <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg min-h-[100px] whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                {userData.observations || 'Nenhuma observação registrada.'}
             </div>
        </div>

        {/* NOVA SEÇÃO: Análise Clínica com IA */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 break-inside-avoid">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Sparkles className="text-purple-600 dark:text-purple-400" />
                  Parecer Clínico (IA)
               </h2>
               {!analysisText && (
                  <button 
                     onClick={generateAnalysis}
                     disabled={isGenerating}
                     className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition disabled:opacity-50"
                  >
                     {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                     {isGenerating ? 'Analisando...' : 'Gerar Análise'}
                  </button>
               )}
               {analysisText && (
                  <button 
                     onClick={() => {
                        setEditModal({ isOpen: true, text: analysisText });
                        setRefinement({ showInput: false, instruction: '', loading: false });
                     }}
                     className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium flex items-center gap-1 print:hidden"
                  >
                     <Edit size={16} /> Editar
                  </button>
               )}
            </div>

            {analysisText ? (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800 text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-sm md:text-base print:border print:border-slate-300 print:bg-transparent print:text-black">
                    {analysisText}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                    Clique em "Gerar Análise" para obter um parecer profissional baseado nos dados do PROC.
                </div>
            )}
        </div>

        {/* Footer for Print */}
        <div className="hidden print:block text-center text-xs text-slate-400 mt-8 border-t pt-4">
            <p>Gerado por Matriz de Comunicação - Protocolo Digital</p>
        </div>
      </main>

       {/* Modal de Edição (Copiado/Adaptado de Registration.tsx) */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm fade-in print:hidden">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                 <h3 className="text-xl font-bold text-slate-800 dark:text-white">Editar Parecer Clínico</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400">Refine o texto gerado pela IA</p>
              </div>
              <button onClick={() => setEditModal({ ...editModal, isOpen: false })} className="text-slate-400 hover:text-red-500 transition">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <textarea
                value={editModal.text}
                onChange={(e) => setEditModal(prev => ({ ...prev, text: e.target.value }))}
                className="w-full h-64 p-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none text-base leading-relaxed"
              ></textarea>
              <div className="mt-4">
                 {!refinement.showInput ? (
                    <button 
                       onClick={() => setRefinement({ ...refinement, showInput: true })}
                       className="text-purple-600 dark:text-purple-400 font-bold text-sm flex items-center gap-2 hover:underline"
                    >
                       <Sparkles size={16} /> Assim, mas... (Refinar com IA)
                    </button>
                 ) : (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800 animate-in fade-in slide-in-from-top-2">
                       <label className="block text-xs font-bold text-purple-800 dark:text-purple-300 mb-2">O que você gostaria de mudar?</label>
                       <div className="flex gap-2">
                          <input 
                             type="text" 
                             value={refinement.instruction}
                             onChange={(e) => setRefinement(prev => ({ ...prev, instruction: e.target.value }))}
                             placeholder="Ex: Seja mais sucinto, foque na intenção comunicativa..."
                             className="flex-1 px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 text-sm"
                             onKeyDown={(e) => e.key === 'Enter' && handleRefineText()}
                          />
                          <button 
                             onClick={handleRefineText}
                             disabled={refinement.loading || !refinement.instruction.trim()}
                             className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                          >
                             {refinement.loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                          </button>
                       </div>
                    </div>
                 )}
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
              <button 
                onClick={() => setEditModal({ ...editModal, isOpen: false })}
                className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={saveAnalysis}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition flex items-center gap-2"
              >
                <Save size={18} /> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcResults;