// 5266 AI Assistant — Background Service Worker

// Enable Side Panel on action click
chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(err => {
      console.warn('Side panel behavior config error:', err);
    });
  }
  console.log('5266 AI Assistant Extension installed successfully!');
});

// Fallback click listener to open side panel
chrome.action.onClicked.addListener((tab) => {
  if (chrome.sidePanel && chrome.sidePanel.open && tab.windowId) {
    chrome.sidePanel.open({ windowId: tab.windowId }).catch(err => {
      console.warn('Failed to open sidepanel:', err);
    });
  }
});

// Helper: Clean raw text from HTML, LaTeX and tags
function cleanText(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\$\$([\s\S]*?)\$\$/g, '$1')
    .replace(/\\\[([\s\S]*?)\\\]/g, '$1')
    .replace(/\\\(([\s\S]*?)\\\)/g, '$1')
    .replace(/(^|[^\\])\$([^\$\r\n]+?)\$/g, '$1$2')
    .replace(/```[a-zA-Z0-9_\-\+]*\n([\s\S]*?)```/g, '$1')
    .replace(/`([^`\r\n]+)`/g, '$1')
    .trim();
}

// Helper: Format MCQ prompt in Bengali (Only Question & Options, prefixed with 5266-bp-app for persistent chat naming)
function formatBengaliPrompt(mcq) {
  const qText = cleanText(mcq.question || mcq.question_text || '');
  const options = Array.isArray(mcq.options) ? mcq.options.map(cleanText) : [];
  
  const optionLabels = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
  let optionsText = '';
  if (options.length > 0) {
    optionsText = options.map((opt, i) => `${optionLabels[i] || (i + 1)}) ${opt}`).join('\n');
  }

  let prompt = `【5266-bp-app】MCQ সমাধান ও বিশ্লেষণ:\n\n`;
  prompt += `📌 প্রশ্ন:\n${qText}\n\n`;
  if (optionsText) {
    prompt += `অপশনসমূহ:\n${optionsText}\n\n`;
  }
  prompt += `দয়া করে বুঝিয়ে দিন:\n`;
  prompt += `১. সঠিক উত্তরটি কোনটি এবং কেন সঠিক? (বিশদ সমাধান ও প্রমাণসহ)\n`;
  prompt += `২. অন্যান্য অপশনগুলো কেন ভুল বা তাদের প্রাসঙ্গিক গুরুত্বপূর্ণ তথ্য কী?\n`;
  prompt += `৩. ভবিষ্যতে পরীক্ষায় মনে রাখার সহজ টেকনিক ও শর্টকাট কৌশল।`;

  return prompt;
}

// Handle incoming messages from Content Scripts and Side Panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return;

  // From Website: Ask AI triggered on an MCQ
  if (message.type === '5266_ASK_AI' || message.type === 'TOPMCQBD_ASK_AI') {
    const payload = message.payload || {};
    const formattedPrompt = formatBengaliPrompt(payload);

    // Save to storage for sidepanel and tabs (triggers storage.onChanged immediately)
    chrome.storage.local.set({
      currentMCQ: payload,
      currentPrompt: formattedPrompt,
      promptTrigger: Date.now(),
      autoSubmitPending: true,
      updatedAt: Date.now()
    }, () => {
      // Open Sidepanel for the sender's window
      if (chrome.sidePanel && chrome.sidePanel.open && sender.tab?.windowId) {
        chrome.sidePanel.open({ windowId: sender.tab.windowId }).catch(err => {
          console.warn('Could not auto-open sidepanel:', err);
        });
      }

      function safeBroadcast(msg) {
        try {
          chrome.runtime.sendMessage(msg, () => {
            if (chrome.runtime.lastError) {
              // Intentionally suppressed when sidepanel or receiver is not active
            }
          });
        } catch (e) {}
      }

      // Broadcast to sidepanel UI and Gemini frame
      safeBroadcast({
        type: 'NEW_MCQ_LOADED',
        payload: payload,
        prompt: formattedPrompt
      });

      safeBroadcast({
        type: 'EXECUTE_GEMINI_PROMPT',
        prompt: formattedPrompt
      });

      sendResponse({ status: 'ok', prompt: formattedPrompt });
    });

    return true; // async sendResponse
  }

  // From Sidepanel or Menu: Open full Gemini Tab if user explicitly requested
  if (message.type === 'OPEN_OR_SEND_TO_GEMINI_TAB') {
    const promptToSend = message.prompt;

    chrome.tabs.query({ url: '*://gemini.google.com/*' }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const targetTab = tabs[0];
        chrome.tabs.update(targetTab.id, { active: true }, () => {
          chrome.tabs.sendMessage(targetTab.id, {
            type: 'EXECUTE_GEMINI_PROMPT',
            prompt: promptToSend
          }).catch(console.error);
        });
        sendResponse({ status: 'sent_to_existing_tab', tabId: targetTab.id });
      } else {
        chrome.tabs.create({ url: 'https://gemini.google.com/app' }, (newTab) => {
          const listener = (tabId, info) => {
            if (tabId === newTab.id && info.status === 'complete') {
              chrome.tabs.onUpdated.removeListener(listener);
              setTimeout(() => {
                chrome.tabs.sendMessage(newTab.id, {
                  type: 'EXECUTE_GEMINI_PROMPT',
                  prompt: promptToSend
                }).catch(console.error);
              }, 2500);
            }
          };
          chrome.tabs.onUpdated.addListener(listener);
        });
        sendResponse({ status: 'created_new_tab' });
      }
    });

    return true;
  }
});
