// 5266 AI Assistant — Content Script for gemini.google.com

(function () {
  console.log('🤖 5266 AI Assistant active on Gemini');

  // Helper: Find Gemini prompt input field
  function findGeminiInput() {
    const selectors = [
      'div.ql-editor[contenteditable="true"]',
      'div[contenteditable="true"][role="textbox"]',
      'rich-textarea p',
      'rich-textarea div[contenteditable="true"]',
      'textarea[aria-label*="prompt"]',
      'textarea[placeholder*="Ask"]',
      'div[contenteditable="true"]'
    ];

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  // Helper: Find Gemini Send Button
  function findGeminiSendButton() {
    const selectors = [
      'button[aria-label*="Send prompt"]',
      'button[aria-label*="Send message"]',
      'button[aria-label*="Send"]',
      'button[aria-label*="পাঠান"]',
      'button.send-button',
      '.send-button-container button',
      'button[data-testid="send-button"]',
      'mat-icon[fonticon="send"]',
      'button:has(mat-icon)'
    ];

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        // If element is inside button or is a button
        return el.closest('button') || el;
      }
    }
    return null;
  }

  // Inject text and trigger submit
  function submitPromptToGemini(text) {
    if (!text) return false;

    let retries = 0;
    const interval = setInterval(() => {
      retries++;
      const inputEl = findGeminiInput();

      if (inputEl) {
        clearInterval(interval);
        inputEl.focus();

        if (inputEl.tagName.toLowerCase() === 'textarea') {
          inputEl.value = text;
          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          // contenteditable div / rich-textarea
          // Use document.execCommand or textContent
          document.execCommand('selectAll', false, null);
          document.execCommand('insertText', false, text);
          inputEl.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
        }

        // Wait a few hundred ms for the UI send button to become enabled
        setTimeout(() => {
          const sendBtn = findGeminiSendButton();
          if (sendBtn && !sendBtn.disabled) {
            sendBtn.click();
            console.log('✅ 5266 AI prompt submitted successfully!');
          } else {
            // Fallback: Dispatch Enter key
            inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
            console.log('✅ 5266 AI prompt submitted via Enter key!');
          }
        }, 500);

      } else if (retries > 30) {
        clearInterval(interval);
        console.warn('⚠️ 5266 AI: Could not find Gemini prompt input area after 30 retries.');
      }
    }, 500);
  }

  // Listen for direct messages from extension
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === 'EXECUTE_GEMINI_PROMPT') {
      submitPromptToGemini(message.prompt);
      sendResponse({ status: 'initiated' });
    }
  });

  // Also check if there is an unfulfilled prompt from the last 20 seconds
  chrome.storage.local.get(['currentPrompt', 'updatedAt', 'autoSubmitPending'], (res) => {
    if (res && res.currentPrompt && res.autoSubmitPending) {
      const elapsed = Date.now() - (res.updatedAt || 0);
      if (elapsed < 20000) {
        chrome.storage.local.set({ autoSubmitPending: false });
        setTimeout(() => {
          submitPromptToGemini(res.currentPrompt);
        }, 1500);
      }
    }
  });
})();
