// 5266 AI Assistant — Background Service Worker

// Helper: Check if a URL belongs to 5266 app
function isAllowedUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    
    // localhost or 127.0.0.1
    if (host === 'localhost' || host === '127.0.0.1') {
      return true;
    }
    // 5266-bp-app on Cloudflare Pages
    if (host === '5266-bp-app.pages.dev' || host.endsWith('.5266-bp-app.pages.dev')) {
      return true;
    }
    // Any pages.dev preview or topmcqbd
    if (host.endsWith('.pages.dev') || host.includes('topmcqbd')) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

// Helper: Synchronize side panel state per-tab
async function syncTabSidePanel(tabId, url) {
  if (!chrome.sidePanel || !chrome.sidePanel.setOptions) return;
  if (!url) return;

  const allowed = isAllowedUrl(url);
  if (allowed) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel.html',
      enabled: true
    }).catch(() => {});
  } else {
    // Disable side panel on other websites, new tab (chrome://), etc.
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    }).catch(() => {});
  }
}

// Initialize on install: Side panel disabled by default for non-app tabs
chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel && chrome.sidePanel.setOptions) {
    chrome.sidePanel.setOptions({ enabled: false }).catch(() => {});
  }
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});
  }
  console.log('5266 AI Assistant Extension installed successfully!');
});

// Initialize on startup
chrome.runtime.onStartup.addListener(() => {
  if (chrome.sidePanel && chrome.sidePanel.setOptions) {
    chrome.sidePanel.setOptions({ enabled: false }).catch(() => {});
  }
});

// Listen for tab navigation / update
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url || tab?.url;
  if (url) {
    syncTabSidePanel(tabId, url);
  }
});

// Listen for tab activation (switching tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && tab.url) {
      syncTabSidePanel(activeInfo.tabId, tab.url);
    }
  } catch (e) {}
});

// Fallback click listener on extension icon (only opens for allowed tabs)
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.id) return;
  if (isAllowedUrl(tab.url)) {
    try {
      await chrome.sidePanel.setOptions({
        tabId: tab.id,
        path: 'sidepanel.html',
        enabled: true
      });
      await chrome.sidePanel.open({ tabId: tab.id });
    } catch (err) {
      if (tab.windowId) {
        chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => {});
      }
    }
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

// Helper: Format MCQ prompt in Bengali — ONLY Question & Options
function formatBengaliPrompt(mcq) {
  const qText = cleanText(mcq.question || mcq.question_text || '');
  const options = Array.isArray(mcq.options) ? mcq.options.map(cleanText) : [];
  
  const optionLabels = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
  let optionsText = '';
  if (options.length > 0) {
    optionsText = options.map((opt, i) => {
      const hasLabel = /^[কখগঘঙa-eA-E0-9][\)\.\-]\s*/.test(opt);
      return hasLabel ? opt : `${optionLabels[i] || (i + 1)}) ${opt}`;
    }).join('\n');
  }

  let prompt = qText;
  if (optionsText) {
    prompt += '\n' + optionsText;
  }
  return prompt.trim();
}

// Safe broadcast helper
function safeBroadcast(msg) {
  try {
    chrome.runtime.sendMessage(msg, () => {
      if (chrome.runtime.lastError) {}
    });
  } catch (e) {}
}

// Handle incoming messages from Content Scripts and Side Panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return;

  // 1. Site detected active (verified via content script)
  if (message.type === '5266_SITE_ACTIVE') {
    if (sender.tab && sender.tab.id) {
      chrome.sidePanel.setOptions({
        tabId: sender.tab.id,
        path: 'sidepanel.html',
        enabled: true
      }).catch(() => {});
    }
    sendResponse({ status: 'ok' });
    return;
  }

  // 2. From Website: Ask AI triggered on an MCQ
  if (message.type === '5266_ASK_AI' || message.type === 'TOPMCQBD_ASK_AI') {
    const payload = message.payload || {};
    const formattedPrompt = formatBengaliPrompt(payload);

    chrome.storage.local.set({
      currentMCQ: payload,
      currentPrompt: formattedPrompt,
      promptTrigger: Date.now(),
      autoSubmitPending: true,
      updatedAt: Date.now()
    }, () => {
      // Enable sidepanel specifically for sender's tab
      if (sender.tab?.id && chrome.sidePanel && chrome.sidePanel.setOptions) {
        chrome.sidePanel.setOptions({
          tabId: sender.tab.id,
          path: 'sidepanel.html',
          enabled: true
        }).catch(() => {});
      }

      // Open Sidepanel for the sender's tab/window
      if (chrome.sidePanel && chrome.sidePanel.open) {
        if (sender.tab?.id) {
          chrome.sidePanel.open({ tabId: sender.tab.id }).catch(err => {
            if (sender.tab?.windowId) {
              chrome.sidePanel.open({ windowId: sender.tab.windowId }).catch(() => {});
            }
          });
        } else if (sender.tab?.windowId) {
          chrome.sidePanel.open({ windowId: sender.tab.windowId }).catch(() => {});
        }
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

  // 3. Custom Follow-up Prompts (e.g. from the 2 buttons)
  if (message.type === '5266_SEND_CUSTOM_PROMPT') {
    const customPrompt = (message.prompt || '').trim();
    if (customPrompt) {
      chrome.storage.local.set({
        currentPrompt: customPrompt,
        promptTrigger: Date.now(),
        autoSubmitPending: true,
        updatedAt: Date.now()
      }, () => {
        safeBroadcast({
          type: 'EXECUTE_GEMINI_PROMPT',
          prompt: customPrompt
        });
        sendResponse({ status: 'ok', prompt: customPrompt });
      });
    }
    return true;
  }

  // 4. From Sidepanel: Open full Gemini Tab if user explicitly requested
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
