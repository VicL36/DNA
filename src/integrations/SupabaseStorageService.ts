// Serviço REAL de Supabase Storage - DNA UP Platform
import { supabase } from '@/lib/supabase'

export interface SupabaseStorageConfig {
  bucketName: string
  baseUrl: string
}

export interface StorageUploadResponse {
  fileId: string
  fileName: string
  fileUrl: string
  publicUrl: string
  downloadUrl: string
}

export class SupabaseStorageService {
  private config: SupabaseStorageConfig

  constructor() {
    this.config = {
      bucketName: import.meta.env.VITE_SUPABASE_BUCKET_NAME || 'dna-protocol-files',
      baseUrl: import.meta.env.VITE_SUPABASE_URL || ''
    }

    console.log('🔧 Configurando Supabase Storage Service...')
    console.log('🪣 Bucket Name:', this.config.bucketName)
    console.log('🔗 Base URL:', this.config.baseUrl?.substring(0, 30) + '...')
  }

  /**
   * @description Gera o caminho da pasta para um usuário específico.
   * @param {string} userEmail - O email do usuário.
   * @returns {string} O caminho da pasta do usuário.
   */
  private getUserFolderPath(userEmail: string): string {
    // Adiciona uma verificação para garantir que userEmail não seja nulo ou indefinido.
    if (!userEmail) {
      console.error("Erro Crítico: userEmail não foi fornecido para gerar o caminho da pasta.");
      throw new Error("userEmail é nulo ou indefinido. Impossível continuar com a operação de armazenamento.");
    }
    const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
    return `users/${sanitizedEmail}`
  }

  /**
   * @description Faz o upload de um arquivo de áudio.
   * @param {object} request - O objeto da requisição contendo o blob do áudio e metadados.
   * @returns {Promise<StorageUploadResponse>} A resposta do upload.
   */
  async uploadAudioFile(request: {
    audioBlob: Blob,
    userEmail: string,
    questionIndex: number,
    questionText: string
  }): Promise<StorageUploadResponse> {
    try {
      console.log('🎵 Iniciando upload de áudio para Supabase Storage...')
      
      const userFolderPath = this.getUserFolderPath(request.userEmail)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `Q${request.questionIndex.toString().padStart(3, '0')}_AUDIO_${timestamp}.wav`
      const filePath = `${userFolderPath}/audio/${fileName}`

      // Cria um objeto File a partir do Blob, fornecendo um nome de arquivo.
      const audioFile = new File([request.audioBlob], fileName, { type: 'audio/wav' });
      
      console.log('📄 Arquivo:', audioFile.name, 'Tamanho:', audioFile.size, 'bytes')
      console.log('📤 Fazendo upload do áudio para:', filePath)

      const { data, error } = await supabase.storage
        .from(this.config.bucketName)
        .upload(filePath, audioFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'audio/wav'
        })

      if (error) {
        console.error('❌ Erro no upload do áudio:', error)
        throw new Error(`Erro no upload do áudio: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from(this.config.bucketName)
        .getPublicUrl(filePath)

      console.log('✅ Áudio enviado com sucesso para Supabase Storage!')
      console.log('📁 Path:', data.path)
      console.log('🔗 URL:', publicUrlData.publicUrl)

      return {
        fileId: data.path,
        fileName: fileName,
        fileUrl: publicUrlData.publicUrl,
        publicUrl: publicUrlData.publicUrl,
        downloadUrl: publicUrlData.publicUrl
      }

    } catch (error) {
      console.error('❌ Erro no upload do áudio:', error)
      throw new Error(`Falha no upload do áudio: ${(error as Error).message}`)
    }
  }

  /**
   * @description Faz o upload de uma transcrição.
   * @param {string} transcription - O texto da transcrição.
   * @param {string} userEmail - O email do usuário.
   * @param {number} questionIndex - O índice da pergunta.
   * @param {string} questionText - O texto da pergunta.
   * @returns {Promise<StorageUploadResponse>} A resposta do upload.
   */
  async uploadTranscription(
    transcription: string,
    userEmail: string,
    questionIndex: number,
    questionText: string
  ): Promise<StorageUploadResponse> {
    try {
      console.log('📝 Enviando transcrição para Supabase Storage...')

      const userFolderPath = this.getUserFolderPath(userEmail)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `Q${questionIndex.toString().padStart(3, '0')}_TRANSCRICAO_${timestamp}.txt`
      const filePath = `${userFolderPath}/transcriptions/${fileName}`
      
      const content = `DNA UP - Análise Narrativa Profunda\nData: ${new Date().toLocaleString('pt-BR')}\nUsuário: ${userEmail}\nPergunta ${questionIndex}: ${questionText}\n\nTRANSCRIÇÃO:\n${transcription}\n\n---\nGerado automaticamente pelo DNA UP Platform`

      const blob = new Blob([content], { type: 'text/plain; charset=utf-8' })

      console.log('📤 Fazendo upload da transcrição para:', filePath)

      const { data, error } = await supabase.storage
        .from(this.config.bucketName)
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'text/plain'
        })

      if (error) {
        console.error('❌ Erro no upload da transcrição:', error)
        throw new Error(`Erro no upload da transcrição: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from(this.config.bucketName)
        .getPublicUrl(filePath)

      console.log('✅ Transcrição enviada com sucesso para Supabase Storage!')
      console.log('📁 Path:', data.path)

      return {
        fileId: data.path,
        fileName: fileName,
        fileUrl: publicUrlData.publicUrl,
        publicUrl: publicUrlData.publicUrl,
        downloadUrl: publicUrlData.publicUrl
      }

    } catch (error) {
      console.error('❌ Erro ao enviar transcrição:', error)
      throw new Error(`Falha no upload da transcrição: ${(error as Error).message}`)
    }
  }

  /**
   * @description Faz o upload do dataset de fine-tuning.
   * @param {any[]} dataset - O array de dados do dataset.
   * @param {string} userEmail - O email do usuário.
   * @returns {Promise<StorageUploadResponse>} A resposta do upload.
   */
  async uploadFineTuningDataset(
    dataset: any[],
    userEmail: string
  ): Promise<StorageUploadResponse> {
    try {
      console.log('🤖 Enviando dataset de fine-tuning para Supabase Storage...')

      const userFolderPath = this.getUserFolderPath(userEmail)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `DNA_UP_FINE_TUNING_DATASET_${timestamp}.jsonl`
      const filePath = `${userFolderPath}/datasets/${fileName}`
      
      const jsonlContent = dataset.map(item => JSON.stringify(item)).join('\n')
      const blob = new Blob([jsonlContent], { type: 'application/jsonl' })

      console.log('📤 Fazendo upload do dataset para:', filePath)

      const { data, error } = await supabase.storage
        .from(this.config.bucketName)
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/jsonl'
        })

      if (error) {
        console.error('❌ Erro no upload do dataset:', error)
        throw new Error(`Erro no upload do dataset: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from(this.config.bucketName)
        .getPublicUrl(filePath)

      console.log('✅ Dataset de fine-tuning enviado com sucesso!')
      console.log('📁 Path:', data.path)

      return {
        fileId: data.path,
        fileName: fileName,
        fileUrl: publicUrlData.publicUrl,
        publicUrl: publicUrlData.publicUrl,
        downloadUrl: publicUrlData.publicUrl
      }

    } catch (error) {
      console.error('❌ Erro ao enviar dataset:', error)
      throw new Error(`Falha no upload do dataset: ${(error as Error).message}`)
    }
  }

  /**
   * @description Faz o upload do relatório final em PDF.
   * @param {string} userEmail - O email do usuário.
   * @param {any} analysisData - Os dados da análise.
   * @param {any[]} responses - As respostas do usuário.
   * @returns {Promise<StorageUploadResponse>} A resposta do upload.
   */
  async uploadFinalReport(
    userEmail: string,
    analysisData: any,
    responses: any[]
  ): Promise<StorageUploadResponse> {
    try {
      console.log('📊 Gerando e fazendo upload do relatório final em PDF...')

      const { PDFReportGenerator } = await import('./PDFReportGenerator')

      const userFolderPath = this.getUserFolderPath(userEmail)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `DNA_UP_RELATORIO_COMPLETO_${timestamp}.pdf`
      const filePath = `${userFolderPath}/reports/${fileName}`
      
      const pdfBlob = await PDFReportGenerator.generate({
        userEmail,
        analysisData,
        responses,
        timestamp: new Date().toISOString()
      })

      console.log('📤 Fazendo upload do relatório PDF para:', filePath)

      const { data, error } = await supabase.storage
        .from(this.config.bucketName)
        .upload(filePath, pdfBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf'
        })

      if (error) {
        console.error('❌ Erro no upload do relatório PDF:', error)
        throw new Error(`Erro no upload do relatório PDF: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from(this.config.bucketName)
        .getPublicUrl(filePath)

      console.log('✅ Relatório PDF enviado com sucesso!')
      console.log('📁 Path:', data.path)

      return {
        fileId: data.path,
        fileName: fileName,
        fileUrl: publicUrlData.publicUrl,
        publicUrl: publicUrlData.publicUrl,
        downloadUrl: publicUrlData.publicUrl
      }

    } catch (error) {
      console.error('❌ Erro ao gerar/enviar relatório PDF:', error)
      throw new Error(`Falha ao gerar/enviar relatório PDF: ${(error as Error).message}`)
    }
  }

  /**
   * @description Verifica se o serviço está configurado.
   * @returns {boolean} Verdadeiro se configurado.
   */
  isConfigured(): boolean {
    return !!(this.config.bucketName && this.config.baseUrl)
  }

  /**
   * @description Obtém informações de configuração para depuração.
   * @returns {object} Objeto com o status da configuração.
   */
  getConfigInfo() {
    return {
      hasBucketName: !!this.config.bucketName,
      hasBaseUrl: !!this.config.baseUrl,
      isConfigured: this.isConfigured()
    }
  }
}

export const supabaseStorageService = new SupabaseStorageService()
