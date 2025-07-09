import { AdvancedAnalysisService } from './integrations/AdvancedAnalysisService';
import { userResponses } from './responses'; // Assumindo que este ficheiro existe com as respostas

// Configure as suas variáveis de ambiente para o script Node.js
process.env.VITE_GEMINI_API_KEY = 'AIzaSyAN3lGIldKCCmN-TC_c0PklZlqxF1PdlDM';
// Adicione outras chaves de API se forem necessárias.

async function runManualGeneration() {
  try {
    console.log('🚀 Iniciando a geração do MANUAL DE PERSONIFICAÇÃO com 6 respostas...');

    const userEmail = 'vileproj10@gmail.com';

    // MODIFICAÇÃO: Alterado o requisito de 108 para 6 respostas para forçar a análise completa.
    if (!userResponses || userResponses.length < 6) {
        throw new Error(`A análise completa requer no mínimo 6 respostas para este teste. O ficheiro 'responses.ts' forneceu ${userResponses?.length || 0}.`);
    }

    // Garante que estamos a usar apenas as 6 primeiras respostas.
    const responsesForAnalysis = userResponses.slice(0, 6);

    // Simula a formatação das respostas como viriam da aplicação real.
    const formattedResponses = responsesForAnalysis.map((response, index) => ({
      question_index: index + 1,
      // IMPORTANTE: O domínio da pergunta é crucial para a análise.
      question_domain: 'Identidade & Narrativa', // Exemplo de domínio
      question_text: `Pergunta Simulada ${index + 1}`,
      transcript_text: response,
    }));

    // 1. Instanciar o serviço de análise avançada.
    const analysisService = new AdvancedAnalysisService();

    // 2. Montar o pedido para a análise completa.
    const request = {
      userEmail: userEmail,
      responses: formattedResponses,
      audioFiles: [] // Nenhum ficheiro de áudio neste teste.
    };

    // 3. Chamar o método principal que gera o manual completo.
    const personificationManual = await analysisService.generatePersonificationManual(request);

    // 4. Exibir o resultado final e completo de forma estruturada.
    console.log('\n\n--- 📖 MANUAL DE PERSONIFICAÇÃO GERADO (COM 6 RESPOSTAS) ---');
    console.dir(personificationManual, { depth: null });
    console.log('--- FIM DO MANUAL ---');

    console.log('\n✅ Geração do manual concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro crítico durante a geração do manual:', error);
  }
}

// Executa a função principal.
runManualGeneration();
