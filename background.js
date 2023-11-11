// background.js

console.log(this);

function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: './images/Abelha.png',
    title: title,
    message: message,
  });
}

showNotification("Testeando", "TesteLindao");
showNotification("Taloko", "Meu");

async function checkSiteSecurity(url) {
  const apiKey = '842fdcd04948ec11f1a2d3818c093f77d0f718ddf1405d4c7a7010beac58f59a';
  const apiUrl = 'https://www.virustotal.com/api/v3/urls';
  console.log('Iniciando verificação de segurança para:', url);

  try {
    console.log('Detalhes da solicitação:', JSON.stringify({ url }));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'x-apikey': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `url=${encodeURIComponent(url)}`,
    });

    console.log('Resposta da API:', response);

    if (response.ok) {
      const data = await response.json();
      console.log('Dados da resposta:', JSON.stringify(data));

      // Verifique se o site é seguro com base na nova lógica
      const isSafe = isSiteSafe(data);

      if (isSafe) {
        showNotification('Verificação de Segurança Concluída', 'O site é seguro.');
      } else {
        showNotification('Verificação de Segurança Concluída', 'O site não é seguro.');
      }
    } else {
      console.error('Erro na verificação de segurança. Status:', response.status);
    }
  } catch (error) {
    console.error('Erro ao verificar a segurança do site:', error);
  }
}

// Função para verificar se o site é seguro
function isSiteSafe(data) {
  // Adapte essa lógica de acordo com a estrutura real da resposta
  // Por exemplo, pode ser que a resposta tenha uma propriedade 'data' e dentro dela uma propriedade 'attributes'
  const analysisType = data.data.type;

  // Verifique se o tipo de análise é o esperado
  // Adapte conforme necessário com base na estrutura real da resposta
  return analysisType === 'analysis';
}

// Listener de eventos para quando uma página é completamente carregada
chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.frameId === 0) {
    const url = details.url;

    // Verificar a segurança do site
    checkSiteSecurity(url);
  }
});
