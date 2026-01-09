import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface TriageProps {
  onSetSection: (section: string) => void;
  onNavigate: (view: 'registration') => void;
}

const Triage: React.FC<TriageProps> = ({ onSetSection, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white fade-in transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => onNavigate('registration')}
            className="text-slate-500 dark:text-slate-400 hover:text-blue-600 font-medium flex items-center gap-2 transition"
          >
            <ChevronLeft size={20} /> Cadastro
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">Ponto de Partida</h1>
          <div className="w-20"></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Escolha a Fase Inicial</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Selecione a descrição que melhor corresponde às habilidades atuais da criança.</p>
        </div>
        <div className="grid gap-6">
          <button
            onClick={() => onSetSection('A')}
            className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-100 dark:hover:shadow-none transition-all text-left"
          >
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-400 rounded-l-2xl"></div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Fase A: Pré-Intencional</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">"A criança ainda não tem controle intencional claro. Eu interpreto o conforto/desconforto dela pelos seus movimentos e sons."</p>
          </button>
          <button
            onClick={() => onSetSection('B')}
            className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-100 dark:hover:shadow-none transition-all text-left"
          >
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-orange-400 rounded-l-2xl"></div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Fase B: Comportamento Intencional</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">"A criança age com intenção sobre objetos (pega, joga), mas ainda não usa esses comportamentos especificamente para me pedir ajuda."</p>
          </button>
          <button
            onClick={() => onSetSection('C')}
            className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-none transition-all text-left"
          >
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600 rounded-l-2xl"></div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Fase C: Comunicação Intencional</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">"A criança se comunica comigo intencionalmente (gestos, sons, olhar alternado, fala ou símbolos) para pedir, recusar ou comentar."</p>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Triage;