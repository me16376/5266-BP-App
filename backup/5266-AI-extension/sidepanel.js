// 5266 AI Assistant — Sidepanel Controller

let currentPromptText = '';
let currentMCQData = null;

const activeMcqCard = document.getElementById('activeMcqCard');
const mcqQuestionText = document.getElementById('mcqQuestionText');
const mcqOptionsList = document.getElementById('mcqOptionsList');
const btnSendPrompt = document.getElementById('btnSendPrompt');
const btnCopyPrompt = document.getElementById('btnCopyPrompt');
const copySuccessMsg = document.getElementById('copySuccessMsg');
const btnOpenTab = document.getElementById('btnOpenTab');
const btnReload = document.getElementById('btnReload');
const btnToggleCard = document.getElementById('btnToggleCard');
const geminiFrame = document.getElementById('geminiFrame');
const frameFallback = document.getElementById('frameFallback');
const btnFallbackOpen = document.getElementById('btnFallbackOpen');

// Update UI with MCQ Details
function renderMCQ(mcq, prompt) {
  if (!mcq || (!mcq.question && !mcq.question_text)) {
    activeMcqCard.style.display = 'none';
    return;
  }

  currentMCQData = mcq;
  currentPromptText = prompt || '';

  const q = mcq.question || mcq.question_text || '';
  mcqQuestionText.textContent = q;

  const options = mcq.options || [];
  const optionLabels = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
  if (Array.isArray(options) && options.length > 0) {
    mcqOptionsList.innerHTML = options
      .map((opt, i) => `<div><strong>${optionLabels[i] || (i + 1)})</strong> ${opt}</div>`)
      .join('');
    mcqOptionsList.style.display = 'block';
  } else {
    mcqOptionsList.style.display = 'none';
  }

  activeMcqCard.style.display = 'block';
}

// Initial storage load
chrome.storage.local.get(['currentMCQ', 'currentPrompt'], (res) => {
  if (res && res.currentMCQ) {
    renderMCQ(res.currentMCQ, res.currentPrompt);
  }
});

// Listen for updates from Background
chrome.runtime.onMessage.addListener((message) => {
  if (message && message.type === 'NEW_MCQ_LOADED') {
    renderMCQ(message.payload, message.prompt);
  }
});

// Copy prompt to clipboard
btnCopyPrompt.addEventListener('click', () => {
  if (!currentPromptText) return;

  navigator.clipboard.writeText(currentPromptText).then(() => {
    copySuccessMsg.style.display = 'block';
    setTimeout(() => {
      copySuccessMsg.style.display = 'none';
    }, 2500);
  }).catch(err => {
    console.error('Clipboard copy failed:', err);
  });
});

// Send Prompt to Gemini
btnSendPrompt.addEventListener('click', () => {
  if (!currentPromptText) return;

  // Set pending flag so content-gemini.js can pick it up
  chrome.storage.local.set({
    autoSubmitPending: true,
    updatedAt: Date.now()
  });

  // Open or send to Gemini tab
  chrome.runtime.sendMessage({
    type: 'OPEN_OR_SEND_TO_GEMINI_TAB',
    prompt: currentPromptText
  });
});

// Open Full Tab
btnOpenTab.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://gemini.google.com/app' });
});

btnFallbackOpen.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://gemini.google.com/app' });
});

// Reload Iframe
btnReload.addEventListener('click', () => {
  if (geminiFrame) {
    geminiFrame.src = 'https://gemini.google.com/app?' + Date.now();
  }
});

// Toggle MCQ Card Collapsed
let isCollapsed = false;
btnToggleCard.addEventListener('click', () => {
  isCollapsed = !isCollapsed;
  if (isCollapsed) {
    mcqQuestionText.style.display = 'none';
    mcqOptionsList.style.display = 'none';
    btnToggleCard.textContent = 'প্রদর্শন করুন';
  } else {
    mcqQuestionText.style.display = 'block';
    if (currentMCQData?.options?.length) {
      mcqOptionsList.style.display = 'block';
    }
    btnToggleCard.textContent = 'সংক্ষেপ করুন';
  }
});
