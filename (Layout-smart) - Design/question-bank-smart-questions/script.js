/**
 * TopMCQBD - Questions Layout Vanilla JavaScript Logic
 * 100% Identical Feature Set, Layout Settings, Scoring, Timer, and AI Assistant
 */

(function () {
  'use strict';

  // --- Constants & Configs ---
  const FONT_FAMILIES = [
    { id: 'noto-sans', name: 'Noto Sans Bengali', sub: 'ক্লিন ও আধুনিক (ডিফল্ট)', family: "'Noto Sans Bengali', sans-serif" },
    { id: 'hind-siliguri', name: 'Hind Siliguri', sub: 'হিন্দ শিলিগুড়ি (জনপ্রিয় ও সুস্পষ্ট)', family: "'Hind Siliguri', sans-serif" },
    { id: 'tiro-bangla', name: 'Tiro Bangla', sub: 'তিরো বাংলা (মার্জিত ও ফরমাল সেরিফ)', family: "'Tiro Bangla', serif" },
    { id: 'anek-bangla', name: 'Anek Bangla', sub: 'অনেক বাংলা (বোল্ড ও আধুনিক)', family: "'Anek Bangla', sans-serif" },
    { id: 'poppins', name: 'Poppins', sub: 'পপিন্স (জ্যামিতিক ও আকর্ষণীয় স্যান-সেরিফ)', family: "'Poppins', 'Noto Sans Bengali', sans-serif" },
    { id: 'montserrat', name: 'Montserrat', sub: 'মন্টসেরাট (স্টাইলিশ ও প্রিমিয়াম)', family: "'Montserrat', 'Noto Sans Bengali', sans-serif" },
    { id: 'arial', name: 'Arial', sub: 'অ্যারিয়াল (ইউনিভার্সাল ও স্ট্যান্ডার্ড)', family: "Arial, 'Noto Sans Bengali', sans-serif" },
    { id: 'noto-sans-math', name: 'Noto Sans Math', sub: 'নোটো সান্স ম্যাথ (ম্যাথ ও টেক্সট)', family: "'Noto Sans Math', 'Noto Sans Bengali', sans-serif" }
  ];

  const FONT_WEIGHTS = [
    { id: 'thin', value: 'thin', name: 'Thin', sub: 'পাতলা ও হালকা ফন্ট (৩০০)', weight: 300 },
    { id: 'regular', value: 'regular', name: 'Regular', sub: 'স্বাভাবিক ও স্পষ্ট (ডিফল্ট - ৪০০)', weight: 400 },
    { id: 'medium', value: 'medium', name: 'Medium', sub: 'মাঝারি গাঢ় ও পরিচ্ছন্ন (৬০০)', weight: 600 },
    { id: 'bold', value: 'bold', name: 'Bold', sub: 'সম্পূর্ণ গাঢ় ও আকর্ষণীয় (৮০০)', weight: 800 }
  ];

  const BANGLA_LETTERS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
  const ENGLISH_LETTERS = ['A', 'B', 'C', 'D', 'E'];
  const ENGLISH_LOWERCASE_LETTERS = ['a', 'b', 'c', 'd', 'e'];
  const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  const PRESET_LIST = [
    { id: 'practice', name: 'অনুশীলন', icon: 'fa-graduation-cap' },
    { id: 'read', name: 'Read', icon: 'fa-book-open' },
    { id: 'exam', name: 'Live exam', icon: 'fa-stopwatch' },
    { id: 'custom', name: 'My setting', icon: 'fa-sliders' }
  ];

  const DEFAULT_PRESET_PROFILES = {
    practice: {
      questionLayout: '2q-col',
      optionLayout: '2',
      middleLine: 'dotted',
      bottomLine: 'dotted',
      middleGap: 60,
      optionLetter: 'bangla',
      questionStyle: 'dotted',
      highlightMode: 'single',
      highlightColor: 'highlight-and-circle',
      explanationMode: 'on-select',
      showExplanation: true,
      cutMark: 0.5,
      cutMarkMode: '0.5',
      customCutMarkInput: '',
      fontSize: 16,
      fontFamily: "'Noto Sans Bengali', sans-serif",
      fontWeight: 'regular',
      customFontSizeInput: '',
      answerMode: 'none',
      showAnswer: false,
      showTime: false,
      showScore: true
    },
    read: {
      questionLayout: '1q',
      optionLayout: '4',
      middleLine: 'none',
      bottomLine: 'none',
      middleGap: 0,
      optionLetter: 'bangla',
      questionStyle: 'box',
      highlightMode: 'both',
      highlightColor: 'soft-highlight',
      explanationMode: 'on-select',
      showExplanation: true,
      cutMark: 0,
      cutMarkMode: '0',
      customCutMarkInput: '',
      fontSize: 16,
      fontFamily: "'Noto Sans Bengali', sans-serif",
      fontWeight: 'regular',
      customFontSizeInput: '',
      answerMode: 'explanation-only',
      showAnswer: false,
      showTime: false,
      showScore: false
    },
    exam: {
      questionLayout: '2q-col',
      optionLayout: '2',
      middleLine: 'dotted',
      bottomLine: 'none',
      middleGap: 80,
      optionLetter: 'bangla',
      questionStyle: 'circle',
      highlightMode: 'neutral',
      highlightColor: 'full-bg',
      explanationMode: 'none',
      showExplanation: false,
      cutMark: 0.5,
      cutMarkMode: '0.5',
      customCutMarkInput: '',
      fontSize: 16,
      fontFamily: "'Noto Sans Bengali', sans-serif",
      fontWeight: 'regular',
      customFontSizeInput: '',
      answerMode: 'none',
      showAnswer: false,
      showTime: true,
      showScore: true
    },
    custom: {
      questionLayout: '2q-col',
      optionLayout: '2',
      middleLine: 'none',
      bottomLine: 'none',
      middleGap: 80,
      optionLetter: 'bangla',
      questionStyle: 'nostyle',
      highlightMode: 'both',
      highlightColor: 'with-icons',
      explanationMode: 'on-wrong',
      showExplanation: true,
      cutMark: 0.5,
      cutMarkMode: '0.5',
      customCutMarkInput: '',
      fontSize: 16,
      fontFamily: "'Noto Sans Bengali', sans-serif",
      fontWeight: 'regular',
      customFontSizeInput: '',
      answerMode: 'on-wrong',
      showAnswer: true,
      showTime: false,
      showScore: true
    }
  };

  // Sample 10 MCQs (Embedded to guarantee instant zero-setup launch even via file:// protocol)
  const DEFAULT_QUESTIONS = [
    {
      _id: "q1",
      q: "বাংলা সাহিত্যের প্রথম মহাকাব্য কোনটি?",
      options: ["মেঘনাদবধ কাব্য", "পদ্মাবতী", "বৃত্রসংহার", "মহাশ্মশান"],
      ans: 0,
      explanation: "মাইকেল মধুসূদন দত্ত রচিত 'মেঘনাদবধ কাব্য' (১৮৬১) বাংলা সাহিত্যের প্রথম সার্থক মহাকাব্য। এটি অমিত্রাক্ষর ছন্দে রচিত এবং এর সর্গ সংখ্যা ৯টি।"
    },
    {
      _id: "q2",
      q: "‘সূর্য’ শব্দের সমার্থক শব্দ কোনটি?",
      options: ["সুধাংশু", "মিহির", "শশাঙ্ক", "বিধু"],
      ans: 1,
      explanation: "'মিহির' সূর্যের সমার্থক শব্দ। অন্যদিকে সুধাংশু, শশাঙ্ক ও বিধু চাঁদের সমার্থক শব্দ।"
    },
    {
      _id: "q3",
      q: "Which one is the correct spelling?",
      options: ["Bureaucracy", "Beaurocracy", "Bureaucrasy", "Burocracy"],
      ans: 0,
      explanation: "সঠিক বানান হলো 'Bureaucracy', যার বাংলা অর্থ আমলাতন্ত্র।"
    },
    {
      _id: "q4",
      q: "The idiom 'A hot potato' means—",
      options: ["A delicious food", "A controversial issue difficult to deal with", "An urgent meeting", "A useless thing"],
      ans: 1,
      explanation: "'A hot potato' বাগধারাটির অর্থ হলো এমন একটি বিতর্কিত বা স্পর্শকাতর বিষয় যা সামলানো অত্যন্ত কঠিন।"
    },
    {
      _id: "q5",
      q: "মুজিবনগর সরকার কত তারিখে আনুষ্ঠানিকভাবে শপথ গ্রহণ করে?",
      options: ["১০ এপ্রিল ১৯৭১", "১৭ এপ্রিল ১৯৭১", "২৫ মার্চ ১৯৭১", "২৬ মার্চ ১৯৭১"],
      ans: 1,
      explanation: "১৯৭১ সালের ১০ এপ্রিল মুজিবনগর সরকার গঠিত হয় এবং ১৭ এপ্রিল মেহেরপুরের বৈদ্যনাথতলার ভবেরপাড়ায় (বর্তমান মুজিবনগর) আনুষ্ঠানিকভাবে শপথ গ্রহণ করে।"
    },
    {
      _id: "q6",
      q: "গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধানে মোট কতটি অনুচ্ছেদ রয়েছে?",
      options: ["১৩৭টি", "১৫৩টি", "১৪৫টি", "১৬২টি"],
      ans: 1,
      explanation: "বাংলাদেশের মূল সংবিধানে মোট ১৫৩টি অনুচ্ছেদ, ১১টি ভাগ ও ৪টি মূলনীতি রয়েছে। এটি ১৯৭২ সালের ১৬ ডিসেম্বর কার্যকর হয়।"
    },
    {
      _id: "q7",
      q: "জাতিসংঘের বর্তমান মহাসচিব আন্তোনিও গুতেরেস কোন দেশের নাগরিক?",
      options: ["স্পেন", "পর্তুগাল", "ব্রাজিল", "ইতালি"],
      ans: 1,
      explanation: "আন্তোনিও গুতেরেস পর্তুগালের সাবেক প্রধানমন্ত্রী এবং ২০১৭ সালের ১ জানুয়ারি থেকে জাতিসংঘের ৯ম মহাসচিব হিসেবে দায়িত্ব পালন করছেন।"
    },
    {
      _id: "q8",
      q: "টাকায় ৩টি করে আম ক্রয় করে ২টি করে বিক্রয় করলে শতকরা কত লাভ হবে?",
      options: ["৩৩.৩৩%", "৫০%", "২৫%", "২০%"],
      ans: 1,
      explanation: "১টি আমের ক্রয়মূল্য = ১/৩ টাকা, ১টি আমের বিক্রয়মূল্য = ১/২ টাকা। লাভ = (১/২ - ১/৩) = ১/৬ টাকা। শতকরা লাভ = (১/৬ ÷ ১/৩) × ১০০% = ৫০% লাভ।"
    },
    {
      _id: "q9",
      q: "বায়ুমণ্ডলে নাইট্রোজেনের পরিমাণ শতকরা প্রায় কত ভাগ?",
      options: ["৭৮.০৯%", "২০.৯৫%", "০.০৩%", "০.৯৩%"],
      ans: 0,
      explanation: "শুষ্ক বাতাসে নাইট্রোজেনের পরিমাণ প্রায় ৭৮.০৯%, অক্সিজেনের পরিমাণ প্রায় ২০.৯৫% এবং আর্গনের পরিমাণ প্রায় ০.৯৩%।"
    },
    {
      _id: "q10",
      q: "কম্পিউটারের প্রধান স্থায়ী মেমোরি কোনটি?",
      options: ["RAM", "ROM", "Cache", "Register"],
      ans: 1,
      explanation: "ROM (Read Only Memory) হলো কম্পিউটারের একটি নন-ভোলাটাইল বা স্থায়ী মেমোরি, যা বিদ্যুৎ বন্ধ হলেও মুছে যায় না।"
    }
  ];

  // --- State Variables ---
  let allQuestions = [...DEFAULT_QUESTIONS];
  let displayQuestions = [...DEFAULT_QUESTIONS];
  let answeredQuestions = {}; // { [qIndex]: optIndex }
  let expandedAnswers = {}; // { [qIndex]: boolean }
  let expandedExplanations = {}; // { [qIndex]: boolean }

  let isReadMode = false;
  let activeMode = 'practice'; // 'practice' | 'read'
  let activePreset = 'practice'; // 'practice' | 'read' | 'exam' | 'custom'
  let showAskAi = false;
  let showColor = true;
  let showAnswer = false;
  let answerMode = 'none';
  let lastActiveAnswerMode = 'on-select';
  let showExplanation = true;
  let explanationMode = 'on-select';
  let lastActiveExplanationMode = 'on-select';

  let questionLayout = '2q-col'; // '2q-col' | '2q-row' | '3q-col' | '3q-row' | '1q'
  let optionLayout = '2'; // '1' | '2' | '4'
  let questionStyle = 'dotted'; // 'dotted' | 'box' | 'circle' | 'bracket' | 'nostyle'
  let middleLine = 'dotted'; // 'dotted' | 'solid' | 'none'
  let bottomLine = 'dotted'; // 'dotted' | 'solid' | 'none'
  let middleGap = 60; // 0 | 60 | 80 | custom
  let customMiddleGapInput = '';

  let highlightMode = 'single'; // 'single' | 'both' | 'neutral'
  let highlightColor = 'highlight-and-circle'; // 'full-bg' | 'border-only' | 'label-only' | 'highlight-and-circle' | 'with-icons' | 'bottom-line' | 'soft-highlight'
  let optionLetter = 'bangla'; // 'bangla' | 'english' | 'english-lower'

  let cutMark = 0.5;
  let cutMarkMode = '0.5';
  let customCutMarkInput = '';

  let fontSize = 16;
  let fontFamily = "'Noto Sans Bengali', sans-serif";
  let fontWeight = 'regular';
  let customFontSizeInput = '';

  let showTime = false;
  let showScore = true;
  let limit = 'all';
  let rangeIndex = 0;
  let showLimitMenu = false;
  let showRangeMenu = false;

  const LIMIT_LABELS = {
    all: 'সকল প্রশ্ন',
    '20': '২০ টি প্রশ্ন',
    '25': '২৫ টি প্রশ্ন',
    '50': '৫০ টি প্রশ্ন',
    '100': '১০০ টি প্রশ্ন'
  };

  let score = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  let totalSecondsLeft = 0;
  let timerInterval = null;
  let timerRunning = false;
  let warningTriggered = false;

  let isReviewWrongMode = false;
  let isRetakeWrongMode = false;
  let originalQuestionsList = [];

  // Popup state
  let popupState = {
    visible: false,
    type: '',
    title: '',
    msg: '',
    hasReset: false,
    isCompletion: false
  };

  // AI Chat state
  let aiMessages = [
    {
      sender: 'ai',
      text: 'আমি **TopMCQBD AI শিক্ষক**।\nযে কোনো প্রশ্নের পাশে থাকা **"Ask AI"** বাটনে চাপুন অথবা নিচে আপনার প্রশ্নটি লিখে পাঠান — আমি উত্তর ও ব্যাখ্যা বুঝিয়ে দেব।'
    }
  ];

  // --- Helper Functions ---
  function toBengaliNumber(num) {
    if (num === undefined || num === null) return '০';
    return String(num).replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
  }

  function formatScore(val) {
    if (val === undefined || val === null || isNaN(val)) return '০';
    const rounded = Math.round(val * 100) / 100;
    const str = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(rounded % 0.1 === 0 ? 1 : 2);
    return str.replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
  }

  function formatTimer(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    const mStr = `${m < 10 ? '0' : ''}${m}`.replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
    const sStr = `${s < 10 ? '0' : ''}${s}`.replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
    return `${mStr}:${sStr}`;
  }

  function getOptionLabel(idx) {
    if (optionLetter === 'english') {
      return ENGLISH_LETTERS[idx] || String.fromCharCode(65 + idx);
    }
    if (optionLetter === 'english-lower') {
      return ENGLISH_LOWERCASE_LETTERS[idx] || String.fromCharCode(97 + idx);
    }
    return BANGLA_LETTERS[idx] || (idx + 1);
  }

  function saveActivePresetSetting(key, value) {
    try {
      const current = activePreset || 'custom';
      const raw = localStorage.getItem('topmcqbd_preset_profiles');
      let profiles = {};
      if (raw) {
        try { profiles = JSON.parse(raw); } catch (e) { profiles = {}; }
      }
      if (!profiles[current]) {
        profiles[current] = { ...(DEFAULT_PRESET_PROFILES[current] || DEFAULT_PRESET_PROFILES.practice) };
      }
      profiles[current][key] = value;
      localStorage.setItem('topmcqbd_preset_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.warn('Error saving preset setting:', e);
    }
  }

  function applyPresetProfile(presetId, profileData) {
    const merged = {
      ...(DEFAULT_PRESET_PROFILES[presetId] || DEFAULT_PRESET_PROFILES.practice),
      ...(profileData || {})
    };

    questionLayout = merged.questionLayout || '2q-col';
    optionLayout = merged.optionLayout || '2';
    middleLine = merged.middleLine || 'dotted';
    bottomLine = merged.bottomLine || 'dotted';
    middleGap = typeof merged.middleGap === 'number' ? merged.middleGap : 60;
    questionStyle = merged.questionStyle || 'dotted';
    highlightMode = merged.highlightMode || 'single';
    highlightColor = merged.highlightColor || 'highlight-and-circle';
    optionLetter = merged.optionLetter || 'bangla';
    cutMark = typeof merged.cutMark === 'number' ? merged.cutMark : 0.5;
    cutMarkMode = merged.cutMarkMode || '0.5';
    fontSize = merged.fontSize || 16;
    fontFamily = merged.fontFamily || "'Noto Sans Bengali', sans-serif";
    fontWeight = merged.fontWeight || 'regular';

    explanationMode = merged.explanationMode || 'on-select';
    showExplanation = merged.explanationMode !== 'none' && merged.explanationMode !== 'answer-only';
    if (explanationMode !== 'none') lastActiveExplanationMode = explanationMode;

    let resAnsMode = merged.answerMode || (merged.showAnswer ? 'on-select' : 'none');
    answerMode = resAnsMode;
    showAnswer = resAnsMode !== 'none' && resAnsMode !== 'explanation-only';
    if (showAnswer) lastActiveAnswerMode = resAnsMode;

    if (typeof merged.showTime === 'boolean') showTime = merged.showTime;
    if (typeof merged.showScore === 'boolean') showScore = merged.showScore;

    updateUIControls();
    renderQuestions();
    updateScoreBoard();
  }

  function updateSettingsPopupHeight() {
    const sPopup = document.getElementById('globalSettingsPopup');
    const sTrigger = document.getElementById('btnGlobalSettingsTrigger');
    if (!sPopup || sPopup.classList.contains('is-hidden') || sPopup.style.display === 'none') return;
    const rect = sTrigger ? sTrigger.getBoundingClientRect() : { bottom: 0 };
    const spaceBelow = window.innerHeight - rect.bottom - 16;
    const targetHeight = Math.max(380, Math.min(740, spaceBelow));
    sPopup.style.maxHeight = `${targetHeight}px`;
  }

  function updateHasActiveAccordion() {
    const sPopup = document.getElementById('globalSettingsPopup');
    const majorSecs = ['secLayout', 'secColorStyle', 'secExplanation', 'secOptionLetter', 'secCutMark', 'secFont'];
    const hasAnyActive = majorSecs.some((id) => {
      const el = document.getElementById(id);
      return el && el.classList.contains('active');
    });
    if (sPopup) {
      sPopup.classList.toggle('has-active-accordion', hasAnyActive);
    }
  }

  function openGlobalSettings() {
    closeLimitMenu();
    closeRangeMenu();
    const sPopup = document.getElementById('globalSettingsPopup');
    const sChevron = document.getElementById('settingsChevron');
    if (!sPopup) return;
    sPopup.classList.remove('is-hidden');
    sPopup.style.display = 'flex';
    if (sChevron) {
      sChevron.className = 'fa-solid fa-chevron-up';
    }
    updateSettingsPopupHeight();
    updateHasActiveAccordion();
  }

  function closeGlobalSettings() {
    const sPopup = document.getElementById('globalSettingsPopup');
    const sChevron = document.getElementById('settingsChevron');
    if (!sPopup) return;
    sPopup.classList.add('is-hidden');
    sPopup.style.display = 'none';
    if (sChevron) {
      sChevron.className = 'fa-solid fa-chevron-down';
    }
  }

  function toggleGlobalSettings() {
    const sPopup = document.getElementById('globalSettingsPopup');
    if (!sPopup) return;
    if (sPopup.classList.contains('is-hidden') || sPopup.style.display === 'none') {
      openGlobalSettings();
    } else {
      closeGlobalSettings();
    }
  }

  function setAccordionOpenState(secId, isOpen) {
    const sec = document.getElementById(secId);
    if (!sec) return;
    const body = sec.querySelector('.quiz-global-section-body');
    const icon = sec.querySelector('.quiz-font-accordion-plus-minus');
    sec.classList.toggle('active', isOpen);
    if (body) body.style.display = isOpen ? 'block' : 'none';
    if (icon) icon.className = `fa-solid fa-${isOpen ? 'minus' : 'plus'} quiz-font-accordion-plus-minus`;
    updateHasActiveAccordion();
    updateSettingsPopupHeight();
  }

  function syncPresetVisuals(presetId) {
    activePreset = presetId;
    const ind = document.getElementById('indicatorActivePreset');
    const pObj = PRESET_LIST.find((p) => p.id === presetId);
    if (ind && pObj) ind.textContent = pObj.name;

    const container = document.getElementById('presetTabsContainer');
    const featuresBox = document.getElementById('presetFeaturesBox');
    if (container) {
      container.className = `quiz-preset-tabs-container preset-theme-${presetId}`;
    }
    if (featuresBox) {
      featuresBox.className = `quiz-preset-features-box preset-theme-${presetId}`;
    }

    const presetIds = PRESET_LIST.map((p) => p.id);
    const btns = Array.from(document.querySelectorAll('.quiz-preset-btn'));
    btns.forEach((btn, idx) => {
      const p = btn.getAttribute('data-preset');
      const isActive = p === presetId;
      const isNextActive = presetIds[idx + 1] === presetId;
      btn.className = `quiz-preset-btn ${isActive ? `active preset-${p}` : ''} ${isNextActive ? 'has-active-next' : ''}`;
    });

    const fIcon = document.getElementById('presetFeaturesIcon');
    const fTitle = document.getElementById('presetFeaturesTitle');
    const fTag = document.getElementById('presetFeaturesTag');
    const fSub = document.getElementById('presetFeaturesSubtitle');

    if (fIcon && pObj) {
      fIcon.innerHTML = `<i class="fa-solid ${pObj.icon}"></i>`;
    }
    if (fTitle && pObj) {
      fTitle.textContent = `‘${pObj.name}’ মোডের ফিচারসমূহ`;
    }
    if (fTag) {
      fTag.textContent = presetId === 'custom' ? 'ব্যক্তিগত সেটিংস' : 'প্রি-বিল্ট ফিচারস';
    }
    if (fSub) {
      if (presetId === 'practice') fSub.textContent = 'সাধারণ অনুশীলন ও অপশনভিত্তিক স্বয়ংক্রিয় ব্যাখ্যা';
      else if (presetId === 'read') fSub.textContent = 'সঠিক উত্তর সরাসরি প্রদর্শন ও পড়ার সুবিধাজনক মোড';
      else if (presetId === 'exam') fSub.textContent = 'পরীক্ষার আদলে নিরপেক্ষ ভিউ (কোনো তাত্ক্ষণিক উত্তর নেই)';
      else if (presetId === 'custom') fSub.textContent = 'আপনার সংরক্ষিত নিজস্ব ব্যক্তিগত সেটিংস ও ফিচারসমূহ';
    }
  }

  function handleSelectPreset(presetId) {
    syncPresetVisuals(presetId);

    if (presetId === 'exam') {
      isReadMode = false;
      activeMode = 'practice';
      setAccordionOpenState('secLayout', true);
      setAccordionOpenState('secColorStyle', false);
      setAccordionOpenState('secExplanation', false);
      setAccordionOpenState('secOptionLetter', false);
      setAccordionOpenState('secCutMark', false);
      setAccordionOpenState('secFont', false);
    } else if (presetId === 'read') {
      isReadMode = true;
      activeMode = 'read';
      setAccordionOpenState('secLayout', true);
      setAccordionOpenState('secColorStyle', true);
      setAccordionOpenState('secExplanation', true);
      setAccordionOpenState('secOptionLetter', false);
      setAccordionOpenState('secCutMark', false);
      setAccordionOpenState('secFont', false);
    } else if (presetId === 'practice') {
      isReadMode = false;
      activeMode = 'practice';
      setAccordionOpenState('secLayout', true);
      setAccordionOpenState('secColorStyle', false);
      setAccordionOpenState('secExplanation', false);
      setAccordionOpenState('secOptionLetter', false);
      setAccordionOpenState('secCutMark', false);
      setAccordionOpenState('secFont', false);
    } else {
      isReadMode = false;
      activeMode = 'practice';
    }

    try {
      localStorage.setItem('topmcqbd_active_preset', presetId);
      const raw = localStorage.getItem('topmcqbd_preset_profiles');
      let profiles = raw ? JSON.parse(raw) : {};
      const profile = profiles[presetId] || DEFAULT_PRESET_PROFILES[presetId];
      applyPresetProfile(presetId, profile);
    } catch (e) {
      applyPresetProfile(presetId, DEFAULT_PRESET_PROFILES[presetId]);
    }
  }

  // --- UI Update & Synchronization ---
  function updateUIControls() {
    const container = document.getElementById('quizContainer');
    if (container) {
      container.style.setProperty('--quiz-font-size', `${fontSize}px`);
      container.style.setProperty('--quiz-font-family', fontFamily);
      const fwMap = { thin: '300', regular: '400', medium: '600', bold: '800' };
      const qwMap = { thin: '400', regular: '600', medium: '700', bold: '800' };
      const cwMap = { thin: '500', regular: '700', medium: '700', bold: '800' };
      container.style.setProperty('--quiz-font-weight', fwMap[fontWeight] || '400');
      container.style.setProperty('--quiz-question-weight', qwMap[fontWeight] || '600');
      container.style.setProperty('--quiz-circle-weight', cwMap[fontWeight] || '700');
    }

    // Top mode buttons
    const btnPractice = document.getElementById('btnModePractice');
    const btnRead = document.getElementById('btnModeRead');
    if (btnPractice) btnPractice.classList.toggle('active', !isReadMode);
    if (btnRead) btnRead.classList.toggle('active', isReadMode);

    // Ask AI Switcher
    const switchAskAi = document.getElementById('switchAskAi');
    const askAiLabel = document.getElementById('askAiSwitcherLabel');
    const sliderAskAi = document.getElementById('sliderAskAi');
    if (switchAskAi) switchAskAi.checked = showAskAi;
    if (askAiLabel) {
      askAiLabel.style.background = showAskAi ? '#e0f2fe' : '#e2e8f0';
      askAiLabel.style.color = showAskAi ? '#0284c7' : '#2c3e50';
      askAiLabel.style.borderColor = showAskAi ? '#7dd3fc' : 'transparent';
    }
    if (sliderAskAi) {
      sliderAskAi.style.backgroundColor = showAskAi ? '#0284c7' : '';
    }

    // Explanation Switch
    const switchExp = document.getElementById('switchExplanation');
    const textExp = document.getElementById('textExplanationSwitch');
    if (switchExp) switchExp.checked = (explanationMode !== 'none');
    if (textExp) {
      if (explanationMode === 'on-select') textExp.textContent = 'ব্যাখ্যা (স্বয়ংক্রিয়)';
      else if (explanationMode === 'on-button') textExp.textContent = 'ব্যাখ্যা (ম্যানুয়াল)';
      else if (explanationMode === 'on-wrong') textExp.textContent = 'ব্যাখ্যা (ভুল প্রশ্নে)';
      else if (explanationMode === 'answer-only') textExp.textContent = 'শুধু উত্তর';
      else textExp.textContent = 'ব্যাখ্যা';
    }

    // Time Switch
    const switchTime = document.getElementById('switchTime');
    const lblTime = document.getElementById('lblTimeSwitch');
    if (switchTime) {
      switchTime.checked = showTime;
      switchTime.disabled = isReadMode;
    }
    if (lblTime) {
      lblTime.classList.toggle('disabled-switch', isReadMode);
    }
    const timerBoard = document.getElementById('timerBoard');
    if (timerBoard) {
      timerBoard.style.display = (showTime && !isReadMode && displayQuestions.length > 0) ? 'inline-flex' : 'none';
    }

    // Score Switch
    const switchScore = document.getElementById('switchScore');
    const lblScore = document.getElementById('lblScoreSwitch');
    if (switchScore) {
      switchScore.checked = showScore;
      switchScore.disabled = isReadMode;
    }
    if (lblScore) {
      lblScore.classList.toggle('disabled-switch', isReadMode);
    }
    const scoreBoard = document.getElementById('scoreBoard');
    if (scoreBoard) {
      scoreBoard.style.display = (showScore && !isReadMode && displayQuestions.length > 0) ? 'inline-flex' : 'none';
    }

    // Top Restart button
    const btnTopRestart = document.getElementById('btnTopRestart');
    if (btnTopRestart) {
      const answeredLen = Object.keys(answeredQuestions).length;
      btnTopRestart.style.display = (!isReadMode && answeredLen > 0 && answeredLen < displayQuestions.length) ? 'inline-flex' : 'none';
    }

    // Negative Mark Note
    const note = document.getElementById('negativeMarkNote');
    if (note) {
      note.textContent = cutMark === 0
        ? 'কোনো কাট মার্ক নেই'
        : `প্রতিটি ভুল উত্তরের জন্য ${toBengaliNumber(cutMark)} নম্বর কাটা যাবে`;
    }

    // Settings badges & active classes
    const badgeQStyle = document.getElementById('badgeQuestionStyle');
    if (badgeQStyle) {
      const map = { box: 'বক্স কার্ড', circle: 'সার্কেল অপশন', bracket: 'ব্র্যাকেট অপশন', nostyle: 'নো স্টাইল', dotted: 'বর্ডার লাইন' };
      badgeQStyle.textContent = map[questionStyle] || 'বর্ডার লাইন';
    }
    document.querySelectorAll('[data-qstyle]').forEach((btn) => {
      const s = btn.getAttribute('data-qstyle');
      const active = s === questionStyle;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    const badgeQL = document.getElementById('badgeQLayout');
    if (badgeQL) {
      const map = { '2q-col': '২টি প্রশ্ন (উপর-নিচ)', '2q-row': '২টি প্রশ্ন (পাশাপাশি)', '3q-col': '৩টি প্রশ্ন (উপর-নিচ)', '3q-row': '৩টি প্রশ্ন (পাশাপাশি)', '1q': '১টি প্রশ্ন' };
      badgeQL.textContent = map[questionLayout] || '২টি প্রশ্ন (উপর-নিচ)';
    }
    document.querySelectorAll('[data-qlayout]').forEach((btn) => {
      const l = btn.getAttribute('data-qlayout');
      const active = l === questionLayout;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    // 4 Options wrapper
    renderFourOptionChoice();

    const badgeOptL = document.getElementById('badgeOptLayout');
    if (badgeOptL) {
      badgeOptL.textContent = optionLayout === '4' ? '১ লাইনে ৪টি' : optionLayout === '2' ? '১ লাইনে ২টি' : '১ লাইনে ১টি';
    }
    document.querySelectorAll('[data-optlayout]').forEach((btn) => {
      const ol = btn.getAttribute('data-optlayout');
      const active = ol === optionLayout;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    const badgeMidL = document.getElementById('badgeMidLine');
    if (badgeMidL) {
      badgeMidL.textContent = middleLine === 'dotted' ? 'ডটেড লাইন' : middleLine === 'solid' ? 'সলিড লাইন' : 'লাইন ছাড়া';
    }
    document.querySelectorAll('[data-midline]').forEach((btn) => {
      const ml = btn.getAttribute('data-midline');
      const active = ml === middleLine;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    const badgeBotL = document.getElementById('badgeBottomLine');
    if (badgeBotL) {
      badgeBotL.textContent = bottomLine === 'dotted' ? 'ডটেড লাইন' : bottomLine === 'solid' ? 'সলিড লাইন' : 'লাইন ছাড়া';
    }
    document.querySelectorAll('[data-bottomline]').forEach((btn) => {
      const bl = btn.getAttribute('data-bottomline');
      const active = bl === bottomLine;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    const badgeGap = document.getElementById('badgeMidGap');
    if (badgeGap) {
      badgeGap.textContent = middleGap === 0 ? 'No Gap' : `${middleGap}px`;
    }
    document.querySelectorAll('[data-midgap]').forEach((btn) => {
      const g = parseInt(btn.getAttribute('data-midgap'), 10);
      const active = g === middleGap;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    const badgeCustomGap = document.getElementById('customGapActiveBadge');
    if (badgeCustomGap) {
      if (![0, 60, 80].includes(middleGap)) {
        badgeCustomGap.style.display = 'inline-block';
        badgeCustomGap.textContent = `সক্রিয়: ${middleGap}px`;
      } else {
        badgeCustomGap.style.display = 'none';
      }
    }

    // Color Answer Style
    const badgeCS = document.getElementById('badgeColorStyle');
    if (badgeCS) {
      const hModeStr = highlightMode === 'single' ? 'শুধু নির্বাচিত' : highlightMode === 'both' ? 'উভয়টি' : 'সিলেকশন';
      const hColMap = {
        'full-bg': 'সলিড',
        'border-only': 'বর্ডার',
        'label-only': 'চিহ্ন',
        'highlight-and-circle': 'আইকন+চিহ্ন',
        'with-icons': 'আইকন',
        'bottom-line': 'লাইন',
        'soft-highlight': 'হালকা'
      };
      badgeCS.textContent = `${hModeStr} · ${hColMap[highlightColor] || 'সলিড'}`;
    }

    document.querySelectorAll('[data-hlmode]').forEach((btn) => {
      const m = btn.getAttribute('data-hlmode');
      const active = m === highlightMode;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    document.querySelectorAll('[data-hlcolor]').forEach((btn) => {
      const c = btn.getAttribute('data-hlcolor');
      const active = c === highlightColor;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    // Answer Mode & Explanation Mode
    const badgeAnsM = document.getElementById('badgeAnswerMode');
    if (badgeAnsM) {
      const map = {
        'on-select': 'অপশন নির্বাচনে',
        'on-button': 'বাটনে ক্লিকে',
        'on-wrong': 'ভুল উত্তরে',
        'explanation-only': 'শুধু ব্যাখ্যা',
        'none': 'কোনো উত্তর নেই'
      };
      badgeAnsM.textContent = map[answerMode] || 'কোনো উত্তর নেই';
    }
    document.querySelectorAll('[data-ansmode]').forEach((btn) => {
      const am = btn.getAttribute('data-ansmode');
      const active = am === answerMode;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    const badgeExpM = document.getElementById('badgeExpMode');
    if (badgeExpM) {
      const map = {
        'on-select': 'অপশন নির্বাচনে',
        'on-button': 'বাটনে ক্লিকে',
        'on-wrong': 'ভুল উত্তরে',
        'answer-only': 'শুধু উত্তর',
        'none': 'কোনো ব্যাখ্যা নেই'
      };
      badgeExpM.textContent = map[explanationMode] || 'অপশন নির্বাচনে';
    }
    document.querySelectorAll('[data-expmode]').forEach((btn) => {
      const em = btn.getAttribute('data-expmode');
      const active = em === explanationMode;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    // Option Letter
    const badgeOptLet = document.getElementById('badgeOptionLetter');
    if (badgeOptLet) {
      badgeOptLet.textContent = optionLetter === 'english' ? 'A, B, C, D' : optionLetter === 'english-lower' ? 'a, b, c, d' : 'ক, খ, গ, ঘ';
    }
    document.querySelectorAll('[data-optletter]').forEach((btn) => {
      const ol = btn.getAttribute('data-optletter');
      const active = ol === optionLetter;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    // Cut Mark
    const badgeCM = document.getElementById('badgeCutMark');
    if (badgeCM) {
      badgeCM.textContent = cutMark === 0 ? '০ নম্বর' : `${toBengaliNumber(cutMark)} নম্বর`;
    }
    document.querySelectorAll('[data-cutmark]').forEach((btn) => {
      const cm = btn.getAttribute('data-cutmark');
      const active = cutMarkMode === cm;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    const badgeCustCM = document.getElementById('badgeCustomCutMarkActive');
    if (badgeCustCM) {
      if (cutMarkMode === 'custom') {
        badgeCustCM.style.display = 'inline-block';
        badgeCustCM.textContent = `সক্রিয়: ${toBengaliNumber(cutMark)}`;
      } else {
        badgeCustCM.style.display = 'none';
      }
    }

    // Font Size
    const badgeFS = document.getElementById('badgeFontSize');
    if (badgeFS) badgeFS.textContent = `${fontSize} px`;
    document.querySelectorAll('[data-fontsize]').forEach((btn) => {
      const fsVal = parseInt(btn.getAttribute('data-fontsize'), 10);
      btn.classList.toggle('active', fsVal === fontSize);
    });

    const badgeCustFont = document.getElementById('badgeCustomFontActive');
    if (badgeCustFont) {
      if (![14, 15, 16, 17, 18, 19, 20].includes(fontSize)) {
        badgeCustFont.style.display = 'inline-block';
        badgeCustFont.textContent = `সক্রিয়: ${toBengaliNumber(fontSize)} px`;
      } else {
        badgeCustFont.style.display = 'none';
      }
    }

    renderFontFamilyList();
    renderFontWeightList();
  }

  function renderFourOptionChoice() {
    const wrapper = document.getElementById('fourOptionWrapper');
    if (!wrapper) return;

    if (questionLayout === '1q') {
      wrapper.innerHTML = `
        <button type="button" class="quiz-layout-menu-item ${optionLayout === '4' ? 'active' : ''}" data-optlayout="4" id="btnOptLayout4">
          <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
            <div class="quiz-layout-radio-circle">
              ${optionLayout === '4' ? '<div class="quiz-layout-radio-inner"></div>' : ''}
            </div>
            <span>১ লাইনে ৪টি option</span>
          </div>
          <span class="quiz-option-active-badge">
            <i class="fa-solid fa-check" style="font-size: 9.5px;"></i>
            সক্রিয়
          </span>
        </button>
      `;
      const btn = document.getElementById('btnOptLayout4');
      if (btn) {
        btn.addEventListener('click', () => {
          optionLayout = '4';
          saveActivePresetSetting('optionLayout', '4');
          updateUIControls();
          renderQuestions();
        });
      }
    } else {
      wrapper.innerHTML = `
        <div style="width: 100%; position: relative;">
          <div class="quiz-layout-menu-item disabled" style="opacity: 0.68; cursor: not-allowed; display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="quiz-layout-radio-circle"></div>
              <span style="color: #64748b;">১ লাইনে ৪টি option</span>
            </div>
            <button type="button" class="quiz-sorto-projojjo-btn" id="btnSortoHintToggle" title="শর্ত দেখতে ক্লিক করুন">
              <span>শর্ত প্রযোজ্য</span>
            </button>
          </div>
          <div id="sortoHintBox" class="quiz-sorto-projojjo-hint" style="display: none;">
            <div class="quiz-sorto-projojjo-hint-text">
              <span>প্রশ্ন Layout: থেকে <strong>১ লাইনে ১টি প্রশ্ন</strong> choose করুন।</span>
            </div>
            <button type="button" class="quiz-sorto-projojjo-hint-close" id="btnCloseSortoHint" title="বন্ধ করুন">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      `;
      const btnToggle = document.getElementById('btnSortoHintToggle');
      const hintBox = document.getElementById('sortoHintBox');
      const btnClose = document.getElementById('btnCloseSortoHint');
      if (btnToggle && hintBox) {
        btnToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          hintBox.style.display = hintBox.style.display === 'none' ? 'flex' : 'none';
        });
      }
      if (btnClose && hintBox) {
        btnClose.addEventListener('click', (e) => {
          e.stopPropagation();
          hintBox.style.display = 'none';
        });
      }
    }
  }

  function renderFontFamilyList() {
    const container = document.getElementById('fontFamilyListContainer');
    if (!container) return;

    container.innerHTML = FONT_FAMILIES.map((font) => {
      const active = fontFamily === font.family;
      return `
        <button type="button" class="quiz-layout-menu-item ${active ? 'active' : ''}" data-fontfamily="${font.family}" style="font-family: ${font.family};">
          <div class="quiz-layout-radio-circle">
            ${active ? '<div class="quiz-layout-radio-inner"></div>' : ''}
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <span style="font-size: 13px; font-weight: 600;">${font.name}</span>
            <span style="font-size: 11px; color: #64748b;">${font.sub}</span>
          </div>
        </button>
      `;
    }).join('');

    const badgeFF = document.getElementById('badgeFontFamily');
    if (badgeFF) {
      const match = FONT_FAMILIES.find((f) => f.family === fontFamily);
      badgeFF.textContent = match ? match.name : 'Noto Sans';
    }

    container.querySelectorAll('[data-fontfamily]').forEach((btn) => {
      btn.addEventListener('click', () => {
        fontFamily = btn.getAttribute('data-fontfamily');
        saveActivePresetSetting('fontFamily', fontFamily);
        updateUIControls();
      });
    });
  }

  function renderFontWeightList() {
    const container = document.getElementById('fontWeightListContainer');
    if (!container) return;

    container.innerHTML = FONT_WEIGHTS.map((item) => {
      const active = fontWeight === item.value;
      return `
        <button type="button" class="quiz-layout-menu-item ${active ? 'active' : ''}" data-fontweight="${item.value}">
          <div class="quiz-layout-radio-circle">
            ${active ? '<div class="quiz-layout-radio-inner"></div>' : ''}
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <span style="font-size: 13px; font-weight: ${item.weight};">${item.name}</span>
            <span style="font-size: 11px; color: #64748b;">${item.sub}</span>
          </div>
        </button>
      `;
    }).join('');

    const badgeFW = document.getElementById('badgeFontWeight');
    if (badgeFW) {
      const match = FONT_WEIGHTS.find((w) => w.value === fontWeight);
      badgeFW.textContent = match ? match.name : 'Regular';
    }

    container.querySelectorAll('[data-fontweight]').forEach((btn) => {
      btn.addEventListener('click', () => {
        fontWeight = btn.getAttribute('data-fontweight');
        saveActivePresetSetting('fontWeight', fontWeight);
        updateUIControls();
      });
    });
  }

  // --- Question Rendering Engine ---
  function renderQuestionBlockHTML(q, qIndex) {
    const chosen = q._chosenAnswer !== undefined ? q._chosenAnswer : answeredQuestions[qIndex];
    const isAnswered = chosen !== undefined;
    const shouldShow = isReadMode || isAnswered || isReviewWrongMode;

    let isAnswerVisible = false;
    if (showAnswer) {
      if (answerMode === 'on-select') {
        isAnswerVisible = shouldShow;
      } else if (answerMode === 'on-button') {
        isAnswerVisible = isReadMode || !!expandedAnswers[qIndex];
      } else if (answerMode === 'on-wrong') {
        if (isReviewWrongMode || isRetakeWrongMode || isReadMode) {
          isAnswerVisible = true;
        } else if (isAnswered && chosen !== q.ans) {
          isAnswerVisible = true;
        }
      }
    }

    let isExplanationVisible = false;
    if (showExplanation && q.explanation) {
      if (explanationMode === 'on-select') {
        isExplanationVisible = shouldShow;
      } else if (explanationMode === 'on-button') {
        isExplanationVisible = !!expandedExplanations[qIndex];
      } else if (explanationMode === 'on-wrong') {
        if (isReviewWrongMode || isRetakeWrongMode) {
          isExplanationVisible = true;
        } else if (isAnswered && chosen !== q.ans) {
          isExplanationVisible = true;
        }
      }
    }

    const styleClass = questionStyle === 'box'
      ? 'style-box'
      : questionStyle === 'circle'
      ? 'style-circle'
      : questionStyle === 'bracket'
      ? 'style-bracket'
      : questionStyle === 'nostyle'
      ? 'style-nostyle'
      : '';

    let headerHtml = '';
    if (questionStyle === 'box') {
      headerHtml = `
        <div class="quiz-q-header">
          <div class="quiz-q-title-area">
            <span class="quiz-qnum-badge font-bn">${qIndex + 1}</span>
            <span class="quiz-q-title-text font-bn">
              ${q.q}
              ${showAskAi ? `<button type="button" class="quiz-ask-ai-btn" data-askai="${qIndex}" title="Ask AI">Ask AI</button>` : ''}
            </span>
          </div>
        </div>
      `;
    } else {
      headerHtml = `
        <div class="quiz-question-text">
          ${qIndex + 1}. ${q.q}
          ${showAskAi ? `<button type="button" class="quiz-ask-ai-btn" data-askai="${qIndex}" title="Ask AI">Ask AI</button>` : ''}
        </div>
      `;
    }

    // Render Options
    const optionsHtml = (q.options || []).map((opt, optIndex) => {
      let btnClass = 'quiz-option-btn';
      let isOptionCorrect = false;
      let isOptionIncorrect = false;

      if (isReadMode) {
        btnClass += ' disabled';
        if (optIndex === q.ans) {
          if (showColor) {
            btnClass += ' correct';
            isOptionCorrect = true;
          } else {
            btnClass += ' neutral-selected';
          }
        }
      } else if (isReviewWrongMode) {
        btnClass += ' disabled';
        if (optIndex === q.ans) {
          if (showColor) {
            btnClass += ' correct';
            isOptionCorrect = true;
          } else {
            btnClass += ' neutral-selected';
          }
        } else if (chosen === optIndex) {
          if (showColor) {
            btnClass += ' incorrect';
            isOptionIncorrect = true;
          } else {
            btnClass += ' neutral-selected';
          }
        }
      } else if (isAnswered) {
        btnClass += ' disabled';
        if (showColor) {
          if (highlightMode === 'single') {
            if (chosen === optIndex) {
              if (chosen === q.ans) {
                btnClass += ' correct';
                isOptionCorrect = true;
              } else {
                btnClass += ' incorrect';
                isOptionIncorrect = true;
              }
            }
          } else if (highlightMode === 'both') {
            if (optIndex === q.ans) {
              btnClass += ' correct';
              isOptionCorrect = true;
            } else if (chosen === optIndex) {
              btnClass += ' incorrect';
              isOptionIncorrect = true;
            }
          } else if (highlightMode === 'neutral') {
            if (chosen === optIndex) {
              btnClass += ' neutral-selected';
            }
          }
        } else {
          if (chosen === optIndex) {
            btnClass += ' neutral-selected';
          }
        }
      }

      const hasColorChange = isOptionCorrect || isOptionIncorrect || btnClass.includes('neutral-selected');
      const isCircleBadge = (
        (questionStyle === 'nostyle' || questionStyle === 'bracket') &&
        hasColorChange &&
        highlightColor !== 'full-bg' &&
        highlightColor !== 'with-icons'
      );

      if (isCircleBadge) {
        btnClass += ' has-nostyle-circle';
      }

      let labelText = getOptionLabel(optIndex);
      if (questionStyle === 'bracket' && !isCircleBadge) {
        labelText = `(${labelText})`;
      } else if (questionStyle === 'nostyle' && !isCircleBadge) {
        labelText = `${labelText}.`;
      }

      let statusIconHtml = '';
      if ((highlightColor === 'with-icons' || highlightColor === 'highlight-and-circle') && showColor && (isOptionCorrect || isOptionIncorrect)) {
        statusIconHtml = `
          <span class="quiz-option-status-icon">
            ${isOptionCorrect ? '<i class="fa-solid fa-circle-check text-success"></i>' : ''}
            ${isOptionIncorrect ? '<i class="fa-solid fa-circle-xmark text-danger"></i>' : ''}
          </span>
        `;
      }

      const isDisabled = isReadMode || isAnswered || isReviewWrongMode;

      return `
        <button
          type="button"
          class="${btnClass}"
          ${isDisabled ? 'disabled' : ''}
          data-q="${qIndex}"
          data-opt="${optIndex}"
        >
          <div class="quiz-option-circle font-bn">
            <span class="quiz-option-circle-letter">${labelText}</span>
          </div>
          <div class="quiz-option-text">
            ${opt}
          </div>
          ${statusIconHtml}
        </button>
      `;
    }).join('');

    // On-Button Controls (Answer & Explanation manual reveal)
    let onButtonActionsHtml = '';
    const showAnsBtn = showAnswer && answerMode === 'on-button';
    const showExpBtn = showExplanation && explanationMode === 'on-button' && q.explanation;

    if (showAnsBtn || showExpBtn) {
      onButtonActionsHtml = `
        <div class="quiz-explanation-btn-wrap" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 10px;">
          ${showAnsBtn ? `
            <button type="button" class="quiz-explanation-toggle-btn quiz-answer-toggle-btn ${expandedAnswers[qIndex] ? 'active' : ''}" data-toggleans="${qIndex}">
              <i class="fa-solid ${expandedAnswers[qIndex] ? 'fa-eye-slash' : 'fa-circle-check'}"></i>
              <span>${expandedAnswers[qIndex] ? 'উত্তর লুকান' : 'উত্তর'}</span>
            </button>
          ` : ''}
          ${showExpBtn ? `
            <button type="button" class="quiz-explanation-toggle-btn ${expandedExplanations[qIndex] ? 'active' : ''}" data-toggleexp="${qIndex}">
              <i class="fa-solid ${expandedExplanations[qIndex] ? 'fa-eye-slash' : 'fa-lightbulb'}"></i>
              <span>${expandedExplanations[qIndex] ? 'ব্যাখ্যা লুকান' : 'ব্যাখ্যা'}</span>
            </button>
          ` : ''}
        </div>
      `;
    }

    // Standalone Correct Answer
    let standaloneAnswerHtml = '';
    if (isAnswerVisible && (!isExplanationVisible || !q.explanation)) {
      const ansLabel = questionStyle === 'bracket' ? `(${getOptionLabel(q.ans)})` : `${getOptionLabel(q.ans)}.`;
      standaloneAnswerHtml = `
        <div class="quiz-answer-text">
          <i class="fa-solid fa-circle-check"></i>
          <span>সঠিক উত্তর: ${ansLabel} ${q.options[q.ans]}</span>
        </div>
      `;
    }

    // Unified Explanation Box
    let unifiedExplanationHtml = '';
    if (isExplanationVisible && q.explanation) {
      const ansLabel = questionStyle === 'bracket' ? `(${getOptionLabel(q.ans)})` : `${getOptionLabel(q.ans)}.`;
      unifiedExplanationHtml = `
        <div class="quiz-explanation-text">
          ${isAnswerVisible ? `
            <div class="quiz-exp-answer-row">
              <i class="fa-solid fa-circle-check"></i>
              <span>সঠিক উত্তর: ${ansLabel} ${q.options[q.ans]}</span>
            </div>
          ` : ''}
          <div class="quiz-exp-body-row">
            <strong>ব্যাখ্যা:</strong> ${q.explanation}
          </div>
        </div>
      `;
    }

    return `
      <div class="quiz-question-block ${styleClass} bottomline-${bottomLine}" data-block-idx="${qIndex}">
        ${headerHtml}
        <div class="quiz-options-container layout-${optionLayout} ans-style-${highlightColor}">
          ${optionsHtml}
        </div>
        ${onButtonActionsHtml}
        ${standaloneAnswerHtml}
        ${unifiedExplanationHtml}
      </div>
    `;
  }

  function renderQuestions() {
    const area = document.getElementById('questionsContainerArea');
    if (!area) return;

    if (displayQuestions.length === 0) {
      area.innerHTML = '<p style="text-align: center; color: #888; padding: 40px 0;">কোনো প্রশ্ন পাওয়া যায়নি।</p>';
      return;
    }

    const styleModeClass = questionStyle === 'box'
      ? 'style-box-mode'
      : (questionStyle === 'circle' || questionStyle === 'bracket' || questionStyle === 'nostyle')
      ? 'style-nostyle-mode'
      : '';

    let contentHtml = '';

    if (questionLayout === '2q-col') {
      const half = Math.ceil(displayQuestions.length / 2);
      const col1 = displayQuestions.slice(0, half).map((q, i) => renderQuestionBlockHTML(q, i)).join('');
      const col2 = displayQuestions.slice(half).map((q, i) => renderQuestionBlockHTML(q, i + half)).join('');
      contentHtml = `
        <div class="quiz-questions-col-wrapper ${styleModeClass} midline-${middleLine} bottomline-${bottomLine}" style="--quiz-midline-gap: ${middleGap}px; --quiz-midline-half-gap: ${middleGap / 2}px;">
          <div class="quiz-questions-column">${col1}</div>
          <div class="quiz-questions-column">${col2}</div>
        </div>
      `;
    } else if (questionLayout === '2q-row') {
      const col1 = displayQuestions.filter((_, idx) => idx % 2 === 0).map((q, i) => renderQuestionBlockHTML(q, i * 2)).join('');
      const col2 = displayQuestions.filter((_, idx) => idx % 2 === 1).map((q, i) => renderQuestionBlockHTML(q, i * 2 + 1)).join('');
      contentHtml = `
        <div class="quiz-questions-col-wrapper ${styleModeClass} midline-${middleLine} bottomline-${bottomLine}" style="--quiz-midline-gap: ${middleGap}px; --quiz-midline-half-gap: ${middleGap / 2}px;">
          <div class="quiz-questions-column">${col1}</div>
          <div class="quiz-questions-column">${col2}</div>
        </div>
      `;
    } else if (questionLayout === '3q-col') {
      const third = Math.ceil(displayQuestions.length / 3);
      const col1 = displayQuestions.slice(0, third).map((q, i) => renderQuestionBlockHTML(q, i)).join('');
      const col2 = displayQuestions.slice(third, third * 2).map((q, i) => renderQuestionBlockHTML(q, i + third)).join('');
      const col3 = displayQuestions.slice(third * 2).map((q, i) => renderQuestionBlockHTML(q, i + third * 2)).join('');
      contentHtml = `
        <div class="quiz-questions-col-wrapper col-3 ${styleModeClass} midline-${middleLine} bottomline-${bottomLine}" style="--quiz-midline-gap: ${middleGap}px; --quiz-midline-half-gap: ${middleGap / 2}px;">
          <div class="quiz-questions-column">${col1}</div>
          <div class="quiz-questions-column">${col2}</div>
          <div class="quiz-questions-column">${col3}</div>
        </div>
      `;
    } else if (questionLayout === '3q-row') {
      const col1 = displayQuestions.filter((_, idx) => idx % 3 === 0).map((q, i) => renderQuestionBlockHTML(q, i * 3)).join('');
      const col2 = displayQuestions.filter((_, idx) => idx % 3 === 1).map((q, i) => renderQuestionBlockHTML(q, i * 3 + 1)).join('');
      const col3 = displayQuestions.filter((_, idx) => idx % 3 === 2).map((q, i) => renderQuestionBlockHTML(q, i * 3 + 2)).join('');
      contentHtml = `
        <div class="quiz-questions-col-wrapper col-3 ${styleModeClass} midline-${middleLine} bottomline-${bottomLine}" style="--quiz-midline-gap: ${middleGap}px; --quiz-midline-half-gap: ${middleGap / 2}px;">
          <div class="quiz-questions-column">${col1}</div>
          <div class="quiz-questions-column">${col2}</div>
          <div class="quiz-questions-column">${col3}</div>
        </div>
      `;
    } else {
      // 1 Question in 1 line
      contentHtml = `
        <div class="quiz-questions-wrapper ${styleModeClass} bottomline-${bottomLine}">
          ${displayQuestions.map((q, idx) => renderQuestionBlockHTML(q, idx)).join('')}
        </div>
      `;
    }

    area.innerHTML = contentHtml;
    attachQuestionEventListeners();
    updateFloatingProgress();
    updateResultSection();
  }

  function attachQuestionEventListeners() {
    // Option clicks
    document.querySelectorAll('.quiz-option-btn:not(.disabled)').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qIdx = parseInt(btn.getAttribute('data-q'), 10);
        const optIdx = parseInt(btn.getAttribute('data-opt'), 10);
        handleAnswerClick(qIdx, optIdx);
      });
    });

    // Ask AI buttons on individual questions
    document.querySelectorAll('.quiz-ask-ai-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qIdx = parseInt(btn.getAttribute('data-askai'), 10);
        const q = displayQuestions[qIdx];
        if (q) openAiChatWithQuestion(q, qIdx);
      });
    });

    // On-button Answer toggles
    document.querySelectorAll('[data-toggleans]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qIdx = parseInt(btn.getAttribute('data-toggleans'), 10);
        expandedAnswers[qIdx] = !expandedAnswers[qIdx];
        renderQuestions();
      });
    });

    // On-button Explanation toggles
    document.querySelectorAll('[data-toggleexp]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qIdx = parseInt(btn.getAttribute('data-toggleexp'), 10);
        expandedExplanations[qIdx] = !expandedExplanations[qIdx];
        renderQuestions();
      });
    });
  }

  // --- Quiz Logic (Clicks, Timer, Score, Completion) ---
  function handleAnswerClick(qIndex, optIndex) {
    if (isReadMode) return;
    if (showTime && totalSecondsLeft <= 0) return;
    if (answeredQuestions[qIndex] !== undefined) return; // Locked: single attempt

    const q = displayQuestions[qIndex];
    answeredQuestions[qIndex] = optIndex;

    if (optIndex === q.ans) {
      correctCount += 1;
    } else {
      incorrectCount += 1;
    }

    score = Math.round((correctCount * 1 - incorrectCount * cutMark) * 100) / 100;

    renderQuestions();
    updateScoreBoard();
    updateFloatingProgress();

    // Check completion
    if (Object.keys(answeredQuestions).length === displayQuestions.length) {
      showCompletion();
    }
  }

  function updateScoreBoard() {
    const scoreVal = document.getElementById('scoreDisplay');
    if (scoreVal) scoreVal.textContent = formatScore(score);
  }

  function updateFloatingProgress() {
    const leftPill = document.getElementById('floatingProgressLeft');
    const totalSpan = document.getElementById('progressTotalQ');
    const doneSpan = document.getElementById('progressDoneQ');
    const leftSpan = document.getElementById('progressLeftQ');

    const total = displayQuestions.length;
    const done = Object.keys(answeredQuestions).length;
    const remaining = Math.max(0, total - done);

    if (totalSpan) totalSpan.textContent = toBengaliNumber(total);
    if (doneSpan) doneSpan.textContent = toBengaliNumber(done);
    if (leftSpan) leftSpan.textContent = toBengaliNumber(remaining);

    if (leftPill) {
      const isComplete = done >= total && total > 0;
      leftPill.style.display = (total > 0 && done > 0 && !isReadMode && !isComplete) ? 'inline-flex' : 'none';
    }
  }

  function updateResultSection() {
    const resultSec = document.getElementById('resultSection');
    const completionBanner = document.getElementById('completionBanner');
    const isCompleted = displayQuestions.length > 0 && Object.keys(answeredQuestions).length === displayQuestions.length && !isReviewWrongMode;

    if (!resultSec || !completionBanner) return;

    if (isCompleted && !isReadMode) {
      resultSec.style.display = 'block';
      completionBanner.style.display = 'flex';

      const statCor = document.getElementById('statCorrect');
      const statIncor = document.getElementById('statIncorrect');
      const statUnans = document.getElementById('statUnanswered');
      const finalScoreVal = document.getElementById('finalScoreVal');
      const bannerFinalScore = document.getElementById('bannerFinalScore');
      const bannerIncor = document.getElementById('bannerIncorrectCount');
      const bannerPerfect = document.getElementById('bannerPerfectText');
      const bannerWrongActions = document.getElementById('bannerWrongActions');

      const total = displayQuestions.length;
      const unans = total - (correctCount + incorrectCount);

      if (statCor) statCor.textContent = toBengaliNumber(correctCount);
      if (statIncor) statIncor.textContent = toBengaliNumber(incorrectCount);
      if (statUnans) statUnans.textContent = toBengaliNumber(unans);
      if (finalScoreVal) finalScoreVal.textContent = formatScore(score);
      if (bannerFinalScore) bannerFinalScore.textContent = formatScore(score);
      if (bannerIncor) {
        bannerIncor.textContent = `${toBengaliNumber(incorrectCount)} টি`;
        bannerIncor.className = incorrectCount > 0 ? 'text-danger' : 'text-success';
      }
      if (bannerPerfect) bannerPerfect.style.display = incorrectCount === 0 ? 'inline' : 'none';
      if (bannerWrongActions) bannerWrongActions.style.display = incorrectCount > 0 ? 'inline-flex' : 'none';

      // Interactive 3-segment progress bar
      const corPct = (correctCount / total) * 100;
      const incorPct = (incorrectCount / total) * 100;
      const unansPct = (unans / total) * 100;

      const pCor = document.getElementById('progressCorrectBar');
      const pIncor = document.getElementById('progressIncorrectBar');
      const pUnans = document.getElementById('progressUnansweredBar');

      if (pCor) {
        pCor.style.width = `${corPct}%`;
        pCor.textContent = corPct >= 8 ? `${Math.round(corPct)}%` : '';
      }
      if (pIncor) {
        pIncor.style.width = `${incorPct}%`;
        pIncor.textContent = incorPct >= 8 ? `${Math.round(incorPct)}%` : '';
      }
      if (pUnans) {
        pUnans.style.width = `${unansPct}%`;
        pUnans.textContent = unansPct >= 8 ? `${Math.round(unansPct)}%` : '';
      }
    } else {
      resultSec.style.display = 'none';
      completionBanner.style.display = 'none';
    }
  }

  function showCompletion() {
    stopTimer();
    const totalCount = displayQuestions.length || 1;
    const pct = ((correctCount / totalCount) * 100).toFixed(0);

    showCornerPopup({
      type: 'success',
      title: '🏆 অভিনন্দন! পরীক্ষা সম্পন্ন হয়েছে',
      msg: `সঠিক উত্তর: ${toBengaliNumber(correctCount)} টি | ভুল উত্তর: ${toBengaliNumber(incorrectCount)} টি\nসঠিক উত্তরের হার: ${toBengaliNumber(pct)}%\nমোট প্রাপ্ত স্কোর: ${formatScore(score)}`,
      hasReset: true,
      isCompletion: true
    });

    const target = document.getElementById('completionBanner') || document.getElementById('quizContainer');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --- Timer Engine ---
  function startTimer() {
    stopTimer();
    if (!showTime || isReadMode || displayQuestions.length === 0) return;

    totalSecondsLeft = displayQuestions.length * 36;
    timerRunning = true;
    warningTriggered = false;

    const timerDisp = document.getElementById('timerDisplay');
    if (timerDisp) timerDisp.textContent = formatTimer(totalSecondsLeft);

    timerInterval = setInterval(() => {
      if (totalSecondsLeft <= 1) {
        stopTimer();
        handleTimeOut();
        return;
      }

      const warningThreshold = Math.floor(displayQuestions.length * 36 * 0.1);
      if (totalSecondsLeft <= warningThreshold && !warningTriggered) {
        warningTriggered = true;
        showCornerPopup({
          type: 'warning',
          title: '⚠️ সময় প্রায় শেষ!',
          msg: 'আর মাত্র অল্প কিছু সময় বাকি আছে। দ্রুত উত্তর সম্পন্ন করুন!',
          hasReset: false,
          isCompletion: false
        });
      }

      totalSecondsLeft -= 1;
      if (timerDisp) timerDisp.textContent = formatTimer(totalSecondsLeft);
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timerRunning = false;
  }

  function handleTimeOut() {
    const total = displayQuestions.length || 1;
    const unans = total - (correctCount + incorrectCount);
    const pct = ((correctCount / total) * 100).toFixed(0);

    showCornerPopup({
      type: 'danger',
      title: '⏰ সময় শেষ!',
      msg: `সঠিক: ${toBengaliNumber(correctCount)} টি | ভুল: ${toBengaliNumber(incorrectCount)} টি | বাকি: ${toBengaliNumber(unans)} টি\nসঠিক উত্তরের হার: ${toBengaliNumber(pct)}%\nমোট স্কোর: ${formatScore(score)}`,
      hasReset: true,
      isCompletion: true
    });
  }

  // --- Popups ---
  function showCornerPopup({ type, title, msg, hasReset, isCompletion }) {
    popupState = { visible: true, type, title, msg, hasReset, isCompletion };
    const p = document.getElementById('cornerPopup');
    const pTitle = document.getElementById('popupTitle');
    const pMsg = document.getElementById('popupMsg');
    const extraActions = document.getElementById('popupExtraActions');
    const btnResetFull = document.getElementById('btnPopupResetFull');
    const btnClose = document.getElementById('btnPopupClose');

    if (!p) return;
    p.className = `quiz-corner-popup ${type}`;
    p.style.display = 'block';

    if (pTitle) pTitle.textContent = title;
    if (pMsg) pMsg.textContent = msg;

    if (extraActions) {
      extraActions.style.display = (isCompletion && incorrectCount > 0) ? 'flex' : 'none';
    }
    if (btnResetFull) {
      btnResetFull.style.display = hasReset ? 'inline-flex' : 'none';
    }
    if (btnClose) {
      btnClose.style.display = isCompletion ? 'none' : 'inline-block';
    }
  }

  function hideCornerPopup() {
    popupState.visible = false;
    const p = document.getElementById('cornerPopup');
    if (p) p.style.display = 'none';
  }

  // --- Reset & Special Retake/Review Modes ---
  function resetQuizState() {
    answeredQuestions = {};
    expandedAnswers = {};
    expandedExplanations = {};
    score = 0;
    correctCount = 0;
    incorrectCount = 0;
    hideCornerPopup();

    if (showTime && !isReadMode && displayQuestions.length > 0) {
      startTimer();
    } else {
      stopTimer();
    }

    renderQuestions();
    updateScoreBoard();
    updateFloatingProgress();
  }

  function resetQuiz() {
    if (isReadMode) {
      isReadMode = false;
      showScore = true;
      activeMode = 'practice';
    }
    if ((isRetakeWrongMode || isReviewWrongMode) && originalQuestionsList.length > 0) {
      displayQuestions = [...originalQuestionsList];
      isRetakeWrongMode = false;
      isReviewWrongMode = false;
    }
    const retakeBanner = document.getElementById('retakeBanner');
    const reviewBanner = document.getElementById('reviewBanner');
    if (retakeBanner) retakeBanner.style.display = 'none';
    if (reviewBanner) reviewBanner.style.display = 'none';

    resetQuizState();
    updateUIControls();

    const target = document.getElementById('quizContainer') || document.querySelector('.quiz-top-bar');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleViewWrongAnswers() {
    hideCornerPopup();
    const source = (originalQuestionsList && originalQuestionsList.length > 0) ? originalQuestionsList : displayQuestions;
    const wrong = source
      .map((q, idx) => ({ ...q, _originalIdx: idx, _chosenAnswer: answeredQuestions[idx] }))
      .filter((q) => q._chosenAnswer !== undefined && q._chosenAnswer !== q.ans);

    if (wrong.length === 0) {
      showCornerPopup({
        type: 'success',
        title: '🎉 কোনো ভুল উত্তর নেই!',
        msg: 'আপনার কোনো ভুল উত্তর নেই। আপনি দারুণ পরীক্ষা দিয়েছেন!',
        hasReset: false,
        isCompletion: false
      });
      return;
    }

    if (!isRetakeWrongMode && !isReviewWrongMode) {
      originalQuestionsList = [...source];
    }

    displayQuestions = wrong;
    isReviewWrongMode = true;
    isRetakeWrongMode = false;
    showAnswer = true;
    showExplanation = true;
    showColor = true;

    const reviewBanner = document.getElementById('reviewBanner');
    const retakeBanner = document.getElementById('retakeBanner');
    const reviewCount = document.getElementById('reviewCountText');
    if (reviewBanner) reviewBanner.style.display = 'flex';
    if (retakeBanner) retakeBanner.style.display = 'none';
    if (reviewCount) reviewCount.textContent = toBengaliNumber(wrong.length);

    renderQuestions();
    const area = document.getElementById('questionsContainerArea');
    if (area) area.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleRetakeWrongAnswers() {
    hideCornerPopup();
    const source = (originalQuestionsList && originalQuestionsList.length > 0) ? originalQuestionsList : displayQuestions;
    const wrong = source.filter((q, idx) => {
      const chosen = q._chosenAnswer !== undefined ? q._chosenAnswer : answeredQuestions[idx];
      return chosen !== undefined && chosen !== q.ans;
    });

    if (wrong.length === 0) {
      showCornerPopup({
        type: 'success',
        title: '🎉 কোনো ভুল উত্তর নেই!',
        msg: 'আপনার কোনো ভুল উত্তর নেই। আপনি দারুণ পরীক্ষা দিয়েছেন!',
        hasReset: false,
        isCompletion: false
      });
      return;
    }

    if (!isRetakeWrongMode && !isReviewWrongMode) {
      originalQuestionsList = [...source];
    }

    displayQuestions = wrong;
    isRetakeWrongMode = true;
    isReviewWrongMode = false;

    const retakeBanner = document.getElementById('retakeBanner');
    const reviewBanner = document.getElementById('reviewBanner');
    const retakeCount = document.getElementById('retakeCountText');
    if (retakeBanner) retakeBanner.style.display = 'flex';
    if (reviewBanner) reviewBanner.style.display = 'none';
    if (retakeCount) retakeCount.textContent = toBengaliNumber(wrong.length);

    resetQuizState();
    const area = document.getElementById('questionsContainerArea');
    if (area) area.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleExitSpecialMode() {
    if (originalQuestionsList.length > 0) {
      displayQuestions = [...originalQuestionsList];
    }
    isRetakeWrongMode = false;
    isReviewWrongMode = false;
    const retakeBanner = document.getElementById('retakeBanner');
    const reviewBanner = document.getElementById('reviewBanner');
    if (retakeBanner) retakeBanner.style.display = 'none';
    if (reviewBanner) reviewBanner.style.display = 'none';

    resetQuizState();
  }

  // --- AI Chat Drawer Simulation & Intelligence ---
  function openAiChatWithQuestion(q, idx) {
    const letters = optionLetter === 'english' ? ENGLISH_LETTERS : optionLetter === 'english-lower' ? ENGLISH_LOWERCASE_LETTERS : BANGLA_LETTERS;
    const optionsText = (q.options || []).map((opt, i) => `(${letters[i] || i + 1}) ${opt}`).join('\n');
    const promptText = `প্রশ্ন ${toBengaliNumber(idx + 1)}: ${q.q}\nঅপশনসমূহ:\n${optionsText}\n\nদয়া করে এই MCQ টির সঠিক উত্তর নির্ণয় করে প্রতিটি অপশন বিশ্লেষণসহ বিস্তারিত সহজ বাংলায় বুঝিয়ে দিন।`;

    openAiChat();
    // Post user query
    addAiMessage('user', `📖 ${q.q}`);
    // Simulate AI intelligent explanation
    setTimeout(() => {
      const correctOptText = q.options[q.ans];
      const correctLetter = letters[q.ans] || (q.ans + 1);
      const aiReply = `### 🎯 সঠিক উত্তর: (${correctLetter}) ${correctOptText}\n\n💡 **বিশ্লেষণ ও ব্যাখ্যা:**\n${q.explanation}\n\n• **প্রশ্ন পর্যালোচনা:** এই প্রশ্নটি অত্যন্ত গুরুত্বপূর্ণ এবং বিভিন্ন প্রতিযোগিতামূলক পরীক্ষায় বারবার এসেছে।\n• **মনে রাখার টেকনিক:** উত্তরটি নির্ভুলভাবে মনে রাখতে প্রাসঙ্গিক মূল সাল ও তথ্যগুলো খাতায় নোট করে রাখুন।`;
      addAiMessage('ai', aiReply);
    }, 600);
  }

  function openAiChat() {
    const overlay = document.getElementById('aiChatOverlay');
    if (overlay) overlay.style.display = 'block';
  }

  function closeAiChat() {
    const overlay = document.getElementById('aiChatOverlay');
    if (overlay) overlay.style.display = 'none';
  }

  function addAiMessage(sender, text) {
    aiMessages.push({ sender, text });
    renderAiMessages();
  }

  function renderAiMessages() {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody) return;

    chatBody.innerHTML = aiMessages.map((msg) => {
      const isUser = msg.sender === 'user';
      return `
        <div class="ai-message-row ${isUser ? 'user' : ''}">
          ${!isUser ? `<div class="ai-msg-avatar"><i class="fa-solid fa-robot"></i></div>` : ''}
          <div class="ai-message-bubble-wrapper">
            <div class="ai-message-bubble ${isUser ? 'user' : 'ai'}">
              ${formatAiMessageText(msg.text)}
            </div>
          </div>
        </div>
      `;
    }).join('');

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function formatAiMessageText(text) {
    if (!text) return '';
    const lines = text.split('\n');
    return lines.map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
        return `<div class="ai-msg-heading">${formatInlineBold(trimmed.replace(/^#+\s*/, ''))}</div>`;
      }
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ')) {
        const clean = trimmed.replace(/^[•\-\*]\s*/, '');
        return `
          <div class="ai-msg-bullet">
            <i class="fa-solid fa-circle ai-bullet-dot"></i>
            <span>${formatInlineBold(clean)}</span>
          </div>
        `;
      }
      if (trimmed === '') {
        return `<div class="ai-msg-spacer"></div>`;
      }
      return `<div class="ai-msg-paragraph">${formatInlineBold(line)}</div>`;
    }).join('');
  }

  function formatInlineBold(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  function handleSendAiMessage() {
    const input = document.getElementById('aiInputText');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';
    addAiMessage('user', userText);

    // Show simulated smart response
    setTimeout(() => {
      const genericReply = `💡 আপনার প্রশ্নের জন্য ধন্যবাদ!\n\n**TopMCQBD AI পরামর্শ:**\n"${userText}" সম্পর্কিত যেকোনো সুনির্দিষ্ট তথ্য বা প্রশ্নের ব্যাখ্যা জানতে পাশের যে কোনো প্রশ্নে "Ask AI" ক্লিক করতে পারেন। আমি আপনার প্রস্তুতিকে নিখুঁত করতে সাহায্য করব।`;
      addAiMessage('ai', genericReply);
    }, 700);
  }

  // --- Initial Setup & Event Wireup ---
  function setupEventListeners() {
    // Mode Switchers
    document.getElementById('btnModePractice')?.addEventListener('click', () => {
      isReadMode = false;
      activeMode = 'practice';
      showScore = true;
      showAnswer = false;
      resetQuizState();
      updateUIControls();
    });

    document.getElementById('btnModeRead')?.addEventListener('click', () => {
      isReadMode = true;
      activeMode = 'read';
      showTime = false;
      showScore = false;
      showColor = true;
      showExplanation = true;
      showAnswer = false;
      stopTimer();
      renderQuestions();
      updateUIControls();
    });

    // Top Restart Button
    document.getElementById('btnTopRestart')?.addEventListener('click', resetQuiz);

    // Switches
    document.getElementById('switchAskAi')?.addEventListener('change', (e) => {
      showAskAi = e.target.checked;
      try { localStorage.setItem('topmcqbd_show_ask_ai', showAskAi ? 'true' : 'false'); } catch (err) {}
      updateUIControls();
      renderQuestions();
    });

    document.getElementById('switchExplanation')?.addEventListener('change', (e) => {
      if (e.target.checked) {
        explanationMode = lastActiveExplanationMode && lastActiveExplanationMode !== 'none' ? lastActiveExplanationMode : 'on-select';
        showExplanation = true;
      } else {
        explanationMode = 'none';
        showExplanation = false;
      }
      saveActivePresetSetting('explanationMode', explanationMode);
      saveActivePresetSetting('showExplanation', showExplanation);
      updateUIControls();
      renderQuestions();
    });

    document.getElementById('switchTime')?.addEventListener('change', (e) => {
      if (!isReadMode) {
        showTime = e.target.checked;
        saveActivePresetSetting('showTime', showTime);
        if (showTime) {
          startTimer();
        } else {
          stopTimer();
        }
        updateUIControls();
      }
    });

    document.getElementById('switchScore')?.addEventListener('change', (e) => {
      if (!isReadMode) {
        showScore = e.target.checked;
        saveActivePresetSetting('showScore', showScore);
        updateUIControls();
      }
    });

    // Limit Dropdown Trigger
    const limitTrigger = document.getElementById('btnLimitTrigger');
    limitTrigger?.addEventListener('click', (e) => {
      toggleLimitMenu(e);
    });

    // Limit Dropdown Items
    document.querySelectorAll('#limitPopupMenu .quiz-layout-menu-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        limit = btn.getAttribute('data-limit') || 'all';
        rangeIndex = 0;
        closeLimitMenu();
        applyLimitAndRange();
      });
    });

    // Range Dropdown Trigger
    const rangeTrigger = document.getElementById('btnRangeTrigger');
    rangeTrigger?.addEventListener('click', (e) => {
      toggleRangeMenu(e);
    });

    // Global Settings Trigger & Popup
    const settingsTrigger = document.getElementById('btnGlobalSettingsTrigger');
    const btnCloseSettings = document.getElementById('btnCloseSettings');
    const btnResetSettings = document.getElementById('btnResetSettings');

    settingsTrigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleGlobalSettings();
    });

    btnCloseSettings?.addEventListener('click', () => {
      closeGlobalSettings();
    });

    btnResetSettings?.addEventListener('click', () => {
      const def = DEFAULT_PRESET_PROFILES[activePreset] || DEFAULT_PRESET_PROFILES.practice;
      applyPresetProfile(activePreset, def);

      // Reset accordions to default for this preset
      if (activePreset === 'read') {
        setAccordionOpenState('secLayout', true);
        setAccordionOpenState('secColorStyle', true);
        setAccordionOpenState('secExplanation', true);
        setAccordionOpenState('secOptionLetter', false);
        setAccordionOpenState('secCutMark', false);
        setAccordionOpenState('secFont', false);
      } else if (activePreset === 'exam') {
        setAccordionOpenState('secLayout', true);
        setAccordionOpenState('secColorStyle', false);
        setAccordionOpenState('secExplanation', false);
        setAccordionOpenState('secOptionLetter', false);
        setAccordionOpenState('secCutMark', false);
        setAccordionOpenState('secFont', false);
      } else {
        setAccordionOpenState('secLayout', true);
        setAccordionOpenState('secColorStyle', false);
        setAccordionOpenState('secExplanation', false);
        setAccordionOpenState('secOptionLetter', false);
        setAccordionOpenState('secCutMark', false);
        setAccordionOpenState('secFont', false);
      }

      btnResetSettings.classList.add('reset-success');
      const resetLabel = document.getElementById('resetSettingsLabel');
      const resetIcon = btnResetSettings.querySelector('i');
      if (resetLabel) resetLabel.textContent = 'রিসেট সম্পন্ন';
      if (resetIcon) resetIcon.className = 'fa-solid fa-check';

      setTimeout(() => {
        btnResetSettings.classList.remove('reset-success');
        if (resetLabel) resetLabel.textContent = 'রিসেট';
        if (resetIcon) resetIcon.className = 'fa-solid fa-rotate-left';
      }, 1200);
    });

    // Preset Tabs
    document.querySelectorAll('.quiz-preset-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-preset');
        handleSelectPreset(p);
      });
    });

    // Accordion Toggle Handlers
    setupAccordionToggles();

    // Design Style radio clicks
    document.querySelectorAll('[data-qstyle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        questionStyle = btn.getAttribute('data-qstyle');
        saveActivePresetSetting('questionStyle', questionStyle);
        updateUIControls();
        renderQuestions();
      });
    });

    // Question Layout radio clicks
    document.querySelectorAll('[data-qlayout]').forEach((btn) => {
      btn.addEventListener('click', () => {
        questionLayout = btn.getAttribute('data-qlayout');
        saveActivePresetSetting('questionLayout', questionLayout);
        if (questionLayout !== '1q' && optionLayout === '4') {
          optionLayout = '1';
          saveActivePresetSetting('optionLayout', '1');
        }
        updateUIControls();
        renderQuestions();
      });
    });

    // Option Layout radio clicks (1, 2)
    document.querySelectorAll('[data-optlayout]').forEach((btn) => {
      btn.addEventListener('click', () => {
        optionLayout = btn.getAttribute('data-optlayout');
        saveActivePresetSetting('optionLayout', optionLayout);
        updateUIControls();
        renderQuestions();
      });
    });

    // Middle line clicks
    document.querySelectorAll('[data-midline]').forEach((btn) => {
      btn.addEventListener('click', () => {
        middleLine = btn.getAttribute('data-midline');
        saveActivePresetSetting('middleLine', middleLine);
        updateUIControls();
        renderQuestions();
      });
    });

    // Bottom line clicks
    document.querySelectorAll('[data-bottomline]').forEach((btn) => {
      btn.addEventListener('click', () => {
        bottomLine = btn.getAttribute('data-bottomline');
        saveActivePresetSetting('bottomLine', bottomLine);
        updateUIControls();
        renderQuestions();
      });
    });

    // Middle gap clicks
    document.querySelectorAll('[data-midgap]').forEach((btn) => {
      btn.addEventListener('click', () => {
        middleGap = parseInt(btn.getAttribute('data-midgap'), 10);
        saveActivePresetSetting('middleGap', middleGap);
        updateUIControls();
        renderQuestions();
      });
    });

    document.getElementById('btnApplyCustomGap')?.addEventListener('click', () => {
      const inp = document.getElementById('inputCustomGap');
      if (inp) {
        const val = Math.max(0, Math.min(200, parseInt(inp.value, 10) || 0));
        middleGap = val;
        saveActivePresetSetting('middleGap', middleGap);
        updateUIControls();
        renderQuestions();
      }
    });

    // Highlight mode & color
    document.querySelectorAll('[data-hlmode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        highlightMode = btn.getAttribute('data-hlmode');
        saveActivePresetSetting('highlightMode', highlightMode);
        updateUIControls();
        renderQuestions();
      });
    });

    document.querySelectorAll('[data-hlcolor]').forEach((btn) => {
      btn.addEventListener('click', () => {
        highlightColor = btn.getAttribute('data-hlcolor');
        saveActivePresetSetting('highlightColor', highlightColor);
        updateUIControls();
        renderQuestions();
      });
    });

    // Answer mode & Explanation mode
    document.querySelectorAll('[data-ansmode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        answerMode = btn.getAttribute('data-ansmode');
        if (answerMode !== 'none' && answerMode !== 'explanation-only') {
          lastActiveAnswerMode = answerMode;
          showAnswer = true;
        } else {
          showAnswer = false;
        }
        saveActivePresetSetting('answerMode', answerMode);
        saveActivePresetSetting('showAnswer', showAnswer);
        updateUIControls();
        renderQuestions();
      });
    });

    document.querySelectorAll('[data-expmode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        explanationMode = btn.getAttribute('data-expmode');
        if (explanationMode !== 'none') {
          lastActiveExplanationMode = explanationMode;
          showExplanation = explanationMode !== 'answer-only';
        } else {
          showExplanation = false;
        }
        saveActivePresetSetting('explanationMode', explanationMode);
        saveActivePresetSetting('showExplanation', showExplanation);
        updateUIControls();
        renderQuestions();
      });
    });

    // Option letter
    document.querySelectorAll('[data-optletter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        optionLetter = btn.getAttribute('data-optletter');
        saveActivePresetSetting('optionLetter', optionLetter);
        updateUIControls();
        renderQuestions();
      });
    });

    // Cut mark presets & custom
    document.querySelectorAll('[data-cutmark]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cm = parseFloat(btn.getAttribute('data-cutmark'));
        cutMark = cm;
        cutMarkMode = btn.getAttribute('data-cutmark');
        saveActivePresetSetting('cutMark', cutMark);
        saveActivePresetSetting('cutMarkMode', cutMarkMode);
        score = Math.round((correctCount * 1 - incorrectCount * cutMark) * 100) / 100;
        updateUIControls();
        updateScoreBoard();
      });
    });

    document.getElementById('btnApplyCustomCutMark')?.addEventListener('click', () => {
      const inp = document.getElementById('inputCustomCutMark');
      if (inp) {
        const parsed = parseFloat(inp.value);
        if (!isNaN(parsed) && parsed >= 0) {
          cutMark = Math.round(parsed * 100) / 100;
          cutMarkMode = 'custom';
          saveActivePresetSetting('cutMark', cutMark);
          saveActivePresetSetting('cutMarkMode', 'custom');
          score = Math.round((correctCount * 1 - incorrectCount * cutMark) * 100) / 100;
          updateUIControls();
          updateScoreBoard();
        }
      }
    });

    // Font size presets & custom
    document.querySelectorAll('[data-fontsize]').forEach((btn) => {
      btn.addEventListener('click', () => {
        fontSize = parseInt(btn.getAttribute('data-fontsize'), 10);
        saveActivePresetSetting('fontSize', fontSize);
        updateUIControls();
      });
    });

    document.getElementById('btnApplyCustomFontSize')?.addEventListener('click', () => {
      const inp = document.getElementById('inputCustomFontSize');
      if (inp) {
        const val = Math.max(10, Math.min(36, parseInt(inp.value, 10) || 16));
        fontSize = val;
        saveActivePresetSetting('fontSize', fontSize);
        updateUIControls();
      }
    });

    // Popup button wires
    document.getElementById('btnPopupCloseIcon')?.addEventListener('click', hideCornerPopup);
    document.getElementById('btnPopupClose')?.addEventListener('click', hideCornerPopup);
    document.getElementById('btnPopupResetFull')?.addEventListener('click', resetQuiz);
    document.getElementById('btnPopupViewWrong')?.addEventListener('click', handleViewWrongAnswers);
    document.getElementById('btnPopupRetakeWrong')?.addEventListener('click', handleRetakeWrongAnswers);

    // Banner button wires
    document.getElementById('btnBannerViewWrong')?.addEventListener('click', handleViewWrongAnswers);
    document.getElementById('btnBannerRetakeWrong')?.addEventListener('click', handleRetakeWrongAnswers);
    document.getElementById('btnBannerResetFull')?.addEventListener('click', resetQuiz);

    document.getElementById('btnExitRetake')?.addEventListener('click', handleExitSpecialMode);
    document.getElementById('btnExitReview')?.addEventListener('click', handleExitSpecialMode);
    document.getElementById('btnReviewRetake')?.addEventListener('click', handleRetakeWrongAnswers);

    // Result section button wires
    document.getElementById('btnResultViewWrong')?.addEventListener('click', handleViewWrongAnswers);
    document.getElementById('btnResultRetakeWrong')?.addEventListener('click', handleRetakeWrongAnswers);
    document.getElementById('btnResultRetakeAll')?.addEventListener('click', resetQuiz);

    // Floating AI trigger & AI chat
    document.getElementById('btnFloatingAi')?.addEventListener('click', openAiChat);
    document.getElementById('btnCloseAiChat')?.addEventListener('click', closeAiChat);
    document.getElementById('btnClearAiChat')?.addEventListener('click', () => {
      aiMessages = [
        {
          sender: 'ai',
          text: 'আমি **TopMCQBD AI শিক্ষক**।\nযে কোনো প্রশ্নের পাশে থাকা **"Ask AI"** বাটনে চাপুন অথবা নিচে আপনার প্রশ্নটি লিখে পাঠান — আমি উত্তর ও ব্যাখ্যা বুঝিয়ে দেব।'
        }
      ];
      renderAiMessages();
    });

    document.getElementById('btnSendAi')?.addEventListener('click', handleSendAiMessage);
    document.getElementById('aiInputText')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendAiMessage();
    });

    // Quick chips
    document.querySelectorAll('.ai-quick-chips button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-chip');
        if (text) {
          const inp = document.getElementById('aiInputText');
          if (inp) {
            inp.value = text;
            handleSendAiMessage();
          }
        }
        if (isPlusMinus) {
          updateHasActiveAccordion();
        }
        updateSettingsPopupHeight();
      });
    });

    // Document click to close popups when clicking outside
    document.addEventListener('click', (e) => {
      const sPopup = document.getElementById('globalSettingsPopup');
      const sTrig = document.getElementById('btnGlobalSettingsTrigger');
      if (sPopup && !sPopup.classList.contains('is-hidden') && sPopup.style.display !== 'none' && !sPopup.contains(e.target) && !sTrig?.contains(e.target)) {
        closeGlobalSettings();
      }

      const lWrapper = document.getElementById('limitDropdownWrapper');
      if (showLimitMenu && lWrapper && !lWrapper.contains(e.target)) {
        closeLimitMenu();
      }

      const rWrapper = document.getElementById('rangeDropdownWrapper');
      if (showRangeMenu && rWrapper && !rWrapper.contains(e.target)) {
        closeRangeMenu();
      }
    });

    window.addEventListener('resize', updateSettingsPopupHeight);
    window.addEventListener('scroll', updateSettingsPopupHeight, { passive: true });

    // Progress bar tooltip hover
    const tooltip = document.getElementById('progressTooltip');
    const pContainer = document.querySelector('.quiz-progress-bar-container');
    if (pContainer && tooltip) {
      pContainer.addEventListener('mousemove', (e) => {
        const target = e.target;
        let text = '';
        if (target.id === 'progressCorrectBar') text = `সঠিক উত্তর: ${target.textContent || '০%'}`;
        else if (target.id === 'progressIncorrectBar') text = `ভুল উত্তর: ${target.textContent || '০%'}`;
        else if (target.id === 'progressUnansweredBar') text = `উত্তর দেওয়া হয়নি: ${target.textContent || '০%'}`;

        if (text) {
          tooltip.textContent = text;
          tooltip.style.left = `${e.clientX + 10}px`;
          tooltip.style.top = `${e.clientY + 10}px`;
          tooltip.style.display = 'block';
        }
      });
      pContainer.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    }
  }

  function setupAccordionToggles() {
    // Top Accordions
    const bindAccordion = (headerId, bodyId, iconId, isPlusMinus) => {
      const header = document.getElementById(headerId);
      const body = document.getElementById(bodyId);
      const icon = document.getElementById(iconId);
      if (!header || !body) return;

      header.addEventListener('click', () => {
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'block' : 'none';
        header.parentElement?.classList.toggle('active', isHidden);
        header.classList.toggle('active', isHidden);
        if (icon) {
          if (isPlusMinus) {
            icon.className = `fa-solid fa-${isHidden ? 'minus' : 'plus'} quiz-font-accordion-plus-minus`;
          } else {
            icon.className = `fa-solid fa-chevron-${isHidden ? 'up' : 'down'} quiz-font-accordion-chevron`;
          }
        }
        if (isPlusMinus) {
          updateHasActiveAccordion();
        }
        updateSettingsPopupHeight();
      });
    };

    // Major Sections
    bindAccordion('headerSecLayout', 'bodySecLayout', 'iconSecLayout', true);
    bindAccordion('headerSecColorStyle', 'bodySecColorStyle', 'iconSecColorStyle', true);
    bindAccordion('headerSecExplanation', 'bodySecExplanation', 'iconSecExplanation', true);
    bindAccordion('headerSecOptionLetter', 'bodySecOptionLetter', 'iconSecOptionLetter', true);
    bindAccordion('headerSecCutMark', 'bodySecCutMark', 'iconSecCutMark', true);
    bindAccordion('headerSecFont', 'bodySecFont', 'iconSecFont', true);

    // Sub-Groups
    bindAccordion('headerSubGrpStyle', 'bodySubGrpStyle', 'chevronSubGrpStyle', false);
    bindAccordion('headerSubGrpQLayout', 'bodySubGrpQLayout', 'chevronSubGrpQLayout', false);
    bindAccordion('headerSubGrpOptLayout', 'bodySubGrpOptLayout', 'chevronSubGrpOptLayout', false);
    bindAccordion('headerSubGrpMidLine', 'bodySubGrpMidLine', 'chevronSubGrpMidLine', false);
    bindAccordion('headerSubGrpBottomLine', 'bodySubGrpBottomLine', 'chevronSubGrpBottomLine', false);
    bindAccordion('headerSubGrpMidGap', 'bodySubGrpMidGap', 'chevronSubGrpMidGap', false);

    bindAccordion('headerSubGrpHighlightMode', 'bodySubGrpHighlightMode', 'chevronSubGrpHighlightMode', false);
    bindAccordion('headerSubGrpHighlightColor', 'bodySubGrpHighlightColor', 'chevronSubGrpHighlightColor', false);

    bindAccordion('headerSubGrpShowAnswer', 'bodySubGrpShowAnswer', 'chevronSubGrpShowAnswer', false);
    bindAccordion('headerSubGrpExpMode', 'bodySubGrpExpMode', 'chevronSubGrpExpMode', false);

    bindAccordion('headerSubGrpFontSize', 'bodySubGrpFontSize', 'chevronSubGrpFontSize', false);
    bindAccordion('headerSubGrpFontFamily', 'bodySubGrpFontFamily', 'chevronSubGrpFontFamily', false);
    bindAccordion('headerSubGrpFontWeight', 'bodySubGrpFontWeight', 'chevronSubGrpFontWeight', false);
  }

  function getRangeOptions() {
    if (limit === 'all') return [{ label: 'সকল প্রশ্ন', value: 0 }];
    const numLimit = parseInt(limit, 10);
    const total = allQuestions.length;
    if (total === 0) return [{ label: '১ - ২০', value: 0 }];
    const totalChunks = Math.ceil(total / numLimit);
    const options = [];
    for (let i = 0; i < totalChunks; i++) {
      const start = i * numLimit + 1;
      const end = Math.min((i + 1) * numLimit, total);
      options.push({ label: `${start} - ${end}`, value: i });
    }
    return options;
  }

  function syncDropdownVisibility() {
    const lMenu = document.getElementById('limitPopupMenu');
    const lChev = document.getElementById('limitChevron');
    if (lMenu) lMenu.style.display = showLimitMenu ? 'block' : 'none';
    if (lChev) {
      lChev.className = `fa-solid fa-chevron-${showLimitMenu ? 'up' : 'down'}`;
    }

    const rMenu = document.getElementById('rangePopupMenu');
    const rChev = document.getElementById('rangeChevron');
    if (rMenu) rMenu.style.display = showRangeMenu ? 'block' : 'none';
    if (rChev) {
      rChev.className = `fa-solid fa-chevron-${showRangeMenu ? 'up' : 'down'}`;
    }
  }

  function toggleLimitMenu(e) {
    if (e) e.stopPropagation();
    showLimitMenu = !showLimitMenu;
    if (showLimitMenu) {
      showRangeMenu = false;
      closeGlobalSettings();
    }
    syncDropdownVisibility();
  }

  function closeLimitMenu() {
    showLimitMenu = false;
    syncDropdownVisibility();
  }

  function toggleRangeMenu(e) {
    if (e) e.stopPropagation();
    showRangeMenu = !showRangeMenu;
    if (showRangeMenu) {
      showLimitMenu = false;
      closeGlobalSettings();
    }
    syncDropdownVisibility();
  }

  function closeRangeMenu() {
    showRangeMenu = false;
    syncDropdownVisibility();
  }

  function applyLimitAndRange() {
    // 1. Update Limit trigger label in Bengali
    const limitLabelEl = document.getElementById('limitTriggerLabel');
    if (limitLabelEl) {
      limitLabelEl.textContent = LIMIT_LABELS[limit] || 'সকল প্রশ্ন';
    }

    // 2. Update active state in limit popup menu
    document.querySelectorAll('#limitPopupMenu .quiz-layout-menu-item').forEach((btn) => {
      const active = btn.getAttribute('data-limit') === limit;
      btn.classList.toggle('active', active);
      const circle = btn.querySelector('.quiz-layout-radio-circle');
      if (circle) circle.innerHTML = active ? '<div class="quiz-layout-radio-inner"></div>' : '';
    });

    const rangeDropdownWrapper = document.getElementById('rangeDropdownWrapper');
    const rangeTriggerLabel = document.getElementById('rangeTriggerLabel');

    if (limit === 'all') {
      if (rangeDropdownWrapper) rangeDropdownWrapper.style.display = 'none';
      closeRangeMenu();
      displayQuestions = [...allQuestions];
    } else {
      if (rangeDropdownWrapper) rangeDropdownWrapper.style.display = 'inline-block';
      const num = parseInt(limit, 10);
      const rangeOptions = getRangeOptions();

      if (rangeIndex >= rangeOptions.length) {
        rangeIndex = 0;
      }

      const currentOpt = rangeOptions.find((o) => o.value === rangeIndex) || rangeOptions[0];
      if (rangeTriggerLabel) {
        rangeTriggerLabel.textContent = currentOpt ? currentOpt.label : '১ - ২০';
      }

      const rangeMenu = document.getElementById('rangePopupMenu');
      if (rangeMenu) {
        rangeMenu.innerHTML = rangeOptions.map((opt) => {
          const active = opt.value === rangeIndex;
          return `
            <button type="button" class="quiz-layout-menu-item ${active ? 'active' : ''}" data-range="${opt.value}">
              <div class="quiz-layout-radio-circle">
                ${active ? '<div class="quiz-layout-radio-inner"></div>' : ''}
              </div>
              <span>${opt.label}</span>
            </button>
          `;
        }).join('');

        rangeMenu.querySelectorAll('[data-range]').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            rangeIndex = parseInt(btn.getAttribute('data-range'), 10);
            closeRangeMenu();
            applyLimitAndRange();
          });
        });
      }

      const start = rangeIndex * num;
      const end = start + num;
      displayQuestions = allQuestions.slice(start, end);
    }

    syncDropdownVisibility();
    resetQuizState();
  }

  // --- Initializer ---
  async function init() {
    // Attempt to load questions from questions.json if available
    try {
      const res = await fetch('questions.json');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          allQuestions = data;
          displayQuestions = [...data];
        }
      }
    } catch (e) {
      console.log('Running with embedded questions.');
    }

    // Load saved preferences from localStorage
    try {
      const savedPreset = localStorage.getItem('topmcqbd_active_preset') || 'practice';
      const rawProfiles = localStorage.getItem('topmcqbd_preset_profiles');
      let profiles = rawProfiles ? JSON.parse(rawProfiles) : null;
      if (!profiles) {
        profiles = { ...DEFAULT_PRESET_PROFILES };
        localStorage.setItem('topmcqbd_preset_profiles', JSON.stringify(profiles));
      }

      const savedAskAi = localStorage.getItem('topmcqbd_show_ask_ai');
      if (savedAskAi === 'true') showAskAi = true;

      syncPresetVisuals(savedPreset);
      applyPresetProfile(savedPreset, profiles[savedPreset] || DEFAULT_PRESET_PROFILES[savedPreset]);
    } catch (e) {
      console.warn('Preferences load error:', e);
      syncPresetVisuals('practice');
      applyPresetProfile('practice', DEFAULT_PRESET_PROFILES.practice);
    }

    setupEventListeners();
    updateHasActiveAccordion();
    renderAiMessages();
    applyLimitAndRange();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
