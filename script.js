/*const apiKey = "842fdcd04948ec11f1a2d3818c093f77d0f718ddf1405d4c7a7010beac58f59a";
const apiUrl = "https://www.virustotal.com/vtapi/v2/url/report";

async function verificarURL(url) {
  return fetch(url).then((res) => res.json());
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('oi');
  if (changeInfo && changeInfo.status === "complete") {
    const url = new URL(tab.url).hostname;

    try {
      const report = await verificarURL(apiUrl + `?apikey=${apiKey}&resource=${url}`);

      if (report.positives > 0) {
        alert("Esta URL NÃO é segura.");
      } else {
        alert("Esta URL é segura.");
      }
    } catch (error) {
      console.error('Erro ao enviar a solicitação:', error.message);
      alert("Ocorreu um erro ao verificar a URL.");
    }
  }
});
*/
