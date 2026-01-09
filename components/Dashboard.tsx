import React, { useState } from 'react';
import { LogOut, Plus, Search, Trash2, Sun, Moon, Eye, Play, Calendar, User, Edit } from 'lucide-react';
import { Theme, AssessmentRecord } from '../types';

interface DashboardProps {
  records: AssessmentRecord[];
  currentTheme: Theme;
  onSetTheme: (theme: Theme) => void;
  onNewRecord: () => void;
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

  const filteredRecords = records.filter(record => 
    record.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.userData.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <button
                onClick={onNewRecord}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 transform active:scale-95"
            >
                <Plus size={20} /> Nova Avaliação
            </button>
            
            <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-slate-400" size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Buscar por nome ou diagnóstico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition outline-none shadow-sm"
                />
            </div>
        </div>

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
                    <p>Nenhum registro encontrado para "{searchTerm}".</p>
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
                                    {record.progress > 0 && (
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
                                    {Object.keys(record.answers).length > 0 ? 'Continuar' : 'Iniciar'}
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