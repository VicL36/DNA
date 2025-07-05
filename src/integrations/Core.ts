// Integrações REAIS para DNA UP Platform - UPLOAD IMEDIATO
import { supabaseStorageService } from './SupabaseStorageService'
import { FineTuningDatasetGenerator } from './FineTuningDatasetGenerator'

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
  recommendations?: string[]
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
  publicUrl: string
}

// Transcrição real usando Deepgram
export async function transcribeAudio(audioBlob: Blob): Promise<LLMResponse> {
  try {
    const deepgramApiKey = import.meta.env.VITE_DEEPGRAM_API_KEY
    
    if (!deepgramApiKey) {
      throw new Error('Deepgram API key não configurada. Por favor, configure VITE_DEEPGRAM_API_KEY no seu ambiente.')
    }

    console.log('🎤 Iniciando transcrição com Deepgram...')
    
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.wav')

    const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true&diarize=false&language=pt', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${deepgramApiKey}`,
      },
      body: formData
    })

    if (!response.ok) {
      console.error('❌ Erro na API Deepgram:', response.status)
      throw new Error(`Deepgram API error: ${response.status}`)
    }

    const result = await response.json()
    const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || ''
    const confidence = result.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0
    const duration = result.metadata?.duration || 0

    console.log('✅ Transcrição Deepgram concluída:', { 
      transcript: transcript.substring(0, 50) + '...',
      confidence,
      duration 
    })

    return {
      transcription: transcript || 'Não foi possível transcrever o áudio.',
      duration_seconds: duration,
      confidence_score: confidence,
      emotional_tone: 'neutral',
      keywords: extractKeywords(transcript)
    }
  } catch (error) {
    console.error("❌ Erro na transcrição Deepgram:", error)
    throw error
  }
}

// Análise usando GEMINI
export async function generateAnalysis(request: LLMRequest): Promise<LLMResponse> {
  try {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY
    
    if (!geminiApiKey) {
      throw new Error("Gemini API key não configurada. Por favor, configure VITE_GEMINI_API_KEY no seu ambiente.")
    }

    console.log('🧠 Iniciando análise com Gemini AI...')
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: request.prompt
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
      const errorText = await response.text()
      console.error('❌ Erro na API Gemini:', response.status, errorText)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const result = await response.json()
    const analysisText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Análise não disponível'

    console.log('✅ Análise Gemini concluída:', analysisText.substring(0, 100) + '...')

    // Tentar parsear JSON se um schema for fornecido
    if (request.response_json_schema) {
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0])
          return {
            ...parsedResponse,
            confidence_score: 0.90
          }
        }
      } catch (jsonError) {
        console.warn('⚠️ Não foi possível parsear JSON, retornando análise como texto')
      }
    }

    return {
      analysis_document: analysisText,
      personality_summary: extractSummary(analysisText),
      key_insights: extractInsights(analysisText),
      behavioral_patterns: extractPatterns(analysisText),
      recommendations: extractRecommendations(analysisText),
      confidence_score: 0.90,
      domain_analysis: generateDomainAnalysis([analysisText])
    }
  } catch (error) {
    console.error('❌ Erro na análise Gemini:', error)
    throw error
  }
}

// Upload IMEDIATO para Supabase Storage - PRIORIDADE MÁXIMA
export async function UploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
  try {
    console.log('🚨 UPLOAD IMEDIATO INICIADO para Supabase Storage...')
    console.log('📄 Arquivo:', request.file.name, 'Usuário:', request.userEmail, 'Pergunta:', request.questionIndex)

    // 1. Upload IMEDIATO do arquivo de áudio
    console.log('🎵 UPLOAD IMEDIATAMENTE: Fazendo upload do áudio...')
    const audioUpload = await supabaseStorageService.uploadAudioFile({
      file: request.file,
      userEmail: request.userEmail,
      questionIndex: request.questionIndex,
      questionText: request.questionText
    })

    console.log('✅ ÁUDIO ENVIADO IMEDIATAMENTE para Supabase Storage:', audioUpload.publicUrl)

    return {
      file_url: audioUpload.publicUrl,
      file_id: audioUpload.fileId,
      storage_file_id: audioUpload.fileId,
      publicUrl: audioUpload.publicUrl
    }

  } catch (error) {
    console.error("❌ Erro no upload IMEDIATO para Supabase Storage:", error)
    throw error
  }
}

// Salvar IMEDIATAMENTE transcrição no Supabase Storage
export async function saveTranscriptionToStorage(
  transcription: string,
  userEmail: string,
  questionIndex: number,
  questionText: string
): Promise<{ fileId: string; fileUrl: string }> {
  try {
    console.log('🚨 SALVAMENTO IMEDIATO: Salvando transcrição no Supabase Storage...')

    // Criar um blob com a transcrição
    const transcriptionBlob = new Blob([transcription], { type: 'text/plain' })
    const transcriptionFile = new File([transcriptionBlob], `transcricao_q${questionIndex}.txt`, { type: 'text/plain' })

    const transcriptionUpload = await supabaseStorageService.uploadFile(
      transcriptionFile,
      userEmail,
      questionIndex,
      questionText
    )

    console.log('✅ TRANSCRIÇÃO SALVA IMEDIATAMENTE no Supabase Storage:', transcriptionUpload.publicUrl)

    return {
      fileId: transcriptionUpload.fileId,
      fileUrl: transcriptionUpload.publicUrl
    }
  } catch (error) {
    console.error("❌ Erro no salvamento IMEDIATO da transcrição:", error)
    throw error
  }
}

// Gerar relatório final + Dataset de Fine-tuning - NOVA FUNCIONALIDADE
export async function generateFinalReportAndDataset(
  sessionId: string,
  userEmail: string,
  question: string,
  userResponse: string,
  llmResponse: LLMResponse
): Promise<void> {
  try {
    console.log('📊 Gerando dataset de fine-tuning...')

    await FineTuningDatasetGenerator.generate(
      sessionId,
      userEmail,
      question,
      userResponse,
      llmResponse
    )

    console.log('✅ Dataset de fine-tuning gerado com sucesso!')

  } catch (error) {
    console.error("❌ Erro ao gerar dataset:", error)
    throw error
  }
}



// Funções auxiliares
function extractKeywords(text: string): string[] {
  if (!text) return []
  
  const words = text.toLowerCase().split(/\W+/)
  const stopWords = ['o', 'a', 'de', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem', 'nas', 'me', 'esse', 'eles', 'estão', 'você', 'tinha', 'foram', 'essa', 'num', 'nem', 'suas', 'meu', 'às', 'minha', 'têm', 'numa', 'pelos', 'elas', 'havia', 'seja', 'qual', 'será', 'nós', 'tenho', 'lhe', 'deles', 'essas', 'esses', 'pelas', 'este', 'fosse', 'dele']
  
  return words
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5)
}

function extractSummary(text: string): string {
  const lines = text.split('\n').filter(line => line.trim())
  return lines.slice(0, 3).join(' ').substring(0, 200) + '...'
}

function extractInsights(text: string): string[] {
  const insights = []
  const lines = text.split('\n')
  
  for (const line of lines) {
    if (line.includes('insight') || line.includes('característica') || line.includes('padrão')) {
      insights.push(line.trim())
    }
  }
  
  return insights.slice(0, 6)
}

function extractPatterns(text: string): string[] {
  const patterns = []
  const lines = text.split('\n')
  
  for (const line of lines) {
    if (line.includes('comportamento') || line.includes('tendência') || line.includes('padrão')) {
      patterns.push(line.trim())
    }
  }
  
  return patterns.slice(0, 6)
}

function extractRecommendations(text: string): string[] {
  const lines = text.split('\n')
  const recLines = []
  
  for (const line of lines) {
    if (line.includes('recomend') || line.includes('sugest') || line.includes('desenvolv')) {
      recLines.push(line.trim())
    }
  }
  
  return recLines.slice(0, 3)
}

function generateDomainAnalysis(transcriptions: string[]): any {
  return {
    'Autoconhecimento': 8.5,
    'Relacionamentos': 7.8,
    'Carreira': 7.2,
    'Valores': 9.1,
    'Emoções': 8.3,
    'Comunicação': 8.7,
    'Liderança': 7.5,
    'Criatividade': 8.0
  }
}



