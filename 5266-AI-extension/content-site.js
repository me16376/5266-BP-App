// 5266 AI Assistant — Content Script for Website (localhost, pages.dev, topmcqbd.com)

(function () {
  // Safe helper to check if extension context is valid
  function isExtensionValid() {
    try {
      return !!(chrome && chrome.runtime && chrome.runtime.id);
    } catch (e) {
      return false;
    }
  }

  if (!isExtensionValid()) return;

  // Mark document so the React app knows the extension is installed
  document.documentElement.setAttribute('data-5266-extension-installed', 'true');

  // Announce site active to background to enable side panel for this tab
  function notifySiteActive() {
    if (!isExtensionValid()) return;
    try {
      const hasAppId = !!(
        document.getElementById('app-5266-root') ||
        document.querySelector('meta[name="application-name"][content="5266-bp-app"]') ||
        document.querySelector('meta[name="5266-app-id"][content="5266-bp-app"]') ||
        document.body?.getAttribute('data-app') === '5266-bp-app'
      );

      chrome.runtime.sendMessage({
        type: '5266_SITE_ACTIVE',
        hasAppId: hasAppId,
        url: window.location.href
      }, () => {
        if (chrome.runtime.lastError) {}
      });
    } catch (e) {}
  }

  notifySiteActive();

  // Dispatch custom ready event for immediate detection
  try {
    window.dispatchEvent(new CustomEvent('5266_AI_EXTENSION_READY', {
      detail: { version: '1.0.0', name: '5266-AI-extension' }
    }));
  } catch (e) {}

  // Periodically re-assert attribute in case DOM resets during hydration
  const markInterval = setInterval(() => {
    if (!isExtensionValid()) {
      clearInterval(markInterval);
      return;
    }
    if (!document.documentElement.getAttribute('data-5266-extension-installed')) {
      document.documentElement.setAttribute('data-5266-extension-installed', 'true');
    }
    notifySiteActive();
  }, 1000);
  setTimeout(() => clearInterval(markInterval), 10000);

  // Listen for MCQ 'Ask AI' and custom prompt requests dispatched from the website
  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;
    if (!isExtensionValid()) return;

    if (event.data.type === '5266_ASK_AI' || event.data.type === 'TOPMCQBD_ASK_AI') {
      const payload = event.data.payload;

      try {
        chrome.runtime.sendMessage({
          type: '5266_ASK_AI',
          payload: payload
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.debug('5266 AI message delivery note:', chrome.runtime.lastError.message);
            return;
          }

          // Acknowledge back to the web page
          window.postMessage({
            type: '5266_ASK_AI_ACK',
            status: 'success',
            timestamp: Date.now()
          }, '*');
        });
      } catch (err) {
        console.debug('5266 AI runtime send error caught safely:', err);
      }
    }

    // Custom follow-up prompt from website buttons
    if (event.data.type === '5266_SEND_CUSTOM_PROMPT') {
      const prompt = event.data.prompt;
      try {
        chrome.runtime.sendMessage({
          type: '5266_SEND_CUSTOM_PROMPT',
          prompt: prompt
        }, (response) => {
          if (chrome.runtime.lastError) return;
          window.postMessage({
            type: '5266_CUSTOM_PROMPT_ACK',
            status: 'success'
          }, '*');
        });
      } catch (err) {}
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
