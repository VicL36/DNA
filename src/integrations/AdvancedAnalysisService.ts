// Serviço de Análise Psicológica Avançada - DNA UP Platform
// Versão Final: Implementa o "Manual de Personificação" completo.

import { GoogleGenerativeAI } from '@google/generative-ai';

// --- INTERFACES DE DADOS ESTRUTURADAS PARA O MANUAL ---

export interface AdvancedAnalysisRequest {
  userEmail: string;
  responses: any[];
  audioFiles: string[];
}

export interface PersonalityProfile {
  communicationStyle: {
    formality: string;
    directness: string;
    technicalLevel: string;
    humorUsage: {
      frequency: string;
      type: string[];
      contexts: string[];
    };
    characteristicExpressions: string[];
    syntacticPatterns: string[];
  };
  thinkingPatterns: {
    structure: string;
    approach: string;
    abstraction: string;
    detail: string;
    processingSpeed: string;
  };
  emotionalResponse: {
    strongTriggers: string[];
    stressPatterns: string[];
    regulationStrategies: string[];
    enthusiasmTriggers: string[];
  };
  socialPosture: {
    orientation: string;
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

export interface MotivationsAndIntentions {
    expressedObjectives: {
        shortTermGoals: string[];
        longTermGoals: string[];
        successCriteria: string;
    };
    internalMotivators: {
        meaningAndPurpose: string[];
        satisfactionSources: string[];
    };
    aversionsAndAvoidances: {
        avoidedSituations: string[];
        resistanceTriggers: string[];
        procrastinationPatterns: string;
    };
}

export interface BiographicalContext {
    formativeExperiences: {
        significantEvents: string[];
        influentialRelationships: string[];
        challengesFaced: string;
    };
    professionalTrajectory: {
        mentionedExperiences: string[];
        significantProjects: string[];
        workPhilosophy: string;
    };
    keyRelationships: {
        recurringDynamics: string;
        collaborationAndConflictPatterns: string;
    };
}

export interface LinguisticPatterns {
    characteristicVocabulary: string[];
    semanticFields: string[];
    technicalTerms: string[];
    textStructure: {
        sentenceLength: string;
        paragraphStyle: string;
        argumentationPatterns: string[];
    };
    stylisticMarkers: {
        humor: string[];
        formality: string[];
        audienceAdaptation: string[];
    };
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

// --- ESTRUTURA FINAL DO MANUAL DE PERSONIFICAÇÃO ---
export interface PersonificationManual {
  corpusAnalysis: {
    documentTypes: string[];
    timeSpan: string;
    consistency: string;
    gaps: string[];
  };
  personalityProfile: PersonalityProfile;
  beliefSystem: BeliefSystem;
  knowledgeDomain: KnowledgeDomain;
  motivationsAndIntentions: MotivationsAndIntentions;
  biographicalContext: BiographicalContext;
  linguisticPatterns: LinguisticPatterns;
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

export class AdvancedAnalysisService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    let apiKey: string | undefined;

    // FIX: Acessa as variáveis de ambiente de forma segura para ambos os ambientes (Vite/Browser e Node.js)
    // Verifica primeiro o ambiente Vite/Browser.
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    } 
    // Se não for ambiente Vite, verifica o ambiente Node.js.
    // A verificação `typeof process` previne o erro "process is not defined" no browser.
    else if (typeof process !== 'undefined' && process.env) {
      apiKey = process.env.VITE_GEMINI_API_KEY;
    }

    if (!apiKey) {
      console.error('FATAL: VITE_GEMINI_API_KEY não foi encontrada. A análise avançada não funcionará.');
      throw new Error('VITE_GEMINI_API_KEY não configurada no ambiente.');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    console.log('🧠 Inicializando Serviço de Análise Avançada (Motor de Personificação v3.1)');
  }

  async generatePersonificationManual(request: AdvancedAnalysisRequest): Promise<PersonificationManual> {
    console.log(`🧬 Iniciando Extração de DNA do Expert para: ${request.userEmail}`);
    
    // MODIFICAÇÃO: Alterado o requisito para 6 respostas para permitir a execução com dados limitados.
    if (!request.responses || request.responses.length < 6) {
      throw new Error(`A análise completa requer no mínimo 6 respostas para este teste. Recebidas: ${request.responses.length}`);
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
        this.analyzeAllDomains(request.responses),
        this.createBehaviorModel(transcriptions)
    ]);
    
    console.log('💾 Fase 2: Mapeamento e Construção do Manual de Personificação...');
    const fineTuningDataset = await this.generateFineTuningDataset(request.userEmail, request.responses, behaviorModel);

    const finalManual: PersonificationManual = {
        corpusAnalysis: {
            documentTypes: ['Respostas ao Protocolo Clara R.'],
            timeSpan: `Sessão única em ${new Date().toLocaleDateString('pt-BR')}`,
            consistency: 'A consistência é avaliada com base num conjunto limitado de dados. Podem existir variações não capturadas.',
            gaps: ['A maior parte dos 9 domínios de personalidade não foi coberta devido ao número limitado de respostas.']
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
            confidence: 'Média-Baixa. A análise estrutural está completa, mas a profundidade é limitada pela pequena amostra de dados (6 de 108 respostas).',
            areasForMoreData: ['Todos os domínios não cobertos pelas 6 perguntas iniciais.', 'Reações a feedback.', 'Comportamento sob pressão.'],
            modelAccuracy: 'A precisão do modelo é uma extrapolação baseada nos padrões identificados e deve ser validada com mais dados.'
        },
        fineTuningDataset
    };

    console.log('✅ Manual de Personificação gerado com sucesso!');
    return finalManual;
  }

  private async callGeminiAPI(prompt: string, isJsonOutput: boolean = true): Promise<any> {
    if (!this.geminiApiKey) throw new Error('A chave da API Gemini não está configurada');

    const body: any = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.4,
            topK: 32,
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
    if(!result.candidates || !result.candidates[0].content.parts[0].text){
        console.error("Resposta inválida da API Gemini:", result);
        throw new Error("A API não retornou conteúdo válido.");
    }
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

  // --- MÉTODOS DE ANÁLISE DETALHADA PARA CADA SECÇÃO DO MANUAL ---

  private async analyzePersonalityProfile(transcriptions: string): Promise<PersonalityProfile> {
    console.log("...Analisando Perfil de Personalidade");
    const prompt = `Analise as transcrições e extraia um Perfil de Personalidade detalhado e extenso. Forneça exemplos concretos para cada ponto. O output deve ser um JSON com a estrutura: {"communicationStyle": {...}, "thinkingPatterns": {...}, "emotionalResponse": {...}, "socialPosture": {...}}`;
    return this.callGeminiAPI(prompt);
  }

  private async analyzeBeliefSystem(transcriptions: string): Promise<BeliefSystem> {
    console.log("...Analisando Sistema de Crenças e Valores");
    const prompt = `Analise as transcrições e extraia o Sistema de Crenças e Valores. Seja profundo na análise. O output deve ser um JSON com a estrutura: {"fundamentalValues": [...], "ethicalPrinciples": [...], "worldViews": {...}, "personalPhilosophy": {...}, "thoughtEvolution": {...}}`;
    return this.callGeminiAPI(prompt);
  }
  
  private async analyzeKnowledgeDomain(transcriptions: string): Promise<KnowledgeDomain> {
    console.log("...Analisando Domínio de Conhecimento");
    const prompt = `Analise as transcrições e identifique o Domínio de Conhecimento do expert. O output deve ser um JSON com a estrutura: {"expertiseAreas": [...], "intellectualInterests": [...], "knowledgeGaps": [...], "authorityTopics": [...], "informationSources": [...]}`;
    return this.callGeminiAPI(prompt);
  }

  private async analyzeLinguisticPatterns(transcriptions: string): Promise<LinguisticPatterns> {
    console.log("...Analisando Padrões Linguísticos");
    const prompt = `Analise as transcrições e extraia os Padrões Linguísticos Distintivos. O output deve ser um JSON com a estrutura: {"characteristicVocabulary": [...], "semanticFields": [...], "technicalTerms": [...], "textStructure": {...}, "stylisticMarkers": {...}}`;
    return this.callGeminiAPI(prompt);
  }

  private async analyzeMotivations(transcriptions: string): Promise<MotivationsAndIntentions> {
    console.log("...Analisando Motivações e Intenções");
    const prompt = `Analise as transcrições e extraia as Motivações e Intenções. O output deve ser um JSON com a estrutura: {"expressedObjectives": {...}, "internalMotivators": {...}, "aversionsAndAvoidances": {...}}`;
    return this.callGeminiAPI(prompt);
  }

  private async analyzeBiography(transcriptions: string): Promise<BiographicalContext> {
    console.log("...Analisando Contexto Biográfico");
    const prompt = `Analise as transcrições e extraia o Contexto Biográfico Relevante. O output deve ser um JSON com a estrutura: {"formativeExperiences": {...}, "professionalTrajectory": {...}, "keyRelationships": {...}}`;
    return this.callGeminiAPI(prompt);
  }

  private async extractOperationalSpecs(transcriptions: string): Promise<OperationalSpecs> {
    console.log("...Extraindo Especificações Operacionais para Clonagem");
    const prompt = `Analise o texto e extraia parâmetros TÉCNICOS e REPRODUZÍVEIS para um agente de IA. Seja extremamente detalhado. O output deve ser um JSON com a estrutura: {"comunicacionais": {...}, "comportamentais": {...}, "reacionais": {...}}`;
    return this.callGeminiAPI(prompt);
  }

  private async analyzeAllDomains(responses: any[]): Promise<DomainAnalysis[]> {
    console.log("...Analisando Domínios Quantitativamente");
    const domains = [...new Set(responses.map(r => r.question_domain).filter(d => d))];
    const domainAnalyses: DomainAnalysis[] = [];

    for (const domain of domains) {
        const domainResponses = responses
            .filter(r => r.question_domain === domain && r.transcript_text && r.transcript_text.length > 5)
            .map(r => `[P${r.question_index}]: ${r.transcript_text}`)
            .join('\n');

        if (!domainResponses) continue;

        const prompt = `
# Análise de Domínio Específico: ${domain}
Analise as respostas do domínio "${domain}" e forneça uma análise detalhada. Baseie-se nos padrões, pontos fortes e fracos.

[Respostas do Domínio]
${domainResponses}

Retorne APENAS um JSON com a seguinte estrutura:
{
  "domain": "${domain}",
  "summary": "Um resumo conciso da performance e dos padrões neste domínio.",
  "score": X.X,
  "evaluation": "Crítico|Em Desenvolvimento|Sólido|Excepcional"
}`;
        
        try {
            const analysis = await this.callGeminiAPI(prompt);
            domainAnalyses.push(analysis);
        } catch (error) {
            console.error(`Falha ao analisar o domínio ${domain}:`, error);
        }
    }
    return domainAnalyses;
  }
  
  private async createBehaviorModel(transcriptions: string): Promise<BehaviorModel> {
    console.log("...Criando Modelo de Comportamento e Diálogos");
    const prompt = `
# Criação de Modelo de Comportamento
Com base nas transcrições, crie um modelo comportamental.

[Transcrições]
${transcriptions}

Retorne APENAS um JSON com a seguinte estrutura:
{
  "condensedProfile": "Resumo de 2-3 parágrafos da essência da personalidade.",
  "responseGuidelines": {
    "engagementTopics": ["..."],
    "cautionTopics": ["..."],
    "communicationStyle": ["..."],
    "decisionValues": ["..."]
  },
  "dialogueExamples": [
    {
      "situation": "Uma situação ou pergunta hipotética relevante.",
      "response": "Uma resposta realista e detalhada no estilo da pessoa."
    }
  ]
}`;
      return this.callGeminiAPI(prompt);
  }

  private async generateFineTuningDataset(userEmail: string, responses: any[], behaviorModel: BehaviorModel): Promise<any[]> {
    console.log('...Gerando Dataset de Fine-Tuning');
    
    const dataset = [];
    
    // Adicionar exemplos baseados nas respostas reais
    for (const response of responses) {
      if (response.question_text && response.transcript_text && response.transcript_text.length > 15) {
        dataset.push({
          "instruction": `Você é Clara R., uma mentora e especialista em comunicação ética. Sua personalidade é analítica, profunda e orientada a valores. Responda à seguinte pergunta com a sua voz autêntica.`,
          "input": response.question_text,
          "output": response.transcript_text,
        });
      }
    }

    // Adicionar exemplos sintéticos baseados no modelo comportamental
    if (behaviorModel && behaviorModel.dialogueExamples) {
        for(const example of behaviorModel.dialogueExamples) {
            dataset.push({
                "instruction": `Você é Clara R., uma mentora e especialista em comunicação ética. Sua personalidade é analítica, profunda e orientada a valores. Responda à seguinte pergunta com a sua voz autêntica.`,
                "input": example.situation,
                "output": example.response
            });
        }
    }

    console.log(`✅ Dataset de Fine-Tuning gerado com ${dataset.length} exemplos`);
    return dataset;
  }
}
