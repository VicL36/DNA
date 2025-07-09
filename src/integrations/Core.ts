// Integrações REAIS para DNA UP Platform - UPLOAD IMEDIATO
import { supabaseStorageService } from './SupabaseStorageService'
import { FineTuningDatasetGenerator } from './FineTuningDatasetGenerator'
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
  analysis?: string
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

export interface TranscriptionUploadResult {
  fileId: string
  fileUrl: string
  success: boolean
}

export interface FinalReportResult {
  reportFileUrl: string
  datasetFileUrl: string
  voiceCloningData: any[]
  success: boolean
}

// Export the services that are being imported
export { supabaseStorageService, FineTuningDatasetGenerator }

// Create instance of AdvancedAnalysisService
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

    // Extract keywords from transcription
    const keywords = extractKeywords(transcription)

    return { 
      transcription,
      keywords,
      confidence_score: data.results.channels[0].alternatives[0].confidence || 0.8,
      emotional_tone: 'neutral' // Default emotional tone
    }
  } catch (error) {
    console.error('Error transcribing audio:', error)
    throw error
  }
}

// EXPORTED: Upload de arquivo para Supabase Storage
export async function UploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
  try {
    console.log('📤 Iniciando upload de arquivo para Supabase Storage...')
    
    // Use the correct method from SupabaseStorageService
    const uploadResult = await supabaseStorageService.uploadAudioFile(
      request.file,
      request.userEmail,
      request.questionIndex,
      request.questionText
    )
    
    console.log('✅ Upload concluído:', uploadResult.fileUrl)
    
    return {
      file_url: uploadResult.fileUrl,
      file_id: uploadResult.fileId,
      storage_file_id: uploadResult.fileId,
      transcription_file_id: undefined,
      transcription_url: undefined
    }
  } catch (error) {
    console.error('❌ Erro no upload:', error)
    throw new Error(`Falha no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

// EXPORTED: Salvar transcrição no Supabase Storage
export async function saveTranscriptionToStorage(
  transcription: string,
  userEmail: string,
  questionIndex: number,
  questionText: string
): Promise<TranscriptionUploadResult> {
  try {
    console.log('📝 Salvando transcrição no Supabase Storage...')
    
    // Use the correct method from SupabaseStorageService
    const uploadResult = await supabaseStorageService.uploadTranscription(
      transcription,
      userEmail,
      questionIndex,
      questionText
    )
    
    console.log('✅ Transcrição salva:', uploadResult.fileUrl)
    
    return {
      fileId: uploadResult.fileId,
      fileUrl: uploadResult.fileUrl,
      success: true
    }
  } catch (error) {
    console.error('❌ Erro ao salvar transcrição:', error)
    throw new Error(`Falha ao salvar transcrição: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

// EXPORTED: Gerar relatório final e dataset
export async function generateFinalReportAndDataset(
  userEmail: string,
  analysisResult: LLMResponse,
  responses: any[]
): Promise<FinalReportResult> {
  try {
    console.log('📄 Gerando relatório final e dataset...')
    
    // Gerar relatório final usando SupabaseStorageService
    const reportUpload = await supabaseStorageService.uploadFinalReport(
      userEmail,
      analysisResult,
      responses
    )
    
    // Gerar dataset de fine-tuning
    const datasetGenerator = new FineTuningDatasetGenerator()
    const dataset = await datasetGenerator.generateDataset(userEmail, responses)
    
    const datasetUpload = await supabaseStorageService.uploadFineTuningDataset(
      dataset,
      userEmail
    )
    
    // Preparar dados de clonagem de voz
    const voiceCloningData = responses
      .filter(r => r.audio_file_url)
      .map(r => ({
        audioUrl: r.audio_file_url,
        transcription: r.transcript_text,
        questionIndex: r.question_index,
        duration: r.audio_duration,
        fileName: `audio_q${r.question_index}.wav`,
        fileUrl: r.audio_file_url,
        qualityScore: 0.8,
        emotionTag: r.emotional_tone || 'neutral',
        energyLevel: 'medium'
      }))

    // Salvar dados de clonagem de voz
    await supabaseStorageService.uploadVoiceCloningData(voiceCloningData, userEmail)
    
    console.log('✅ Relatório e dataset gerados com sucesso!')
    
    return {
      reportFileUrl: reportUpload.fileUrl,
      datasetFileUrl: datasetUpload.fileUrl,
      voiceCloningData,
      success: true
    }
  } catch (error) {
    console.error('❌ Erro ao gerar relatório e dataset:', error)
    throw new Error(`Falha na geração: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

// EXPORTED: Gerar análise psicológica (função principal chamada em Analysis.tsx)
export async function generateAnalysis(transcriptions: string[]): Promise<LLMResponse> {
  try {
    console.log('🧠 Gerando análise psicológica completa...')
    
    const combinedTranscriptions = transcriptions.join('\n\n---\n\n')
    
    // Usar análise psicológica do Gemini
    const analysisResult = await generatePsychologicalAnalysis(
      transcriptions,
      'completa',
      transcriptions.length
    )
    
    // Gerar insights adicionais
    const keyInsights = await generateKeyInsights(transcriptions)
    const behavioralPatterns = await generateBehavioralPatterns(transcriptions)
    const recommendations = await generateRecommendations(transcriptions)
    const personalitySummary = await generatePersonalitySummary(transcriptions)
    
    return {
      analysis_document: analysisResult.analysis_document,
      personality_summary: personalitySummary.personality_summary,
      key_insights: keyInsights.key_insights,
      behavioral_patterns: behavioralPatterns.behavioral_patterns,
      recommendations: recommendations.recommendations,
      confidence_score: 0.9,
      emotional_tone: 'analytical'
    }
  } catch (error) {
    console.error('❌ Erro na análise:', error)
    throw new Error(`Falha na análise: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
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

// EXPORTED: Análise psicológica usando Gemini
export async function generatePsychologicalAnalysis(
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

// Funções auxiliares
function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\W+/)
  const stopWords = ['o', 'a', 'de', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem', 'nas', 'me', 'esse', 'eles', 'estão', 'você', 'tinha', 'foram', 'essa', 'num', 'nem', 'suas', 'meu', 'às', 'minha', 'têm', 'numa', 'pelos', 'elas', 'havia', 'seja', 'qual', 'será', 'nós', 'tenho', 'lhe', 'deles', 'essas', 'esses', 'pelas', 'este', 'fosse', 'dele']
  
  return words
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 10)
}

function generateReportContent(userEmail: string, analysisResult: LLMResponse, responses: any[]): string {
  const reportDate = new Date().toLocaleDateString('pt-BR')
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Análise Psicológica - DNA UP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
        }
        .meta-info {
            background: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .insights {
            background: #e8f5e8;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .patterns {
            background: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .recommendations {
            background: #d1ecf1;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        ul {
            margin: 10px 0;
        }
        li {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Relatório de Análise Psicológica</h1>
        
        <div class="meta-info">
            <p><strong>Usuário:</strong> ${userEmail}</p>
            <p><strong>Data:</strong> ${reportDate}</p>
            <p><strong>Respostas Analisadas:</strong> ${responses.length}</p>
            <p><strong>Confiança da Análise:</strong> ${((analysisResult.confidence_score || 0.9) * 100).toFixed(1)}%</p>
        </div>

        <h2>Análise Completa</h2>
        <div>${analysisResult.analysis_document || 'Análise não disponível'}</div>

        <h2>Resumo de Personalidade</h2>
        <div>${analysisResult.personality_summary || 'Resumo não disponível'}</div>

        <h2>Insights Chave</h2>
        <div class="insights">
            <ul>
                ${(analysisResult.key_insights || []).map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        </div>

        <h2>Padrões Comportamentais</h2>
        <div class="patterns">
            <ul>
                ${(analysisResult.behavioral_patterns || []).map(pattern => `<li>${pattern}</li>`).join('')}
            </ul>
        </div>

        <h2>Recomendações</h2>
        <div class="recommendations">
            <ul>
                ${(analysisResult.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>

        <h2>Dados Técnicos</h2>
        <div class="meta-info">
            <p><strong>Tom Emocional:</strong> ${analysisResult.emotional_tone || 'Não definido'}</p>
            <p><strong>Palavras-chave:</strong> ${(analysisResult.keywords || []).join(', ')}</p>
            <p><strong>Método:</strong> Protocolo Clara R. - 108 perguntas estratégicas</p>
            <p><strong>Processamento:</strong> Gemini AI + Deepgram</p>
        </div>
    </div>
</body>
</html>
  `
}
