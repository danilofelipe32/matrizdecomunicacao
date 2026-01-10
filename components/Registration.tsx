import React, { useState } from 'react';
import { ChevronLeft, Stethoscope, ChevronRight, Sparkles, Loader2, Edit, X, Send, Save, AlertCircle } from 'lucide-react';
import { UserData } from '../types';

interface RegistrationProps {
  userData: UserData;
  onUpdate: (field: keyof UserData, value: string) => void;
  onNavigate: (view: 'landing' | 'triage') => void;
}

const Registration: React.FC<RegistrationProps> = ({ userData, onUpdate, onNavigate }) => {
  const [generatingField, setGeneratingField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});
  
  // Estados para o Modal de Edição/Refinamento
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    field: keyof UserData | null;
    label: string;
    text: string;
  }>({ isOpen: false, field: null, label: '', text: '' });

  const [refinement, setRefinement] = useState({
    showInput: false,
    instruction: '',
    loading: false
  });

  const validateAndContinue = () => {
    const newErrors: Partial<Record<keyof UserData, string>> = {};
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
      diagnosis: 'Laudo / Diagnóstico',
      consultationReason: 'Motivo da Consulta'
    };

    let hasError = false;
    for (const [key, label] of Object.entries(requiredFields)) {
      const k = key as keyof UserData;
      if (!userData[k] || userData[k].trim() === '') {
        newErrors[k] = `O campo ${label} é obrigatório.`;
        hasError = true;
      }
    }

    setErrors(newErrors);

    if (hasError) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    onNavigate('triage');
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    onUpdate(field, value);
    // Limpa o erro do campo se o usuário começar a digitar
    if (errors[field]) {
        setErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }
  };

  // Helper para classes de input com erro
  const getInputClass = (field: keyof UserData, paddingLeft = false) => `
    w-full ${paddingLeft ? 'pl-10' : ''} px-4 py-2 rounded-lg border transition outline-none
    ${errors[field] 
        ? 'border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
        : 'border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
  `;

  const ErrorMessage = ({ field }: { field: keyof UserData }) => (
      errors[field] ? (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1 font-medium animate-pulse">
              <AlertCircle size={12} /> {errors[field]}
          </p>
      ) : null
  );

  // Função Original de Geração (Botão "Gerar com IA")
  const generateAiText = async (field: keyof UserData, label: string) => {
    if (generatingField) return;

    if (!userData.name || !userData.age) {
      alert("Por favor, preencha pelo menos o Nome e a Idade da criança para dar contexto à IA.");
      return;
    }

    setGeneratingField(field);

    const contextPrompt = `
      Atue como um fonoaudiólogo especialista realizando uma avaliação clínica.
      
      Gere ou melhore o texto técnico para o campo: "${label}".
      
      DADOS DO PACIENTE:
      - Nome: ${userData.name}
      - Idade: ${userData.age}
      - Sexo: ${userData.gender === 'M' ? 'Masculino' : userData.gender === 'F' ? 'Feminino' : 'Não informado'}
      - Responsáveis: ${userData.motherName} e ${userData.fatherName}
      - Fonoaudiólogo: ${userData.speechTherapist}
      
      CONTEXTO JÁ ESCRITO NO CAMPO (Rascunho):
      "${userData[field] || 'Nenhum texto inserido ainda. Crie uma sugestão baseada nos dados do paciente.'}"
      
      INSTRUÇÕES:
      1. Se houver um rascunho, reescreva-o de forma técnica, corrigindo gramática e usando terminologia fonoaudiológica adequada.
      2. Se estiver vazio, crie um texto padrão profissional condizente com o campo solicitado e os dados do paciente (hipotético mas plausível).
      3. Seja direto e profissional. Retorne APENAS o texto sugerido para o campo, sem introduções.
    `;

    try {
      const response = await fetch('https://apifreellm.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: contextPrompt })
      });

      const data = await response.json();

      if (data.status === 'success') {
        handleInputChange(field, data.response.trim()); // Usa handleInput para limpar erros se houver
      } else if (data.error && data.error.includes("Rate limit")) {
        alert("Limite de requisições da IA atingido. Aguarde 5 segundos.");
      } else {
        alert("Erro ao gerar texto: " + (data.error || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro na requisição IA:", error);
      alert("Não foi possível conectar ao serviço de IA.");
    } finally {
      setGeneratingField(null);
    }
  };

  // Abrir Modal de Edição
  const openEditModal = (field: keyof UserData, label: string) => {
    setEditModal({
      isOpen: true,
      field,
      label,
      text: userData[field] || ''
    });
    setRefinement({ showInput: false, instruction: '', loading: false });
  };

  // Função "Assim, mas..." (Refinamento)
  const handleRefineText = async () => {
    if (!refinement.instruction.trim()) return;
    
    setRefinement(prev => ({ ...prev, loading: true }));

    const contextPrompt = `
      Atue como um fonoaudiólogo especialista.
      
      TAREFA: Reescreva o texto abaixo aplicando a seguinte instrução de alteração:
      "${refinement.instruction}"
      
      TEXTO ATUAL:
      "${editModal.text}"
      
      DADOS DO PACIENTE (Para contexto):
      - Nome: ${userData.name}, Idade: ${userData.age}
      
      Retorne APENAS o novo texto reescrito, mantendo tom clínico.
    `;

    try {
      const response = await fetch('https://apifreellm.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: contextPrompt })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setEditModal(prev => ({ ...prev, text: data.response.trim() }));
        setRefinement({ showInput: false, instruction: '', loading: false });
      } else {
        alert("Erro na IA: " + (data.error || "Erro desconhecido"));
        setRefinement(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      alert("Erro de conexão.");
      setRefinement(prev => ({ ...prev, loading: false }));
    }
  };

  const saveModalChanges = () => {
    if (editModal.field) {
      handleInputChange(editModal.field, editModal.text);
    }
    setEditModal({ isOpen: false, field: null, label: '', text: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white fade-in transition-colors duration-300 relative">
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
          
          {Object.keys(errors).length > 0 && (
             <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg flex items-start gap-2">
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-bold text-sm">Existem campos obrigatórios não preenchidos.</p>
                    <p className="text-xs opacity-90">Verifique os campos destacados em vermelho abaixo.</p>
                </div>
             </div>
          )}

          <div className="space-y-6">
            {/* Campos Pessoais Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={getInputClass('name')}
                  placeholder="Nome da criança"
                />
                <ErrorMessage field="name" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Idade *</label>
                <input
                  type="text"
                  value={userData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className={getInputClass('age')}
                  placeholder="Anos/Meses"
                />
                <ErrorMessage field="age" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Sexo *</label>
                <select
                  value={userData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={getInputClass('gender')}
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
                <ErrorMessage field="gender" />
              </div>
            </div>

            <div className={`p-4 rounded-lg border transition ${errors.speechTherapist ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800' : 'bg-blue-50 border-blue-100 dark:bg-slate-700 dark:border-slate-600'}`}>
              <label className={`block text-sm font-bold mb-1 ${errors.speechTherapist ? 'text-red-700 dark:text-red-300' : 'text-blue-800 dark:text-blue-200'}`}>Fonoaudiólogo (a) Responsável *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Stethoscope className={`${errors.speechTherapist ? 'text-red-400' : 'text-blue-400 dark:text-blue-300'}`} size={16} />
                </div>
                <input
                  type="text"
                  value={userData.speechTherapist}
                  onChange={(e) => handleInputChange('speechTherapist', e.target.value)}
                  className={getInputClass('speechTherapist', true).replace('border-slate-300', 'border-blue-200 dark:border-slate-500 dark:bg-slate-600')} // Custom style override for the "special" input look if needed, but getInputClass handles base logic
                  placeholder="Nome do profissional"
                />
              </div>
              <ErrorMessage field="speechTherapist" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome da Mãe *</label>
                <input
                  type="text"
                  value={userData.motherName}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                  className={getInputClass('motherName')}
                />
                <ErrorMessage field="motherName" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome do Pai *</label>
                <input
                  type="text"
                  value={userData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  className={getInputClass('fatherName')}
                />
                <ErrorMessage field="fatherName" />
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Rua *</label>
                <input
                  type="text"
                  value={userData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className={getInputClass('street')}
                />
                <ErrorMessage field="street" />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Número *</label>
                <input
                  type="text"
                  value={userData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  className={getInputClass('number')}
                />
                <ErrorMessage field="number" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Bairro *</label>
                    <input type="text" value={userData.neighborhood} onChange={(e) => handleInputChange('neighborhood', e.target.value)} className={getInputClass('neighborhood')} />
                    <ErrorMessage field="neighborhood" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">CEP *</label>
                    <input type="text" value={userData.zip} onChange={(e) => handleInputChange('zip', e.target.value)} className={getInputClass('zip')} />
                    <ErrorMessage field="zip" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Telefone *</label>
                    <input type="text" value={userData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={getInputClass('phone')} />
                    <ErrorMessage field="phone" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">E-mail *</label>
                    <input type="email" value={userData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={getInputClass('email')} />
                    <ErrorMessage field="email" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Data da Avaliação *</label>
                    <input type="date" value={userData.date} onChange={(e) => handleInputChange('date', e.target.value)} className={getInputClass('date')} />
                    <ErrorMessage field="date" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Hora *</label>
                    <input type="time" value={userData.time} onChange={(e) => handleInputChange('time', e.target.value)} className={getInputClass('time')} />
                    <ErrorMessage field="time" />
                </div>
            </div>

            {/* Campos de Texto Longo com IA e Edição */}
            {[
              { field: 'diagnosis' as const, label: 'Laudo / Diagnóstico Clínico', required: true },
              { field: 'consultationReason' as const, label: 'Motivo da Consulta', required: true, placeholder: "Descreva o motivo principal..." },
              { field: 'observations' as const, label: 'Observações Gerais', required: false, placeholder: "Notas adicionais..." }
            ].map((item) => (
              <div key={item.field}>
                <div className="flex flex-wrap justify-between items-center mb-1 gap-2">
                  <label className={`block text-sm font-semibold ${errors[item.field] ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {item.label} {item.required && '*'} {!item.required && <span className="text-slate-400 font-normal">(Opcional)</span>}
                  </label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(item.field, item.label)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-full transition-all"
                      title="Editar texto manualmente"
                    >
                      <Edit size={14} /> Editar
                    </button>
                    <button 
                      onClick={() => generateAiText(item.field, item.label)}
                      disabled={generatingField !== null}
                      className="flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 px-3 py-1.5 rounded-full transition-all disabled:opacity-50"
                      title="Usar IA para gerar ou melhorar o texto"
                    >
                      {generatingField === item.field ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {generatingField === item.field ? 'Gerando...' : 'Gerar com IA'}
                    </button>
                  </div>
                </div>
                <textarea 
                  rows={4} 
                  maxLength={item.field === 'observations' ? 500 : undefined}
                  value={userData[item.field] || ''} 
                  onChange={(e) => handleInputChange(item.field, e.target.value)} 
                  placeholder={item.placeholder || ''}
                  className={getInputClass(item.field)}
                ></textarea>
                <ErrorMessage field={item.field} />
                {item.field === 'observations' && (
                  <div className="text-right mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{(userData.observations || '').length}/500</span>
                  </div>
                )}
              </div>
            ))}

          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={validateAndContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 transform active:scale-95"
            >
              Continuar para Triagem <ChevronRight />
            </button>
          </div>
        </div>
      </main>

      {/* Modal de Edição */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                 <h3 className="text-xl font-bold text-slate-800 dark:text-white">Editar Texto</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400">{editModal.label}</p>
              </div>
              <button onClick={() => setEditModal({ ...editModal, isOpen: false })} className="text-slate-400 hover:text-red-500 transition">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto">
              <textarea
                value={editModal.text}
                onChange={(e) => setEditModal(prev => ({ ...prev, text: e.target.value }))}
                className="w-full h-64 p-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none text-base leading-relaxed"
                placeholder="Digite ou edite o texto aqui..."
              ></textarea>
              
              {/* Área "Assim, mas..." */}
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
                       <label className="block text-xs font-bold text-purple-800 dark:text-purple-300 mb-2">O que você gostaria de mudar neste texto?</label>
                       <div className="flex gap-2">
                          <input 
                             type="text" 
                             value={refinement.instruction}
                             onChange={(e) => setRefinement(prev => ({ ...prev, instruction: e.target.value }))}
                             placeholder="Ex: Resuma, torne mais formal, adicione que a criança estava agitada..."
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

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
              <button 
                onClick={() => setEditModal({ ...editModal, isOpen: false })}
                className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={saveModalChanges}
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

export default Registration;