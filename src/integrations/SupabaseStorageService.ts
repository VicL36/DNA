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
      bucketName: 'dna-protocol-files', // Bucket principal para todos os arquivos
      baseUrl: import.meta.env.VITE_SUPABASE_URL || ''
    }

    console.log('🔧 Configurando Supabase Storage Service...')
    console.log('🪣 Bucket Name:', this.config.bucketName)
    console.log('🔗 Base URL:', this.config.baseUrl?.substring(0, 30) + '...')
  }

  // Criar pasta para o usuário (estrutura de pastas no Storage)
  private getUserFolderPath(userEmail: string): string {
    const sanitizedEmail = userEmail.replace('@', '_').replace(/\./g, '_')
    return `users/${sanitizedEmail}`
  }

  // Upload de arquivo de áudio
  async uploadAudioFile(
    file: File,
    userEmail: string,
    questionIndex: number,
    questionText: string
  ): Promise<StorageUploadResponse> {
    try {
      console.log('🎵 Iniciando upload de áudio para Supabase Storage...')
      console.log('📄 Arquivo:', file.name, 'Tamanho:', file.size, 'bytes')

      const userFolderPath = this.getUserFolderPath(userEmail)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `Q${questionIndex.toString().padStart(3, '0')}_AUDIO_${timestamp}.wav`
      const filePath = `${userFolderPath}/audio/${fileName}`

      console.log('📤 Fazendo upload do áudio para:', filePath)

      const { data, error } = await supabase.storage
        .from(this.config.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'audio/wav'
        })

      if (error) {
        console.error('❌ Erro no upload do áudio:', error)
        throw new Error(`Erro no upload do áudio: ${error.message}`)
      }

      // Obter URL pública do arquivo
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
      throw new Error(`Falha no upload do áudio: ${error.message}`)
    }
  }

  // Upload de transcrição
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

      const content = `DNA UP - Análise Narrativa Profunda
Data: ${new Date().toLocaleString('pt-BR')}
Usuário: ${userEmail}
Pergunta ${questionIndex}: ${questionText}

TRANSCRIÇÃO:
${transcription}

---
Gerado automaticamente pelo DNA UP Platform
`

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

      // Obter URL pública do arquivo
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
      throw new Error(`Falha no upload da transcrição: ${error.message}`)
    }
  }

  // Upload do dataset de fine-tuning
  async uploadFineTuningDataset(
    dataset: any,
    userEmail: string
  ): Promise<StorageUploadResponse> {
    try {
      console.log('🤖 Enviando dataset de fine-tuning para Supabase Storage...')

      const userFolderPath = this.getUserFolderPath(userEmail)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `DNA_UP_FINE_TUNING_DATASET_${timestamp}.jsonl`
      const filePath = `${userFolderPath}/datasets/${fileName}`

      // Converter dataset para formato JSONL (cada linha é um JSON)
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

      // Obter URL pública do arquivo
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
      throw new Error(`Falha no upload do dataset: ${error.message}`)
    }
  }

  // Upload do relatório final
  async uploadFinalReport(
    userEmail: string,
    analysisData: any,
    responses: any[]
  ): Promise<StorageUploadResponse> {
    try {
      console.log('📊 Gerando relatório final completo...')

      const userFolderPath = this.getUserFolderPath(userEmail)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `DNA_UP_RELATORIO_COMPLETO_${timestamp}.txt`
      const filePath = `${userFolderPath}/reports/${fileName}`

      const content = `
# DNA UP - RELATÓRIO DE ANÁLISE PSICOLÓGICA COMPLETA

**Data:** ${new Date().toLocaleString('pt-BR')}
**Usuário:** ${userEmail}
**Total de Respostas:** ${responses.length}
**Protocolo:** Clara R. - 108 Perguntas Estratégicas

---

## ANÁLISE PSICOLÓGICA

${analysisData.analysis_document || 'Análise em processamento...'}

---

## RESUMO EXECUTIVO

${analysisData.personality_summary || 'Resumo em processamento...'}

---

## INSIGHTS PRINCIPAIS

${analysisData.key_insights?.map((insight, i) => `${i + 1}. ${insight}`).join('\n') || 'Insights em processamento...'}

---

## PADRÕES COMPORTAMENTAIS

${analysisData.behavioral_patterns?.map((pattern, i) => `${i + 1}. ${pattern}`).join('\n') || 'Padrões em processamento...'}

---

## RECOMENDAÇÕES

${analysisData.recommendations || 'Recomendações em processamento...'}

---

## ANÁLISE POR DOMÍNIO

${Object.entries(analysisData.domain_analysis || {}).map(([domain, score]) => `**${domain}:** ${score}`).join('\n')}

---

## RESPOSTAS DETALHADAS

${responses.map((response, i) => `
### PERGUNTA ${response.question_index}
**Domínio:** ${response.question_domain}
**Pergunta:** ${response.question_text}
**Resposta:** ${response.transcript_text || 'Transcrição não disponível'}
**Duração:** ${Math.round(response.audio_duration || 0)}s
**Data:** ${new Date(response.created_at).toLocaleString('pt-BR')}

---
`).join('\n')}

---

**Relatório gerado automaticamente pelo DNA UP Platform**
**Deep Narrative Analysis - Protocolo Clara R.**
**© 2024 DNA UP - Todos os direitos reservados**
`

      const blob = new Blob([content], { type: 'text/plain; charset=utf-8' })

      console.log('📤 Fazendo upload do relatório final para:', filePath)

      const { data, error } = await supabase.storage
        .from(this.config.bucketName)
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'text/plain'
        })

      if (error) {
        console.error('❌ Erro no upload do relatório:', error)
        throw new Error(`Erro no upload do relatório: ${error.message}`)
      }

      // Obter URL pública do arquivo
      const { data: publicUrlData } = supabase.storage
        .from(this.config.bucketName)
        .getPublicUrl(filePath)

      console.log('✅ Relatório final enviado com sucesso!')
      console.log('📁 Path:', data.path)

      return {
        fileId: data.path,
        fileName: fileName,
        fileUrl: publicUrlData.publicUrl,
        publicUrl: publicUrlData.publicUrl,
        downloadUrl: publicUrlData.publicUrl
      }

    } catch (error) {
      console.error('❌ Erro ao gerar relatório final:', error)
      throw new Error(`Falha ao gerar relatório: ${error.message}`)
    }
  }

  // Verificar se está configurado
  isConfigured(): boolean {
    return !!(
      this.config.bucketName &&
      this.config.baseUrl
    )
  }

  // Info de configuração
  getConfigInfo() {
    return {
      hasBucketName: !!this.config.bucketName,
      hasBaseUrl: !!this.config.baseUrl,
      isConfigured: this.isConfigured()
    }
  }

  // Listar arquivos de um usuário
  async listUserFiles(userEmail: string, folder?: string): Promise<any[]> {
    try {
      const userFolderPath = this.getUserFolderPath(userEmail)
      const searchPath = folder ? `${userFolderPath}/${folder}` : userFolderPath

      const { data, error } = await supabase.storage
        .from(this.config.bucketName)
        .list(searchPath)

      if (error) {
        console.error('❌ Erro ao listar arquivos:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('❌ Erro ao listar arquivos:', error)
      return []
    }
  }

  // Deletar arquivo
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.config.bucketName)
        .remove([filePath])

      if (error) {
        console.error('❌ Erro ao deletar arquivo:', error)
        return false
      }

      console.log('✅ Arquivo deletado com sucesso:', filePath)
      return true
    } catch (error) {
      console.error('❌ Erro ao deletar arquivo:', error)
      return false
    }
  }

  // Obter URL de download de um arquivo
  async getDownloadUrl(filePath: string): Promise<string | null> {
    try {
      const { data } = supabase.storage
        .from(this.config.bucketName)
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('❌ Erro ao obter URL de download:', error)
      return null
    }
  }

  // Upload de relatório avançado (incluindo análise psicológica completa)
  async uploadAdvancedReport(
    userEmail: string,
    analysisData: any,
    responses: any[],
    advancedAnalysis?: any
  ): Promise<StorageUploadResponse> {
    try {
      console.log('📊 Gerando relatório avançado para Supabase Storage...')

      const userFolderPath = this.getUserFolderPath(userEmail)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `DNA_UP_RELATORIO_AVANCADO_${timestamp}.md`
      const filePath = `${userFolderPath}/reports/${fileName}`

      // Gerar conteúdo do relatório avançado
      const reportContent = this.generateAdvancedReportContent(
        userEmail,
        analysisData,
        responses,
        advancedAnalysis
      )

      const reportBlob = new Blob([reportContent], { type: 'text/markdown' })

      const { data, error } = await supabase.storage
        .from(this.config.bucketName)
        .upload(filePath, reportBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'text/markdown'
        })

      if (error) {
        console.error('❌ Erro no upload do relatório avançado:', error)
        throw new Error(`Erro no upload do relatório: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from(this.config.bucketName)
        .getPublicUrl(filePath)

      console.log('✅ Relatório avançado salvo no Supabase Storage!')

      return {
        fileId: data.path,
        fileName: fileName,
        fileUrl: publicUrlData.publicUrl,
        publicUrl: publicUrlData.publicUrl,
        downloadUrl: publicUrlData.publicUrl
      }

    } catch (error) {
      console.error('❌ Erro no upload do relatório avançado:', error)
      throw new Error(`Falha no upload do relatório: ${error.message}`)
    }
  }

  // Upload de dados para clonagem de voz (AllTalk TTS)
  async uploadVoiceCloningData(
    voiceCloningData: any[],
    userEmail: string
  ): Promise<StorageUploadResponse> {
    try {
      console.log('🎤 Salvando dados de clonagem de voz para AllTalk TTS...')

      const userFolderPath = this.getUserFolderPath(userEmail)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `DNA_UP_VOICE_CLONING_DATA_${timestamp}.json`
      const filePath = `${userFolderPath}/voice_cloning/${fileName}`

      // Preparar dados específicos para AllTalk TTS
      const allTalkData = this.prepareAllTalkTTSData(voiceCloningData, userEmail)

      const dataBlob = new Blob([JSON.stringify(allTalkData, null, 2)], {
        type: 'application/json'
      })

      const { data, error } = await supabase.storage
        .from(this.config.bucketName)
        .upload(filePath, dataBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/json'
        })

      if (error) {
        console.error('❌ Erro no upload dos dados de voz:', error)
        throw new Error(`Erro no upload dos dados de voz: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from(this.config.bucketName)
        .getPublicUrl(filePath)

      console.log('✅ Dados de clonagem de voz salvos no Supabase Storage!')

      return {
        fileId: data.path,
        fileName: fileName,
        fileUrl: publicUrlData.publicUrl,
        publicUrl: publicUrlData.publicUrl,
        downloadUrl: publicUrlData.publicUrl
      }

    } catch (error) {
      console.error('❌ Erro no upload dos dados de voz:', error)
      throw new Error(`Falha no upload dos dados de voz: ${error.message}`)
    }
  }

  // Gerar conteúdo do relatório avançado
  private generateAdvancedReportContent(
    userEmail: string,
    analysisData: any,
    responses: any[],
    advancedAnalysis?: any
  ): string {
    const timestamp = new Date().toISOString()
    const formattedDate = new Date().toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    return `# DNA UP - RELATÓRIO PSICOLÓGICO AVANÇADO

## Informações Gerais
- **Data de Geração:** ${formattedDate}
- **Usuário:** ${userEmail}
- **Total de Respostas:** ${responses.length}
- **Protocolo:** Clara R. - 108 Perguntas Estratégicas
- **Versão:** 2.0 (Análise Avançada)

---

## 🧠 ANÁLISE PSICOLÓGICA PROFUNDA

### Perfil Psicológico Principal
${analysisData.analysis_document || 'Análise em processamento...'}

### Estrutura de Personalidade
${analysisData.personality_summary || 'Resumo em processamento...'}

---

## 🔍 INSIGHTS ESTRATÉGICOS

### Insights Principais
${analysisData.key_insights?.map((insight, i) => `${i + 1}. **${insight}**`).join('\n') || 'Insights em processamento...'}

### Padrões Comportamentais Identificados
${analysisData.behavioral_patterns?.map((pattern, i) => `${i + 1}. **${pattern}**`).join('\n') || 'Padrões em processamento...'}

---

## 📊 ANÁLISE QUANTITATIVA POR DOMÍNIO

${Object.entries(analysisData.domain_analysis || {}).map(([domain, score]) => 
  `### ${domain}\n**Pontuação:** ${score}/100\n**Avaliação:** ${this.getDomainAssessment(score)}\n`
).join('\n')}

---

## 🎯 RECOMENDAÇÕES PERSONALIZADAS

### Desenvolvimento Pessoal
${analysisData.recommendations || 'Recomendações em processamento...'}

### Áreas de Crescimento
${advancedAnalysis?.growth_areas?.map((area, i) => `${i + 1}. **${area}**`).join('\n') || 'Análise em processamento...'}

### Estratégias de Melhoria
${advancedAnalysis?.improvement_strategies?.map((strategy, i) => `${i + 1}. **${strategy}**`).join('\n') || 'Estratégias em processamento...'}

---

## 💡 ANÁLISE COMPORTAMENTAL AVANÇADA

### Motivações Intrínsecas
${advancedAnalysis?.intrinsic_motivations?.join('\n- ') || 'Motivações em análise...'}

### Padrões de Comunicação
${advancedAnalysis?.communication_patterns?.join('\n- ') || 'Padrões em análise...'}

### Estilo de Tomada de Decisão
${advancedAnalysis?.decision_making_style || 'Estilo em análise...'}

---

## 📝 RESPOSTAS DETALHADAS

${responses.map((response, i) => `
### PERGUNTA ${response.question_index}
**Domínio:** ${response.question_domain}
**Pergunta:** ${response.question_text}
**Resposta:** ${response.transcript_text || 'Transcrição não disponível'}
**Duração:** ${Math.round(response.audio_duration || 0)}s
**Data:** ${new Date(response.created_at).toLocaleString('pt-BR')}
**Análise:** ${response.analysis_notes || 'Análise pendente'}

---
`).join('\n')}

---

## 🔬 METODOLOGIA

### Protocolo Aplicado
- **Base Científica:** Análise Narrativa Profunda (DNA)
- **Técnica:** Clara R. - 108 Perguntas Estratégicas
- **Processamento:** IA Avançada + Análise Humana
- **Validação:** Múltiplas camadas de verificação

### Ferramentas Utilizadas
- Transcrição automática de alta precisão
- Análise semântica avançada
- Processamento de linguagem natural
- Algoritmos de detecção de padrões
- Análise psicológica computacional

---

## ⚠️ CONSIDERAÇÕES IMPORTANTES

### Limitações
- Esta análise é baseada em respostas fornecidas em um momento específico
- Resultados podem variar dependendo do contexto e estado emocional
- Recomenda-se acompanhamento profissional para questões complexas

### Recomendações de Uso
- Utilize como ferramenta de autoconhecimento
- Compartilhe com profissionais qualificados quando necessário
- Revise periodicamente para acompanhar evolução pessoal

---

**Relatório gerado automaticamente pelo DNA UP Platform**
**Deep Narrative Analysis - Protocolo Clara R.**
**© 2024 DNA UP - Todos os direitos reservados**
**Timestamp:** ${timestamp}
`
  }

  // Avaliar domínio baseado na pontuação
  private getDomainAssessment(score: any): string {
    const numScore = typeof score === 'number' ? score : parseFloat(score) || 0
    
    if (numScore >= 80) return 'Excelente - Área de alta competência'
    if (numScore >= 60) return 'Bom - Área desenvolvida com potencial'
    if (numScore >= 40) return 'Moderado - Área que requer atenção'
    if (numScore >= 20) return 'Baixo - Área que necessita desenvolvimento'
    return 'Crítico - Área que requer intervenção imediata'
  }

  // Gerar insights padrão a partir do perfil de personalidade
  private generateInsightsFromProfile(personalityProfile: any): string {
    const insights = []
    
    if (personalityProfile.communicationStyle?.formality) {
      insights.push(`**Comunicação ${personalityProfile.communicationStyle.formality}:** Demonstra adaptabilidade no estilo comunicativo`)
    }
    
    if (personalityProfile.thinkingPatterns?.approach) {
      insights.push(`**Abordagem ${personalityProfile.thinkingPatterns.approach}:** Processamento mental característico identificado`)
    }
    
    if (personalityProfile.emotionalResponse?.strongTriggers?.length > 0) {
      insights.push(`**Responsividade Emocional:** Padrões específicos de ativação emocional detectados`)
    }
    
    if (personalityProfile.socialPosture?.orientation) {
      insights.push(`**Orientação Social ${personalityProfile.socialPosture.orientation}:** Preferências de interação social bem definidas`)
    }
    
    return insights.length > 0 ? insights.join('\n') : 'Insights sendo processados com base no perfil identificado...'
  }

  // Gerar padrões padrão a partir do perfil de personalidade
  private generatePatternsFromProfile(personalityProfile: any): string {
    const patterns = []
    
    if (personalityProfile.communicationStyle?.directness) {
      patterns.push(`**Padrão Comunicativo:** Tendência à comunicação ${personalityProfile.communicationStyle.directness}`)
    }
    
    if (personalityProfile.thinkingPatterns?.structure) {
      patterns.push(`**Padrão de Pensamento:** Estruturação mental ${personalityProfile.thinkingPatterns.structure}`)
    }
    
    if (personalityProfile.emotionalResponse?.regulationStrategies?.length > 0) {
      patterns.push(`**Padrão de Regulação Emocional:** Estratégias consistentes de manejo emocional`)
    }
    
    if (personalityProfile.socialPosture?.leadershipStyle?.length > 0) {
      patterns.push(`**Padrão de Liderança:** Estilo característico de influência e direcionamento`)
    }
    
    return patterns.length > 0 ? patterns.join('\n') : 'Padrões sendo identificados com base no perfil analisado...'
  }

  // Gerar áreas de crescimento padrão
  private generateDefaultGrowthAreas(): string {
    return `1. **Autoconhecimento Contínuo:** Aprofundar a compreensão dos próprios padrões e motivações
2. **Inteligência Emocional:** Desenvolver maior consciência e regulação emocional
3. **Comunicação Efetiva:** Aprimorar habilidades de expressão e escuta ativa
4. **Flexibilidade Cognitiva:** Expandir a capacidade de adaptação a diferentes contextos
5. **Relacionamentos Interpessoais:** Fortalecer conexões e habilidades sociais`
  }

  // Gerar estratégias de melhoria padrão
  private generateDefaultImprovementStrategies(): string {
    return `1. **Prática de Mindfulness:** Desenvolver maior consciência presente e autorregulação
2. **Feedback Ativo:** Buscar e integrar feedback construtivo de pessoas confiáveis
3. **Aprendizado Contínuo:** Investir em desenvolvimento pessoal e profissional regular
4. **Reflexão Estruturada:** Implementar práticas de journaling e autoanálise
5. **Experimentação Comportamental:** Testar novos padrões de comportamento em ambientes seguros`
  }

  // Gerar motivações padrão
  private generateDefaultMotivations(): string {
    return `- Busca por crescimento pessoal e desenvolvimento contínuo
- Necessidade de contribuição significativa e impacto positivo
- Valorização da autonomia e liberdade de escolha
- Desejo de conexões autênticas e relacionamentos profundos
- Aspiração por maestria e excelência em áreas de interesse`
  }

  // Gerar padrões de comunicação padrão
  private generateDefaultCommunicationPatterns(): string {
    return `- Estilo adaptativo que se ajusta ao contexto e audiência
- Preferência por comunicação clara e direta quando apropriado
- Tendência a buscar compreensão mútua em interações
- Capacidade de equilibrar assertividade com empatia
- Habilidade de modular o nível técnico conforme necessário`
  }
  // Preparar dados específicos para AllTalk TTS
  private prepareAllTalkTTSData(voiceCloningData: any[], userEmail: string): any {
    const timestamp = new Date().toISOString()
    
    return {
      user_email: userEmail,
      created_at: timestamp,
      voice_profile: {
        name: `DNA_UP_${userEmail.replace('@', '_').replace(/\./g, '_')}`,
        description: 'Perfil de voz gerado pelo DNA UP Platform',
        language: 'pt-BR',
        gender: 'auto-detect',
        age_range: 'auto-detect'
      },
      audio_samples: voiceCloningData.map((sample, index) => ({
        id: `sample_${index + 1}`,
        file_name: sample.fileName || `audio_${index + 1}.wav`,
        file_url: sample.fileUrl || sample.publicUrl,
        duration: sample.duration || 0,
        transcription: sample.transcription || '',
        question_index: sample.questionIndex || index + 1,
        quality_score: sample.qualityScore || 0.8,
        emotion_tag: sample.emotionTag || 'neutral',
        energy_level: sample.energyLevel || 'medium'
      })),
      training_config: {
        model_type: 'alltalk_tts',
        training_steps: 1000,
        learning_rate: 0.0001,
        batch_size: 16,
        voice_fidelity: 'high',
        naturalness: 'high',
        pronunciation_accuracy: 'high'
      },
      quality_metrics: {
        total_samples: voiceCloningData.length,
        total_duration: voiceCloningData.reduce((sum, sample) => sum + (sample.duration || 0), 0),
        average_quality: voiceCloningData.reduce((sum, sample) => sum + (sample.qualityScore || 0.8), 0) / voiceCloningData.length,
        recommended_training: voiceCloningData.length >= 20 ? 'full' : 'basic'
      },
      metadata: {
        platform: 'DNA UP',
        version: '2.0',
        protocol: 'Clara R. - 108 Perguntas',
        processing_date: timestamp,
        generated_by: 'DNA UP Platform'
      }
    }
  }
}

// Instância singleton
export const supabaseStorageService = new SupabaseStorageService()
