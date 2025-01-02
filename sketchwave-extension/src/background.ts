chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.command === 'captureScreenshot') {
    chrome.tabs.captureVisibleTab(async (result) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message })
      } else {
        const tab = await chrome.tabs.create({ url: `https://sketchwave.vercel.app` });
        await chrome.scripting.executeScript({
          args: [result],
          func: (dataUrl: string) => sessionStorage.setItem('dataUrl', dataUrl),
          target: { tabId: tab.id! },
          injectImmediately: true
        });
        sendResponse({ success: true });
      }
    });
  }
  return true;
});


