// 5266 AI Assistant — Content Script for Website (localhost, pages.dev, topmcqbd.com)

(function () {
  // Mark document so the React app knows the extension is installed
  document.documentElement.setAttribute('data-5266-extension-installed', 'true');

  // Dispatch custom ready event for immediate detection
  window.dispatchEvent(new CustomEvent('5266_AI_EXTENSION_READY', {
    detail: { version: '1.0.0', name: '5266-AI-extension' }
  }));

  // Periodically re-assert attribute in case DOM resets during hydration
  const markInterval = setInterval(() => {
    if (!document.documentElement.getAttribute('data-5266-extension-installed')) {
      document.documentElement.setAttribute('data-5266-extension-installed', 'true');
    }
  }, 1000);
  setTimeout(() => clearInterval(markInterval), 10000);

  // Listen for MCQ 'Ask AI' requests dispatched from the website
  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === '5266_ASK_AI' || event.data.type === 'TOPMCQBD_ASK_AI') {
      const payload = event.data.payload;

      // Forward to Background Service Worker
      chrome.runtime.sendMessage({
        type: '5266_ASK_AI',
        payload: payload
      }, (response) => {
        // Acknowledge back to the web page
        window.postMessage({
          type: '5266_ASK_AI_ACK',
          status: 'success',
          timestamp: Date.now()
        }, '*');
      });
    }

    // Ping / Status check from website
    if (event.data.type === 'CHECK_5266_EXTENSION') {
      window.postMessage({
        type: '5266_EXTENSION_PONG',
        installed: true,
        version: '1.0.0'
      }, '*');
    }
  });

  console.log('✅ 5266 AI Assistant Content Script active and ready for MCQ requests!');
})();
