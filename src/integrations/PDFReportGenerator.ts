// Gerador de Relatórios em PDF - DNA UP Platform
import jsPDF from 'jspdf'

export interface PDFReportData {
  userEmail: string
  analysisData: any
  responses: any[]
  timestamp: string
}

export class PDFReportGenerator {
  private doc: jsPDF

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
  }

  // Gerar relatório completo em PDF
  static async generateReport(data: PDFReportData): Promise<Blob> {
    const generator = new PDFReportGenerator()
    
    // Configurar fonte
    generator.doc.setFont('helvetica')
    
    // Página 1 - Capa
    generator.addCoverPage(data)
    
    // Página 2 - Resumo Executivo
    generator.doc.addPage()
    generator.addExecutiveSummary(data)
    
    // Página 3 - Análise Detalhada
    generator.doc.addPage()
    generator.addDetailedAnalysis(data)
    
    // Página 4 - Insights e Padrões
    generator.doc.addPage()
    generator.addInsightsAndPatterns(data)
    
    // Página 5 - Recomendações
    generator.doc.addPage()
    generator.addRecommendations(data)
    
    // Página 6+ - Respostas Detalhadas
    generator.addDetailedResponses(data)
    
    // Gerar blob do PDF
    const pdfBlob = generator.doc.output('blob')
    return pdfBlob
  }

  private addCoverPage(data: PDFReportData): void {
    const { doc } = this
    
    // Título principal
    doc.setFontSize(24)
    doc.setTextColor(0, 51, 102) // Azul escuro
    doc.text('DNA UP', 105, 50, { align: 'center' })
    
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.text('Relatório de Análise Psicológica', 105, 65, { align: 'center' })
    
    // Subtítulo
    doc.setFontSize(14)
    doc.setTextColor(102, 102, 102)
    doc.text('Deep Narrative Analysis - Protocolo Clara R.', 105, 80, { align: 'center' })
    
    // Informações do usuário
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Usuário: ${data.userEmail}`, 20, 120)
    doc.text(`Data: ${new Date(data.timestamp).toLocaleDateString('pt-BR')}`, 20, 135)
    doc.text(`Total de Respostas: ${data.responses.length}`, 20, 150)
    
    // Logo/Marca d'água (simulado)
    doc.setFontSize(10)
    doc.setTextColor(200, 200, 200)
    doc.text('© 2024 DNA UP Platform - Todos os direitos reservados', 105, 280, { align: 'center' })
  }

  private addExecutiveSummary(data: PDFReportData): void {
    const { doc } = this
    let yPosition = 30
    
    // Título da seção
    doc.setFontSize(16)
    doc.setTextColor(0, 51, 102)
    doc.text('RESUMO EXECUTIVO', 20, yPosition)
    yPosition += 15
    
    // Conteúdo
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    
    const summary = data.analysisData?.personality_summary || 'Resumo em processamento...'
    const summaryLines = doc.splitTextToSize(summary, 170)
    
    summaryLines.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 30
      }
      doc.text(line, 20, yPosition)
      yPosition += 6
    })
    
    // Análise por domínio
    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(0, 51, 102)
    doc.text('ANÁLISE POR DOMÍNIO', 20, yPosition)
    yPosition += 10
    
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    
    if (data.analysisData?.domain_analysis) {
      Object.entries(data.analysisData.domain_analysis).forEach(([domain, score]) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 30
        }
        doc.text(`${domain}: ${score}`, 20, yPosition)
        yPosition += 6
      })
    }
  }

  private addDetailedAnalysis(data: PDFReportData): void {
    const { doc } = this
    let yPosition = 30
    
    // Título da seção
    doc.setFontSize(16)
    doc.setTextColor(0, 51, 102)
    doc.text('ANÁLISE PSICOLÓGICA DETALHADA', 20, yPosition)
    yPosition += 15
    
    // Conteúdo
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    
    const analysis = data.analysisData?.analysis_document || 'Análise em processamento...'
    const analysisLines = doc.splitTextToSize(analysis, 170)
    
    analysisLines.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 30
      }
      doc.text(line, 20, yPosition)
      yPosition += 5
    })
  }

  private addInsightsAndPatterns(data: PDFReportData): void {
    const { doc } = this
    let yPosition = 30
    
    // Insights
    doc.setFontSize(16)
    doc.setTextColor(0, 51, 102)
    doc.text('INSIGHTS PRINCIPAIS', 20, yPosition)
    yPosition += 15
    
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    
    if (data.analysisData?.key_insights) {
      data.analysisData.key_insights.forEach((insight: string, index: number) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 30
        }
        const insightLines = doc.splitTextToSize(`${index + 1}. ${insight}`, 170)
        insightLines.forEach((line: string) => {
          doc.text(line, 20, yPosition)
          yPosition += 5
        })
        yPosition += 3
      })
    }
    
    // Padrões Comportamentais
    yPosition += 10
    doc.setFontSize(16)
    doc.setTextColor(0, 51, 102)
    doc.text('PADRÕES COMPORTAMENTAIS', 20, yPosition)
    yPosition += 15
    
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    
    if (data.analysisData?.behavioral_patterns) {
      data.analysisData.behavioral_patterns.forEach((pattern: string, index: number) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 30
        }
        const patternLines = doc.splitTextToSize(`${index + 1}. ${pattern}`, 170)
        patternLines.forEach((line: string) => {
          doc.text(line, 20, yPosition)
          yPosition += 5
        })
        yPosition += 3
      })
    }
  }

  private addRecommendations(data: PDFReportData): void {
    const { doc } = this
    let yPosition = 30
    
    // Título da seção
    doc.setFontSize(16)
    doc.setTextColor(0, 51, 102)
    doc.text('RECOMENDAÇÕES', 20, yPosition)
    yPosition += 15
    
    // Conteúdo
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    
    if (data.analysisData?.recommendations) {
      if (Array.isArray(data.analysisData.recommendations)) {
        data.analysisData.recommendations.forEach((rec: string, index: number) => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 30
          }
          const recLines = doc.splitTextToSize(`${index + 1}. ${rec}`, 170)
          recLines.forEach((line: string) => {
            doc.text(line, 20, yPosition)
            yPosition += 5
          })
          yPosition += 3
        })
      } else {
        const recLines = doc.splitTextToSize(data.analysisData.recommendations, 170)
        recLines.forEach((line: string) => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 30
          }
          doc.text(line, 20, yPosition)
          yPosition += 5
        })
      }
    }
  }

  private addDetailedResponses(data: PDFReportData): void {
    const { doc } = this
    
    data.responses.forEach((response, index) => {
      doc.addPage()
      let yPosition = 30
      
      // Título da pergunta
      doc.setFontSize(14)
      doc.setTextColor(0, 51, 102)
      doc.text(`PERGUNTA ${response.question_index || index + 1}`, 20, yPosition)
      yPosition += 15
      
      // Pergunta
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text('Pergunta:', 20, yPosition)
      yPosition += 8
      
      doc.setFontSize(10)
      const questionLines = doc.splitTextToSize(response.question_text || 'Pergunta não disponível', 170)
      questionLines.forEach((line: string) => {
        doc.text(line, 20, yPosition)
        yPosition += 5
      })
      
      yPosition += 10
      
      // Resposta
      doc.setFontSize(11)
      doc.text('Resposta:', 20, yPosition)
      yPosition += 8
      
      doc.setFontSize(10)
      const responseText = response.transcript_text || 'Transcrição não disponível'
      const responseLines = doc.splitTextToSize(responseText, 170)
      responseLines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 30
        }
        doc.text(line, 20, yPosition)
        yPosition += 5
      })
      
      // Metadados
      yPosition += 10
      doc.setFontSize(9)
      doc.setTextColor(102, 102, 102)
      if (response.created_at) {
        doc.text(`Data: ${new Date(response.created_at).toLocaleString('pt-BR')}`, 20, yPosition)
        yPosition += 5
      }
      if (response.audio_duration) {
        doc.text(`Duração: ${Math.round(response.audio_duration)}s`, 20, yPosition)
        yPosition += 5
      }
      if (response.emotional_tone) {
        doc.text(`Tom Emocional: ${response.emotional_tone}`, 20, yPosition)
      }
    })
  }
}

