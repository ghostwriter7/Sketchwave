
chrome.runtime.onMessage.addListener((message: {
  command: string,
  payload: { origin: [number, number], width: number, height: number }
}, _sender, sendResponse) => {
  if (message.command === 'captureScreenshot') {
    chrome.tabs.captureVisibleTab(async (result) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message })
      } else {
        const { height, width, origin: [x, y] } = message.payload;
        const offscreenCanvas = new OffscreenCanvas(width, height);
        const ctx = offscreenCanvas.getContext('2d')!;
        const response = await fetch(result);
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);

        ctx.drawImage(imageBitmap, x, y, width, height, 0, 0, width, height);
        const targetBlob = await offscreenCanvas.convertToBlob();

        const fileReader = new FileReader();

        fileReader.onload = async () => {
          const tab = await chrome.tabs.create({ url: `https://sketchwave.vercel.app` });
          await chrome.scripting.executeScript({
            args: [fileReader.result as string],
            func: (dataUrl: string) => sessionStorage.setItem('dataUrl', dataUrl),
            target: { tabId: tab.id! },
            injectImmediately: true
          });
          sendResponse({ success: true });
        }

        fileReader.readAsDataURL(targetBlob);
      }
    });
  }
  return true;
});


