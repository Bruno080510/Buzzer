const toCheck = "https://www.google.com/search";
const checkedUrls = [];

console.log(this);

function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: './images/Abelha.png',
    title: title,
    message: message,
  });
}

async function checkSiteSecurity(url) {
  if (url === "chrome://new-tab-page/" || url.startsWith(toCheck) || url.includes("/confirmation.html")) {
    console.log("Oii");
  } else {
    if (checkedUrls.includes(url)) {
      console.log('URL já verificada. Ignorando a verificação.');
      return;
    }

    const apiKey = '842fdcd04948ec11f1a2d3818c093f77d0f718ddf1405d4c7a7010beac58f59a';
    const apiUrl = `https://www.virustotal.com/vtapi/v2/url/report?apikey=${apiKey}&resource=${encodeURIComponent(url)}`;

    console.log('Iniciando verificação de segurança para:', url);

    try {
      const response = await fetch(apiUrl);
      console.log('Detalhes da solicitação:', JSON.stringify({ url }));
      console.log('Resposta da API:', response);

      if (response.ok) {
        const data = await response.json();
        console.log('Dados da resposta:', (data));

        const isSafe = isSiteSafe(data);

        if (isSafe == 0) {
          showNotification('Verificação de Segurança Concluída', 'O site é seguro.');
        } else {
          console.log('Site não seguro. Armazenando URL no chrome.storage.local.');
          chrome.storage.local.set({ 'currentUrl': url }, function() {
            console.log('URL armazenada com sucesso no chrome.storage.local.');
          });
          showNotification('Verificação de Segurança Concluída', 'O site não é seguro.');

          // Adicione a verificação para evitar redirecionar se já estiver na página de confirmação
          if (!url.includes("/confirmation.html")) {
            chrome.tabs.update({ url: '/confirmation.html' });
          }

          checkedUrls.push(url);

          return;
        }
      } else {
        console.error('Erro na verificação de segurança. Status:', response.status);
      }
    } catch (error) {
      console.error('Erro ao verificar a segurança do site:', error);
    }
  }
}



function isSiteSafe(data) {
  const analysisType = data.positives;
  return analysisType === 1; 
}

chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.frameId === 0) {
    const url = details.url;
    checkSiteSecurity(url);
  }
});
