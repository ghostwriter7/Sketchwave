chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.command === 'captureScreenshot') {
      chrome.tabs.captureVisibleTab((result) => {
        sendResponse({ success: true, result });
      });
    }
  })
});


