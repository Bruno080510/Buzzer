chrome.storage.local.get(['currentUrl'], function(result) {
    const currentUrl = result.currentUrl;
    console.log('URL Atual:', currentUrl);
  
    document.getElementById('yesButton').addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.update({ url: currentUrl });
      });
    });
  
    document.getElementById('noButton').addEventListener('click', function() {
      chrome.tabs.goBack();
    });
  });
  