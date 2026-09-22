// 5266 AI Assistant — Content Script for gemini.google.com (Full Tab & Sidepanel Iframe)

(function () {
  console.log('🤖 5266 AI Assistant active on Gemini (URL:', window.location.href, ')');

  // Inject compact styles to remove huge empty gaps around math formulas and paragraphs
  function injectCompactStyles() {
    const existing = document.getElementById('5266-compact-gemini-style');
    if (existing) return;
    const style = document.createElement('style');
    style.id = '5266-compact-gemini-style';
    style.textContent = `
      :root, body, .md-content, .markdown, .model-response-text, message-content {
        --gem-sys-spacing-v-small: 3px !important;
        --gem-sys-spacing-v-medium: 6px !important;
        --gem-sys-spacing-v-large: 8px !important;
        --gem-sys-spacing-vertical: 6px !important;
        --gem-sys-spacing-paragraph: 6px !important;
      }

      /* Direct Override on Gemini's Specific @scope Rule */
      @scope (.md-content) to (.no-md > *) {
        :where(*) + :where(*):not(#_) {
          margin-top: 6px !important;
        }

        /* Target math block wrapper divs specifically */
        div:has(> .math-block),
        div:has(> [data-math]),
        [data-path-to-node]:has(.math-block),
        [data-path-to-node]:has([data-math]),
        .math-block {
          margin-top: 2px !important;
          margin-bottom: 2px !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }

        div:has(> .math-block) + div:has(> .math-block),
        div:has(> [data-math]) + div:has(> [data-math]),
        [data-path-to-node]:has(.math-block) + [data-path-to-node]:has(.math-block) {
          margin-top: 2px !important;
          margin-bottom: 2px !important;
        }

        p {
          margin-top: 5px !important;
          margin-bottom: 5px !important;
          line-height: 1.52 !important;
        }

        p:has(.katex),
        p:has(.katex-display) {
          margin-top: 2px !important;
          margin-bottom: 2px !important;
        }

        ul, ol {
          margin-top: 3px !important;
          margin-bottom: 4px !important;
          padding-left: 18px !important;
        }
        li {
          margin-top: 2px !important;
          margin-bottom: 2px !important;
        }
      }

      /* Global Fallback Selectors */
      .md-content :where(*) + :where(*):not(#_),
      .markdown :where(*) + :where(*):not(#_),
      message-content :where(*) + :where(*):not(#_) {
        margin-top: 6px !important;
      }

      .md-content div:has(> .math-block),
      .markdown div:has(> .math-block),
      .md-content [data-path-to-node]:has(.math-block),
      .markdown [data-path-to-node]:has(.math-block),
      div[data-path-to-node]:has(> .math-block),
      div[data-path-to-node]:has(.math-block),
      div[data-path-to-node]:has([data-math]),
      div:has(> .math-block),
      div:has(> [data-math]),
      .math-block,
      .katex-display {
        margin-top: 2px !important;
        margin-bottom: 2px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        line-height: 1.35 !important;
      }

      div:has(> .math-block) + div:has(> .math-block),
      div:has(> [data-math]) + div:has(> [data-math]),
      [data-path-to-node]:has(.math-block) + [data-path-to-node]:has(.math-block),
      div[data-path-to-node]:has(.math-block) + div[data-path-to-node]:has(.math-block) {
        margin-top: 2px !important;
        margin-bottom: 2px !important;
      }

      .math-block {
        display: block !important;
        margin: 0 !important;
        padding: 1px 0 !important;
        text-align: center !important;
      }
      .math-block .katex-display {
        margin: 0 !important;
        padding: 0 !important;
      }

      .md-content p, .markdown p, p[data-path-to-node] {
        margin-top: 5px !important;
        margin-bottom: 5px !important;
        line-height: 1.52 !important;
      }

      p:empty, .md-content p:empty, .markdown p:empty {
        display: none !important;
        margin: 0 !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  injectCompactStyles();
  setInterval(injectCompactStyles, 2000);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCompactStyles);
  }

  // Monitor and save active conversation URL
  function saveCurrentChatUrl() {
    try {
      const url = window.location.href;
      if (url && url.includes('/app/') && !url.endsWith('/app') && !url.endsWith('/app/')) {
        chrome.storage.local.get(['activeGeminiChatUrl'], (res) => {
          if (res && res.activeGeminiChatUrl !== url) {
            chrome.storage.local.set({ activeGeminiChatUrl: url });
            console.log('📌 5266 AI: Saved active conversation URL:', url);
          }
        });
      }
    } catch (e) {}
  }

  setInterval(saveCurrentChatUrl, 1000);

  // Helper: Find existing 5266 chat in Gemini sidebar if on generic /app
  function findExisting5266SidebarChat() {
    try {
      const chatLinks = document.querySelectorAll('a[href*="/app/"], nav a, mat-list-item, div[role="listitem"]');
      for (const item of chatLinks) {
        const text = (item.textContent || '').toLowerCase();
        if (text.includes('5266') || text.includes('5266-bp-app')) {
          const link = item.tagName.toLowerCase() === 'a' ? item : item.querySelector('a') || item;
          return link;
        }
      }
    } catch (e) {}
    return null;
  }

  // Helper: Find Gemini prompt input field
  function findGeminiInput() {
    const selectors = [
      'rich-textarea .ql-editor',
      'rich-textarea div[contenteditable="true"]',
      'div.ql-editor[contenteditable="true"]',
      'div[contenteditable="true"][role="textbox"]',
      'rich-textarea p',
      'div[role="textbox"]',
      'textarea[aria-label*="prompt" i]',
      'textarea[aria-label*="Ask" i]',
      'textarea[placeholder*="Ask" i]',
      'textarea[placeholder*="বলুন" i]',
      'div[contenteditable="true"]',
      'textarea'
    ];

    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        if (el && el.offsetParent !== null) {
          return el;
        }
      } catch (e) {}
    }
    return null;
  }

  // Helper: Find Gemini Send Button
  function findGeminiSendButton() {
    const selectors = [
      'button[aria-label*="Send prompt" i]',
      'button[aria-label*="Send message" i]',
      'button[aria-label*="Send" i]',
      'button[aria-label*="পাঠান" i]',
      'button.send-button',
      '.send-button-container button',
      'button[data-testid="send-button"]',
      'button:has(mat-icon[fonticon="send"])',
      'button:has(svg[aria-label*="Send" i])',
      'div.send-button-container button',
      'button.send-button-container',
      'button[aria-label*="Submit" i]'
    ];

    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        if (el) {
          const btn = el.closest('button') || el;
          if (btn && btn.offsetParent !== null) {
            return btn;
          }
        }
      } catch (e) {}
    }

    try {
      const allButtons = document.querySelectorAll('button');
      for (const btn of allButtons) {
        const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
        if (aria.includes('send') || aria.includes('পাঠান')) {
          return btn;
        }
        if (btn.querySelector('mat-icon') && btn.innerHTML.includes('send')) {
          return btn;
        }
      }
    } catch (e) {}

    return null;
  }

  // Helper: Insert multiline text cleanly into Gemini input
  // Helper: Insert multiline text cleanly into Gemini input without highlighting document
  function insertFullMultilinePrompt(inputEl, text) {
    // Clear any existing document selection so nothing is highlighted
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }

    inputEl.focus();

    if (inputEl.tagName && inputEl.tagName.toLowerCase() === 'textarea') {
      inputEl.value = text;
      inputEl.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      inputEl.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    // Format paragraphs for Quill editor (<p>line</p>), blank lines as <p><br></p>
    const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const lines = text.split('\n');
    const htmlContent = lines.map(line => {
      const trimmed = line.trim();
      return `<p>${trimmed ? escape(line) : '<br>'}</p>`;
    }).join('');

    // Method 1: DataTransfer + ClipboardEvent 'paste' (Safe without execCommand selectAll)
    try {
      inputEl.innerHTML = '';

      const dt = new DataTransfer();
      dt.setData('text/plain', text);
      dt.setData('text/html', htmlContent);
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: dt,
        bubbles: true,
        cancelable: true
      });
      inputEl.dispatchEvent(pasteEvent);
    } catch (e) {}

    // Method 2: Fallback if paste didn't populate full text
    const currentLength = (inputEl.innerText || inputEl.textContent || '').trim().length;
    if (currentLength < text.trim().length * 0.6) {
      inputEl.innerHTML = htmlContent;

      inputEl.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertFromPaste',
        data: text
      }));
      inputEl.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      inputEl.dispatchEvent(new Event('change', { bubbles: true }));
      inputEl.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    }

    // Cleanly remove any residual selection ranges so NO text on screen remains highlighted
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }

  // Active prompt processing
  let activeInterval = null;

  function submitPromptToGemini(text) {
    if (!text) return;

    console.log('📝 5266 AI: Queuing multiline prompt to Gemini (Length:', text.length, 'chars)...');

    // Clear any previous attempts
    if (activeInterval) {
      clearInterval(activeInterval);
      activeInterval = null;
    }

    // If on generic /app, check if 5266 chat link exists in sidebar
    const currentUrl = window.location.href;
    const isBlankApp = currentUrl.endsWith('/app') || currentUrl.endsWith('/app/');
    if (isBlankApp) {
      const existingChatLink = findExisting5266SidebarChat();
      if (existingChatLink) {
        console.log('🔗 5266 AI: Opening existing 5266 chat...');
        existingChatLink.click();
      }
    }

    let retries = 0;
    const maxRetries = 50; // up to 15s

    activeInterval = setInterval(() => {
      retries++;
      const inputEl = findGeminiInput();

      if (inputEl) {
        clearInterval(activeInterval);
        activeInterval = null;

        // Insert full multiline prompt
        insertFullMultilinePrompt(inputEl, text);

        // Wait for UI recognition and submit
        setTimeout(() => {
          const sendBtn = findGeminiSendButton();
          const isDisabled = sendBtn && (sendBtn.disabled || sendBtn.getAttribute('aria-disabled') === 'true');

          if (sendBtn && !isDisabled) {
            sendBtn.click();
            console.log('✅ 5266 AI: Submitted prompt via Send Button!');
          } else {
            // Fallback: Dispatch Enter key
            inputEl.focus();
            inputEl.dispatchEvent(new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
              bubbles: true,
              cancelable: true
            }));
            inputEl.dispatchEvent(new KeyboardEvent('keyup', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
              bubbles: true,
              cancelable: true
            }));
            console.log('✅ 5266 AI: Dispatched prompt via Enter key!');
          }

          if (window.getSelection) {
            window.getSelection().removeAllRanges();
          }

          setTimeout(saveCurrentChatUrl, 1500);
        }, 500);

      } else if (retries >= maxRetries) {
        clearInterval(activeInterval);
        activeInterval = null;
        console.warn('⚠️ 5266 AI: Timeout waiting for Gemini chat input area.');
      }
    }, 300);
  }

  // 1. Storage changed trigger (Primary reliable cross-frame listener)
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      if (changes.promptTrigger && changes.promptTrigger.newValue) {
        chrome.storage.local.get(['currentPrompt'], (res) => {
          if (res && res.currentPrompt) {
            submitPromptToGemini(res.currentPrompt);
          }
        });
      }
    }
  });

  // 2. Direct message listener (Backup)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message) return;
    if ((message.type === 'EXECUTE_GEMINI_PROMPT' || message.type === 'NEW_MCQ_LOADED') && message.prompt) {
      submitPromptToGemini(message.prompt);
      sendResponse({ status: 'initiated' });
    }
  });

  // 3. PostMessage listener (from sidepanel iframe)
  window.addEventListener('message', (event) => {
    if (event.data && typeof event.data === 'object' && event.data.type === '5266_INJECT_PROMPT') {
      if (event.data.prompt) {
        submitPromptToGemini(event.data.prompt);
      }
    }
  });

  // 4. Initial load check
  chrome.storage.local.get(['currentPrompt', 'updatedAt', 'autoSubmitPending'], (res) => {
    if (res && res.currentPrompt && res.autoSubmitPending) {
      const elapsed = Date.now() - (res.updatedAt || 0);
      if (elapsed < 15000) {
        chrome.storage.local.set({ autoSubmitPending: false });
        setTimeout(() => {
          submitPromptToGemini(res.currentPrompt);
        }, 1200);
      }
    }
  });
})();
