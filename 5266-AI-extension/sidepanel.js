// 5266 AI Assistant — Modern Sidepanel Controller

let currentPromptText = '';
let currentMCQData = null;
let isDrawerOpen = false;

// Header elements
const headerSnippet = document.getElementById('headerSnippet');
const headerSnippetText = document.getElementById('headerSnippetText');
const btnQuickCopy = document.getElementById('btnQuickCopy');
const btnQuickSend = document.getElementById('btnQuickSend');
const btnToggleDrawer = document.getElementById('btnToggleDrawer');
const toggleIcon = document.getElementById('toggleIcon');
const btnReload = document.getElementById('btnReload');
const btnNewChat = document.getElementById('btnNewChat');
const btnOpenTab = document.getElementById('btnOpenTab');

// Quick prompt follow-up buttons
const btnOtherOptions = document.getElementById('btnOtherOptions');
const btnShortcuts = document.getElementById('btnShortcuts');

// Drawer elements
const questionDrawer = document.getElementById('questionDrawer');
const drawerQuestionText = document.getElementById('drawerQuestionText');
const drawerOptionsList = document.getElementById('drawerOptionsList');
const btnCloseDrawer = document.getElementById('btnCloseDrawer');

// Toast & Frame elements
const toastMsg = document.getElementById('toastMsg');
const geminiFrame = document.getElementById('geminiFrame');
const frameFallback = document.getElementById('frameFallback');
const btnFallbackOpen = document.getElementById('btnFallbackOpen');

// Toast display helper
let toastTimer = null;
function showToast(msg) {
  if (!toastMsg) return;
  toastMsg.textContent = msg;
  toastMsg.style.display = 'block';
  
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMsg.style.display = 'none';
  }, 2200);
}

// Clean helper
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

// Core: Send arbitrary prompt / follow-up text to Gemini
function sendPromptToGemini(text, toastMessage = '🚀 জেমিনিতে পাঠানো হয়েছে') {
  if (!text) {
    showToast('⚠️ কোনো প্রম্পট পাওয়া যায়নি');
    return;
  }

  currentPromptText = text;

  // 1. Update storage to trigger content-gemini listener
  chrome.storage.local.set({
    currentPrompt: text,
    promptTrigger: Date.now(),
    autoSubmitPending: true,
    updatedAt: Date.now()
  });

  // 2. Broadcast via chrome.runtime
  try {
    chrome.runtime.sendMessage({
      type: 'EXECUTE_GEMINI_PROMPT',
      prompt: text
    }, () => {
      if (chrome.runtime.lastError) {}
    });
  } catch (e) {}

  // 3. Post directly to Gemini iframe window
  if (geminiFrame && geminiFrame.contentWindow) {
    try {
      geminiFrame.contentWindow.postMessage({
        type: '5266_INJECT_PROMPT',
        prompt: text
      }, '*');
    } catch (e) {}
  }

  showToast(toastMessage);
}

// Update UI with MCQ Details
function renderMCQ(mcq, prompt) {
  if (!mcq || (!mcq.question && !mcq.question_text)) {
    headerSnippetText.textContent = 'AI Assistant Ready';
    return;
  }

  currentMCQData = mcq;
  currentPromptText = prompt || '';

  const q = cleanText(mcq.question || mcq.question_text || '');
  
  // Update slim header snippet
  headerSnippetText.textContent = q.length > 28 ? q.slice(0, 28) + '...' : q;
  headerSnippet.title = q;

  // Update detailed drawer
  drawerQuestionText.textContent = q;

  const options = Array.isArray(mcq.options) ? mcq.options : [];
  const optionLabels = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
  if (options.length > 0) {
    drawerOptionsList.innerHTML = options
      .map((opt, i) => {
        const lbl = optionLabels[i] || (i + 1);
        const txt = cleanText(opt);
        return `
          <div class="clickable-option-row" data-label="${lbl}" data-text="${encodeURIComponent(txt)}" title="অপশনটি নিয়ে জেমিনিতে জিজ্ঞাসা করতে ক্লিক করুন">
            <span class="opt-label">${lbl})</span>
            <span class="opt-content">${txt}</span>
            <span class="opt-ask-badge">ব্যাখ্যা চান ↗</span>
          </div>
        `;
      })
      .join('');
    drawerOptionsList.style.display = 'block';

    // Click handler for individual options
    drawerOptionsList.querySelectorAll('.clickable-option-row').forEach(row => {
      row.addEventListener('click', () => {
        const lbl = row.getAttribute('data-label');
        const txt = decodeURIComponent(row.getAttribute('data-text') || '');
        const followUp = `এই প্রশ্নে '${lbl}) ${txt}' অপশনটি কেন সঠিক বা ভুল এবং এর সাথে সম্পর্কিত দরকারি বিষয়গুলো বুঝিয়ে দাও।`;
        sendPromptToGemini(followUp, `🔍 অপশন (${lbl}) বিশ্লেষণ চাওয়া হয়েছে`);
      });
    });
  } else {
    drawerOptionsList.style.display = 'none';
  }

  questionDrawer.scrollTop = 0;
}

// Toggle drawer function
function toggleDrawer(forceState) {
  isDrawerOpen = typeof forceState === 'boolean' ? forceState : !isDrawerOpen;
  
  if (isDrawerOpen) {
    questionDrawer.style.display = 'block';
    toggleIcon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    btnToggleDrawer.title = 'প্রশ্নের বিস্তারিত লুকান';
  } else {
    questionDrawer.style.display = 'none';
    toggleIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    btnToggleDrawer.title = 'প্রশ্নের বিস্তারিত দেখুন';
  }
}

// Quick Copy
function handleCopyPrompt() {
  if (!currentPromptText) {
    showToast('⚠️ কোনো প্রম্পট পাওয়া যায়নি');
    return;
  }

  navigator.clipboard.writeText(currentPromptText).then(() => {
    showToast('📋 সম্পূর্ণ প্রম্পট কপি হয়েছে!');
  }).catch(err => {
    console.error('Copy failed:', err);
    showToast('✕ কপি করা সম্ভব হয়নি');
  });
}

// Event Listeners
btnQuickCopy.addEventListener('click', handleCopyPrompt);
btnQuickSend.addEventListener('click', () => {
  if (currentPromptText) {
    sendPromptToGemini(currentPromptText, '🚀 জেমিনিতে পুনরায় পাঠানো হয়েছে');
  } else {
    showToast('⚠️ কোনো প্রশ্ন সক্রিয় নেই');
  }
});

// 2 Dedicated Quick Action Buttons
if (btnOtherOptions) {
  btnOtherOptions.addEventListener('click', () => {
    const text = 'অন্যান্য অপশনগুলো কেন ভুল বা তাদের প্রাসঙ্গিক গুরুত্বপূর্ণ তথ্য দাও';
    sendPromptToGemini(text, '🔍 অপশনগুলোর বিশ্লেষণ চাওয়া হয়েছে');
  });
}

if (btnShortcuts) {
  btnShortcuts.addEventListener('click', () => {
    const text = 'ভবিষ্যতে পরীক্ষায় মনে রাখার সহজ টেকনিক ও শর্টকাট কৌশল দাও';
    sendPromptToGemini(text, '⚡ শর্টকাট ও টেকনিক চাওয়া হয়েছে');
  });
}

btnToggleDrawer.addEventListener('click', () => toggleDrawer());
headerSnippet.addEventListener('click', () => toggleDrawer());
btnCloseDrawer.addEventListener('click', () => toggleDrawer(false));

btnReload.addEventListener('click', () => {
  if (geminiFrame) {
    const current = geminiFrame.src;
    const cleanUrl = current.split('?')[0];
    geminiFrame.src = cleanUrl + '?' + Date.now();
    showToast('🔄 রিফ্রেশ করা হচ্ছে...');
  }
});

if (btnNewChat) {
  btnNewChat.addEventListener('click', () => {
    chrome.storage.local.remove('activeGeminiChatUrl');
    if (geminiFrame) {
      geminiFrame.src = 'https://gemini.google.com/app?' + Date.now();
      showToast('✨ নতুন চ্যাট সেশন শুরু হয়েছে');
    }
  });
}

btnOpenTab.addEventListener('click', () => {
  chrome.storage.local.get(['activeGeminiChatUrl'], (res) => {
    const targetUrl = (res && res.activeGeminiChatUrl) ? res.activeGeminiChatUrl : 'https://gemini.google.com/app';
    chrome.tabs.create({ url: targetUrl });
  });
});

btnFallbackOpen.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://gemini.google.com/app' });
});

// Initial storage load: Restore persistent conversation URL & last MCQ
chrome.storage.local.get(['activeGeminiChatUrl', 'currentMCQ', 'currentPrompt'], (res) => {
  if (res && res.activeGeminiChatUrl) {
    if (geminiFrame && geminiFrame.src !== res.activeGeminiChatUrl) {
      geminiFrame.src = res.activeGeminiChatUrl;
      console.log('📌 Restored active chat URL:', res.activeGeminiChatUrl);
    }
  }
  if (res && res.currentMCQ) {
    renderMCQ(res.currentMCQ, res.currentPrompt);
  }
});

// Listen for updates from Background / Storage
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.currentMCQ && changes.currentMCQ.newValue) {
    chrome.storage.local.get(['currentMCQ', 'currentPrompt'], (res) => {
      if (res && res.currentMCQ) {
        renderMCQ(res.currentMCQ, res.currentPrompt);
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message && message.type === 'NEW_MCQ_LOADED') {
    renderMCQ(message.payload, message.prompt);
  }
});
