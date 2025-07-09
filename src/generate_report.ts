import { AdvancedAnalysisService } from './integrations/AdvancedAnalysisService';
import { userResponses } from './responses'; // IMPORTANTE: Verifique se este ficheiro exporta um array com as 108 respostas.
import { questions } from './data/questions'; // Supondo que você tem um ficheiro com as perguntas e seus domínios.

// Configure as suas variáveis de ambiente para o script Node.js
process.env.VITE_GEMINI_API_KEY = 'AIzaSyAN3lGIldKCCmN-TC_c0PklZlqxF1PdlDM';

async function runManualGeneration() {
  try {
    console.log('🚀 Iniciando a geração do MANUAL DE PERSONIFICAÇÃO COMPLETO...');

    const userEmail = 'vileproj10@gmail.com';

    // Validação rigorosa para garantir que temos dados suficientes para a análise completa.
    if (!userResponses || userResponses.length < 108) {
        throw new Error(`A análise completa requer no mínimo 108 respostas. O ficheiro 'responses.ts' forneceu ${userResponses?.length || 0}.`);
    }

    // Formata as respostas, combinando-as com as perguntas para incluir o domínio correto.
    const formattedResponses = userResponses.map((response, index) => {
      const questionData = questions[index] || { text: `Pergunta ${index + 1}`, domain: 'Indefinido' };
      return {
        question_index: index + 1,
        question_domain: questionData.domain, 
        question_text: questionData.text,
        transcript_text: response,
      };
    });

    // 1. Instancia o serviço de análise avançada.
    const analysisService = new AdvancedAnalysisService();

    // 2. Monta o pedido para a análise completa.
    const request = {
      userEmail: userEmail,
      responses: formattedResponses,
      audioFiles: [] // Nenhum ficheiro de áudio neste teste.
    };

    // 3. CHAMA O MÉTODO CORRETO que gera o manual completo.
    const personificationManual = await analysisService.generatePersonificationManual(request);

    // 4. Exibe o resultado final de forma estruturada e legível.
    console.log('\n\n--- 📖 MANUAL DE PERSONIFICAÇÃO GERADO ---');
    console.dir(personificationManual, { depth: null });
    console.log('--- FIM DO MANUAL ---');

    console.log('\n✅ Geração do manual concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro crítico durante a geração do manual:', error);
  }
}

// Executa a função principal.
runManualGeneration();
