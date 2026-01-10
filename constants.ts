
import { Question, MatrixRow } from './types';

// --- CONTEXTO DE TREINAMENTO DA IA (Baseado nos PDFs fornecidos) ---

export const AI_CONTEXT_MATRIX = `
CONHECIMENTO TEÓRICO (MATRIZ DE COMUNICAÇÃO - Charity Rowland):
1. OBJETIVO: Avaliar habilidades comunicativas em pessoas com deficiências, desde estadios iniciais até linguagem.
2. 4 RAZÕES PARA COMUNICAR (Intenções):
   - REJEITAR: Expressar desconforto, protestar, rejeitar algo.
   - OBTER: Obter conforto, continuar ação, obter objeto, escolher.
   - SOCIAL: Interesse, chamar atenção, cumprimentar, afeto.
   - INFORMAÇÃO: Responder, perguntar, nomear, comentar.
3. 7 NÍVEIS DE COMPETÊNCIA:
   - Nível I (Pré-intencional): Reage a sensações, sem controle intencional. Pais interpretam.
   - Nível II (Intencional): Comportamento intencional, mas não comunicativo (ex: chora para si mesmo, não para o outro).
   - Nível III (Comunicação Não-Convencional): Gritos, gestos simples, puxar pessoas. Intencional pré-simbólico.
   - Nível IV (Comunicação Convencional): Apontar, acenar, gestos socialmente aceitos. Pré-simbólico.
   - Nível V (Símbolos Concretos): Objetos reais, fotos, gestos icônicos (ex: bater na cadeira para sentar).
   - Nível VI (Símbolos Abstratos): Fala isolada, sinais (Libras), Braille, palavras escritas. Um a um.
   - Nível VII (Linguagem): Combinação de 2 ou mais símbolos com regras gramaticais.
4. INTERPRETAÇÃO:
   - Emergente: Faz inconsistentemente ou com ajuda.
   - Dominado: Faz independentemente em vários contextos.
`;

export const AI_CONTEXT_PROC = `
CONHECIMENTO TEÓRICO (PROC - Jaime Zorzi e Simone Hage, 2004):
1. ESTRUTURA: Avalia desenvolvimento comunicativo e cognitivo infantil. Pontuação Máxima Total: 200.
2. ASPECTOS OBSERVADOS:
   A. HABILIDADES COMUNICATIVAS (Máx 70):
      - Dialógicas: Intenção, iniciação, troca de turnos.
      - Funções Comunicativas: Instrumental, Protesto, Interativa, Nomeação, Informativa, Heurística, Narrativa.
      - Meios: Não verbais (gestos/vocalizações) e Verbais (palavras a frases).
      - Contextualização: Linguagem imediata vs. não imediata (eventos passados/futuros).
   B. COMPREENSÃO VERBAL (Máx 60): De não resposta até ordens complexas (3+ ações).
   C. DESENVOLVIMENTO COGNITIVO (Máx 70):
      - Manipulação de objetos.
      - Simbolismo (faz-de-conta).
      - Organização do brinquedo.
      - Imitação (gestual e sonora).
`;

export const sectionDescriptions: Record<string, { title: string; description: string }> = {
  'A': {
    title: 'Seção A: Comportamento Pré-Intencional',
    description: 'Nesta etapa, seu filho não parece ter controle sobre os seus comportamentos, mas parece que reage principalmente às sensações. Suas reações mostram como ele se sente.'
  },
  'B': {
    title: 'Seção B: Comportamento Intencional',
    description: 'Nesta etapa, seu filho é capaz de fazer coisas intencionalmente, mas ainda não percebeu que pode comunicar coisas a você utilizando o seu comportamento. Por exemplo, pode chorar ou dar voltas pelo chão para segurar sua mamadeira quando quiser beber mais, mas não parece choramingar para que você lhe traga a mamadeira.'
  },
  'C': {
    title: 'Seção C: Comunicação Intencional',
    description: 'Nesta etapa, seu filho sabe que se fizer certas coisas, você reagirá de determinada maneira e utiliza seus comportamentos para comunicar-se intencionalmente. Existem muitas formas com as quais a criança pode se comunicar intencionalmente. Algumas implicam símbolos (a fala, língua de sinais, símbolos de imagens, símbolos tridimensionais); outras implicam gestos específicos ou movimentos corporais; outras implicam sons iniciais que ainda não são a fala. Algumas crianças com deficiências físicas graves podem usar aparelhos eletrônicos para se comunicar. Qualquer que seja o comportamento do seu filho para se comunicar o importante é que use tais comportamentos INTENCIONALMENTE, obviamente tentando comunicar algo específico.'
  }
};

export const questionsData: Question[] = [
    // --- SEÇÃO A: Nível I ---
    {
        id: 'A1', section: 'A', title: 'A.1 Expressa incômodo',
        description: 'Você pode perceber quando seu filho (a) não está cômodo (com dor, molhado, com fome, assustado)? Neste caso, o que seu filho (a) faz para que você note que não está cômodo (a)?',
        levels: [{ level: 1, label: 'I. Pré-Intencional', behaviors: ['Muda de postura (endurece o corpo, se contorce, dá voltas)', 'Movimentos de extremidades (pisoteia, agita os braços)', 'Movimentos de cabeça (afasta a cabeça)', 'Chora, grunhe, grita', 'Faz caretas'] }]
    },
    {
        id: 'A2', section: 'A', title: 'A.2 Expressa comodidade',
        description: 'Você pode perceber quando seu filho (a) está contente ou animado? Neste caso, o que seu filho (a) faz para que você note que está cômodo (a)?',
        levels: [{ level: 1, label: 'I. Pré-Intencional', behaviors: ['Muda de postura (endurece o corpo, relaxa)', 'Movimentos de extremidades (pisoteia, agita os braços)', 'Movimentos de cabeça (assente com a cabeça)', 'Gemidos, gritinhos', 'Sorriso'] }]
    },
    {
        id: 'A3', section: 'A', title: 'A.3 Expressa interesse em outras pessoas',
        description: 'Você pode perceber quando seu filho (a) se interessa por outras pessoas? Neste caso, o que seu filho (a) faz para que você note que ele está interessando em você ou em outras pessoas?',
        levels: [{ level: 1, label: 'I. Pré-Intencional', behaviors: ['Muda de postura (endurece o corpo, relaxa)', 'Movimentos de extremidades (pisoteia, agita os braços)', 'Gemidos, agitação', 'Sorriso'] }]
    },

    // --- SEÇÃO B: Nível II ---
    {
        id: 'B1', section: 'B', title: 'B.1 Protesta',
        description: 'Você pode perceber quando seu filho (a) não quer algo específico como determinada comida, um brinquedo ou um jogo que você está jogando, como fazer cócegas nele? Neste caso, o que seu filho (a) faz para que você perceba que ele não quer algo?',
        levels: [{ level: 2, label: 'II. Intencional', behaviors: ['Movimentos de cabeça (mexe a cabeça para um lado ou para trás)', 'Movimentos de braços (agita os braços, empurra, joga objetos)', 'Movimentos de perna (pisoteia o chão, pisoteia)', 'Afasta-se das pessoas ou objetos', 'Charaminga, alvoroça-se, grita', 'Franze as sobrancelhas, faz caretas'] }]
    },
    {
        id: 'B2', section: 'B', title: 'B.2 Continua uma ação',
        description: 'Você pode perceber quando seu filho (a) gostaria de continuar com uma ação ou uma atividade que você acaba de fazer com ele (como fazer cavalinho, bater palmas, brincar com um brinquedo musical)? Neste caso, o que seu filho (a) faz para que você note que ele gostaria de continuar com determinada atividade?',
        levels: [{ level: 2, label: 'II. Intencional', behaviors: ['Movimentos de cabeça (aproxima a cabeça, assente)', 'Movimentos de braços (agita os braços)', 'Movimentos das pernas (pisoteia)', 'Gemidos, gritinhos, alvoroço', 'Sorriso', 'Visual: olha as pessoas'] }]
    },
    {
        id: 'B3', section: 'B', title: 'B.3 Obtém mais de algo',
        description: 'Você pode perceber às vezes que seu filho quer mais de algo específico (como comida ou brinquedo)? Neste caso, o que seu filho (a) faz para que você note que ele quer mais de algo?',
        levels: [{ level: 2, label: 'II. Intencional', behaviors: ['Aproxima-se do objeto desejado', 'Movimentos de cabeça (aproxima a cabeça, assente)', 'Movimentos dos braços (agita os braços)', 'Movimentos das pernas (pisoteia)', 'Pega o objeto desejado', 'Gemidos, gritinhos, alvoroço', 'Sorriso', 'Visual: olha os objetos desejados'] }]
    },
    {
        id: 'B4', section: 'B', title: 'B.4 Chama a atenção',
        description: 'Seu filho faz algo que faz com que você lhe dirija atenção, mesmo quando não está tentando atrair sua atenção intencionalmente? Neste caso, quais comportamentos do seu filho fazem com que você lhe dirija a atenção?',
        levels: [{ level: 2, label: 'II. Intencional', behaviors: ['Aproxima-se da pessoa', 'Movimentos de cabeça (aproxima a cabeça, assente)', 'Movimentos dos braços (agita os braços)', 'Movimentos das pernas (pisoteia)', 'Gemidos, gritinhos, alvoroço', 'Sorriso', 'Visual: olha as pessoas'] }]
    },

    // --- SEÇÃO C: Níveis III a VII ---
    {
        id: 'C1', section: 'C', title: 'C.1 Rejeita ou nega algo',
        description: 'O seu filho (a) mostra a você de maneira intencional que não quer certas coisas ou atividades? Neste caso, o que seu filho (a) faz para rejeitar algo?',
        levels: [
            { level: 3, label: 'III. Não-Convencional', behaviors: ['Movimentos corporais completos (se contorce, dá voltas)', 'Movimentos de cabeça (afasta a cabeça ou joga-a para um lado)', 'Movimentos de braços e mãos', 'Movimentos de pernas (pisoteia, pisoteia o chão)', 'Gemidos, gritinhos, alvoroço', 'Sorriso', 'Empurra o objeto ou pessoa para afastá-la'] },
            { level: 4, label: 'IV. Convencional', behaviors: ['Dá a você um objeto não desejado', 'Nega com a cabeça', 'Vocalizações especiais'] },
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Rejeita a foto ou o desenho do objeto não desejado', 'Rejeita o símbolo dos objetos que representam o objeto não desejado'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("não", "acabado")', 'Sinal de libras ("não", "parar")', 'Palavra escrita ("não", "acabado")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("não quero", "tudo acabado", "não sair agora")'] }
        ]
    },
    {
        id: 'C2', section: 'C', title: 'C.2 Pede para continuar uma ação',
        description: 'O seu filho (a) mostra a você de maneira intencional que quer continuar a ação que você acaba de parar de fazer (como brincar de esconder e aparecer ou dar corda num brinquedo)? Neste caso, o que seu filho (a) faz para mostrar que quer continuar a ação?',
        levels: [
            { level: 3, label: 'III. Não-Convencional', behaviors: ['Movimentos corporais completos (se balança)', 'Movimentos de braços e mãos (agita os braços)', 'Movimentos de pernas (pisoteia)', 'Gemidos, gritinhos, risada', 'Sorriso', 'Olha para você', 'Segura a sua mão', 'Toca em você', 'Inclina-se na sua direção ou dá leves batidinhas'] },
            { level: 4, label: 'IV. Convencional', behaviors: ['Faz sinais para que continue', 'Mantém suas mãos levantadas ou estendidas para você (para que o segure)', 'Assente com a cabeça'] },
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Rejeita a foto ou o desenho do objeto não desejado', 'Rejeita o símbolo dos objetos que representam o objeto não desejado', 'Dramatiza a ação desejada'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("mais", "cócegas")', 'Sinal de libras ("mais", "balanço")', 'Palavra escrita ("mais", "cócegas")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("mais cócegas", "outra vez")'] }
        ]
    },
    {
        id: 'C3', section: 'C', title: 'C.3 Pede uma nova ação',
        description: 'Como seu filho (a) mostra a você de maneira intencional que quer realizar uma ação (uma que não esteja fazendo)? Neste caso, o que seu filho (a) faz para pedir (ou ordenar) a você que quer uma nova ação?',
        levels: [
            { level: 3, label: 'III. Não-Convencional', behaviors: ['Movimentos corporais completos (inclina para trás e volta todo o corpo, como se desejasse nova ação)', 'Movimentos de braços e mãos (movimenta os braços)', 'Movimentos de pernas (movimenta as pernas)', 'Sorri', 'Segura a mão', 'Olha para você'] },
            { level: 4, label: 'IV. Convencional', behaviors: ['Faz sinais para que continue', 'Mantém suas mãos levantadas ou estendidas para você (para que o segure)'] },
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Indica a foto ou o desenho da ação desejada', 'Indica o símbolo dos objetos que representam a ação desejada', 'Dramatiza a ação desejada', 'Imita o som que acompanha a atividade desejada (ex: uma canção)'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("cócegas")', 'Gesto natural ("comer")', 'Palavra escrita ("cócegas")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("faz cócegas", "quero balanço")'] }
        ]
    },
    {
        id: 'C4', section: 'C', title: 'C.4 Pede mais de um objeto',
        description: 'O seu filho (a) mostra a você de maneira intencional que quer mais de algo (como um brinquedo ou um alimento) depois de já ter tido um pouco disso? Neste caso, o que seu filho(a) faz para pedir a você mais de um objeto?',
        levels: [
            { level: 3, label: 'III. Não-Convencional', behaviors: ['Movimentos corporais completos (balança-se sobre o objeto)', 'Movimenta a cabeça na direção do objeto desejado', 'Movimentos de braços e mãos', 'Movimentos de pernas', 'Agitação, gritinhos', 'Olha o objeto desejado', 'Guia a sua mão na direção do artigo desejado ou puxa você até ele', 'Toca no objeto desejado (sem pegá-lo)', 'Inclina-se na direção de você ou dá batidinhas no objeto'] },
            { level: 4, label: 'IV. Convencional', behaviors: ['Alterna o olhar entre você e o objeto desejado', 'Indica o objeto desejado'] },
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Indica a foto ou o desenho do objeto desejado', 'Indica o símbolo do objeto que representa o objeto desejado', 'Dramatiza o objeto desejado', 'Imita o som do objeto desejado'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("cócegas")', 'Gesto natural ("comer")', 'Palavra escrita ("cócegas")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("faz cócegas", "quero balanço")'] }
        ]
    },
    {
        id: 'C5', section: 'C', title: 'C.5 Escolhe',
        description: 'O seu filho (a) escolhe de maneira intencional entre dois ou mais objetos que lhe sejam oferecidos ao mesmo tempo? (Tenha certeza de que seu filho (a) esteja consciente de todas as opções apresentadas e não indique simplesmente o primeiro objeto).',
        levels: [
            { level: 3, label: 'III. Não-Convencional', behaviors: ['Movimentos corporais completos (balança-se sobre o objeto)', 'Movimenta a cabeça na direção do objeto desejado', 'Guia a sua mão em direção ao artigo desejado', 'Inclina-se na direção do objeto desejado, toca-o ou dá batidinhas (sem pegá-lo)', 'Olha o objeto desejado'] },
            { level: 4, label: 'IV. Convencional', behaviors: ['Alterna o olhar entre você e o objeto desejado', 'Indica o objeto desejado'] },
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Indica a foto ou o desenho do objeto desejado', 'Indica o símbolo do objeto que representa o objeto desejado', 'Dramatiza o objeto desejado', 'Imita o som do objeto desejado'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("esse" ou o nome do objeto)', 'Sinal em libras ("esse" ou o nome do objeto)', 'Palavra escrita (nome do objeto)'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("esse aí", "quero o trem", "eu quero isso")'] }
        ]
    },
    {
        id: 'C6', section: 'C', title: 'C.6 Pede um objeto novo',
        description: 'O seu filho (a) mostra a você de maneira intencional que quer um novo objeto (como um brinquedo ou comida) que esteja dentro do seu alcance visual, auditivo, tátil, mas que você não lhe tenha oferecido?',
        levels: [
            { level: 3, label: 'III. Não-Convencional', behaviors: ['Movimentos corporais completos (balança-se sobre o objeto)', 'Movimenta a cabeça na direção do objeto desejado', 'Movimentos de braços/mãos', 'Movimentos de pernas', 'Agitação, gritinhos', 'Olha o objeto desejado', 'Guia a sua mão na direção do artigo desejado', 'Toca no objeto desejado (sem pegá-lo)', 'Inclina-se na sua direção ou dá batidinhas no objeto'] },
            { level: 4, label: 'IV. Convencional', behaviors: ['Alterna o olhar entre você e o objeto desejado', 'Indica o objeto desejado'] },
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Indica a foto ou o desenho do objeto desejado', 'Indica o símbolo do objeto que representa o objeto desejado', 'Dramatiza o objeto desejado', 'Imita o som do objeto desejado'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("carro")', 'Sinal de libras ("boneca")', 'Palavra escrita ("bola")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("quero carro", "quero a bola")'] }
        ]
    },
    {
        id: 'C7', section: 'C', title: 'C.7 Pede objeto que estejam ausentes',
        description: 'O seu filho (a) pede a você de maneira intencional coisas (brinquedos, comida, pessoas) que não estejam presentes no ambiente a sua volta (coisas que estejam fora do seu alcance visual, auditivo, tátil, em outro quarto, etc.)?',
        levels: [
            // Nota: Protocolo pula III e IV para C7
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Indica a foto ou o desenho do objeto/pessoa desejado (a)', 'Indica o símbolo do objeto que representa o objeto/pessoa desejado (a)', 'Dramatiza o objeto desejado', 'Imita o som do objeto desejado'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("bola")', 'Sinal de Libras ("boneca")', 'Palavra escrita ("bolacha")', 'Palavra em Braille ("jogo")', 'Símbolo 3D/2D abstrato'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("quero bola", "quero o carro")'] }
        ]
    },
    {
        id: 'C8', section: 'C', title: 'C.8 Pede atenção',
        description: 'O seu filho (a) tenta de maneira intencional atrair a sua atenção? Neste caso, como seu filho (a) chama a sua atenção?',
        levels: [
            { level: 3, label: 'III. Não-Convencional', behaviors: ['Gemidos, gritinhos', 'Movimentos de braços e pernas', 'Toca em você', 'Liga o interruptor ou "dispositivo de chamada"', 'Olha para você', 'Sorriso'] },
            { level: 4, label: 'IV. Convencional', behaviors: ['Faz sinais para você vir', 'Indica você'] },
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Indica foto ou desenho de atenção (ex: cartão "olhe")'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("olha", "mamãe")', 'Gesto natural ("olha", "papai")', 'Palavra escrita ("olha", "mamãe")', 'Sinal de Libras'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("papai", "olham, estou aqui")'] }
        ]
    },
    {
        id: 'C9', section: 'C', title: 'C.9 Demonstra afeto',
        description: 'O seu filho (a) demonstra a você ou a outras pessoas afeto de maneira intencional? Neste caso, como seu filho (a) faz para demonstrar afeto?',
        levels: [
            { level: 3, label: 'III. Não-Convencional', behaviors: ['Gemidos, gritinhos', 'Movimentos de braços e pernas', 'Toca em você', 'Olha para você', 'Sorriso'] },
            { level: 4, label: 'IV. Convencional', behaviors: ['Abraça, beija e dá palmadinhas em você'] },
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Indica a foto ou o desenho que representa conceitos como "amor"'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("amor")', 'Gesto natural ("abraço")', 'Palavra escrita ("amor")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("te amo", "quero a mamãe")'] }
        ]
    },
    {
        id: 'C10', section: 'C', title: 'C.10 Cumprimenta as pessoas',
        description: 'O seu filho (a) faz de maneira intencional algum sinal para dizer "oi" ou "tchau" quando alguém chega ou vai embora? Neste caso, como seu filho (a) cumprimenta ou se despede das pessoas?',
        levels: [
            // Pula III
            { level: 4, label: 'IV. Convencional', behaviors: ['Diz "oi" ou "tchau" com a mão'] },
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Indica a foto ou o desenho que representa cumprimentos ou despedidas ("oi" ou "tchau")'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("oi", "tchau")', 'Gesto natural ("oi", "tchau")', 'Palavra escrita ("oi", "tchau")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("tchau, mamãe", "bom dia, papai")'] }
        ]
    },
    {
        id: 'C11', section: 'C', title: 'C.11 Oferece coisas ou compartilha-as',
        description: 'O seu filho (a) oferece ou compartilha coisas com você de maneira intencional sem esperar nada em troca? Neste caso, como seu filho (a) oferece algo ou compartilha coisas com você?',
        levels: [
            // Pula III e V
            { level: 4, label: 'IV. Convencional', behaviors: ['Dá ou mostra algo para você', 'Vocalizações específicas com entonação de pergunta, como dizendo "você quer isto?"'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("seu")', 'Gesto natural ("seu")', 'Palavra escrita ("seu")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("para você", "bolacha para você")'] }
        ]
    },
    {
        id: 'C12', section: 'C', title: 'C.12 Dirige a atenção de você para algo',
        description: 'O seu filho (a) dirige de maneira intencional a atenção de você para algo que ele esteja interessado (como se dissesse, olha isso)? Neste caso, como seu filho (a) dirige sua atenção para algo?',
        levels: [
            // Pula III e V
            { level: 4, label: 'IV. Convencional', behaviors: ['Indica algo', 'Alterna o olhar entre você, uma pessoa ou o objeto desejado'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("olha", "ali")', 'Gesto natural ("olha", "ali")', 'Palavra escrita ("olha", "ali")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("por ali", "olha aquilo ali")'] }
        ]
    },
    {
        id: 'C13', section: 'C', title: 'C.13 Usa fórmulas sociais educadas',
        description: 'O seu filho (a) usa de maneira intencional normas de educação na interação social, como pedir permissão para fazer algo, indicando "por favor", "obrigada", ou "desculpe"?',
        levels: [
            // Pula III e V
            { level: 4, label: 'IV. Convencional', behaviors: ['Indica algo como perguntando, "posso ter isso?"', 'Vocalização específica (entonação como dizendo "posso?")'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("por favor")', 'Gesto natural ("obrigado")', 'Palavra escrita ("por favor")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("sim, por favor", "mamãe, posso?")'] }
        ]
    },
    {
        id: 'C14', section: 'C', title: 'C.14 Usa perguntas de sim e não',
        description: 'O seu filho (a) indica de maneira intencional "sim", "não", ou "não sei" para responder uma pergunta?',
        levels: [
            // Pula III
            { level: 4, label: 'IV. Convencional', behaviors: ['Diz "sim" com a cabeça', 'Nega com a cabeça', 'Encolhe os ombros', 'Vocalização específica indicando sim ou não'] },
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Indica a foto ou o desenho representando sim ou não'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("sim", "não")', 'Gesto natural ("sim", "não")', 'Palavra escrita ("sim", "não")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("não quero", "não sei")'] }
        ]
    },
    {
        id: 'C15', section: 'C', title: 'C.15 Faz perguntas',
        description: 'O seu filho (a) faz perguntas para você (sem que necessariamente tenha que usar palavras) esperando claramente uma resposta sua?',
        levels: [
            // Pula III e V
            { level: 4, label: 'IV. Convencional', behaviors: ['Levanta as mãos, encolhe os ombros como se estivesse perguntando', 'Vocalização específica como se estivesse perguntando', 'Alterna o olhar entre você e um objeto ou lugar'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("Quem?", "O que?", "Onde?", "Quando?", "Por quê?")', 'Sinal de Libras', 'Palavra escrita ("Quem?", "O que?", "Onde?", "Quando?", "Por quê?")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("não quero", "não sei")'] }
        ]
    },
    {
        id: 'C16', section: 'C', title: 'C.16 Dá nome para coisas ou pessoas',
        description: 'O seu filho (a) dá nome ou rótulos para objetos, pessoas ou ações, seja espontaneamente ou como resposta a uma pergunta feita por você (como "O que é isso?")? Neste caso como o seu filho (a) dá nome a algo?',
        levels: [
            // Pula III e IV
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Indica a foto ou o desenho do objeto/pessoa/lugar/atividade', 'Indica o símbolo do objeto que representa o objeto/pessoa/lugar/atividade', 'Dramatiza uma ação ou objeto', 'Imita o som de um objeto'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("nome do objeto")', 'Sinal de Libras ("nome do objeto")', 'Palavra escrita ("nome do objeto")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("não quero", "não sei")'] }
        ]
    },
    {
        id: 'C17', section: 'C', title: 'C.17 Faz comentários',
        description: 'O seu filho (a) dá a você informação sobre as coisas espontaneamente (sem perguntar) na forma de comentários ("que bonito", "quente", etc.)? Neste caso, como o seu filho (a) faz um comentário?',
        levels: [
            // Pula III e IV
            { level: 5, label: 'V. Símb. Concretos', behaviors: ['Indica a foto ou o desenho do objeto/pessoa/lugar/atividade/qualidade', 'Indica o símbolo do objeto que representa o objeto/pessoa/lugar/atividade/qualidade', 'Dramatiza uma ação ou objeto/pessoa/qualidade'] },
            { level: 6, label: 'VI. Símb. Abstratos', behaviors: ['Palavra falada ("bonito")', 'Sinal de Libras ("frio")', 'Palavra escrita ("quente")'] },
            { level: 7, label: 'VII. Linguagem', behaviors: ['Combina dois ou mais símbolos ("você, bom", "isso muito frio")'] }
        ]
    }
];

export const matrixRows: MatrixRow[] = [
    { category: 'REJEITAR', label: 'C1. Rejeita/Nega', qId: 'C1', levels: [3,4,5,6,7] },
    { category: 'REJEITAR', label: 'B1. Protesta (II)', qId: 'B1', levels: [2] },
    { category: 'REJEITAR', label: 'A1. Incômodo (I)', qId: 'A1', levels: [1] },
    
    { category: 'OBTER', label: 'C2. Pede para continuar', qId: 'C2', levels: [3,4,5,6,7] },
    { category: 'OBTER', label: 'C3. Pede ação nova', qId: 'C3', levels: [3,4,5,6,7] },
    { category: 'OBTER', label: 'C4. Pede mais obj', qId: 'C4', levels: [3,4,5,6,7] },
    { category: 'OBTER', label: 'C5. Escolhe', qId: 'C5', levels: [3,4,5,6,7] },
    { category: 'OBTER', label: 'C6. Pede obj novo', qId: 'C6', levels: [3,4,5,6,7] },
    { category: 'OBTER', label: 'C7. Pede ausente', qId: 'C7', levels: [5,6,7] },
    { category: 'OBTER', label: 'B2. Continua ação (II)', qId: 'B2', levels: [2] },
    { category: 'OBTER', label: 'B3. Obtém mais (II)', qId: 'B3', levels: [2] },
    { category: 'OBTER', label: 'A2. Comodidade (I)', qId: 'A2', levels: [1] },

    { category: 'SOCIAL', label: 'C8. Pede atenção', qId: 'C8', levels: [3,4,5,6,7] },
    { category: 'SOCIAL', label: 'C9. Mostra afeto', qId: 'C9', levels: [3,4,5,6,7] },
    { category: 'SOCIAL', label: 'C10. Cumprimenta', qId: 'C10', levels: [4,5,6,7] },
    { category: 'SOCIAL', label: 'C11. Oferece', qId: 'C11', levels: [4,6,7] },
    { category: 'SOCIAL', label: 'C12. Dirige atenção', qId: 'C12', levels: [4,6,7] },
    { category: 'SOCIAL', label: 'C13. Polidez', qId: 'C13', levels: [4,6,7] }, 
    { category: 'SOCIAL', label: 'B4. Chama atenção (II)', qId: 'B4', levels: [2] },
    { category: 'SOCIAL', label: 'A3. Interesse (I)', qId: 'A3', levels: [1] },

    { category: 'INFO', label: 'C14. Sim/Não', qId: 'C14', levels: [4,5,6,7] },
    { category: 'INFO', label: 'C15. Pergunta', qId: 'C15', levels: [4,6,7] },
    { category: 'INFO', label: 'C16. Nomeia', qId: 'C16', levels: [5,6,7] },
    { category: 'INFO', label: 'C17. Comenta', qId: 'C17', levels: [5,6,7] }
];
