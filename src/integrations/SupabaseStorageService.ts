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

      return this.buildUploadResponse(fileName, filePath)
    } catch (err) {
      throw new Error(`Falha ao enviar arquivo de áudio: ${err}`)
    }
  }

  /**
   * @description Faz o upload de um relatório final (PDF ou TXT).
   * @param {object} request - O objeto contendo o blob do relatório e metadados.
   * @returns {Promise<StorageUploadResponse>} A resposta do upload.
   */
  async uploadFinalReport(request: {
    userEmail: string,
    reportBlob: Blob,
    reportType?: "pdf" | "txt"
  }): Promise<StorageUploadResponse> {
    try {
      console.log('📄 Iniciando upload do relatório final para Supabase Storage...')
      const userFolderPath = this.getUserFolderPath(request.userEmail)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const type = request.reportType ?? "pdf"
      const fileName = `FINAL_REPORT_${timestamp}.${type}`
      const filePath = `${userFolderPath}/reports/${fileName}`

      const reportFile = new File([request.reportBlob], fileName, { type: type === "pdf" ? 'application/pdf' : 'text/plain' });

      const { error } = await supabase.storage
        .from(this.config.bucketName)
        .upload(filePath, reportFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: type === 'pdf' ? 'application/pdf' : 'text/plain'
        })

      if (error) {
        console.error('❌ Erro no upload do relatório:', error)
        throw new Error(`Erro no upload do relatório: ${error.message}`)
      }

      return this.buildUploadResponse(fileName, filePath)
    } catch (err) {
      throw new Error(`Falha ao enviar relatório final: ${err}`)
    }
  }

  /**
   * @description Faz o upload genérico de qualquer arquivo.
   * @param {object} request - O objeto contendo o blob do arquivo, nome e caminho.
   * @returns {Promise<StorageUploadResponse>} A resposta do upload.
   */
  async uploadGenericFile(request: {
    userEmail: string,
    fileBlob: Blob,
    fileName: string,
    folder?: string,
    mimeType?: string
  }): Promise<StorageUploadResponse> {
    try {
      const userFolderPath = this.getUserFolderPath(request.userEmail)
      const folderPath = request.folder ? `${userFolderPath}/${request.folder}` : userFolderPath
      const filePath = `${folderPath}/${request.fileName}`

      const file = new File([request.fileBlob], request.fileName, { type: request.mimeType || 'application/octet-stream' });

      const { error } = await supabase.storage
        .from(this.config.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: request.mimeType || 'application/octet-stream'
        })

      if (error) {
        console.error('❌ Erro no upload do arquivo:', error)
        throw new Error(`Erro no upload do arquivo: ${error.message}`)
      }

      return this.buildUploadResponse(request.fileName, filePath)
    } catch (err) {
      throw new Error(`Falha ao enviar arquivo genérico: ${err}`)
    }
  }

  private buildUploadResponse(fileName: string, filePath: string): StorageUploadResponse {
    const fileUrl = `${this.config.baseUrl}/storage/v1/object/public/${this.config.bucketName}/${filePath}`
    return {
      fileId: filePath,
      fileName,
      fileUrl,
      publicUrl: fileUrl,
      downloadUrl: fileUrl
    }
  }

  // Verifica se o serviço está configurado corretamente
  isConfigured(): boolean {
    return !!this.config.baseUrl && !!this.config.bucketName;
  }
}
