'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import './style.css';
import { loadExamQuestions, cleanExamTitle } from '../../../../lib/examsData';

// Digits mapping
const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBengaliNumber = (num) => {
  if (num === undefined || num === null) return '০';
  return String(num).replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
};

const formatScore = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '০';
  const rounded = Math.round(val * 100) / 100;
  const str = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(rounded % 0.1 === 0 ? 1 : 2);
  return str.replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
};

const formatTimer = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const mStr = `${m < 10 ? '0' : ''}${m}`.replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
  const sStr = `${s < 10 ? '0' : ''}${s}`.replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
  return `${mStr}:${sStr}`;
};

const BANGLA_LETTERS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
const ENGLISH_LETTERS = ['A', 'B', 'C', 'D', 'E'];
const ENGLISH_LOWERCASE_LETTERS = ['a', 'b', 'c', 'd', 'e'];

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

const DEFAULT_QUESTIONS = [
  {
    _id: 'q1',
    q: 'বাংলা সাহিত্যের প্রথম মহাকাব্য কোনটি?',
    options: ['মেঘনাদবধ কাব্য', 'পদ্মাবতী', 'বৃত্রসংহার', 'মহাশ্মশান'],
    ans: 0,
    explanation: "মাইকেল মধুসূদন দত্ত রচিত 'মেঘনাদবধ কাব্য' (১৮৬১) বাংলা সাহিত্যের প্রথম সার্থক মহাকাব্য। এটি অমিত্রাক্ষর ছন্দে রচিত এবং এর সর্গ সংখ্যা ৯টি।"
  },
  {
    _id: 'q2',
    q: '‘সূর্য’ শব্দের সমার্থক শব্দ কোনটি?',
    options: ['সুধাংশু', 'মিহির', 'শশাঙ্ক', 'বিধু'],
    ans: 1,
    explanation: "'মিহির' সূর্যের সমার্থক শব্দ। অন্যদিকে সুধাংশু, শশাঙ্ক ও বিধু চাঁদের সমার্থক শব্দ।"
  },
  {
    _id: 'q3',
    q: 'Which one is the correct spelling?',
    options: ['Bureaucracy', 'Beaurocracy', 'Bureaucrasy', 'Burocracy'],
    ans: 0,
    explanation: "সঠিক বানান হলো 'Bureaucracy', যার বাংলা অর্থ আমলাতন্ত্র।"
  },
  {
    _id: 'q4',
    q: "The idiom 'A hot potato' means—",
    options: ['A delicious food', 'A controversial issue difficult to deal with', 'An urgent meeting', 'A useless thing'],
    ans: 1,
    explanation: "'A hot potato' বাগধারাটির অর্থ হলো এমন একটি বিতর্কিত বা স্পর্শকাতর বিষয় যা সামলানো অত্যন্ত কঠিন।"
  },
  {
    _id: 'q5',
    q: 'মুজিবনগর সরকার কত তারিখে আনুষ্ঠানিকভাবে শপথ গ্রহণ করে?',
    options: ['১০ এপ্রিল ১৯৭১', '১৭ এপ্রিল ১৯৭১', '২৫ মার্চ ১৯৭১', '২৬ মার্চ ১৯৭১'],
    ans: 1,
    explanation: '১৯৭১ সালের ১০ এপ্রিল মুজিবনগর সরকার গঠিত হয় এবং ১৭ এপ্রিল মেহেরপুরের বৈদ্যনাথতলার ভবেরপাড়ায় (বর্তমান মুজিবনগর) আনুষ্ঠানিকভাবে শপথ গ্রহণ করে।'
  }
];

function QuestionBankSmartQuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examSlug = searchParams.get('exam') || searchParams.get('category') || '';
  const initialModeParam = searchParams.get('mode') || 'practice';

  // Questions Data
  const [examMeta, setExamMeta] = useState(null);
  const [allQuestions, setAllQuestions] = useState(DEFAULT_QUESTIONS);
  const [loading, setLoading] = useState(true);

  // Active Preset & Top Bar Mode
  const [activePreset, setActivePreset] = useState(
    initialModeParam === 'read' ? 'read' : (initialModeParam === 'exam' ? 'exam' : 'practice')
  );
  const [activeMode, setActiveMode] = useState(initialModeParam === 'read' ? 'read' : 'practice');
  const isReadMode = activeMode === 'read';

  // Presets Profiles Storage State (customizations saved per preset)
  const [presetProfiles, setPresetProfiles] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('topmcqbd_preset_profiles');
        if (raw) return JSON.parse(raw);
      } catch (e) {}
    }
    return DEFAULT_PRESET_PROFILES;
  });

  // Settings State initialized from current preset
  const [questionLayout, setQuestionLayout] = useState('2q-col');
  const [optionLayout, setOptionLayout] = useState('2');
  const [middleLine, setMiddleLine] = useState('dotted');
  const [bottomLine, setBottomLine] = useState('dotted');
  const [middleGap, setMiddleGap] = useState(60);
  const [customGapInput, setCustomGapInput] = useState('');
  const [questionStyle, setQuestionStyle] = useState('dotted');
  const [highlightMode, setHighlightMode] = useState('single');
  const [highlightColor, setHighlightColor] = useState('highlight-and-circle');
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerMode, setAnswerMode] = useState('none');
  const [showExplanation, setShowExplanation] = useState(true);
  const [explanationMode, setExplanationMode] = useState('on-select');
  const [optionLetter, setOptionLetter] = useState('bangla');
  const [cutMark, setCutMark] = useState(0.5);
  const [cutMarkMode, setCutMarkMode] = useState('0.5');
  const [customCutMarkInput, setCustomCutMarkInput] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [customFontInput, setCustomFontInput] = useState('');
  const [fontFamily, setFontFamily] = useState("'Noto Sans Bengali', sans-serif");
  const [fontWeight, setFontWeight] = useState('regular');

  // Top Bar Controls
  const [showAskAi, setShowAskAi] = useState(true);
  const [showTime, setShowTime] = useState(initialModeParam === 'exam');
  const [showScore, setShowScore] = useState(true);
  const [limit, setLimit] = useState('all');
  const [rangeIndex, setRangeIndex] = useState(0);

  // Dropdown States
  const [limitMenuOpen, setLimitMenuOpen] = useState(false);
  const [rangeMenuOpen, setRangeMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [sortoHintOpen, setSortoHintOpen] = useState(false);

  // Major Accordion Sections Open State (6 Sections)
  const [secOpen, setSecOpen] = useState({
    secLayout: true,
    secColorStyle: false,
    secExplanation: false,
    secOptionLetter: false,
    secCutMark: false,
    secFont: false
  });

  // Sub-Accordion Open State
  const [subSecOpen, setSubSecOpen] = useState({
    subGrpStyle: true,
    subGrpQLayout: true,
    subGrpOptLayout: false,
    subGrpMidLine: false,
    subGrpBottomLine: false,
    subGrpMidGap: false,
    subGrpHighlightMode: true,
    subGrpHighlightColor: true,
    subGrpShowAnswer: true,
    subGrpExpMode: true,
    subGrpFontSize: true,
    subGrpFontFamily: false,
    subGrpFontWeight: false
  });

  // User Quiz States
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [expandedExplanations, setExpandedExplanations] = useState({});
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // Completion / Review / Retake States
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [isReviewWrongMode, setIsReviewWrongMode] = useState(false);
  const [isRetakeWrongMode, setIsRetakeWrongMode] = useState(false);
  const [retakeQuestions, setRetakeQuestions] = useState([]);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef(null);

  // Floating AI Chat State
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      sender: 'ai',
      text: 'আমি **TopMCQBD AI শিক্ষক**।\nযে কোনো প্রশ্নের পাশে থাকা **"Ask AI"** বাটনে চাপুন অথবা নিচে আপনার প্রশ্নটি লিখে পাঠান — আমি উত্তর ও ব্যাখ্যা বুঝিয়ে দেব।'
    }
  ]);

  const settingsWrapperRef = useRef(null);
  const limitWrapperRef = useRef(null);
  const rangeWrapperRef = useRef(null);

  // Check if any major accordion is active
  const hasActiveAccordion = useMemo(() => {
    return Object.values(secOpen).some((isOpen) => isOpen);
  }, [secOpen]);

  // Load Exam Questions from /data/job-solution/...
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    if (examSlug) {
      loadExamQuestions(examSlug)
        .then((res) => {
          if (!isMounted) return;
          if (res && res.questions && res.questions.length > 0) {
            setExamMeta(res.exam);
            const normalized = res.questions.map((item, idx) => {
              const qText = item.question || item.q || item.question_text || `প্রশ্ন ${idx + 1}`;
              const opts = Array.isArray(item.options) ? item.options : [];
              let ansIdx = -1;

              if (typeof item.ans === 'number') {
                ansIdx = item.ans;
              } else if (item.correct_answer !== undefined) {
                const ansStr = String(item.correct_answer).trim();
                ansIdx = opts.findIndex((opt) => String(opt).trim() === ansStr);
                if (ansIdx === -1 && !isNaN(ansStr) && ansStr !== '') {
                  ansIdx = parseInt(ansStr, 10);
                }
              }

              let expText = item.explanation || '';
              if (item.hints) {
                expText = expText ? `${expText}\n\n${item.hints}` : item.hints;
              }

              return {
                _id: item.id || `q_${idx}`,
                q: qText,
                options: opts,
                ans: ansIdx >= 0 ? ansIdx : 0,
                explanation: expText,
                subject: item.subject || '',
                exam: item.exam || res.exam?.title || ''
              };
            });

            setAllQuestions(normalized);
          } else {
            setAllQuestions(DEFAULT_QUESTIONS);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading questions:', err);
          if (isMounted) {
            setAllQuestions(DEFAULT_QUESTIONS);
            setLoading(false);
          }
        });
    } else {
      setAllQuestions(DEFAULT_QUESTIONS);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [examSlug]);

  // Apply a Preset Profile
  const applyPresetProfile = (presetId, customProfiles = null) => {
    const profs = customProfiles || presetProfiles;
    const profile = profs[presetId] || DEFAULT_PRESET_PROFILES[presetId] || DEFAULT_PRESET_PROFILES.practice;

    setActivePreset(presetId);

    setQuestionLayout(profile.questionLayout || '2q-col');
    setOptionLayout(profile.optionLayout || '2');
    setMiddleLine(profile.middleLine || 'dotted');
    setBottomLine(profile.bottomLine || 'dotted');
    setMiddleGap(profile.middleGap !== undefined ? profile.middleGap : 60);
    setOptionLetter(profile.optionLetter || 'bangla');
    setQuestionStyle(profile.questionStyle || 'dotted');
    setHighlightMode(profile.highlightMode || 'single');
    setHighlightColor(profile.highlightColor || 'highlight-and-circle');
    setExplanationMode(profile.explanationMode || 'on-select');
    setShowExplanation(profile.showExplanation);
    setCutMark(profile.cutMark !== undefined ? profile.cutMark : 0.5);
    setCutMarkMode(profile.cutMarkMode || '0.5');
    setFontSize(profile.fontSize || 16);
    setFontFamily(profile.fontFamily || "'Noto Sans Bengali', sans-serif");
    setFontWeight(profile.fontWeight || 'regular');

    const resAnsMode = profile.answerMode || (profile.showAnswer ? 'on-select' : 'none');
    setAnswerMode(resAnsMode);
    setShowAnswer(resAnsMode !== 'none' && resAnsMode !== 'explanation-only');

    if (presetId === 'read') {
      setActiveMode('read');
      setShowTime(false);
      setShowScore(false);
      setSecOpen({
        secLayout: true,
        secColorStyle: true,
        secExplanation: true,
        secOptionLetter: false,
        secCutMark: false,
        secFont: false
      });
    } else if (presetId === 'exam') {
      setActiveMode('practice');
      setShowTime(true);
      setShowScore(true);
      setSecOpen({
        secLayout: true,
        secColorStyle: false,
        secExplanation: false,
        secOptionLetter: false,
        secCutMark: false,
        secFont: false
      });
    } else {
      setActiveMode('practice');
      setShowTime(profile.showTime || false);
      setShowScore(profile.showScore !== undefined ? profile.showScore : true);
      setSecOpen({
        secLayout: true,
        secColorStyle: false,
        secExplanation: false,
        secOptionLetter: false,
        secCutMark: false,
        secFont: false
      });
    }

    try {
      localStorage.setItem('topmcqbd_active_preset', presetId);
    } catch (e) {}
  };

  // Initial Preset Loading on Mount
  useEffect(() => {
    const initialPreset = initialModeParam === 'read' ? 'read' : (initialModeParam === 'exam' ? 'exam' : 'practice');
    applyPresetProfile(initialPreset);
  }, []);

  // Save changes to active preset in state and localStorage
  const saveActivePresetSetting = (key, value) => {
    setPresetProfiles((prev) => {
      const updatedPreset = {
        ...(prev[activePreset] || DEFAULT_PRESET_PROFILES[activePreset] || DEFAULT_PRESET_PROFILES.practice),
        [key]: value
      };
      const newProfiles = {
        ...prev,
        [activePreset]: updatedPreset
      };
      try {
        localStorage.setItem('topmcqbd_preset_profiles', JSON.stringify(newProfiles));
      } catch (e) {}
      return newProfiles;
    });
  };

  // Setting modification handlers
  const handleUpdateSetting = (key, value) => {
    saveActivePresetSetting(key, value);

    if (key === 'questionLayout') {
      setQuestionLayout(value);
      if (value !== '1q' && optionLayout === '4') {
        setOptionLayout('1');
        saveActivePresetSetting('optionLayout', '1');
      }
    } else if (key === 'optionLayout') {
      setOptionLayout(value);
    } else if (key === 'middleLine') {
      setMiddleLine(value);
    } else if (key === 'bottomLine') {
      setBottomLine(value);
    } else if (key === 'middleGap') {
      setMiddleGap(value);
    } else if (key === 'questionStyle') {
      setQuestionStyle(value);
    } else if (key === 'highlightMode') {
      setHighlightMode(value);
    } else if (key === 'highlightColor') {
      setHighlightColor(value);
    } else if (key === 'answerMode') {
      setAnswerMode(value);
      const isAnsVisible = value !== 'none' && value !== 'explanation-only';
      setShowAnswer(isAnsVisible);
      saveActivePresetSetting('showAnswer', isAnsVisible);
    } else if (key === 'explanationMode') {
      setExplanationMode(value);
      const isExpVisible = value !== 'none' && value !== 'answer-only';
      setShowExplanation(isExpVisible);
      saveActivePresetSetting('showExplanation', isExpVisible);
    } else if (key === 'optionLetter') {
      setOptionLetter(value);
    } else if (key === 'cutMark') {
      setCutMark(value);
      setCutMarkMode(String(value));
      saveActivePresetSetting('cutMarkMode', String(value));
      setScore(Math.round((correctCount * 1 - incorrectCount * value) * 100) / 100);
    } else if (key === 'cutMarkCustom') {
      setCutMark(value);
      setCutMarkMode('custom');
      saveActivePresetSetting('cutMark', value);
      saveActivePresetSetting('cutMarkMode', 'custom');
      setScore(Math.round((correctCount * 1 - incorrectCount * value) * 100) / 100);
    } else if (key === 'fontSize') {
      setFontSize(value);
    } else if (key === 'fontFamily') {
      setFontFamily(value);
    } else if (key === 'fontWeight') {
      setFontWeight(value);
    }
  };

  // Reset Button Handler (Reset active preset to its default profile)
  const handleResetSettings = () => {
    setIsResetting(true);
    const def = DEFAULT_PRESET_PROFILES[activePreset] || DEFAULT_PRESET_PROFILES.practice;

    setPresetProfiles((prev) => {
      const newProfiles = {
        ...prev,
        [activePreset]: { ...def }
      };
      try {
        localStorage.setItem('topmcqbd_preset_profiles', JSON.stringify(newProfiles));
      } catch (e) {}
      return newProfiles;
    });

    applyPresetProfile(activePreset, { ...presetProfiles, [activePreset]: { ...def } });

    setTimeout(() => {
      setIsResetting(false);
    }, 1200);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsWrapperRef.current && !settingsWrapperRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
      if (limitWrapperRef.current && !limitWrapperRef.current.contains(e.target)) {
        setLimitMenuOpen(false);
      }
      if (rangeWrapperRef.current && !rangeWrapperRef.current.contains(e.target)) {
        setRangeMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Filtered & Ranged Questions
  const filteredQuestions = useMemo(() => {
    if (isRetakeWrongMode && retakeQuestions.length > 0) return retakeQuestions;
    return allQuestions;
  }, [allQuestions, isRetakeWrongMode, retakeQuestions]);

  const rangeOptions = useMemo(() => {
    if (limit === 'all') return [];
    const numLimit = parseInt(limit, 10);
    const total = filteredQuestions.length;
    if (total === 0) return [{ label: '১ - ২০', index: 0 }];
    const totalChunks = Math.ceil(total / numLimit);
    const options = [];
    for (let i = 0; i < totalChunks; i++) {
      const start = i * numLimit + 1;
      const end = Math.min((i + 1) * numLimit, total);
      options.push({ label: `${toBengaliNumber(start)} - ${toBengaliNumber(end)}`, index: i });
    }
    return options;
  }, [limit, filteredQuestions.length]);

  const displayQuestions = useMemo(() => {
    if (limit === 'all') return filteredQuestions;
    const numLimit = parseInt(limit, 10);
    const start = rangeIndex * numLimit;
    const end = start + numLimit;
    return filteredQuestions.slice(start, end);
  }, [filteredQuestions, limit, rangeIndex]);

  // Timer Interval
  useEffect(() => {
    if (showTime && !isReadMode && displayQuestions.length > 0 && !examSubmitted) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showTime, isReadMode, displayQuestions.length, examSubmitted]);

  // Handle MCQ Answer Click
  const handleAnswerClick = (qIndex, optIndex) => {
    if (activeMode === 'read' || answeredQuestions[qIndex] !== undefined) return;

    const q = displayQuestions[qIndex];
    if (!q) return;

    const newAnswers = { ...answeredQuestions, [qIndex]: optIndex };
    setAnsweredQuestions(newAnswers);

    let newCorrect = correctCount;
    let newIncorrect = incorrectCount;

    if (optIndex === q.ans) {
      newCorrect += 1;
      setCorrectCount(newCorrect);
    } else {
      newIncorrect += 1;
      setIncorrectCount(newIncorrect);
    }

    const newScore = Math.round((newCorrect * 1 - newIncorrect * cutMark) * 100) / 100;
    setScore(newScore);

    if (activePreset === 'exam' && Object.keys(newAnswers).length === displayQuestions.length) {
      setExamSubmitted(true);
    }
  };

  // Ask AI handler (triggers window.postMessage for 5266-AI-extension)
  const handleAskAI = (qIndex) => {
    const q = displayQuestions[qIndex];
    if (!q) return;

    const clean = (str) => {
      if (!str || typeof str !== 'string') return '';
      return str.replace(/<[^>]+>/g, '').trim();
    };

    if (typeof window !== 'undefined') {
      window.postMessage({
        type: '5266_ASK_AI',
        payload: {
          question: clean(q.q),
          options: (q.options || []).map(clean),
          subject: q.subject || '',
          exam: q.exam || examMeta?.title || cleanExamTitle(examSlug)
        }
      }, '*');
    }

    // Also opens the internal simulated AI chat drawer
    const letters = optionLetter === 'english' ? ENGLISH_LETTERS : (optionLetter === 'english-lower' ? ENGLISH_LOWERCASE_LETTERS : BANGLA_LETTERS);
    setAiChatOpen(true);
    setAiMessages((prev) => [
      ...prev,
      { sender: 'user', text: `📖 ${q.q}` }
    ]);

    setTimeout(() => {
      const correctOptText = q.options[q.ans] || '';
      const correctLetter = letters[q.ans] || (q.ans + 1);
      const aiReply = `### 🎯 সঠিক উত্তর: (${correctLetter}) ${correctOptText}\n\n💡 **বিশ্লেষণ ও ব্যাখ্যা:**\n${q.explanation || 'এই প্রশ্নের জন্য কোনো অতিরিক্ত ব্যাখ্যা সংরক্ষিত নেই।'}\n\n• **প্রশ্ন পর্যালোচনা:** এই প্রশ্নটি বিভিন্ন সরকারি চাকরি ও ভর্তি পরীক্ষায় একাধিকবার এসেছে।\n• **মনে রাখার টেকনিক:** উত্তরটি নির্ভুলভাবে মনে রাখতে প্রাসঙ্গিক মূল সাল ও তথ্যগুলো নিয়মিত রিভিশন দিন।`;
      setAiMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    }, 600);
  };

  // Send AI Chat Message
  const handleSendAiMessage = () => {
    if (!aiInputText.trim()) return;
    const userText = aiInputText.trim();
    setAiInputText('');
    setAiMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    setTimeout(() => {
      const genericReply = `💡 আপনার প্রশ্নের জন্য ধন্যবাদ!\n\n**TopMCQBD AI শিক্ষক:**\n"${userText}" সম্পর্কিত যেকোনো সুনির্দিষ্ট তথ্য বা প্রশ্নের ব্যাখ্যা জানতে যেকোনো প্রশ্নে "Ask AI" ক্লিক করতে পারেন। আমি আপনার প্রস্তুতিকে নিখুঁত করতে সাহায্য করব।`;
      setAiMessages((prev) => [...prev, { sender: 'ai', text: genericReply }]);
    }, 700);
  };

  // Option Letter Helper
  const getOptionLabel = (idx) => {
    if (optionLetter === 'english') {
      return ENGLISH_LETTERS[idx] || String.fromCharCode(65 + idx);
    }
    if (optionLetter === 'english-lower') {
      return ENGLISH_LOWERCASE_LETTERS[idx] || String.fromCharCode(97 + idx);
    }
    return BANGLA_LETTERS[idx] || (idx + 1);
  };

  // Restart / Reset Quiz
  const handleRestart = () => {
    setAnsweredQuestions({});
    setExpandedAnswers({});
    setExpandedExplanations({});
    setScore(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setExamSubmitted(false);
    setIsReviewWrongMode(false);
    setIsRetakeWrongMode(false);
    setTimerSeconds(0);
  };

  const handleRetakeWrong = () => {
    const wrongs = displayQuestions.filter((q, idx) => {
      const chosen = answeredQuestions[idx];
      return chosen !== undefined && chosen !== q.ans;
    });

    if (wrongs.length === 0) return;
    setRetakeQuestions(wrongs);
    setIsRetakeWrongMode(true);
    setIsReviewWrongMode(false);
    setAnsweredQuestions({});
    setScore(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setExamSubmitted(false);
  };

  const handleReviewWrong = () => {
    setIsReviewWrongMode(true);
    setIsRetakeWrongMode(false);
  };

  // Toggle Accordion sections
  const toggleSec = (secKey) => {
    setSecOpen((prev) => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  // Toggle Sub-Accordions
  const toggleSubSec = (subKey) => {
    setSubSecOpen((prev) => ({ ...prev, [subKey]: !prev[subKey] }));
  };

  // Dynamic Badges Text
  const badgeQStyleText = useMemo(() => {
    switch (questionStyle) {
      case 'box': return 'বক্স কার্ড';
      case 'circle': return 'সার্কেল অপশন';
      case 'bracket': return 'ব্র্যাকেট অপশন';
      case 'nostyle': return 'নো স্টাইল';
      default: return 'বর্ডার লাইন';
    }
  }, [questionStyle]);

  const badgeQLayoutText = useMemo(() => {
    switch (questionLayout) {
      case '2q-row': return '২টি প্রশ্ন (পাশাপাশি)';
      case '3q-col': return '৩টি প্রশ্ন (উপর-নিচ)';
      case '3q-row': return '৩টি প্রশ্ন (পাশাপাশি)';
      case '1q': return '১টি প্রশ্ন';
      default: return '২টি প্রশ্ন (উপর-নিচ)';
    }
  }, [questionLayout]);

  const badgeOptLayoutText = useMemo(() => {
    return optionLayout === '4' ? '১ লাইনে ৪টি' : (optionLayout === '1' ? '১ লাইনে ১টি' : '১ লাইনে ২টি');
  }, [optionLayout]);

  const badgeMidLineText = useMemo(() => {
    return middleLine === 'solid' ? 'সলিড লাইন' : (middleLine === 'none' ? 'লাইন ছাড়া' : 'ডটেড লাইন');
  }, [middleLine]);

  const badgeBottomLineText = useMemo(() => {
    return bottomLine === 'solid' ? 'সলিড লাইন' : (bottomLine === 'none' ? 'লাইন ছাড়া' : 'ডটেড লাইন');
  }, [bottomLine]);

  const badgeMidGapText = useMemo(() => {
    return middleGap === 0 ? 'No Gap' : `${middleGap}px`;
  }, [middleGap]);

  const badgeHighlightModeText = useMemo(() => {
    return highlightMode === 'both' ? 'সঠিক ও ভুল উভয়টি' : (highlightMode === 'neutral' ? 'শুধু সিলেকশন' : 'শুধু নির্বাচিত');
  }, [highlightMode]);

  const badgeHighlightColorText = useMemo(() => {
    switch (highlightColor) {
      case 'full-bg': return 'পূর্ণ ব্যাকগ্রাউন্ড';
      case 'border-only': return 'শুধু বর্ডার';
      case 'label-only': return 'চিহ্ন পরিবর্তন';
      case 'with-icons': return 'আইকন দিয়ে';
      case 'bottom-line': return 'লাইন দিয়ে';
      case 'soft-highlight': return 'হালকা হাইলাইট';
      default: return 'আইকন+চিহ্ন';
    }
  }, [highlightColor]);

  const badgeAnswerModeText = useMemo(() => {
    switch (answerMode) {
      case 'on-select': return 'অপশন নির্বাচনে';
      case 'on-button': return 'বাটনে ক্লিকে';
      case 'on-wrong': return 'ভুল উত্তরে';
      case 'explanation-only': return 'শুধু ব্যাখ্যা';
      default: return 'কোনো উত্তর নেই';
    }
  }, [answerMode]);

  const badgeExpModeText = useMemo(() => {
    switch (explanationMode) {
      case 'on-select': return 'অপশন নির্বাচনে';
      case 'on-button': return 'বাটনে ক্লিকে';
      case 'on-wrong': return 'ভুল উত্তরে';
      case 'answer-only': return 'শুধু উত্তর';
      default: return 'কোনো ব্যাখ্যা নেই';
    }
  }, [explanationMode]);

  const badgeOptionLetterText = useMemo(() => {
    return optionLetter === 'english' ? 'A, B, C, D' : (optionLetter === 'english-lower' ? 'a, b, c, d' : 'ক, খ, গ, ঘ');
  }, [optionLetter]);

  const badgeFontFamilyText = useMemo(() => {
    const f = FONT_FAMILIES.find((item) => item.family === fontFamily);
    return f ? f.name : 'Noto Sans';
  }, [fontFamily]);

  const badgeFontWeightText = useMemo(() => {
    const fw = FONT_WEIGHTS.find((item) => item.value === fontWeight);
    return fw ? fw.name : 'Regular';
  }, [fontWeight]);

  // Style modes for outer wrapper
  const styleModeClass = questionStyle === 'box'
    ? 'style-box-mode'
    : (questionStyle === 'circle' || questionStyle === 'bracket' || questionStyle === 'nostyle')
    ? 'style-nostyle-mode'
    : '';

  const activePresetObj = PRESET_LIST.find((p) => p.id === activePreset) || PRESET_LIST[0];

  // Font weights CSS map
  const fwMap = { thin: '300', regular: '400', medium: '600', bold: '800' };
  const qwMap = { thin: '400', regular: '600', medium: '700', bold: '800' };
  const cwMap = { thin: '500', regular: '700', medium: '700', bold: '800' };

  // Render a Single Question Block HTML
  const renderSingleQuestion = (q, qIndex) => {
    const chosen = answeredQuestions[qIndex];
    const isAnswered = chosen !== undefined;
    const shouldShow = activeMode === 'read' || isAnswered || isReviewWrongMode;

    let isAnswerVisible = false;
    if (showAnswer) {
      if (answerMode === 'on-select') isAnswerVisible = shouldShow;
      else if (answerMode === 'on-button') isAnswerVisible = activeMode === 'read' || !!expandedAnswers[qIndex];
      else if (answerMode === 'on-wrong') {
        if (isReviewWrongMode || isRetakeWrongMode || activeMode === 'read') isAnswerVisible = true;
        else if (isAnswered && chosen !== q.ans) isAnswerVisible = true;
      }
    }

    let isExplanationVisible = false;
    if (showExplanation && q.explanation) {
      if (explanationMode === 'on-select') isExplanationVisible = shouldShow;
      else if (explanationMode === 'on-button') isExplanationVisible = !!expandedExplanations[qIndex];
      else if (explanationMode === 'on-wrong') {
        if (isReviewWrongMode || isRetakeWrongMode) isExplanationVisible = true;
        else if (isAnswered && chosen !== q.ans) isExplanationVisible = true;
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

    const showAnsBtn = showAnswer && answerMode === 'on-button';
    const showExpBtn = showExplanation && explanationMode === 'on-button' && q.explanation;

    return (
      <div
        key={q._id || qIndex}
        className={`quiz-question-block ${styleClass} bottomline-${bottomLine}`}
        data-block-idx={qIndex}
      >
        {/* Header */}
        {questionStyle === 'box' ? (
          <div className="quiz-q-header">
            <div className="quiz-q-title-area">
              <span className="quiz-qnum-badge font-bn">{toBengaliNumber(qIndex + 1)}</span>
              <span className="quiz-q-title-text font-bn">
                {q.q}
                {showAskAi && (
                  <button
                    type="button"
                    className="quiz-ask-ai-btn"
                    onClick={() => handleAskAI(qIndex)}
                    title="Ask AI"
                  >
                    Ask AI
                  </button>
                )}
              </span>
            </div>
          </div>
        ) : (
          <div className="quiz-question-text">
            <span className="font-bn">{toBengaliNumber(qIndex + 1)}.</span> {q.q}
            {showAskAi && (
              <button
                type="button"
                className="quiz-ask-ai-btn"
                onClick={() => handleAskAI(qIndex)}
                title="Ask AI"
              >
                Ask AI
              </button>
            )}
          </div>
        )}

        {/* Options Container */}
        <div className={`quiz-options-container layout-${optionLayout} ans-style-${highlightColor}`}>
          {(q.options || []).map((opt, optIndex) => {
            let btnClass = 'quiz-option-btn';
            let isOptionCorrect = false;
            let isOptionIncorrect = false;

            if (activeMode === 'read') {
              btnClass += ' disabled';
              if (optIndex === q.ans) {
                btnClass += ' correct';
                isOptionCorrect = true;
              }
            } else if (isReviewWrongMode) {
              btnClass += ' disabled';
              if (optIndex === q.ans) {
                btnClass += ' correct';
                isOptionCorrect = true;
              } else if (chosen === optIndex) {
                btnClass += ' incorrect';
                isOptionIncorrect = true;
              }
            } else if (isAnswered) {
              btnClass += ' disabled';
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

            const showStatusIcon = (highlightColor === 'with-icons' || highlightColor === 'highlight-and-circle') &&
              (isOptionCorrect || isOptionIncorrect);

            return (
              <button
                key={optIndex}
                type="button"
                className={btnClass}
                disabled={activeMode === 'read' || isAnswered || isReviewWrongMode}
                onClick={() => handleAnswerClick(qIndex, optIndex)}
              >
                <div className="quiz-option-circle font-bn">
                  <span className="quiz-option-circle-letter">{labelText}</span>
                </div>
                <div className="quiz-option-text">
                  {opt}
                </div>
                {showStatusIcon && (
                  <span className="quiz-option-status-icon">
                    {isOptionCorrect ? (
                      <i className="fa-solid fa-circle-check text-success"></i>
                    ) : (
                      <i className="fa-solid fa-circle-xmark text-danger"></i>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* On-Button manual reveal */}
        {(showAnsBtn || showExpBtn) && (
          <div className="quiz-explanation-btn-wrap" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px' }}>
            {showAnsBtn && (
              <button
                type="button"
                className={`quiz-explanation-toggle-btn quiz-answer-toggle-btn ${expandedAnswers[qIndex] ? 'active' : ''}`}
                onClick={() => setExpandedAnswers((prev) => ({ ...prev, [qIndex]: !prev[qIndex] }))}
              >
                <i className={`fa-solid ${expandedAnswers[qIndex] ? 'fa-eye-slash' : 'fa-circle-check'}`}></i>
                <span>{expandedAnswers[qIndex] ? 'উত্তর লুকান' : 'উত্তর'}</span>
              </button>
            )}
            {showExpBtn && (
              <button
                type="button"
                className={`quiz-explanation-toggle-btn ${expandedExplanations[qIndex] ? 'active' : ''}`}
                onClick={() => setExpandedExplanations((prev) => ({ ...prev, [qIndex]: !prev[qIndex] }))}
              >
                <i className={`fa-solid ${expandedExplanations[qIndex] ? 'fa-eye-slash' : 'fa-lightbulb'}`}></i>
                <span>{expandedExplanations[qIndex] ? 'ব্যাখ্যা লুকান' : 'ব্যাখ্যা'}</span>
              </button>
            )}
          </div>
        )}

        {/* Standalone Answer */}
        {isAnswerVisible && (!isExplanationVisible || !q.explanation) && (
          <div className="quiz-answer-text">
            <i className="fa-solid fa-circle-check"></i>
            <span>
              সঠিক উত্তর: {questionStyle === 'bracket' ? `(${getOptionLabel(q.ans)})` : `${getOptionLabel(q.ans)}.`} {q.options[q.ans]}
            </span>
          </div>
        )}

        {/* Unified Explanation Box */}
        {isExplanationVisible && q.explanation && (
          <div className="quiz-explanation-text">
            {isAnswerVisible && (
              <div className="quiz-exp-answer-row">
                <i className="fa-solid fa-circle-check"></i>
                <span>
                  সঠিক উত্তর: {questionStyle === 'bracket' ? `(${getOptionLabel(q.ans)})` : `${getOptionLabel(q.ans)}.`} {q.options[q.ans]}
                </span>
              </div>
            )}
            <div className="quiz-exp-body-row" style={{ whiteSpace: 'pre-line' }}>
              <strong>ব্যাখ্যা:</strong> {q.explanation}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Grid Columns based on questionLayout (2q-col, 2q-row, 3q-col, 3q-row, 1q)
  const renderQuestionsContent = () => {
    if (displayQuestions.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>কোনো প্রশ্ন পাওয়া যায়নি।</p>
          <Link
            href="/question-bank-smart/"
            style={{
              display: 'inline-block',
              marginTop: '14px',
              padding: '10px 20px',
              background: '#007bff',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            সকল প্রশ্নব্যাংকে ফিরুন
          </Link>
        </div>
      );
    }

    if (questionLayout === '2q-col') {
      const half = Math.ceil(displayQuestions.length / 2);
      const col1 = displayQuestions.slice(0, half);
      const col2 = displayQuestions.slice(half);

      return (
        <div
          className={`quiz-questions-col-wrapper ${styleModeClass} midline-${middleLine} bottomline-${bottomLine}`}
          style={{
            '--quiz-midline-gap': `${middleGap}px`,
            '--quiz-midline-half-gap': `${middleGap / 2}px`
          }}
        >
          <div className="quiz-questions-column">
            {col1.map((q, idx) => renderSingleQuestion(q, idx))}
          </div>
          <div className="quiz-questions-column">
            {col2.map((q, idx) => renderSingleQuestion(q, idx + half))}
          </div>
        </div>
      );
    }

    if (questionLayout === '2q-row') {
      const col1 = displayQuestions.filter((_, idx) => idx % 2 === 0);
      const col2 = displayQuestions.filter((_, idx) => idx % 2 === 1);

      return (
        <div
          className={`quiz-questions-col-wrapper ${styleModeClass} midline-${middleLine} bottomline-${bottomLine}`}
          style={{
            '--quiz-midline-gap': `${middleGap}px`,
            '--quiz-midline-half-gap': `${middleGap / 2}px`
          }}
        >
          <div className="quiz-questions-column">
            {col1.map((q, idx) => renderSingleQuestion(q, idx * 2))}
          </div>
          <div className="quiz-questions-column">
            {col2.map((q, idx) => renderSingleQuestion(q, idx * 2 + 1))}
          </div>
        </div>
      );
    }

    if (questionLayout === '3q-col') {
      const third = Math.ceil(displayQuestions.length / 3);
      const col1 = displayQuestions.slice(0, third);
      const col2 = displayQuestions.slice(third, third * 2);
      const col3 = displayQuestions.slice(third * 2);

      return (
        <div
          className={`quiz-questions-col-wrapper col-3 ${styleModeClass} midline-${middleLine} bottomline-${bottomLine}`}
          style={{
            '--quiz-midline-gap': `${middleGap}px`,
            '--quiz-midline-half-gap': `${middleGap / 2}px`
          }}
        >
          <div className="quiz-questions-column">
            {col1.map((q, idx) => renderSingleQuestion(q, idx))}
          </div>
          <div className="quiz-questions-column">
            {col2.map((q, idx) => renderSingleQuestion(q, idx + third))}
          </div>
          <div className="quiz-questions-column">
            {col3.map((q, idx) => renderSingleQuestion(q, idx + third * 2))}
          </div>
        </div>
      );
    }

    if (questionLayout === '3q-row') {
      const col1 = displayQuestions.filter((_, idx) => idx % 3 === 0);
      const col2 = displayQuestions.filter((_, idx) => idx % 3 === 1);
      const col3 = displayQuestions.filter((_, idx) => idx % 3 === 2);

      return (
        <div
          className={`quiz-questions-col-wrapper col-3 ${styleModeClass} midline-${middleLine} bottomline-${bottomLine}`}
          style={{
            '--quiz-midline-gap': `${middleGap}px`,
            '--quiz-midline-half-gap': `${middleGap / 2}px`
          }}
        >
          <div className="quiz-questions-column">
            {col1.map((q, idx) => renderSingleQuestion(q, idx * 3))}
          </div>
          <div className="quiz-questions-column">
            {col2.map((q, idx) => renderSingleQuestion(q, idx * 3 + 1))}
          </div>
          <div className="quiz-questions-column">
            {col3.map((q, idx) => renderSingleQuestion(q, idx * 3 + 2))}
          </div>
        </div>
      );
    }

    // 1 Question per line
    return (
      <div className={`quiz-questions-wrapper ${styleModeClass} bottomline-${bottomLine}`}>
        {displayQuestions.map((q, idx) => renderSingleQuestion(q, idx))}
      </div>
    );
  };

  const answeredTotal = Object.keys(answeredQuestions).length;
  const questionsTotal = displayQuestions.length;
  const questionsLeft = Math.max(0, questionsTotal - answeredTotal);

  return (
    <div
      className="quiz-section-wrapper"
      id="quizSectionWrapper"
      style={{
        fontFamily: fontFamily,
        fontSize: `${fontSize}px`
      }}
    >
      {/* Floating Questions Progress Box at Bottom-Left Corner */}
      <div className="quiz-floating-progress-left" id="floatingProgressLeft" style={{ display: 'block' }}>
        <div className="quiz-progress-pill-badge" title="মোট প্রশ্ন, সম্পন্ন ও বাকি প্রশ্নের লাইভ হিসাব">
          <span>মোট প্রশ্ন: <strong id="progressTotalQ">{toBengaliNumber(questionsTotal)}</strong></span>
          <span className="quiz-pill-divider">|</span>
          <span>সম্পন্ন: <strong id="progressDoneQ">{toBengaliNumber(answeredTotal)}</strong></span>
          <span className="quiz-pill-divider">|</span>
          <span>বাকি: <strong id="progressLeftQ">{toBengaliNumber(questionsLeft)}</strong></span>
        </div>
      </div>

      {/* Floating Status Bar (Timer & Score at Top-Right) */}
      <div className="quiz-floating-status-bar">
        {showTime && (
          <div className="quiz-timer-board" id="timerBoard" style={{ display: 'flex' }}>
            <i className="fa-regular fa-clock"></i>
            <span id="timerDisplay">{formatTimer(timerSeconds)}</span>
          </div>
        )}
        {showScore && (
          <div className="quiz-score-board" id="scoreBoard" style={{ display: 'flex' }}>
            <span>স্কোর:</span>
            <span id="scoreDisplay">{formatScore(score)}</span>
          </div>
        )}
      </div>

      {/* Top Navigation & Mode Switcher Bar */}
      <div className="quiz-top-bar">
        <div className="quiz-top-bar-left">
          <div className="quiz-top-breadcrumb">
            <Link href="/question-bank-smart/" className="quiz-top-page-title" title="সকল MCQ">
              <i className="fa-solid fa-arrow-left" style={{ marginRight: '6px' }}></i>
              <span>সকল MCQ</span>
            </Link>
          </div>

          <button
            type="button"
            className="quiz-top-restart-btn"
            id="btnTopRestart"
            onClick={handleRestart}
            title="পুনরায় সম্পূর্ণ পরীক্ষা / কুইজ শুরু করুন"
          >
            <i className="fa-solid fa-rotate-right"></i>
            <span>পুনরায় অনুশীলন শুরু করুন</span>
          </button>
        </div>

        <div className="quiz-top-bar-right">
          {/* Segmented Mode Switcher Box */}
          <div className="quiz-mode-switcher-box">
            <button
              type="button"
              className={`quiz-mode-btn ${activeMode === 'practice' ? 'active' : ''}`}
              id="btnModePractice"
              onClick={() => {
                setActiveMode('practice');
                applyPresetProfile('practice');
              }}
              title="অনুশীলন মোড"
            >
              <i className="fa-regular fa-circle-check"></i>
              <span>অনুশীলন মোড</span>
            </button>
            <button
              type="button"
              className={`quiz-mode-btn ${activeMode === 'read' ? 'active' : ''}`}
              id="btnModeRead"
              onClick={() => {
                setActiveMode('read');
                applyPresetProfile('read');
              }}
              title="পড়ুন মোড"
            >
              <i className="fa-solid fa-book-open"></i>
              <span>পড়ুন মোড</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Quiz Container */}
      <div
        className="quiz-container"
        id="quizContainer"
        style={{
          '--quiz-font-size': `${fontSize}px`,
          '--quiz-font-family': fontFamily,
          '--quiz-font-weight': fwMap[fontWeight] || '400',
          '--quiz-question-weight': qwMap[fontWeight] || '600',
          '--quiz-circle-weight': cwMap[fontWeight] || '700'
        }}
      >
        {/* Completion Summary Banner */}
        {examSubmitted && (
          <div className="quiz-completion-banner" id="completionBanner" style={{ display: 'flex' }}>
            <div className="quiz-completion-banner-info">
              <div className="quiz-completion-banner-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="quiz-completion-banner-text">
                <span className="quiz-banner-score-text">
                  আপনার মোট প্রাপ্ত স্কোর: <strong id="bannerFinalScore">{formatScore(score)}</strong>
                </span>
                <span className="quiz-banner-divider">|</span>
                <span className="quiz-banner-wrong-text">
                  ভুল উত্তর: <strong id="bannerIncorrectCount">{toBengaliNumber(incorrectCount)} টি</strong>
                </span>
                {incorrectCount === 0 && (
                  <span className="quiz-banner-perfect-text" id="bannerPerfectText">🎉 কোনো ভুল নেই, সব উত্তর সঠিক!</span>
                )}
              </div>
            </div>

            <div className="quiz-completion-banner-actions">
              {incorrectCount > 0 && (
                <div id="bannerWrongActions" style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="quiz-banner-btn btn-banner-view-wrong"
                    id="btnBannerViewWrong"
                    onClick={handleReviewWrong}
                  >
                    <i className="fa-solid fa-eye"></i> ভুল উত্তর দেখুন
                  </button>
                  <button
                    type="button"
                    className="quiz-banner-btn btn-banner-retake-wrong"
                    id="btnBannerRetakeWrong"
                    onClick={handleRetakeWrong}
                  >
                    <i className="fa-solid fa-pen-to-square"></i> ভুল উত্তরের ওপর পরীক্ষা দিন
                  </button>
                </div>
              )}
              <button
                type="button"
                className="quiz-banner-btn btn-banner-reset-full"
                id="btnBannerResetFull"
                onClick={handleRestart}
              >
                <i className="fa-solid fa-rotate-right"></i> পুনরায় সম্পূর্ণ পরীক্ষা দিন
              </button>
            </div>
          </div>
        )}

        {/* Retake Wrong Questions Banner */}
        {isRetakeWrongMode && (
          <div className="quiz-retake-mode-banner" id="retakeBanner" style={{ display: 'flex' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ color: '#e11d48', fontSize: '18px' }}></i>
              <span>
                ভুল উত্তর দেওয়া <strong id="retakeCountText">{toBengaliNumber(retakeQuestions.length)}</strong>টি প্রশ্নের ওপর পুনরায় পরীক্ষা দিচ্ছেন।
              </span>
            </div>
            <button
              type="button"
              className="btn-exit-retake"
              id="btnExitRetake"
              onClick={() => {
                setIsRetakeWrongMode(false);
                handleRestart();
              }}
            >
              <i className="fa-solid fa-arrow-left"></i> মূল পরীক্ষায় ফিরে যান
            </button>
          </div>
        )}

        {/* Review Mode Banner */}
        {isReviewWrongMode && (
          <div className="quiz-review-mode-banner" id="reviewBanner" style={{ display: 'flex' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-circle-exclamation" style={{ color: '#d97706', fontSize: '18px' }}></i>
              <span>
                ভুল উত্তর দেওয়া <strong id="reviewCountText">{toBengaliNumber(incorrectCount)}</strong>টি প্রশ্নের সঠিক উত্তর ও ব্যাখ্যা নিচে প্রদর্শিত হচ্ছে।
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-banner-reset"
                id="btnExitReview"
                style={{ background: '#d97706' }}
                onClick={() => setIsReviewWrongMode(false)}
              >
                <i className="fa-solid fa-arrow-left"></i> মূল পরীক্ষায় ফিরুন
              </button>
              <button
                type="button"
                className="btn-banner-retake"
                id="btnReviewRetake"
                onClick={handleRetakeWrong}
              >
                <i className="fa-solid fa-pen-to-square"></i> ভুল উত্তরের ওপর পরীক্ষা দিন
              </button>
            </div>
          </div>
        )}

        {/* Exam Title & Header */}
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          {examMeta?.title || cleanExamTitle(examSlug) || 'Online Questions & Exam Practice'}
        </h1>
        <h2 id="categoryTitle" style={{ fontSize: '1.05rem', color: '#64748b', fontWeight: 600, marginBottom: '14px' }}>
          {examMeta?.category_name || 'সাধারণ জ্ঞান ও বিষয়ভিত্তিক প্রশ্নব্যাংক'}
        </h2>

        {/* Header Info Bar */}
        <div className="quiz-header-info-bar">
          <div className="quiz-exam-path">
            <i className="fa-solid fa-square-poll-horizontal" style={{ marginRight: '6px', color: '#007bff' }}></i>
            <span id="breadcrumbCategory">{examMeta?.category_name || 'সকল প্রশ্নব্যাংক'}</span>
          </div>
          <div className="quiz-header-right-actions">
            <div className="quiz-negative-mark-note">
              <i className="fa-solid fa-bell"></i>
              <span id="negativeMarkNote">
                {cutMark === 0
                  ? 'কোনো কাট মার্ক নেই'
                  : `প্রতিটি ভুল উত্তরের জন্য ${toBengaliNumber(cutMark)} নম্বর কাটা যাবে`}
              </span>
            </div>
          </div>
        </div>

        <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

        {/* Controls Bar */}
        <div className="quiz-controls-bar">
          <div className="quiz-nav-actions">
            {/* Questions Count Custom Dropdown */}
            <div className="quiz-layout-dropdown-wrapper" id="limitDropdownWrapper" ref={limitWrapperRef}>
              <button
                type="button"
                className="quiz-layout-trigger-btn"
                id="btnLimitTrigger"
                onClick={() => {
                  setLimitMenuOpen(!limitMenuOpen);
                  setRangeMenuOpen(false);
                  setSettingsOpen(false);
                }}
                title="প্রশ্নের সংখ্যা নির্ধারণ করুন"
              >
                <i className="fa-solid fa-list-ol" style={{ color: '#007bff' }}></i>
                <span id="limitTriggerLabel">{limit === 'all' ? 'সকল প্রশ্ন' : `${toBengaliNumber(limit)} টি প্রশ্ন`}</span>
                <i className={`fa-solid fa-chevron-${limitMenuOpen ? 'up' : 'down'}`} id="limitChevron" style={{ fontSize: '11px', color: '#64748b' }}></i>
              </button>

              {limitMenuOpen && (
                <div className="quiz-layout-popup-menu" id="limitPopupMenu" style={{ display: 'block' }}>
                  {['all', '20', '25', '50', '100'].map((lVal) => {
                    const isActive = limit === lVal;
                    return (
                      <button
                        key={lVal}
                        type="button"
                        className={`quiz-layout-menu-item ${isActive ? 'active' : ''}`}
                        data-limit={lVal}
                        onClick={() => {
                          setLimit(lVal);
                          setRangeIndex(0);
                          setLimitMenuOpen(false);
                        }}
                      >
                        <div className="quiz-layout-radio-circle">
                          {isActive && <div className="quiz-layout-radio-inner"></div>}
                        </div>
                        <span>{lVal === 'all' ? 'সকল প্রশ্ন' : `${toBengaliNumber(lVal)} টি প্রশ্ন`}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Range Dropdown (shown when limit !== 'all') */}
            {limit !== 'all' && rangeOptions.length > 0 && (
              <div className="quiz-layout-dropdown-wrapper" id="rangeDropdownWrapper" ref={rangeWrapperRef}>
                <button
                  type="button"
                  className="quiz-layout-trigger-btn"
                  id="btnRangeTrigger"
                  onClick={() => {
                    setRangeMenuOpen(!rangeMenuOpen);
                    setLimitMenuOpen(false);
                    setSettingsOpen(false);
                  }}
                  title="প্রশ্নের রেঞ্জ নির্ধারণ করুন"
                >
                  <span id="rangeTriggerLabel">{rangeOptions[rangeIndex]?.label || '১ - ২০'}</span>
                  <i className={`fa-solid fa-chevron-${rangeMenuOpen ? 'up' : 'down'}`} id="rangeChevron" style={{ fontSize: '11px', color: '#64748b' }}></i>
                </button>

                {rangeMenuOpen && (
                  <div className="quiz-layout-popup-menu" id="rangePopupMenu" style={{ display: 'block', maxHeight: '220px', overflowY: 'auto' }}>
                    {rangeOptions.map((r) => {
                      const isActive = rangeIndex === r.index;
                      return (
                        <button
                          key={r.index}
                          type="button"
                          className={`quiz-layout-menu-item ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            setRangeIndex(r.index);
                            setRangeMenuOpen(false);
                          }}
                        >
                          <div className="quiz-layout-radio-circle">
                            {isActive && <div className="quiz-layout-radio-inner"></div>}
                          </div>
                          <span>{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Ask AI Switcher */}
            <label className="quiz-switch-label quiz-ask-ai-switcher" id="askAiSwitcherLabel" title="Ask AI বাটন বন্ধ/চালু করুন">
              <label className="quiz-switch">
                <input
                  type="checkbox"
                  id="switchAskAi"
                  checked={showAskAi}
                  onChange={(e) => setShowAskAi(e.target.checked)}
                />
                <span className="quiz-slider" id="sliderAskAi"></span>
              </label>
              Ask AI
            </label>
          </div>

          <div className="quiz-right-controls-group">
            <div className="quiz-switch-group">
              {/* Explanation Switch */}
              <label className="quiz-switch-label" id="lblExplanationSwitch" title="ব্যাখ্যা">
                <label className="quiz-switch">
                  <input
                    type="checkbox"
                    id="switchExplanation"
                    checked={showExplanation}
                    onChange={(e) => {
                      const willBeOn = e.target.checked;
                      setShowExplanation(willBeOn);
                      const newMode = willBeOn ? 'on-select' : 'none';
                      setExplanationMode(newMode);
                      saveActivePresetSetting('showExplanation', willBeOn);
                      saveActivePresetSetting('explanationMode', newMode);
                    }}
                  />
                  <span className="quiz-slider"></span>
                </label>
                <span id="textExplanationSwitch">
                  {explanationMode === 'on-select' ? 'ব্যাখ্যা (স্বয়ংক্রিয়)' :
                   explanationMode === 'on-button' ? 'ব্যাখ্যা (ম্যানুয়াল)' :
                   explanationMode === 'on-wrong' ? 'ব্যাখ্যা (ভুল প্রশ্নে)' :
                   explanationMode === 'answer-only' ? 'শুধু উত্তর' : 'ব্যাখ্যা'}
                </span>
              </label>

              {/* Time Switch */}
              <label className={`quiz-switch-label ${activeMode === 'read' ? 'disabled-switch' : ''}`} id="lblTimeSwitch">
                <label className="quiz-switch">
                  <input
                    type="checkbox"
                    id="switchTime"
                    disabled={activeMode === 'read'}
                    checked={showTime}
                    onChange={(e) => {
                      setShowTime(e.target.checked);
                      saveActivePresetSetting('showTime', e.target.checked);
                    }}
                  />
                  <span className="quiz-slider"></span>
                </label>
                সময়
              </label>

              {/* Score Switch */}
              <label className={`quiz-switch-label ${activeMode === 'read' ? 'disabled-switch' : ''}`} id="lblScoreSwitch">
                <label className="quiz-switch">
                  <input
                    type="checkbox"
                    id="switchScore"
                    disabled={activeMode === 'read'}
                    checked={showScore}
                    onChange={(e) => {
                      setShowScore(e.target.checked);
                      saveActivePresetSetting('showScore', e.target.checked);
                    }}
                  />
                  <span className="quiz-slider"></span>
                </label>
                স্কোর
              </label>

              {/* প্রশ্ন সেটিংস Dropdown Trigger & POPUP (100% IDENTICAL TO REFERENCE DESIGN) */}
              <div className="quiz-layout-dropdown-wrapper" id="globalSettingsDropdownWrapper" ref={settingsWrapperRef}>
                <button
                  type="button"
                  className="quiz-layout-trigger-btn quiz-global-settings-trigger"
                  id="btnGlobalSettingsTrigger"
                  onClick={() => {
                    setSettingsOpen(!settingsOpen);
                    setLimitMenuOpen(false);
                    setRangeMenuOpen(false);
                  }}
                  title="প্রশ্ন সেটিংস (লেআউট, কাট মার্ক, ফন্ট, উত্তর ও ব্যাখ্যা)"
                >
                  <i className="fa-solid fa-gear" style={{ color: '#007bff' }}></i>
                  <span>প্রশ্ন সেটিংস</span>
                  <i className={`fa-solid fa-chevron-${settingsOpen ? 'up' : 'down'}`} id="settingsChevron" style={{ fontSize: '11px', color: '#64748b' }}></i>
                </button>

                {/* প্রশ্ন সেটিংস Popup Menu (100% IDENTICAL DOM) */}
                <div
                  className={`quiz-layout-popup-menu quiz-global-settings-popup ${!settingsOpen ? 'is-hidden' : ''} ${hasActiveAccordion ? 'has-active-accordion' : ''}`}
                  id="globalSettingsPopup"
                  style={{
                    display: settingsOpen ? 'flex' : 'none',
                    maxHeight: 'min(740px, 85vh)'
                  }}
                >
                  {/* Settings Header */}
                  <div className="quiz-global-popup-header">
                    <div className="quiz-global-popup-title">
                      <i className="fa-solid fa-gear" style={{ color: '#007bff' }}></i>
                      <span>প্রশ্ন সেটিংস</span>
                    </div>
                    <div className="quiz-global-popup-header-actions">
                      <button
                        type="button"
                        className={`quiz-popup-reset-btn ${isResetting ? 'reset-success' : ''}`}
                        id="btnResetSettings"
                        onClick={handleResetSettings}
                        title="ডিফল্ট সেটিংসে রিসেট করুন"
                      >
                        <i className={`fa-solid ${isResetting ? 'fa-check' : 'fa-rotate-left'}`}></i>
                        <span id="resetSettingsLabel">{isResetting ? 'রিসেট সম্পন্ন' : 'রিসেট'}</span>
                      </button>
                      <button
                        type="button"
                        className="quiz-popup-close-mini"
                        id="btnCloseSettings"
                        onClick={() => setSettingsOpen(false)}
                        title="বন্ধ করুন"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>

                  {/* Settings Body */}
                  <div className="quiz-global-popup-body">
                    {/* Preset Profiles Header */}
                    <div className="quiz-presets-header-box">
                      <div className="quiz-presets-header">
                        <span className="quiz-presets-label">
                          <i className="fa-solid fa-sliders" style={{ color: '#0284c7' }}></i>
                          <span>প্রি-সেট সেটিংস</span>
                        </span>
                        <span className="quiz-preset-current-indicator">
                          সক্রিয়: <strong id="indicatorActivePreset">{activePresetObj.name}</strong>
                        </span>
                      </div>
                      <div className="quiz-presets-description">
                        <span>যেকোনো প্রি-সেট সিলেক্ট করে নিচের ফিচারগুলো নিজের মতো পরিবর্তন করতে পারবেন, যা এই মোডে সংরক্ষিত থাকবে।</span>
                      </div>
                    </div>

                    {/* Preset Tabs Container */}
                    <div className={`quiz-preset-tabs-container preset-theme-${activePreset}`} id="presetTabsContainer">
                      <div className="quiz-presets-bar">
                        {PRESET_LIST.map((p, idx) => {
                          const isActive = p.id === activePreset;
                          const isNextActive = PRESET_LIST[idx + 1]?.id === activePreset;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              className={`quiz-preset-btn ${isActive ? `active preset-${p.id}` : ''} ${isNextActive ? 'has-active-next' : ''}`}
                              data-preset={p.id}
                              onClick={() => applyPresetProfile(p.id)}
                              title={`${p.name} মোড সক্রিয় করুন`}
                            >
                              <i className={`fa-solid ${p.icon}`}></i>
                              <span>{p.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Preset Features Box */}
                      <div className={`quiz-preset-features-box preset-theme-${activePreset}`} id="presetFeaturesBox">
                        <div className="quiz-preset-features-header">
                          <div className="quiz-preset-features-header-left">
                            <span className="quiz-preset-features-icon-badge" id="presetFeaturesIcon">
                              <i className={`fa-solid ${activePresetObj.icon}`}></i>
                            </span>
                            <div className="quiz-preset-features-title-group">
                              <div className="quiz-preset-features-main-title">
                                <span id="presetFeaturesTitle">‘{activePresetObj.name}’ মোডের ফিচারসমূহ</span>
                                <span className="quiz-preset-features-tag" id="presetFeaturesTag">
                                  {activePreset === 'custom' ? 'ব্যক্তিগত সেটিংস' : 'প্রি-বিল্ট ফিচারস'}
                                </span>
                              </div>
                              <span className="quiz-preset-features-subtitle" id="presetFeaturesSubtitle">
                                {activePreset === 'practice' && 'সাধারণ অনুশীলন ও অপশনভিত্তিক স্বয়ংক্রিয় ব্যাখ্যা'}
                                {activePreset === 'read' && 'সঠিক উত্তর সরাসরি প্রদর্শন ও পড়ার সুবিধাজনক মোড'}
                                {activePreset === 'exam' && 'পরীক্ষার আদলে নিরপেক্ষ ভিউ (কোনো তাত্ক্ষণিক উত্তর নেই)'}
                                {activePreset === 'custom' && 'আপনার সংরক্ষিত নিজস্ব ব্যক্তিগত সেটিংস ও ফিচারসমূহ'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="quiz-preset-features-body">
                          {/* Section 1: Layout Accordion */}
                          <div className={`quiz-global-section layout-section ${secOpen.secLayout ? 'active' : ''}`} id="secLayout">
                            <div
                              className="quiz-global-section-header"
                              id="headerSecLayout"
                              onClick={() => toggleSec('secLayout')}
                              title="লেআউট সেটিংস"
                            >
                              <div className="quiz-global-section-header-left">
                                <i className="fa-solid fa-table-cells-large" style={{ color: '#007bff' }}></i>
                                <span>লেআউট (Option Layout):</span>
                              </div>
                              <div className="quiz-global-section-header-right">
                                <span className="quiz-font-accordion-badge">
                                  <span className="quiz-font-accordion-badge-text">{badgeOptLayoutText}</span>
                                </span>
                                <i className={`fa-solid fa-${secOpen.secLayout ? 'minus' : 'plus'} quiz-font-accordion-plus-minus`} id="iconSecLayout"></i>
                              </div>
                            </div>

                            <div className="quiz-global-section-body" id="bodySecLayout" style={{ display: secOpen.secLayout ? 'block' : 'none' }}>
                              {/* Sub-Accordion 1: ডিজাইন স্টাইল (Question Style) */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpStyle ? 'active' : ''}`} id="subGrpStyle">
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpStyle ? 'active' : ''}`}
                                  id="headerSubGrpStyle"
                                  onClick={() => toggleSubSec('subGrpStyle')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-shapes" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>ডিজাইন স্টাইল (Question Style):</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeQuestionStyle">{badgeQStyleText}</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpStyle ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpStyle"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpStyle" style={{ display: subSecOpen.subGrpStyle ? 'block' : 'none' }}>
                                  {[
                                    { id: 'dotted', label: '১. বর্ডার লাইন (Border Line)' },
                                    { id: 'box', label: '২. বক্স কার্ড (Box Card)' },
                                    { id: 'circle', label: '৩. সার্কেল অপশন লেবেল (Circle Option Label)' },
                                    { id: 'bracket', label: '৪. ব্র্যাকেট অপশন লেবেল (Bracket Option Label)' },
                                    { id: 'nostyle', label: '৫. নো স্টাইল (No Style)' }
                                  ].map((item) => {
                                    const isAct = questionStyle === item.id;
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        className={`quiz-layout-menu-item ${isAct ? 'active' : ''}`}
                                        data-qstyle={item.id}
                                        onClick={() => handleUpdateSetting('questionStyle', item.id)}
                                      >
                                        <div className="quiz-layout-radio-circle">
                                          {isAct && <div className="quiz-layout-radio-inner"></div>}
                                        </div>
                                        <span>{item.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Sub-Accordion 2: প্রশ্ন Layout */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpQLayout ? 'active' : ''}`} id="subGrpQLayout" style={{ marginTop: '8px' }}>
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpQLayout ? 'active' : ''}`}
                                  id="headerSubGrpQLayout"
                                  onClick={() => toggleSubSec('subGrpQLayout')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-table-columns" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>প্রশ্ন Layout:</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeQLayout">{badgeQLayoutText}</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpQLayout ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpQLayout"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpQLayout" style={{ display: subSecOpen.subGrpQLayout ? 'block' : 'none' }}>
                                  {[
                                    { id: '2q-col', label: '১ লাইনে ২টি প্রশ্ন (উপর-নিচ ক্রম)' },
                                    { id: '2q-row', label: '১ লাইনে ২টি প্রশ্ন (পাশাপাশি ক্রম)' },
                                    { id: '3q-col', label: '১ লাইনে ৩টি প্রশ্ন (উপর-নিচ ক্রম)' },
                                    { id: '3q-row', label: '১ লাইনে ৩টি প্রশ্ন (পাশাপাশি ক্রম)' },
                                    { id: '1q', label: '১ লাইনে ১টি প্রশ্ন' }
                                  ].map((item) => {
                                    const isAct = questionLayout === item.id;
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        className={`quiz-layout-menu-item ${isAct ? 'active' : ''}`}
                                        data-qlayout={item.id}
                                        onClick={() => handleUpdateSetting('questionLayout', item.id)}
                                      >
                                        <div className="quiz-layout-radio-circle">
                                          {isAct && <div className="quiz-layout-radio-inner"></div>}
                                        </div>
                                        <span>{item.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Sub-Accordion 3: Option Layout */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpOptLayout ? 'active' : ''}`} id="subGrpOptLayout" style={{ marginTop: '8px' }}>
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpOptLayout ? 'active' : ''}`}
                                  id="headerSubGrpOptLayout"
                                  onClick={() => toggleSubSec('subGrpOptLayout')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-list-ol" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>Option Layout:</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeOptLayout">{badgeOptLayoutText}</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpOptLayout ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpOptLayout"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpOptLayout" style={{ display: subSecOpen.subGrpOptLayout ? 'block' : 'none' }}>
                                  <button
                                    type="button"
                                    className={`quiz-layout-menu-item ${optionLayout === '1' ? 'active' : ''}`}
                                    data-optlayout="1"
                                    onClick={() => handleUpdateSetting('optionLayout', '1')}
                                  >
                                    <div className="quiz-layout-radio-circle">
                                      {optionLayout === '1' && <div className="quiz-layout-radio-inner"></div>}
                                    </div>
                                    <span>১ লাইনে ১টি option</span>
                                  </button>
                                  <button
                                    type="button"
                                    className={`quiz-layout-menu-item ${optionLayout === '2' ? 'active' : ''}`}
                                    data-optlayout="2"
                                    onClick={() => handleUpdateSetting('optionLayout', '2')}
                                  >
                                    <div className="quiz-layout-radio-circle">
                                      {optionLayout === '2' && <div className="quiz-layout-radio-inner"></div>}
                                    </div>
                                    <span>১ লাইনে ২টি option</span>
                                  </button>

                                  {/* 4 Options in 1 line button & condition wrapper */}
                                  <div id="fourOptionWrapper" style={{ width: '100%' }}>
                                    {questionLayout === '1q' ? (
                                      <button
                                        type="button"
                                        className={`quiz-layout-menu-item ${optionLayout === '4' ? 'active' : ''}`}
                                        data-optlayout="4"
                                        id="btnOptLayout4"
                                        onClick={() => handleUpdateSetting('optionLayout', '4')}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                          <div className="quiz-layout-radio-circle">
                                            {optionLayout === '4' && <div className="quiz-layout-radio-inner"></div>}
                                          </div>
                                          <span>১ লাইনে ৪টি option</span>
                                        </div>
                                        <span className="quiz-option-active-badge">
                                          <i className="fa-solid fa-check" style={{ fontSize: '9.5px' }}></i>
                                          সক্রিয়
                                        </span>
                                      </button>
                                    ) : (
                                      <div style={{ width: '100%', position: 'relative' }}>
                                        <div
                                          className="quiz-layout-menu-item disabled"
                                          style={{
                                            opacity: 0.68,
                                            cursor: 'not-allowed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0'
                                          }}
                                        >
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="quiz-layout-radio-circle"></div>
                                            <span style={{ color: '#64748b' }}>১ লাইনে ৪টি option</span>
                                          </div>
                                          <button
                                            type="button"
                                            className="quiz-sorto-projojjo-btn"
                                            id="btnSortoHintToggle"
                                            title="শর্ত দেখতে ক্লিক করুন"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSortoHintOpen(!sortoHintOpen);
                                            }}
                                          >
                                            <span>শর্ত প্রযোজ্য</span>
                                          </button>
                                        </div>
                                        {sortoHintOpen && (
                                          <div id="sortoHintBox" className="quiz-sorto-projojjo-hint" style={{ display: 'flex' }}>
                                            <div className="quiz-sorto-projojjo-hint-text">
                                              <span>প্রশ্ন Layout: থেকে <strong>১ লাইনে ১টি প্রশ্ন</strong> choose করুন।</span>
                                            </div>
                                            <button
                                              type="button"
                                              className="quiz-sorto-projojjo-hint-close"
                                              id="btnCloseSortoHint"
                                              title="বন্ধ করুন"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSortoHintOpen(false);
                                              }}
                                            >
                                              <i className="fa-solid fa-xmark"></i>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Sub-Accordion 4: মাঝের লাইন (Middle Line) */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpMidLine ? 'active' : ''}`} id="subGrpMidLine" style={{ marginTop: '8px' }}>
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpMidLine ? 'active' : ''}`}
                                  id="headerSubGrpMidLine"
                                  onClick={() => toggleSubSec('subGrpMidLine')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-grip-lines-vertical" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>মাঝের লাইন (Middle Line style):</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeMidLine">{badgeMidLineText}</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpMidLine ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpMidLine"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpMidLine" style={{ display: subSecOpen.subGrpMidLine ? 'block' : 'none' }}>
                                  {[
                                    { id: 'dotted', title: '১. ডটেড লাইন (Dotted Line)', desc: 'কলামগুলোর মাঝে মার্জিত ডটেড ডিভাইডার লাইন থাকবে।' },
                                    { id: 'solid', title: '২. সলিড লাইন (Solid Line)', desc: 'কলামগুলোর মাঝে পরিষ্কার সলিড ডিভাইডার লাইন থাকবে।' },
                                    { id: 'none', title: '৩. লাইন ছাড়া (No Line)', desc: 'কলামগুলোর মাঝে কোনো ডিভাইডার লাইন থাকবে না।' }
                                  ].map((m) => {
                                    const isAct = middleLine === m.id;
                                    return (
                                      <button
                                        key={m.id}
                                        type="button"
                                        className={`quiz-layout-menu-item quiz-middle-line-item ${isAct ? 'active' : ''}`}
                                        data-midline={m.id}
                                        onClick={() => handleUpdateSetting('middleLine', m.id)}
                                      >
                                        <div className="quiz-layout-radio-circle">
                                          {isAct && <div className="quiz-layout-radio-inner"></div>}
                                        </div>
                                        <div className="quiz-middle-line-content">
                                          <span className="quiz-middle-line-title">{m.title}</span>
                                          <span className="quiz-middle-line-desc">{m.desc}</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Sub-Accordion 5: নিচের লাইন (Bottom Line) */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpBottomLine ? 'active' : ''}`} id="subGrpBottomLine" style={{ marginTop: '8px' }}>
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpBottomLine ? 'active' : ''}`}
                                  id="headerSubGrpBottomLine"
                                  onClick={() => toggleSubSec('subGrpBottomLine')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-grip-lines" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>নিচের লাইন (Bottom Line style):</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeBottomLine">{badgeBottomLineText}</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpBottomLine ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpBottomLine"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpBottomLine" style={{ display: subSecOpen.subGrpBottomLine ? 'block' : 'none' }}>
                                  {[
                                    { id: 'dotted', title: '১. ডটেড লাইন (Dotted Line)', desc: 'প্রশ্নের নিচে মার্জিত ডটেড ডিভাইডার লাইন থাকবে।' },
                                    { id: 'solid', title: '২. সলিড লাইন (Solid Line)', desc: 'প্রশ্নের নিচে পরিষ্কার সলিড ডিভাইডার লাইন থাকবে।' },
                                    { id: 'none', title: '৩. লাইন ছাড়া (No Line)', desc: 'প্রশ্নের নিচে কোনো ডিভাইডার লাইন থাকবে না।' }
                                  ].map((b) => {
                                    const isAct = bottomLine === b.id;
                                    return (
                                      <button
                                        key={b.id}
                                        type="button"
                                        className={`quiz-layout-menu-item quiz-middle-line-item ${isAct ? 'active' : ''}`}
                                        data-bottomline={b.id}
                                        onClick={() => handleUpdateSetting('bottomLine', b.id)}
                                      >
                                        <div className="quiz-layout-radio-circle">
                                          {isAct && <div className="quiz-layout-radio-inner"></div>}
                                        </div>
                                        <div className="quiz-middle-line-content">
                                          <span className="quiz-middle-line-title">{b.title}</span>
                                          <span className="quiz-middle-line-desc">{b.desc}</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Sub-Accordion 6: মাঝের লাইন Gap */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpMidGap ? 'active' : ''}`} id="subGrpMidGap" style={{ marginTop: '8px' }}>
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpMidGap ? 'active' : ''}`}
                                  id="headerSubGrpMidGap"
                                  onClick={() => toggleSubSec('subGrpMidGap')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-arrows-left-right" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>মাঝের লাইন Gap:</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeMidGap">{badgeMidGapText}</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpMidGap ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpMidGap"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpMidGap" style={{ display: subSecOpen.subGrpMidGap ? 'block' : 'none' }}>
                                  {[
                                    { gap: 0, title: 'No Gap (০ পিক্সেল)', desc: 'কলাম বা ডিভাইডার লাইনের দুই পাশে কোনো ফাঁকা জায়গা থাকবে না।' },
                                    { gap: 60, title: '60px (৬০ পিক্সেল - ডিফল্ট)', desc: 'মাঝখানে ৬০ পিক্সেল গ্যাপ (ডিভাইডার লাইন থাকলে দুই পাশে ৩০ পিক্সেল করে)।' },
                                    { gap: 80, title: '80px (৮০ পিক্সেল)', desc: 'মাঝখানে ৮০ পিক্সেল গ্যাপ (ডিভাইডার লাইন থাকলে দুই পাশে ৪০ পিক্সেল করে)।' }
                                  ].map((g) => {
                                    const isAct = middleGap === g.gap;
                                    return (
                                      <button
                                        key={g.gap}
                                        type="button"
                                        className={`quiz-layout-menu-item quiz-middle-line-item ${isAct ? 'active' : ''}`}
                                        data-midgap={g.gap}
                                        onClick={() => handleUpdateSetting('middleGap', g.gap)}
                                      >
                                        <div className="quiz-layout-radio-circle">
                                          {isAct && <div className="quiz-layout-radio-inner"></div>}
                                        </div>
                                        <div className="quiz-middle-line-content">
                                          <span className="quiz-middle-line-title">{g.title}</span>
                                          <span className="quiz-middle-line-desc">{g.desc}</span>
                                        </div>
                                      </button>
                                    );
                                  })}

                                  <div className="quiz-cut-mark-custom-card" style={{ marginTop: '8px', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div className="quiz-cut-mark-custom-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>কাস্টম গ্যাপ (Custom Gap - সর্বোচ্চ ২০০px):</span>
                                      {![0, 60, 80].includes(middleGap) && (
                                        <span className="quiz-font-accordion-badge" id="customGapActiveBadge" style={{ display: 'inline-block', fontSize: '11px', color: '#0284c7', borderColor: '#bae6fd', background: '#f0f9ff' }}>
                                          সক্রিয়: {middleGap}px
                                        </span>
                                      )}
                                    </div>
                                    <div className="quiz-font-custom-input-row" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                      <input
                                        type="number"
                                        min="0"
                                        max="200"
                                        id="inputCustomGap"
                                        placeholder="পিক্সেল (যেমন: ২৫ বা ১৫০)"
                                        className="quiz-font-input"
                                        value={customGapInput}
                                        onChange={(e) => setCustomGapInput(e.target.value)}
                                        style={{ flex: 1 }}
                                      />
                                      <button
                                        type="button"
                                        id="btnApplyCustomGap"
                                        className="quiz-font-apply-btn"
                                        onClick={() => {
                                          const val = parseInt(customGapInput, 10);
                                          if (!isNaN(val) && val >= 0 && val <= 200) {
                                            handleUpdateSetting('middleGap', val);
                                          }
                                        }}
                                      >
                                        সেট করুন
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Section 2: Color Answer Style Accordion */}
                          <div className={`quiz-global-section color-style-section ${secOpen.secColorStyle ? 'active' : ''}`} id="secColorStyle">
                            <div
                              className="quiz-global-section-header"
                              id="headerSecColorStyle"
                              onClick={() => toggleSec('secColorStyle')}
                              title="কালার অ্যানসার স্টাইল সেটিংস"
                            >
                              <div className="quiz-global-section-header-left">
                                <i className="fa-solid fa-palette" style={{ color: '#0284c7' }}></i>
                                <span>Color Answer Style:</span>
                              </div>
                              <div className="quiz-global-section-header-right">
                                <span className="quiz-font-accordion-badge">
                                  <span className="quiz-font-accordion-badge-text" id="badgeColorStyle">
                                    {badgeHighlightModeText} · {badgeHighlightColorText}
                                  </span>
                                </span>
                                <i className={`fa-solid fa-${secOpen.secColorStyle ? 'minus' : 'plus'} quiz-font-accordion-plus-minus`} id="iconSecColorStyle"></i>
                              </div>
                            </div>

                            <div className="quiz-global-section-body" id="bodySecColorStyle" style={{ display: secOpen.secColorStyle ? 'block' : 'none' }}>
                              {/* Sub-Accordion 1: হাইলাইট স্টাইল */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpHighlightMode ? 'active' : ''}`} id="subGrpHighlightMode">
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpHighlightMode ? 'active' : ''}`}
                                  id="headerSubGrpHighlightMode"
                                  onClick={() => toggleSubSec('subGrpHighlightMode')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-highlighter" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>হাইলাইট স্টাইল:</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeHighlightMode">{badgeHighlightModeText}</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpHighlightMode ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpHighlightMode"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpHighlightMode" style={{ display: subSecOpen.subGrpHighlightMode ? 'block' : 'none' }}>
                                  {[
                                    { id: 'single', title: 'শুধু নির্বাচিত অপশন হাইলাইট', desc: 'অপশনে ক্লিক করলে শুধুমাত্র নির্বাচিত অপশনের ফলাফল হাইলাইট হবে।' },
                                    { id: 'both', title: 'সঠিক ও ভুল উভয়টি দেখান', desc: 'ভুল অপশনটি লাল এবং সঠিক অপশনটি সবুজ রঙে হাইলাইট করে উভয় ফলাফল একসাথে দেখানো হবে।' },
                                    { id: 'neutral', title: 'সঠিক বা ভুল দেখাবে না (শুধু সিলেকশন)', desc: 'সঠিক বা ভুল কোনো ফলাফল প্রকাশ পাবে না, শুধুমাত্র অপশনটি নির্বাচন করা হয়েছে তা প্রকাশ পাবে।' }
                                  ].map((h) => {
                                    const isAct = highlightMode === h.id;
                                    return (
                                      <button
                                        key={h.id}
                                        type="button"
                                        className={`quiz-layout-menu-item quiz-color-style-item ${isAct ? 'active' : ''}`}
                                        data-hlmode={h.id}
                                        onClick={() => handleUpdateSetting('highlightMode', h.id)}
                                      >
                                        <div className="quiz-layout-radio-circle">
                                          {isAct && <div className="quiz-layout-radio-inner"></div>}
                                        </div>
                                        <div className="quiz-color-style-content">
                                          <span className="quiz-color-style-title">{h.title}</span>
                                          <span className="quiz-color-style-desc">{h.desc}</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Sub-Accordion 2: হাইলাইট কালার */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpHighlightColor ? 'active' : ''}`} id="subGrpHighlightColor" style={{ marginTop: '8px' }}>
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpHighlightColor ? 'active' : ''}`}
                                  id="headerSubGrpHighlightColor"
                                  onClick={() => toggleSubSec('subGrpHighlightColor')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-palette" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>হাইলাইট কালার:</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeHighlightColor">{badgeHighlightColorText}</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpHighlightColor ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpHighlightColor"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpHighlightColor" style={{ display: subSecOpen.subGrpHighlightColor ? 'block' : 'none' }}>
                                  {[
                                    { id: 'full-bg', title: 'পূর্ণ ব্যাকগ্রাউন্ড', desc: 'সঠিক বা ভুল অনুযায়ী পুরো অপশনের ব্যাকগ্রাউন্ড সলিড রঙ পরিবর্তন হবে।' },
                                    { id: 'border-only', title: 'শুধু বর্ডার পরিবর্তন', desc: 'সঠিক বা ভুল অনুযায়ী শুধু অপশনের বর্ডারের রঙ পরিবর্তন হবে, ব্যাকগ্রাউন্ড অপরিবর্তিত থাকবে।' },
                                    { id: 'label-only', title: 'শুধু অপশন চিহ্ন পরিবর্তন', desc: 'সঠিক বা ভুল অনুযায়ী শুধু ক, খ, গ, ঘ অপশন লেবেলের রঙ পরিবর্তন হবে।' },
                                    { id: 'highlight-and-circle', title: 'আইকন + অপশন চিহ্ন', desc: 'সঠিক উত্তরের পাশে ✓ এবং ভুল উত্তরের পাশে ✕ আইকন দেখানোর সাথে ক, খ, গ, ঘ অপশন লেবেলের রঙ পরিবর্তন হবে।' },
                                    { id: 'with-icons', title: 'আইকন দিয়ে দেখান', desc: 'সঠিক উত্তরের পাশে ✓ এবং ভুল উত্তরের পাশে ✕ আইকন দেখিয়ে ফলাফল বোঝানো হবে।' },
                                    { id: 'bottom-line', title: 'লাইন দিয়ে দেখান', desc: 'সঠিক বা ভুল অনুযায়ী অপশনের নিচে সবুজ বা লাল লাইন দেখানো হবে, তবে অপশনের ব্যাকগ্রাউন্ড অপরিবর্তিত থাকবে।' },
                                    { id: 'soft-highlight', title: 'হালকা হাইলাইট', desc: 'সঠিক বা ভুল অনুযায়ী অপশনের ব্যাকগ্রাউন্ডে হালকা সবুজ বা লাল রঙের আভা দেখানো হবে।' }
                                  ].map((c) => {
                                    const isAct = highlightColor === c.id;
                                    return (
                                      <button
                                        key={c.id}
                                        type="button"
                                        className={`quiz-layout-menu-item quiz-color-style-item ${isAct ? 'active' : ''}`}
                                        data-hlcolor={c.id}
                                        onClick={() => handleUpdateSetting('highlightColor', c.id)}
                                      >
                                        <div className="quiz-layout-radio-circle">
                                          {isAct && <div className="quiz-layout-radio-inner"></div>}
                                        </div>
                                        <div className="quiz-color-style-content">
                                          <span className="quiz-color-style-title">{c.title}</span>
                                          <span className="quiz-color-style-desc">{c.desc}</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Section 3: Answer & Explanation Settings */}
                          <div className={`quiz-global-section explanation-section ${secOpen.secExplanation ? 'active' : ''}`} id="secExplanation">
                            <div
                              className="quiz-global-section-header"
                              id="headerSecExplanation"
                              onClick={() => toggleSec('secExplanation')}
                              title="উত্তর ও ব্যাখ্যা সেটিংস"
                            >
                              <div className="quiz-global-section-header-left">
                                <i className="fa-solid fa-list-check" style={{ color: '#0284c7' }}></i>
                                <span>উত্তর ও ব্যাখ্যা (Answer & Explanation):</span>
                              </div>
                              <div className="quiz-global-section-header-right">
                                <span className="quiz-font-accordion-badge">
                                  <span className="quiz-font-accordion-badge-text">২টি অপশন</span>
                                </span>
                                <i className={`fa-solid fa-${secOpen.secExplanation ? 'minus' : 'plus'} quiz-font-accordion-plus-minus`} id="iconSecExplanation"></i>
                              </div>
                            </div>

                            <div className="quiz-global-section-body" id="bodySecExplanation" style={{ display: secOpen.secExplanation ? 'block' : 'none' }}>
                              {/* Sub-Accordion 1: সঠিক উত্তর (Show Answer) */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpShowAnswer ? 'active' : ''}`} id="subGrpShowAnswer">
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpShowAnswer ? 'active' : ''}`}
                                  id="headerSubGrpShowAnswer"
                                  onClick={() => toggleSubSec('subGrpShowAnswer')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>সঠিক উত্তর (Show Answer):</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeAnswerMode">{badgeAnswerModeText}</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpShowAnswer ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpShowAnswer"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpShowAnswer" style={{ display: subSecOpen.subGrpShowAnswer ? 'block' : 'none' }}>
                                  {[
                                    { id: 'on-select', title: '১. অপশন নির্বাচনে সঠিক উত্তর দেখান', desc: 'অপশনে ক্লিক করা মাত্রই স্বয়ংক্রিয়ভাবে সঠিক উত্তর দেখা যাবে।' },
                                    { id: 'on-button', title: '২. উত্তর বাটনে ক্লিক করলে দেখান', desc: 'উত্তর বাটনে ম্যানুয়ালি ক্লিক করলে তখন সঠিক উত্তর উন্মোচিত হবে।' },
                                    { id: 'on-wrong', title: '৩. ভুল উত্তরে সঠিক উত্তর দেখান', desc: 'শুধুমাত্র ভুল উত্তর নির্বাচন করলে সঠিক উত্তর দেখা যাবে।' },
                                    { id: 'explanation-only', title: '৪. শুধু ব্যাখ্যা দেখান', desc: 'প্রশ্নে শুধু ব্যাখ্যা প্রদর্শিত হবে, কোনো সঠিক উত্তর প্রদর্শিত হবে না।' },
                                    { id: 'none', title: '৫. কোনো সঠিক উত্তর দেখাবেন না', desc: 'প্রশ্নে কোনো প্রকার সঠিক উত্তর বা উত্তর দেখার বাটন প্রদর্শিত হবে না।' }
                                  ].map((a) => {
                                    const isAct = answerMode === a.id;
                                    return (
                                      <button
                                        key={a.id}
                                        type="button"
                                        className={`quiz-layout-menu-item quiz-color-style-item ${isAct ? 'active' : ''}`}
                                        data-ansmode={a.id}
                                        onClick={() => handleUpdateSetting('answerMode', a.id)}
                                      >
                                        <div className="quiz-layout-radio-circle">
                                          {isAct && <div className="quiz-layout-radio-inner"></div>}
                                        </div>
                                        <div className="quiz-color-style-content">
                                          <span className="quiz-color-style-title">{a.title}</span>
                                          <span className="quiz-color-style-desc">{a.desc}</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Sub-Accordion 2: ব্যাখ্যা প্রদর্শন (Explanation Mode) */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpExpMode ? 'active' : ''}`} id="subGrpExpMode" style={{ marginTop: '8px' }}>
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpExpMode ? 'active' : ''}`}
                                  id="headerSubGrpExpMode"
                                  onClick={() => toggleSubSec('subGrpExpMode')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-circle-info" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>ব্যাখ্যা প্রদর্শন (Explanation Mode):</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeExpMode">{badgeExpModeText}</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpExpMode ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpExpMode"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpExpMode" style={{ display: subSecOpen.subGrpExpMode ? 'block' : 'none' }}>
                                  {[
                                    { id: 'on-select', title: '১. অপশন নির্বাচনে ব্যাখ্যা দেখান', desc: 'অপশনে ক্লিক করা মাত্রই স্বয়ংক্রিয়ভাবে বিস্তারিত ব্যাখ্যা দেখা যাবে।' },
                                    { id: 'on-button', title: '২. ব্যাখ্যা বাটনে ক্লিক করলে দেখান', desc: 'ব্যাখ্যা বাটনে ম্যানুয়ালি ক্লিক করলে তখন ব্যাখ্যা উন্মোচিত হবে।' },
                                    { id: 'on-wrong', title: '৩. ভুল উত্তরে ব্যাখ্যা দেখান', desc: 'শুধুমাত্র ভুল উত্তর নির্বাচন করলে সঠিক সমাধান ও ব্যাখ্যা দেখা যাবে।' },
                                    { id: 'answer-only', title: '৪. শুধু উত্তর দেখান', desc: 'প্রশ্নে শুধু সঠিক উত্তর প্রদর্শিত হবে, কোনো ব্যাখ্যা প্রদর্শিত হবে না।' },
                                    { id: 'none', title: '৫. কোনো ব্যাখ্যা দেখাবেন না', desc: 'প্রশ্নে কোনো প্রকার ব্যাখ্যা বা সমাধানের বাটন প্রদর্শিত হবে না।' }
                                  ].map((e) => {
                                    const isAct = explanationMode === e.id;
                                    return (
                                      <button
                                        key={e.id}
                                        type="button"
                                        className={`quiz-layout-menu-item quiz-color-style-item ${isAct ? 'active' : ''}`}
                                        data-expmode={e.id}
                                        onClick={() => handleUpdateSetting('explanationMode', e.id)}
                                      >
                                        <div className="quiz-layout-radio-circle">
                                          {isAct && <div className="quiz-layout-radio-inner"></div>}
                                        </div>
                                        <div className="quiz-color-style-content">
                                          <span className="quiz-color-style-title">{e.title}</span>
                                          <span className="quiz-color-style-desc">{e.desc}</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Section 4: Option Letter Settings */}
                          <div className={`quiz-global-section option-letter-section ${secOpen.secOptionLetter ? 'active' : ''}`} id="secOptionLetter">
                            <div
                              className="quiz-global-section-header"
                              id="headerSecOptionLetter"
                              onClick={() => toggleSec('secOptionLetter')}
                              title="অপশন অক্ষর সেটিংস"
                            >
                              <div className="quiz-global-section-header-left">
                                <i className="fa-solid fa-arrow-down-a-z" style={{ color: '#0284c7' }}></i>
                                <span>অপশন অক্ষর (Option Letter):</span>
                              </div>
                              <div className="quiz-global-section-header-right">
                                <span className="quiz-font-accordion-badge">
                                  <span className="quiz-font-accordion-badge-text" id="badgeOptionLetter">{badgeOptionLetterText}</span>
                                </span>
                                <i className={`fa-solid fa-${secOpen.secOptionLetter ? 'minus' : 'plus'} quiz-font-accordion-plus-minus`} id="iconSecOptionLetter"></i>
                              </div>
                            </div>

                            <div className="quiz-global-section-body" id="bodySecOptionLetter" style={{ display: secOpen.secOptionLetter ? 'block' : 'none' }}>
                              {[
                                { id: 'bangla', title: 'ক, খ, গ, ঘ', desc: 'বাংলা অপশন লেবেল' },
                                { id: 'english', title: 'A, B, C, D', desc: 'ইংরেজি অপশন লেবেল' },
                                { id: 'english-lower', title: 'a, b, c, d', desc: 'ইংরেজি ছোট হাতের অপশন লেবেল' }
                              ].map((ol) => {
                                const isAct = optionLetter === ol.id;
                                return (
                                  <button
                                    key={ol.id}
                                    type="button"
                                    className={`quiz-layout-menu-item quiz-middle-line-item ${isAct ? 'active' : ''}`}
                                    data-optletter={ol.id}
                                    onClick={() => handleUpdateSetting('optionLetter', ol.id)}
                                  >
                                    <div className="quiz-layout-radio-circle">
                                      {isAct && <div className="quiz-layout-radio-inner"></div>}
                                    </div>
                                    <div className="quiz-middle-line-content">
                                      <span className="quiz-middle-line-title">{ol.title}</span>
                                      <span className="quiz-middle-line-desc">{ol.desc}</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Section 5: Cut Mark (Negative Marking) */}
                          <div className={`quiz-global-section cutmark-section ${secOpen.secCutMark ? 'active' : ''}`} id="secCutMark">
                            <div
                              className="quiz-global-section-header"
                              id="headerSecCutMark"
                              onClick={() => toggleSec('secCutMark')}
                              title="নেগেটিভ মার্কিং / কাট মার্ক সেটিংস"
                            >
                              <div className="quiz-global-section-header-left">
                                <i className="fa-solid fa-pen-ruler" style={{ color: '#ef4444' }}></i>
                                <span>নেগেটিভ মার্কিং (Cut Mark):</span>
                              </div>
                              <div className="quiz-global-section-header-right">
                                <span className="quiz-font-accordion-badge" style={{ color: '#ef4444', borderColor: '#fca5a5', background: '#fef2f2' }}>
                                  <span className="quiz-font-accordion-badge-text" id="badgeCutMark">
                                    {cutMark === 0 ? '০ নম্বর' : `${toBengaliNumber(cutMark)} নম্বর`}
                                  </span>
                                </span>
                                <i className={`fa-solid fa-${secOpen.secCutMark ? 'minus' : 'plus'} quiz-font-accordion-plus-minus`} id="iconSecCutMark"></i>
                              </div>
                            </div>

                            <div className="quiz-global-section-body" id="bodySecCutMark" style={{ display: secOpen.secCutMark ? 'block' : 'none' }}>
                              {[
                                { val: 0.5, label: '০.৫ নম্বর কাটা যাবে (ডিফল্ট)' },
                                { val: 0.25, label: '০.২৫ নম্বর কাটা যাবে' },
                                { val: 0, label: 'No Cut Mark (০ নম্বর)' }
                              ].map((cm) => {
                                const isAct = cutMarkMode === String(cm.val);
                                return (
                                  <button
                                    key={cm.val}
                                    type="button"
                                    className={`quiz-layout-menu-item ${isAct ? 'active' : ''}`}
                                    data-cutmark={cm.val}
                                    onClick={() => handleUpdateSetting('cutMark', cm.val)}
                                  >
                                    <div className="quiz-layout-radio-circle">
                                      {isAct && <div className="quiz-layout-radio-inner"></div>}
                                    </div>
                                    <span>{cm.label}</span>
                                  </button>
                                );
                              })}

                              <div className="quiz-cut-mark-custom-card">
                                <div className="quiz-cut-mark-custom-header">
                                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>কাস্টম কাট মার্ক:</span>
                                  {cutMarkMode === 'custom' && (
                                    <span className="quiz-cut-mark-badge" id="badgeCustomCutMarkActive" style={{ display: 'inline-block' }}>
                                      সক্রিয়: {toBengaliNumber(cutMark)}
                                    </span>
                                  )}
                                </div>
                                <div className="quiz-cut-mark-input-row">
                                  <input
                                    type="number"
                                    step="0.05"
                                    min="0"
                                    max="10"
                                    id="inputCustomCutMark"
                                    placeholder="যেমন: 0.20 বা 1"
                                    className="quiz-cut-mark-input"
                                    value={customCutMarkInput}
                                    onChange={(e) => setCustomCutMarkInput(e.target.value)}
                                  />
                                  <button
                                    type="button"
                                    id="btnApplyCustomCutMark"
                                    className="quiz-cut-mark-apply-btn"
                                    onClick={() => {
                                      const val = parseFloat(customCutMarkInput);
                                      if (!isNaN(val) && val >= 0) {
                                        handleUpdateSetting('cutMarkCustom', val);
                                      }
                                    }}
                                  >
                                    সেট করুন
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Section 6: Font Settings */}
                          <div className={`quiz-global-section font-section ${secOpen.secFont ? 'active' : ''}`} id="secFont">
                            <div
                              className="quiz-global-section-header"
                              id="headerSecFont"
                              onClick={() => toggleSec('secFont')}
                              title="ফন্ট সেটিংস"
                            >
                              <div className="quiz-global-section-header-left">
                                <i className="fa-solid fa-font" style={{ color: '#0284c7' }}></i>
                                <span>ফন্ট সেটিংস (Font):</span>
                              </div>
                              <div className="quiz-global-section-header-right">
                                <span className="quiz-font-accordion-badge">
                                  <span className="quiz-font-accordion-badge-text">৩টি অপশন</span>
                                </span>
                                <i className={`fa-solid fa-${secOpen.secFont ? 'minus' : 'plus'} quiz-font-accordion-plus-minus`} id="iconSecFont"></i>
                              </div>
                            </div>

                            <div className="quiz-global-section-body" id="bodySecFont" style={{ display: secOpen.secFont ? 'block' : 'none' }}>
                              {/* Sub-Accordion 1: ফন্ট সাইজ */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpFontSize ? 'active' : ''}`} id="subGrpFontSize">
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpFontSize ? 'active' : ''}`}
                                  id="headerSubGrpFontSize"
                                  onClick={() => toggleSubSec('subGrpFontSize')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-text-height" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>ফন্ট সাইজ:</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeFontSize">{fontSize} px</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpFontSize ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpFontSize"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpFontSize" style={{ display: subSecOpen.subGrpFontSize ? 'block' : 'none' }}>
                                  <div className="quiz-font-size-pills">
                                    {[14, 15, 16].map((sz) => (
                                      <button
                                        key={sz}
                                        type="button"
                                        className={`quiz-font-size-pill ${fontSize === sz ? 'active' : ''}`}
                                        data-fontsize={sz}
                                        onClick={() => handleUpdateSetting('fontSize', sz)}
                                      >
                                        {sz} px {sz === 16 ? '(ডিফল্ট)' : ''}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="quiz-font-size-pills">
                                    {[17, 18, 19, 20].map((sz) => (
                                      <button
                                        key={sz}
                                        type="button"
                                        className={`quiz-font-size-pill ${fontSize === sz ? 'active' : ''}`}
                                        data-fontsize={sz}
                                        onClick={() => handleUpdateSetting('fontSize', sz)}
                                      >
                                        {sz} px
                                      </button>
                                    ))}
                                  </div>

                                  <div className="quiz-font-custom-section">
                                    <div className="quiz-font-custom-header">
                                      <span>কাস্টম সাইজ (১০ - ৩৬ px):</span>
                                      {![14, 15, 16, 17, 18, 19, 20].includes(fontSize) && (
                                        <span className="quiz-font-badge" id="badgeCustomFontActive" style={{ display: 'inline-block' }}>
                                          সক্রিয়: {toBengaliNumber(fontSize)} px
                                        </span>
                                      )}
                                    </div>
                                    <div className="quiz-font-custom-size-row">
                                      <input
                                        type="number"
                                        min="10"
                                        max="36"
                                        id="inputCustomFontSize"
                                        placeholder="যেমন: 22"
                                        className="quiz-font-input"
                                        value={customFontInput}
                                        onChange={(e) => setCustomFontInput(e.target.value)}
                                      />
                                      <button
                                        type="button"
                                        id="btnApplyCustomFontSize"
                                        className="quiz-font-apply-btn"
                                        onClick={() => {
                                          const val = parseInt(customFontInput, 10);
                                          if (!isNaN(val) && val >= 10 && val <= 36) {
                                            handleUpdateSetting('fontSize', val);
                                          }
                                        }}
                                      >
                                        সেট করুন
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Sub-Accordion 2: ফন্ট ফ্যামিলি */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpFontFamily ? 'active' : ''}`} id="subGrpFontFamily" style={{ marginTop: '8px' }}>
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpFontFamily ? 'active' : ''}`}
                                  id="headerSubGrpFontFamily"
                                  onClick={() => toggleSubSec('subGrpFontFamily')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-paragraph" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>ফন্ট ফ্যামিলি:</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeFontFamily">{badgeFontFamilyText}</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpFontFamily ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpFontFamily"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpFontFamily" style={{ display: subSecOpen.subGrpFontFamily ? 'block' : 'none' }}>
                                  <div className="quiz-font-family-list" id="fontFamilyListContainer">
                                    {FONT_FAMILIES.map((item) => {
                                      const isAct = fontFamily === item.family;
                                      return (
                                        <button
                                          key={item.id}
                                          type="button"
                                          className={`quiz-layout-menu-item ${isAct ? 'active' : ''}`}
                                          data-fontfamily={item.family}
                                          style={{ fontFamily: item.family }}
                                          onClick={() => handleUpdateSetting('fontFamily', item.family)}
                                        >
                                          <div className="quiz-layout-radio-circle">
                                            {isAct && <div className="quiz-layout-radio-inner"></div>}
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.name}</span>
                                            <span style={{ fontSize: '11px', color: '#64748b' }}>{item.sub}</span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              {/* Sub-Accordion 3: ফন্ট ওয়েট */}
                              <div className={`quiz-font-sub-group ${subSecOpen.subGrpFontWeight ? 'active' : ''}`} id="subGrpFontWeight" style={{ marginTop: '8px' }}>
                                <div
                                  className={`quiz-font-accordion-header quiz-font-sub-header ${subSecOpen.subGrpFontWeight ? 'active' : ''}`}
                                  id="headerSubGrpFontWeight"
                                  onClick={() => toggleSubSec('subGrpFontWeight')}
                                >
                                  <div className="quiz-font-accordion-header-left">
                                    <i className="fa-solid fa-bold" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>ফন্ট ওয়েট:</span>
                                  </div>
                                  <div className="quiz-font-accordion-header-right">
                                    <span className="quiz-font-accordion-badge" style={{ fontSize: '11px' }}>
                                      <span className="quiz-font-accordion-badge-text" id="badgeFontWeight">{badgeFontWeightText}</span>
                                    </span>
                                    <i className={`fa-solid fa-chevron-${subSecOpen.subGrpFontWeight ? 'up' : 'down'} quiz-font-accordion-chevron`} id="chevronSubGrpFontWeight"></i>
                                  </div>
                                </div>
                                <div className="quiz-global-sub-card" id="bodySubGrpFontWeight" style={{ display: subSecOpen.subGrpFontWeight ? 'block' : 'none' }}>
                                  <div className="quiz-font-family-list" id="fontWeightListContainer">
                                    {FONT_WEIGHTS.map((item) => {
                                      const isAct = fontWeight === item.value;
                                      return (
                                        <button
                                          key={item.id}
                                          type="button"
                                          className={`quiz-layout-menu-item ${isAct ? 'active' : ''}`}
                                          data-fontweight={item.value}
                                          onClick={() => handleUpdateSetting('fontWeight', item.value)}
                                        >
                                          <div className="quiz-layout-radio-circle">
                                            {isAct && <div className="quiz-layout-radio-inner"></div>}
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <span style={{ fontSize: '13px', fontWeight: item.weight }}>{item.name}</span>
                                            <span style={{ fontSize: '11px', color: '#64748b' }}>{item.sub}</span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '28px', color: '#007bff', marginBottom: '14px' }}></i>
            <p style={{ fontWeight: 600, fontSize: '15px' }}>প্রশ্নসমূহ লোড হচ্ছে...</p>
          </div>
        )}

        {/* Questions Rendering Area */}
        {!loading && (
          <div id="questionsContainerArea">
            {renderQuestionsContent()}
          </div>
        )}

        {/* Result Section (Shown after completing all questions) */}
        {!loading && (examSubmitted || (displayQuestions.length > 0 && answeredTotal === displayQuestions.length && !isReviewWrongMode)) && activeMode !== 'read' && (
          <div id="resultSection" className="quiz-result-section" style={{ display: 'block' }}>
            <h2>পরীক্ষার ফলাফল</h2>
            <div className="quiz-detailed-stats">
              সঠিক উত্তর: <span className="quiz-correct-count" id="statCorrect">{toBengaliNumber(correctCount)}</span> টি
              &nbsp;&nbsp;|&nbsp;&nbsp;
              ভুল উত্তর: <span className="quiz-incorrect-count" id="statIncorrect">{toBengaliNumber(incorrectCount)}</span> টি
              &nbsp;&nbsp;|&nbsp;&nbsp;
              উত্তর দেওয়া হয়নি: <span id="statUnanswered">{toBengaliNumber(Math.max(0, questionsTotal - (correctCount + incorrectCount)))}</span> টি
            </div>

            {/* Progress Bar with Interactive Percentage */}
            <div className="quiz-progress-bar-container">
              <div
                id="progressCorrectBar"
                className="quiz-progress-correct"
                style={{ width: `${questionsTotal > 0 ? (correctCount / questionsTotal) * 100 : 0}%` }}
              >
                {questionsTotal > 0 && (correctCount / questionsTotal) >= 0.08 ? `${Math.round((correctCount / questionsTotal) * 100)}%` : ''}
              </div>
              <div
                id="progressIncorrectBar"
                className="quiz-progress-incorrect"
                style={{ width: `${questionsTotal > 0 ? (incorrectCount / questionsTotal) * 100 : 0}%` }}
              >
                {questionsTotal > 0 && (incorrectCount / questionsTotal) >= 0.08 ? `${Math.round((incorrectCount / questionsTotal) * 100)}%` : ''}
              </div>
              <div
                id="progressUnansweredBar"
                className="quiz-progress-unanswered"
                style={{ width: `${questionsTotal > 0 ? (Math.max(0, questionsTotal - (correctCount + incorrectCount)) / questionsTotal) * 100 : 100}%` }}
              >
              </div>
            </div>

            <div id="finalScoreDisplay" style={{ fontSize: '17px', fontWeight: 'bold', marginTop: '15px', color: '#2c3e50' }}>
              আপনার মোট প্রাপ্ত স্কোর: <span id="finalScoreVal">{formatScore(score)}</span>
            </div>

            {/* Result Action Buttons */}
            <div className="quiz-result-actions">
              {incorrectCount > 0 && (
                <>
                  <button type="button" className="quiz-result-btn btn-view-wrong" id="btnResultViewWrong" onClick={handleReviewWrong}>
                    <i className="fa-solid fa-eye"></i> ভুল উত্তর দেখুন
                  </button>
                  <button type="button" className="quiz-result-btn btn-retake-wrong" id="btnResultRetakeWrong" onClick={handleRetakeWrong}>
                    <i className="fa-solid fa-pen-to-square"></i> ভুল উত্তরের ওপর পরীক্ষা দিন
                  </button>
                </>
              )}
              <button type="button" className="quiz-result-btn btn-retake-all" id="btnResultRetakeAll" onClick={handleRestart}>
                <i className="fa-solid fa-rotate-right"></i> পুনরায় সম্পূর্ণ পরীক্ষা দিন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating AI Launcher Trigger Button (Bottom Right) */}
      <button
        type="button"
        className="ai-floating-trigger-btn"
        id="btnFloatingAi"
        onClick={() => setAiChatOpen(true)}
        title="TopMCQBD AI শিক্ষক"
      >
        <img src="/images/logo-white-icon.png" alt="AI" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
        <span className="ai-floating-pulse"></span>
      </button>

      {/* AI Chat Popup Overlay & Window */}
      {aiChatOpen && (
        <div id="aiChatOverlay" className="ai-chat-popup-overlay" style={{ display: 'block' }}>
          <div className="ai-chat-popup-window">
            <div className="ai-chat-header">
              <div className="ai-chat-header-info">
                <div className="ai-avatar-badge">
                  <img src="/images/logo-white-icon.png" alt="AI" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                  <span className="ai-online-indicator"></span>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>TopMCQBD AI শিক্ষক</h4>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>সবসময় সহায়তার জন্য প্রস্তুত</p>
                </div>
              </div>
              <div className="ai-chat-header-actions">
                <button
                  type="button"
                  className="ai-btn-icon"
                  id="btnClearAiChat"
                  onClick={() => setAiMessages([
                    {
                      sender: 'ai',
                      text: 'আমি **TopMCQBD AI শিক্ষক**।\nযে কোনো প্রশ্নের পাশে থাকা **"Ask AI"** বাটনে চাপুন অথবা নিচে আপনার প্রশ্নটি লিখে পাঠান — আমি উত্তর ও ব্যাখ্যা বুঝিয়ে দেব।'
                    }
                  ])}
                  title="নতুন চ্যাট শুরু করুন"
                >
                  <i className="fa-solid fa-rotate-left"></i>
                </button>
                <button
                  type="button"
                  className="ai-btn-icon"
                  id="btnCloseAiChat"
                  onClick={() => setAiChatOpen(false)}
                  title="বন্ধ করুন"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="ai-chat-body" id="aiChatBody">
              {aiMessages.map((msg, mIdx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={mIdx} className={`ai-message-row ${isUser ? 'user' : ''}`}>
                    {!isUser && (
                      <div className="ai-msg-avatar">
                        <i className="fa-solid fa-robot"></i>
                      </div>
                    )}
                    <div className="ai-message-bubble-wrapper">
                      <div className={`ai-message-bubble ${isUser ? 'user' : 'ai'}`}>
                        {msg.text.split('\n').map((line, lIdx) => {
                          const trimmed = line.trim();
                          if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
                            return (
                              <div key={lIdx} className="ai-msg-heading">
                                <strong>{trimmed.replace(/^#+\s*/, '')}</strong>
                              </div>
                            );
                          }
                          if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ')) {
                            return (
                              <div key={lIdx} className="ai-msg-bullet">
                                <i className="fa-solid fa-circle ai-bullet-dot"></i>
                                <span>{trimmed.replace(/^[•\-\*]\s*/, '')}</span>
                              </div>
                            );
                          }
                          if (trimmed === '') {
                            return <div key={lIdx} className="ai-msg-spacer"></div>;
                          }
                          return (
                            <div key={lIdx} className="ai-msg-paragraph">
                              {trimmed}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Chips */}
            <div className="ai-quick-chips">
              <button
                type="button"
                onClick={() => {
                  setAiInputText('এই প্রশ্নের সঠিক উত্তর ও ব্যাখ্যা কী?');
                  handleSendAiMessage();
                }}
              >
                সঠিক উত্তর ও ব্যাখ্যা
              </button>
              <button
                type="button"
                onClick={() => {
                  setAiInputText('বাকি ৩টি অপশন কেন ভুল?');
                  handleSendAiMessage();
                }}
              >
                ভুল অপশন বিশ্লেষণ
              </button>
              <button
                type="button"
                onClick={() => {
                  setAiInputText('এই সম্পর্কিত গুরুত্বপূর্ণ তথ্য দিন');
                  handleSendAiMessage();
                }}
              >
                গুরুত্বপূর্ণ তথ্য
              </button>
            </div>

            {/* Chat Input Footer */}
            <div style={{ padding: '10px 12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                id="aiInputText"
                placeholder="প্রশ্ন লিখুন বা জিজ্ঞাসা করুন..."
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendAiMessage();
                }}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
              />
              <button
                type="button"
                id="btnSendAi"
                onClick={handleSendAiMessage}
                style={{ background: '#1666e2', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0 14px', fontWeight: 600, cursor: 'pointer' }}
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuestionBankSmartQuestionsPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '32px', color: '#007bff' }}></i>
        <p style={{ marginTop: '16px', fontWeight: 600 }}>লোড হচ্ছে...</p>
      </div>
    }>
      <QuestionBankSmartQuestionsContent />
    </Suspense>
  );
}
