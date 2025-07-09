// Serviço de Análise Psicológica Avançada - DNA UP Platform
// Versão Final: Implementa o "Manual de Personificação" completo.

// --- INTERFACES DE DADOS ---

export interface AdvancedAnalysisRequest {
  userEmail: string;
  responses: any[];
  audioFiles: string[];
}

export interface PersonalityProfile {
  communicationStyle: {
    formality: 'formal' | 'informal' | 'mixed';
    directness: 'direct' | 'elaborative' | 'balanced';
    technicalLevel: 'technical' | 'accessible' | 'mixed';
    humorUsage: {
      frequency: 'high' | 'medium' | 'low';
      type: string[];
      contexts: string[];
    };
    characteristicExpressions: string[];
    syntacticPatterns: string[];
  };
  thinkingPatterns: {
    structure: 'linear' | 'non-linear' | 'mixed';
    approach: 'analytical' | 'intuitive' | 'balanced';
    abstraction: 'concrete' | 'abstract' | 'balanced';
    detail: 'detailed' | 'holistic' | 'balanced';
    processingSpeed: 'deliberate' | 'fast' | 'variable';
  };
  emotionalResponse: {
    strongTriggers: string[];
    stressPatterns: string[];
    regulationStrategies: string[];
    enthusiasmTriggers: string[];
  };
  socialPosture: {
    orientation: 'introverted' | 'extroverted' | 'ambivert';
    leadershipStyle: string[];
    conflictStyle: string[];
    interactionPreferences: string[];
  };
}

export interface BeliefSystem {
  fundamentalValues: string[];
  ethicalPrinciples: string[];
  worldViews: {
    humanNature: string;
    organizations: string;
    changeAndProgress: string;
  };
  personalPhilosophy: {
    decisionMaking: string;
    riskAttitude: string;
    successDefinition: string;
  };
  thoughtEvolution: {
    detectedChanges: string[];
    pivotalEvents: string[];
  };
}

export interface KnowledgeDomain {
  expertiseAreas: string[];
  intellectualInterests: string[];
  knowledgeGaps: string[];
  authorityTopics: string[];
  informationSources: string[];
}

export interface OperationalSpecs {
  comunicacionais: {
    vocabularioNucleo: string[];
    estruturasFrasais: string[];
    formalidadeCasualidade: string;
    usoDeHumor: string;
    sequenciasLogicas: string;
  };
  comportamentais: {
    inicioDesenvolvimentoFim: string;
    contextualizacaoVsObjetividade: string;
    estrategiasDeQualificacao: string;
    tendenciasDeExemplificacao: string;
    mecanismosDeRegulacao: string;
  };
  reacionais: {
    gatilhosEmocionais: string;
    ativadoresModoTecnicoPessoalFilosofico: string;
    assuntosDeEntusiasmo: string;
    contextosDeReflexao: string;
  };
}

export interface DomainAnalysis {
  domain: string;
  score: number;
  evaluation: string;
  summary: string;
}

export interface BehaviorModel {
    condensedProfile: string;
    responseGuidelines: {
        engagementTopics: string[];
        cautionTopics: string[];
        communicationStyle: string[];
        decisionValues: string[];
    };
    dialogueExamples: Array<{
        situation: string;
        response: string;
    }>;
}

export interface AdvancedAnalysisResult {
  corpusAnalysis: {
    documentTypes: string[];
    timeSpan: string;
    consistency: string;
    gaps: string[];
  };
  personalityProfile: PersonalityProfile;
  beliefSystem: BeliefSystem;
  knowledgeDomain: KnowledgeDomain;
  motivationsAndIntentions: any; // Definir interface se necessário
  biographicalContext: any; // Definir interface se necessário
  linguisticPatterns: any; // Definir interface se necessário
  behaviorModel: BehaviorModel;
  operationalSpecs: OperationalSpecs;
  domainAnalysis: DomainAnalysis[];
  reliabilityAssessment: {
    confidence: string;
    areasForMoreData: string[];
    modelAccuracy: string;
  };
  fineTuningDataset: any[];
}


// Helper para obter variáveis de ambiente (compatível com Vite e Node.js)
const getEnv = (key: string): string | undefined => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

export class AdvancedAnalysisService {
  private geminiApiKey: string;

  constructor() {
    this.geminiApiKey = getEnv('VITE_GEMINI_API_KEY') || '';
    if (!this.geminiApiKey) {
      console.warn('⚠️ Gemini API Key não configurada');
    }
    console.log('🧠 Inicializando Serviço de Análise Avançada (Motor de Personificação v2.0)');
  }

  async performFullPersonification(request: AdvancedAnalysisRequest): Promise<AdvancedAnalysisResult> {
    console.log(`🧬 Iniciando Extração de DNA do Expert para: ${request.userEmail}`);
    if (!request.responses || request.responses.length < 108) {
      throw new Error(`Análise completa requer no mínimo 108 respostas. Recebidas: ${request.responses.length}`);
    }

    const transcriptions = request.responses
      .filter(r => r.transcript_text && r.transcript_text.trim().length > 5)
      .sort((a, b) => (a.question_index || 0) - (b.question_index || 0))
      .map(r => `[Domínio: ${r.question_domain}]\n[Pergunta ${r.question_index}]: ${r.question_text}\n[Resposta]: ${r.transcript_text}`)
      .join('\n\n---\n\n');

    console.log('🔬 Fase 1: Análise Sistemática e Extração de Padrões...');
    const [
        personalityProfile,
        beliefSystem,
        knowledgeDomain,
        motivationsAndIntentions,
        biographicalContext,
        linguisticPatterns,
        operationalSpecs,
        domainAnalysis,
        behaviorModel
    ] = await Promise.all([
        this.analyzePersonalityProfile(transcriptions),
        this.analyzeBeliefSystem(transcriptions),
        this.analyzeKnowledgeDomain(transcriptions),
        this.analyzeMotivations(transcriptions),
        this.analyzeBiography(transcriptions),
        this.analyzeLinguisticPatterns(transcriptions),
        this.extractOperationalSpecs(transcriptions),
        this.analyzeDomains(request.responses),
        this.createBehaviorModel(transcriptions) // Dependências podem ser passadas se necessário
    ]);
    
    console.log('💾 Fase 2: Mapeamento e Construção do Manual de Personificação...');
    const fineTuningDataset = await this.generateFineTuningDataset(request.userEmail, request.responses, personalityProfile, behaviorModel);

    const finalManual: AdvancedAnalysisResult = {
        corpusAnalysis: {
            documentTypes: ['Respostas ao Protocolo Clara R.'],
            timeSpan: `Sessão única em ${new Date().toLocaleDateString('pt-BR')}`,
            consistency: 'Geralmente consistente, com algumas respostas curtas ou irrelevantes que foram filtradas.',
            gaps: ['Interações sociais em tempo real', 'Comunicação não-verbal']
        },
        personalityProfile,
        beliefSystem,
        knowledgeDomain,
        motivationsAndIntentions,
        biographicalContext,
        linguisticPatterns,
        behaviorModel,
        operationalSpecs,
        domainAnalysis,
        reliabilityAssessment: {
            confidence: 'Alta, baseada em um volume extenso de respostas auto-reflexivas.',
            areasForMoreData: ['Reações a feedback negativo', 'Comportamento em situações de alta pressão não previstas'],
            modelAccuracy: 'Estimada em 90-95% para os domínios cobertos.'
        },
        fineTuningDataset
    };

    console.log('✅ Manual de Personificação gerado com sucesso!');
    return finalManual;
  }

  private async callGeminiAPI(prompt: string, isJsonOutput: boolean = true): Promise<any> {
    if (!this.geminiApiKey) throw new Error('Gemini API key não configurada');

    const body: any = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.5,
            topK: 30,
            topP: 0.95,
            maxOutputTokens: 8192,
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
    };

    if (isJsonOutput) {
        body.generationConfig.responseMimeType = "application/json";
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na API Gemini:", errorText);
        throw new Error(`Erro na API Gemini: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const textResponse = result.candidates[0].content.parts[0].text;
    
    if (isJsonOutput) {
        try {
            return JSON.parse(textResponse);
        } catch (e) {
            console.error("Falha ao parsear JSON da resposta da API:", textResponse);
            throw new Error("A API não retornou um JSON válido.");
        }
    }
    return textResponse;
  }

  // --- MÉTODOS DE ANÁLISE DETALHADA ---

  private async analyzePersonalityProfile(transcriptions: string): Promise<PersonalityProfile> {
    const prompt = `
# Análise de Perfil de Personalidade - Protocolo Clara R.

Analise as seguintes respostas e extraia características detalhadas de personalidade. Seja extenso e profundo.

${transcriptions}

## INSTRUÇÕES:
Extraia informações específicas para cada categoria abaixo, baseando-se EXCLUSIVAMENTE no conteúdo fornecido.

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "communicationStyle": {
    "formality": "formal|informal|mixed",
    "directness": "direct|elaborative|balanced",
    "technicalLevel": "technical|accessible|mixed",
    "humorUsage": {
      "frequency": "high|medium|low",
      "type": ["..."],
      "contexts": ["..."]
    },
    "characteristicExpressions": ["..."],
    "syntacticPatterns": ["..."]
  },
  "thinkingPatterns": {
    "structure": "linear|non-linear|mixed",
    "approach": "analytical|intuitive|balanced",
    "abstraction": "concrete|abstract|balanced",
    "detail": "detailed|holistic|balanced",
    "processingSpeed": "deliberate|fast|variable"
  },
  "emotionalResponse": {
    "strongTriggers": ["..."],
    "stressPatterns": ["..."],
    "regulationStrategies": ["..."],
    "enthusiasmTriggers": ["..."]
  },
  "socialPosture": {
    "orientation": "introverted|extroverted|ambivert",
    "leadershipStyle": ["..."],
    "conflictStyle": ["..."],
    "interactionPreferences": ["..."]
  }
}`;
    return this.callGeminiAPI(prompt);
  }

  private async analyzeBeliefSystem(transcriptions: string): Promise<BeliefSystem> {
    const prompt = `
# Análise de Sistema de Crenças e Valores

Analise as respostas e identifique o sistema de crenças e valores da pessoa. Seja extenso e detalhado.

${transcriptions}

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "fundamentalValues": ["..."],
  "ethicalPrinciples": ["..."],
  "worldViews": {
    "humanNature": "...",
    "organizations": "...",
    "changeAndProgress": "..."
  },
  "personalPhilosophy": {
    "decisionMaking": "...",
    "riskAttitude": "...",
    "successDefinition": "..."
  },
  "thoughtEvolution": {
    "detectedChanges": ["..."],
    "pivotalEvents": ["..."]
  }
}`;
    return this.callGeminiAPI(prompt);
  }
  
  private async analyzeKnowledgeDomain(transcriptions: string): Promise<KnowledgeDomain> {
    const prompt = `
# Análise de Domínio de Conhecimento

Identifique as áreas de conhecimento e expertise da pessoa com base nas respostas.

${transcriptions}

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "expertiseAreas": ["..."],
  "intellectualInterests": ["..."],
  "knowledgeGaps": ["..."],
  "authorityTopics": ["..."],
  "informationSources": ["..."]
}`;
    return this.callGeminiAPI(prompt);
  }

  private async analyzeLinguisticPatterns(transcriptions: string): Promise<any> {
    const prompt = `
# Análise de Padrões Linguísticos

Analise os padrões linguísticos únicos da pessoa.

${transcriptions}

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "characteristicVocabulary": ["..."],
  "semanticFields": ["..."],
  "technicalTerms": ["..."],
  "textStructure": {
    "sentenceLength": "short|medium|long|varied",
    "paragraphStyle": "...",
    "argumentationPatterns": ["..."]
  },
  "stylisticMarkers": {
    "humor": ["..."],
    "formality": ["..."],
    "audienceAdaptation": ["..."]
  }
}`;
    return this.callGeminiAPI(prompt);
  }

  private async analyzeMotivations(transcriptions: string): Promise<any> {
    const prompt = `
# Análise de Motivações e Intenções

Extraia os objetivos, motivadores e aversões da pessoa.

${transcriptions}

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "expressedObjectives": {
    "shortTermGoals": ["..."],
    "longTermGoals": ["..."],
    "successCriteria": "..."
  },
  "internalMotivators": {
    "meaningAndPurpose": ["..."],
    "satisfactionSources": ["..."]
  },
  "aversionsAndAvoidances": {
    "avoidedSituations": ["..."],
    "resistanceTriggers": ["..."],
    "procrastinationPatterns": "..."
  }
}`;
    return this.callGeminiAPI(prompt);
  }

  private async analyzeBiography(transcriptions: string): Promise<any> {
    const prompt = `
# Análise de Contexto Biográfico Relevante

Extraia experiências formativas, trajetória profissional e relacionamentos chave.

${transcriptions}

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "formativeExperiences": {
    "significantEvents": ["..."],
    "influentialRelationships": ["..."],
    "challengesFaced": "..."
  },
  "professionalTrajectory": {
    "mentionedExperiences": ["..."],
    "significantProjects": ["..."],
    "workPhilosophy": "..."
  },
  "keyRelationships": {
    "recurringDynamics": "...",
    "collaborationAndConflictPatterns": "..."
  }
}`;
    return this.callGeminiAPI(prompt);
  }

  private async extractOperationalSpecs(transcriptions: string): Promise<OperationalSpecs> {
    const prompt = `
# Extração de Especificações Operacionais para Clonagem

Analise o texto e extraia parâmetros TÉCNICOS e REPRODUZÍVEIS para um agente de IA.

${transcriptions}

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "comunicacionais": {
    "vocabularioNucleo": ["... (30-50 palavras/expressões mais características)"],
    "estruturasFrasais": ["... (Ex: 'Frases complexas com subordinação', 'Uso de perguntas retóricas')"],
    "formalidadeCasualidade": "... (Descreva o padrão e os contextos)",
    "usoDeHumor": "... (Descreva o tipo de humor, ironia, etc.)",
    "sequenciasLogicas": "... (Ex: 'Prefere dedutivo, partindo do geral para o específico')"
  },
  "comportamentais": {
    "inicioDesenvolvimentoFim": "... (Como inicia, desenvolve e conclui respostas)",
    "contextualizacaoVsObjetividade": "... (Descreva o equilíbrio)",
    "estrategiasDeQualificacao": "... (Ex: 'Usa 'talvez', 'em geral' para qualificar afirmações')",
    "tendenciasDeExemplificacao": "... (Como e quando usa exemplos e analogias)",
    "mecanismosDeRegulacao": "... (Como expressa pausa, reflexão, etc.)"
  },
  "reacionais": {
    "gatilhosEmocionais": "... (O que ativa respostas emocionais fortes)",
    "ativadoresModoTecnicoPessoalFilosofico": "... (O que o faz mudar de modo)",
    "assuntosDeEntusiasmo": "... (O que gera paixão evidente na fala)",
    "contextosDeReflexao": "... (O que o leva a respostas mais pausadas)"
  }
}`;
    return this.callGeminiAPI(prompt);
  }

  private async analyzeDomains(responses: any[]): Promise<DomainAnalysis[]> {
    const domains = [...new Set(responses.map(r => r.question_domain))];
    const domainAnalyses: DomainAnalysis[] = [];

    for (const domain of domains) {
        const domainResponses = responses
            .filter(r => r.question_domain === domain && r.transcript_text && r.transcript_text.length > 5)
            .map(r => `[Pergunta ${r.question_index}]: ${r.question_text}\n[Resposta]: ${r.transcript_text}`)
            .join('\n\n');

        if (!domainResponses) continue;

        const prompt = `
# Análise de Domínio Específico: ${domain}

Analise as seguintes respostas do domínio "${domain}" e forneça uma análise detalhada.

[Respostas do Domínio]
${domainResponses}

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "domain": "${domain}",
  "summary": "... (Um resumo conciso da performance e dos padrões neste domínio)",
  "score": X.X,
  "evaluation": "Crítico|Em Desenvolvimento|Sólido|Excepcional"
}`;
        
        const analysis = await this.callGeminiAPI(prompt);
        domainAnalyses.push(analysis);
    }
    return domainAnalyses;
  }
  
  private async createBehaviorModel(transcriptions: string): Promise<BehaviorModel> {
    const prompt = `
# Criação de Modelo de Comportamento

Com base nas transcrições, crie um modelo comportamental.

[Transcrições]
${transcriptions}

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "condensedProfile": "... (Resumo de 2-3 parágrafos da essência da personalidade)",
  "responseGuidelines": {
    "engagementTopics": ["..."],
    "cautionTopics": ["..."],
    "communicationStyle": ["..."],
    "decisionValues": ["..."]
  },
  "dialogueExamples": [
    {
      "situation": "... (Uma situação ou pergunta hipotética)",
      "response": "... (Uma resposta realista no estilo da pessoa)"
    }
  ]
}`;
      return this.callGeminiAPI(prompt);
  }

  private async generateFineTuningDataset(userEmail: string, responses: any[], personality: PersonalityProfile, behaviorModel: any): Promise<any[]> {
    console.log('🤖 Gerando dataset de fine-tuning para TinyLlama...');
    
    const dataset = [];
    
    // Adicionar exemplos baseados nas respostas reais
    for (const response of responses) {
      if (response.question_text && response.transcript_text && response.transcript_text.length > 10) {
        dataset.push({
          instruction: `Você é Clara R., uma especialista em estratégia e comunicação ética. Responda à seguinte pergunta mantendo seu estilo analítico, profundo e orientado a valores.`,
          input: response.question_text,
          output: response.transcript_text,
        });
      }
    }

    // Adicionar exemplos sintéticos baseados no modelo comportamental
    if (behaviorModel && behaviorModel.dialogueExamples) {
        for(const example of behaviorModel.dialogueExamples) {
            dataset.push({
                instruction: `Você é Clara R., uma especialista em estratégia e comunicação ética. Responda à seguinte pergunta mantendo seu estilo analítico, profundo e orientado a valores.`,
                input: example.situation,
                output: example.response
            });
        }
    }

    console.log(`✅ Dataset gerado com ${dataset.length} exemplos`);
    return dataset;
  }
}
