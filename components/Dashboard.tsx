
import React, { useState, useEffect, useMemo } from 'react';
import { LogOut, Plus, Search, Trash2, Sun, Moon, Eye, Play, Calendar, User, Edit, Sparkles, Loader2, FileText, Activity, Filter, X, ChevronDown, ChevronRight, Copy, GitCompare, Bell, AlertTriangle, Clock, CalendarClock } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Theme, AssessmentRecord, AssessmentType } from '../types';

interface DashboardProps {
  records: AssessmentRecord[];
  currentTheme: Theme;
  onSetTheme: (theme: Theme) => void;
  onNewRecord: (type: AssessmentType, patientId?: string) => void; // Updated signature
  onSelectRecord: (id: string) => void;
  onEditRecord: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onCompareRecords: (records: AssessmentRecord[]) => void; // New prop
  onLogout: () => void;
}

// Helper para calcular status de reavaliação
const getReassessmentStatus = (dateStr: string) => {
  if (!dateStr) return { status: 'ok', days: 0 };
  
  const assessDate = new Date(dateStr + 'T12:00:00'); // Evita problemas de fuso
  const today = new Date();
  
  // Data de vencimento = Data + 180 dias
  const dueDate = new Date(assessDate);
  dueDate.setDate(dueDate.getDate() + 180);
  
  const diffTime = dueDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (daysLeft < 0) return { status: 'expired', days: Math.abs(daysLeft) };
  if (daysLeft <= 10) return { status: 'warning', days: daysLeft };
  return { status: 'ok', days: daysLeft };
};

const Dashboard: React.FC<DashboardProps> = ({ 
  records, 
  currentTheme, 
  onSetTheme, 
  onNewRecord, 
  onSelectRecord,
  onEditRecord,
  onDeleteRecord,
  onCompareRecords,
  onLogout 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTypeSelect, setShowTypeSelect] = useState(false);
  
  // Notification & Filter State
  const [showNotifications, setShowNotifications] = useState(false);
  const [filterReassessment, setFilterReassessment] = useState(false);
  
  // Grouping State
  const [expandedPatients, setExpandedPatients] = useState<Set<string>>(new Set());
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set());

  // Gera notificações baseadas nos registros
  const notifications = useMemo(() => {
      const msgs: { id: string, patient: string, type: string, status: string, msg: string, days: number, recordId: string }[] = [];
      
      records.forEach(rec => {
          const { status, days } = getReassessmentStatus(rec.userData.date);
          if (status !== 'ok') {
              msgs.push({
                  id: `notif_${rec.id}`,
                  recordId: rec.id,
                  patient: rec.userData.name,
                  type: rec.type || 'MATRIX',
                  status,
                  days,
                  msg: status === 'expired' 
                      ? `Reavaliação vencida há ${days} dias.` 
                      : `Reavaliação necessária em ${days} dias.`
              });
          }
      });
      // Ordena por urgência (vencidos primeiro)
      return msgs.sort((a, b) => {
          if (a.status === 'expired' && b.status !== 'expired') return -1;
          if (a.status !== 'expired' && b.status === 'expired') return 1;
          return a.days - b.days;
      });
  }, [records]);

  // Group Records by Patient
  const groupedPatients = useMemo(() => {
    const groups: Record<string, { patientId: string, name: string, records: AssessmentRecord[], latestDate: string }> = {};

    records.forEach(record => {
        const pId = record.patientId || `${record.userData.name.trim()}_${record.userData.age.trim()}`;
        
        if (!groups[pId]) {
            groups[pId] = {
                patientId: pId,
                name: record.userData.name || 'Paciente Sem Nome',
                records: [],
                latestDate: record.userData.date
            };
        }
        groups[pId].records.push(record);
        if (record.userData.date > groups[pId].latestDate) {
            groups[pId].latestDate = record.userData.date;
        }
    });

    Object.values(groups).forEach(group => {
        group.records.sort((a, b) => new Date(b.userData.date).getTime() - new Date(a.userData.date).getTime());
    });

    return Object.values(groups).sort((a, b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime());
  }, [records]);

  // Filter Logic
  const filteredPatients = useMemo(() => {
      let filtered = groupedPatients;

      if (searchTerm.trim()) {
          const lowerTerm = searchTerm.toLowerCase();
          filtered = filtered.filter(group => 
              group.name.toLowerCase().includes(lowerTerm) ||
              group.records.some(r => r.userData.diagnosis.toLowerCase().includes(lowerTerm))
          );
      }

      if (filterReassessment) {
          filtered = filtered.filter(group => 
              group.records.some(r => {
                  const s = getReassessmentStatus(r.userData.date);
                  return s.status === 'expired' || s.status === 'warning';
              })
          );
      }

      return filtered;
  }, [groupedPatients, searchTerm, filterReassessment]);

  const togglePatient = (patientId: string) => {
      const newSet = new Set(expandedPatients);
      if (newSet.has(patientId)) newSet.delete(patientId);
      else newSet.add(patientId);
      setExpandedPatients(newSet);
  };

  const toggleComparisonSelect = (recordId: string, type: AssessmentType) => {
      const newSet = new Set(selectedForComparison);
      
      if (newSet.size > 0) {
          const firstId = Array.from(newSet)[0];
          const firstRecord = records.find(r => r.id === firstId);
          if (firstRecord && firstRecord.type !== type) {
              alert("Você só pode comparar avaliações do mesmo tipo (apenas Matriz ou apenas PROC).");
              return;
          }
      }

      if (newSet.has(recordId)) {
          newSet.delete(recordId);
      } else {
          if (newSet.size >= 2) {
              alert("Selecione no máximo 2 avaliações para comparar.");
              return;
          }
          newSet.add(recordId);
      }
      setSelectedForComparison(newSet);
  };

  const handleCompareClick = () => {
      if (selectedForComparison.size < 2) return;
      const recs = records.filter(r => selectedForComparison.has(r.id));
      onCompareRecords(recs);
      setSelectedForComparison(new Set()); 
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-slate-900 dark:to-slate-800 text-white p-6 shadow-xl sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center relative">
          <div className="flex items-center">
             <img src="https://i.imgur.com/CSrEIRC.png" alt="Matriz de Comunicação" className="h-12 md:h-16 w-auto object-contain" />
          </div>
          
          <div className="flex items-center gap-3">
             {/* Notification Bell */}
             <div className="relative">
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full hover:bg-white/10 transition relative"
                >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-blue-900">
                            {notifications.length}
                        </span>
                    )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="p-3 bg-slate-50 dark:bg-slate-750 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Insights & Alertas</h3>
                            <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 text-sm">
                                    <Sparkles className="mx-auto mb-2 opacity-50" size={24} />
                                    <p>Tudo em dia! Nenhuma pendência.</p>
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`p-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition flex gap-3 ${notif.status === 'expired' ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-yellow-50/50 dark:bg-yellow-900/10'}`}>
                                        <div className={`mt-1 flex-shrink-0 ${notif.status === 'expired' ? 'text-red-500' : 'text-yellow-500'}`}>
                                            {notif.status === 'expired' ? <AlertTriangle size={16} /> : <Clock size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{notif.patient}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{notif.type}</p>
                                            <p className={`text-xs font-semibold mt-0.5 ${notif.status === 'expired' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                                {notif.msg}
                                            </p>
                                            <button 
                                                onClick={() => { onSelectRecord(notif.recordId); setShowNotifications(false); }}
                                                className="text-[10px] text-blue-600 hover:underline mt-1"
                                            >
                                                Ver Avaliação
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
             </div>

             <div className="h-6 w-px bg-white/20 mx-1"></div>

             <button onClick={onLogout} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                <LogOut size={16} /> Sair
             </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-5xl mx-auto p-6 w-full fade-in">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Meus Pacientes</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie o histórico e a evolução clínica.</p>
            </div>

            <div className="flex gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <button onClick={() => onSetTheme('light')} className={`p-2 rounded-md transition ${currentTheme === 'light' ? 'bg-slate-100 text-blue-600' : 'text-slate-400'}`}><Sun size={18} /></button>
              <button onClick={() => onSetTheme('dark')} className={`p-2 rounded-md transition ${currentTheme === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}><Moon size={18} /></button>
              <button onClick={() => onSetTheme('high-contrast')} className={`p-2 rounded-md transition ${currentTheme === 'high-contrast' ? 'bg-black text-yellow-400 border border-yellow-400' : 'text-slate-400'}`}><Eye size={18} /></button>
            </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-24 z-10 bg-slate-50 dark:bg-slate-900 py-2">
            <div className="relative">
                <button onClick={() => setShowTypeSelect(!showTypeSelect)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 transform active:scale-95 w-full md:w-auto">
                    <Plus size={20} /> Novo Paciente
                </button>
                
                {showTypeSelect && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-30 overflow-hidden fade-in">
                        <button onClick={() => { onNewRecord('MATRIX'); setShowTypeSelect(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 transition">
                            <Activity size={18} className="text-blue-600" /> <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Matriz de Comunicação</span>
                        </button>
                        <button onClick={() => { onNewRecord('PROC'); setShowTypeSelect(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition">
                            <FileText size={18} className="text-purple-600" /> <span className="text-sm font-bold text-slate-700 dark:text-slate-200">PROC</span>
                        </button>
                    </div>
                )}
            </div>
            
            <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-slate-400" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar pacientes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-slate-800 dark:text-white transition"
                    />
                </div>
                
                {/* Botão de Filtro de Reavaliação */}
                <button 
                    onClick={() => setFilterReassessment(!filterReassessment)}
                    className={`px-4 rounded-xl border transition flex items-center gap-2 font-medium text-sm
                        ${filterReassessment 
                            ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
                    title="Filtrar reavaliações necessárias"
                >
                    <CalendarClock size={18} />
                    <span className="hidden md:inline">Reavaliações</span>
                    {filterReassessment && <span className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100 text-[10px] px-1.5 rounded-full ml-1">Ativo</span>}
                </button>
            </div>

            {selectedForComparison.size >= 2 && (
                <button 
                    onClick={handleCompareClick}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition flex items-center gap-2 animate-pulse"
                >
                    <GitCompare size={20} /> Comparar ({selectedForComparison.size})
                </button>
            )}
        </div>

        {/* Patient List */}
        <div className="space-y-4">
            {filteredPatients.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p>Nenhum paciente encontrado.</p>
                </div>
            ) : (
                filteredPatients.map(group => {
                    const isExpanded = expandedPatients.has(group.patientId);
                    const lastRecord = group.records[0]; // Sorted desc
                    
                    // Verifica se algum registro desse paciente precisa de atenção para mostrar badge no card principal
                    const needsAttention = group.records.some(r => {
                        const s = getReassessmentStatus(r.userData.date);
                        return s.status === 'expired' || s.status === 'warning';
                    });

                    return (
                        <div key={group.patientId} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all">
                            {/* Patient Header */}
                            <div 
                                onClick={() => togglePatient(group.patientId)}
                                className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition border-l-4 border-transparent hover:border-blue-500"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 p-3 rounded-full relative">
                                        <User size={24} />
                                        {needsAttention && (
                                            <div className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            {group.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                            {lastRecord.userData.age} anos • {group.records.length} Avaliações
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden md:block">
                                        <span className="text-xs text-slate-400 block">Última avaliação</span>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {new Date(group.latestDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {isExpanded ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                                </div>
                            </div>

                            {/* Expanded Assessments List */}
                            {isExpanded && (
                                <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 p-4 animate-in slide-in-from-top-2">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Histórico de Avaliações</h4>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onNewRecord('MATRIX', group.patientId); }}
                                                className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-blue-500 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm"
                                            >
                                                <Plus size={14} /> Nova Matriz
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onNewRecord('PROC', group.patientId); }}
                                                className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-purple-500 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm"
                                            >
                                                <Plus size={14} /> Novo PROC
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {group.records.map(record => {
                                            const isSelected = selectedForComparison.has(record.id);
                                            const { status, days } = getReassessmentStatus(record.userData.date);

                                            return (
                                                <div key={record.id} className={`flex items-center gap-3 p-3 rounded-lg border transition ${isSelected ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-blue-300'}`}>
                                                    
                                                    {/* Select for Comparison */}
                                                    <button 
                                                        onClick={() => toggleComparisonSelect(record.id, record.type)}
                                                        className={`p-2 rounded-md border transition ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-emerald-400'}`}
                                                        title="Selecionar para comparar"
                                                    >
                                                        <GitCompare size={16} className={isSelected ? "" : "opacity-0 hover:opacity-100 hover:text-emerald-400"} />
                                                    </button>

                                                    <div className="flex-1 cursor-pointer" onClick={() => onSelectRecord(record.id)}>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${record.type === 'PROC' ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300' : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                                                {record.type || 'MATRIX'}
                                                            </span>
                                                            <span className="text-sm font-semibold text-slate-800 dark:text-white">
                                                                {new Date(record.userData.date).toLocaleDateString()}
                                                            </span>
                                                            
                                                            {/* Ícone de Alerta de Vencimento */}
                                                            {status === 'expired' && (
                                                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800" title={`Vencido há ${days} dias`}>
                                                                    <AlertTriangle size={10} /> Reavaliação Necessária
                                                                </span>
                                                            )}
                                                            {status === 'warning' && (
                                                                <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-800" title={`Vence em ${days} dias`}>
                                                                    <Clock size={10} /> Reavaliar em breve
                                                                </span>
                                                            )}

                                                            {record.progress === 100 && <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center"><Sparkles size={10} className="mr-1"/> Finalizada</span>}
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px] md:max-w-md">
                                                            {record.userData.diagnosis || 'Sem diagnóstico'}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-1">
                                                        <button onClick={() => onSelectRecord(record.id)} className="p-2 text-slate-400 hover:text-blue-600 transition" title="Abrir">
                                                            <Play size={16} />
                                                        </button>
                                                        <button onClick={() => onEditRecord(record.id)} className="p-2 text-slate-400 hover:text-blue-600 transition" title="Editar Dados">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button onClick={() => onDeleteRecord(record.id)} className="p-2 text-slate-400 hover:text-red-600 transition" title="Excluir">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
            <p>Selecione duas avaliações do mesmo paciente e tipo para visualizar a evolução.</p>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
