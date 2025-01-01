chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.onMessage.addListener( (message, _sender, sendResponse) => {
    if (message.command === 'captureScreenshot') {
      chrome.tabs.captureVisibleTab(async (result) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message })
        } else {
          // const tab = await chrome.tabs.create({ url: `https://sketchwave.vercel.app` });
          const tab = await chrome.tabs.create({ url: `http://localhost:5173` });
          await chrome.scripting.executeScript({
            args: [result],
            func: (dataUrl: string)=> localStorage.setItem('injectedDataUrl', dataUrl),
            target: {
              tabId: tab.id!
            }
          });
          sendResponse({ success: true, result });
        }
      });
    }
    return true;
  })
});


