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

// Helper: Format MCQ prompt in Bengali
function formatBengaliPrompt(mcq) {
  const qText = mcq.question || mcq.question_text || '';
  const options = mcq.options || [];
  const correctAns = mcq.correct_answer || mcq.answer || '';
  const officialExpl = mcq.explanation || '';
  
  const optionLabels = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
  let optionsText = '';
  if (Array.isArray(options) && options.length > 0) {
    optionsText = options.map((opt, i) => `${optionLabels[i] || (i + 1)}) ${opt}`).join('\n');
  }

  let prompt = `অনুগ্রহ করে নিচের চাকরির পরীক্ষার MCQ প্রশ্নটি বিশদভাবে বিশ্লেষণ করে বাংলায় সহজবোধ্য ব্যাখ্যা দিন:\n\n`;
  prompt += `📌 প্রশ্ন:\n${qText}\n\n`;
  if (optionsText) {
    prompt += `বিকল্প অপশনসমূহ:\n${optionsText}\n\n`;
  }
  if (correctAns) {
    prompt += `💡 অফিসিয়াল সঠিক উত্তর: ${correctAns}\n\n`;
  }
  if (officialExpl) {
    prompt += `নোট/সূত্র: ${officialExpl}\n\n`;
  }
  prompt += `দয়া করে নিচের পয়েন্টগুলো ক্রমানুসারে বুঝিয়ে দিন:\n`;
  prompt += `১. সঠিক উত্তরটি কেন সঠিক? (উৎস ও প্রমাণসহ)\n`;
  prompt += `২. অন্যান্য বিকল্পগুলো কেন সঠিক নয় বা তাদের সাথে সম্পর্কিত গুরুত্বপূর্ণ তথ্যসমূহ কী?\n`;
  prompt += `৩. এই বিষয়ে ভবিষ্যতে পরীক্ষায় আসার মতো সম্পর্কিত শর্টকাট কৌশল ও মনে রাখার টিপস।`;

  return prompt;
}

// Handle incoming messages from Content Scripts and Side Panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return;

  // From Website: Ask AI triggered on an MCQ
  if (message.type === '5266_ASK_AI' || message.type === 'TOPMCQBD_ASK_AI') {
    const payload = message.payload || {};
    const formattedPrompt = formatBengaliPrompt(payload);

    // Save to storage for sidepanel and tabs
    chrome.storage.local.set({
      currentMCQ: payload,
      currentPrompt: formattedPrompt,
      updatedAt: Date.now()
    }, () => {
      // Open Sidepanel for the sender's window
      if (chrome.sidePanel && chrome.sidePanel.open && sender.tab?.windowId) {
        chrome.sidePanel.open({ windowId: sender.tab.windowId }).catch(err => {
          console.warn('Could not auto-open sidepanel:', err);
        });
      }

      // Broadcast to any open sidepanel UI
      chrome.runtime.sendMessage({
        type: 'NEW_MCQ_LOADED',
        payload: payload,
        prompt: formattedPrompt
      }).catch(() => {});

      sendResponse({ status: 'ok', prompt: formattedPrompt });
    });

    return true; // async sendResponse
  }

  // From Sidepanel: Send prompt directly to a Gemini Tab
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
        // Create new Gemini tab
        chrome.tabs.create({ url: 'https://gemini.google.com/app' }, (newTab) => {
          // Listen for tab load completion
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
