import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================================================
// INTERFACES E TIPOS DO MANUAL DE PERSONIFICAÇÃO
// ============================================================================

interface UserResponse {
  question_index: number;
  question_domain: string;
  question_text: string;
  transcript_text: string;
}

interface AnalysisRequest {
  userEmail: string;
  responses: UserResponse[];
  audioFiles: any[];
}

interface DocumentalAnalysis {
  documentTypes: string[];
  timePeriod: string;
  consistency: string;
  identifiedGaps: string[];
}

interface PersonalityProfile {
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
    triggers: string[];
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

interface BeliefsAndValues {
  fundamentalValues: string[];
  ethicalPrinciples: string[];
  worldViews: {
    humanNature: string;
    organizations: string;
    progress: string;
  };
  personalPhilosophy: {
    decisionMaking: string;
    riskApproach: string;
    successDefinition: string;
  };
  thoughtEvolution: string[];
}

interface KnowledgeDomain {
  expertiseAreas: string[];
  intellectualInterests: string[];
  knowledgeGaps: string[];
}

interface MotivationsAndIntentions {
  expressedGoals: {
    shortTerm: string[];
    longTerm: string[];
  };
  internalMotivators: string[];
  aversionsAndAvoidances: string[];
}

interface BiographicalContext {
  formativeExperiences: string[];
  professionalTrajectory: string[];
  keyRelationships: string[];
}

interface LinguisticPatterns {
  characteristicVocabulary: string[];
  textStructure: {
    sentenceLength: string;
    argumentationPatterns: string[];
  };
  stylisticMarkers: string[];
}

interface BehaviorModel {
  condensedProfile: string;
  responseGuidelines: {
    topicsToAvoid: string[];
    preferredTopics: string[];
    communicationRules: string[];
  };
  dialogueExamples: Array<{
    question: string;
    response: string;
    rationale: string;
  }>;
}

interface OperationalSpecifications {
  communicational: {
    coreVocabulary: string[];
    sentenceStructures: string[];
    humorPatterns: string[];
  };
  behavioral: {
    responseInitiation: string[];
    responseConclusion: string[];
    exampleUsage: string[];
  };
  reactional: {
    emotionalTriggers: string[];
    modeChanges: string[];
    adaptationPatterns: string[];
  };
}

interface DomainQuantitativeAnalysis {
  domain: string;
  score: number;
  evaluation: 'Crítico' | 'Em Desenvolvimento' | 'Sólido' | 'Excepcional';
  summary: string;
}

interface ReliabilityAssessment {
  confidenceLevel: 'Baixa' | 'Média' | 'Alta' | 'Muito Alta';
  areasForMoreData: string[];
  modelAccuracy: string;
}

interface PersonificationManual {
  documentalAnalysis: DocumentalAnalysis;
  personalityProfile: PersonalityProfile;
  beliefsAndValues: BeliefsAndValues;
  knowledgeDomain: KnowledgeDomain;
  motivationsAndIntentions: MotivationsAndIntentions;
  biographicalContext: BiographicalContext;
  linguisticPatterns: LinguisticPatterns;
  behaviorModel: BehaviorModel;
  operationalSpecifications: OperationalSpecifications;
  quantitativeAnalysis: DomainQuantitativeAnalysis[];
  reliabilityAssessment: ReliabilityAssessment;
  metadata: {
    generationDate: string;
    userEmail: string;
    totalResponses: number;
    analysisVersion: string;
  };
}

// ============================================================================
// SERVIÇO DE ANÁLISE AVANÇADA
// ============================================================================

export class AdvancedAnalysisService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY não encontrada nas variáveis de ambiente');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
  }

  // ============================================================================
  // MÉTODO PRINCIPAL - GERAÇÃO DO MANUAL COMPLETO
  // ============================================================================

  async generatePersonificationManual(request: AnalysisRequest): Promise<PersonificationManual> {
    console.log('🧬 Iniciando análise completa do DNA da personalidade...');
    
    const responses = request.responses;
    const responseTexts = responses.map(r => 
        `[Domínio: ${r.question_domain}] Pergunta ${r.question_index}: ${r.question_text}\nResposta: ${r.transcript_text}`
    ).join('\n\n---\n\n');
    
    try {
      // Executa todas as análises em paralelo para máxima eficiência
      const [
        documentalAnalysis,
        personalityProfile,
        beliefsAndValues,
        knowledgeDomain,
        motivationsAndIntentions,
        biographicalContext,
        linguisticPatterns,
        behaviorModel,
        operationalSpecifications,
        quantitativeAnalysis,
        reliabilityAssessment
      ] = await Promise.all([
        this.analyzeDocumentalCorpus(responses),
        this.extractPersonalityProfile(responseTexts),
        this.mapBeliefsAndValues(responseTexts),
        this.identifyKnowledgeDomains(responseTexts),
        this.analyzeMotivationsAndIntentions(responseTexts),
        this.extractBiographicalContext(responseTexts),
        this.analyzeLinguisticPatterns(responseTexts),
        this.constructBehaviorModel(responseTexts),
        this.defineOperationalSpecifications(responseTexts),
        this.performQuantitativeAnalysis(responses), // Agora baseado em IA
        this.assessReliability(responseTexts)       // Agora baseado em IA
      ]);
      
      // MONTAGEM DO MANUAL FINAL
      const manual: PersonificationManual = {
        documentalAnalysis,
        personalityProfile,
        beliefsAndValues,
        knowledgeDomain,
        motivationsAndIntentions,
        biographicalContext,
        linguisticPatterns,
        behaviorModel,
        operationalSpecifications,
        quantitativeAnalysis,
        reliabilityAssessment,
        metadata: {
          generationDate: new Date().toISOString(),
          userEmail: request.userEmail,
          totalResponses: responses.length,
          analysisVersion: '3.0.0-FINAL'
        }
      };
      
      console.log('✅ Manual de Personificação gerado com sucesso!');
      return manual;
      
    } catch (error) {
      console.error('❌ Erro crítico durante a geração do manual:', error);
      throw error;
    }
  }

  // ============================================================================
  // MÉTODOS DE ANÁLISE ESPECÍFICOS (usando a IA)
  // ============================================================================

  private async callGeminiForJson(prompt: string): Promise<any> {
    try {
        const result = await this.model.generateContent(prompt);
        const responseText = result.response.text();
        // Limpa o texto para garantir que é um JSON válido
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Erro ao chamar ou parsear a resposta da API Gemini:", error);
        throw new Error("Falha na comunicação ou formatação da resposta da API.");
    }
  }
  
  private async analyzeDocumentalCorpus(responses: UserResponse[]): Promise<DocumentalAnalysis> {
    console.log('📊 Analisando corpus documental...');
    const prompt = `Baseado no conjunto de ${responses.length} respostas fornecidas, analise o corpus documental. Avalie a consistência, identifique o período de tempo e aponte possíveis lacunas na análise. Retorne um JSON com a estrutura: {"documentTypes": ["..."], "timePeriod": "...", "consistency": "...", "identifiedGaps": ["..."]}`;
    return this.callGeminiForJson(prompt);
  }

  private async extractPersonalityProfile(responseTexts: string): Promise<PersonalityProfile> {
    console.log('🧠 Extraindo perfil de personalidade...');
    const prompt = `Analise o seguinte texto e extraia o perfil de personalidade detalhado. Seja profundo e use exemplos do texto para justificar. Retorne um JSON com a estrutura: {"communicationStyle": {...}, "thinkingPatterns": {...}, "emotionalResponse": {...}, "socialPosture": {...}} \n\nTEXTO:\n${responseTexts}`;
    return this.callGeminiForJson(prompt);
  }

  private async mapBeliefsAndValues(responseTexts: string): Promise<BeliefsAndValues> {
    console.log('🎯 Mapeando crenças e valores...');
    const prompt = `Analise o texto e mapeie o sistema de crenças e valores. O output deve ser um JSON com a estrutura: {"fundamentalValues": [...], "ethicalPrinciples": [...], "worldViews": {...}, "personalPhilosophy": {...}, "thoughtEvolution": [...]} \n\nTEXTO:\n${responseTexts}`;
    return this.callGeminiForJson(prompt);
  }

  private async identifyKnowledgeDomains(responseTexts: string): Promise<KnowledgeDomain> {
    console.log('📚 Identificando domínios de conhecimento...');
    const prompt = `Identifique os domínios de conhecimento do expert. O output deve ser um JSON com a estrutura: {"expertiseAreas": [...], "intellectualInterests": [...], "knowledgeGaps": [...]} \n\nTEXTO:\n${responseTexts}`;
    return this.callGeminiForJson(prompt);
  }

  private async analyzeMotivationsAndIntentions(responseTexts: string): Promise<MotivationsAndIntentions> {
    console.log('🎯 Analisando motivações e intenções...');
    const prompt = `Analise as motivações e intenções. O output deve ser um JSON com a estrutura: {"expressedGoals": {...}, "internalMotivators": [...], "aversionsAndAvoidances": [...]} \n\nTEXTO:\n${responseTexts}`;
    return this.callGeminiForJson(prompt);
  }

  private async extractBiographicalContext(responseTexts: string): Promise<BiographicalContext> {
    console.log('📖 Extraindo contexto biográfico...');
    const prompt = `Extraia o contexto biográfico relevante. O output deve ser um JSON com a estrutura: {"formativeExperiences": [...], "professionalTrajectory": [...], "keyRelationships": [...]} \n\nTEXTO:\n${responseTexts}`;
    return this.callGeminiForJson(prompt);
  }

  private async analyzeLinguisticPatterns(responseTexts: string): Promise<LinguisticPatterns> {
    console.log('🔤 Analisando padrões linguísticos...');
    const prompt = `Analise os padrões linguísticos. O output deve ser um JSON com a estrutura: {"characteristicVocabulary": [...], "textStructure": {...}, "stylisticMarkers": [...]} \n\nTEXTO:\n${responseTexts}`;
    return this.callGeminiForJson(prompt);
  }

  private async constructBehaviorModel(responseTexts: string): Promise<BehaviorModel> {
    console.log('🤖 Construindo modelo de comportamento...');
    const prompt = `Construa um modelo de comportamento. Inclua um perfil condensado, diretrizes de resposta e 5 exemplos de diálogo realistas. O output deve ser um JSON com a estrutura: {"condensedProfile": "...", "responseGuidelines": {...}, "dialogueExamples": [...]} \n\nTEXTO:\n${responseTexts}`;
    return this.callGeminiForJson(prompt);
  }

  private async defineOperationalSpecifications(responseTexts: string): Promise<OperationalSpecifications> {
    console.log('⚙️ Definindo especificações operacionais...');
    const prompt = `Defina as especificações operacionais para um clone de IA. Seja técnico e preciso. O output deve ser um JSON com a estrutura: {"communicational": {...}, "behavioral": {...}, "reactional": {...}} \n\nTEXTO:\n${responseTexts}`;
    return this.callGeminiForJson(prompt);
  }

  private async performQuantitativeAnalysis(responses: UserResponse[]): Promise<DomainQuantitativeAnalysis[]> {
    console.log('📈 Realizando análise quantitativa por domínio...');
    const domains = [...new Set(responses.map(r => r.question_domain))];
    const analysisPromises = domains.map(async (domain) => {
      const domainResponses = responses.filter(r => r.question_domain === domain).map(r => r.transcript_text).join('\n');
      const prompt = `
        Analise a profundidade, consistência e clareza das seguintes respostas do domínio "${domain}". 
        Com base na sua análise, atribua uma pontuação de 0.0 a 10.0 e uma avaliação.
        
        Respostas do Domínio:
        ${domainResponses}
        
        Retorne APENAS um JSON com a seguinte estrutura:
        {
          "domain": "${domain}",
          "score": X.X,
          "evaluation": "Crítico|Em Desenvolvimento|Sólido|Excepcional",
          "summary": "Uma justificativa concisa para a pontuação e avaliação."
        }
      `;
      return this.callGeminiForJson(prompt);
    });
    return Promise.all(analysisPromises);
  }

  private async assessReliability(responseTexts: string): Promise<ReliabilityAssessment> {
    console.log('🔍 Avaliando confiabilidade do modelo...');
    const prompt = `
      Avalie a confiabilidade geral do conjunto de respostas fornecido. 
      Considere a consistência, profundidade e possíveis vieses.
      
      Texto para Análise:
      ${responseTexts}
      
      Retorne APENAS um JSON com a seguinte estrutura:
      {
        "confidenceLevel": "Baixa|Média|Alta|Muito Alta",
        "areasForMoreData": ["área1", "área2"],
        "modelAccuracy": "Estimativa da precisão do modelo em percentagem (ex: '90-95%')"
      }
    `;
    const result = await this.callGeminiForJson(prompt);
    // A API do Gemini pode não retornar um número para a precisão, então garantimos que seja uma string.
    result.modelAccuracy = String(result.modelAccuracy); 
    return result;
  }
}
