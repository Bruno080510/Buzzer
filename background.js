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
      body: `url=${encodeURIComponent(url)}`, // Ajuste no corpo da solicitação
    });

    console.log('Resposta da API:', response);

    if (response.ok) {
      console.log("oiii");
      const data = await response.json();
      const scanId = data.data.id;

      // Consultar o resultado da verificação em segundo plano (isso é apenas um exemplo)
      const result = await checkScanResult(scanId);
      showNotification("Bora", "Funcionou");

      return result;
    }
  } catch (error) {
    console.error('Erro ao verificar a segurança do site:', error);
    return null;
  }

}

// Função para consultar o resultado da verificação
async function checkScanResult(scanId) {
  const apiKey = '842fdcd04948ec11f1a2d3818c093f77d0f718ddf1405d4c7a7010beac58f59a'; // Substitua pela sua chave de API
  const apiUrl = `https://www.virustotal.com/api/v3/urls/${scanId}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'x-apikey': apiKey,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const scanResult = data.data.attributes.last_analysis_stats;

      return scanResult;
    }
  } catch (error) {
    console.error('Erro ao consultar o resultado da verificação:', error);
    return null;
  }
}

// Listener de eventos para quando uma página é completamente carregada
chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.frameId === 0) {
    const url = details.url;

    // Verificar a segurança do site
    checkSiteSecurity(url)
      .then(result => {
        if (result) {
          showNotification('Verificação de Segurança Concluída', `O site é seguro: ${result.safe} / Não seguro: ${result.suspicious}`);
        }
      });
  }
});
