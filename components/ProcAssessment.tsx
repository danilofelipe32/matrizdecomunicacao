
import React, { useState } from 'react';
import { ChevronLeft, Save, ArrowRight, CheckSquare, Square } from 'lucide-react';
import { procSections, procChecklistSections, ProcSection } from '../proc_constants';
import { ProcAnswers, ProcChecklist } from '../types';

interface ProcAssessmentProps {
  answers: ProcAnswers;
  checklist: ProcChecklist;
  onUpdateAnswer: (qId: string, value: number) => void;
  onUpdateChecklist: (itemId: string, checked: boolean) => void;
  onExit: () => void;
  onFinish: () => void;
}

const ProcAssessment: React.FC<ProcAssessmentProps> = ({
  answers,
  checklist,
  onUpdateAnswer,
  onUpdateChecklist,
  onExit,
  onFinish
}) => {
  const [activeTab, setActiveTab] = useState<string>('1a');

  // Groups for Tabs
  const tabs = [
    { id: '1a', label: '1. Habilidades' },
    { id: '2', label: '2. Compreensão' },
    { id: '3a', label: '3. Cognitivo' },
    { id: 'check', label: 'Qualitativo' }
  ];

  const renderSection = (section: ProcSection) => (
    <div key={section.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{section.title}</h3>
            {section.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{section.description}</p>}
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-2 uppercase">Máximo: {section.maxScore} pontos</p>
        </div>
        
        <div className="space-y-6">
            {section.items.map(item => (
                <div key={item.id} className="space-y-3">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{item.text}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {item.options.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => onUpdateAnswer(item.id, opt.value)}
                                className={`text-left p-3 rounded-lg border text-sm transition-all
                                    ${answers[item.id] === opt.value
                                        ? 'bg-purple-100 border-purple-500 text-purple-900 dark:bg-purple-900/40 dark:border-purple-500 dark:text-purple-100 ring-1 ring-purple-500'
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600'
                                    }`}
                            >
                                <div className="font-bold mb-1">{opt.value} pts</div>
                                <div>{opt.label}</div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans flex flex-col transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button onClick={onExit} className="flex items-center gap-2 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition">
             <ChevronLeft size={20} /> <span className="hidden sm:inline">Salvar e Sair</span>
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">Avaliação PROC</h1>
          <button 
            onClick={onFinish}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-purple-600/20 transition flex items-center gap-2"
          >
            Relatório <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-[60px] z-10 overflow-x-auto">
        <div className="max-w-5xl mx-auto flex">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-2 text-sm font-medium border-b-2 transition whitespace-nowrap
                        ${activeTab === tab.id 
                            ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto p-4 md:p-8 w-full pb-20">
        {/* Render sections based on active tab */}
        {activeTab === '1a' && (
            <div className="fade-in">
                {procSections.filter(s => ['1a', '1b', '1c', '1d'].includes(s.id)).map(renderSection)}
                <div className="flex justify-end">
                    <button onClick={() => setActiveTab('2')} className="btn-primary">Próximo: Compreensão</button>
                </div>
            </div>
        )}

        {activeTab === '2' && (
             <div className="fade-in">
                {procSections.filter(s => s.id === '2').map(renderSection)}
                <div className="flex justify-end">
                    <button onClick={() => setActiveTab('3a')} className="btn-primary">Próximo: Cognitivo</button>
                </div>
            </div>
        )}

        {activeTab === '3a' && (
             <div className="fade-in">
                {procSections.filter(s => ['3a', '3b', '3c', '3d'].includes(s.id)).map(renderSection)}
                 <div className="flex justify-end">
                    <button onClick={() => setActiveTab('check')} className="btn-primary">Próximo: Qualitativo</button>
                </div>
            </div>
        )}

        {activeTab === 'check' && (
            <div className="fade-in space-y-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800 mb-6">
                    <h2 className="text-xl font-bold text-purple-900 dark:text-purple-100">Análise Qualitativa</h2>
                    <p className="text-purple-800 dark:text-purple-200 text-sm">Selecione as características observadas para complementar o relatório.</p>
                </div>

                {procChecklistSections.map(section => (
                    <div key={section.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                         <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">{section.title}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {section.items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => onUpdateChecklist(item.id, !checklist[item.id])}
                                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all
                                        ${checklist[item.id]
                                            ? 'bg-purple-50 border-purple-300 text-purple-900 dark:bg-purple-900/30 dark:border-purple-500 dark:text-purple-100'
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'
                                        }`}
                                >
                                    <div className={`mt-0.5 ${checklist[item.id] ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`}>
                                        {checklist[item.id] ? <CheckSquare size={20} /> : <Square size={20} />}
                                    </div>
                                    <span className="text-sm">{item.text}</span>
                                </button>
                            ))}
                         </div>
                    </div>
                ))}
                
                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={onFinish}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 transform active:scale-95"
                    >
                        <Save size={20} /> Finalizar e Ver Relatório
                    </button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default ProcAssessment;
