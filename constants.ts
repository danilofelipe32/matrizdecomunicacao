
import { Question, MatrixRow } from './types';

// --- CONTEXTO DE TREINAMENTO DA IA (FINE-TUNED) ---
export const AI_CONTEXT_MATRIX = `
MANUAL DE TREINAMENTO DE IA: FONOAUDIOLOGIA E COMUNICAÇÃO SUPLEMENTAR E ALTERNATIVA (CSA/CAA)

1. SYSTEM PROMPT (PERSONA):
Você é um Fonoaudiólogo com Doutorado especializado em Linguagem e Comunicação Suplementar e Alternativa (CSA/CAA). Sua base de conhecimento é estritamente fundamentada em evidências científicas e práticas clínicas documentadas nos manuais da Matriz de Comunicação (Rowland).
Ao analisar casos, adote uma abordagem sociopragmática, reconhecendo a comunicação como direito humano.
`;

export const AI_CONTEXT_PROC = `
MANUAL DE TREINAMENTO DE IA: PROTOCOLO DE OBSERVAÇÃO COMPORTAMENTAL (PROC - Zorzi e Hage, 2004)
`;

export const sectionDescriptions: Record<string, { title: string; description: string }> = {
  'A': {
    title: 'Seção A: Comportamento Pré-Intencional',
    description: 'Nesta etapa, seu filho não parece ter controle sobre os seus comportamentos, mas parece que reage principalmente às sensações. Suas reações mostram como ele se sente.'
  },
  'B': {
    title: 'Seção B: Comportamento Intencional',
    description: 'Nesta etapa, seu filho é capaz de fazer coisas intencionalmente, mas ainda não percebeu que pode comunicar coisas a você utilizando o seu comportamento.'
  },
  'C': {
    title: 'Seção C: Comunicação Intencional',
    description: 'Nesta etapa, seu filho sabe que se fizer certas coisas, você reagirá de determinada maneira e utiliza seus comportamentos para comunicar-se intencionalmente.'
  }
};

export const questionsData: Question[] = [
    // --- SEÇÃO A: Nível I ---
    {
        id: 'A1', section: 'A', title: 'A.1 Expressa incômodo',
        description: 'Você pode perceber quando seu filho (a) não está cômodo (com dor, molhado, com fome, assustado)?',
        levels: [
            { id: 'A1_1', level: 1, category: 'Movimentos Corporais', label: 'Muda de postura (endurece o corpo, se contorce, dá voltas)', behaviors: [] },
            { id: 'A1_2', level: 1, category: 'Movimentos Corporais', label: 'Movimentos de extremidades (pisoteia, agita os braços)', behaviors: [] },
            { id: 'A1_3', level: 1, category: 'Movimentos Corporais', label: 'Movimentos de cabeça (afasta a cabeça)', behaviors: [] },
            { id: 'A1_4', level: 1, category: 'Sons', label: 'Chora, grunhe, grita', behaviors: [] },
            { id: 'A1_5', level: 1, category: 'Expressões', label: 'Faz caretas', behaviors: [] }
        ]
    },
    {
        id: 'A2', section: 'A', title: 'A.2 Expressa comodidade',
        description: 'Você pode perceber quando seu filho (a) está contente ou animado?',
        levels: [
            { id: 'A2_1', level: 1, category: 'Movimentos Corporais', label: 'Muda de postura (endurece o corpo, relaxa)', behaviors: [] },
            { id: 'A2_2', level: 1, category: 'Movimentos Corporais', label: 'Movimentos de extremidades (pisoteia, agita os braços)', behaviors: [] },
            { id: 'A2_3', level: 1, category: 'Movimentos Corporais', label: 'Movimentos de cabeça (assente com a cabeça)', behaviors: [] },
            { id: 'A2_4', level: 1, category: 'Sons', label: 'Gemidos, gritinhos', behaviors: [] },
            { id: 'A2_5', level: 1, category: 'Expressões', label: 'Sorriso', behaviors: [] }
        ]
    },
    {
        id: 'A3', section: 'A', title: 'A.3 Expressa interesse em outras pessoas',
        description: 'Você pode perceber quando seu filho (a) se interessa por outras pessoas?',
        levels: [
            { id: 'A3_1', level: 1, category: 'Movimentos Corporais', label: 'Muda de postura (endurece o corpo, relaxa)', behaviors: [] },
            { id: 'A3_2', level: 1, category: 'Movimentos Corporais', label: 'Movimentos de extremidades (pisoteia, agita os braços)', behaviors: [] },
            { id: 'A3_3', level: 1, category: 'Sons', label: 'Gemidos, agitação', behaviors: [] },
            { id: 'A3_4', level: 1, category: 'Expressões', label: 'Sorriso', behaviors: [] }
        ]
    },

    // --- SEÇÃO B: Nível II ---
    {
        id: 'B1', section: 'B', title: 'B.1 Protesta',
        description: 'Você pode perceber quando seu filho (a) não quer algo específico?',
        levels: [
            { id: 'B1_1', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Movimentos de cabeça (mexe a cabeça para um lado ou para trás)', behaviors: [] },
            { id: 'B1_2', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Movimentos de braços (agita os braços, empurra, joga objetos)', behaviors: [] },
            { id: 'B1_3', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Movimentos de perna (pisoteia o chão, pisoteia)', behaviors: [] },
            { id: 'B1_4', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Afasta-se das pessoas ou objetos', behaviors: [] },
            { id: 'B1_5', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Charaminga, alvoroça-se, grita', behaviors: [] },
            { id: 'B1_6', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Franze as sobrancelhas, faz caretas', behaviors: [] }
        ]
    },
    {
        id: 'B2', section: 'B', title: 'B.2 Continua uma ação',
        description: 'Você pode perceber quando seu filho (a) gostaria de continuar com uma ação ou uma atividade?',
        levels: [
            { id: 'B2_1', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Movimentos de cabeça (aproxima a cabeça, assente)', behaviors: [] },
            { id: 'B2_2', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Movimentos de braços (agita os braços)', behaviors: [] },
            { id: 'B2_3', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Movimentos das pernas (pisoteia)', behaviors: [] },
            { id: 'B2_4', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Gemidos, gritinhos, alvoroço', behaviors: [] },
            { id: 'B2_5', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Sorriso', behaviors: [] },
            { id: 'B2_6', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Visual: olha as pessoas', behaviors: [] }
        ]
    },
    {
        id: 'B3', section: 'B', title: 'B.3 Obtém mais de algo',
        description: 'Você pode perceber às vezes que seu filho quer mais de algo específico?',
        levels: [
            { id: 'B3_1', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Aproxima-se do objeto desejado', behaviors: [] },
            { id: 'B3_2', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Movimentos de cabeça (aproxima a cabeça, assente)', behaviors: [] },
            { id: 'B3_3', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Movimentos dos braços (agita os braços)', behaviors: [] },
            { id: 'B3_4', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Movimentos das pernas (pisoteia)', behaviors: [] },
            { id: 'B3_5', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Pega o objeto desejado', behaviors: [] },
            { id: 'B3_6', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Gemidos, gritinhos, alvoroço', behaviors: [] },
            { id: 'B3_7', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Sorriso', behaviors: [] },
            { id: 'B3_8', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Visual: olha os objetos desejados', behaviors: [] }
        ]
    },
    {
        id: 'B4', section: 'B', title: 'B.4 Chama a atenção',
        description: 'Seu filho faz algo que faz com que você lhe dirija atenção, mesmo quando não está tentando atrair sua atenção intencionalmente?',
        levels: [
            { id: 'B4_1', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Aproxima-se da pessoa', behaviors: [] },
            { id: 'B4_2', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Movimentos de cabeça (aproxima a cabeça, assente)', behaviors: [] },
            { id: 'B4_3', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Movimentos dos braços (agita os braços)', behaviors: [] },
            { id: 'B4_4', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Movimentos das pernas (pisoteia)', behaviors: [] },
            { id: 'B4_5', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Gemidos, gritinhos, alvoroço', behaviors: [] },
            { id: 'B4_6', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Sorriso', behaviors: [] },
            { id: 'B4_7', level: 2, category: 'Comportamentos Intencionais (Nível II)', label: 'Visual: olha as pessoas', behaviors: [] }
        ]
    },

    // --- SEÇÃO C: Níveis III a VII (Estrutura Fiel ao PDF) ---
    {
        id: 'C1', section: 'C', title: 'C.1 Recusa ou rejeita algo',
        description: 'Esse indivíduo mostra intencionalmente a você que não deseja determinada coisa ou determinada atividade?',
        levels: [
            // Movimentos Corporais (Nível III)
            { id: 'C1_mov_1', level: 3, category: 'Movimentos Corporais', label: 'Movimentos de corpo inteiro (girar, virar)', behaviors: [] },
            { id: 'C1_mov_2', level: 3, category: 'Movimentos Corporais', label: 'Movimentos da cabeça (virar a cabeça para longe ou para o lado)', behaviors: [] },
            { id: 'C1_mov_3', level: 3, category: 'Movimentos Corporais', label: 'Movimentos de braço ou mão', behaviors: [] },
            { id: 'C1_mov_4', level: 3, category: 'Movimentos Corporais', label: 'Movimentos das pernas (chutar, bater os pés)', behaviors: [] },
            
            // Primeiros Sons (Nível III)
            { id: 'C1_sons_1', level: 3, category: 'Primeiros Sons', label: 'Gritar, lamentar', behaviors: [] },
            
            // Expressões Faciais (Nível III)
            { id: 'C1_face_1', level: 3, category: 'Expressões Faciais', label: 'Carranca, careta', behaviors: [] },
            
            // Gestos Simples (Nível III)
            { id: 'C1_gest_1', level: 3, category: 'Gestos Simples', label: 'Afasta objeto ou pessoa', behaviors: [] },
            
            // Gestos e Vocalizações Convencionais (Nível IV)
            { id: 'C1_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Dá o item indesejado para você', behaviors: [] },
            { id: 'C1_conv_2', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Balança a cabeça "não"', behaviors: [] },
            { id: 'C1_conv_3', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Vocalizações específicas ("uh-uh")', behaviors: [] },
            
            // Símbolos Concretos (Nível V)
            { id: 'C1_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Rejeita foto ou desenho de item indesejado', behaviors: [] },
            { id: 'C1_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Rejeita o símbolo do objeto que representa o item indesejado', behaviors: [] },
            
            // Símbolo Abstrato (Nível VI)
            { id: 'C1_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("não", "acabou")', behaviors: [] },
            { id: 'C1_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("não", "pare")', behaviors: [] },
            { id: 'C1_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("não", "acabou")', behaviors: [] },
            { id: 'C1_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("não", "pare")', behaviors: [] },
            { id: 'C1_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D (para "não", "pare")', behaviors: [] },
            { id: 'C1_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D (para "não", "pare")', behaviors: [] },
            
            // Linguagem (Nível VII)
            { id: 'C1_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("pare com isso", "não, sai")', behaviors: [] }
        ]
    },
    {
        id: 'C2', section: 'C', title: 'C.2 Pedir mais de uma ação',
        description: 'Esse indivíduo mostra intencionalmente a você que deseja mais de uma ação (como esconde-esconde, cócegas ou fazer um brinquedo funcionar) que você acabou de parar de fazer?',
        levels: [
            // Movimentos Corporais (Nível III)
            { id: 'C2_mov_1', level: 3, category: 'Movimentos Corporais', label: 'Movimentos de corpo inteiro (impulso repentino do corpo...)', behaviors: [] },
            { id: 'C2_mov_2', level: 3, category: 'Movimentos Corporais', label: 'Movimentos de braço/mão (flapping)', behaviors: [] },
            { id: 'C2_mov_3', level: 3, category: 'Movimentos Corporais', label: 'Movimentos das pernas (chute)', behaviors: [] },
            
            // Primeiros Sons
            { id: 'C2_sons_1', level: 3, category: 'Primeiros Sons', label: 'Arrulhos, gritos, risada', behaviors: [] },
            
            // Expressões
            { id: 'C2_face_1', level: 3, category: 'Expressões Faciais', label: 'Sorriso', behaviors: [] },
            
            // Gestos Simples
            { id: 'C2_gest_1', level: 3, category: 'Gestos Simples', label: 'Pega sua mão', behaviors: [] },
            { id: 'C2_gest_2', level: 3, category: 'Gestos Simples', label: 'Toca você', behaviors: [] },
            { id: 'C2_gest_3', level: 3, category: 'Gestos Simples', label: 'Alcança você (taps you)', behaviors: [] },
            
            // Visual (Nível IV - embora na prática possa ser III, o PDF agrupa visual às vezes separado, mas o protocolo classifica olhar intencional geralmente como pré-simbólico. Vamos manter Level 3 ou 4 conforme o PDF. O PDF aqui coloca antes de Gestos Convencionais, então provavelmente Level 3 ou 4. Vou assumir 3 para consistência com B2/B3/B4 se for apenas olhar, mas aqui é intencional. Na matriz original, "Olhar alternado" é Nível 4.)
            // No PDF está antes de "Gestos e Vocalizações Convencionais".
            { id: 'C2_vis_1', level: 3, category: 'Visual', label: 'Olha para você', behaviors: [] },
            
            // Gestos Convencionais (Nível IV)
            { id: 'C2_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Acena para você vir', behaviors: [] },
            { id: 'C2_conv_2', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Mantém as mãos para cima ou para você (para "para cima")', behaviors: [] },
            { id: 'C2_conv_3', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Acena com a cabeça', behaviors: [] },
            
            // Símbolos Concretos
            { id: 'C2_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho da ação desejada', behaviors: [] },
            { id: 'C2_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica o símbolo do objeto que representa a ação desejada', behaviors: [] },
            { id: 'C2_conc_3', level: 5, category: 'Símbolos Concretos', label: 'Expressa ou representa (algo) por mímica extravagante/dramatização', behaviors: [] },
            
            // Abstrato
            { id: 'C2_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("mais", "cócegas")', behaviors: [] },
            { id: 'C2_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("mais", "balanço")', behaviors: [] },
            { id: 'C2_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("mais", "cócegas")', behaviors: [] },
            { id: 'C2_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("mais", "balançar")', behaviors: [] },
            { id: 'C2_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("mais", "cócegas")', behaviors: [] },
            { id: 'C2_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("mais", "comer")', behaviors: [] },
            
            // Linguagem
            { id: 'C2_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("mais cócegas", "faça de novo")', behaviors: [] }
        ]
    },
    {
        id: 'C3', section: 'C', title: 'C.3 Solicita uma nova ação',
        description: 'Este indivíduo indica intencionalmente que deseja que você execute uma nova ação (uma ação na qual você não tenha acabado de se engajar)?',
        levels: [
            // Movimentos Corporais
            { id: 'C3_mov_1', level: 3, category: 'Movimentos Corporais', label: 'Movimentos de corpo inteiro (saltar para cima e para baixo...)', behaviors: [] },
            { id: 'C3_mov_2', level: 3, category: 'Movimentos Corporais', label: 'Movimentos de braço/mão (movendo os braços...)', behaviors: [] },
            { id: 'C3_mov_3', level: 3, category: 'Movimentos Corporais', label: 'Movimentos das pernas (move as pernas...)', behaviors: [] },
            
            // Expressões
            { id: 'C3_face_1', level: 3, category: 'Expressões Faciais', label: 'Sorriso', behaviors: [] },
            
            // Gestos Simples
            { id: 'C3_gest_1', level: 3, category: 'Gestos Simples', label: 'Pega a sua mão', behaviors: [] },
            
            // Visual
            { id: 'C3_vis_1', level: 3, category: 'Visual', label: 'Olha para você', behaviors: [] },
            
            // Gestos Convencionais
            { id: 'C3_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Acena para você vir', behaviors: [] },
            { id: 'C3_conv_2', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Mantém as mãos para cima ou para você (para "o alto")', behaviors: [] },
            
            // Símbolos Concretos
            { id: 'C3_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho da ação desejada', behaviors: [] },
            { id: 'C3_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica o símbolo do objeto que representa a ação desejada', behaviors: [] },
            { id: 'C3_conc_3', level: 5, category: 'Símbolos Concretos', label: 'Expressa/representa por mímica extravagante', behaviors: [] },
            { id: 'C3_conc_4', level: 5, category: 'Símbolos Concretos', label: 'Imita o som que acompanha a ação desejada, como uma melodia', behaviors: [] },
            
            // Abstrato
            { id: 'C3_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("cócegas")', behaviors: [] },
            { id: 'C3_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("comer")', behaviors: [] },
            { id: 'C3_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("cócegas ")', behaviors: [] },
            { id: 'C3_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("balanço")', behaviors: [] },
            { id: 'C3_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D (“pedra")', behaviors: [] },
            { id: 'C3_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("cócegas")', behaviors: [] },
            
            // Linguagem
            { id: 'C3_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("me faça cócegas", "eu quero balançar")', behaviors: [] }
        ]
    },
    {
        id: 'C4', section: 'C', title: 'C.4 Pedir mais de um objeto',
        description: 'Este indivíduo mostra intencionalmente a você que quer mais de alguma coisa (como um brinquedo ou comida) depois de já ter comido alguma coisa?',
        levels: [
            // Movimentos
            { id: 'C4_mov_1', level: 3, category: 'Movimentos Corporais', label: 'Movimentos de corpo inteiro (impulso repentino do corpo...)', behaviors: [] },
            { id: 'C4_mov_2', level: 3, category: 'Movimentos Corporais', label: 'Move a cabeça em direção ao item desejado', behaviors: [] },
            { id: 'C4_mov_3', level: 3, category: 'Movimentos Corporais', label: 'Movimentos de braço/mão', behaviors: [] },
            { id: 'C4_mov_4', level: 3, category: 'Movimentos Corporais', label: 'Movimentos das pernas', behaviors: [] },
            
            // Sons
            { id: 'C4_sons_1', level: 3, category: 'Primeiros Sons', label: 'Som de excitação, um grito ou ruído longo e agudo', behaviors: [] },
            
            // Expressões
            { id: 'C4_face_1', level: 3, category: 'Expressões Faciais', label: 'Sorriso', behaviors: [] },
            
            // Gestos Simples
            { id: 'C4_gest_1', level: 3, category: 'Gestos Simples', label: 'Guia sua mão ou puxa você para o item desejado', behaviors: [] },
            { id: 'C4_gest_2', level: 3, category: 'Gestos Simples', label: 'Toca no objeto desejado (sem pegá-lo)', behaviors: [] },
            { id: 'C4_gest_3', level: 3, category: 'Gestos Simples', label: 'Alcança ou toca no objeto', behaviors: [] },
            
            // Visual
            { id: 'C4_vis_1', level: 3, category: 'Visual', label: 'Olha para o item desejado', behaviors: [] },
            
            // Convencional
            { id: 'C4_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Olha para frente e para trás entre você e o item desejado', behaviors: [] },
            { id: 'C4_conv_2', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Olha para o item desejado (com insistência/intenção clara)', behaviors: [] },
            
            // Concretos
            { id: 'C4_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho da ação desejada', behaviors: [] },
            { id: 'C4_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica o símbolo do objeto que representa o item desejado', behaviors: [] },
            { id: 'C4_conc_3', level: 5, category: 'Símbolos Concretos', label: 'Expressa ou representa (algo) por mímica extravagante', behaviors: [] },
            { id: 'C4_conc_4', level: 5, category: 'Símbolos Concretos', label: 'Imita o som do item desejado', behaviors: [] },
            
            // Abstratos
            { id: 'C4_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("mais", "bola")', behaviors: [] },
            { id: 'C4_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("mais", "boneca")', behaviors: [] },
            { id: 'C4_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("mais", "bola")', behaviors: [] },
            { id: 'C4_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("mais", "suco")', behaviors: [] },
            { id: 'C4_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("mais", "bola")', behaviors: [] },
            { id: 'C4_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("mais", "biscoito")', behaviors: [] },
            
            // Linguagem
            { id: 'C4_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("mais suco", "quero mais bolhas")', behaviors: [] }
        ]
    },
    {
        id: 'C5', section: 'C', title: 'C.5 Fazer escolhas',
        description: 'Esse indivíduo escolhe intencionalmente entre dois ou mais itens que você oferece ao mesmo tempo?',
        levels: [
            // Movimentos
            { id: 'C5_mov_1', level: 3, category: 'Movimentos Corporais', label: 'Movimentos de corpo inteiro (impulso repentino...)', behaviors: [] },
            { id: 'C5_mov_2', level: 3, category: 'Movimentos Corporais', label: 'Mova a cabeça em direção ao item desejado', behaviors: [] },
            
            // Gestos Simples
            { id: 'C5_gest_1', level: 3, category: 'Gestos Simples', label: 'Guia sua mão para o item desejado', behaviors: [] },
            { id: 'C5_gest_2', level: 3, category: 'Gestos Simples', label: 'Alcança, toca ou bate no item desejado (sem pegá-lo)', behaviors: [] },
            
            // Visual
            { id: 'C5_vis_1', level: 3, category: 'Visual', label: 'Olha para o objeto', behaviors: [] },
            
            // Convencional
            { id: 'C5_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Olha para frente e para trás entre você e o item desejado', behaviors: [] },
            { id: 'C5_conv_2', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Aponta para o item desejado', behaviors: [] },
            
            // Concretos
            { id: 'C5_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho do objeto desejado', behaviors: [] },
            { id: 'C5_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica o símbolo do objeto que representa o item desejado', behaviors: [] },
            { id: 'C5_conc_3', level: 5, category: 'Símbolos Concretos', label: 'Expressa ou representa (algo) por mímica extravagante', behaviors: [] },
            { id: 'C5_conc_4', level: 5, category: 'Símbolos Concretos', label: 'Imita o som do item desejado', behaviors: [] },
            
            // Abstratos
            { id: 'C5_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("isso", “nome do item")', behaviors: [] },
            { id: 'C5_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("isso", “nome do item")', behaviors: [] },
            { id: 'C5_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita (“nome do item")', behaviors: [] },
            { id: 'C5_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile (“nome do item")', behaviors: [] },
            { id: 'C5_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D (“nome do item")', behaviors: [] },
            { id: 'C5_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D (“nome do item")', behaviors: [] },
            
            // Linguagem
            { id: 'C5_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("quero esse", "quero o trem")', behaviors: [] }
        ]
    },
    {
        id: 'C6', section: 'C', title: 'C.6 Pedir um novo objeto',
        description: 'Este indivíduo mostra intencionalmente a você que deseja um novo objeto (como um brinquedo ou algum alimento) que esteja ao alcance de sua visão, audição ou toque, mas que você não ofereceu?',
        levels: [
            { id: 'C6_mov_1', level: 3, category: 'Movimentos Corporais', label: 'Movimentos de corpo inteiro', behaviors: [] },
            { id: 'C6_mov_2', level: 3, category: 'Movimentos Corporais', label: 'Move a cabeça em direção ao item desejado', behaviors: [] },
            { id: 'C6_gest_1', level: 3, category: 'Gestos Simples', label: 'Guia sua mão ou puxa você para o item desejado', behaviors: [] },
            { id: 'C6_gest_2', level: 3, category: 'Gestos Simples', label: 'Toca no objeto desejado (sem pegá-lo)', behaviors: [] },
            { id: 'C6_gest_3', level: 3, category: 'Gestos Simples', label: 'Alcança ou bate no objeto', behaviors: [] },
            { id: 'C6_vis_1', level: 3, category: 'Visual', label: 'Olha para o objeto', behaviors: [] },
            { id: 'C6_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Olha para frente e para trás entre você e o item desejado', behaviors: [] },
            { id: 'C6_conv_2', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Aponta para o item desejado', behaviors: [] },
            { id: 'C6_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho do objeto desejado', behaviors: [] },
            { id: 'C6_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica o símbolo do objeto que representa o item desejado', behaviors: [] },
            { id: 'C6_conc_3', level: 5, category: 'Símbolos Concretos', label: 'Expressa ou representa (algo) por mímica extravagante', behaviors: [] },
            { id: 'C6_conc_4', level: 5, category: 'Símbolos Concretos', label: 'Imita o som do item desejado', behaviors: [] },
            { id: 'C6_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("carro")', behaviors: [] },
            { id: 'C6_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("boneca")', behaviors: [] },
            { id: 'C6_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("bola")', behaviors: [] },
            { id: 'C6_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("biscoito")', behaviors: [] },
            { id: 'C6_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("carro")', behaviors: [] },
            { id: 'C6_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("suco")', behaviors: [] },
            { id: 'C6_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("quero carro", "quero bola")', behaviors: [] }
        ]
    },
    {
        id: 'C7', section: 'C', title: 'C.7 Pedir objetos ausentes',
        description: 'Este indivíduo solicita intencionalmente coisas (brinquedos, comida, pessoas) que não estão presentes no ambiente imediato (coisas fora da vista, audição, toque, em outra sala, etc.)?',
        levels: [
            { id: 'C7_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho da ação desejada', behaviors: [] },
            { id: 'C7_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica o símbolo do objeto que representa a ação desejada', behaviors: [] },
            { id: 'C7_conc_3', level: 5, category: 'Símbolos Concretos', label: 'Expressa ou representa (algo) por mímica extravagante', behaviors: [] },
            { id: 'C7_conc_4', level: 5, category: 'Símbolos Concretos', label: 'Imita o som do objeto desejado', behaviors: [] },
            { id: 'C7_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada (“nome do item")', behaviors: [] },
            { id: 'C7_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual (“nome do item")', behaviors: [] },
            { id: 'C7_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita (“nome do item")', behaviors: [] },
            { id: 'C7_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile (“nome do item")', behaviors: [] },
            { id: 'C7_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D (“nome do item")', behaviors: [] },
            { id: 'C7_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D (“nome do item")', behaviors: [] },
            { id: 'C7_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("quero bola", "quero carro")', behaviors: [] }
        ]
    },
    {
        id: 'C8', section: 'C', title: 'C.8 Pedir atenção',
        description: 'Esse indivíduo intencionalmente tenta atrair sua atenção?',
        levels: [
            { id: 'C8_sons_1', level: 3, category: 'Primeiros Sons', label: 'Som de excitação, um grito ou ruído longo e agudo', behaviors: [] },
            { id: 'C8_face_1', level: 3, category: 'Expressões Faciais', label: 'Sorriso', behaviors: [] },
            { id: 'C8_gest_1', level: 3, category: 'Gestos Simples', label: 'Movimentos de braço/mão (flapping)', behaviors: [] },
            { id: 'C8_gest_2', level: 3, category: 'Gestos Simples', label: 'Toca você', behaviors: [] },
            { id: 'C8_gest_3', level: 3, category: 'Gestos Simples', label: 'Ativa o interruptor ou "dispositivo de chamada"', behaviors: [] },
            { id: 'C8_vis_1', level: 3, category: 'Visual', label: 'Olha para você', behaviors: [] },
            { id: 'C8_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Acena para você vir', behaviors: [] },
            { id: 'C8_conv_2', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Aponta para você', behaviors: [] },
            { id: 'C8_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho representando conceito como "olhe para mim"', behaviors: [] },
            { id: 'C8_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica o objeto que representa o conceito de "olhe para mim"', behaviors: [] },
            { id: 'C8_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("olha", "mamãe")', behaviors: [] },
            { id: 'C8_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("olha", "papai")', behaviors: [] },
            { id: 'C8_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("olha", "nome de uma pessoa")', behaviors: [] },
            { id: 'C8_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("olha", "mamãe")', behaviors: [] },
            { id: 'C8_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("olha", "mamãe")', behaviors: [] },
            { id: 'C8_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("olha", "professor")', behaviors: [] },
            { id: 'C8_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("olha papai", "olha pra mim")', behaviors: [] }
        ]
    },
    {
        id: 'C9', section: 'C', title: 'C.9 Demonstra afeto',
        description: 'Este indivíduo demonstra intencionalmente afeto por você ou por qualquer outra pessoa?',
        levels: [
            { id: 'C9_sons_1', level: 3, category: 'Primeiros Sons', label: 'Som de excitação, um grito ou ruído longo e agudo', behaviors: [] },
            { id: 'C9_face_1', level: 3, category: 'Expressões Faciais', label: 'Sorriso', behaviors: [] },
            { id: 'C9_gest_1', level: 3, category: 'Gestos Simples', label: 'Movimentos de braço e mão', behaviors: [] },
            { id: 'C9_gest_2', level: 3, category: 'Gestos Simples', label: 'Toca você', behaviors: [] },
            { id: 'C9_vis_1', level: 3, category: 'Visual', label: 'Olha para você', behaviors: [] },
            { id: 'C9_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Abraça, beija e dá tapinhas em você', behaviors: [] },
            { id: 'C9_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho representando conceito como "amor"', behaviors: [] },
            { id: 'C9_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("amor")', behaviors: [] },
            { id: 'C9_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual (“abraço”)', behaviors: [] },
            { id: 'C9_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("amor")', behaviors: [] },
            { id: 'C9_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile (“abraço”)', behaviors: [] },
            { id: 'C9_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("amor")', behaviors: [] },
            { id: 'C9_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D (“abraço”)', behaviors: [] },
            { id: 'C9_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("te amo", "eu gosto da mamãe")', behaviors: [] }
        ]
    },
    {
        id: 'C10', section: 'C', title: 'C.10 Cumprimentar as pessoas',
        description: 'Este indivíduo usa intencionalmente olá ou adeus quando alguém chega ou sai?',
        levels: [
            { id: 'C10_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Acena "oi" ou "tchau"', behaviors: [] },
            { id: 'C10_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho representando saudação ("olá", "tchau")', behaviors: [] },
            { id: 'C10_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("oi", "tchau")', behaviors: [] },
            { id: 'C10_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("oi", "tchau")', behaviors: [] },
            { id: 'C10_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("oi", "tchau")', behaviors: [] },
            { id: 'C10_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("oi", "tchau")', behaviors: [] },
            { id: 'C10_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("oi", "tchau")', behaviors: [] },
            { id: 'C10_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("oi", "tchau")', behaviors: [] },
            { id: 'C10_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("tchau, mamãe", "bom dia, papai")', behaviors: [] }
        ]
    },
    {
        id: 'C11', section: 'C', title: 'C.11 Oferece coisas ou ações',
        description: 'Este indivíduo oferece intencionalmente coisas ou compartilha com você, sem esperar nada em troca?',
        levels: [
            { id: 'C11_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Dá ou mostra algo para você', behaviors: [] },
            { id: 'C11_conv_2', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Vocalizações específicas com som de questionamento como se fosse para "quer isso?"', behaviors: [] },
            { id: 'C11_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho representando conceito como "seu/ para você"', behaviors: [] },
            { id: 'C11_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica o objeto que representa um conceito como "seu/ para você"', behaviors: [] },
            { id: 'C11_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("seu/ para você")', behaviors: [] },
            { id: 'C11_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("seu/ para você")', behaviors: [] },
            { id: 'C11_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("seu/ para você")', behaviors: [] },
            { id: 'C11_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("seu/ para você")', behaviors: [] },
            { id: 'C11_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("seu/ para você")', behaviors: [] },
            { id: 'C11_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("seu/ para você")', behaviors: [] },
            { id: 'C11_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("para você", "cookie para você")', behaviors: [] }
        ]
    },
    {
        id: 'C12', section: 'C', title: 'C.12 Direciona sua atenção para algo',
        description: 'Este indivíduo direciona intencionalmente sua atenção para algo que o interessa (como se estivesse dizendo "olhe para isso")?',
        levels: [
            { id: 'C12_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Aponta para algo', behaviors: [] },
            { id: 'C12_conv_2', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Olha para frente e para trás entre você e o objeto, pessoa ou lugar', behaviors: [] },
            { id: 'C12_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho representando conceito como "olha isso"', behaviors: [] },
            { id: 'C12_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica o objeto que representa o conceito, como "olhe para isso"', behaviors: [] },
            { id: 'C12_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("olha", "lá")', behaviors: [] },
            { id: 'C12_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("olha", "lá")', behaviors: [] },
            { id: 'C12_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("olha", "lá")', behaviors: [] },
            { id: 'C12_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("olha", "lá")', behaviors: [] },
            { id: 'C12_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("olha", "lá")', behaviors: [] },
            { id: 'C12_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("olha", "lá")', behaviors: [] },
            { id: 'C12_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("olha ali", "olha isso")', behaviors: [] }
        ]
    },
    {
        id: 'C13', section: 'C', title: 'C.13 Usa formas sociais educadas',
        description: 'Este indivíduo usa intencionalmente formas educadas de interação social, como pedir permissão, "por favor", "obrigado"?',
        levels: [
            { id: 'C13_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Aponta para algo como se estivesse perguntando "posso ficar com isso?"', behaviors: [] },
            { id: 'C13_conv_2', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Vocalização específica (som de questionamento para "posso?"', behaviors: [] },
            { id: 'C13_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho representando conceito como "por favor", "obrigado"', behaviors: [] },
            { id: 'C13_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica objeto representando conceito como "por favor", "obrigado"', behaviors: [] },
            { id: 'C13_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("por favor")', behaviors: [] },
            { id: 'C13_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("obrigado")', behaviors: [] },
            { id: 'C13_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("por favor")', behaviors: [] },
            { id: 'C13_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("desculpe")', behaviors: [] },
            { id: 'C13_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("por favor")', behaviors: [] },
            { id: 'C13_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("obrigado")', behaviors: [] },
            { id: 'C13_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("sim, por favor", "mamãe posso?")', behaviors: [] }
        ]
    },
    {
        id: 'C14', section: 'C', title: 'C.14 Responder a perguntas "sim" e "não"',
        description: 'Este indivíduo indica intencionalmente "sim" ou "não" ou "não sei" em resposta a uma pergunta?',
        levels: [
            { id: 'C14_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Acena com a cabeça "sim"', behaviors: [] },
            { id: 'C14_conv_2', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Balança a cabeça "não"', behaviors: [] },
            { id: 'C14_conv_3', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Encolhe os ombros', behaviors: [] },
            { id: 'C14_conv_4', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Vocalização específica indicando sim, não ("uh-huh", "nu-uh")', behaviors: [] },
            { id: 'C14_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho representando "sim" ou "não"', behaviors: [] },
            { id: 'C14_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("sim, não")', behaviors: [] },
            { id: 'C14_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("sim, não")', behaviors: [] },
            { id: 'C14_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("sim, não")', behaviors: [] },
            { id: 'C14_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("sim, não")', behaviors: [] },
            { id: 'C14_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("sim, não")', behaviors: [] },
            { id: 'C14_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("sim, não")', behaviors: [] },
            { id: 'C14_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("de jeito nenhum", "não sei")', behaviors: [] }
        ]
    },
    {
        id: 'C15', section: 'C', title: 'C.15 Faz perguntas',
        description: 'Essa pessoa faz perguntas (não necessariamente usando palavras), claramente querendo uma resposta sua?',
        levels: [
            { id: 'C15_conv_1', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Levanta as mãos, encolhe os ombros como se estivesse questionando', behaviors: [] },
            { id: 'C15_conv_2', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Vocalizações específicas como se estivessem questionando', behaviors: [] },
            { id: 'C15_conv_3', level: 4, category: 'Gestos e Vocalizações Convencionais', label: 'Olha para frente e para trás entre você e o objeto ou lugar', behaviors: [] },
            { id: 'C15_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho representando uma pergunta ("quem?", "o quê?", "onde?", "quando?", "por quê?")', behaviors: [] },
            { id: 'C15_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica o objeto que representa uma pergunta ("quem?", "o quê?", "onde?", "quando?", "por quê?")', behaviors: [] },
            { id: 'C15_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("quem?", "o quê?", "onde?", "quando?", "por quê?")', behaviors: [] },
            { id: 'C15_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("quem?", "o quê?", "onde?", "quando?", "por quê?")', behaviors: [] },
            { id: 'C15_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("quem?", "o quê?", "onde?", "quando?", "por quê?")', behaviors: [] },
            { id: 'C15_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("quem?", "o quê?", "onde?", "quando?", "por quê?")', behaviors: [] },
            { id: 'C15_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("quem?", "o quê?", "onde?", "quando?", "por quê?")', behaviors: [] },
            { id: 'C15_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("quem?", "o quê?", "onde?", "quando?", "por quê?")', behaviors: [] },
            { id: 'C15_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("quem é?", "onde você ...?")', behaviors: [] }
        ]
    },
    {
        id: 'C16', section: 'C', title: 'C.16 Nomeia coisas ou pessoas',
        description: 'Esse indivíduo nomeia ou rotula objetos, pessoas ou ações, espontaneamente ou em resposta a uma pergunta sua (como "o que é isso?")?',
        levels: [
            { id: 'C16_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho de objeto/pessoa/lugar/atividade', behaviors: [] },
            { id: 'C16_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica o símbolo do objeto que representa o objeto/pessoa/lugar/atividade', behaviors: [] },
            { id: 'C16_conc_3', level: 5, category: 'Símbolos Concretos', label: 'Expressa ou representa (algo) por mímica extravagante e exagerada, como uma dramatização', behaviors: [] },
            { id: 'C16_conc_4', level: 5, category: 'Símbolos Concretos', label: 'Imita o som do objeto', behaviors: [] },
            { id: 'C16_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("nome do item")', behaviors: [] },
            { id: 'C16_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("nome do item")', behaviors: [] },
            { id: 'C16_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("nome do item")', behaviors: [] },
            { id: 'C16_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("nome do item")', behaviors: [] },
            { id: 'C16_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("nome do item")', behaviors: [] },
            { id: 'C16_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("nome do item")', behaviors: [] },
            { id: 'C16_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("aquele carro", "este é o carro")', behaviors: [] }
        ]
    },
    {
        id: 'C17', section: 'C', title: 'C.17 Faz comentários',
        description: 'Esse indivíduo espontaneamente (sem ser solicitado) fornece informações a você sobre as coisas na forma de comentários ("isso é bonito", "gostoso" etc.)?',
        levels: [
            { id: 'C17_conc_1', level: 5, category: 'Símbolos Concretos', label: 'Indica foto ou desenho da qualidade do objeto/ pessoa/ lugar/ atividade', behaviors: [] },
            { id: 'C17_conc_2', level: 5, category: 'Símbolos Concretos', label: 'Indica o símbolo do objeto que representa a qualidade do objeto/ pessoa/ lugar/ atividade', behaviors: [] },
            { id: 'C17_abst_1', level: 6, category: 'Símbolo Abstrato', label: 'Palavra falada ("bonito")', behaviors: [] },
            { id: 'C17_abst_2', level: 6, category: 'Símbolo Abstrato', label: 'Sinal manual ("frio")', behaviors: [] },
            { id: 'C17_abst_3', level: 6, category: 'Símbolo Abstrato', label: 'Palavra escrita ("quente")', behaviors: [] },
            { id: 'C17_abst_4', level: 6, category: 'Símbolo Abstrato', label: 'Palavra em braile ("ruim")', behaviors: [] },
            { id: 'C17_abst_5', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 3-D ("legal")', behaviors: [] },
            { id: 'C17_abst_6', level: 6, category: 'Símbolo Abstrato', label: 'Símbolo abstrato 2-D ("amarelo")', behaviors: [] },
            { id: 'C17_ling_1', level: 7, category: 'Linguagem', label: 'Combina dois ou mais símbolos ("você é legal", "frio demais")', behaviors: [] }
        ]
    }
];

export const matrixRows: MatrixRow[] = [
    { category: 'REJEITAR', label: 'C1. Recusa/Rejeita', qId: 'C1', levels: [3,4,5,6,7] },
    { category: 'REJEITAR', label: 'B1. Protesta (II)', qId: 'B1', levels: [2] },
    { category: 'REJEITAR', label: 'A1. Incômodo (I)', qId: 'A1', levels: [1] },
    
    { category: 'OBTER', label: 'C2. Pedir mais ação', qId: 'C2', levels: [3,4,5,6,7] },
    { category: 'OBTER', label: 'C3. Solicita nova ação', qId: 'C3', levels: [3,4,5,6,7] },
    { category: 'OBTER', label: 'C4. Pedir mais obj', qId: 'C4', levels: [3,4,5,6,7] },
    { category: 'OBTER', label: 'C5. Fazer escolhas', qId: 'C5', levels: [3,4,5,6,7] },
    { category: 'OBTER', label: 'C6. Pedir novo obj', qId: 'C6', levels: [3,4,5,6,7] },
    { category: 'OBTER', label: 'C7. Pedir ausentes', qId: 'C7', levels: [5,6,7] },
    { category: 'OBTER', label: 'B2. Continua ação (II)', qId: 'B2', levels: [2] },
    { category: 'OBTER', label: 'B3. Obtém mais (II)', qId: 'B3', levels: [2] },
    { category: 'OBTER', label: 'A2. Comodidade (I)', qId: 'A2', levels: [1] },

    { category: 'SOCIAL', label: 'C8. Pedir atenção', qId: 'C8', levels: [3,4,5,6,7] },
    { category: 'SOCIAL', label: 'C9. Demonstra afeto', qId: 'C9', levels: [3,4,5,6,7] },
    { category: 'SOCIAL', label: 'C10. Cumprimenta', qId: 'C10', levels: [4,5,6,7] },
    { category: 'SOCIAL', label: 'C11. Oferece', qId: 'C11', levels: [4,5,6,7] },
    { category: 'SOCIAL', label: 'C12. Direciona atenção', qId: 'C12', levels: [4,5,6,7] },
    { category: 'SOCIAL', label: 'C13. Polidez', qId: 'C13', levels: [4,5,6,7] }, 
    { category: 'SOCIAL', label: 'B4. Chama atenção (II)', qId: 'B4', levels: [2] },
    { category: 'SOCIAL', label: 'A3. Interesse (I)', qId: 'A3', levels: [1] },

    { category: 'INFO', label: 'C14. Sim/Não', qId: 'C14', levels: [4,5,6,7] },
    { category: 'INFO', label: 'C15. Faz Perguntas', qId: 'C15', levels: [4,5,6,7] },
    { category: 'INFO', label: 'C16. Nomeia', qId: 'C16', levels: [5,6,7] },
    { category: 'INFO', label: 'C17. Faz Comentários', qId: 'C17', levels: [5,6,7] }
];
