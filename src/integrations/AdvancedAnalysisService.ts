// Serviço de Análise Psicológica Avançada - DNA UP Platform
export interface AdvancedAnalysisRequest {
  userEmail: string
  responses: any[]
  audioFiles: string[]
}

export interface PersonalityProfile {
  communicationStyle: {
    formality: 'formal' | 'informal' | 'mixed'
    directness: 'direct' | 'elaborative' | 'balanced'
    technicalLevel: 'technical' | 'accessible' | 'mixed'
    humorUsage: {
      frequency: 'high' | 'medium' | 'low'
      type: string[]
      contexts: string[]
    }
    characteristicExpressions: string[]
    syntacticPatterns: string[]
  }
  thinkingPatterns: {
    structure: 'linear' | 'non-linear' | 'mixed'
    approach: 'analytical' | 'intuitive' | 'balanced'
    abstraction: 'concrete' | 'abstract' | 'balanced'
    detail: 'detailed' | 'holistic' | 'balanced'
    processingSpeed: 'deliberate' | 'fast' | 'variable'
  }
  emotionalResponse: {
    strongTriggers: string[]
    stressPatterns: string[]
    regulationStrategies: string[]
    enthusiasmTriggers: string[]
  }
  socialPosture: {
    orientation: 'introverted' | 'extroverted' | 'ambivert'
    leadershipStyle: string[]
    conflictStyle: string[]
    interactionPreferences: string[]
  }
}

export interface BeliefSystem {
  fundamentalValues: string[]
  ethicalPrinciples: string[]
  worldViews: {
    humanNature: string
    organizations: string
    changeAndProgress: string
  }
  personalPhilosophy: {
    decisionMaking: string
    riskAttitude: string
    successDefinition: string
  }
  thoughtEvolution: {
    detectedChanges: string[]
    pivotalEvents: string[]
  }
}

export interface KnowledgeDomain {
  expertiseAreas: string[]
  intellectualInterests: string[]
  knowledgeGaps: string[]
  authorityTopics: string[]
  informationSources: string[]
}

export interface LinguisticPatterns {
  characteristicVocabulary: string[]
  semanticFields: string[]
  technicalTerms: string[]
  textStructure: {
    sentenceLength: 'short' | 'medium' | 'long' | 'varied'
    paragraphStyle: string
    argumentationPatterns: string[]
  }
  stylisticMarkers: {
    humor: string[]
    formality: string[]
    audienceAdaptation: string[]
  }
}

export interface VoiceCloningData {
  bestAudioFiles: string[]
  vocalCharacteristics: {
    pitch: string
    pace: string
    rhythm: string
    intonation: string[]
  }
  emotionalMarkers: {
    excitement: string[]
    contemplation: string[]
    emphasis: string[]
    hesitation: string[]
  }
  speechPatterns: {
    fillers: string[]
    pauses: string[]
    repetitions: string[]
    characteristicPhrases: string[]
  }
  linguisticTreats: {
    pronunciation: string[]
    accent: string
    vocabulary: string[]
    grammar: string[]
  }
}

export interface AdvancedAnalysisResult {
  personalityProfile: PersonalityProfile
  beliefSystem: BeliefSystem
  knowledgeDomain: KnowledgeDomain
  linguisticPatterns: LinguisticPatterns
  voiceCloningData: VoiceCloningData
  behaviorModel: {
    condensedProfile: string
    responseGuidelines: any
    dialogueExamples: any[]
  }
  fineTuningDataset: any[]
  confidenceScore: number
  limitations: string[]
}

export class AdvancedAnalysisService {
  private geminiApiKey: string

  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
    if (!this.geminiApiKey) {
      console.warn('⚠️ Gemini API Key não configurada')
    }
    console.log('🧠 Inicializando Serviço de Análise Avançada...')
  }

  async performAdvancedAnalysis(request: AdvancedAnalysisRequest): Promise<AdvancedAnalysisResult> {
    try {
      console.log('🔬 Iniciando análise psicológica avançada...')
      console.log(`📊 Analisando ${request.responses.length} respostas para ${request.userEmail}`)

      // Validar dados de entrada
      if (!request.responses || request.responses.length === 0) {
        throw new Error('Nenhuma resposta fornecida para análise')
      }

      // Compilar todas as transcrições para análise
      const transcriptions = request.responses
        .filter(r => r.transcript_text && r.transcript_text.trim())
        .sort((a, b) => (a.question_index || 0) - (b.question_index || 0))
        .map(r => `PERGUNTA ${r.question_index || 'N/A'}: ${r.question_text || 'Pergunta não disponível'}\n\nRESPOSTA: ${r.transcript_text}`)
        .join('\n\n---\n\n')

      if (!transcriptions.trim()) {
        throw new Error('Nenhuma transcrição válida encontrada')
      }

      // Executar análise em fases
      const personalityProfile = await this.analyzePersonalityProfile(transcriptions)
      const beliefSystem = await this.analyzeBeliefSystem(transcriptions)
      const knowledgeDomain = await this.analyzeKnowledgeDomain(transcriptions)
      const linguisticPatterns = await this.analyzeLinguisticPatterns(transcriptions)
      const voiceCloningData = await this.prepareVoiceCloningData(request.responses, request.audioFiles)
      const behaviorModel = await this.createBehaviorModel(transcriptions, personalityProfile, beliefSystem)
      const fineTuningDataset = await this.generateFineTuningDataset(request.userEmail, request.responses, personalityProfile, behaviorModel)

      const result: AdvancedAnalysisResult = {
        personalityProfile,
        beliefSystem,
        knowledgeDomain,
        linguisticPatterns,
        voiceCloningData,
        behaviorModel,
        fineTuningDataset,
        confidenceScore: 0.92,
        limitations: [
          'Análise baseada em respostas a perguntas específicas',
          'Contexto limitado ao protocolo Clara R.',
          'Possível viés de auto-relato nas respostas'
        ]
      }

      console.log('✅ Análise psicológica avançada concluída!')
      return result

    } catch (error) {
      console.error('❌ Erro na análise avançada:', error)
      throw new Error(`Falha na análise avançada: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  private async analyzePersonalityProfile(transcriptions: string): Promise<PersonalityProfile> {
    const prompt = `
# Análise de Perfil de Personalidade - Protocolo Clara R.

Analise as seguintes respostas e extraia características detalhadas de personalidade:

${transcriptions}

## INSTRUÇÕES:
Extraia informações específicas para cada categoria abaixo, baseando-se EXCLUSIVAMENTE no conteúdo fornecido:

### 1. ESTILO DE COMUNICAÇÃO
- Formalidade: formal, informal ou misto
- Direcionamento: direto, elaborativo ou equilibrado  
- Nível técnico: técnico, acessível ou misto
- Uso de humor: frequência, tipos, contextos
- Expressões características e frases recorrentes
- Padrões sintáticos distintivos

### 2. PADRÕES DE PENSAMENTO
- Estrutura: linear, não-linear ou misto
- Abordagem: analítica, intuitiva ou equilibrada
- Abstração: concreto, abstrato ou equilibrado
- Detalhamento: detalhista, holístico ou equilibrado
- Velocidade de processamento: deliberado, rápido ou variável

### 3. RESPOSTA EMOCIONAL
- Temas que provocam respostas emocionais fortes
- Padrões de resposta a estresse ou pressão
- Estratégias de regulação emocional observadas
- Temas que evocam entusiasmo ou engajamento

### 4. POSTURA SOCIAL
- Orientação: introvertida, extrovertida ou ambivalente
- Padrões de liderança ou colaboração
- Estilo de conflito e negociação
- Preferências de interação

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
}
`

    try {
      const response = await this.callGeminiAPI(prompt)
      return this.parsePersonalityProfile(response)
    } catch (error) {
      console.error('❌ Erro na análise de personalidade:', error)
      return this.getDefaultPersonalityProfile()
    }
  }

  private async analyzeBeliefSystem(transcriptions: string): Promise<BeliefSystem> {
    const prompt = `
# Análise de Sistema de Crenças e Valores

Analise as respostas e identifique o sistema de crenças e valores da pessoa:

${transcriptions}

## EXTRAIA:

### 1. VALORES FUNDAMENTAIS
- Princípios éticos recorrentes
- Temas de justiça, equidade, liberdade
- Compromissos morais expressos

### 2. CRENÇAS SOBRE O MUNDO
- Visões sobre natureza humana
- Perspectivas sobre organizações e sistemas
- Crenças sobre mudança e progresso

### 3. FILOSOFIA PESSOAL
- Abordagens à tomada de decisão
- Atitudes em relação a risco e incerteza
- Perspectivas sobre sucesso e fracasso

### 4. EVOLUÇÃO DE PENSAMENTO
- Mudanças detectáveis em crenças ao longo das respostas
- Eventos ou experiências que causaram mudanças

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
}
`

    try {
      const response = await this.callGeminiAPI(prompt)
      return this.parseBeliefSystem(response)
    } catch (error) {
      console.error('❌ Erro na análise de crenças:', error)
      return this.getDefaultBeliefSystem()
    }
  }

  private async analyzeKnowledgeDomain(transcriptions: string): Promise<KnowledgeDomain> {
    const prompt = `
# Análise de Domínio de Conhecimento

Identifique as áreas de conhecimento e expertise da pessoa:

${transcriptions}

## IDENTIFIQUE:

### 1. ÁREAS DE EXPERTISE
- Domínios de conhecimento especializado
- Tópicos sobre os quais fala com autoridade
- Referências técnicas utilizadas

### 2. INTERESSES INTELECTUAIS
- Temas recorrentes de curiosidade
- Padrões de exploração de novos tópicos
- Fontes de informação preferidas

### 3. LACUNAS DE CONHECIMENTO
- Áreas evitadas ou desconhecidas
- Temas sobre os quais busca informações

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "expertiseAreas": ["..."],
  "intellectualInterests": ["..."],
  "knowledgeGaps": ["..."],
  "authorityTopics": ["..."],
  "informationSources": ["..."]
}
`

    try {
      const response = await this.callGeminiAPI(prompt)
      return this.parseKnowledgeDomain(response)
    } catch (error) {
      console.error('❌ Erro na análise de conhecimento:', error)
      return this.getDefaultKnowledgeDomain()
    }
  }

  private async analyzeLinguisticPatterns(transcriptions: string): Promise<LinguisticPatterns> {
    const prompt = `
# Análise de Padrões Linguísticos

Analise os padrões linguísticos únicos da pessoa:

${transcriptions}

## EXTRAIA:

### 1. VOCABULÁRIO CARACTERÍSTICO
- Palavras ou frases utilizadas com frequência incomum
- Campos semânticos preferidos para metáforas
- Termos técnicos recorrentes

### 2. ESTRUTURA DE TEXTO
- Comprimento típico de frases
- Uso de listas, perguntas retóricas
- Padrões de argumentação

### 3. MARCADORES ESTILÍSTICOS
- Uso de humor, ironia, sarcasmo
- Adaptações de estilo para diferentes contextos
- Informalidade vs. formalidade

Identifique padrões únicos que caracterizam esta pessoa especificamente.
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
}
`

    try {
      const response = await this.callGeminiAPI(prompt)
      return this.parseLinguisticPatterns(response)
    } catch (error) {
      console.error('❌ Erro na análise linguística:', error)
      return this.getDefaultLinguisticPatterns()
    }
  }

  private async prepareVoiceCloningData(responses: any[], audioFiles: string[]): Promise<VoiceCloningData> {
    console.log('🎤 Preparando dados para clonagem de voz...')
    
    try {
      // Selecionar os melhores arquivos de áudio baseado em duração e qualidade
      const bestAudios = responses
        .filter(r => r.audio_file_url && (r.audio_duration || 0) > 10) // Mínimo 10 segundos
        .sort((a, b) => (b.audio_duration || 0) - (a.audio_duration || 0)) // Ordenar por duração
        .slice(0, 20) // Top 20 áudios
        .map(r => r.audio_file_url)

      // Analisar características vocais baseado nas transcrições
      const transcriptions = responses
        .filter(r => r.transcript_text)
        .map(r => r.transcript_text)
        .join(' ')
      
      if (!transcriptions.trim()) {
        console.warn('Nenhuma transcrição disponível para análise de voz')
        return this.getDefaultVoiceCloningData(bestAudios)
      }

      const voiceCloningPrompt = `
# Análise para Clonagem de Voz - AllTalk TTS

Analise as transcrições para identificar características vocais e trejeitos de fala:

${transcriptions.substring(0, 8000)}

## IDENTIFIQUE:

### 1. CARACTERÍSTICAS VOCAIS (inferidas do texto)
- Ritmo de fala (rápido, lento, variável)
- Padrões de entonação
- Ênfases características

### 2. MARCADORES EMOCIONAIS
- Palavras/frases que indicam excitação
- Padrões de contemplação
- Formas de dar ênfase
- Indicadores de hesitação

### 3. PADRÕES DE FALA
- Preenchimentos vocais (né, então, tipo)
- Padrões de pausa
- Repetições características
- Frases distintivas

### 4. TREJEITOS LINGUÍSTICOS
- Pronúncias características
- Sotaque regional
- Vocabulário específico
- Padrões gramaticais únicos

Foque em elementos que tornam a fala desta pessoa única e reconhecível.
Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "vocalCharacteristics": {
    "pitch": "...",
    "pace": "...",
    "rhythm": "...",
    "intonation": ["..."]
  },
  "emotionalMarkers": {
    "excitement": ["..."],
    "contemplation": ["..."],
    "emphasis": ["..."],
    "hesitation": ["..."]
  },
  "speechPatterns": {
    "fillers": ["..."],
    "pauses": ["..."],
    "repetitions": ["..."],
    "characteristicPhrases": ["..."]
  },
  "linguisticTreats": {
    "pronunciation": ["..."],
    "accent": "...",
    "vocabulary": ["..."],
    "grammar": ["..."]
  }
}
`

      const response = await this.callGeminiAPI(voiceCloningPrompt)
      const parsedData = this.parseVoiceCloningData(response)
      
      return {
        bestAudioFiles: bestAudios,
        vocalCharacteristics: parsedData.vocalCharacteristics || {
          pitch: 'médio',
          pace: 'moderado',
          rhythm: 'natural',
          intonation: ['expressiva']
        },
        emotionalMarkers: parsedData.emotionalMarkers || {
          excitement: [],
          contemplation: [],
          emphasis: [],
          hesitation: []
        },
        speechPatterns: parsedData.speechPatterns || {
          fillers: [],
          pauses: [],
          repetitions: [],
          characteristicPhrases: []
        },
        linguisticTreats: parsedData.linguisticTreats || {
          pronunciation: [],
          accent: 'brasileiro neutro',
          vocabulary: [],
          grammar: []
        }
      }
    } catch (error) {
      console.error('❌ Erro na preparação de dados de voz:', error)
      return this.getDefaultVoiceCloningData(audioFiles)
    }
  }

  private async createBehaviorModel(transcriptions: string, personality: PersonalityProfile, beliefs: BeliefSystem): Promise<any> {
    const prompt = `
# Criação de Modelo de Comportamento

Com base na análise de personalidade e sistema de crenças, crie um modelo comportamental:

## DADOS DE ENTRADA:
### Personalidade: ${JSON.stringify(personality, null, 2)}
### Crenças: ${JSON.stringify(beliefs, null, 2)}
### Transcrições: ${transcriptions.substring(0, 5000)}...

## CRIE:

### 1. PERFIL CONDENSADO (2-3 parágrafos)
Resumo da essência da personalidade

### 2. DIRETRIZES DE RESPOSTA
- Tópicos de maior engajamento
- Tópicos a evitar ou abordar com cautela
- Estilos de comunicação preferidos
- Valores a priorizar em decisões

### 3. EXEMPLOS DE DIÁLOGO (5-7 exemplos)
Como a pessoa responderia a diferentes situações

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "condensedProfile": "...",
  "responseGuidelines": {
    "engagementTopics": ["..."],
    "cautionTopics": ["..."],
    "communicationStyle": ["..."],
    "decisionValues": ["..."]
  },
  "dialogueExamples": [
    {
      "situation": "...",
      "response": "..."
    }
  ]
}
`

    try {
      const response = await this.callGeminiAPI(prompt)
      return this.parseBehaviorModel(response)
    } catch (error) {
      console.error('❌ Erro na criação do modelo comportamental:', error)
      return this.getDefaultBehaviorModel()
    }
  }

  private async generateFineTuningDataset(userEmail: string, responses: any[], personality: PersonalityProfile, behaviorModel: any): Promise<any[]> {
    console.log('🤖 Gerando dataset de fine-tuning para TinyLlama...')
    
    try {
      const dataset = []
      
      // Adicionar exemplos baseados nas respostas reais
      for (const response of responses) {
        if (response.question_text && response.transcript_text) {
          dataset.push({
            instruction: `Responda como ${userEmail.split('@')[0]} responderia à seguinte pergunta, mantendo seu estilo de comunicação característico:`,
            input: response.question_text,
            output: response.transcript_text,
            metadata: {
              question_domain: response.question_domain || 'geral',
              question_index: response.question_index || 0,
              emotional_tone: response.emotional_tone || 'neutro',
              personality_traits: personality.communicationStyle
            }
          })
        }
      }

      // Adicionar exemplos sintéticos baseados no modelo comportamental
      const syntheticExamples = await this.generateSyntheticExamples(behaviorModel, personality)
      dataset.push(...syntheticExamples)

      console.log(`✅ Dataset gerado com ${dataset.length} exemplos`)
      return dataset
    } catch (error) {
      console.error('❌ Erro na geração do dataset:', error)
      return []
    }
  }

  private async generateSyntheticExamples(behaviorModel: any, personality: PersonalityProfile): Promise<any[]> {
    const prompt = `
# Geração de Exemplos Sintéticos para Fine-tuning

Baseado no modelo comportamental, gere 10 exemplos sintéticos de perguntas e respostas:

## MODELO: ${JSON.stringify(behaviorModel, null, 2)}
## PERSONALIDADE: ${JSON.stringify(personality, null, 2)}

Gere exemplos que demonstrem:
- Estilo de comunicação característico
- Padrões de pensamento
- Valores e crenças
- Trejeitos linguísticos

Retorne APENAS um array JSON com 10 exemplos no formato:
[
  {
    "instruction": "Responda como esta pessoa responderia:",
    "input": "pergunta aqui",
    "output": "resposta no estilo da pessoa"
  }
]
`

    try {
      const response = await this.callGeminiAPI(prompt)
      return this.parseSyntheticExamples(response)
    } catch (error) {
      console.error('❌ Erro na geração de exemplos sintéticos:', error)
      return []
    }
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key não configurada')
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`)
    }

    const result = await response.json()
    
    if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
      throw new Error('Resposta inválida da API Gemini')
    }

    return result.candidates[0].content.parts[0].text || 'Análise não disponível'
  }

  // Métodos de parsing melhorados com validação
  private parsePersonalityProfile(response: string): PersonalityProfile {
    try {
      const cleanResponse = this.cleanJsonResponse(response)
      const parsed = JSON.parse(cleanResponse)
      
      // Validar estrutura básica
      if (!parsed.communicationStyle || !parsed.thinkingPatterns || !parsed.emotionalResponse || !parsed.socialPosture) {
        throw new Error('Estrutura inválida')
      }
      
      return parsed
    } catch (error) {
      console.warn('Erro ao parsear perfil de personalidade, usando padrão:', error)
      return this.getDefaultPersonalityProfile()
    }
  }

  private parseBeliefSystem(response: string): BeliefSystem {
    try {
      const cleanResponse = this.cleanJsonResponse(response)
      const parsed = JSON.parse(cleanResponse)
      
      if (!parsed.fundamentalValues || !parsed.ethicalPrinciples || !parsed.worldViews || !parsed.personalPhilosophy) {
        throw new Error('Estrutura inválida')
      }
      
      return parsed
    } catch (error) {
      console.warn('Erro ao parsear sistema de crenças, usando padrão:', error)
      return this.getDefaultBeliefSystem()
    }
  }

  private parseKnowledgeDomain(response: string): KnowledgeDomain {
    try {
      const cleanResponse = this.cleanJsonResponse(response)
      const parsed = JSON.parse(cleanResponse)
      
      if (!parsed.expertiseAreas || !parsed.intellectualInterests) {
        throw new Error('Estrutura inválida')
      }
      
      return parsed
    } catch (error) {
      console.warn('Erro ao parsear domínio de conhecimento, usando padrão:', error)
      return this.getDefaultKnowledgeDomain()
    }
  }

  private parseLinguisticPatterns(response: string): LinguisticPatterns {
    try {
      const cleanResponse = this.cleanJsonResponse(response)
      const parsed = JSON.parse(cleanResponse)
      
      if (!parsed.characteristicVocabulary || !parsed.textStructure) {
        throw new Error('Estrutura inválida')
      }
      
      return parsed
    } catch (error) {
      console.warn('Erro ao parsear padrões linguísticos, usando padrão:', error)
      return this.getDefaultLinguisticPatterns()
    }
  }

  private parseVoiceCloningData(response: string): Partial<VoiceCloningData> {
    try {
      const cleanResponse = this.cleanJsonResponse(response)
      return JSON.parse(cleanResponse)
    } catch (error) {
      console.warn('Erro ao parsear dados de voz, usando padrão:', error)
      return {}
    }
  }

  private parseBehaviorModel(response: string): any {
    try {
      const cleanResponse = this.cleanJsonResponse(response)
      const parsed = JSON.parse(cleanResponse)
      
      if (!parsed.condensedProfile || !parsed.responseGuidelines) {
        throw new Error('Estrutura inválida')
      }
      
      return parsed
    } catch (error) {
      console.warn('Erro ao parsear modelo comportamental, usando padrão:', error)
      return this.getDefaultBehaviorModel()
    }
  }

  private parseSyntheticExamples(response: string): any[] {
    try {
      const cleanResponse = this.cleanJsonResponse(response)
      const parsed = JSON.parse(cleanResponse)
      
      if (!Array.isArray(parsed)) {
        throw new Error('Resposta não é um array')
      }
      
      return parsed.filter(item => item.instruction && item.input && item.output)
    } catch (error) {
      console.warn('Erro ao parsear exemplos sintéticos, usando padrão:', error)
      return []
    }
  }

  private cleanJsonResponse(response: string): string {
    // Remove markdown code blocks
    let clean = response.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    
    // Tenta encontrar o primeiro e último colchete ou chave para isolar o JSON
    const firstBracket = clean.indexOf('[')
    const firstBrace = clean.indexOf('{')
    const lastBracket = clean.lastIndexOf(']')
    const lastBrace = clean.lastIndexOf('}')

    let startIndex = -1;
    let endIndex = -1;

    if (firstBracket !== -1 && lastBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
        // Parece ser um array JSON
        startIndex = firstBracket;
        endIndex = lastBracket + 1;
    } else if (firstBrace !== -1 && lastBrace !== -1) {
        // Parece ser um objeto JSON
        startIndex = firstBrace;
        endIndex = lastBrace + 1;
    }

    if (startIndex !== -1 && endIndex !== -1) {
        clean = clean.substring(startIndex, endIndex);
    } else {
        // Se não encontrar JSON válido, retorna a string original (ou lança erro, dependendo da estratégia)
        console.warn('Não foi possível extrair JSON válido da resposta:', response);
        return response; // Ou throw new Error('No valid JSON found');
    }
  
    // Remove quebras de linha desnecessárias e espaços extras
    clean = clean.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
  
    return clean;
  }

// Métodos de fallback com dados padrão
private getDefaultPersonalityProfile(): PersonalityProfile {
  return {
    communicationStyle: {
      formality: 'mixed',
      directness: 'balanced',
      technicalLevel: 'accessible',
      humorUsage: {
        frequency: 'medium',
        type: ['casual', 'observacional'],
        contexts: ['conversas informais', 'explicações']
      },
      characteristicExpressions: ['na verdade', 'eu acho que', 'meio que'],
      syntacticPatterns: ['uso de conectivos', 'estrutura argumentativa']
    },
    thinkingPatterns: {
      structure: 'mixed',
      approach: 'analytical',
      abstraction: 'balanced',
      detail: 'balanced',
      processingSpeed: 'deliberate'
    },
    emotionalResponse: {
      strongTriggers: ['injustiça', 'crescimento pessoal'],
      stressPatterns: ['busca por soluções', 'reflexão'],
      regulationStrategies: ['pausa para reflexão', 'busca por perspectiva'],
      enthusiasmTriggers: ['aprendizado', 'novos desafios']
    },
    socialPosture: {
      orientation: 'ambivert',
      leadershipStyle: ['colaborativo', 'por exemplo'],
      conflictStyle: ['mediação', 'busca por consenso'],
      interactionPreferences: ['conversas significativas', 'troca de ideias']
    }
  }
}

private getDefaultBeliefSystem(): BeliefSystem {
  return {
    fundamentalValues: ['honestidade', 'crescimento', 'respeito'],
    ethicalPrinciples: ['integridade', 'responsabilidade', 'empatia'],
    worldViews: {
      humanNature: 'pessoas são naturalmente boas e capazes de crescer',
      organizations: 'sistemas podem ser melhorados através da colaboração',
      changeAndProgress: 'mudança é constante e pode ser positiva'
    },
    personalPhilosophy: {
      decisionMaking: 'baseado em valores e análise cuidadosa',
      riskAttitude: 'calculado mas aberto a oportunidades',
      successDefinition: 'crescimento pessoal e contribuição positiva'
    },
    thoughtEvolution: {
      detectedChanges: ['maior abertura a novas perspectivas'],
      pivotalEvents: ['experiências de aprendizado significativo']
    }
  }
}

private getDefaultKnowledgeDomain(): KnowledgeDomain {
  return {
    expertiseAreas: ['área de formação', 'experiência profissional'],
    intellectualInterests: ['desenvolvimento pessoal', 'inovação'],
    knowledgeGaps: ['áreas técnicas específicas'],
    authorityTopics: ['temas de experiência direta'],
    informationSources: ['livros', 'artigos', 'experiência prática']
  }
}

private getDefaultLinguisticPatterns(): LinguisticPatterns {
  return {
    characteristicVocabulary: ['na verdade', 'eu acho', 'meio que'],
    semanticFields: ['crescimento', 'aprendizado', 'desenvolvimento'],
    technicalTerms: ['terminologia profissional básica'],
    textStructure: {
      sentenceLength: 'varied',
      paragraphStyle: 'estruturado com exemplos',
      argumentationPatterns: ['introdução', 'desenvolvimento', 'conclusão']
    },
    stylisticMarkers: {
      humor: ['ironia leve', 'observações cotidianas'],
      formality: ['adaptação ao contexto'],
      audienceAdaptation: ['ajuste de linguagem técnica']
    }
  }
}

private getDefaultVoiceCloningData(audioFiles: string[]): VoiceCloningData {
  return {
    bestAudioFiles: audioFiles.slice(0, 10),
    vocalCharacteristics: {
      pitch: 'médio',
      pace: 'moderado',
      rhythm: 'natural',
      intonation: ['expressiva', 'variada']
    },
    emotionalMarkers: {
      excitement: ['tom mais alto', 'ritmo acelerado'],
      contemplation: ['pausas reflexivas', 'tom mais baixo'],
      emphasis: ['entonação ascendente', 'repetição'],
      hesitation: ['ehh', 'então', 'meio que']
    },
    speechPatterns: {
      fillers: ['né', 'então', 'tipo'],
      pauses: ['pausas reflexivas', 'respiração entre ideias'],
      repetitions: ['reformulações', 'ênfase por repetição'],
      characteristicPhrases: ['na verdade', 'eu acho que', 'meio que']
    },
    linguisticTreats: {
      pronunciation: ['articulação clara', 'ritmo natural'],
      accent: 'brasileiro neutro',
      vocabulary: ['linguagem acessível', 'termos técnicos quando necessário'],
      grammar: ['estrutura correta', 'estilo conversacional']
    }
  }
}

private getDefaultBehaviorModel(): any {
  return {
    condensedProfile: 'Pessoa comunicativa e reflexiva, que valoriza o crescimento pessoal e a troca de ideias. Demonstra equilíbrio entre análise e intuição, com tendência a buscar soluções colaborativas. Expressa-se de forma acessível, adaptando o nível técnico ao contexto.',
    responseGuidelines: {
      engagementTopics: ['desenvolvimento pessoal', 'aprendizado', 'inovação', 'colaboração'],
      cautionTopics: ['temas polêmicos sem context', 'decisões precipitadas'],
      communicationStyle: ['tom conversacional', 'exemplos práticos', 'linguagem acessível'],
      decisionValues: ['integridade', 'crescimento', 'impacto positivo']
    },
    dialogueExamples: [
      {
        situation: 'Pergunta sobre desafios profissionais',
        response: 'Eu acho que todo desafio é uma oportunidade de crescimento, né? Na verdade, costumo abordar essas situações primeiro tentando entender o contexto completo...'
      },
      {
        situation: 'Discussão sobre mudanças',
        response: 'Mudança pode ser meio desafiadora no início, mas eu vejo como algo natural. Tipo, se a gente para para pensar, estamos sempre em processo de evolução...'
      },
      {
        situation: 'Conselho sobre decisões',
        response: 'Então, eu sempre considero os valores pessoais primeiro. Na verdade, acho que quando a gente alinha as decisões com o que realmente acredita, fica mais fácil...'
      }
    ]
  }
}
}


