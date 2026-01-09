import React from 'react';
import { ChevronLeft, Stethoscope, ChevronRight } from 'lucide-react';
import { UserData } from '../types';

interface RegistrationProps {
  userData: UserData;
  onUpdate: (field: keyof UserData, value: string) => void;
  onNavigate: (view: 'landing' | 'triage') => void;
}

const Registration: React.FC<RegistrationProps> = ({ userData, onUpdate, onNavigate }) => {
  
  const handleContinue = () => {
    // Mapa de campos obrigatórios e seus rótulos amigáveis
    const requiredFields: Partial<Record<keyof UserData, string>> = {
      name: 'Nome Completo',
      age: 'Idade',
      gender: 'Sexo',
      speechTherapist: 'Fonoaudiólogo(a)',
      motherName: 'Nome da Mãe',
      fatherName: 'Nome do Pai',
      street: 'Rua',
      number: 'Número',
      neighborhood: 'Bairro',
      zip: 'CEP',
      phone: 'Telefone',
      email: 'E-mail',
      date: 'Data da Avaliação',
      time: 'Hora',
      diagnosis: 'Laudo / Diagnóstico'
    };

    // Encontrar o primeiro campo vazio
    for (const [key, label] of Object.entries(requiredFields)) {
      const value = userData[key as keyof UserData];
      if (!value || value.trim() === '') {
        alert(`Por favor, preencha o campo: ${label}`);
        return; // Interrompe a função e não navega
      }
    }

    // Se tudo estiver preenchido, segue para a próxima tela
    // (O salvamento já ocorre automaticamente via onUpdate no App.tsx)
    onNavigate('triage');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white fade-in transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-slate-500 dark:text-slate-400 hover:text-blue-600 font-medium flex items-center gap-2 transition"
          >
            <ChevronLeft size={20} /> Voltar
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">Cadastro</h1>
          <div className="w-20"></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">Ficha de Identificação</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => onUpdate('name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Nome da criança"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Idade *</label>
                <input
                  type="text"
                  value={userData.age}
                  onChange={(e) => onUpdate('age', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Anos/Meses"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Sexo *</label>
                <select
                  value={userData.gender}
                  onChange={(e) => onUpdate('gender', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg border border-blue-100 dark:border-slate-600">
              <label className="block text-sm font-bold text-blue-800 dark:text-blue-200 mb-1">Fonoaudiólogo (a) Responsável *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Stethoscope className="text-blue-400 dark:text-blue-300" size={16} />
                </div>
                <input
                  type="text"
                  value={userData.speechTherapist}
                  onChange={(e) => onUpdate('speechTherapist', e.target.value)}
                  className="pl-10 w-full px-4 py-2 rounded-md border border-blue-200 dark:border-slate-500 dark:bg-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Nome do profissional"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome da Mãe *</label>
                <input
                  type="text"
                  value={userData.motherName}
                  onChange={(e) => onUpdate('motherName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome do Pai *</label>
                <input
                  type="text"
                  value={userData.fatherName}
                  onChange={(e) => onUpdate('fatherName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Rua *</label>
                <input
                  type="text"
                  value={userData.street}
                  onChange={(e) => onUpdate('street', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Número *</label>
                <input
                  type="text"
                  value={userData.number}
                  onChange={(e) => onUpdate('number', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Bairro *</label>
                    <input type="text" value={userData.neighborhood} onChange={(e) => onUpdate('neighborhood', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">CEP *</label>
                    <input type="text" value={userData.zip} onChange={(e) => onUpdate('zip', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Telefone *</label>
                    <input type="text" value={userData.phone} onChange={(e) => onUpdate('phone', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">E-mail *</label>
                    <input type="email" value={userData.email} onChange={(e) => onUpdate('email', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Data da Avaliação *</label>
                    <input type="date" value={userData.date} onChange={(e) => onUpdate('date', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Hora *</label>
                    <input type="time" value={userData.time} onChange={(e) => onUpdate('time', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Laudo / Diagnóstico Clínico *</label>
                <textarea rows={4} value={userData.diagnosis} onChange={(e) => onUpdate('diagnosis', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"></textarea>
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Observações Gerais <span className="text-slate-400 font-normal">(Opcional)</span></label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {(userData.observations || '').length}/500
                    </span>
                </div>
                <textarea 
                    rows={4} 
                    maxLength={500}
                    value={userData.observations || ''} 
                    onChange={(e) => onUpdate('observations', e.target.value)} 
                    placeholder="Insira notas adicionais sobre a criança ou a avaliação..."
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                ></textarea>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              Continuar para Triagem <ChevronRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Registration;