document.addEventListener('keydown', async (event) => {
  if (event.ctrlKey && event.shiftKey && event.code === 'KeyK') {
    chrome.runtime.sendMessage({ command: 'captureScreenshot' }, (response) => {
      console.log(response);
    });
  }
});
