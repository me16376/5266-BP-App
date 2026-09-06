'use client';

import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { convertBijoyToUnicode, looksLikeBijoy, shouldConvertAsBijoy } from 'bijoy2unicode';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertCircle,
  Table as TableIcon,
  Maximize2,
  Minimize2,
  FileCode,
  FileText,
  FileBox,
  Type,
  Wand2,
  Sliders,
  Languages
} from 'lucide-react';

const BANGLA_FONTS = [
  { 
    id: 'hind', 
    name: 'হিন্দ শিলিগুড়ি (Hind Siliguri)', 
    family: "'Hind Siliguri', sans-serif",
    badge: 'ডিফল্ট'
  },
  { 
    id: 'kalpurush', 
    name: 'কালপুরুষ (Kalpurush / Classic)', 
    family: "'Kalpurush', 'SolaimanLipi', 'Hind Siliguri', sans-serif",
    badge: 'জনপ্রিয়'
  },
  { 
    id: 'solaiman', 
    name: 'সোলাইমান লিপি (SolaimanLipi)', 
    family: "'SolaimanLipi', 'Kalpurush', 'Hind Siliguri', sans-serif",
    badge: 'ক্লিন'
  },
  { 
    id: 'nikosh', 
    name: 'নিকোশ (Nikosh / Govt)', 
    family: "'Nikosh', 'SolaimanLipi', 'Hind Siliguri', sans-serif",
    badge: 'সরকারি'
  },
  { 
    id: 'noto', 
    name: 'নোটো সান্স বাংলা (Noto Sans)', 
    family: "'Noto Sans Bengali', sans-serif",
    badge: 'আধুনিক'
  },
  { 
    id: 'anek', 
    name: 'আনেক বাংলা (Anek Bangla)', 
    family: "'Anek Bangla', sans-serif",
    badge: 'স্টাইলিশ'
  },
  { 
    id: 'tiro', 
    name: 'তিরো বাংলা (Tiro Bangla)', 
    family: "'Tiro Bangla', serif",
    badge: 'সেরিফ'
  },
  { 
    id: 'serif', 
    name: 'নোটো সেরিফ বাংলা (Noto Serif)', 
    family: "'Noto Serif Bengali', serif",
    badge: 'বইয়ের ফন্ট'
  }
];

// Reusable complete font assets for print & popup PDF generation
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

export default function TableStudio() {
  const [fileData, setFileData] = useState(null); // { fileName, fileSize, fileType, sheets: [{ name, headers, rows }] }
  const [rawFileData, setRawFileData] = useState(null); // original untransformed data
  const [docxHtml, setDocxHtml] = useState(null);
  const [rawDocxHtml, setRawDocxHtml] = useState(null); // original untransformed html
  
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Bangla Typography & Reader Controls
  const [selectedFontId, setSelectedFontId] = useState('hind');
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState('1.8');
  const [isBijoyConverted, setIsBijoyConverted] = useState(false);
  const [bijoyDetected, setBijoyDetected] = useState(false);

  // Active font object
  const activeFont = useMemo(() => {
    return BANGLA_FONTS.find(f => f.id === selectedFontId) || BANGLA_FONTS[0];
  }, [selectedFontId]);

  // Ensure all Bangla web font stylesheets are injected into document.head
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

  // Convert Docx HTML text nodes from Bijoy (ANSI) to Unicode
  const convertDocxHtmlToUnicode = (html) => {
    if (!html || typeof window === 'undefined') return html;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const walk = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const val = node.nodeValue;
          if (val && val.trim() && shouldConvertAsBijoy(val)) {
            node.nodeValue = convertBijoyToUnicode(val);
          }
        } else {
          node.childNodes.forEach(child => walk(child));
        }
      };
      
      walk(doc.body);
      return doc.body.innerHTML;
    } catch (e) {
      console.error('Docx Bijoy conversion error:', e);
      return html;
    }
  };

  // Convert Table data from Bijoy (ANSI) to Unicode
  const convertTableToUnicode = (data) => {
    if (!data || !data.sheets) return data;
    return {
      ...data,
      sheets: data.sheets.map(sheet => ({
        ...sheet,
        name: shouldConvertAsBijoy(sheet.name || '') ? convertBijoyToUnicode(sheet.name) : sheet.name,
        headers: sheet.headers.map(h => shouldConvertAsBijoy(h || '') ? convertBijoyToUnicode(h) : h),
        rows: sheet.rows.map(row => row.map(cell => {
          if (cell === null || cell === undefined) return '';
          const str = String(cell);
          return shouldConvertAsBijoy(str) ? convertBijoyToUnicode(str) : str;
        }))
      }))
    };
  };

  // Toggle Bijoy to Unicode conversion
  const handleToggleBijoy = () => {
    if (fileData?.fileType === 'docx') {
      if (!isBijoyConverted) {
        const sourceHtml = rawDocxHtml || docxHtml;
        const converted = convertDocxHtmlToUnicode(sourceHtml);
        setDocxHtml(converted);
        setIsBijoyConverted(true);
      } else {
        if (rawDocxHtml) {
          setDocxHtml(rawDocxHtml);
        }
        setIsBijoyConverted(false);
      }
    } else if (fileData) {
      if (!isBijoyConverted) {
        const sourceData = rawFileData || fileData;
        const converted = convertTableToUnicode(sourceData);
        setFileData(converted);
        setIsBijoyConverted(true);
      } else {
        if (rawFileData) {
          setFileData(rawFileData);
        }
        setIsBijoyConverted(false);
      }
    }
  };

  // Parse uploaded file (Excel, CSV, JSON, DOCX)
  const processFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSearchQuery('');
    setSortConfig({ key: null, direction: 'asc' });
    setCurrentPage(1);
    setDocxHtml(null);
    setRawDocxHtml(null);
    setIsBijoyConverted(false);
    setBijoyDetected(false);

    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(1) + ' KB';
    const ext = fileName.split('.').pop().toLowerCase();

    try {
      if (ext === 'docx') {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        
        if (!result.value || result.value.trim() === '') {
          throw new Error('Word ডকুমেন্টটিতে কোনো লেখা পাওয়া যায়নি।');
        }

        const rawHtml = result.value;

        // Check if the text looks like Bijoy/SutonnyMJ
        let looksBijoy = false;
        if (typeof window !== 'undefined') {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = rawHtml;
          const plainText = tempDiv.innerText || tempDiv.textContent || '';
          looksBijoy = looksLikeBijoy(plainText.slice(0, 2000)) || shouldConvertAsBijoy(plainText.slice(0, 2000));
        }

        setRawDocxHtml(rawHtml);
        setBijoyDetected(looksBijoy);

        if (looksBijoy) {
          const converted = convertDocxHtmlToUnicode(rawHtml);
          setDocxHtml(converted);
          setIsBijoyConverted(true);
        } else {
          setDocxHtml(rawHtml);
          setIsBijoyConverted(false);
        }

        setFileData({
          fileName,
          fileSize,
          fileType: 'docx'
        });
      } else if (ext === 'json') {
        const text = await file.text();
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch (e) {
          throw new Error('JSON ফাইলটি সঠিকভাবে ফরম্যাট করা নয়: ' + e.message);
        }

        let headers = [];
        let rows = [];

        if (Array.isArray(parsed)) {
          if (parsed.length === 0) {
            headers = ['Status'];
            rows = [['ফাইলটি একটি খালি অ্যারে (Empty Array)']];
          } else if (typeof parsed[0] === 'object' && parsed[0] !== null) {
            const keySet = new Set();
            parsed.forEach(item => {
              if (typeof item === 'object' && item !== null) {
                Object.keys(item).forEach(k => keySet.add(k));
              }
            });
            headers = Array.from(keySet);
            rows = parsed.map(item => {
              return headers.map(h => {
                const val = item[h];
                if (val === null || val === undefined) return '';
                if (typeof val === 'object') return JSON.stringify(val);
                return String(val);
              });
            });
          } else {
            headers = ['Value'];
            rows = parsed.map(v => [String(v)]);
          }
        } else if (typeof parsed === 'object' && parsed !== null) {
          headers = ['Key (প্রোপার্টি)', 'Value (মান)'];
          rows = Object.entries(parsed).map(([k, v]) => [
            k,
            typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)
          ]);
        } else {
          headers = ['Data'];
          rows = [[String(parsed)]];
        }

        const dataObj = {
          fileName,
          fileSize,
          fileType: 'json',
          sheets: [{ name: 'JSON Data', headers, rows }]
        };

        // Check for Bijoy text
        const hasBijoy = headers.some(h => shouldConvertAsBijoy(h)) || 
                         rows.slice(0, 10).some(row => row.some(cell => shouldConvertAsBijoy(cell)));
        setBijoyDetected(hasBijoy);
        setRawFileData(dataObj);

        if (hasBijoy) {
          const converted = convertTableToUnicode(dataObj);
          setFileData(converted);
          setIsBijoyConverted(true);
        } else {
          setFileData(dataObj);
          setIsBijoyConverted(false);
        }

        setActiveSheetIdx(0);
      } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array', codepage: 65001 });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('এক্সেল ফাইলে কোনো শিট পাওয়া যায়নি।');
        }

        const sheets = workbook.SheetNames.map(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

          if (!rawData || rawData.length === 0) {
            return { name: sheetName, headers: ['Status'], rows: [['খালি শিট (Empty Sheet)']] };
          }

          const headers = rawData[0].map((h, i) => String(h || `কলাম ${i + 1}`).trim());
          const rows = rawData.slice(1).map(row => {
            return headers.map((_, colIdx) => {
              const cell = row[colIdx];
              return cell !== undefined && cell !== null ? String(cell) : '';
            });
          });

          return {
            name: sheetName,
            headers,
            rows
          };
        });

        // Check for Bijoy text
        let looksBijoy = false;
        for (const s of sheets) {
          if (s.headers.some(h => shouldConvertAsBijoy(h)) || 
              s.rows.slice(0, 10).some(row => row.some(cell => shouldConvertAsBijoy(cell)))) {
            looksBijoy = true;
            break;
          }
        }
        setBijoyDetected(looksBijoy);

        const dataObj = {
          fileName,
          fileSize,
          fileType: ext,
          sheets
        };

        setRawFileData(dataObj);

        if (looksBijoy) {
          const converted = convertTableToUnicode(dataObj);
          setFileData(converted);
          setIsBijoyConverted(true);
        } else {
          setFileData(dataObj);
          setIsBijoyConverted(false);
        }

        setActiveSheetIdx(0);
      } else {
        throw new Error('অনুগ্রহ করে .docx, .csv, .xlsx, .xls অথবা .json ফরম্যাটের ফাইল দিন।');
      }
    } catch (err) {
      console.error('File parsing error:', err);
      setError(err.message || 'ফাইলটি প্রসেস করতে সমস্যা হয়েছে।');
      setFileData(null);
      setRawFileData(null);
      setDocxHtml(null);
      setRawDocxHtml(null);
    } finally {
      setLoading(false);
    }
  };

  // Load sample demo data
  const loadDemoData = (type) => {
    setError(null);
    setIsBijoyConverted(false);
    setBijoyDetected(false);
    setSearchQuery('');
    setSortConfig({ key: null, direction: 'asc' });
    setCurrentPage(1);

    if (type === 'students') {
      const headers = ['রোল নং', 'নাম', 'বিভাগ', 'জিপিএ', 'পাসের সন', 'জেলা'];
      const rows = [
        ['১০০১', 'মোসাদ্দেক হোসেন', 'বিজ্ঞান', '৫.০০', '২০২৪', 'ঢাকা'],
        ['১০০২', 'ফারিহা জামান', 'মানবিক', '৪.৮৫', '২০২৪', 'চট্টগ্রাম'],
        ['১০০৩', 'তানভীর আহমেদ', 'ব্যবসায় শিক্ষা', '৪.৯২', '২০২৩', 'রাজশাহী'],
        ['১০০৪', 'সুমাইয়া আক্তার', 'বিজ্ঞান', '৫.০০', '২০২৪', 'খুলনা'],
        ['১০০৫', 'মাহমুদুল হাসান', 'বিজ্ঞান', '৪.৭৮', '২০২৩', 'সিলেট'],
        ['১০০৬', 'নুসরাত জাহান', 'মানবিক', '৪.৯০', '২০২৪', 'বরিশাল'],
        ['১০০৭', 'আসিফ ইকবাল', 'ব্যবসায় শিক্ষা', '৪.৬৫', '২০২৩', 'রংপুর'],
        ['১০০৮', 'মেহজাবিন হক', 'বিজ্ঞান', '৫.০০', '২০২৪', 'ময়মনসিংহ'],
        ['১০০৯', 'রাকিবুল ইসলাম', 'ব্যবসায় শিক্ষা', '৪.৯৫', '২০২৪', 'ঢাকা'],
        ['১০১০', 'শায়লা শারমিন', 'মানবিক', '৪.৮০', '২০২৩', 'কুমিল্লা']
      ];
      const dataObj = {
        fileName: 'demo_hsc_results.xlsx',
        fileSize: '14.2 KB',
        fileType: 'xlsx',
        sheets: [
          { name: 'ফলাফল তালিকা (Results)', headers, rows },
          { name: 'বিভাগীয় তথ্য', headers: ['বিভাগ', 'মোট পরীক্ষার্থী', 'পাসের হার'], rows: [['বিজ্ঞান', '৪৫০', '৯৮.২%'], ['মানবিক', '৩২০', '৯৪.৫%'], ['ব্যবসায় শিক্ষা', '২১০', '৯৬.১%']] }
        ]
      };
      setFileData(dataObj);
      setRawFileData(dataObj);
      setActiveSheetIdx(0);
    } else if (type === 'quiz') {
      const headers = ['আইডি', 'প্রশ্ন', 'ক', 'খ', 'গ', 'ঘ', 'সঠিক উত্তর'];
      const rows = [
        ['১', 'বাংলাদেশের সাংবিধানিক নাম কি?', 'বাংলাদেশ', 'গণপ্রজাতন্ত্রী বাংলাদেশ', 'ইসলামিক প্রজাতন্ত্র বাংলাদেশ', 'পিপলস বাংলাদেশ', 'গণপ্রজাতন্ত্রী বাংলাদেশ'],
        ['২', 'বঙ্গবন্ধুর ৭ই মার্চের ভাষণ ইউনেস্কোর কোন রেজিস্টারে অন্তর্ভুক্ত?', 'বিশ্ব ঐতিহ্য', 'মেমোরি অব দ্য ওয়ার্ল্ড', 'কালচারাল হেরিটেজ', 'ডকুমেন্টারি মেমোরি', 'মেমোরি অব দ্য ওয়ার্ল্ড'],
        ['৩', 'বাংলাদেশের জাতীয় সংসদ ভবনের স্থপতি কে?', 'এফ আর খান', 'লুই আই কান', 'মাজহারুল ইসলাম', 'হ্যামিলটন', 'লুই আই কান'],
        ['৪', 'মুজিবনগর সরকার কত তারিখে শপথ গ্রহণ করে?', '১০ এপ্রিল ১৯৭১', '১৭ এপ্রিল ১৯৭১', '২৬ মার্চ ১৯৭১', '১৬ ডিসেম্বর ১৯৭১', '১৭ এপ্রিল ১৯৭১'],
        ['৫', 'পদ্মা সেতুর দৈর্ঘ্য কত কিলোমিটার?', '৬.১৫ কিমি', '৫.৮০ কিমি', '৬.৫০ কিমি', '৭.০০ কিমি', '৬.১৫ কিমি']
      ];
      const dataObj = {
        fileName: 'demo_mcq_questions.json',
        fileSize: '8.4 KB',
        fileType: 'json',
        sheets: [{ name: 'MCQ প্রশ্নমালা', headers, rows }]
      };
      setFileData(dataObj);
      setRawFileData(dataObj);
      setActiveSheetIdx(0);
    } else if (type === 'docx') {
      const demoHtml = `
        <h2 style="color: #047857; margin-bottom: 12px; font-weight: 800;">বিসিএস ও সরকারি চাকরি প্রস্তুতি নির্দেশিকা (Demo Docx)</h2>
        <p><strong>বাংলাদেশ সরকারি কর্ম কমিশন (BPSC)</strong> পরিচালিত বিসিএস প্রিলিমিনারি ও অন্যান্য সরকারি নিয়োগ পরীক্ষার জন্য একটি সুনির্দিষ্ট পাঠ্যপরিকল্পনা আবশ্যক।</p>
        
        <h3 style="color: #0f172a; margin-top: 24px; margin-bottom: 12px; font-weight: 700;">১. বিষয়ভিত্তিক নম্বর বণ্টন:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left;">বিষয়</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: center;">নম্বর</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left;">গুরুত্বপূর্ণ অধ্যায়সমূহ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px; font-weight: 600;">বাংলা ভাষা ও সাহিত্য</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px; text-align: center;">৩৫</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px;">প্রাচীন ও মধ্যযুগ, আধুনিক সাহিত্যিকগণ, ব্যাকরণ ও শব্দার্থ</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px; font-weight: 600;">ইংরেজি ভাষা ও সাহিত্য</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px; text-align: center;">৩৫</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px;">Grammar rules, Vocabulary, Literary periods & authors</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px; font-weight: 600;">বাংলাদেশ বিষয়াবলি</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px; text-align: center;">৩০</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px;">মুক্তিযুদ্ধ, সংবিধান, অর্থনৈতিক সমীক্ষা ও সাম্প্রতিক তথ্য</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px; font-weight: 600;">আন্তর্জাতিক বিষয়াবলি</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px; text-align: center;">২০</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px;">বৈশ্বিক রাজনীতি, আন্তর্জাতিক সংস্থাসমূহ ও পরিবেশ চুক্তি</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px; font-weight: 600;">গাণিতিক যুক্তি ও মানসিক দক্ষতা</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px; text-align: center;">৩০</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 14px;">পাটিগণিত, বীজগণিত, জ্যামিতি ও লজিক্যাল রিজনিং</td>
            </tr>
          </tbody>
        </table>

        <h3 style="color: #0f172a; margin-top: 24px; margin-bottom: 12px; font-weight: 700;">২. পরীক্ষার কৌশল ও রিভিশন টিপস:</h3>
        <ul style="line-height: 1.8; color: #334155; padding-left: 20px;">
          <li>প্রতিদিন কমপক্ষে ৫০ থেকে ১০০টি বিগত পরীক্ষার MCQ প্রশ্ন ব্যাখ্যাসহ সমাধান করুন।</li>
          <li>কঠিন প্রশ্নগুলো বুকমার্ক করে রাখুন যাতে পরীক্ষার আগে দ্রুত রিভিশন দেওয়া যায়।</li>
          <li>টাইমার সেট করে নিয়মিত লাইভ মডেল টেস্ট দিয়ে নেগেটিভ মার্কিং কমানোর অভ্যাস গড়ে তুলুন।</li>
        </ul>
      `;
      setFileData({
        fileName: 'demo_study_guideline.docx',
        fileSize: '18.6 KB',
        fileType: 'docx'
      });
      setDocxHtml(demoHtml);
      setRawDocxHtml(demoHtml);
    } else if (type === 'bijoy') {
      // Demo showing SutonnyMJ / Bijoy text
      const bijoyHtml = `
        <h2 style="color: #047857; margin-bottom: 12px; font-weight: 800;">MYcÖRvZš¿x evsjv‡\`k miKvi</h2>
        <h3 style="color: #0f172a; margin-bottom: 16px; font-weight: 700;">evsjv‡\`k miKvix Kg© Kwgkb (wewcGmwm)</h3>
        <p><strong>welq:</strong> ৪৬Zg wewcGm cixÿvi weMZ mv‡ji cÖkœ I DËigvjv (weRq/myZšœxGg‡R d›U ডেমো)</p>
        <p><em>নিচের প্রশ্নগুলো পুরাতন বিজয়/সুতন্নীএমজে ফন্টে লেখা। উপরে "বিজয় ➔ ইউনিকোড" বাটনে চাপ দিয়ে প্রমিত বাংলা ইউনিকোডে রূপান্তর করে সহজে পড়ুন।</em></p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: center;">µwgK</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left;">cÖkœ</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left;">mwVK DËi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: center;">১</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">evsjv‡\`‡ki RvZxq msm\` feb Gi ¯’cwZ †K?</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: bold;">jyB AvB Kvb</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: center;">২</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">gywRebMi miKvi KZ Zvwi‡L kc_ MÖnY K‡i?</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: bold;">১৭ GwcÖj ১৯৭১</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: center;">৩</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">cÙv †mZzi ˆ\`N©¨ KZ wK‡jvwgUvi?</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: bold;">৬.১৫ wKwg</td>
            </tr>
          </tbody>
        </table>
      `;
      setFileData({
        fileName: 'demo_bijoy_question_bank.docx',
        fileSize: '15.2 KB',
        fileType: 'docx'
      });
      setRawDocxHtml(bijoyHtml);
      const converted = convertDocxHtmlToUnicode(bijoyHtml);
      setDocxHtml(converted);
      setBijoyDetected(true);
      setIsBijoyConverted(true);
    }
  };

  // Active sheet data (for tables)
  const currentSheet = fileData?.sheets ? fileData.sheets[activeSheetIdx] || { headers: [], rows: [] } : { headers: [], rows: [] };

  // Filtered rows based on search
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return currentSheet.rows;
    const query = searchQuery.toLowerCase().trim();
    return currentSheet.rows.filter(row => {
      return row.some(cell => cell.toLowerCase().includes(query));
    });
  }, [currentSheet.rows, searchQuery]);

  // Sorted rows
  const sortedRows = useMemo(() => {
    if (sortConfig.key === null) return filteredRows;
    const colIdx = sortConfig.key;
    const sorted = [...filteredRows].sort((a, b) => {
      const valA = a[colIdx] || '';
      const valB = b[colIdx] || '';
      
      const numA = parseFloat(valA);
      const numB = parseFloat(valB);
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
      }
      return sortConfig.direction === 'asc' 
        ? valA.localeCompare(valB, 'bn-BD')
        : valB.localeCompare(valA, 'bn-BD');
    });
    return sorted;
  }, [filteredRows, sortConfig]);

  // Paginated rows
  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  // Handle Sort
  const handleSort = (colIdx) => {
    setSortConfig(prev => {
      if (prev.key === colIdx) {
        return {
          key: colIdx,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key: colIdx, direction: 'asc' };
    });
  };

  // Export Table to PDF (High Quality Print-to-PDF with Selected Bengali Font)
  const exportTableToPdf = () => {
    if (!currentSheet || currentSheet.headers.length === 0) return;

    const headersHtml = currentSheet.headers.map(h => `<th style="border: 1px solid #cbd5e1; padding: 8px 10px; background: #f1f5f9; font-weight: bold; text-align: left;">${h}</th>`).join('');
    const rowsHtml = sortedRows.map((row, rIdx) => {
      const bg = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
      const cells = row.map(cell => `<td style="border: 1px solid #cbd5e1; padding: 6px 10px;">${cell || '—'}</td>`).join('');
      return `<tr style="background: ${bg};"><td style="border: 1px solid #cbd5e1; padding: 6px 10px; text-align: center; color: #64748b; font-size: 11px;">${rIdx + 1}</td>${cells}</tr>`;
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
          <title>${fileData.fileName} - PDF Export</title>
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
              <h1 class="title">${fileData.fileName}</h1>
              <div class="meta">শিট: <strong>${currentSheet.name}</strong> | ফন্ট: <strong>${activeFont.name}</strong> | মোট সারি: <strong>${sortedRows.length}</strong> টি | তারিখ: ${new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="border: 1px solid #cbd5e1; padding: 8px 10px; background: #f1f5f9; font-weight: bold; text-align: center; width: 40px;">#</th>
                ${headersHtml}
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

  // Export DOCX to PDF (Selected Bengali Font)
  const exportDocxToPdf = () => {
    if (!docxHtml) return;

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
          <title>${fileData.fileName} - PDF Export</title>
          ${FONT_ASSETS_HTML}
          <style>
            body {
              font-family: ${activeFont.family};
              padding: 40px;
              color: #1e293b;
              line-height: ${lineHeight};
              font-size: ${fontSize}px;
              margin: 0;
            }
            * {
              font-family: inherit !important;
            }
            .header-bar {
              border-bottom: 2px solid #0284c7;
              padding-bottom: 12px;
              margin-bottom: 24px;
            }
            .title { font-size: 22px; font-weight: bold; color: #0369a1; margin: 0; }
            .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: ${Math.max(12, fontSize - 2)}px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background: #f8fafc; font-weight: bold; }
            h1, h2, h3, h4 { color: #0f172a; margin-top: 20px; }
            p { margin: 8px 0; }
            @media print {
              body { padding: 0; }
              @page { size: auto; margin: 12mm; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <h1 class="title">${fileData.fileName}</h1>
            <div class="meta">ফন্ট: <strong>${activeFont.name}</strong> | রপ্তানির তারিখ: ${new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div class="content-body">
            ${docxHtml}
          </div>
          ${TRIGGER_PRINT_SCRIPT}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Export to CSV
  const exportToCsv = () => {
    if (!currentSheet || currentSheet.headers.length === 0) return;
    const ws = XLSX.utils.aoa_to_sheet([currentSheet.headers, ...sortedRows]);
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileData.fileName.split('.')[0]}_${currentSheet.name}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export to JSON
  const exportToJson = () => {
    if (!currentSheet || currentSheet.headers.length === 0) return;
    const jsonObj = sortedRows.map(row => {
      const item = {};
      currentSheet.headers.forEach((h, i) => {
        item[h] = row[i] || '';
      });
      return item;
    });

    const blob = new Blob([JSON.stringify(jsonObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileData.fileName.split('.')[0]}_${currentSheet.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy Docx text
  const handleCopyDocx = () => {
    if (!docxHtml) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = docxHtml;
    const plainText = tempDiv.innerText || tempDiv.textContent || '';
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render Bangla Typography Toolbar
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
      marginBottom: '18px'
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

  return (
    <div style={{
      position: isFullScreen ? 'fixed' : 'relative',
      top: isFullScreen ? 0 : 'auto',
      left: isFullScreen ? 0 : 'auto',
      right: isFullScreen ? 0 : 'auto',
      bottom: isFullScreen ? 0 : 'auto',
      zIndex: isFullScreen ? 9999 : 'auto',
      background: isFullScreen ? '#ffffff' : 'transparent',
      padding: isFullScreen ? '24px' : '0',
      overflowY: isFullScreen ? 'auto' : 'visible'
    }}>
      {/* Upload Zone */}
      {!fileData && (
        <div>
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processFile(e.dataTransfer.files[0]);
              }
            }}
            style={{
              border: '2px dashed #34d399',
              borderRadius: '16px',
              padding: '48px 24px',
              textAlign: 'center',
              background: '#f0fdf4',
              cursor: 'pointer',
              marginBottom: '28px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.05)'
            }}
          >
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.15)'
            }}>
              <FileSpreadsheet size={34} color="#059669" />
            </div>

            <h3 style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>
              Word (.docx), Excel (.xlsx, .xls), CSV অথবা JSON ফাইল ড্রপ করুন
            </h3>
            <p style={{ color: '#475569', fontSize: '0.94rem', marginBottom: '22px', maxWidth: '640px', margin: '0 auto 22px' }}>
              যেকোনো Word ডকুমেন্ট, স্প্রেডশিট বা ডেটাসেট সরাসরি ঝকঝকে বাংলা ফন্টে পড়ুন, বিজয় ফন্ট কনভার্ট করুন এবং <strong>এক ক্লিকে PDF হিসেবে সেভ বা এক্সপোর্ট করুন</strong>।
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <span className="badge badge-cyan" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                <FileBox size={13} /> Word (.docx)
              </span>
              <span className="badge badge-emerald" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                <FileSpreadsheet size={13} /> Excel (.xlsx, .xls)
              </span>
              <span className="badge badge-cyan" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                <FileText size={13} /> CSV ফাইল (.csv)
              </span>
              <span className="badge badge-amber" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                <FileCode size={13} /> JSON ডেটা (.json)
              </span>
              <span className="badge badge-emerald" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                <Languages size={13} /> বাংলা ফন্ট ও বিজয় সাপোর্ট
              </span>
            </div>

            <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', padding: '12px 24px', fontSize: '0.96rem' }}>
              <UploadCloud size={20} />
              <span>ফাইল নির্বাচন করুন</span>
              <input 
                type="file" 
                accept=".docx,.xlsx,.xls,.csv,.json" 
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {/* Demo Loaders */}
          <div className="glass-panel" style={{ padding: '20px 24px', background: '#ffffff', textAlign: 'center' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569', marginRight: '12px' }}>
              ফাইল না থাকলে ডেমো ডেটা দিয়ে টেস্ট করুন:
            </span>
            <div style={{ display: 'inline-flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
              <button 
                onClick={() => loadDemoData('docx')} 
                className="btn-secondary" 
                style={{ fontSize: '0.84rem', padding: '6px 14px' }}
              >
                📄 ডেমো Word ডকুমেন্ট (.docx)
              </button>
              <button 
                onClick={() => loadDemoData('students')} 
                className="btn-secondary" 
                style={{ fontSize: '0.84rem', padding: '6px 14px' }}
              >
                📊 ডেমো এক্সেল শিট (.xlsx)
              </button>
              <button 
                onClick={() => loadDemoData('quiz')} 
                className="btn-secondary" 
                style={{ fontSize: '0.84rem', padding: '6px 14px' }}
              >
                📝 ডেমো JSON ডেটা (.json)
              </button>
              <button 
                onClick={() => loadDemoData('bijoy')} 
                className="btn-secondary" 
                style={{ fontSize: '0.84rem', padding: '6px 14px', border: '1px solid #f59e0b', color: '#b45309', background: '#fffbeb' }}
                title="পুরাতন বিজয় ফন্ট টেস্ট করুন"
              >
                🔄 বিজয় (SutonnyMJ) ডেমো
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <RefreshCw size={28} className="animate-spin" color="#059669" style={{ margin: '0 auto 12px' }} />
          <div style={{ color: '#059669', fontWeight: 700, fontSize: '1rem' }}>
            ফাইল প্রসেস করা হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।
          </div>
        </div>
      )}

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

      {/* VIEW 1: DOCX DOCUMENT VIEWER */}
      {fileData && fileData.fileType === 'docx' && (
        <div className="glass-panel" style={{
          padding: '28px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Docx Header Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            paddingBottom: '18px',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '18px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span className="badge badge-cyan">
                  <FileBox size={13} /> WORD (.DOCX)
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {fileData.fileName}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ({fileData.fileSize})
                </span>
              </div>
            </div>

            {/* Docx Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={exportDocxToPdf} 
                className="btn-primary" 
                style={{ fontSize: '0.88rem', padding: '8px 18px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                title="নির্বাচিত বাংলা ফন্ট সহ ডকুমেন্টটি PDF হিসেবে প্রিন্ট বা সেভ করুন"
              >
                <Printer size={16} />
                <span>PDF হিসেবে সেভ করুন</span>
              </button>

              <button 
                onClick={handleCopyDocx} 
                className="btn-secondary" 
                style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                title="সম্পূর্ণ টেক্সট ক্লিপবোর্ডে কপি করুন"
              >
                {copied ? <Check size={16} color="#059669" /> : <Copy size={16} />}
                <span>{copied ? 'কপি হয়েছে' : 'টেক্সট কপি'}</span>
              </button>

              <button 
                onClick={() => setFileData(null)} 
                className="btn-secondary" 
                style={{ fontSize: '0.85rem', padding: '8px 14px' }}
              >
                <UploadCloud size={16} />
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
                      ? '✓ ফাইলটিতে বিজয় (SutonnyMJ) ফন্ট ছিল এবং স্বয়ংক্রিয়ভাবে ইউনিকোডে রূপান্তর করা হয়েছে!'
                      : '💡 ফাইলটিতে বিজয় (SutonnyMJ/ANSI) ফন্ট শনাক্ত হয়েছে!'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: isBijoyConverted ? '#047857' : '#b45309' }}>
                    {isBijoyConverted 
                      ? 'এখন স্পষ্ট বাংলা ফন্টে পড়তে ও PDF করতে পারবেন। চাইলে মূল বিজয়েও দেখতে পারেন।'
                      : 'লেখাগুলো স্পষ্ট ও প্রমিত ইউনিকোড বাংলায় পড়তে রূপান্তর করুন।'}
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

          {/* Bangla Typography & Controls Toolbar */}
          {renderBanglaToolbar()}

          {/* Docx Document Content Canvas */}
          <div 
            className="docx-content-canvas"
            style={{
              fontFamily: activeFont.family,
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              background: '#ffffff',
              padding: '36px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              color: '#1e293b',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              maxHeight: '700px',
              overflowY: 'auto'
            }}
            dangerouslySetInnerHTML={{ __html: docxHtml }}
          />
        </div>
      )}

      {/* VIEW 2: SPREADSHEET / TABLE VIEWER (Excel, CSV, JSON) */}
      {fileData && fileData.fileType !== 'docx' && (
        <div className="glass-panel" style={{
          padding: '24px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Top Bar: Title & Actions */}
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
                background: fileData.fileType === 'json' ? '#fef3c7' : '#dcfce7',
                color: fileData.fileType === 'json' ? '#d97706' : '#059669'
              }}>
                {fileData.fileType === 'json' ? <FileCode size={22} /> : <FileSpreadsheet size={22} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    {fileData.fileName}
                  </h3>
                  <span className="badge badge-emerald" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {fileData.fileType}
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  সাইজ: {fileData.fileSize} • মোট সারি: <strong>{currentSheet.rows.length}</strong> টি • কলাম: <strong>{currentSheet.headers.length}</strong> টি
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
                onClick={() => setFileData(null)} 
                className="btn-primary" 
                style={{ fontSize: '0.82rem', padding: '7px 14px', background: '#0f172a' }}
              >
                <UploadCloud size={14} />
                <span>নতুন ফাইল</span>
              </button>
            </div>
          </div>

          {/* Bijoy Detection Banner for Tables */}
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

          {/* Bangla Typography Toolbar for Tables */}
          {renderBanglaToolbar()}

          {/* Multiple Sheets Navigation (for Excel) */}
          {fileData.sheets && fileData.sheets.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '12px',
              marginBottom: '16px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569', alignSelf: 'center', marginRight: '6px' }}>
                শিটসমূহ (Sheets):
              </span>
              {fileData.sheets.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveSheetIdx(idx);
                    setCurrentPage(1);
                    setSearchQuery('');
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: activeSheetIdx === idx ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                    background: activeSheetIdx === idx ? '#ecfdf5' : '#ffffff',
                    color: activeSheetIdx === idx ? '#047857' : '#475569',
                    fontWeight: activeSheetIdx === idx ? 700 : 500,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {s.name} ({s.rows.length})
                </button>
              ))}
            </div>
          )}

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
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
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

            {/* Pagination Controls */}
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

          {/* Table Container */}
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
                  {currentSheet.headers.map((header, colIdx) => {
                    const isSorted = sortConfig.key === colIdx;
                    return (
                      <th
                        key={colIdx}
                        onClick={() => handleSort(colIdx)}
                        style={{
                          padding: '12px 14px',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          color: isSorted ? '#059669' : '#1e293b',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          userSelect: 'none',
                          borderLeft: colIdx > 0 ? '1px solid #f1f5f9' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{header}</span>
                          {isSorted ? (
                            sortConfig.direction === 'asc' ? <ArrowUp size={14} color="#059669" /> : <ArrowDown size={14} color="#059669" />
                          ) : (
                            <ArrowUpDown size={13} color="#94a3b8" style={{ opacity: 0.6 }} />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={currentSheet.headers.length + 1} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      কোনো ফলাফল পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, rIdx) => {
                    const serial = (currentPage - 1) * pageSize + rIdx + 1;
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
                        {currentSheet.headers.map((_, colIdx) => (
                          <td 
                            key={colIdx} 
                            style={{
                              padding: '10px 14px',
                              color: '#334155',
                              borderLeft: colIdx > 0 ? '1px solid #f1f5f9' : 'none'
                            }}
                          >
                            {row[colIdx] !== undefined && row[colIdx] !== '' ? row[colIdx] : (
                              <span style={{ color: '#cbd5e1' }}>—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Bar */}
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
              মোট <strong>{filteredRows.length}</strong> টির মধ্যে <strong>{filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> থেকে <strong>{Math.min(currentPage * pageSize, filteredRows.length)}</strong> নং সারি প্রদর্শিত হচ্ছে
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
      )}
    </div>
  );
}
