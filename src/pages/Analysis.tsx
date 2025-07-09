import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { questions } from '../data/questions'
import { supabase } from '../lib/supabase'
import { SupabaseStorageService } from '../integrations/SupabaseStorageService'
import { AdvancedAnalysisService } from '../integrations/AdvancedAnalysisService'
import { GoogleDriveService } from '../integrations/GoogleDriveService'
import { PDFReportGenerator } from '../integrations/PDFReportGenerator'
import { FineTuningDatasetGenerator } from '../integrations/FineTuningDatasetGenerator'
import { Core } from '../integrations/Core'

import { Layout } from '../components/Layout'
import { QuestionDisplay } from '../components/analysis/QuestionDisplay'
import { AudioRecorder } from '../components/analysis/AudioRecorder'
import { TranscriptionDisplay } from '../components/analysis/TranscriptionDisplay'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

// Tipos para os estados
type TranscriptionResult = {
  transcription: string | null
  audioUrl: string | null
}

type AnalysisResult = {
  feedback: string | null
  score: number | null
}

export function Analysis() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Estados do componente
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcriptionResult, setTranscriptionResult] =
    useState<TranscriptionResult | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allResponses, setAllResponses] = useState<any[]>([])
  const [isFinished, setIsFinished] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [finalReportUrl, setFinalReportUrl] = useState<string | null>(null)

  // Instâncias dos serviços
  const supabaseStorageService = new SupabaseStorageService(supabase)
  const advancedAnalysisService = new AdvancedAnalysisService()
  const googleDriveService = new GoogleDriveService()
  const pdfReportGenerator = new PDFReportGenerator()
  const fineTuningDatasetGenerator = new FineTuningDatasetGenerator()
  const core = new Core(
    supabase,
    advancedAnalysisService,
    googleDriveService,
    pdfReportGenerator,
    fineTuningDatasetGenerator,
  )

  // Efeito para verificar autenticação
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('🚫 Usuário não autenticado. Redirecionando para /login')
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  // Handlers de gravação
  const handleStartRecording = () => {
    console.log('▶️ Iniciando gravação...')
    setIsRecording(true)
    setAudioBlob(null)
    setTranscriptionResult(null)
    setAnalysisResult(null)
    setError(null)
  }

  const handleStopRecording = (blob: Blob) => {
    console.log('⏹️ Parando gravação...')
    setIsRecording(false)
    setAudioBlob(blob)
  }

  const handleResetRecording = () => {
    console.log('🔄 Resetando gravação...')
    setIsRecording(false)
    setAudioBlob(null)
    setTranscriptionResult(null)
    setAnalysisResult(null)
    setError(null)
  }

  // Submissão da resposta
  const handleSubmit = async () => {
    if (!audioBlob || !user) {
      setError('Nenhum áudio gravado ou usuário não autenticado.')
      console.error('Nenhum áudio gravado ou usuário não autenticado.')
      return
    }

    setIsSubmitting(true)
    setIsLoading(true)
    setError(null)
    console.log('🚀 Iniciando processo de submissão...')

    try {
      // 1. Salvar áudio no Supabase Storage
      console.log('💾 Salvando áudio no Supabase Storage...')
      const audioUpload = await supabaseStorageService.uploadAudio(
        audioBlob,
        user.email!,
        currentQuestionIndex + 1,
      )
      if (audioUpload.error) throw new Error(audioUpload.error.message)
      console.log('✅ Áudio salvo com sucesso:', audioUpload.path)

      // 2. Transcrever áudio
      console.log('🔄 Transcrevendo áudio...')
      // Simulação da transcrição - substitua pela chamada real à API
      const transcriptionText = `Esta é uma transcrição simulada para a pergunta ${
        currentQuestionIndex + 1
      }. O usuário respondeu à pergunta sobre "${
        questions[currentQuestionIndex].text
      }".`
      setTranscriptionResult({
        transcription: transcriptionText,
        audioUrl: audioUpload.path,
      })
      console.log('✅ Transcrição concluída:', transcriptionText)

      // 3. Análise avançada (simulada)
      console.log('🔬 Realizando análise avançada...')
      const analysis = await advancedAnalysisService.analyze(transcriptionText)
      setAnalysisResult(analysis)
      console.log('✅ Análise concluída:', analysis)

      // 4. Salvar tudo no banco de dados
      console.log('✍️ Salvando resposta e análise no banco de dados...')
      const responseToSave = {
        user_id: user.id,
        question_id: questions[currentQuestionIndex].id,
        audio_url: audioUpload.path,
        transcription: transcriptionText,
        feedback: analysis.feedback,
        score: analysis.score,
        session_id: 'session_12345', // Gerar ou obter um ID de sessão
      }
      const { error: dbError } = await supabase
        .from('user_responses')
        .insert(responseToSave)
      if (dbError) throw new Error(dbError.message)
      console.log('✅ Resposta salva no banco de dados.')

      // Adicionar resposta à lista de todas as respostas
      setAllResponses(prev => [...prev, responseToSave])
    } catch (err: any) {
      console.error('❌ Erro no processo de submissão:', err)
      setError(err.message || 'Ocorreu um erro desconhecido.')
    } finally {
      setIsLoading(false)
    }
  }

  // Próxima pergunta ou finalização
  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      console.log('▶️ Indo para a próxima pergunta...')
      setCurrentQuestionIndex(prev => prev + 1)
      handleResetRecording() // Reseta o estado para a nova pergunta
      setIsSubmitting(false)
    } else {
      console.log('🏁 Finalizando a análise...')
      setIsFinished(true)
      setIsLoading(true)
      setError(null)
      try {
        // Lógica de finalização
        console.log('📄 Gerando relatório final...')

        // 1. Gerar o conteúdo do relatório em PDF
        const pdfDoc = await pdfReportGenerator.generate(allResponses)
        const pdfBytes = await pdfDoc.save()
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })

        // 2. Salvar o PDF no Supabase Storage
        if (!user || !user.email) {
          throw new Error('Usuário não encontrado para salvar o relatório.')
        }
        const reportUpload =
          await supabaseStorageService.uploadFinalReport(pdfBlob, user.email)
        if (reportUpload.error) throw new Error(reportUpload.error.message)
        console.log('✅ Relatório salvo no Supabase:', reportUpload.path)

        // 3. Obter URL pública para o relatório
        const { data: urlData } = supabase.storage
          .from('reports')
          .getPublicUrl(reportUpload.path)
        setFinalReportUrl(urlData.publicUrl)
        console.log('✅ URL do relatório:', urlData.publicUrl)

        // 4. (Opcional) Salvar no Google Drive
        console.log('☁️ Tentando salvar no Google Drive...')
        await googleDriveService.saveReport(pdfBlob, 'relatorio_final.pdf')
        console.log('✅ Relatório salvo no Google Drive.')

        // 5. (Opcional) Gerar dados para fine-tuning
        console.log('🧠 Gerando dados para fine-tuning...')
        const fineTuningData = fineTuningDatasetGenerator.generate(allResponses)
        console.log(
          '✅ Dados de fine-tuning gerados:',
          JSON.stringify(fineTuningData, null, 2),
        )
        // Aqui você poderia salvar `fineTuningData` em algum lugar

        setShowCompletionDialog(true)
      } catch (err: any) {
        console.error('❌ Erro ao finalizar a análise:', err)
        setError(
          err.message || 'Ocorreu um erro ao gerar o relatório final.',
        )
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleViewReport = () => {
    if (finalReportUrl) {
      window.open(finalReportUrl, '_blank')
    }
  }

  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  // Renderização condicional
  if (authLoading) {
    return (
      <Layout>
        <div className="flex h-full w-full items-center justify-center">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto flex h-full max-w-4xl flex-col items-center justify-center p-4">
        <div className="w-full space-y-8">
          {/* Cabeçalho e Progresso */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Análise de Perfil
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Responda às perguntas para que possamos analisar seu perfil.
            </p>
            <Progress
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              className="mt-4"
            />
            <p className="mt-2 text-sm text-gray-500">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </p>
          </div>

          {/* Conteúdo Principal */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <QuestionDisplay
              question={questions[currentQuestionIndex].text}
            />

            <div className="mt-6">
              <AudioRecorder
                isRecording={isRecording}
                onStart={handleStartRecording}
                onStop={handleStopRecording}
                onReset={handleResetRecording}
                disabled={isSubmitting}
              />
            </div>

            {audioBlob && !isSubmitting && (
              <div className="mt-6 flex justify-center">
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'Enviando...' : 'Enviar Resposta'}
                </Button>
              </div>
            )}

            {isLoading && isSubmitting && (
              <div className="mt-6 text-center">
                <p>Analisando sua resposta, por favor aguarde...</p>
                {/* Você pode adicionar um spinner aqui */}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-md border border-red-400 bg-red-50 p-4 text-red-700">
                <p>
                  <strong>Erro:</strong> {error}
                </p>
              </div>
            )}

            {transcriptionResult && analysisResult && (
              <div className="mt-6 space-y-6">
                <TranscriptionDisplay
                  transcription={transcriptionResult.transcription}
                  feedback={analysisResult.feedback}
                  score={analysisResult.score}
                />
                <div className="flex justify-center">
                  <Button onClick={handleNext} disabled={isLoading}>
                    {isLoading
                      ? 'Processando...'
                      : currentQuestionIndex < questions.length - 1
                        ? 'Próxima Pergunta'
                        : 'Finalizar Análise'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Conclusão */}
        <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Análise Concluída!</DialogTitle>
              <DialogDescription>
                Seu relatório foi gerado com sucesso. Você pode visualizá-lo
                agora ou acessá-lo mais tarde no seu dashboard.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:justify-center">
              <Button variant="outline" onClick={handleGoToDashboard}>
                Ir para o Dashboard
              </Button>
              <Button onClick={handleViewReport} disabled={!finalReportUrl}>
                Ver Relatório
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
