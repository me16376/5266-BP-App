'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import * as XLSX from 'xlsx';
import { convertBijoyToUnicode, looksLikeBijoy, shouldConvertAsBijoy } from 'bijoy2unicode';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Search, 
  Timer, 
  Award, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  RotateCcw, 
  Printer, 
  Download, 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  Flag, 
  Bookmark, 
  Check, 
  ChevronRight, 
  Type, 
  Wand2, 
  Sliders, 
  Play, 
  FileCode, 
  FileText, 
  Sparkles,
  RefreshCw,
  Eye,
  Info,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Minimize2,
  Copy
} from 'lucide-react';
import { saveTestResult } from '../lib/storage';
import FormattedContent from './FormattedContent';

const OPTION_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];

const BANGLA_FONTS = [
  { id: 'hind', name: 'হিন্দ শিলিগুড়ি (Hind Siliguri)', family: "'Hind Siliguri', sans-serif", badge: 'ডিফল্ট' },
  { id: 'kalpurush', name: 'কালপুরুষ (Kalpurush / Classic)', family: "'Kalpurush', 'SolaimanLipi', 'Hind Siliguri', sans-serif", badge: 'জনপ্রিয়' },
  { id: 'solaiman', name: 'সোলাইমান লিপি (SolaimanLipi)', family: "'SolaimanLipi', 'Kalpurush', 'Hind Siliguri', sans-serif", badge: 'ক্লিন' },
  { id: 'nikosh', name: 'নিকোশ (Nikosh / Govt)', family: "'Nikosh', 'SolaimanLipi', 'Hind Siliguri', sans-serif", badge: 'সরকারি' },
  { id: 'noto', name: 'নোটো সান্স বাংলা (Noto Sans)', family: "'Noto Sans Bengali', sans-serif", badge: 'আধুনিক' },
  { id: 'anek', name: 'আনেক বাংলা (Anek Bangla)', family: "'Anek Bangla', sans-serif", badge: 'স্টাইলিশ' },
  { id: 'tiro', name: 'তিরো বাংলা (Tiro Bangla)', family: "'Tiro Bangla', serif", badge: 'সেরিফ' },
  { id: 'serif', name: 'নোটো সেরিফ বাংলা (Noto Serif)', family: "'Noto Serif Bengali', serif", badge: 'বইয়ের ফন্ট' }
];

const FONT_ASSETS_HTML = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link rel="preconnect" href="https://fonts.maateen.me" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;600;700&family=Hind+Siliguri:wght@400;600;700&family=Noto+Sans+Bengali:wght@400;600;700&family=Noto+Serif+Bengali:wght@400;600;700&family=Tiro+Bangla&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet">
  <link href="https://fonts.maateen.me/solaiman-lipi/font.css" rel="stylesheet">
  <link href="https://fonts.maateen.me/nikosh/font.css" rel="stylesheet">
  <style>
    @font-face {
      font-family: 'Kalpurush';
      font-display: swap;
      font-style: normal;
      font-weight: 100 900;
      src: local('Kalpurush'),
           url('https://fonts.maateen.me/kalpurush/Kalpurush-v0.258.woff2') format('woff2'),
           url('https://fonts.maateen.me/kalpurush/Kalpurush-v0.258.ttf') format('truetype');
    }
    @font-face {
      font-family: 'SolaimanLipi';
      font-display: swap;
      font-style: normal;
      font-weight: 400;
      src: local('SolaimanLipi'),
           url('https://fonts.maateen.me/solaiman-lipi/solaimanlipi-normal-v1.0.woff2') format('woff2'),
           url('https://fonts.maateen.me/solaiman-lipi/solaimanlipi-normal-v1.0.ttf') format('truetype');
    }
    @font-face {
      font-family: 'SolaimanLipi';
      font-display: swap;
      font-style: normal;
      font-weight: 700;
      src: local('SolaimanLipi Bold'),
           url('https://fonts.maateen.me/solaiman-lipi/solaimanlipi-bold-v1.0.woff2') format('woff2'),
           url('https://fonts.maateen.me/solaiman-lipi/solaimanlipi-bold-v1.0.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Nikosh';
      font-display: swap;
      font-style: normal;
      font-weight: 100 900;
      src: local('Nikosh'),
           url('https://fonts.maateen.me/nikosh/nikosh-v1.0.woff2') format('woff2'),
           url('https://fonts.maateen.me/nikosh/nikosh-v1.0.ttf') format('truetype');
    }
  </style>
`;

const TRIGGER_PRINT_SCRIPT = `
  <script>
    async function triggerPrint() {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch (e) {
        console.warn('Font load wait warning:', e);
      }
      setTimeout(function() {
        window.print();
      }, 350);
    }
    if (document.readyState === 'complete') {
      triggerPrint();
    } else {
      window.addEventListener('load', triggerPrint);
    }
  </script>
`;

// Helper to normalize question objects from various CSV/JSON keys
function normalizeQuestion(rawItem, index) {
  if (!rawItem || typeof rawItem !== 'object') return null;

  const keys = Object.keys(rawItem);
  const findVal = (possibleKeys) => {
    for (const pk of possibleKeys) {
      const matchKey = keys.find(k => k.trim().toLowerCase() === pk.toLowerCase());
      if (matchKey && rawItem[matchKey] !== undefined && rawItem[matchKey] !== null) {
        return String(rawItem[matchKey]).trim();
      }
    }
    return '';
  };

  // 1. Question Text
  let questionText = findVal([
    'question', 'q', 'title', 'question_text', 'questiontext', 'mcq',
    'প্রশ্ন', 'প্রশ্নপত্র', 'কুইজ', 'টেক্সট'
  ]);
  if (!questionText) {
    const firstStr = Object.values(rawItem).find(v => typeof v === 'string' && v.trim().length > 10);
    if (firstStr) questionText = firstStr.trim();
  }
  if (!questionText) return null;

  // 2. Options Extraction
  let options = [];

  const directOptions = rawItem.options || rawItem.choices || rawItem.বিকল্প;
  if (Array.isArray(directOptions)) {
    options = directOptions.map(o => String(o).trim()).filter(Boolean);
  }

  if (options.length === 0) {
    const optA = findVal(['a', 'option_a', 'optiona', 'opt_a', 'opta', 'option1', 'opt1', 'ক', 'অপশন_ক', 'ক)']);
    const optB = findVal(['b', 'option_b', 'optionb', 'opt_b', 'optb', 'option2', 'opt2', 'খ', 'অপশন_খ', 'খ)']);
    const optC = findVal(['c', 'option_c', 'optionc', 'opt_c', 'optc', 'option3', 'opt3', 'গ', 'অপশন_গ', 'গ)']);
    const optD = findVal(['d', 'option_d', 'optiond', 'opt_d', 'optd', 'option4', 'opt4', 'ঘ', 'অপশন_ঘ', 'ঘ)']);
    const optE = findVal(['e', 'option_e', 'optione', 'opt_e', 'opte', 'option5', 'opt5', 'ঙ', 'অপশন_ঙ', 'ঙ)']);

    if (optA || optB) {
      if (optA) options.push(optA);
      if (optB) options.push(optB);
      if (optC) options.push(optC);
      if (optD) options.push(optD);
      if (optE) options.push(optE);
    }
  }

  if (options.length === 0) {
    const rawOptionsStr = findVal(['options', 'choices', 'বিকল্প', 'অপশন']);
    if (rawOptionsStr) {
      if (rawOptionsStr.includes('|')) {
        options = rawOptionsStr.split('|').map(s => s.trim()).filter(Boolean);
      } else if (rawOptionsStr.includes('\n')) {
        options = rawOptionsStr.split('\n').map(s => s.trim()).filter(Boolean);
      } else if (rawOptionsStr.includes(',')) {
        options = rawOptionsStr.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
  }

  // 3. Correct Answer
  let rawAns = findVal([
    'correct_answer', 'correctanswer', 'answer', 'ans', 'correct', 'right_answer',
    'সঠিক উত্তর', 'সঠিক_উত্তর', 'উত্তর', 'সঠিক'
  ]);

  let correctAnswer = rawAns;

  const cleanAns = rawAns.toLowerCase().replace(/[\(\)\.\,\s]/g, '');
  if (cleanAns === 'a' || cleanAns === '1' || cleanAns === 'ক') {
    correctAnswer = options[0] || rawAns;
  } else if (cleanAns === 'b' || cleanAns === '2' || cleanAns === 'খ') {
    correctAnswer = options[1] || rawAns;
  } else if (cleanAns === 'c' || cleanAns === '3' || cleanAns === 'গ') {
    correctAnswer = options[2] || rawAns;
  } else if (cleanAns === 'd' || cleanAns === '4' || cleanAns === 'ঘ') {
    correctAnswer = options[3] || rawAns;
  } else if (cleanAns === 'e' || cleanAns === '5' || cleanAns === 'ঙ') {
    correctAnswer = options[4] || rawAns;
  }

  // 4. Explanation
  const explanation = findVal([
    'explanation', 'explain', 'solution', 'details', 'note',
    'ব্যাখ্যা', 'সমাধান', 'নোট', 'মন্তব্য'
  ]);

  // 5. Subject
  const subject = findVal([
    'subject', 'category', 'topic', 'tag', 'department',
    'বিষয়', 'টপিক', 'ক্যাটাগরি'
  ]) || 'সাধারণ জ্ঞান ও বিষয়াবলি';

  return {
    id: index,
    question: questionText,
    options,
    correct_answer: correctAnswer,
    explanation,
    subject
  };
}

// Convert question items from Bijoy to Unicode
function convertQuestionListToUnicode(questions) {
  return questions.map(q => ({
    ...q,
    question: shouldConvertAsBijoy(q.question) ? convertBijoyToUnicode(q.question) : q.question,
    options: q.options.map(opt => shouldConvertAsBijoy(opt) ? convertBijoyToUnicode(opt) : opt),
    correct_answer: shouldConvertAsBijoy(q.correct_answer) ? convertBijoyToUnicode(q.correct_answer) : q.correct_answer,
    explanation: q.explanation && shouldConvertAsBijoy(q.explanation) ? convertBijoyToUnicode(q.explanation) : q.explanation,
    subject: q.subject && shouldConvertAsBijoy(q.subject) ? convertBijoyToUnicode(q.subject) : q.subject
  }));
}

export default function FileExamStudio({ initialExamSlug = null }) {
  const searchParams = useSearchParams();
  const examSlugFromUrl = searchParams ? searchParams.get('exam') : null;
  const effectiveExamSlug = initialExamSlug || examSlugFromUrl;

  // Step state: 'setup' | 'exam' | 'result'
  const [step, setStep] = useState('setup');

  // File metadata & parsed questions
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [examTitle, setExamTitle] = useState('মডেল টেস্ট কুইজ');
  const [questions, setQuestions] = useState([]);
  const [rawQuestions, setRawQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Bijoy support
  const [bijoyDetected, setBijoyDetected] = useState(false);
  const [isBijoyConverted, setIsBijoyConverted] = useState(false);

  // Typography
  const [selectedFontId, setSelectedFontId] = useState('hind');
  const activeFont = useMemo(() => {
    return BANGLA_FONTS.find(f => f.id === selectedFontId) || BANGLA_FONTS[0];
  }, [selectedFontId]);

  // Exam Configuration Settings
  const [examMode, setExamMode] = useState('exam'); // 'exam' (live test) | 'practice' (instant feedback)
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [negativeMarks, setNegativeMarks] = useState(0.25); // 0, 0.20, 0.25, 0.50

  // Table sorting, pagination & typography controls (matching /file-studio/)
  const [tableSearch, setTableSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [fontSize, setFontSize] = useState(15);
  const [lineHeight, setLineHeight] = useState('1.7');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const filteredTableQuestions = useMemo(() => {
    if (!tableSearch.trim()) return questions;
    const term = tableSearch.trim().toLowerCase();
    return questions.filter((q, idx) => {
      const qText = (q.question || '').toLowerCase();
      const ansText = (q.correct_answer || '').toLowerCase();
      const expText = (q.explanation || '').toLowerCase();
      const subText = (q.subject || '').toLowerCase();
      const optsText = (q.options || []).join(' ').toLowerCase();
      return (
        qText.includes(term) ||
        ansText.includes(term) ||
        expText.includes(term) ||
        subText.includes(term) ||
        optsText.includes(term) ||
        String(idx + 1).includes(term)
      );
    });
  }, [questions, tableSearch]);

  const sortedQuestions = useMemo(() => {
    if (!sortConfig.key) return filteredTableQuestions;
    const sorted = [...filteredTableQuestions];
    sorted.sort((a, b) => {
      let valA = '';
      let valB = '';
      if (sortConfig.key === 'question') {
        valA = a.question || '';
        valB = b.question || '';
      } else if (sortConfig.key === 'optA') {
        valA = (a.options && a.options[0]) || '';
        valB = (b.options && b.options[0]) || '';
      } else if (sortConfig.key === 'optB') {
        valA = (a.options && a.options[1]) || '';
        valB = (b.options && b.options[1]) || '';
      } else if (sortConfig.key === 'optC') {
        valA = (a.options && a.options[2]) || '';
        valB = (b.options && b.options[2]) || '';
      } else if (sortConfig.key === 'optD') {
        valA = (a.options && a.options[3]) || '';
        valB = (b.options && b.options[3]) || '';
      } else if (sortConfig.key === 'answer') {
        valA = a.correct_answer || '';
        valB = b.correct_answer || '';
      } else if (sortConfig.key === 'explanation') {
        valA = a.explanation || '';
        valB = b.explanation || '';
      }
      return sortConfig.direction === 'asc'
        ? String(valA).localeCompare(String(valB), 'bn')
        : String(valB).localeCompare(String(valA), 'bn');
    });
    return sorted;
  }, [filteredTableQuestions, sortConfig]);

  const totalPages = Math.ceil(sortedQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedQuestions.slice(start, start + pageSize);
  }, [sortedQuestions, currentPage, pageSize]);

  // Export Table to PDF (High Quality Print-to-PDF matching /file-studio/)
  const exportTableToPdf = () => {
    if (!questions || questions.length === 0) return;

    const rowsHtml = sortedQuestions.map((q, idx) => {
      const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      const optA = q.options && q.options[0] ? q.options[0] : '—';
      const optB = q.options && q.options[1] ? q.options[1] : '—';
      const optC = q.options && q.options[2] ? q.options[2] : '—';
      const optD = q.options && q.options[3] ? q.options[3] : '—';
      return `
        <tr style="background: ${bg};">
          <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; color: #64748b; font-size: 11px;">${idx + 1}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 10px; font-weight: 600;">${q.question}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">${optA}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">${optB}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">${optC}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">${optD}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 8px; font-weight: bold; color: #065f46; background: #ecfdf5;">${q.correct_answer || '—'}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 11px; color: #475569;">${q.explanation || '—'}</td>
        </tr>
      `;
    }).join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('পপ-আপ উইন্ডো ব্লক করা আছে। অনুগ্রহ করে ব্রাউজারের পপ-আপ অ্যালাউ করুন।');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="bn">
        <head>
          <meta charset="utf-8">
          <title>${examTitle} - PDF Export</title>
          ${FONT_ASSETS_HTML}
          <style>
            body {
              font-family: ${activeFont.family};
              padding: 24px;
              color: #0f172a;
              margin: 0;
              font-size: ${fontSize}px;
              line-height: ${lineHeight};
            }
            * {
              font-family: inherit !important;
            }
            .header-bar {
              border-bottom: 2px solid #059669;
              padding-bottom: 12px;
              margin-bottom: 16px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .title { font-size: 20px; font-weight: bold; color: #047857; margin: 0; }
            .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; font-size: ${Math.max(11, fontSize - 3)}px; margin-top: 10px; }
            th { border: 1px solid #cbd5e1; padding: 8px 10px; background: #f1f5f9; font-weight: bold; text-align: left; }
            @media print {
              body { padding: 0; }
              @page { size: auto; margin: 10mm; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <div>
              <h1 class="title">${examTitle}</h1>
              <div class="meta">ফাইল: <strong>${fileName || 'mcq_file'}</strong> | ফন্ট: <strong>${activeFont.name}</strong> | মোট প্রশ্ন: <strong>${questions.length}</strong> টি | তারিখ: ${new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="text-align: center; width: 40px;">#</th>
                <th>প্রশ্ন</th>
                <th>ক</th>
                <th>খ</th>
                <th>গ</th>
                <th>ঘ</th>
                <th>সঠিক উত্তর</th>
                <th>ব্যাখ্যা</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          ${TRIGGER_PRINT_SCRIPT}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Export to CSV
  const exportToCsv = () => {
    if (!questions || questions.length === 0) return;
    const data = questions.map((q, i) => ({
      'ক্র.নং': i + 1,
      'প্রশ্ন': q.question,
      'ক': q.options && q.options[0] ? q.options[0] : '',
      'খ': q.options && q.options[1] ? q.options[1] : '',
      'গ': q.options && q.options[2] ? q.options[2] : '',
      'ঘ': q.options && q.options[3] ? q.options[3] : '',
      'সঠিক উত্তর': q.correct_answer || '',
      'ব্যাখ্যা': q.explanation || '',
      'বিষয়': q.subject || ''
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName ? fileName.split('.')[0] : 'mcq_questions'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export to JSON
  const exportToJson = () => {
    if (!questions || questions.length === 0) return;
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName ? fileName.split('.')[0] : 'mcq_questions'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Active Exam State
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: selectedOptionText }
  const [flaggedQuestions, setFlaggedQuestions] = useState({}); // { [qId]: true }
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(1800);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  // Results state
  const [testResult, setTestResult] = useState(null);
  const [showExplanationCard, setShowExplanationCard] = useState({}); // For practice mode

  // Ensure font stylesheets are dynamically loaded into document.head
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const fontUrls = [
      'https://fonts.maateen.me/kalpurush/font.css',
      'https://fonts.maateen.me/solaiman-lipi/font.css',
      'https://fonts.maateen.me/nikosh/font.css'
    ];
    fontUrls.forEach(url => {
      if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
      }
    });
  }, []);

  // Handle URL pre-loaded exam if query param is passed
  useEffect(() => {
    if (effectiveExamSlug) {
      setLoading(true);
      import('../lib/examsData').then(({ loadExamQuestions }) => {
        loadExamQuestions(effectiveExamSlug).then(res => {
          if (res && res.questions && res.questions.length > 0) {
            setFileName(`${res.exam.slug}.json`);
            setFileSize(`${(res.questions.length * 0.4).toFixed(1)} KB`);
            setExamTitle(res.exam.title || 'মডেল টেস্ট');
            setQuestions(res.questions);
            setRawQuestions(res.questions);
            setDurationMinutes(Math.min(120, Math.max(15, Math.ceil(res.questions.length * 0.8))));
          }
          setLoading(false);
        }).catch(err => {
          console.error(err);
          setLoading(false);
        });
      });
    }
  }, [effectiveExamSlug]);

  // Process File Upload (CSV, JSON, XLSX, XLS)
  const processUploadFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setBijoyDetected(false);
    setIsBijoyConverted(false);

    const name = file.name;
    const size = (file.size / 1024).toFixed(1) + ' KB';
    const ext = name.split('.').pop().toLowerCase();
    const cleanTitle = name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    setFileName(name);
    setFileSize(size);
    setExamTitle(cleanTitle);

    try {
      let parsedItems = [];

      if (ext === 'json') {
        const text = await file.text();
        let jsonData;
        try {
          jsonData = JSON.parse(text);
        } catch (e) {
          throw new Error('JSON ফাইলটি সঠিকভাবে ফরম্যাট করা নয়: ' + e.message);
        }

        if (Array.isArray(jsonData)) {
          parsedItems = jsonData;
        } else if (typeof jsonData === 'object' && jsonData !== null) {
          if (Array.isArray(jsonData.questions)) {
            parsedItems = jsonData.questions;
            if (jsonData.title) setExamTitle(jsonData.title);
          } else if (Array.isArray(jsonData.data)) {
            parsedItems = jsonData.data;
          } else {
            parsedItems = Object.values(jsonData).filter(v => typeof v === 'object' && v !== null);
          }
        }
      } else if (['csv', 'xlsx', 'xls'].includes(ext)) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array', codepage: 65001 });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('ফাইলে কোনো তথ্য পাওয়া যায়নি।');
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        parsedItems = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      } else {
        throw new Error('অনুগ্রহ করে .csv, .json অথবা .xlsx ফরম্যাটের ফাইল নির্বাচন করুন।');
      }

      if (!parsedItems || parsedItems.length === 0) {
        throw new Error('ফাইলটিতে কোনো MCQ বা প্রশ্নের ডাটা পাওয়া যায়নি।');
      }

      const normalized = parsedItems.map((item, idx) => normalizeQuestion(item, idx)).filter(Boolean);

      if (normalized.length === 0) {
        throw new Error('ফাইলে প্রশ্ন খুঁজে পাওয়া যায়নি। অনুগ্রহ করে কলামের নাম যেমন question, options, answer অথবা প্রশ্ন, ক, খ, গ, ঘ, সঠিক উত্তর রয়েছে কি না যাচাই করুন।');
      }

      const hasBijoy = normalized.slice(0, 10).some(q => 
        shouldConvertAsBijoy(q.question) || 
        q.options.some(o => shouldConvertAsBijoy(o))
      );

      setRawQuestions(normalized);
      setBijoyDetected(hasBijoy);

      if (hasBijoy) {
        const converted = convertQuestionListToUnicode(normalized);
        setQuestions(converted);
        setIsBijoyConverted(true);
      } else {
        setQuestions(normalized);
        setIsBijoyConverted(false);
      }

      const autoMins = Math.min(120, Math.max(10, Math.ceil(normalized.length * 0.8)));
      setDurationMinutes(autoMins);

    } catch (err) {
      console.error('File parse error:', err);
      setError(err.message || 'ফাইল প্রসেস করতে সমস্যা হয়েছে।');
      setQuestions([]);
      setRawQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Bijoy conversion
  const handleToggleBijoy = () => {
    if (!isBijoyConverted) {
      const converted = convertQuestionListToUnicode(rawQuestions.length > 0 ? rawQuestions : questions);
      setQuestions(converted);
      setIsBijoyConverted(true);
    } else {
      if (rawQuestions.length > 0) {
        setQuestions(rawQuestions);
      }
      setIsBijoyConverted(false);
    }
  };

  // Load Demo Samples
  const loadDemoData = (type) => {
    setError(null);
    setLoading(true);

    if (type === 'bcs_csv') {
      const demoItems = [
        {
          'প্রশ্ন': 'বাংলাদেশের সাংবিধানিক নাম কি?',
          'ক': 'বাংলাদেশ',
          'খ': 'গণপ্রজাতন্ত্রী বাংলাদেশ',
          'গ': 'ইসলামিক প্রজাতন্ত্র বাংলাদেশ',
          'ঘ': 'পিপলস বাংলাদেশ',
          'সঠিক উত্তর': 'গণপ্রজাতন্ত্রী বাংলাদেশ',
          'ব্যাখ্যা': 'গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধানের প্রথম অনুচ্ছেদে সুস্পষ্টভাবে উল্লেখ রয়েছে: "বাংলাদেশ একটি একক, স্বাধীন ও সার্বভৌম প্রজাতন্ত্র, যাহা ‘গণপ্রজাতন্ত্রী বাংলাদেশ’ নামে পরিচিত হইবে।"',
          'বিষয়': 'বাংলাদেশ বিষয়াবলি'
        },
        {
          'প্রশ্ন': 'বঙ্গবন্ধুর ৭ই মার্চের ভাষণ ইউনেস্কোর কোন ঐতিহ্যের অংশ হিসেবে স্বীকৃতি পায়?',
          'ক': 'বিশ্ব ঐতিহ্য (World Heritage)',
          'খ': 'মেমোরি অব দ্য ওয়ার্ল্ড রেজিস্টার',
          'গ': 'কালচারাল হেরিটেজ',
          'ঘ': 'ডকুমেন্টারি মেমোরি লিস্ট',
          'সঠিক উত্তর': 'মেমোরি অব দ্য ওয়ার্ল্ড রেজিস্টার',
          'ব্যাখ্যা': '৩০ অক্টোবর ২০১৭ তারিখে ইউনেস্কো জাতির জনক বঙ্গবন্ধু শেখ মুজিবুর রহমানের ঐতিহাসিক ৭ই মার্চের ভাষণকে মেমোরি অব দ্য ওয়ার্ল্ড ইন্টারন্যাশনাল রেজিস্টারে অন্তর্ভুক্ত করে।',
          'বিষয়': 'বাংলাদেশ বিষয়াবলি'
        },
        {
          'প্রশ্ন': 'বাংলাদেশের জাতীয় সংসদ ভবনের স্থপতি কে?',
          'ক': 'এফ আর খান',
          'খ': 'লুই আই কান',
          'গ': 'মাজহারুল ইসলাম',
          'ঘ': 'হ্যামিলটন',
          'সঠিক উত্তর': 'লুই আই কান',
          'ব্যাখ্যা': 'ঢাকার শেরেবাংলা নগরে অবস্থিত জাতীয় সংসদ ভবনের প্রধান স্থপতি হলেন প্রখ্যাত আমেরিকান স্থপতি লুই আই কান (Louis I. Kahn)।',
          'বিষয়': 'শিল্প ও সংস্কৃতি'
        },
        {
          'প্রশ্ন': 'মুজিবনগর সরকার কত তারিখে আনুষ্ঠানিকভাবে শপথ গ্রহণ করে?',
          'ক': '১০ এপ্রিল ১৯৭১',
          'খ': '১৭ এপ্রিল ১৯৭১',
          'গ': '২৬ মার্চ ১৯৭১',
          'ঘ': '১৬ ডিসেম্বর ১৯৭১',
          'সঠিক উত্তর': '১৭ এপ্রিল ১৯৭১',
          'ব্যাখ্যা': 'মেহেরপুরের বৈদ্যনাথতলার আম্রকাননে ১৭ এপ্রিল ১৯৭১ তারিখে স্বাধীন বাংলাদেশ সরকার (মুজিবনগর সরকার) শপথ গ্রহণ করে।',
          'বিষয়': 'মুক্তিযুদ্ধ ও ইতিহাস'
        },
        {
          'প্রশ্ন': 'পদ্মা সেতুর দৈর্ঘ্য কত কিলোমিটার?',
          'ক': '৬.১৫ কিমি',
          'খ': '৫.৮০ কিমি',
          'গ': '৬.৫০ কিমি',
          'ঘ': '৭.০০ কিমি',
          'সঠিক উত্তর': '৬.১৫ কিমি',
          'ব্যাখ্যা': 'পদ্মা সেতুর মূল দৈর্ঘ্য ৬.১৫ কিলোমিটার এবং প্রস্থ ১৮.১০ মিটার। এটি বাংলাদেশের দীর্ঘতম বহুমুখী সেতু।',
          'বিষয়': 'জাতীয় বিষয়াবলি'
        },
        {
          'প্রশ্ন': 'Which word is synonymous with "Meticulous"?',
          'ক': 'Careless',
          'খ': 'Punctilious',
          'গ': 'Superficial',
          'ঘ': 'Hasty',
          'সঠিক উত্তর': 'Punctilious',
          'ব্যাখ্যা': 'Meticulous শব্দের অর্থ অত্যন্ত খুঁতখুঁতে বা অতি-সতর্ক। Punctilious শব্দের অর্থও নিয়মানুগ ও অত্যন্ত সতর্ক।',
          'বিষয়': 'ইংরেজি সাহিত্য ও ব্যাকরণ'
        }
      ];

      const normalized = demoItems.map((item, idx) => normalizeQuestion(item, idx));
      setFileName('demo_bcs_preli_exam.csv');
      setFileSize('12.4 KB');
      setExamTitle('৪৬তম বিসিএস স্পেশাল মডেল টেস্ট');
      setQuestions(normalized);
      setRawQuestions(normalized);
      setBijoyDetected(false);
      setIsBijoyConverted(false);
      setDurationMinutes(10);
      setLoading(false);
    } else if (type === 'bank_json') {
      const demoItems = [
        {
          id: 1,
          question: 'What is the full form of RTGS in banking transactions?',
          options: ['Real Time Gross Settlement', 'Regular Transfer Gross Security', 'Real Transaction Growth System', 'Rapid Transfer Guaranteed Service'],
          correct_answer: 'Real Time Gross Settlement',
          explanation: 'RTGS stands for Real Time Gross Settlement, an electronic funds transfer system for continuous processing of payments.',
          subject: 'Banking & Economics'
        },
        {
          id: 2,
          question: 'The central bank of Bangladesh was established on which date?',
          options: ['16 December 1971', '26 March 1972', '16 December 1972', '24 October 1972'],
          correct_answer: '16 December 1971',
          explanation: 'Bangladesh Bank was established on 16 December 1971 under the Bangladesh Bank Order, 1972 (Presidential Order No. 127 of 1972).',
          subject: 'Banking & Economics'
        },
        {
          id: 3,
          question: 'What is the sum of angles in a convex quadrilateral?',
          options: ['180°', '360°', '540°', '720°'],
          correct_answer: '360°',
          explanation: 'The sum of all interior angles of any convex quadrilateral is always (4 - 2) × 180° = 360°.',
          subject: 'Mathematics'
        },
        {
          id: 4,
          question: '২০২৪-২৫ অর্থবছরে বাংলাদেশের জিডিপি প্রবৃদ্ধির লক্ষ্যমাত্রা কত?',
          options: ['৬.৭৫%', '৭.৫০%', '৬.৫২%', '৭.০০%'],
          correct_answer: '৬.৭৫%',
          explanation: 'প্রস্তাবিত জাতীয় বাজেটে জিডিপি প্রবৃদ্ধির প্রাক্কলন ও সার্বিক অর্থনৈতিক সমীক্ষা পর্যালোচনা।',
          subject: 'সাধারণ জ্ঞান'
        }
      ];
      setFileName('demo_combined_bank_exam.json');
      setFileSize('8.6 KB');
      setExamTitle('কম্বাইন্ড ৮ ব্যাংক অফিসার মডেল টেস্ট');
      setQuestions(demoItems);
      setRawQuestions(demoItems);
      setBijoyDetected(false);
      setIsBijoyConverted(false);
      setDurationMinutes(8);
      setLoading(false);
    } else if (type === 'bijoy_demo') {
      const rawBijoyItems = [
        {
          'প্রশ্ন': 'evsjv‡`‡ki RvZxq msm` feb Gi ¯’cwZ †K?',
          'ক': 'Gd Avi Lvb',
          'খ': 'jyB AvB Kvb',
          'গ': 'gvhnviæj Bmjvg',
          'ঘ': 'n¨vwgjUb',
          'সঠিক উত্তর': 'jyB AvB Kvb',
          'ব্যাখ্যা': 'XvKvi †k‡ievsjv bM‡i Aew¯’Z RvZxq msm` feb Gi cÖavb ¯’cwZ jyB AvB Kvb (Louis I. Kahn)|',
          'বিষয়': 'evsjv‡`k welqvewj'
        },
        {
          'প্রশ্ন': 'gywRebMi miKvi KZ Zvwi‡L kc_ MÖnY K‡i?',
          'ক': '১০ GwcÖj ১৯৭১',
          'খ': '১৭ GwcÖj ১৯৭১',
          'গ': '২৬ gvP© ১৯৭১',
          'ঘ': '১৬ wW‡m¤^i ১৯৭১',
          'সঠিক উত্তর': '১৭ GwcÖj ১৯৭১',
          'ব্যাখ্যা': '১৭ GwcÖj ১৯৭১ Zvwi‡L ˆe`¨bv_Zjvq gywRebMi miKvi AvbyôvwbKfv‡e kc_ MÖnY K‡i|',
          'বিষয়': 'gyw³hy×'
        },
        {
          'প্রশ্ন': 'cÙv †mZzi ˆ`N©¨ KZ wK‡jvwgUvi?',
          'ক': '৬.১৫ wKwg',
          'খ': '৫.৮০ wKwg',
          'গ': '৬.৫০ wKwg',
          'ঘ': '৭.০০ wKwg',
          'সঠিক উত্তর': '৬.১৫ wKwg',
          'ব্যাখ্যা': 'cÙv †mZzi g~j ˆ`N©¨ ৬.১৫ wK‡jvwgUvi|',
          'বিষয়': 'RvZxq welqvewj'
        }
      ];

      const normalized = rawBijoyItems.map((item, idx) => normalizeQuestion(item, idx));
      setFileName('demo_bijoy_mcq_questions.csv');
      setFileSize('6.2 KB');
      setExamTitle('বিজয় ফন্ট (SutonnyMJ) স্পেশাল মডেল টেস্ট');
      setRawQuestions(normalized);
      setBijoyDetected(true);

      const converted = convertQuestionListToUnicode(normalized);
      setQuestions(converted);
      setIsBijoyConverted(true);
      setDurationMinutes(5);
      setLoading(false);
    }
  };

  // Initial auto-load BCS demo questions if no exam slug provided
  useEffect(() => {
    if (!effectiveExamSlug && questions.length === 0 && !fileName) {
      loadDemoData('bcs_csv');
    }
  }, [effectiveExamSlug]);

  // Start Exam
  const handleStartExam = () => {
    if (questions.length === 0) return;
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentIdx(0);
    setSecondsLeft(durationMinutes * 60);
    setTimerActive(examMode === 'exam' && durationMinutes > 0);
    setStep('exam');
  };

  // Timer Tick
  useEffect(() => {
    if (step !== 'exam' || !timerActive) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, timerActive]);

  // Handle Option Select
  const handleSelectOption = (qId, optionText) => {
    setUserAnswers(prev => {
      if (prev[qId] === optionText && examMode === 'exam') {
        const next = { ...prev };
        delete next[qId];
        return next;
      }
      return {
        ...prev,
        [qId]: optionText
      };
    });

    if (examMode === 'practice') {
      setShowExplanationCard(prev => ({ ...prev, [qId]: true }));
    }
  };

  // Toggle Flag for Review
  const handleToggleFlag = (qId) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Calculate Results and Finish
  const handleFinishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerActive(false);

    let correct = 0;
    let wrong = 0;
    const answeredCount = Object.keys(userAnswers).length;

    questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected !== undefined && selected !== null && selected !== '') {
        if (selected.trim() === q.correct_answer.trim()) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const skipped = questions.length - answeredCount;
    const penaltyPerWrong = negativeMarks;
    const marks = Math.max(0, correct - (wrong * penaltyPerWrong));
    const accuracy = answeredCount > 0 ? (correct / answeredCount) * 100 : 0;
    const percentage = questions.length > 0 ? (marks / questions.length) * 100 : 0;
    const timeSpentSeconds = (durationMinutes * 60) - secondsLeft;

    const res = {
      examTitle,
      total: questions.length,
      answered: answeredCount,
      correct,
      wrong,
      skipped,
      marks,
      accuracy,
      percentage,
      negativePenalty: wrong * penaltyPerWrong,
      timeSpentSeconds
    };

    setTestResult(res);
    saveTestResult(res);
    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Print Solutions / Export PDF
  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('পপ-আপ উইন্ডো ব্লক করা আছে। অনুগ্রহ করে ব্রাউজারের পপ-আপ অ্যালাউ করুন।');
      return;
    }

    const itemsHtml = questions.map((q, idx) => {
      const userSelected = userAnswers[idx];
      const isCorrect = userSelected && userSelected.trim() === q.correct_answer.trim();
      const isWrong = userSelected && userSelected.trim() !== q.correct_answer.trim();
      const isSkipped = !userSelected;

      let statusBadge = `<span style="color: #64748b; font-size: 12px; font-weight: 600;">(উত্তর দেওয়া হয়নি)</span>`;
      if (isCorrect) {
        statusBadge = `<span style="color: #059669; font-size: 12px; font-weight: 700;">✓ সঠিক উত্তর (+১.০০)</span>`;
      } else if (isWrong) {
        statusBadge = `<span style="color: #e11d48; font-size: 12px; font-weight: 700;">✗ ভুল উত্তর (-${negativeMarks})</span>`;
      }

      const optionsHtml = q.options.map((opt, oIdx) => {
        const isOptCorrect = opt.trim() === q.correct_answer.trim();
        const isOptSelected = userSelected && opt.trim() === userSelected.trim();
        let bg = '#ffffff';
        let border = '#e2e8f0';
        let fontColor = '#1e293b';

        if (isOptCorrect) {
          bg = '#ecfdf5';
          border = '#059669';
          fontColor = '#065f46';
        } else if (isOptSelected) {
          bg = '#fff1f2';
          border = '#f43f5e';
          fontColor = '#9f1239';
        }

        return `
          <div style="padding: 6px 10px; margin-bottom: 4px; border: 1px solid ${border}; background: ${bg}; color: ${fontColor}; border-radius: 6px; font-size: 13px;">
            <strong>(${OPTION_LABELS[oIdx] || oIdx + 1})</strong> ${opt}
            ${isOptCorrect ? ' <strong style="color: #059669;">[সঠিক উত্তর]</strong>' : ''}
            ${isOptSelected && !isOptCorrect ? ' <strong style="color: #e11d48;">[আপনার উত্তর]</strong>' : ''}
          </div>
        `;
      }).join('');

      return `
        <div style="margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px dashed #cbd5e1;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 6px; display: flex; justify-content: space-between;">
            <span>${idx + 1}. ${q.question}</span>
            <span>${statusBadge}</span>
          </div>
          <div style="margin: 8px 0;">
            ${optionsHtml}
          </div>
          ${q.explanation ? `
            <div style="background: #f8fafc; border-left: 3px solid #0284c7; padding: 6px 10px; font-size: 12px; color: #334155; margin-top: 6px;">
              <strong>ব্যাখ্যা:</strong> ${q.explanation}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="bn">
        <head>
          <meta charset="utf-8">
          <title>${examTitle} - সমাধান ও ফলাফল</title>
          ${FONT_ASSETS_HTML}
          <style>
            body {
              font-family: ${activeFont.family};
              padding: 30px;
              color: #0f172a;
              margin: 0;
              line-height: 1.6;
            }
            * { font-family: inherit !important; }
            .header-bar {
              border-bottom: 2px solid #059669;
              padding-bottom: 12px;
              margin-bottom: 18px;
            }
            .title { font-size: 20px; font-weight: 800; color: #047857; margin: 0; }
            .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
            .stats-box {
              display: flex;
              gap: 14px;
              background: #f1f5f9;
              padding: 10px 14px;
              border-radius: 8px;
              margin-bottom: 20px;
              font-size: 13px;
            }
            @media print {
              body { padding: 0; }
              @page { size: auto; margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <h1 class="title">${examTitle}</h1>
            <div class="meta">তারিখ: ${new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })} | ফন্ট: ${activeFont.name}</div>
          </div>
          ${testResult ? `
            <div class="stats-box">
              <div>মোট প্রশ্ন: <strong>${testResult.total}</strong></div>
              <div>অর্জিত নম্বর: <strong>${testResult.marks.toFixed(2)}</strong></div>
              <div>সঠিক: <strong style="color: #059669;">${testResult.correct}</strong></div>
              <div>ভুল: <strong style="color: #e11d48;">${testResult.wrong}</strong></div>
              <div>বাকি: <strong>${testResult.skipped}</strong></div>
              <div>সঠিকতার হার: <strong>${testResult.accuracy.toFixed(1)}%</strong></div>
            </div>
          ` : ''}
          <div>
            ${itemsHtml}
          </div>
          ${TRIGGER_PRINT_SCRIPT}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const timerDisplay = useMemo(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [secondsLeft]);

  const isTimerCritical = secondsLeft < 180 && timerActive;

  // Render Bangla Typography Toolbar (matching /file-studio/)
  const renderBanglaToolbar = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      background: '#f8fafc',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '16px'
    }}>
      {/* Left: Font Picker & Size Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* Font Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Type size={16} color="#059669" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>বাংলা ফন্ট:</span>
          <select
            value={selectedFontId}
            onChange={(e) => setSelectedFontId(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.86rem',
              color: '#0f172a',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {BANGLA_FONTS.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} {f.badge ? `• ${f.badge}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', padding: '3px', borderRadius: '7px', border: '1px solid #cbd5e1' }}>
          <button
            onClick={() => setFontSize(prev => Math.max(12, prev - 1))}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#475569'
            }}
            title="ফন্ট সাইজ কমান (A-)"
          >
            A-
          </button>
          <span style={{ fontSize: '0.82rem', padding: '0 6px', color: '#059669', fontWeight: 800 }}>
            {fontSize}px
          </span>
          <button
            onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#475569'
            }}
            title="ফন্ট সাইজ বাড়ান (A+)"
          >
            A+
          </button>
        </div>

        {/* Line Spacing Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>লাইন:</span>
          <button
            onClick={() => setLineHeight('1.6')}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: lineHeight === '1.6' ? '1px solid #059669' : '1px solid #cbd5e1',
              background: lineHeight === '1.6' ? '#ecfdf5' : '#ffffff',
              color: lineHeight === '1.6' ? '#047857' : '#475569',
              fontSize: '0.78rem',
              fontWeight: lineHeight === '1.6' ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            স্বাভাবিক
          </button>
          <button
            onClick={() => setLineHeight('1.9')}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: lineHeight === '1.9' ? '1px solid #059669' : '1px solid #cbd5e1',
              background: lineHeight === '1.9' ? '#ecfdf5' : '#ffffff',
              color: lineHeight === '1.9' ? '#047857' : '#475569',
              fontSize: '0.78rem',
              fontWeight: lineHeight === '1.9' ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            আরামদায়ক
          </button>
        </div>
      </div>

      {/* Right: Bijoy to Unicode Toggle */}
      <div>
        <button
          onClick={handleToggleBijoy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '7px',
            border: isBijoyConverted ? '1px solid #059669' : '1px solid #f59e0b',
            background: isBijoyConverted ? '#ecfdf5' : '#fffbeb',
            color: isBijoyConverted ? '#047857' : '#b45309',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
          title="বিজয় (SutonnyMJ) ফন্টে লেখা থাকলে ক্লিক করে সঠিক বাংলা ইউনিকোডে রূপান্তর করুন বা মূল রূপে ফেরত যান"
        >
          <Wand2 size={14} />
          <span>{isBijoyConverted ? '✓ ইউনিকোড রূপান্তর সক্রিয় (মূল রূপে ফিরুন)' : 'বিজয় ➔ ইউনিকোড রূপান্তর'}</span>
        </button>
      </div>
    </div>
  );

  // ==========================================
  // VIEW 1: SETUP & UPLOAD STATE
  // ==========================================
  if (step === 'setup') {
    return (
      <div style={{ padding: '30px 0 80px', fontFamily: activeFont.family }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="badge badge-emerald" style={{ display: 'inline-flex', padding: '6px 14px', marginBottom: '12px', fontSize: '0.85rem' }}>
              <Sparkles size={14} /> ফাইল এক্সাম স্টুডিও
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              CSV বা JSON ফাইল আপলোড করে মডেল টেস্ট দিন
            </h1>
            <p style={{ color: '#475569', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
              আপনার কাছে থাকা যেকোনো MCQ প্রশ্নভান্ডার (.csv বা .json) ড্রপ করুন। টাইমার, নেগেটিভ মার্কিং এবং বিস্তারিত সমাধান সহ সরাসরি পরীক্ষা দিন।
            </p>
          </div>

          {/* Upload Dropzone */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processUploadFile(e.dataTransfer.files[0]);
              }
            }}
            style={{
              border: '2px dashed #10b981',
              borderRadius: '20px',
              padding: '44px 24px',
              textAlign: 'center',
              background: '#f0fdf4',
              cursor: 'pointer',
              marginBottom: '24px',
              transition: 'all 0.2s ease',
              boxShadow: '0 8px 30px rgba(16, 185, 129, 0.08)'
            }}
          >
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.18)'
            }}>
              <UploadCloud size={36} color="#059669" />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              আপনার MCQ প্রশ্নপত্র ফাইলটি এখানে ড্রপ করুন
            </h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', marginBottom: '20px' }}>
              সাপোর্টেড ফরম্যাট: <strong>.csv</strong>, <strong>.json</strong>, <strong>.xlsx</strong> (বাংলা কলাম ও বিজয় ফন্ট স্বয়ংক্রিয়ভাবে রূপান্তর হবে)
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>
              <span className="badge badge-emerald" style={{ padding: '6px 12px' }}>
                <FileText size={13} /> CSV ফাইল
              </span>
              <span className="badge badge-amber" style={{ padding: '6px 12px' }}>
                <FileCode size={13} /> JSON ফাইল
              </span>
              <span className="badge badge-cyan" style={{ padding: '6px 12px' }}>
                <FileSpreadsheet size={13} /> Excel (.xlsx)
              </span>
              <span className="badge badge-emerald" style={{ padding: '6px 12px' }}>
                <Wand2 size={13} /> বিজয় (SutonnyMJ) সাপোর্ট
              </span>
            </div>

            <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', padding: '12px 28px', fontSize: '0.98rem' }}>
              <UploadCloud size={18} />
              <span>ফাইল ব্রাউজ করুন</span>
              <input 
                type="file" 
                accept=".csv,.json,.xlsx,.xls" 
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processUploadFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {/* Demo Loaders */}
          <div className="glass-panel" style={{ padding: '18px 22px', background: '#ffffff', marginBottom: '28px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#475569', marginRight: '12px' }}>
              তাত্ক্ষণিক টেস্ট করার জন্য ডেমো প্রশ্নপত্র:
            </span>
            <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              <button 
                onClick={() => loadDemoData('bcs_csv')} 
                className="btn-secondary" 
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                📄 বিসিএস প্রশ্নপত্র (.csv)
              </button>
              <button 
                onClick={() => loadDemoData('bank_json')} 
                className="btn-secondary" 
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                📝 ব্যাংক জব MCQ (.json)
              </button>
              <button 
                onClick={() => loadDemoData('bijoy_demo')} 
                className="btn-secondary" 
                style={{ fontSize: '0.82rem', padding: '6px 12px', border: '1px solid #f59e0b', color: '#b45309', background: '#fffbeb' }}
                title="পুরাতন বিজয়/সুতন্নী ফন্টে লেখা প্রশ্ন স্বয়ংক্রিয়ভাবে টেস্ট করুন"
              >
                🔄 বিজয় ফন্ট ডেমো (.csv)
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <RefreshCw size={26} className="animate-spin" color="#059669" style={{ margin: '0 auto 10px' }} />
              <div style={{ color: '#059669', fontWeight: 700 }}>ফাইল প্রসেস করা হচ্ছে...</div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#be123c',
              padding: '16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <AlertCircle size={22} />
              <span style={{ fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {/* FILE LOADED: 1. SPREADSHEET / TABLE VIEWER (MATCHING /file-studio/) + 2. EXAM YER BOX */}
          {questions.length > 0 && (
            <div style={{
              position: isFullScreen ? 'fixed' : 'relative',
              top: isFullScreen ? 0 : 'auto',
              left: isFullScreen ? 0 : 'auto',
              right: isFullScreen ? 0 : 'auto',
              bottom: isFullScreen ? 0 : 'auto',
              zIndex: isFullScreen ? 9999 : 'auto',
              background: isFullScreen ? '#ffffff' : 'transparent',
              padding: isFullScreen ? '24px' : '0',
              overflowY: isFullScreen ? 'auto' : 'visible',
              display: 'flex',
              flexDirection: 'column',
              gap: '26px'
            }}>
              {/* TABLE CONTAINER: EXACTLY LIKE /file-studio/ */}
              <div className="glass-panel" style={{
                padding: '24px',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}>
                {/* Top Bar: Title & Actions (matching /file-studio/) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #e2e8f0',
                  marginBottom: '18px'
                }}>
                  {/* File Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      padding: '10px',
                      borderRadius: '10px',
                      background: (fileName.endsWith('.json')) ? '#fef3c7' : '#dcfce7',
                      color: (fileName.endsWith('.json')) ? '#d97706' : '#059669'
                    }}>
                      {fileName.endsWith('.json') ? <FileCode size={22} /> : <FileSpreadsheet size={22} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {fileName || examTitle}
                        </h3>
                        <span className="badge badge-emerald" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          {fileName ? fileName.split('.').pop() : 'MCQ'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        সাইজ: {fileSize || '12 KB'} • মোট সারি: <strong>{questions.length}</strong> টি • কলাম: <strong>৮</strong> টি
                      </div>
                    </div>
                  </div>

                  {/* Export & Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={exportTableToPdf} 
                      className="btn-primary" 
                      style={{ fontSize: '0.82rem', padding: '7px 14px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
                      title="টেবিলটি বাংলা ফন্ট সহ PDF হিসেবে এক্সপোর্ট করুন"
                    >
                      <Printer size={15} />
                      <span>PDF এক্সপোর্ট</span>
                    </button>
                    <button 
                      onClick={exportToCsv} 
                      className="btn-secondary" 
                      style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                      title="CSV ফরম্যাটে ডাউনলোড করুন"
                    >
                      <Download size={14} />
                      <span>CSV</span>
                    </button>
                    <button 
                      onClick={exportToJson} 
                      className="btn-secondary" 
                      style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                      title="JSON ফরম্যাটে ডাউনলোড করুন"
                    >
                      <Download size={14} />
                      <span>JSON</span>
                    </button>
                    <button 
                      onClick={() => setIsFullScreen(!isFullScreen)} 
                      className="btn-secondary" 
                      style={{ padding: '7px 10px' }}
                      title={isFullScreen ? 'ফুল স্ক্রিন বন্ধ' : 'ফুল স্ক্রিন করুন'}
                    >
                      {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                    <button 
                      onClick={() => {
                        setQuestions([]);
                        setRawQuestions([]);
                        setFileName('');
                        setTableSearch('');
                      }} 
                      className="btn-primary" 
                      style={{ fontSize: '0.82rem', padding: '7px 14px', background: '#0f172a' }}
                    >
                      <UploadCloud size={14} />
                      <span>নতুন ফাইল</span>
                    </button>
                  </div>
                </div>

                {/* Bijoy Detection Banner */}
                {bijoyDetected && (
                  <div style={{
                    background: isBijoyConverted ? '#ecfdf5' : '#fffbeb',
                    border: isBijoyConverted ? '1px solid #a7f3d0' : '1px solid #fde68a',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Wand2 size={20} color={isBijoyConverted ? '#059669' : '#d97706'} />
                      <div>
                        <div style={{ fontWeight: 700, color: isBijoyConverted ? '#065f46' : '#92400e', fontSize: '0.92rem' }}>
                          {isBijoyConverted 
                            ? '✓ টেবিলে বিজয় (SutonnyMJ) ফন্ট ছিল এবং স্বয়ংক্রিয়ভাবে ইউনিকোডে রূপান্তর করা হয়েছে!'
                            : '💡 টেবিলে বিজয় (SutonnyMJ/ANSI) ফন্ট শনাক্ত হয়েছে!'}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: isBijoyConverted ? '#047857' : '#b45309' }}>
                          {isBijoyConverted 
                            ? 'টেবিলের কলাম ও সেলগুলো এখন ইউনিকোড বাংলায় প্রদর্শিত হচ্ছে।'
                            : 'টেবিলের হেডার ও সেলের লেখাগুলো প্রমিত ইউনিকোড বাংলায় পড়তে রূপান্তর করুন।'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleBijoy}
                      className="btn-primary"
                      style={{
                        background: isBijoyConverted ? '#059669' : '#d97706',
                        fontSize: '0.84rem',
                        padding: '7px 16px',
                        border: 'none',
                        borderRadius: '7px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Wand2 size={14} />
                      <span>{isBijoyConverted ? 'মূল বিজয়ে দেখুন' : 'ইউনিকোডে রূপান্তর করুন'}</span>
                    </button>
                  </div>
                )}

                {/* Bangla Typography Toolbar (matching /file-studio/) */}
                {renderBanglaToolbar()}

                {/* Filter & Search Toolbar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  {/* Search Input */}
                  <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '450px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="যেকোনো কলাম বা ডাটা সার্চ করুন..."
                      value={tableSearch}
                      onChange={(e) => {
                        setTableSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 36px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: '#f8fafc',
                        fontSize: '0.88rem',
                        outline: 'none',
                        color: '#0f172a'
                      }}
                    />
                  </div>

                  {/* Pagination PageSize Control */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.84rem', color: '#475569' }}>প্রতি পেজে:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.85rem',
                        color: '#0f172a',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value={15}>১৫</option>
                      <option value={25}>২৫</option>
                      <option value={50}>৫০</option>
                      <option value={100}>১০০</option>
                    </select>
                  </div>
                </div>

                {/* Table Container with Sorting */}
                <div style={{
                  overflowX: 'auto',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontFamily: activeFont.family,
                    fontSize: `${fontSize}px`,
                    lineHeight: lineHeight,
                    textAlign: 'left'
                  }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{
                          padding: '12px 14px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#64748b',
                          width: '50px',
                          textAlign: 'center'
                        }}>
                          #
                        </th>
                        <th
                          onClick={() => handleSort('question')}
                          style={{
                            padding: '12px 14px',
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: sortConfig.key === 'question' ? '#059669' : '#1e293b',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                            minWidth: '240px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>প্রশ্ন (Question)</span>
                            {sortConfig.key === 'question' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp size={14} color="#059669" /> : <ArrowDown size={14} color="#059669" />
                            ) : (
                              <ArrowUpDown size={13} color="#94a3b8" style={{ opacity: 0.6 }} />
                            )}
                          </div>
                        </th>
                        <th
                          onClick={() => handleSort('optA')}
                          style={{
                            padding: '12px 14px',
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: sortConfig.key === 'optA' ? '#059669' : '#1e293b',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                            minWidth: '110px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>ক</span>
                            {sortConfig.key === 'optA' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp size={14} color="#059669" /> : <ArrowDown size={14} color="#059669" />
                            ) : (
                              <ArrowUpDown size={13} color="#94a3b8" style={{ opacity: 0.6 }} />
                            )}
                          </div>
                        </th>
                        <th
                          onClick={() => handleSort('optB')}
                          style={{
                            padding: '12px 14px',
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: sortConfig.key === 'optB' ? '#059669' : '#1e293b',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                            minWidth: '110px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>খ</span>
                            {sortConfig.key === 'optB' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp size={14} color="#059669" /> : <ArrowDown size={14} color="#059669" />
                            ) : (
                              <ArrowUpDown size={13} color="#94a3b8" style={{ opacity: 0.6 }} />
                            )}
                          </div>
                        </th>
                        <th
                          onClick={() => handleSort('optC')}
                          style={{
                            padding: '12px 14px',
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: sortConfig.key === 'optC' ? '#059669' : '#1e293b',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                            minWidth: '110px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>গ</span>
                            {sortConfig.key === 'optC' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp size={14} color="#059669" /> : <ArrowDown size={14} color="#059669" />
                            ) : (
                              <ArrowUpDown size={13} color="#94a3b8" style={{ opacity: 0.6 }} />
                            )}
                          </div>
                        </th>
                        <th
                          onClick={() => handleSort('optD')}
                          style={{
                            padding: '12px 14px',
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: sortConfig.key === 'optD' ? '#059669' : '#1e293b',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                            minWidth: '110px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>ঘ</span>
                            {sortConfig.key === 'optD' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp size={14} color="#059669" /> : <ArrowDown size={14} color="#059669" />
                            ) : (
                              <ArrowUpDown size={13} color="#94a3b8" style={{ opacity: 0.6 }} />
                            )}
                          </div>
                        </th>
                        <th
                          onClick={() => handleSort('answer')}
                          style={{
                            padding: '12px 14px',
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: sortConfig.key === 'answer' ? '#059669' : '#1e293b',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                            minWidth: '140px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>সঠিক উত্তর</span>
                            {sortConfig.key === 'answer' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp size={14} color="#059669" /> : <ArrowDown size={14} color="#059669" />
                            ) : (
                              <ArrowUpDown size={13} color="#94a3b8" style={{ opacity: 0.6 }} />
                            )}
                          </div>
                        </th>
                        <th
                          onClick={() => handleSort('explanation')}
                          style={{
                            padding: '12px 14px',
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: sortConfig.key === 'explanation' ? '#059669' : '#1e293b',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                            minWidth: '180px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>ব্যাখ্যা</span>
                            {sortConfig.key === 'explanation' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp size={14} color="#059669" /> : <ArrowDown size={14} color="#059669" />
                            ) : (
                              <ArrowUpDown size={13} color="#94a3b8" style={{ opacity: 0.6 }} />
                            )}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedQuestions.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                            কোনো ফলাফল পাওয়া যায়নি
                          </td>
                        </tr>
                      ) : (
                        paginatedQuestions.map((q, rIdx) => {
                          const serial = (currentPage - 1) * pageSize + rIdx + 1;
                          const optA = q.options && q.options[0] ? q.options[0] : '—';
                          const optB = q.options && q.options[1] ? q.options[1] : '—';
                          const optC = q.options && q.options[2] ? q.options[2] : '—';
                          const optD = q.options && q.options[3] ? q.options[3] : '—';
                          return (
                            <tr 
                              key={rIdx}
                              style={{
                                borderBottom: '1px solid #f1f5f9',
                                background: rIdx % 2 === 0 ? '#ffffff' : '#fafafa',
                                transition: 'background 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdf4'}
                              onMouseLeave={(e) => e.currentTarget.style.background = rIdx % 2 === 0 ? '#ffffff' : '#fafafa'}
                            >
                              <td style={{
                                padding: '10px 14px',
                                fontSize: '0.78rem',
                                color: '#94a3b8',
                                textAlign: 'center',
                                fontWeight: 600
                              }}>
                                {serial}
                              </td>
                              <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>
                                {q.question}
                                {q.subject && (
                                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#0284c7', marginTop: '2px', fontWeight: 500 }}>
                                    বিষয়: {q.subject}
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '10px 14px', color: '#334155' }}>{optA}</td>
                              <td style={{ padding: '10px 14px', color: '#334155' }}>{optB}</td>
                              <td style={{ padding: '10px 14px', color: '#334155' }}>{optC}</td>
                              <td style={{ padding: '10px 14px', color: '#334155' }}>{optD}</td>
                              <td style={{ padding: '10px 14px' }}>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  background: '#ecfdf5',
                                  color: '#065f46',
                                  fontWeight: 700,
                                  border: '1px solid #a7f3d0',
                                  fontSize: '0.82rem'
                                }}>
                                  ✓ {q.correct_answer || '—'}
                                </span>
                              </td>
                              <td style={{ padding: '10px 14px', color: '#64748b', fontSize: '0.82rem', lineHeight: '1.5' }}>
                                {q.explanation || '—'}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginTop: '16px',
                  paddingTop: '12px'
                }}>
                  <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    মোট <strong>{sortedQuestions.length}</strong> টির মধ্যে <strong>{sortedQuestions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> থেকে <strong>{Math.min(currentPage * pageSize, sortedQuestions.length)}</strong> নং সারি প্রদর্শিত হচ্ছে
                  </div>

                  {totalPages > 1 && (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="btn-secondary"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.82rem',
                          opacity: currentPage === 1 ? 0.5 : 1,
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        পূর্ববর্তী
                      </button>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                border: currentPage === pageNum ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                                background: currentPage === pageNum ? '#ecfdf5' : '#ffffff',
                                color: currentPage === pageNum ? '#047857' : '#475569',
                                fontWeight: currentPage === pageNum ? 700 : 500,
                                fontSize: '0.82rem',
                                cursor: 'pointer'
                              }}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className="btn-secondary"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.82rem',
                          opacity: currentPage === totalPages ? 0.5 : 1,
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                        }}
                      >
                        পরবর্তী
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================== */}
              {/* STEP 2: তার পর এক্সামের বক্স দেখাবে (THE EXAM BOX)           */}
              {/* ========================================================== */}
              <div className="glass-panel" style={{
                padding: '28px',
                background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
                borderRadius: '18px',
                border: '2px solid #10b981',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.12)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                  }}>
                    <Timer size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      ২. মডেল টেস্ট পরীক্ষা রুম (Exam Box)
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#475569', margin: 0, marginTop: '2px' }}>
                      নিচের সেটিংসগুলো নির্বাচন করে সরাসরি লাইভ মডেল টেস্ট শুরু করুন:
                    </p>
                  </div>
                </div>

                {/* Settings Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '18px',
                  marginBottom: '20px'
                }}>
                  {/* 1. Exam Mode */}
                  <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      পরীক্ষার মোড নির্বাচন:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setExamMode('exam')}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '8px',
                          border: examMode === 'exam' ? '2px solid #059669' : '1px solid #cbd5e1',
                          background: examMode === 'exam' ? '#ecfdf5' : '#ffffff',
                          color: examMode === 'exam' ? '#047857' : '#475569',
                          fontWeight: examMode === 'exam' ? 700 : 500,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        লাইভ টেস্ট (টাইমার)
                      </button>
                      <button
                        onClick={() => setExamMode('practice')}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '8px',
                          border: examMode === 'practice' ? '2px solid #059669' : '1px solid #cbd5e1',
                          background: examMode === 'practice' ? '#ecfdf5' : '#ffffff',
                          color: examMode === 'practice' ? '#047857' : '#475569',
                          fontWeight: examMode === 'practice' ? 700 : 500,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        অনুশীলন (তাৎক্ষণিক উত্তর)
                      </button>
                    </div>
                  </div>

                  {/* 2. Timer Limit */}
                  <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      সময় নির্ধারণ:
                    </label>
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      disabled={examMode === 'practice'}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: examMode === 'practice' ? '#f1f5f9' : '#ffffff',
                        fontSize: '0.85rem',
                        color: '#0f172a',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <option value={10}>১০ মিনিট</option>
                      <option value={15}>১৫ মিনিট</option>
                      <option value={20}>২০ মিনিট</option>
                      <option value={30}>৩০ মিনিট</option>
                      <option value={45}>৪৫ মিনিট</option>
                      <option value={60}>৬০ মিনিট (১ ঘণ্টা)</option>
                      <option value={90}>৯০ মিনিট</option>
                      <option value={120}>১২০ মিনিট (২ ঘণ্টা)</option>
                    </select>
                  </div>

                  {/* 3. Negative Marks */}
                  <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      ভুল উত্তরের জন্য নেগেটিভ মার্কিং:
                    </label>
                    <select
                      value={negativeMarks}
                      onChange={(e) => setNegativeMarks(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.85rem',
                        color: '#0f172a',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <option value={0.50}>০.৫০ (বিসিএস প্রিলিমিনারি)</option>
                      <option value={0.25}>০.২৫ (ব্যাংক ও শিক্ষক নিয়োগ)</option>
                      <option value={0.20}>০.২০ (মন্ত্রণালয় ও অন্যান্য)</option>
                      <option value={0}>কোনো নেগেটিভ মার্কিং নেই (০.০০)</option>
                    </select>
                  </div>

                  {/* 4. Font Selection */}
                  <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      বাংলা ফন্ট নির্বাচন:
                    </label>
                    <select
                      value={selectedFontId}
                      onChange={(e) => setSelectedFontId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.85rem',
                        color: '#0f172a',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {BANGLA_FONTS.map(f => (
                        <option key={f.id} value={f.id}>{f.name} {f.badge ? `• ${f.badge}` : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Exam Summary Rules Bar */}
                <div style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  marginBottom: '22px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexWrap: 'wrap',
                  gap: '12px',
                  fontSize: '0.86rem',
                  color: '#065f46',
                  fontWeight: 600
                }}>
                  <span>✓ মোট প্রশ্ন: <strong>{questions.length}</strong> টি</span>
                  <span>✓ পূর্ণমান: <strong>{questions.length}</strong> নম্বর</span>
                  <span>✓ সময়: <strong>{durationMinutes}</strong> মিনিট</span>
                  <span>✓ ভুল উত্তরের জরিমানা: <strong>-{negativeMarks}</strong></span>
                </div>

                {/* Start Button Bar */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={handleStartExam}
                    className="btn-primary"
                    style={{
                      padding: '14px 44px',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      borderRadius: '12px',
                      boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    <Play size={20} fill="#ffffff" />
                    <span>মডেল টেস্ট শুরু করুন ({questions.length} টি প্রশ্ন)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVE EXAM RUNNER
  // ==========================================
  if (step === 'exam') {
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div style={{ padding: '24px 0 80px', fontFamily: activeFont.family }}>
        <div className="container">
          {/* Sticky Status Bar */}
          <div className="glass-panel" style={{
            position: 'sticky',
            top: '74px',
            zIndex: 40,
            padding: '12px 20px',
            marginBottom: '24px',
            background: '#ffffff',
            borderBottom: '2px solid #10b981',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            {/* Title & Progress */}
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                {examMode === 'exam' ? 'লাইভ মডেল টেস্ট' : 'অনুশীলন মোড'} • উত্তর দিয়েছেন: <strong>{answeredCount}/{questions.length}</strong>
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
                {examTitle}
              </h2>
            </div>

            {/* Timer & Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {/* Countdown Timer */}
              {examMode === 'exam' && durationMinutes > 0 && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: isTimerCritical ? '#fff1f2' : '#ecfdf5',
                  border: isTimerCritical ? '1px solid #fecdd3' : '1px solid #a7f3d0',
                  color: isTimerCritical ? '#e11d48' : '#047857',
                  fontWeight: 800,
                  fontSize: '1.05rem'
                }}>
                  <Timer size={18} className={isTimerCritical ? 'animate-bounce' : ''} />
                  <span>{timerDisplay}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={() => {
                  if (confirm(`আপনি কি নিশ্চিত যে পরীক্ষা জমা দিতে চান?\nমোট প্রশ্ন: ${questions.length}\nউত্তর দিয়েছেন: ${answeredCount} টি`)) {
                    handleFinishExam();
                  }
                }}
                className="btn-primary"
                style={{
                  padding: '9px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                }}
              >
                <Send size={16} />
                <span>পরীক্ষা জমা দিন</span>
              </button>
            </div>
          </div>

          {/* Layout Grid: Questions on Left, Question Nav on Right */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 280px',
            gap: '24px',
            alignItems: 'start'
          }} className="file-exam-grid">
            {/* Questions Column */}
            <div>
              {questions.map((q, qIdx) => {
                const selected = userAnswers[qIdx];
                const isFlagged = flaggedQuestions[qIdx];
                const isCurrent = currentIdx === qIdx;
                const showExplanation = examMode === 'practice' && showExplanationCard[qIdx];

                return (
                  <div 
                    key={q.id !== undefined ? q.id : qIdx} 
                    id={`question_${qIdx}`}
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      marginBottom: '20px',
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: isCurrent ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      borderLeft: isFlagged ? '5px solid #f59e0b' : (selected ? '5px solid #10b981' : '5px solid #cbd5e1'),
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Question Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          padding: '3px 10px',
                          borderRadius: '6px'
                        }}>
                          প্রশ্ন #{qIdx + 1}
                        </span>

                        {q.subject && (
                          <span className="badge badge-emerald" style={{ fontSize: '0.78rem' }}>
                            {q.subject}
                          </span>
                        )}
                      </div>

                      {/* Flag Button */}
                      <button
                        onClick={() => handleToggleFlag(qIdx)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: 'none',
                          background: isFlagged ? '#fef3c7' : '#f8fafc',
                          color: isFlagged ? '#b45309' : '#64748b',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        title={isFlagged ? 'রিভিউ ফ্ল্যাগ সরানো' : 'পরে দেখার জন্য ফ্ল্যাগ করে রাখুন'}
                      >
                        <Flag size={13} fill={isFlagged ? '#b45309' : 'none'} />
                        <span>{isFlagged ? 'ফ্ল্যাগ করা' : 'রিভিউ রাখুন'}</span>
                      </button>
                    </div>

                    {/* Question Statement */}
                    <div style={{
                      fontSize: '1.12rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '18px',
                      lineHeight: '1.6'
                    }}>
                      <FormattedContent content={q.question} />
                    </div>

                    {/* Options List */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                      {q.options.map((opt, oIdx) => {
                        const isChosen = selected === opt;
                        const isPracticeCorrect = examMode === 'practice' && showExplanation && opt.trim() === q.correct_answer.trim();
                        const isPracticeWrong = examMode === 'practice' && showExplanation && isChosen && opt.trim() !== q.correct_answer.trim();

                        let bg = '#f8fafc';
                        let border = '#e2e8f0';
                        let color = '#334155';

                        if (isPracticeCorrect) {
                          bg = '#ecfdf5';
                          border = '#059669';
                          color = '#065f46';
                        } else if (isPracticeWrong) {
                          bg = '#fff1f2';
                          border = '#f43f5e';
                          color = '#9f1239';
                        } else if (isChosen) {
                          bg = '#f0fdf4';
                          border = '#10b981';
                          color = '#047857';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => {
                              setCurrentIdx(qIdx);
                              handleSelectOption(qIdx, opt);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 16px',
                              borderRadius: '10px',
                              border: `1.5px solid ${border}`,
                              background: bg,
                              color: color,
                              fontSize: '0.94rem',
                              fontWeight: isChosen ? 700 : 500,
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isChosen ? '#10b981' : '#ffffff',
                              color: isChosen ? '#ffffff' : '#475569',
                              border: `1px solid ${border}`,
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              flexShrink: 0
                            }}>
                              {OPTION_LABELS[oIdx] || oIdx + 1}
                            </span>
                            <span style={{ flex: 1 }}>
                              <FormattedContent content={opt} inline />
                            </span>
                            {isChosen && <Check size={16} color="#059669" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Instant Explanation in Practice Mode */}
                    {showExplanation && (
                      <div style={{
                        marginTop: '16px',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        borderLeft: '4px solid #0284c7'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <Info size={15} color="#0284c7" />
                          <span style={{ fontWeight: 700, color: '#0369a1', fontSize: '0.88rem' }}>
                            সঠিক উত্তর:
                          </span>
                          <FormattedContent content={q.correct_answer} inline style={{ fontWeight: 700, color: '#0369a1' }} />
                        </div>
                        {q.explanation && (
                          <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '6px', lineHeight: '1.65' }}>
                            <FormattedContent content={q.explanation} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Bottom Submit Button */}
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  onClick={() => {
                    if (confirm(`আপনি কি নিশ্চিত যে পরীক্ষা জমা দিতে চান?\nমোট প্রশ্ন: ${questions.length}\nউত্তর দিয়েছেন: ${answeredCount} টি`)) {
                      handleFinishExam();
                    }
                  }}
                  className="btn-primary"
                  style={{
                    padding: '14px 44px',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    borderRadius: '12px'
                  }}
                >
                  <Send size={18} />
                  <span>পরীক্ষা সমাপ্ত ও ফলাফল দেখুন</span>
                </button>
              </div>
            </div>

            {/* Sidebar Question Navigation Palette */}
            <div style={{ position: 'sticky', top: '160px' }} className="file-exam-palette">
              <div className="glass-panel" style={{
                padding: '18px',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
              }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                  প্রশ্ন তালিকা ({answeredCount}/{questions.length})
                </h4>

                {/* Legend */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.74rem', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10b981' }} />
                    <span style={{ color: '#475569' }}>উত্তর দিয়েছেন</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#f59e0b' }} />
                    <span style={{ color: '#475569' }}>রিভিউ ফ্ল্যাগ</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#e2e8f0' }} />
                    <span style={{ color: '#64748b' }}>বাকি আছে</span>
                  </div>
                </div>

                {/* Question Numbers Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '6px',
                  maxHeight: '340px',
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}>
                  {questions.map((_, i) => {
                    const isAnswered = userAnswers[i] !== undefined;
                    const isFlagged = flaggedQuestions[i];
                    const isCurrent = currentIdx === i;

                    let bg = '#f8fafc';
                    let border = '1px solid #e2e8f0';
                    let color = '#475569';

                    if (isAnswered) {
                      bg = '#ecfdf5';
                      border = '1px solid #10b981';
                      color = '#047857';
                    }
                    if (isFlagged) {
                      bg = '#fef3c7';
                      border = '1.5px solid #f59e0b';
                      color = '#b45309';
                    }
                    if (isCurrent) {
                      border = '2px solid #0284c7';
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentIdx(i);
                          const el = document.getElementById(`question_${i}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          borderRadius: '6px',
                          background: bg,
                          border,
                          color,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 860px) {
            .file-exam-grid {
              grid-template-columns: 1fr !important;
            }
            .file-exam-palette {
              display: none !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: COMPREHENSIVE RESULT & REVIEW
  // ==========================================
  if (step === 'result' && testResult) {
    const { total, answered, correct, wrong, skipped, marks, accuracy, percentage, negativePenalty } = testResult;
    const isPassed = accuracy >= 60;

    return (
      <div style={{ padding: '30px 0 80px', fontFamily: activeFont.family }}>
        <div className="container" style={{ maxWidth: '920px' }}>
          {/* Result Card Hero */}
          <div className="glass-panel" style={{
            padding: '36px',
            borderRadius: '22px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            marginBottom: '32px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: isPassed ? '#ecfdf5' : '#fffbeb',
              border: `2px solid ${isPassed ? '#10b981' : '#f59e0b'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              boxShadow: isPassed ? '0 4px 18px rgba(16, 185, 129, 0.25)' : 'none'
            }}>
              {isPassed ? <Trophy size={42} color="#059669" /> : <Award size={42} color="#d97706" />}
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              {isPassed ? 'অভিনন্দন! চমৎকার ফলাফল 🎉' : 'পরীক্ষা সম্পন্ন হয়েছে 👍'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.94rem', marginBottom: '24px' }}>
              <strong>{examTitle}</strong> এর ফলাফল নিচে প্রদর্শিত হলো
            </p>

            {/* Main Score Block */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '22px',
              border: '1px solid #e2e8f0',
              maxWidth: '480px',
              margin: '0 auto 26px'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                অর্জিত মোট নম্বর
              </div>
              <div style={{
                fontSize: '2.8rem',
                fontWeight: 800,
                color: '#059669',
                margin: '4px 0'
              }}>
                {marks.toFixed(2)} <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>/ {total}</span>
              </div>
              <div style={{ fontSize: '0.88rem', color: '#475569' }}>
                সঠিকতার হার (Accuracy): <strong style={{ color: isPassed ? '#059669' : '#d97706' }}>{accuracy.toFixed(1)}%</strong>
              </div>
            </div>

            {/* 4 Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              marginBottom: '28px'
            }}>
              <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 700 }}>সঠিক উত্তর</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46' }}>{correct}</div>
              </div>
              <div style={{ background: '#fff1f2', padding: '14px', borderRadius: '12px', border: '1px solid #fecdd3' }}>
                <div style={{ fontSize: '0.78rem', color: '#e11d48', fontWeight: 700 }}>ভুল উত্তর</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#9f1239' }}>{wrong}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 700 }}>উত্তর দেননি</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#334155' }}>{skipped}</div>
              </div>
              <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 700 }}>নেগেটিভ কর্তন</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#92400e' }}>-{negativePenalty.toFixed(2)}</div>
              </div>
            </div>

            {/* Actions: Print PDF, Retake, Upload New */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handlePrintPdf}
                className="btn-primary"
                style={{ padding: '10px 22px', fontSize: '0.92rem' }}
              >
                <Printer size={16} />
                <span>ফলাফল ও সমাধান PDF সেভ করুন</span>
              </button>

              <button
                onClick={() => {
                  setUserAnswers({});
                  setFlaggedQuestions({});
                  setCurrentIdx(0);
                  setSecondsLeft(durationMinutes * 60);
                  setTimerActive(examMode === 'exam' && durationMinutes > 0);
                  setStep('exam');
                }}
                className="btn-secondary"
                style={{ padding: '10px 20px', fontSize: '0.92rem' }}
              >
                <RotateCcw size={16} />
                <span>আবার পরীক্ষা দিন</span>
              </button>

              <button
                onClick={() => {
                  setStep('setup');
                  setQuestions([]);
                  setRawQuestions([]);
                  setFileName('');
                }}
                className="btn-secondary"
                style={{ padding: '10px 20px', fontSize: '0.92rem' }}
              >
                <UploadCloud size={16} />
                <span>নতুন ফাইল আপলোড</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
              সম্পূর্ণ প্রশ্ন ও সমাধান পর্যালোচনা ({questions.length} টি)
            </h3>

            {questions.map((q, idx) => {
              const userSelected = userAnswers[idx];
              const isCorrect = userSelected && userSelected.trim() === q.correct_answer.trim();
              const isWrong = userSelected && userSelected.trim() !== q.correct_answer.trim();
              const isSkipped = !userSelected;

              let statusBg = '#f8fafc';
              let statusBorder = '#cbd5e1';
              let statusBadge = <span className="badge badge-cyan">উত্তর দেননি</span>;

              if (isCorrect) {
                statusBg = '#ffffff';
                statusBorder = '#10b981';
                statusBadge = <span className="badge badge-emerald">✓ সঠিক উত্তর (+১.০০)</span>;
              } else if (isWrong) {
                statusBg = '#ffffff';
                statusBorder = '#f43f5e';
                statusBadge = <span className="badge badge-amber" style={{ background: '#fff1f2', color: '#e11d48' }}>✗ ভুল উত্তর (-{negativeMarks})</span>;
              }

              return (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '22px',
                    marginBottom: '16px',
                    background: statusBg,
                    borderLeft: `5px solid ${statusBorder}`,
                    borderRadius: '14px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#64748b' }}>
                      #{idx + 1} • {q.subject || 'সাধারণ'}
                    </div>
                    <div>{statusBadge}</div>
                  </div>

                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px', lineHeight: '1.5' }}>
                    <FormattedContent content={q.question} />
                  </div>

                  {/* Options */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '12px' }}>
                    {q.options.map((opt, oIdx) => {
                      const isThisCorrect = opt.trim() === q.correct_answer.trim();
                      const isThisSelected = userSelected && opt.trim() === userSelected.trim();

                      let optBg = '#ffffff';
                      let optBorder = '#e2e8f0';
                      let optColor = '#334155';

                      if (isThisCorrect) {
                        optBg = '#ecfdf5';
                        optBorder = '#059669';
                        optColor = '#065f46';
                      } else if (isThisSelected) {
                        optBg = '#fff1f2';
                        optBorder = '#f43f5e';
                        optColor = '#9f1239';
                      }

                      return (
                        <div
                          key={oIdx}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: `1.5px solid ${optBorder}`,
                            background: optBg,
                            color: optColor,
                            fontSize: '0.88rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px'
                          }}
                        >
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong>({OPTION_LABELS[oIdx] || oIdx + 1})</strong>
                            <FormattedContent content={opt} inline />
                          </div>
                          <div style={{ flexShrink: 0 }}>
                            {isThisCorrect && <strong style={{ color: '#059669', fontSize: '0.82rem' }}>[সঠিক উত্তর]</strong>}
                            {isThisSelected && !isThisCorrect && <strong style={{ color: '#e11d48', fontSize: '0.82rem' }}>[আপনার উত্তর]</strong>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div style={{
                      background: '#f8fafc',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      borderLeft: '4px solid #0284c7',
                      fontSize: '0.9rem',
                      color: '#334155',
                      lineHeight: '1.65'
                    }}>
                      <strong style={{ color: '#0369a1', display: 'block', marginBottom: '4px' }}>ব্যাখ্যা:</strong>
                      <FormattedContent content={q.explanation} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
