
document.getElementById('yesButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        const previousUrl = currentTab.url; // Salva a URL atual

        chrome.tabs.update(currentTab.id, {url: previousUrl});
    });
});

document.getElementById('noButton').addEventListener('click', function() {
    chrome.tabs.goBack();
});
