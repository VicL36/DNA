import { generateAnalysis, generateFinalReportAndDataset } from './integrations/Core';
import { userResponses } from './responses';
import { SupabaseStorageService } from './integrations/SupabaseStorageService';

// Variáveis de ambiente reais
process.env.VITE_DEEPGRAM_API_KEY = 'd5e17e9c32083291e469eec6e10019664ebba41e';
process.env.VITE_GEMINI_API_KEY = 'AIzaSyAN3lGIldKCCmN-TC_c0PklZlqxF1PdlDM';
process.env.VITE_SUPABASE_URL = 'https://nzsyuhewavijzszlgshx.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3l1aGV3YXZpanpzemxnc2h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDYxODcsImV4cCI6MjA2NjgyMjE4N30.nagWs7Py94q879nRLpifyUY3hWCqg_rKMWVSm5YpXfI';

process.env.VITE_AUDIO_BASE_URL = 'https://jesvvdegtmbbuiuqwkdd.supabase.co/storage/v1/object/public/dna-protocol-audio/';

async function runReportGeneration() {
  try {
    console.log('Iniciando a geração do relatório e dataset...');

    // Simular um email de usuário para o Supabase Storage
    const userEmail = 'vicleandro36@gmail.com';

    // 1. Gerar a análise com Gemini
    console.log('Chamando generateAnalysis com as respostas...');
    const analysisResult = await generateAnalysis(userResponses);
    console.log('Análise gerada:', analysisResult.analysis_document.substring(0, 200) + '...');

    // 2. Preparar as respostas para o relatório final (simulando a estrutura esperada)
    const formattedResponses = userResponses.map((response, index) => ({
      question_index: index + 1,
      question_domain: 'Simulado',
      question_text: `Pergunta ${index + 1}`,
      transcript_text: response,
      audio_duration: Math.floor(Math.random() * 60) + 10, // Duração simulada
      created_at: new Date().toISOString(),
    }));

    // 3. Gerar o relatório final e o dataset de fine-tuning
    console.log('Chamando generateFinalReportAndDataset...');
    const finalReportAndDataset = await generateFinalReportAndDataset(
      userEmail,
      analysisResult,
      formattedResponses
    );

    console.log('Relatório final URL:', finalReportAndDataset.reportFileUrl);
    console.log('Dataset de fine-tuning URL:', finalReportAndDataset.datasetFileUrl);
    console.log('Dados para clonagem de voz (quantidade):', finalReportAndDataset.voiceCloningData.length);

    console.log('Geração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a geração do relatório:', error);
  }
}

runReportGeneration();


