// content.js
document.addEventListener("click", function (event) {
    const targetUrl = event.target.href;
  
    if (targetUrl) {
      chrome.runtime.sendMessage({ action: "checkSiteSecurity", url: targetUrl });
    }
  });
  