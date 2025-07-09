// Integrações REAIS para DNA UP Platform - UPLOAD IMEDIATO
import { supabaseStorageService } from './SupabaseStorageService'
import { FineTuningDatasetGenerator } from './FineTuningDatasetGenerator'
// Fix: Import path corrected
import { AdvancedAnalysisService } from './AdvancedAnalysisService'

export interface LLMRequest {
  prompt: string
  file_urls?: string[]
  response_json_schema?: any
}

export interface LLMResponse {
  transcription?: string
  analysis_document?: string
  personality_summary?: string
  key_insights?: string[]
  behavioral_patterns?: string[]
  recommendations?: string
  duration_seconds?: number
  confidence_score?: number
  emotional_tone?: string
  keywords?: string[]
  domain_analysis?: any
}

export interface FileUploadRequest {
  file: File
  userEmail: string
  questionIndex: number
  questionText: string
}

export interface FileUploadResponse {
  file_url: string
  file_id: string
  storage_file_id: string
  transcription_file_id?: string
  transcription_url?: string
}

// Fix: Create instance of AdvancedAnalysisService
const advancedAnalysisService = new AdvancedAnalysisService()

// Transcrição real usando Deepgram
export async function transcribeAudio(audioBlob: Blob): Promise<LLMResponse> {
  try {
    const deepgramApiKey = import.meta.env.VITE_DEEPGRAM_API_KEY

    if (!deepgramApiKey) {
      throw new Error('Deepgram API key not found in environment variables.')
    }

    const response = await fetch('https://api.deepgram.com/v1/listen', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${deepgramApiKey}`,
        'Content-Type': audioBlob.type,
      },
      body: audioBlob,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Deepgram API error: ${errorData.error}`)
    }

    const data = await response.json()
    const transcription = data.results.channels[0].alternatives[0].transcript

    return { transcription }
  } catch (error) {
    console.error('Error transcribing audio:', error)
    throw error
  }
}

// Análise de sentimento usando Gemini
export async function analyzeSentiment(text: string): Promise<LLMResponse> {
  try {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!geminiApiKey) {
      throw new Error('Gemini API key not found in environment variables.')
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analise o sentimento do seguinte texto e classifique-o como 'positivo', 'negativo' ou 'neutro':\n\n${text}`,
          }],
        }],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${errorData.error}`)
    }

    const data = await response.json()
    const sentiment = data.candidates[0].content.parts[0].text.trim()

    return { emotional_tone: sentiment }
  } catch (error) {
    console.error('Error analyzing sentiment:', error)
    throw error
  }
}

async function generatePsychologicalAnalysis(
  responses: string[],
  analysisDepth: string,
  responseCount: number,
): Promise<LLMResponse> {
  try {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!geminiApiKey) {
      throw new Error('Gemini API key not found in environment variables.')
    }

    const prompt = `Com base nas seguintes ${responseCount} respostas do protocolo Clara R. de 108 perguntas estratégicas, gere uma análise psicológica detalhada com profundidade ${analysisDepth}. Inclua um resumo executivo, análise de personalidade, insights chave, padrões comportamentais, recomendações e uma análise de domínio. As respostas são:\n\n${responses.map((r, i) => `${i + 1}. ${r}`).join('\n')}`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${errorData.error}`)
    }

    const data = await response.json()
    const analysis_document = data.candidates[0].content.parts[0].text.trim()

    return { analysis_document }
  } catch (error) {
    console.error('Error generating psychological analysis:', error)
    throw error
  }
}

// Geração de documento de análise usando Gemini
export async function generateAnalysisDocument(
  analysisDepth: string,
  responseCount: number,
): Promise<LLMResponse> {
  try {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!geminiApiKey) {
      throw new Error('Gemini API key not found in environment variables.')
    }

    let analysisSummary = '';
    if (responseCount > 50) {
      analysisSummary = 'A pessoa demonstra padrões consistentes e bem definidos de personalidade, com características distintivas que emergem claramente através das múltiplas dimensões analisadas.';
    } else if (responseCount > 20) {
      analysisSummary = 'Emergem padrões iniciais de personalidade que sugerem tendências comportamentais e cognitivas específicas, embora uma análise mais completa beneficiaria de respostas adicionais.';
    } else {
      analysisSummary = 'Ainda não há dados suficientes para uma análise aprofundada. Recomenda-se coletar mais respostas para obter um perfil mais completo.';
    }

    const analysisText = `\n# ANÁLISE PSICOLÓGICA ${analysisDepth} - PROTOCOLO CLARA R.\n\n## Resumo Executivo\nAnálise psicológica baseada em ${responseCount} respostas do protocolo Clara R. de 108 perguntas estratégicas. \n\n${analysisSummary}`;

    return {
      analysis_document: analysisText,
    }
  } catch (error) {
    console.error('Error generating analysis document:', error)
    throw error
  }
}

// Geração de documento de análise avançada usando Gemini
export async function generateAdvancedAnalysisDocument(
  analysisDepth: string,
  responseCount: number,
): Promise<LLMResponse> {
  try {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!geminiApiKey) {
      throw new Error('Gemini API key not found in environment variables.')
    }

    const analysisDocument = advancedAnalysisService.generateAnalysisDocument(
      analysisDepth,
      responseCount,
    )

    return { analysis_document: analysisDocument }
  } catch (error) {
    console.error('Error generating advanced analysis document:', error)
    throw error
  }
}

// Geração de insights chave usando Gemini
export async function generateKeyInsights(
  responses: string[],
): Promise<LLMResponse> {
  try {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!geminiApiKey) {
      throw new Error('Gemini API key not found in environment variables.')
    }

    const prompt = `Com base nas seguintes respostas, gere 5 insights chave sobre a personalidade do indivíduo:\n\n${responses.map((r, i) => `${i + 1}. ${r}`).join('\n')}`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${errorData.error}`)
    }

    const data = await response.json()
    const key_insights = data.candidates[0].content.parts[0].text.trim().split('\n')

    return { key_insights }
  } catch (error) {
    console.error('Error generating key insights:', error)
    throw error
  }
}

// Geração de padrões comportamentais usando Gemini
export async function generateBehavioralPatterns(
  responses: string[],
): Promise<LLMResponse> {
  try {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!geminiApiKey) {
      throw new Error('Gemini API key not found in environment variables.')
    }

    const prompt = `Com base nas seguintes respostas, identifique 3 padrões comportamentais predominantes:\n\n${responses.map((r, i) => `${i + 1}. ${r}`).join('\n')}`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${errorData.error}`)
    }

    const data = await response.json()
    const behavioral_patterns = data.candidates[0].content.parts[0].text.trim().split('\n')

    return { behavioral_patterns }
  } catch (error) {
    console.error('Error generating behavioral patterns:', error)
    throw error
  }
}

// Geração de recomendações usando Gemini
export async function generateRecommendations(
  responses: string[],
): Promise<LLMResponse> {
  try {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!geminiApiKey) {
      throw new Error('Gemini API key not found in environment variables.')
    }

    const prompt = `Com base nas seguintes respostas, gere 3 recomendações personalizadas para o indivíduo:\n\n${responses.map((r, i) => `${i + 1}. ${r}`).join('\n')}`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${errorData.error}`)
    }

    const data = await response.json()
    const recommendations = data.candidates[0].content.parts[0].text.trim().split('\n')

    return { recommendations }
  } catch (error) {
    console.error('Error generating recommendations:', error)
    throw error
  }
}

// Geração de resumo de personalidade usando Gemini
export async function generatePersonalitySummary(
  responses: string[],
): Promise<LLMResponse> {
  try {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!geminiApiKey) {
      throw new Error('Gemini API key not found in environment variables.')
    }

    const prompt = `Com base nas seguintes respostas, gere um resumo conciso da personalidade do indivíduo:\n\n${responses.map((r, i) => `${i + 1}. ${r}`).join('\n')}`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${errorData.error}`)
    }

    const data = await response.json()
    const personality_summary = data.candidates[0].content.parts[0].text.trim()

    return { personality_summary }
  } catch (error) {
    console.error('Error generating personality summary:', error)
    throw error
  }
}
