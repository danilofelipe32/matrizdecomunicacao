import React, { useState, useEffect, useMemo } from 'react';
import { LogOut, Plus, Search, Trash2, Sun, Moon, Eye, Play, Calendar, User, Edit, Sparkles, Loader2, FileText, Activity, Filter, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Theme, AssessmentRecord, AssessmentType } from '../types';

interface DashboardProps {
  records: AssessmentRecord[];
  currentTheme: Theme;
  onSetTheme: (theme: Theme) => void;
  onNewRecord: (type: AssessmentType) => void;
  onSelectRecord: (id: string) => void;
  onEditRecord: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  records, 
  currentTheme, 
  onSetTheme, 
  onNewRecord, 
  onSelectRecord,
  onEditRecord,
  onDeleteRecord,
  onLogout 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMatches, setAiMatches] = useState<string[] | null>(null);
  const [showTypeSelect, setShowTypeSelect] = useState(false);

  // Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filterMatrix, setFilterMatrix] = useState(true);
  const [filterProc, setFilterProc] = useState(true);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  // Efeito para busca semântica com Debounce
  useEffect(() => {
    // Se IA estiver desligada ou busca vazia, reseta
    if (!useAI || !searchTerm.trim()) {
      setAiMatches(null);
      setAiLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setAiLoading(true);
      try {
        // Simplifica os registros para o contexto da IA
        const condensedRecords = records.map(r => ({
          id: r.id,
          name: r.userData.name,
          age: r.userData.age,
          diagnosis: r.userData.diagnosis,
          obs: r.userData.observations,
          type: r.type
        }));

        const prompt = `Atue como um assistente de busca inteligente para uma clínica de fonoaudiologia.
          
          Query do usuário: "${searchTerm}"
          
          Lista de Pacientes (JSON):
          ${JSON.stringify(condensedRecords)}
          
          Instruções:
          1. Analise a query e os dados dos pacientes.
          2. Identifique correspondências semânticas. Exemplo: se a busca for "autista", inclua pacientes com "TEA", "Autismo", ou descrições relacionadas. Se for "PROC", filtre pelo tipo.
          3. Retorne APENAS um JSON array contendo as strings dos IDs dos registros relevantes (ex: ["123", "456"]). NÃO use markdown.`;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });

        if (response.text) {
            // Limpa markdown se houver (ex: ```json ... ```)
            const cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
            const matches = JSON.parse(cleanText);
            setAiMatches(matches);
        }
      } catch (error) {
        console.error("Erro na busca semântica:", error);
      } finally {
        setAiLoading(false);
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, useAI, records]);

  // Lógica de filtragem combinada
  const filteredRecords = useMemo(() => {
    let result = records;

    // 1. Filtro por Tipo
    result = result.filter(r => {
        const type = r.type || 'MATRIX'; // Assume MATRIX para registros antigos
        if (type === 'MATRIX' && !filterMatrix) return false;
        if (type === 'PROC' && !filterProc) return false;
        return true;
    });

    // 2. Filtro por Data
    if (dateStart) {
        result = result.filter(r => r.userData.date >= dateStart);
    }
    if (dateEnd) {
        result = result.filter(r => r.userData.date <= dateEnd);
    }

    // 3. Filtro por Texto / IA
    if (searchTerm.trim()) {
      if (useAI && aiMatches !== null) {
        result = result.filter(record => aiMatches.includes(record.id));
      } else {
        result = result.filter(record => 
          record.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.userData.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    return result;
  }, [records, searchTerm, useAI, aiMatches, filterMatrix, filterProc, dateStart, dateEnd]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-slate-900 dark:to-slate-800 text-white p-6 shadow-xl sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
             <img 
               src="https://i.imgur.com/CSrEIRC.png" 
               alt="Matriz de Comunicação" 
               className="h-12 md:h-16 w-auto object-contain" 
             />
          </div>
          <button
            onClick={onLogout}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>
      
      <main className="flex-1 max-w-5xl mx-auto p-6 w-full fade-in">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gerenciar Avaliações</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Selecione um registro ou inicie uma nova avaliação.</p>
            </div>

            {/* Theme Selector - Compact */}
            <div className="flex gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <button onClick={() => onSetTheme('light')} title="Modo Claro" className={`p-2 rounded-md transition ${currentTheme === 'light' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><Sun size={18} /></button>
              <button onClick={() => onSetTheme('dark')} title="Modo Escuro" className={`p-2 rounded-md transition ${currentTheme === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}><Moon size={18} /></button>
              <button onClick={() => onSetTheme('high-contrast')} title="Alto Contraste" className={`p-2 rounded-md transition ${currentTheme === 'high-contrast' ? 'bg-black text-yellow-400 border border-yellow-400' : 'text-slate-400 hover:text-slate-600'}`}><Eye size={18} /></button>
            </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative">
                <button
                    onClick={() => setShowTypeSelect(!showTypeSelect)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 transform active:scale-95 w-full md:w-auto"
                >
                    <Plus size={20} /> Nova Avaliação
                </button>
                
                {showTypeSelect && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-30 overflow-hidden fade-in">
                        <button 
                            onClick={() => { onNewRecord('MATRIX'); setShowTypeSelect(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 transition"
                        >
                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                                <Activity size={18} className="text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <span className="block font-bold text-slate-800 dark:text-white text-sm">Matriz de Comunicação</span>
                                <span className="block text-xs text-slate-500 dark:text-slate-400">Protocolo padrão</span>
                            </div>
                        </button>
                        <button 
                            onClick={() => { onNewRecord('PROC'); setShowTypeSelect(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition"
                        >
                            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                                <FileText size={18} className="text-purple-600 dark:text-purple-300" />
                            </div>
                             <div>
                                <span className="block font-bold text-slate-800 dark:text-white text-sm">PROC</span>
                                <span className="block text-xs text-slate-500 dark:text-slate-400">Obs. Comportamental</span>
                            </div>
                        </button>
                    </div>
                )}
            </div>
            
            <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className={`transition-colors duration-300 ${useAI ? 'text-purple-500' : 'text-slate-400'}`} size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder={useAI ? "Busca inteligente ativa..." : "Buscar por nome ou diagnóstico..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-300 outline-none shadow-sm 
                            ${useAI 
                                ? 'border-purple-300 ring-2 ring-purple-100 dark:ring-purple-900/30 bg-purple-50/50 dark:bg-slate-800' 
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500'
                            } text-slate-800 dark:text-white`}
                    />
                    <button
                        onClick={() => setUseAI(!useAI)}
                        className={`absolute inset-y-0 right-0 px-3 flex items-center gap-2 transition-colors duration-300 rounded-r-xl
                            ${useAI ? 'text-purple-600 bg-purple-100/50 dark:bg-purple-900/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        title={useAI ? "Desativar Busca IA" : "Ativar Busca Semântica (IA)"}
                    >
                        {aiLoading ? (
                            <Loader2 size={18} className="animate-spin text-purple-600" />
                        ) : (
                            <Sparkles size={18} className={useAI ? "fill-purple-300" : ""} />
                        )}
                    </button>
                </div>
                
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    title="Filtrar"
                    className={`px-4 rounded-xl border flex items-center gap-2 transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                >
                    <Filter size={18} />
                    <span className="hidden md:inline text-sm font-medium">Filtros</span>
                </button>
            </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 fade-in">
                {/* Type Toggles */}
                <div className="flex flex-col gap-2">
                     <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Avaliação</label>
                     <div className="flex gap-2">
                         <button onClick={() => setFilterMatrix(!filterMatrix)} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm transition ${filterMatrix ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-700 dark:border-slate-600'}`}>
                            <Activity size={16} /> Matriz
                         </button>
                         <button onClick={() => setFilterProc(!filterProc)} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm transition ${filterProc ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-700 dark:border-slate-600'}`}>
                            <FileText size={16} /> PROC
                         </button>
                     </div>
                </div>

                {/* Date Range */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Data Inicial</label>
                    <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm w-full" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Data Final</label>
                    <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm w-full" />
                </div>

                {/* Clear Filters */}
                 <div className="flex items-end">
                    <button onClick={() => { setFilterMatrix(true); setFilterProc(true); setDateStart(''); setDateEnd(''); }} className="w-full px-4 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition">
                        <X size={16} /> Limpar Filtros
                    </button>
                </div>
            </div>
        )}

        {/* Records List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {records.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                    <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-4">
                        <Plus size={32} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-lg font-medium mb-1">Nenhuma avaliação encontrada.</p>
                    <p className="text-sm">Clique em "Nova Avaliação" para começar.</p>
                </div>
            ) : filteredRecords.length === 0 ? (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-full mb-4 inline-flex">
                        <Search size={24} className="text-slate-300 dark:text-slate-500" />
                    </div>
                    <p>Nenhum registro encontrado com os filtros atuais.</p>
                    {useAI && <p className="text-xs text-purple-500 mt-2">A busca semântica não encontrou correspondências relevantes.</p>}
                </div>
            ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredRecords.map((record) => (
                        <div key={record.id} className="p-4 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">
                                        {record.userData.name || 'Sem nome'}
                                    </h3>
                                    {/* Badge do Tipo */}
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${record.type === 'PROC' ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800' : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'}`}>
                                        {record.type || 'MATRIX'}
                                    </span>
                                    {record.progress > 0 && record.type !== 'PROC' && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${record.progress === 100 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'}`}>
                                            {record.progress === 100 ? 'Concluído' : `${record.progress}%`}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} /> {new Date(record.lastModified).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User size={14} /> {record.userData.age ? `${record.userData.age}` : 'Idade n/a'}
                                    </span>
                                    {record.userData.diagnosis && (
                                        <span className="truncate max-w-[200px] hidden sm:inline-block">
                                            • {record.userData.diagnosis}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                                <button
                                    onClick={() => onSelectRecord(record.id)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 rounded-lg transition shadow-sm hover:shadow-md font-medium text-sm group-hover:bg-blue-50 dark:group-hover:bg-slate-700"
                                >
                                    <Play size={16} className="text-blue-600 dark:text-blue-400" /> 
                                    {(record.type === 'PROC' || Object.keys(record.answers).length > 0) ? 'Continuar' : 'Iniciar'}
                                </button>
                                <button
                                    onClick={() => onEditRecord(record.id)}
                                    title="Editar Cadastro"
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => onDeleteRecord(record.id)}
                                    title="Excluir"
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
            <p>Os dados são salvos automaticamente no navegador deste dispositivo.</p>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;