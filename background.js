const toCheck = "https://www.google.com/";
const toBlank = "about:blank";
const toGet = "https://get.s-onetag.com/underground-sync-portal/Portal.html";
const naosei = "https://5e4760028e6fd7eace16729cf2303b9f.safeframe.googlesyndication.com/safeframe/1-0-40/html/con";
const src = "about:src";
const adTrackingUrl = "https://ce.lijit.com/beacon?informer=&gdpr_consent=&us_privacy=&gpp=&gpp_sid=";
const yt = "https://www.youtube.com/";
const double = "https://ogs.google.com/u/0/widget/app?awwd=1&gm3=1&origin=chrome-untrusted%3A%2F%2Fnew-tab-page&origin=chrome%3A%2F%2Fnew-tab-page&cn=app&pid=1&spid=243&hl=pt-BR";
const devtools = "devtools://devtools/bundled/worker_app.html?remoteBase=https://chrome-devtools-frontend.appspot.com/serve_file/@eaa767197fa7dd412133d1b84f7eb60da43409c9/&hasOtherClients=true&browserConnection=true"
const chromeUntrusted = "chrome-untrusted://new-tab-page/one-google-bar?paramsencoded="
const accountsGoogle = "https://accounts.google.com/RotateCookiesPage?og_pid=1&rot=1&origin=https%3A%2F%2Fwww.google.com&exp_id=3701174"

let checkedUrls = [];

async function checkSiteSecurity(url) {
  if (
    url === "chrome://new-tab-page/" ||
    url.startsWith(toCheck) ||
    url.startsWith(toGet) ||
    url.startsWith(toBlank) ||
    url.includes("/confirmation.html") ||
    url.startsWith(naosei) ||
    url.startsWith(src) ||
    url == adTrackingUrl ||
    url.startsWith(yt) ||
    url.startsWith(double) ||
    url.startsWith(devtools) ||
    url.startsWith(chromeUntrusted) || url.startsWith(accountsGoogle)||
    checkedUrls.some(checkedUrl => url.includes(checkedUrl))
  ) {
    console.log("Oii");
  } else {
    if (url.startsWith("chrome://")) {
      console.log('URL interna do Chrome. Ignorando a verificação.');
      return;
    }

    const lastCheckedUrl = await new Promise((resolve) => {
      chrome.storage.local.get(['currentUrl'], (result) => {
        resolve(result.currentUrl);
        console.log("entrou");
      });
    });

    if (lastCheckedUrl && url.includes(lastCheckedUrl)) {
      console.log('URL já verificada');
      return;
    }

    const apiKey = '345fa2783994f5835e10be156b05b9e87283e28b497c2bac6640f10b560d6a9f';
    const apiUrl = `https://www.virustotal.com/vtapi/v2/url/report?apikey=${apiKey}&resource=${encodeURIComponent(url)}`;

    console.log('Iniciando verificação de segurança para:', url);

    try {
      const response = await fetch(apiUrl);

      console.log('Detalhes da solicitação:', JSON.stringify({ url }));

      if (response.ok) {
        const data = await response.json();
        console.log('Dados da resposta:', data);

        if ('positives' in data && data.positives === 0) {
          console.log("positive");
        } else {
          console.log('Site não seguro. Armazenando URL no chrome.storage.local.');
          chrome.storage.local.set({ 'currentUrl': url }, function () {
            console.log('URL armazenada com sucesso no chrome.storage.local.');
            console.log(checkedUrls);

            if (!url.includes("/confirmation.html")) {
              const targetUrl = '/confirmation.html';
              if (url !== targetUrl) {
                chrome.tabs.update({ url: targetUrl });
              }
            }

            checkedUrls.push(url);
          });
        }
      } else {
        console.error('Erro na verificação de segurança. Status:', response.status);
      }
    } catch (error) {
      console.error('Erro ao verificar a segurança do site:', error);

      if (error instanceof SyntaxError) {
        console.error('Erro de sintaxe JSON. Possível resposta inválida da API.');
      }
    }
  }
}

chrome.webNavigation.onCommitted.addListener(function (details) {
  const url = details.url;

  if (
    url === "chrome://new-tab-page/" ||
    url.startsWith(toCheck) ||
    url.startsWith(toGet) ||
    url.startsWith(toBlank) ||
    url.includes("/confirmation.html") ||
    url.startsWith(naosei) ||
    url.startsWith(src) ||
    url == adTrackingUrl ||
    url.startsWith(yt) ||
    url.startsWith(double)
  ) {
    console.log("Acesso permitido para:", url);
    return;
  }

  checkSiteSecurity(url);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'siteConfirmed') {
    chrome.storage.local.get(['currentUrl'], function (result) {
      const lastCheckedUrl = result.currentUrl;
      console.log('Última URL verificada:', lastCheckedUrl);
      checkedUrls.push(lastCheckedUrl);
    });
  }
});
