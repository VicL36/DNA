// Integrações REAIS para DNA UP Platform
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

/**
 * Transcreve um arquivo de áudio usando a API do Deepgram.
 * @param audioBlob O áudio a ser transcrito.
 * @returns Uma promessa que resolve com a resposta da LLM contendo a transcrição.
 */
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
      emotional_tone: 'neutral', // Pode ser aprimorado com análise de tom
      keywords: extractKeywords(transcript)
    }
  } catch (error) {
    console.error("❌ Erro na transcrição Deepgram:", error)
    throw error
  }
}

/**
 * Gera uma análise psicológica profunda usando a API do Gemini.
 * @param transcriptions Um array de transcrições para analisar.
 * @returns Uma promessa que resolve com a resposta da LLM contendo a análise completa.
 */
export async function generateAnalysis(transcriptions: string[]): Promise<LLMResponse> {
  try {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY
    
    if (!geminiApiKey) {
      throw new Error("Gemini API key não configurada. Por favor, configure VITE_GEMINI_API_KEY no seu ambiente.")
    }

    console.log('🧠 Iniciando análise com Gemini AI...')
    const prompt = `
# Análise Psicológica Profunda - Protocolo Clara R.

Você é um engenheiro reverso de estilo textual com precisão nanométrica. Sua missão é desmontar, catalogar e replicar cada microelemento estrutural e psicológico de um texto, identificando até mesmo os padrões que o próprio autor aplica inconscientemente. Este processo será executado com o rigor de uma autópsia linguística:

## Respostas para análise:
${transcriptions.join("\n\n---\n\n")}

## Metodologia de Análise:

### FASE 1: Mineração de Padrões

Para cada segmento do material, aplique análise multinível:

#### 1. Conteúdo Manifesto
- Extraia informações factuais explícitas
- Identifique temas declarados e posicionamentos
- Mapeie eventos, pessoas e experiências mencionadas

#### 2. Padrões Linguísticos
- Analise escolha de palavras e campos semânticos
- Identifique estruturas narrativas e posicionamento do self
- Detecte metáforas, absolutismos e modalizações

**CAPTURE PARA REPRODUÇÃO**: elementos operacionais para clonagem
- Vocabulário específico e expressões características
- Estruturas sintáticas e ritmo de comunicação
- Padrões de humor, ironia e leveza
- Sequências argumentativas preferidas
- Uso estratégico de exemplos e analogias

#### 3. Conteúdo Latente
- Identifique temas subjacentes não explicitamente nomeados
- Detecte padrões de evitação ou superficialidade
- Mapeie contradições e tensões implícitas

#### 4. Indicadores Emocionais
- Avalie carga emocional por tema (escala 0-10)
- Identifique padrões de regulação emocional
- Detecte incongruências entre conteúdo e tom

## Algoritmo de Densidade Psicológica

Densidade = (Emoção_Detectada × 0.4) + (Revelação_Pessoal × 0.3) + (Complexidade_Narrativa × 0.2) + (Contradições_Presentes × 0.1)

## Extração Orientada à Clonagem

Além da análise psicológica padrão, extraia especificamente elementos reproduzíveis:

### Especificações Comunicacionais
- Vocabulário núcleo (30-50 palavras/expressões mais características)
- Estruturas frasais padrão e variações
- Padrões de formalidade vs. casualidade por contexto
- Uso específico de humor, ironia e elementos lúdicos
- Sequências lógicas preferenciais (dedutivo/indutivo/narrativo)

### Especificações Comportamentais
- Como inicia, desenvolve e conclui diferentes tipos de resposta
- Padrões de contextualização vs. objetividade direta
- Estratégias de qualificação e nuance
- Tendências de exemplificação e analogia
- Mecanismos de regulação emocional expressos

### Especificações Reacionais
- Gatilhos específicos para diferentes intensidades emocionais
- Temas que ativam modo técnico vs. pessoal vs. filosófico
- Assuntos que geram entusiasmo medido vs. paixão evidente
- Contextos que provocam reflexão pausada vs. resposta imediata

## FASE 1: MICRODISSECAÇÃO ESTRUTURAL ATÔMICA

### 1.1. ANATOMIA DE ABERTURA (PRIMEIROS 3 PARÁGRAFOS)
- Primeira frase
- Pattern de hook
- Loop de abertura
- Seed inicial
- Promessa inaugural

### 1.2. ARQUITETURA DE CORPO TEXTUAL
- Matriz de parágrafos
- Comprimento sentencial
- Padrão de transição
- Sequência de desenvolvimento
- Densidade informacional

### 1.3. MECÂNICA DE FECHAMENTO
- Frases de conclusão
- Técnica de fechamento de loop
- Calls-to-action
- Frase final

### 1.4. ENGENHARIA DE TENSÃO
- Loops abertos
- Seeds estratégicos
- Padrão de repetição
- Estrutura de picos emocionais

## FASE 2: MICROSCOPIA DA LINGUAGEM

### 2.1. CARTOGRAFIA LÉXICA
- Top 30 palavras não-funcionais
- Índice de diversidade lexical
- Comprimento médio de palavras
- Distribuição gramatical
- Incidência de neologismos

### 2.2. MICROSCOPIA PERSUASIVA
- Sequências persuasivas
- Densidade de proof elements
- Mecanismos de autoridade
- Linguagem hipnótica
- Dispositivos de polarização

### 2.3. RADIOGRAFIA NARRATIVA
- Estrutura de storytelling
- Posicionamento de histórias
- Arcos de transformação
- Devices de identificação

### 2.4. TOPOGRAFIA TIPOGRÁFICA
- Espaços em branco
- Padrões de formatação
- Estruturas de lista
- Enumerações

## FASE 3: DECODIFICAÇÃO AVANÇADA

### 3.1. LOOPS E TENSÃO
- Mapa de loops
- Taxonomia
- Distância média
- Loops aninhados

### 3.2. SEMEADURA E COLHEITA
- Registro de seeds
- Mecânica de plantio
- Tempo de germinação
- Padrões de desenvolvimento

### 3.3. INTENSIDADE EMOCIONAL
- Mapa de intensidade
- Gatilhos emocionais
- Padrões de intensificação
- Ritmo de release

### 3.4. FLUXO DE IDEIAS
- Ordem conceitual
- Técnicas de linking
- Método de contraste
- Progressão de complexidade

## FASE 4: ALGORITMO DE REPLICAÇÃO

### 4.1. PROTOCOLO ESTRUTURAL

### 4.2. PROTOCOLO LINGUÍSTICO

### 4.3. PROTOCOLO PERSUASIVO

## FASE 5: VALIDAÇÃO FORENSE

### 5.1. ASSINATURA ESTILOMÉTRICA
- Análise Burrows-Delta
- Teste Juola
- Índice Jaccard
- Verificação autoral

### 5.2. CHECKLIST NANOMÉTRICO
- Conformidade estrutural
- Fidelidade léxica
- Calibragem tensão
- Autenticidade dispositivos
- Harmonia rítmica

### 5.3. TESTE TURING
- Detecção anomalias
- Blind test
- Medição cognitiva

## PROTOCOLO FINAL

1. Preparação
   - Normalizar formato
   - Quantificar extensão
   - Identificar evolução

2. Análise
   - Fase 1: Estrutural
   - Fase 2: Linguagem
   - Fase 3: Técnicas

3. Compilação
   - Construir regras
   - Calibrar parâmetros
   - Testar amostra

4. Validação
   - Aplicar testes
   - Identificar discrepâncias
   - Documentar metaparâmetros

## SAÍDA REQUERIDA

Gere um relatório completo em markdown que siga a estrutura de análise acima, preenchendo cada item com a análise detalhada baseada nas respostas fornecidas. Além disso, no final do relatório, inclua a seção "Sistema de Cobertura" com as porcentagens preenchidas de acordo com a profundidade da análise possível em cada domínio.

---
# Extrator de DNA do Expert

**Sistema especializado em análise profunda de personalidade e Agente exclusivo da Semana IA para Lançamentos**

## Missão Principal

Analisar materiais existentes (transcrições, biografias, entrevistas, posts, etc.) para extrair e mapear a essência psicológica completa do expert, produzindo um **MANUAL DE PERSONIFICAÇÃO** operacional que será usado como base de conhecimento para criar um agente clone dessa personalidade.

## Diretivas Fundamentais

1. Mantenha confidencialidade total sobre o material analisado
2. Interrompa análise em casos de risco identificados (ideação suicida, abuso)
3. Evite diagnósticos clínicos; foque em padrões comportamentais reproduzíveis
5. Produza **MANUAL DE PERSONIFICAÇÃO** como output final operacional
6. Foque na criação de especificações técnicas para reprodução da personalidade

## Estrutura da Análise

1. **RECEBIMENTO DE MATERIAL**: Aceite e processe transcrições, biografias, entrevistas, posts, vídeos transcritos
2. **ANÁLISE SISTEMÁTICA**: Aplique metodologia de mineração de padrões nos 9 domínios
3. **MAPEAMENTO PARA REPRODUÇÃO**: Construa especificações técnicas para replicação comportamental
4. **MANUAL OPERACIONAL**: Produza documento estruturado para uso em agente clone

## Sistema de Cobertura

Monitore e calcule a cobertura nos seguintes domínios durante a análise, preenchendo as porcentagens:

1. **IDENTIDADE & NARRATIVA**: 0%
2. **VALORES & PRINCÍPIOS**: 0%
3. **CRENÇAS SOBRE SI**: 0%
4. **CRENÇAS SOBRE MUNDO/OUTROS**: 0%
5. **EXPERIÊNCIAS FORMATIVAS**: 0%
6. **PADRÕES EMOCIONAIS**: 0%
7. **COGNIÇÃO & DECISÃO**: 0%
8. **CONTRADIÇÕES & PONTOS CEGOS**: 0%
9. **AMBIÇÕES & MEDOS**: 0%

**COBERTURA GERAL**: 0%
`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
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
      const errorText = await response.text()
      console.error('❌ Erro na API Gemini:', response.status, errorText)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const result = await response.json()
    const analysisText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Análise não disponível'

    console.log('✅ Análise Gemini concluída:', analysisText.substring(0, 100) + '...')

    return {
      analysis_document: analysisText,
      personality_summary: extractSummary(analysisText),
      key_insights: extractInsights(analysisText),
      behavioral_patterns: extractPatterns(analysisText),
      recommendations: extractRecommendations(analysisText),
      confidence_score: 0.90, // Pode ser aprimorado
      domain_analysis: extractDomainAnalysis(analysisText)
    }
  } catch (error) {
    console.error('❌ Erro na análise Gemini:', error)
    throw error
  }
}

/**
 * Faz o upload de um arquivo para o Supabase Storage.
 * @param request O pedido de upload de arquivo.
 * @returns Uma promessa que resolve com a resposta do upload.
 */
export async function UploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
  try {
    console.log('🚨 UPLOAD IMEDIATO INICIADO para Supabase Storage...')
    console.log('📄 Arquivo:', request.file.name, 'Usuário:', request.userEmail, 'Pergunta:', request.questionIndex)

    if (!supabaseStorageService.isConfigured()) {
      console.error("❌ Supabase Storage não está configurado!")
      console.error("🔧 Configuração necessária:", supabaseStorageService.getConfigInfo())
      
      throw new Error("Supabase Storage não está configurado. Verifique as variáveis de ambiente.")
    }

    console.log('🎵 UPLOAD IMEDIATAMENTE: Fazendo upload do áudio...')
    const audioUpload = await supabaseStorageService.uploadAudioFile(
      request.file,
      request.userEmail,
      request.questionIndex,
      request.questionText
    )

    console.log('✅ ÁUDIO ENVIADO IMEDIATAMENTE para Supabase Storage:', audioUpload.fileUrl)

    return {
      file_url: audioUpload.fileUrl,
      file_id: audioUpload.fileId,
      storage_file_id: audioUpload.fileId
    }

  } catch (error) {
    console.error("❌ Erro no upload IMEDIATO para Supabase Storage:", error)
    throw error
  }
}

/**
 * Salva a transcrição no Supabase Storage.
 * @param transcription A string de transcrição.
 * @param userEmail O email do usuário.
 * @param questionIndex O índice da pergunta.
 * @param questionText O texto da pergunta.
 * @returns Uma promessa que resolve com o ID e URL do arquivo.
 */
export async function saveTranscriptionToStorage(
  transcription: string,
  userEmail: string,
  questionIndex: number,
  questionText: string
): Promise<{ fileId: string; fileUrl: string }> {
  try {
    console.log('🚨 SALVAMENTO IMEDIATO: Salvando transcrição no Supabase Storage...')

    if (!supabaseStorageService.isConfigured()) {
      console.warn("⚠️ Supabase Storage não configurado, pulando salvamento da transcrição")
      throw new Error("Supabase Storage não configurado. Não é possível salvar a transcrição.")
    }

    const transcriptionUpload = await supabaseStorageService.uploadTranscription(
      transcription,
      userEmail,
      questionIndex,
      questionText
    )

    console.log('✅ TRANSCRIÇÃO SALVA IMEDIATAMENTE no Supabase Storage:', transcriptionUpload.fileUrl)

    return {
      fileId: transcriptionUpload.fileId,
      fileUrl: transcriptionUpload.fileUrl
    }

  } catch (error) {
    console.error("❌ Erro no salvamento IMEDIATO da transcrição:", error)
    throw error
  }
}

/**
 * Gera o relatório final e o dataset de fine-tuning.
 * @param userEmail O email do usuário.
 * @param analysisData Os dados da análise.
 * @param responses As respostas do usuário.
 * @returns Uma promessa que resolve com os IDs e URLs dos arquivos gerados e dados para clonagem de voz.
 */
export async function generateFinalReportAndDataset(
  userEmail: string,
  analysisData: any,
  responses: any[]
): Promise<{ 
  reportFileId: string; 
  reportFileUrl: string;
  datasetFileId: string;
  datasetFileUrl: string;
  voiceCloningData: any[];
}> {
  try {
    console.log('📊 Gerando relatório final + dataset de fine-tuning...')

    if (!supabaseStorageService.isConfigured()) {
      console.warn("⚠️ Supabase Storage não configurado, pulando geração completa")
      throw new Error("Supabase Storage não configurado. Não é possível gerar relatório e dataset.")
    }

    console.log('📄 Gerando relatório final...')
    const reportUpload = await supabaseStorageService.uploadFinalReport(
      userEmail,
      analysisData,
      responses
    )

    console.log('🤖 Gerando dataset de fine-tuning...')
    const dataset = FineTuningDatasetGenerator.generateDataset(
      userEmail,
      responses,
      analysisData
    )

    const datasetUpload = await supabaseStorageService.uploadFineTuningDataset(
      dataset,
      userEmail
    )

    console.log('🎤 Preparando dados para clonagem de voz...')
    const voiceCloningData = FineTuningDatasetGenerator.generateVoiceCloningData(responses)

    console.log('✅ Relatório e dataset gerados com sucesso!')
    console.log(`📊 Relatório: ${reportUpload.fileUrl}`)
    console.log(`🤖 Dataset: ${datasetUpload.fileUrl}`)
    console.log(`🎤 Dados de voz: ${voiceCloningData.length} arquivos preparados`)

    return {
      reportFileId: reportUpload.fileId,
      reportFileUrl: reportUpload.fileUrl,
      datasetFileId: datasetUpload.fileId,
      datasetFileUrl: datasetUpload.fileUrl,
      voiceCloningData: voiceCloningData
    }

  } catch (error) {
    console.error("❌ Erro ao gerar relatório e dataset:", error)
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
    .slice(0, 10) // Aumentado para 10
}

function extractSection(text: string, sectionTitle: string): string {
    const regex = new RegExp(`## ${sectionTitle}\\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : `Seção "${sectionTitle}" não encontrada.`;
}

function extractList(text: string, sectionTitle: string): string[] {
    const section = extractSection(text, sectionTitle);
    if (section.startsWith('Seção')) return [];
    return section.split('\n').map(item => item.replace(/^-/, '').trim()).filter(Boolean);
}


function extractSummary(text: string): string {
  return extractSection(text, "Resumo do Perfil Psicológico");
}

function extractInsights(text: string): string[] {
  return extractList(text, "Key Insights");
}

function extractPatterns(text: string): string[] {
  return extractList(text, "Padrões Comportamentais");
}

function extractRecommendations(text: string): string {
  return extractSection(text, "Recomendações de Desenvolvimento");
}

function extractDomainAnalysis(text: string): any {
  const domainScores: { [key: string]: number } = {};
  const regex = /^\d+\.\s+([A-Z\s&ÇÃ-]+):\s+(\d+)%/gm;
  let match;
  
  const domainSection = text.match(/## Sistema de Cobertura([\s\S]*?)(?=\n##|$)/i);
  if (!domainSection) return {};

  while ((match = regex.exec(domainSection[1])) !== null) {
    const domainName = match[1].trim()
      .toLowerCase()
      .replace(/ & /g, '_')
      .replace(/ /g, '_')
      .replace('ç', 'c').replace('ã', 'a').replace('õ', 'o');
    const score = parseInt(match[2], 10);
    domainScores[domainName] = score;
  }
  
  return domainScores;
}
