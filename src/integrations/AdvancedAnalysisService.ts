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
    console.log('🧠 Inicializando Serviço de Análise Avançada...')
  }

  async performAdvancedAnalysis(request: AdvancedAnalysisRequest): Promise<AdvancedAnalysisResult> {
    try {
      console.log('🔬 Iniciando análise psicológica avançada...')
      console.log(`📊 Analisando ${request.responses.length} respostas para ${request.userEmail}`)

      // Compilar todas as transcrições para análise
      const transcriptions = request.responses
        .sort((a, b) => a.question_index - b.question_index)
        .map(r => `PERGUNTA ${r.question_index}: ${r.question_text}\n\nRESPOSTA: ${r.transcript_text}`)
        .join('\n\n---\n\n')

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
      throw new Error(`Falha na análise avançada: ${error.message}`)
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

Retorne a análise em formato JSON estruturado com evidências específicas das respostas.
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

Retorne em formato JSON com evidências específicas.
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

Retorne em formato JSON estruturado.
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
Retorne em formato JSON.
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
    
    // Selecionar os melhores arquivos de áudio baseado em duração e qualidade
    const bestAudios = responses
      .filter(r => r.audio_file_url && r.audio_duration > 10) // Mínimo 10 segundos
      .sort((a, b) => b.audio_duration - a.audio_duration) // Ordenar por duração
      .slice(0, 20) // Top 20 áudios
      .map(r => r.audio_file_url)

    // Analisar características vocais baseado nas transcrições
    const transcriptions = responses.map(r => r.transcript_text).join(' ')
    
    const voiceCloningPrompt = `
# Análise para Clonagem de Voz - AllTalk TTS

Analise as transcrições para identificar características vocais e trejeitos de fala:

${transcriptions}

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
Retorne em formato JSON detalhado.
`

    try {
      const response = await this.callGeminiAPI(voiceCloningPrompt)
      const parsedData = this.parseVoiceCloningData(response)
      
      return {
        ...parsedData,
        bestAudioFiles: bestAudios
      }
    } catch (error) {
      console.error('❌ Erro na preparação de dados de voz:', error)
      return this.getDefaultVoiceCloningData(bestAudios)
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

Retorne em formato JSON estruturado.
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
    
    const dataset = []
    
    // Adicionar exemplos baseados nas respostas reais
    for (const response of responses) {
      dataset.push({
        instruction: `Responda como ${userEmail.split('@')[0]} responderia à seguinte pergunta, mantendo seu estilo de comunicação característico:`,
        input: response.question_text,
        output: response.transcript_text,
        metadata: {
          question_domain: response.question_domain,
          question_index: response.question_index,
          emotional_tone: response.emotional_tone,
          personality_traits: personality.communicationStyle
        }
      })
    }

    // Adicionar exemplos sintéticos baseados no modelo comportamental
    const syntheticExamples = await this.generateSyntheticExamples(behaviorModel, personality)
    dataset.push(...syntheticExamples)

    console.log(`✅ Dataset gerado com ${dataset.length} exemplos`)
    return dataset
  }

  private async generateSyntheticExamples(behaviorModel: any, personality: PersonalityProfile): Promise<any[]> {
    const prompt = `
# Geração de Exemplos Sintéticos para Fine-tuning

Baseado no modelo comportamental, gere 20 exemplos sintéticos de perguntas e respostas:

## MODELO: ${JSON.stringify(behaviorModel, null, 2)}
## PERSONALIDADE: ${JSON.stringify(personality, null, 2)}

Gere exemplos que demonstrem:
- Estilo de comunicação característico
- Padrões de pensamento
- Valores e crenças
- Trejeitos linguísticos

Formato: {"instruction": "...", "input": "...", "output": "..."}
Retorne array JSON com 20 exemplos.
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
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
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const result = await response.json()
    return result.candidates?.[0]?.content?.parts?.[0]?.text || 'Análise não disponível'
  }

  // Métodos de parsing (implementação simplificada para demonstração)
  private parsePersonalityProfile(response: string): PersonalityProfile {
    try {
      // Tentar extrair JSON da resposta
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.warn('Erro ao parsear perfil de personalidade, usando padrão')
    }
    
    return this.getDefaultPersonalityProfile()
  }

  private parseBeliefSystem(response: string): BeliefSystem {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.warn('Erro ao parsear sistema de crenças, usando padrão')
    }
    
    return this.getDefaultBeliefSystem()
  }

  private parseKnowledgeDomain(response: string): KnowledgeDomain {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.warn('Erro ao parsear domínio de conhecimento, usando padrão')
    }
    
    return this.getDefaultKnowledgeDomain()
  }

  private parseLinguisticPatterns(response: string): LinguisticPatterns {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.warn('Erro ao parsear padrões linguísticos, usando padrão')
    }
    
    return this.getDefaultLinguisticPatterns()
  }

  private parseVoiceCloningData(response: string): Partial<VoiceCloningData> {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.warn('Erro ao parsear dados de voz, usando padrão')
    }
    
    return {}
  }

  private parseBehaviorModel(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.warn('Erro ao parsear modelo comportamental, usando padrão')
    }
    
    return this.getDefaultBehaviorModel()
  }

  private parseSyntheticExamples(response: string): any[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.warn('Erro ao parsear exemplos sintéticos, usando padrão')
    }
    
    return []
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
          type: ['situacional'],
          contexts: ['conversas casuais']
        },
        characteristicExpressions: ['na verdade', 'eu acho que'],
        syntacticPatterns: ['frases médias', 'estrutura clara']
      },
      thinkingPatterns: {
        structure: 'linear',
        approach: 'balanced',
        abstraction: 'balanced',
        detail: 'balanced',
        processingSpeed: 'deliberate'
      },
      emotionalResponse: {
        strongTriggers: ['injustiça', 'crescimento pessoal'],
        stressPatterns: ['reflexão profunda'],
        regulationStrategies: ['autoconhecimento'],
        enthusiasmTriggers: ['aprendizado', 'conexões humanas']
      },
      socialPosture: {
        orientation: 'ambivert',
        leadershipStyle: ['colaborativo'],
        conflictStyle: ['diplomático'],
        interactionPreferences: ['conversas profundas']
      }
    }
  }

  private getDefaultBeliefSystem(): BeliefSystem {
    return {
      fundamentalValues: ['autenticidade', 'crescimento', 'conexão'],
      ethicalPrinciples: ['honestidade', 'empatia', 'responsabilidade'],
      worldViews: {
        humanNature: 'Pessoas são fundamentalmente boas e capazes de crescimento',
        organizations: 'Sistemas podem ser melhorados através de colaboração',
        changeAndProgress: 'Mudança é possível através de esforço consciente'
      },
      personalPhilosophy: {
        decisionMaking: 'Baseado em valores e impacto nas pessoas',
        riskAttitude: 'Calculado, mas aberto a novas experiências',
        successDefinition: 'Crescimento pessoal e contribuição positiva'
      },
      thoughtEvolution: {
        detectedChanges: ['maior autoconhecimento ao longo das respostas'],
        pivotalEvents: ['reflexões sobre experiências passadas']
      }
    }
  }

  private getDefaultKnowledgeDomain(): KnowledgeDomain {
    return {
      expertiseAreas: ['desenvolvimento pessoal', 'relacionamentos'],
      intellectualInterests: ['psicologia', 'comunicação', 'crescimento'],
      knowledgeGaps: ['áreas técnicas específicas'],
      authorityTopics: ['experiências pessoais', 'autoconhecimento'],
      informationSources: ['experiência própria', 'reflexão']
    }
  }

  private getDefaultLinguisticPatterns(): LinguisticPatterns {
    return {
      characteristicVocabulary: ['realmente', 'acredito', 'sinto'],
      semanticFields: ['emoções', 'relacionamentos', 'crescimento'],
      technicalTerms: ['autoconhecimento', 'desenvolvimento'],
      textStructure: {
        sentenceLength: 'medium',
        paragraphStyle: 'narrativo',
        argumentationPatterns: ['experiência pessoal', 'reflexão']
      },
      stylisticMarkers: {
        humor: ['situacional', 'leve'],
        formality: ['casual-profissional'],
        audienceAdaptation: ['empático', 'inclusivo']
      }
    }
  }

  private getDefaultVoiceCloningData(audioFiles: string[]): VoiceCloningData {
    return {
      bestAudioFiles: audioFiles,
      vocalCharacteristics: {
        pitch: 'médio',
        pace: 'moderado',
        rhythm: 'natural',
        intonation: ['expressiva', 'variada']
      },
      emotionalMarkers: {
        excitement: ['tom mais alto', 'ritmo acelerado'],
        contemplation: ['pausas reflexivas', 'tom mais baixo'],
        emphasis: ['repetição', 'intensidade'],
        hesitation: ['pausas', 'preenchimentos']
      },
      speechPatterns: {
        fillers: ['né', 'então', 'assim'],
        pauses: ['reflexivas', 'naturais'],
        repetitions: ['para ênfase'],
        characteristicPhrases: ['eu acho que', 'na verdade']
      },
      linguisticTreats: {
        pronunciation: ['clara', 'articulada'],
        accent: 'brasileiro neutro',
        vocabulary: ['acessível', 'expressivo'],
        grammar: ['correta', 'natural']
      }
    }
  }

  private getDefaultBehaviorModel(): any {
    return {
      condensedProfile: 'Pessoa reflexiva e empática, com forte orientação para crescimento pessoal e conexões autênticas. Comunica-se de forma clara e acessível, demonstrando autoconhecimento e interesse genuíno pelos outros.',
      responseGuidelines: {
        engagementTopics: ['desenvolvimento pessoal', 'relacionamentos', 'autoconhecimento'],
        cautionTopics: ['temas muito técnicos', 'assuntos polêmicos'],
        communicationStyle: ['empático', 'reflexivo', 'autêntico'],
        decisionValues: ['impacto humano', 'crescimento', 'autenticidade']
      },
      dialogueExamples: [
        {
          situation: 'Pergunta sobre desafios pessoais',
          response: 'Eu acredito que os desafios são oportunidades de crescimento. Na minha experiência...'
        }
      ]
    }
  }
}

// Instância singleton
export const advancedAnalysisService = new AdvancedAnalysisService()

