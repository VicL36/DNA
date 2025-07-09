import React, { useState, useEffect } from 'react'
import { FileText, Brain, TrendingUp, Users, AlertCircle } from 'lucide-react'
import {
  generatePsychologicalAnalysis as generateAnalysis,
  supabaseStorageService,
  FineTuningDatasetGenerator,
  generateAnalysisDocument,
  generateKeyInsights,
  generateBehavioralPatterns,
  generateRecommendations,
  generatePersonalitySummary
} from '../integrations/Core'

interface AnalysisPageProps {
  responses: string[]
  analysisDepth: string
  onAnalysisComplete?: (analysis: any) => void
}

export default function AnalysisPage({ 
  responses = [], 
  analysisDepth = 'BÁSICA',
  onAnalysisComplete 
}: AnalysisPageProps) {
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateAnalysis = async () => {
    if (responses.length === 0) {
      setError('Nenhuma resposta disponível para análise.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [
        psychAnalysis,
        analysisDoc,
        keyInsights,
        behavioralPatterns,
        recommendations,
        personalitySummary
      ] = await Promise.all([
        generateAnalysis(responses, analysisDepth, responses.length),
        generateAnalysisDocument(analysisDepth, responses.length),
        generateKeyInsights(responses),
        generateBehavioralPatterns(responses),
        generateRecommendations(responses),
        generatePersonalitySummary(responses)
      ])

      const completeAnalysis = {
        ...psychAnalysis,
        ...analysisDoc,
        ...keyInsights,
        ...behavioralPatterns,
        ...recommendations,
        ...personalitySummary,
        responseCount: responses.length,
        analysisDepth,
        timestamp: new Date().toISOString()
      }

      setAnalysis(completeAnalysis)
      onAnalysisComplete?.(completeAnalysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar análise')
    } finally {
      setLoading(false)
    }
  }

  const getAnalysisQuality = () => {
    const responseCount = responses.length
    if (responseCount >= 54) return { level: 'Alta', color: 'text-green-600' }
    if (responseCount >= 27) return { level: 'Média', color: 'text-yellow-600' }
    return { level: 'Baixa', color: 'text-red-600' }
  }

  const quality = getAnalysisQuality()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Análise Psicológica
              </h1>
              <p className="text-gray-600">
                Protocolo Clara R. - Análise {analysisDepth}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {responses.length}
                </div>
                <div className="text-sm text-gray-500">Respostas</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold ${quality.color}`}>
                  {quality.level}
                </div>
                <div className="text-sm text-gray-500">Qualidade</div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Gerar Análise Completa
                </h3>
                <p className="text-gray-600">
                  Análise baseada em {responses.length} respostas coletadas
                </p>
              </div>
            </div>
            <button
              onClick={handleGenerateAnalysis}
              disabled={loading || responses.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Gerar Análise</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700 font-medium">Erro na Análise</p>
            </div>
            <p className="text-red-600 mt-2">{error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Analysis Document */}
            {analysis.analysis_document && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Documento de Análise
                  </h3>
                </div>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                    {analysis.analysis_document}
                  </pre>
                </div>
              </div>
            )}

            {/* Key Insights */}
            {analysis.key_insights && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Insights Chave
                  </h3>
                </div>
                <div className="space-y-3">
                  {analysis.key_insights.map((insight: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-green-100 rounded-full p-1 mt-1">
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                      </div>
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Behavioral Patterns */}
            {analysis.behavioral_patterns && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Padrões Comportamentais
                  </h3>
                </div>
                <div className="space-y-3">
                  {analysis.behavioral_patterns.map((pattern: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-purple-100 rounded-full p-1 mt-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full" />
                      </div>
                      <p className="text-gray-700">{pattern}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personality Summary */}
            {analysis.personality_summary && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Resumo de Personalidade
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {analysis.personality_summary}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
