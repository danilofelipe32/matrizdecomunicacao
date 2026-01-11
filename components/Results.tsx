import React, { useMemo, useState, useEffect } from 'react';
import { BarChart2, Printer, Edit, PieChart, ArrowLeft, Sparkles, Loader2, Save, Send, X, Share2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { matrixRows, AI_CONTEXT_MATRIX } from '../constants';
import { AnswerData, UserData } from '../types';

interface ResultsProps {
  answers: AnswerData;
  userData: UserData;
  onNavigate: (view: 'registration' | 'landing') => void;
  analysis: string;
  onSaveAnalysis: (text: string) => void;
}

const Results: React.FC<ResultsProps> = ({ answers, userData, onNavigate, analysis, onSaveAnalysis }) => {
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

  const stats = useMemo(() => {
    // Totais por Categoria
    const categories: Record<string, { total: number; master: number }> = {
      'REJEITAR': { total: 0, master: 0 },
      'OBTER': { total: 0, master: 0 },
      'SOCIAL': { total: 0, master: 0 },
      'INFO': { total: 0, master: 0 }
    };
    const levels: Record<number, { total: number; master: number }> = {
      1: { total: 0, master: 0 },
      2: { total: 0, master: 0 },
      3: { total: 0, master: 0 },
      4: { total: 0, master: 0 },
      5: { total: 0, master: 0 },
      6: { total: 0, master: 0 },
      7: { total: 0, master: 0 }
    };

    let scores: number[] = [];

    matrixRows.forEach(row => {
      row.levels.forEach(lvl => {
        // Contagem por Categoria
        if (categories[row.category]) {
            categories[row.category].total++;
        }
        // Contagem por Nível
        if (levels[lvl]) {
            levels[lvl].total++;
        }

        const status = answers[row.qId]?.[lvl] || 'none';
        if (status === 'mastered') {
          if(categories[row.category]) categories[row.category].master++;
          if(levels[lvl]) levels[lvl].master++;
          scores.push(1);
        } else {
          scores.push(0);
        }
      });
    });

    const sum = scores.reduce((a, b) => a + b, 0);
    const mean = scores.length > 0 ? (sum / scores.length).toFixed(2) : '0.00';
    
    // Variance and StdDev
    const meanVal = parseFloat(mean);
    const variance = scores.length > 0 ? scores.reduce((a, b) => a + Math.pow(b - meanVal, 2), 0) / scores.length : 0;
    const stdDev = Math.sqrt(variance).toFixed(2);

    // Median
    scores.sort((a, b) => a - b);
    const mid = Math.floor(scores.length / 2);
    const median = scores.length === 0 ? 0 : (scores.length % 2 !== 0 ? scores[mid] : (scores[mid - 1] + scores[mid]) / 2);

    return { categories, levels, mean, stdDev, median, totalItems: scores.length, totalMastered: sum };
  }, [answers]);

  const generateAnalysis = async () => {
    setIsGenerating(true);
    
    // Preparar resumo dos dados para o prompt
    const dataSummary = `
      NOME: ${userData.name}, IDADE: ${userData.age}, DIAG: ${userData.diagnosis}
      ESTATÍSTICAS DA MATRIZ:
      - Total Dominado: ${stats.totalMastered} de ${stats.totalItems}
      - DOMÍNIO POR NÍVEL:
        N1: ${stats.levels[1].master}/${stats.levels[1].total}
        N2: ${stats.levels[2].master}/${stats.levels[2].total}
        N3: ${stats.levels[3].master}/${stats.levels[3].total}
        N4: ${stats.levels[4].master}/${stats.levels[4].total}
        N5: ${stats.levels[5].master}/${stats.levels[5].total}
        N6: ${stats.levels[6].master}/${stats.levels[6].total}
        N7: ${stats.levels[7].master}/${stats.levels[7].total}
      - DOMÍNIO POR INTENÇÃO:
        REJEITAR: ${stats.categories['REJEITAR'].master}/${stats.categories['REJEITAR'].total}
        OBTER: ${stats.categories['OBTER'].master}/${stats.categories['OBTER'].total}
        SOCIAL: ${stats.categories['SOCIAL'].master}/${stats.categories['SOCIAL'].total}
        INFO: ${stats.categories['INFO'].master}/${stats.categories['INFO'].total}
    `;

    const prompt = `
      ${AI_CONTEXT_MATRIX}
      
      ATUE COMO: Um Fonoaudiólogo Doutor, especialista em comunicação alternativa.
      
      TAREFA: Analise os dados abaixo da Matriz de Comunicação e escreva um PARECER CLÍNICO PROFISSIONAL E CONCLUSIVO.
      
      DADOS DO PACIENTE:
      ${dataSummary}
      
      DIRETRIZES:
      1. Seja formal, empático e técnico.
      2. Analise qual o nível predominante de comunicação da criança.
      3. Identifique pontos fortes (intenções mais usadas) e áreas de necessidade.
      4. Sugira brevemente o foco terapêutico (ex: expandir para nível X ou aumentar funções Y).
      5. Não use introduções genéricas ("Aqui está a análise"). Comece direto: "A avaliação de [Nome] indica..."
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      if (response.text) {
        const text = response.text.trim();
        setAnalysisText(text);
        onSaveAnalysis(text); // Salva automaticamente
      } else {
        alert("Erro ao gerar análise: Resposta vazia.");
      }
    } catch (error) {
      console.error(error);
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
      CONTEXTO: Você gerou um parecer clínico da Matriz de Comunicação.
      
      TEXTO ATUAL:
      "${editModal.text}"
      
      INSTRUÇÃO DE ALTERAÇÃO:
      "${refinement.instruction}"
      
      TAREFA: Reescreva o texto aplicando a alteração solicitada, mantendo o tom profissional.
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      if (response.text) {
        setEditModal(prev => ({ ...prev, text: response.text.trim() }));
        setRefinement({ showInput: false, instruction: '', loading: false });
      } else {
        alert("Erro ao refinar: Resposta vazia.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    } finally {
      setRefinement(prev => ({ ...prev, loading: false }));
    }
  };

  const openEditModal = () => {
    setEditModal({ isOpen: true, text: analysisText });
    setRefinement({ showInput: false, instruction: '', loading: false });
  };

  const saveAnalysis = () => {
    setAnalysisText(editModal.text);
    onSaveAnalysis(editModal.text); // Salva ao confirmar edição
    setEditModal({ isOpen: false, text: '' });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col font-sans fade-in transition-colors duration-300">
      {/* Navbar - Hidden on Print */}
      <header className="bg-blue-900 dark:bg-slate-800 text-white p-4 shadow-md sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
             <img 
                src="https://i.imgur.com/CSrEIRC.png" 
                alt="Matriz de Comunicação" 
                className="h-10 w-auto object-contain" 
             />
          </div>
          
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => window.print()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded shadow-lg transition flex gap-2 items-center font-medium"
            >
              <Printer size={18} /> Imprimir
            </button>
            <button
               onClick={() => window.print()}
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-lg transition flex gap-2 items-center font-medium"
            >
               <Share2 size={18} /> Compartilhar PDF
            </button>
            <div className="h-8 w-px bg-blue-800 dark:bg-slate-600 mx-1 hidden md:block"></div>
            <button
              onClick={() => onNavigate('registration')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition flex gap-2 items-center text-sm"
            >
              <Edit size={16} /> Editar Dados
            </button>
            <button
              onClick={() => onNavigate('landing')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition flex gap-2 items-center text-sm shadow-md"
            >
              <ArrowLeft size={16} /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto p-8 w-full print:w-full print:max-w-none print:p-0 print:m-0">
        
        {/* Cabeçalho do Relatório (Dados Completos) */}
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 print:border-0 print:shadow-none print:mb-4 print:p-0">
          <div className="flex justify-between items-start mb-6 border-b border-slate-200 dark:border-slate-700 pb-4 print:mb-4">
             <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ficha de Identificação</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Dados cadastrais e informações clínicas</p>
             </div>
             <div className="hidden print:block text-right">
                <div className="flex items-center justify-end">
                    <img 
                        src="https://i.imgur.com/CSrEIRC.png" 
                        alt="Matriz de Comunicação" 
                        className="h-8 w-auto object-contain grayscale opacity-60" 
                    />
                </div>
                <div className="text-xs text-slate-400 mt-1">Protocolo Digital Gerado em {new Date().toLocaleDateString()}</div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 text-sm print:grid-cols-3 print:gap-y-4">
            
            <div className="space-y-3">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 uppercase text-xs tracking-wider border-b border-blue-100 dark:border-blue-900 pb-1 mb-2">Criança</h3>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                 <span className="text-slate-500 dark:text-slate-400 text-xs">Nome:</span>
                 <span className="font-bold text-slate-900 dark:text-white">{userData.name || '-'}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                 <span className="text-slate-500 dark:text-slate-400 text-xs">Idade:</span>
                 <span className="font-semibold text-slate-700 dark:text-slate-300">{userData.age || '-'}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                 <span className="text-slate-500 dark:text-slate-400 text-xs">Sexo:</span>
                 <span className="font-semibold text-slate-700 dark:text-slate-300">{userData.gender === 'M' ? 'Masculino' : userData.gender === 'F' ? 'Feminino' : userData.gender || '-'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 uppercase text-xs tracking-wider border-b border-blue-100 dark:border-blue-900 pb-1 mb-2">Responsáveis</h3>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                 <span className="text-slate-500 dark:text-slate-400 text-xs">Mãe:</span>
                 <span className="font-semibold text-slate-700 dark:text-slate-300">{userData.motherName || '-'}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                 <span className="text-slate-500 dark:text-slate-400 text-xs">Pai:</span>
                 <span className="font-semibold text-slate-700 dark:text-slate-300">{userData.fatherName || '-'}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                 <span className="text-slate-500 dark:text-slate-400 text-xs">Contato:</span>
                 <span className="font-semibold text-slate-700 dark:text-slate-300">{userData.phone || '-'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 uppercase text-xs tracking-wider border-b border-blue-100 dark:border-blue-900 pb-1 mb-2">Avaliação</h3>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                 <span className="text-slate-500 dark:text-slate-400 text-xs">Profissional:</span>
                 <span className="font-bold text-slate-900 dark:text-white">{userData.speechTherapist || '-'}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                 <span className="text-slate-500 dark:text-slate-400 text-xs">Data:</span>
                 <span className="font-semibold text-slate-700 dark:text-slate-300">{userData.date} <span className="text-slate-400 dark:text-slate-500 font-normal">às {userData.time}</span></span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                 <span className="text-slate-500 dark:text-slate-400 text-xs">Email:</span>
                 <span className="font-semibold text-slate-700 dark:text-slate-300">{userData.email || '-'}</span>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-3 print:col-span-3 space-y-3 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2">
                    <span className="text-slate-500 dark:text-slate-400 text-xs mt-1">Endereço:</span>
                    <span className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 p-2 rounded border border-slate-100 dark:border-slate-600 print:border-0 print:p-0 print:bg-transparent">
                        {userData.street}, {userData.number} {userData.neighborhood && `- ${userData.neighborhood}`} {userData.zip && `(CEP: ${userData.zip})`}
                    </span>
                </div>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-3 print:col-span-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2">
                    <span className="text-slate-500 dark:text-slate-400 text-xs mt-1">Diagnóstico:</span>
                    <div className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 p-3 rounded border border-slate-100 dark:border-slate-600 italic leading-relaxed print:border-0 print:p-0 print:bg-transparent print:not-italic">
                        {userData.diagnosis || 'Não informado.'}
                    </div>
                </div>
            </div>
            
            <div className="col-span-1 md:col-span-2 lg:col-span-3 print:col-span-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2">
                    <span className="text-slate-500 dark:text-slate-400 text-xs mt-1">Motivo:</span>
                    <div className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 p-3 rounded border border-slate-100 dark:border-slate-600 italic leading-relaxed print:border-0 print:p-0 print:bg-transparent print:not-italic">
                        {userData.consultationReason || 'Não informado.'}
                    </div>
                </div>
            </div>

          </div>
        </div>

        {/* Matriz Visual */}
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 print:mb-2 flex items-center gap-2">
            <BarChart2 size={20} className="text-blue-600 dark:text-blue-400" /> Matriz Visual
        </h3>
        <div className="bg-white dark:bg-slate-800 p-1 rounded shadow-lg border dark:border-slate-700 overflow-x-auto mb-8 print:border-2 print:border-slate-800 print:shadow-none print:overflow-visible print:mb-6">
          <div className="min-w-[800px] print:min-w-0 print:w-full print:scale-95 origin-top-left">
            <div className="grid grid-cols-[200px_repeat(7,1fr)] bg-slate-100 dark:bg-slate-700 border-b dark:border-slate-600 print:bg-slate-200 print:text-black print:border-slate-400">
              <div className="p-2 font-bold text-xs flex items-center justify-center text-slate-800 dark:text-white print:text-black">Intenção / Nível</div>
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <div key={n} className="p-2 text-center font-bold text-xs border-l border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white print:border-slate-400 print:text-black">Nível {n}</div>
              ))}
            </div>
            {matrixRows.map((row, idx) => {
              const isCat = idx === 0 || matrixRows[idx - 1].category !== row.category;
              const borderTop = isCat ? 'border-t-2 border-slate-400 dark:border-slate-500 mt-2 print:mt-0 print:border-t-2 print:border-slate-800' : 'border-t border-slate-200 dark:border-slate-600 print:border-slate-300';
              
              return (
                <div key={idx} className="grid grid-cols-[200px_repeat(7,1fr)] hover:bg-slate-50 dark:hover:bg-slate-700 print:hover:bg-transparent break-inside-avoid">
                  <div className={`p-2 text-xs font-bold border-r border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 print:text-black flex items-center ${borderTop} print:border-slate-400 bg-slate-50/50 dark:bg-slate-800 print:bg-transparent`}>
                    {isCat && (
                      <span className="mr-2 text-[10px] text-slate-400 dark:text-slate-500 w-4 -rotate-90 origin-center block print:text-black font-extrabold">
                        {row.category}
                      </span>
                    )}
                    <span className="truncate leading-tight">{row.label}</span>
                  </div>
                  {[1, 2, 3, 4, 5, 6, 7].map(l => {
                    const st = answers[row.qId]?.[l];
                    const app = row.levels.includes(l);
                    let bgClass = 'bg-slate-50 dark:bg-slate-900 print:bg-transparent';
                    let bar = null;

                    if (app) {
                      bgClass = 'bg-white dark:bg-slate-800 print:bg-transparent';
                      let barColor = 'bg-slate-200 dark:bg-slate-700 print:bg-slate-200';
                      if (st === 'mastered') barColor = 'bg-blue-600 dark:bg-blue-500 print:bg-blue-600';
                      if (st === 'emergent') barColor = 'bg-yellow-400 dark:bg-yellow-500 print:bg-yellow-400';
                      bar = <div className={`w-full h-5 rounded-sm ${barColor} shadow-sm border border-slate-300 dark:border-slate-600 print:border-slate-600`}></div>;
                    }

                    return (
                      <div key={l} className={`p-1 border-r border-slate-200 dark:border-slate-600 print:border-slate-400 flex items-center justify-center ${borderTop} ${bgClass}`}>
                        {bar}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="page-break"></div>

        {/* Estatísticas */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mt-8 mb-8 break-inside-avoid print:border-0 print:shadow-none print:mt-0 print:p-0">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2 print:text-xl print:mb-4">
            <PieChart className="text-blue-600 dark:text-blue-400" /> Análise Estatística e Quantitativa
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 print:grid-cols-4 print:gap-2 print:mb-6">
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600 text-center print:bg-transparent print:border print:border-slate-400">
              <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Dominado</span>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400 print:text-black">{stats.totalMastered} <span className="text-sm text-slate-400 dark:text-slate-500">/ {stats.totalItems}</span></span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600 text-center print:bg-transparent print:border print:border-slate-400">
              <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Média (Itens)</span>
              <span className="text-3xl font-bold text-slate-700 dark:text-white print:text-black">{stats.mean}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600 text-center print:bg-transparent print:border print:border-slate-400">
              <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Mediana</span>
              <span className="text-3xl font-bold text-slate-700 dark:text-white print:text-black">{stats.median}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600 text-center print:bg-transparent print:border print:border-slate-400">
              <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Desvio Padrão</span>
              <span className="text-3xl font-bold text-slate-700 dark:text-white print:text-black">{stats.stdDev}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
            <div>
              <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 text-sm uppercase flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"></div> Domínio por Intenção
              </h3>
              <div className="space-y-4">
                {Object.keys(stats.categories).map(cat => {
                  const data = stats.categories[cat];
                  const pct = data.total === 0 ? 0 : Math.round((data.master / data.total) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                        <span>{cat}</span>
                        <span>{pct}% ({data.master}/{data.total})</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden print:bg-slate-200 border border-slate-200 dark:border-slate-600 print:border-slate-400">
                        <div className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full print:bg-blue-600" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 text-sm uppercase flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div> Domínio por Nível
              </h3>
              <div className="space-y-4">
                {Object.keys(stats.levels).map(lvlKey => {
                    const lvl = parseInt(lvlKey);
                  const data = stats.levels[lvl];
                  const pct = data.total === 0 ? 0 : Math.round((data.master / data.total) * 100);
                  return (
                    <div key={lvl}>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                        <span>Nível {lvl}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden print:bg-slate-200 border border-slate-200 dark:border-slate-600 print:border-slate-400">
                        <div className="bg-emerald-500 dark:bg-emerald-500 h-3 rounded-full print:bg-emerald-600" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded border border-yellow-200 dark:border-yellow-900/50 print:bg-transparent print:border print:border-slate-400 print:text-black">
            <strong>Nota Metodológica:</strong> O cálculo de "Domínio" considera apenas habilidades marcadas como "Dominado". O Desvio Padrão indica a variabilidade das respostas em relação à média (0=Não Dominado, 1=Dominado).
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
                     onClick={openEditModal}
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
                    Clique em "Gerar Análise" para obter um parecer profissional baseado nos dados da Matriz.
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

export default Results;