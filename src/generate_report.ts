import { AdvancedAnalysisService } from './integrations/AdvancedAnalysisService';
import { userResponses } from './responses'; // Assumindo que este ficheiro existe com o array de 108+ respostas

// Configure as suas variáveis de ambiente para o script Node.js
// NOTA: Certifique-se de que as suas chaves de API são válidas e têm acesso aos modelos necessários.
process.env.VITE_GEMINI_API_KEY = 'AIzaSyAN3lGIldKCCmN-TC_c0PklZlqxF1PdlDM';
// Adicione outras chaves de API se forem necessárias para outros serviços.

async function runManualGeneration() {
  try {
    console.log('🚀 Iniciando a geração do MANUAL DE PERSONIFICAÇÃO COMPLETO...');

    const userEmail = 'vileproj10@gmail.com';

    // Validação para garantir que temos respostas suficientes para a análise completa.
    if (!userResponses || userResponses.length < 108) {
        throw new Error(`A análise completa requer no mínimo 108 respostas. O ficheiro 'responses.ts' forneceu ${userResponses?.length || 0}.`);
    }

    // Simula a formatação das respostas como viriam da aplicação real.
    // É crucial que cada resposta tenha o 'question_domain' correto para a análise quantitativa.
    const formattedResponses = userResponses.map((response, index) => ({
      question_index: index + 1,
      // IMPORTANTE: Substitua este valor pelo domínio real de cada pergunta para uma análise precisa.
      // Exemplo de como poderia ser feito se tivesse um array de perguntas: questions[index].domain
      question_domain: 'Ambições & Medos', 
      question_text: `Pergunta Simulada ${index + 1}`,
      transcript_text: response,
    }));

    // 1. Instanciar o serviço de análise avançada.
    const analysisService = new AdvancedAnalysisService();

    // 2. Montar o pedido para a análise completa, conforme a interface AdvancedAnalysisRequest.
    const request = {
      userEmail: userEmail,
      responses: formattedResponses,
      audioFiles: [] // Nenhum ficheiro de áudio neste teste
    };

    // 3. Chamar o método principal que gera o manual completo.
    // Esta é a mudança principal: estamos a usar a nova função.
    const personificationManual = await analysisService.generatePersonificationManual(request);

    // 4. Exibir o resultado final e completo de forma estruturada.
    console.log('\n\n--- 📖 MANUAL DE PERSONIFICAÇÃO GERADO ---');
    // Usamos console.dir para uma melhor visualização de objetos complexos no terminal.
    console.dir(personificationManual, { depth: null });
    console.log('--- FIM DO MANUAL ---');

    console.log('\n✅ Geração do manual concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro crítico durante a geração do manual:', error);
  }
}

// Executa a função principal.
runManualGeneration();
