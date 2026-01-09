
export interface ProcOption {
    label: string;
    value: number;
}

export interface ProcItem {
    id: string;
    text: string;
    options: ProcOption[];
}

export interface ProcSection {
    id: string;
    title: string;
    description?: string;
    maxScore: number;
    items: ProcItem[];
}

export interface ProcChecklistSection {
    id: string;
    title: string;
    items: { id: string; text: string }[];
}

export const procSections: ProcSection[] = [
    {
        id: '1a',
        title: '1a. Habilidades dialógicas ou conversacionais',
        description: 'Verificar a presença de comunicação intencional e o grau de envolvimento da criança nos intercâmbios comunicativos.',
        maxScore: 20,
        items: [
            {
                id: '1a_1',
                text: 'Intenção comunicativa',
                options: [
                    { label: 'Ausente', value: 0 },
                    { label: 'Presente raramente', value: 2 },
                    { label: 'Presente freqüentemente', value: 4 }
                ]
            },
            {
                id: '1a_2',
                text: 'Inicia a conversação/interação',
                options: [
                    { label: 'Ausente', value: 0 },
                    { label: 'Presente raramente', value: 2 },
                    { label: 'Presente freqüentemente', value: 4 }
                ]
            },
            {
                id: '1a_3',
                text: 'Responde ao interlocutor',
                options: [
                    { label: 'Ausente', value: 0 },
                    { label: 'Presente raramente', value: 2 },
                    { label: 'Presente freqüentemente', value: 4 }
                ]
            },
            {
                id: '1a_4',
                text: 'Aguarda seu turno (não se precipita, interrompendo o interlocutor)',
                options: [
                    { label: 'Ausente', value: 0 },
                    { label: 'Presente raramente', value: 2 },
                    { label: 'Presente freqüentemente', value: 4 }
                ]
            },
            {
                id: '1a_5',
                text: 'Participa ativamente da atividade dialógica (alternância de turnos)',
                options: [
                    { label: 'Ausente', value: 0 },
                    { label: 'Presente raramente', value: 2 },
                    { label: 'Presente freqüentemente', value: 4 }
                ]
            }
        ]
    },
    {
        id: '1b',
        title: '1b. Funções comunicativas',
        maxScore: 15,
        items: [
            { id: '1b_1', text: 'Instrumental - solicitação de objetos, ações', options: [{ label: 'Ausente', value: 0 }, { label: 'Raramente', value: 1 }, { label: 'Freqüentemente', value: 2 }] },
            { id: '1b_2', text: 'Protesto – interrupção com fala ou ação', options: [{ label: 'Ausente', value: 0 }, { label: 'Raramente', value: 1 }, { label: 'Freqüentemente', value: 2 }] },
            { id: '1b_3', text: 'Interativa – uso de expressões sociais ("oi", "tchau")', options: [{ label: 'Ausente', value: 0 }, { label: 'Raramente', value: 1 }, { label: 'Freqüentemente', value: 2 }] },
            { id: '1b_4', text: 'Nomeação – nomeação espontânea de objetos/pessoas', options: [{ label: 'Ausente', value: 0 }, { label: 'Raramente', value: 1 }, { label: 'Freqüentemente', value: 2 }] },
            { id: '1b_5', text: 'Informativa – comentários, informações espontâneas', options: [{ label: 'Ausente', value: 0 }, { label: 'Raramente', value: 1 }, { label: 'Freqüentemente', value: 2 }] },
            { id: '1b_6', text: 'Heurística – solicitação de informação ou permissão', options: [{ label: 'Ausente', value: 0 }, { label: 'Raramente', value: 1 }, { label: 'Freqüentemente', value: 2 }] },
            { id: '1b_7', text: 'Narrativa – presença de turnos comunicativos', options: [{ label: 'Ausente', value: 0 }, { label: 'Raramente', value: 1 }, { label: 'Freqüentemente', value: 3 }] }
        ]
    },
    {
        id: '1c',
        title: '1c. Meios de comunicação',
        description: 'Verificar se os meios atingiram níveis de simbolização.',
        maxScore: 20,
        items: [
            {
                id: '1c_vocal',
                text: 'Meios não verbais (vocalizações)',
                options: [
                    { label: 'Ausência de vocalizações', value: 0 },
                    { label: 'Somente vocalizações não articuladas', value: 1 },
                    { label: 'Vocalizações não articuladas e articuladas com entonação (jargão)', value: 2 }
                ]
            },
            {
                id: '1c_gestos',
                text: 'Meios não verbais (gestos)',
                options: [
                    { label: 'Gestos não simbólicos elementares (pegar na mão, puxar)', value: 1 },
                    { label: 'Gestos não simbólicos convencionais (apontar, negar)', value: 2 },
                    { label: 'Gestos simbólicos (representam ações/objetos)', value: 5 }
                ]
            },
            {
                id: '1c_verbal',
                text: 'Meios verbais',
                options: [
                    { label: 'Palavras isoladas', value: 7 },
                    { label: 'Enunciados de 2 palavras', value: 9 },
                    { label: 'Frases com 3 ou mais palavras, telegráficas ou não', value: 11 },
                    { label: 'Relato de experiências imediatas (5/6 palavras)', value: 13 },
                    { label: 'Relato de experiências não imediatas', value: 15 }
                ]
            }
        ]
    },
    {
        id: '1d',
        title: '1d. Níveis de contextualização de linguagem',
        maxScore: 15,
        items: [
            {
                id: '1d_1',
                text: 'Nível de contextualização',
                options: [
                    { label: 'Linguagem refere-se somente à situação imediata e concreta', value: 5 },
                    { label: 'Descreve ação realizada e refere ao passado/futuro imediato', value: 10 },
                    { label: 'Vai além da situação imediata, refere-se a eventos distantes', value: 15 }
                ]
            }
        ]
    },
    {
        id: '2',
        title: '2. Compreensão Verbal',
        maxScore: 60,
        items: [
            {
                id: '2_1',
                text: 'Nível de Compreensão',
                options: [
                    { label: 'Não apresenta respostas à linguagem', value: 0 },
                    { label: 'Responde não sistematicamente', value: 10 },
                    { label: 'Atende quando é chamada', value: 20 },
                    { label: 'Compreende ordens situacionais com ação + gestos', value: 30 },
                    { label: 'Compreende ordens situacionais sem gestos', value: 40 },
                    { label: 'Compreende duas ordens não relacionadas', value: 50 },
                    { label: 'Compreende ordens com 3 ou mais ações', value: 60 }
                ]
            }
        ]
    },
    {
        id: '3a',
        title: '3a. Formas de manipulação dos objetos',
        maxScore: 10,
        items: [
            {
                id: '3a_1',
                text: 'Manipulação',
                options: [
                    { label: 'Não se interessa / Desiste com obstáculo', value: 0 },
                    { label: 'Explora por meio de poucas ações / rápido / repetitivo (um a um)', value: 1 },
                    { label: 'Persiste com obstáculo / Atua repetitivo sobre dois objetos', value: 2 },
                    { label: 'Explora um a um de modo diversificado', value: 5 },
                    { label: 'Atua, de maneira diversificada, sobre dois ou mais objetos', value: 10 }
                ]
            }
        ]
    },
    {
        id: '3b',
        title: '3b. Nível de desenvolvimento do simbolismo',
        maxScore: 20,
        items: [
            {
                id: '3b_1',
                text: 'Simbolismo',
                options: [
                    { label: 'Não apresenta condutas simbólicas, somente sensório-motoras', value: 0 },
                    { label: 'Faz uso convencional do objeto', value: 1 },
                    { label: 'Apresenta esquemas simbólicos (no próprio corpo)', value: 2 },
                    { label: 'Usa bonecos ou outros parceiros no brinquedo simbólico', value: 3 },
                    { label: 'Organiza ações simbólicas em uma seqüência', value: 4 },
                    { label: 'Cria símbolos (objetos substitutos/gestos) / Usa linguagem para relatar brinquedo', value: 5 }
                ]
            }
        ]
    },
    {
        id: '3c',
        title: '3c. Nível de organização do brinquedo',
        maxScore: 20,
        items: [
            {
                id: '3c_1',
                text: 'Organização',
                options: [
                    { label: 'Manipula os objetos sem uma organização', value: 0 },
                    { label: 'Organiza miniaturas em peq. grupos / Peq. agrupamentos de 2 ou 3', value: 1 },
                    { label: 'Enfileira os objetos', value: 2 },
                    { label: 'Organiza distribuindo (configura cômodos)', value: 3 },
                    { label: 'Agrupa objetos em categorias / Tentativa e erro', value: 4 },
                    { label: 'Seria os objetos de acordo com critério', value: 5 }
                ]
            }
        ]
    },
    {
        id: '3d',
        title: '3d. Imitação',
        maxScore: 20,
        items: [
            {
                id: '3d_gestual',
                text: 'Imitação Gestual',
                options: [
                    { label: 'Não reage às solicitações', value: 0 },
                    { label: 'Imitação de gestos visíveis no próprio corpo', value: 1 },
                    { label: 'Imitação de gestos não visíveis no próprio corpo', value: 3 }
                ]
            },
            {
                id: '3d_sonora',
                text: 'Imitação Sonora',
                options: [
                    { label: 'Não reage às solicitações', value: 0 },
                    { label: 'Imitação de sílabas', value: 2 },
                    { label: 'Imitação de onomatopéias', value: 3 },
                    { label: 'Imitação de palavras', value: 5 },
                    { label: 'Imitação de frases', value: 6 }
                ]
            }
        ]
    }
];

export const procChecklistSections: ProcChecklistSection[] = [
    {
        id: 'geral_comunicacao',
        title: 'Características gerais das habilidades comunicativas',
        items: [
            { id: 'gc_1', text: 'Não apresenta comunicação intencional' },
            { id: 'gc_2', text: 'Comunicação intencional primária, meios não simbólicos, restrita' },
            { id: 'gc_3', text: 'Comunicação plurifuncional, meios não simbólicos e não verbais' },
            { id: 'gc_4', text: 'Comunicação plurifuncional, meios simbólicos e não verbais' },
            { id: 'gc_5', text: 'Comunicação primária, restrita, meios verbais' },
            { id: 'gc_6', text: 'Comunicação plurifuncional, meios verbais, contexto imediato' },
            { id: 'gc_7', text: 'Comunicação plurifuncional, meios verbais, não ligados ao contexto imediato' }
        ]
    },
    {
        id: 'geral_linguistica',
        title: 'Características gerais da organização lingüística',
        items: [
            { id: 'gl_1', text: 'Não apresenta lingüística' },
            { id: 'gl_2', text: 'Produção de palavras isoladas' },
            { id: 'gl_3', text: 'Produção de enunciados (duas ou mais palavras)' },
            { id: 'gl_4', text: 'Produção de discurso (frases encadeadas)' }
        ]
    },
    {
        id: 'geral_compreensao',
        title: 'Características gerais da compreensão da linguagem oral',
        items: [
            { id: 'gco_1', text: 'Não demonstra compreensão' },
            { id: 'gco_2', text: 'Responde sistematicamente' },
            { id: 'gco_3', text: 'Compreende ordens até duas ações, contexto imediato' },
            { id: 'gco_4', text: 'Compreende ordens com 3 ou mais ações, contexto imediato' }
        ]
    }
];
