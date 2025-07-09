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
