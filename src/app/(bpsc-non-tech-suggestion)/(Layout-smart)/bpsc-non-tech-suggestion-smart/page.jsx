'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';
import './style.css';
import { getBpscNonTechSuggestionCatalog, cleanBpscNonTechSuggestionTitle } from '../../../../lib/bpscNonTechSuggestionData';
import { matchesExamSearch, getQueryBengaliSuggestions } from '../../../../lib/searchUtils';
import { useAuth } from '../../../../lib/authContext';

// Digits mapping
const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBengaliNumber = (num) => {
  if (num === undefined || num === null) return '০';
  return String(num).replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
};

const toEnglishNumberStr = (str) => {
  const enDigits = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  return String(str || '').replace(/[০-৯]/g, (d) => enDigits[d] || d);
};

const toBengaliNumberStr = (str) => {
  return String(str || '').replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
};

// Initial Categories for Question Bank Smart
const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল বিষয়' },
  { id: 'bangla-byakoron', label: 'বাংলা ব্যাকরণ (১৪ অধ্যায়)', matchKey: 'bangla-byakoron' },
  { id: 'bangla-sahitya', label: 'বাংলা সাহিত্য (৫ অধ্যায়)', matchKey: 'bangla-sahitya' },
  { id: 'english', label: 'English (১৮ অধ্যায়)', matchKey: 'english' },
  { id: 'math', label: 'গণিত (২৫ অধ্যায়)', matchKey: 'math' },
  { id: 'bangladesh-affairs', label: 'বাংলাদেশ বিষয়াবলি (১০ অধ্যায়)', matchKey: 'bangladesh-affairs' },
  { id: 'international-affairs', label: 'আন্তর্জাতিক বিষয়াবলি (১০ অধ্যায়)', matchKey: 'international-affairs' },
  { id: 'science', label: 'সাধারণ বিজ্ঞান (৮ অধ্যায়)', matchKey: 'science' },
  { id: 'ict', label: 'তথ্য প্রযুক্তি (১ অধ্যায়)', matchKey: 'ict' }
];

function BpscNonTechSuggestionSmartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthorized, loading: authLoading, logout } = useAuth();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const STORAGE_KEY_SMART_FILTERS = 'ujs_bpscs_smart_filters';

  const [currentTag, setCurrentTag] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(36);

  // Helper to persist single filter item to localStorage
  const persistFilter = (key, val) => {
    if (typeof window === 'undefined') return;
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY_SMART_FILTERS);
      const prev = savedRaw ? JSON.parse(savedRaw) : {};
      prev[key] = val;
      localStorage.setItem(STORAGE_KEY_SMART_FILTERS, JSON.stringify(prev));
    } catch (e) {}
  };

  // Restore filters from URL or localStorage on mount/refresh
  useEffect(() => {
    try {
      const urlCat = searchParams.get('category');
      const urlQ = searchParams.get('q');
      const urlYear = searchParams.get('year');
      const urlSort = searchParams.get('sort');

      const savedRaw = localStorage.getItem(STORAGE_KEY_SMART_FILTERS);
      const saved = savedRaw ? JSON.parse(savedRaw) : null;

      const effectiveCat = urlCat || saved?.category;
      if (effectiveCat) setCurrentTag(effectiveCat);

      const effectiveQ = urlQ !== null && urlQ !== undefined ? urlQ : saved?.search;
      if (effectiveQ !== undefined && effectiveQ !== null) setSearchQuery(effectiveQ);

      const effectiveYear = urlYear || saved?.year;
      if (effectiveYear) setSelectedYear(effectiveYear);

      const effectiveSort = urlSort || saved?.sort;
      if (effectiveSort) setSortBy(effectiveSort);
    } catch (e) {
      console.warn('Failed to restore question bank smart filters:', e);
    }
  }, [searchParams]);

  // Suggested Bengali keywords when user types in English
  const activeSuggestions = useMemo(() => {
    return getQueryBengaliSuggestions(searchQuery);
  }, [searchQuery]);

  // Load Exams Catalog from /data/exams_index.json & map to smart card items
  useEffect(() => {
    let isMounted = true;

    getBpscNonTechSuggestionCatalog()
      .then((catalog) => {
        if (!isMounted) return;
        if (catalog && Array.isArray(catalog.exams) && catalog.exams.length > 0) {
          const mapped = catalog.exams.map((exam) => {
            const rawTitle = cleanBpscNonTechSuggestionTitle(exam.title);
            const qCount = exam.question_count || 100;

            let timeStr = '১ ঘণ্টা';
            if (qCount >= 180) timeStr = '২ ঘণ্টা';
            else if (qCount >= 140) timeStr = '১ ঘণ্টা ৩০ মিনিট';
            else if (qCount <= 50) timeStr = '৩০ মিনিট';
            else if (qCount <= 80) timeStr = '৪৫ মিনিট';

            const catId = (exam.category_id || '').toLowerCase();
            const catName = exam.category_name || '';

            let displayTag = '';
            if (catId === 'bangla') displayTag = 'বাংলা';
            else if (catId === 'english') displayTag = 'English';
            else if (catId === 'gk') displayTag = 'GK';
            else if (catId === 'math') displayTag = 'Math';

            let subjectStats = 'বিপিএসসি নন-টেক অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন';
            if (catId === 'bangla-byakoron') {
              subjectStats = 'বাংলা ব্যাকরণ: কারক, বিভক্তি, প্রত্যয়, বাক্য, সমাস ও শুদ্ধিকরণ';
            } else if (catId === 'bangla-sahitya') {
              subjectStats = 'বাংলা সাহিত্য: প্রাচীন, মধ্যযুগ, রবীন্দ্র-নজরুল ও আধুনিক যুগ';
            } else if (catId === 'english') {
              subjectStats = 'English: Grammar Rules, Completing Sentence, Degree & Literature';
            } else if (catId === 'math') {
              subjectStats = 'গণিত: পাটিগণিত, বীজগণিত, জ্যামিতি, পরিমিতি ও মানসিক দক্ষতা';
            } else if (catId === 'bangladesh-affairs') {
              subjectStats = 'বাংলাদেশ বিষয়াবলি: ইতিহাস, মুক্তিযুদ্ধ, সংবিধান ও অর্থনীতি';
            } else if (catId === 'international-affairs') {
              subjectStats = 'আন্তর্জাতিক বিষয়াবলি: রাজনীতি, কূটনীতি, চুক্তি, সংগঠন ও মুদ্রা';
            } else if (catId === 'science') {
              subjectStats = 'সাধারণ বিজ্ঞান: পদার্থ, রসায়ন, উদ্ভিদবিজ্ঞান, প্রাণিবিজ্ঞান ও দুর্যোগ';
            } else if (catId === 'ict') {
              subjectStats = 'তথ্য ও যোগাযোগ প্রযুক্তি: কম্পিউটার, ইন্টারনেট ও ডিজিটাল সিকিউরিটি';
            }

            const tags = [
              exam.category_id,
              catName,
              displayTag,
              rawTitle,
              toEnglishNumberStr(rawTitle)
            ].filter(Boolean);

            return {
              id: exam.slug || exam.id,
              slug: exam.slug || exam.id,
              year: rawTitle,
              category: catName || 'BPSC নন-টেক সাজেশন',
              categoryId: catId,
              date: 'সাজেশন',
              yearAD: '২০২৪',
              totalQ: qCount,
              time: timeStr,
              subjectStats: subjectStats,
              status: 'সম্পূর্ণ সমাধানসহ উপলব্ধ',
              tags: tags,
              displayTag: displayTag,
              rawYear: 0,
              rawExam: exam
            };
          });

          setBankData(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching question bank catalog:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Extract unique years
  const availableYears = useMemo(() => {
    const set = new Set();
    bankData.forEach((item) => {
      const yr = item.rawYear || (item.rawExam && item.rawExam.year);
      if (yr) set.add(yr);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [bankData]);

  // Helper to score an exam for sorting matching job-solution
  const getExamSortScore = (item) => {
    const exam = item.rawExam || {};
    const title = exam.title || item.year || '';
    const slug = exam.slug || item.slug || '';

    let editionNum = 0;
    let year = item.rawYear || exam.year || 0;
    const bnMatch = title.match(/([০-৯0-9]+)/);
    if (bnMatch) {
      editionNum = parseInt(toEnglishNumberStr(bnMatch[1]), 10) || 0;
    }

    const idVal = exam.id || item.id || '';
    const idNum = idVal ? parseInt(String(idVal).replace(/\D/g, ''), 10) || 0 : 0;

    return { editionNum, year, idNum };
  };

  // Filter Categories with live counts
  const categoriesWithCounts = useMemo(() => {
    return DEFAULT_CATEGORIES.map((cat) => {
      let count = 0;
      if (cat.id === 'All') {
        count = bankData.length;
      } else {
        count = bankData.filter((item) => {
          return item.categoryId === cat.matchKey || item.category === cat.label;
        }).length;
      }
      return { ...cat, count };
    });
  }, [bankData]);

  // Search & Filter Algorithm matching exact TopMCQBD engine
  const filteredData = useMemo(() => {
    const list = bankData.filter((item) => {
      const matchCat =
        currentTag === 'All' ||
        item.categoryId === currentTag ||
        item.category === currentTag ||
        (currentTag === 'bcs' && item.categoryId === 'bcs') ||
        (currentTag === 'bank' && item.categoryId === 'bank') ||
        (currentTag === 'primary' && item.categoryId === 'primary') ||
        (currentTag === 'ntrca' && item.categoryId === 'ntrca') ||
        (currentTag === 'ministry' && item.categoryId === 'ministry') ||
        (currentTag === 'admission' && item.categoryId === 'admission') ||
        (currentTag === 'subject' && item.categoryId === 'subject');

      if (!matchCat) return false;

      // Year filter
      if (selectedYear !== 'all') {
        const yr = item.rawYear || (item.rawExam && item.rawExam.year);
        if (yr !== parseInt(selectedYear, 10)) {
          return false;
        }
      }

      // Search Query filter
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const rawExamObj = item.rawExam || {
          title: item.year,
          slug: item.slug,
          category_name: item.category,
          year: item.rawYear
        };

        const matchEngine = matchesExamSearch(rawExamObj, searchQuery);
        if (!matchEngine) {
          const qBn = toBengaliNumberStr(q);
          const qClean = q.replace(/[-_\s]/g, '');
          const qSpaced = q.replace(/[-_]/g, ' ');
          const itemYearEn = toEnglishNumberStr(item.year).toLowerCase();
          const itemDateEn = toEnglishNumberStr(item.date).toLowerCase();

          const cleanNumQuery = q.replace(/(st|nd|rd|th)/g, '');
          const cleanNumQueryNoSymbol = cleanNumQuery.replace(/[-_\s]/g, '');

          const checkMatch = (targetStr) => {
            if (!targetStr) return false;
            const str = String(targetStr).toLowerCase();
            const strClean = str.replace(/[-_\s]/g, '');
            const strSpaced = str.replace(/[-_]/g, ' ');

            return (
              str.includes(q) ||
              str.includes(qBn) ||
              str.includes(qSpaced) ||
              strClean.includes(qClean) ||
              (cleanNumQuery && strClean.includes(cleanNumQueryNoSymbol))
            );
          };

          const textMatch =
            checkMatch(item.year) ||
            checkMatch(itemYearEn) ||
            checkMatch(item.date) ||
            checkMatch(itemDateEn) ||
            checkMatch(item.category) ||
            checkMatch(item.displayTag) ||
            checkMatch(item.subjectStats) ||
            (item.tags && item.tags.some((t) => checkMatch(t)));

          if (!textMatch) return false;
        }
      }

      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'questions') {
        return (b.totalQ || 0) - (a.totalQ || 0);
      }

      const scoreA = getExamSortScore(a);
      const scoreB = getExamSortScore(b);

      // If category has chapter/edition numbers, strictly sort by chapter
      if (scoreA.editionNum > 0 && scoreB.editionNum > 0) {
        if (scoreA.editionNum !== scoreB.editionNum) {
          return sortBy === 'newest'
            ? scoreA.editionNum - scoreB.editionNum
            : scoreB.editionNum - scoreA.editionNum;
        }
      }

      // Next compare Year if different
      if (scoreA.year !== scoreB.year && scoreA.year > 0 && scoreB.year > 0) {
        return sortBy === 'newest'
          ? scoreA.year - scoreB.year
          : scoreB.year - scoreA.year;
      }

      // Default fallback: match chapter sequence order
      return sortBy === 'newest'
        ? scoreA.idNum - scoreB.idNum
        : scoreB.idNum - scoreA.idNum;
    });
  }, [bankData, currentTag, selectedYear, searchQuery, sortBy]);

  // Slice visible items
  const visibleItems = useMemo(() => {
    return filteredData.slice(0, visibleCount);
  }, [filteredData, visibleCount]);

  // Chip click handler
  const handleChipClick = (val) => {
    if (!val) return;
    setSearchQuery(val);
    setVisibleCount(36);
    persistFilter('search', val);
  };

  // Navigate directly to explanation or exam without popup
  const handleExamAction = (action, item) => {
    const targetSlug = item.slug || item.id;
    const modeParam = action === 'exam' ? 'exam' : 'read';
    router.push(`/bpsc-non-tech-suggestion-smart-questions/?exam=${encodeURIComponent(targetSlug)}&mode=${modeParam}`);
  };

  // 1. Loading State while checking auth
  if (authLoading) {
    return (
      <div style={{ padding: '100px 20px', minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '24px 36px', display: 'inline-flex', alignItems: 'center', gap: '14px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ color: 'var(--emerald-600)', fontSize: '1.4rem' }}></i>
          <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>ব্যবহারকারীর অ্যাকাউন্ট যাচাই করা হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: User is not logged in -> Show Login view matching /job-solution/
  if (!user) {
    return (
      <div style={{ padding: '60px 16px 100px', minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{
          maxWidth: '620px',
          width: '100%',
          padding: '48px 32px',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 100%)',
            border: '2px solid #a7f3d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)'
          }}>
            <i className="fa-solid fa-lock" style={{ fontSize: '2.4rem', color: 'var(--emerald-600)' }}></i>
          </div>

          <span className="badge badge-emerald" style={{ marginBottom: '14px', padding: '6px 16px', fontSize: '0.84rem' }}>
            <i className="fa-solid fa-shield-halved" style={{ marginRight: '6px' }}></i> অ্যাক্সেস সীমাবদ্ধ
          </span>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', lineHeight: 1.3 }}>
            প্রশ্নব্যাংক স্মার্ট দেখতে লগইন প্রয়োজন
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '28px' }}>
            এই পেজের বিগত ২,১৫৪টি চাকরির স্মার্ট প্রশ্নভাণ্ডার ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন। শুধুমাত্র <strong>অনুমোদিত শিক্ষার্থী (Approved User)</strong> বা <strong>অ্যাডমিনিস্ট্রেটর</strong> ছাড়া এই পেজটি দেখা যাবে না।
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '18px 20px',
            textAlign: 'left',
            marginBottom: '28px',
            fontSize: '0.9rem',
            color: '#334155'
          }}>
            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--emerald-600)', marginRight: '8px' }}></i>
              অনুমোদিত অ্যাকাউন্টে যে সুবিধাসমূহ উন্মুক্ত হবে:
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>• ২,১৫৪টি বিসিএস, ব্যাংক, শিক্ষক ও সরকারি চাকরির বিগত প্রশ্নপত্র</li>
              <li>• স্মার্ট কাস্টমাইজেশন (লেআউট, হাইলাইট, ফন্ট ও কালার কন্ট্রোল)</li>
              <li>• তাৎক্ষণিক সঠিক উত্তর ও বিস্তারিত ব্যাখ্যাসহ সমাধান</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/profile"
              className="btn-primary"
              style={{ padding: '13px 28px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-right-to-bracket"></i>
              <span>লগইন বা সাইন আপ করুন</span>
            </Link>

            <Link
              href="/"
              className="btn-secondary"
              style={{ padding: '13px 24px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-house"></i>
              <span>হোম পেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. User logged in, but not approved (pending / suspended)
  if (user && !isAuthorized) {
    return (
      <div style={{ padding: '60px 16px 100px', minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{
          maxWidth: '620px',
          width: '100%',
          padding: '48px 32px',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid #fed7aa'
        }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: '#fffbeb',
            border: '2px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)'
          }}>
            <i className="fa-solid fa-hourglass-half" style={{ fontSize: '2.4rem', color: '#d97706' }}></i>
          </div>

          <span className="badge badge-amber" style={{ marginBottom: '14px', padding: '6px 16px', fontSize: '0.84rem' }}>
            <i className="fa-solid fa-clock" style={{ marginRight: '6px' }}></i> অ্যাকাউন্টের অনুমোদন বাকি
          </span>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', lineHeight: 1.3 }}>
            আপনার অ্যাকাউন্টটি এখনো অনুমোদিত হয়নি
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '24px' }}>
            প্রিয় <strong>{user.name}</strong>, আপনার অ্যাকাউন্টটি বর্তমানে পর্যালোচনার অধীনে রয়েছে। শুধুমাত্র <strong>অনুমোদিত শিক্ষার্থী (Approved User)</strong> বা <strong>অ্যাডমিনিস্ট্রেটর</strong> ছাড়া এই পেজটি দেখা যাবে না। সিস্টেম অ্যাডমিন অনুমোদন সম্পন্ন করার পর আপনি সকল প্রশ্ন ব্যাংকের তালিকা দেখতে পারবেন।
          </p>

          <div style={{
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '14px',
            padding: '16px 20px',
            textAlign: 'left',
            marginBottom: '28px',
            fontSize: '0.9rem',
            color: '#78350f'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>ইউজারনেম:</span>
              <strong>@{user.username}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>ইমেইল:</span>
              <strong>{user.email}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>বর্তমান স্ট্যাটাস:</span>
              <span className="badge badge-amber" style={{ fontSize: '0.78rem' }}>পেন্ডিং (অনুমোদনের অপেক্ষায়)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/profile"
              className="btn-primary"
              style={{ padding: '13px 26px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-user"></i>
              <span>প্রোফাইল স্ট্যাটাস দেখুন</span>
            </Link>

            <Link
              href="/"
              className="btn-secondary"
              style={{ padding: '13px 24px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-house"></i>
              <span>হোম পেজে যান</span>
            </Link>

            <button
              onClick={logout}
              className="btn-secondary"
              style={{ padding: '13px 22px', fontSize: '0.98rem', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="qb-demo-wrapper">
      <div className="qb-container">
        {/* Header Section */}
        <div className="header-section">
          <span className="badge-archive">
            <i className="fa-solid fa-book-open"></i>
            <span>BPSC নন-টেক সাজেশন হাব</span>
          </span>
          <h1 className="title-main">
            BPSC নন-টেক সাজেশন স্মার্ট প্রশ্নব্যাংক
          </h1>
          <p className="desc-sub">
            বিপিএসসি নন-ক্যাডার ও নন-টেক নিয়োগ পরীক্ষার ৮টি বিষয়ের ৯১টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও নির্ভুল ব্যাখ্যা।
          </p>
        </div>

        {/* Filters & Search Control Card */}
        <div className="filter-control-card">
          {/* Category Filter Pills */}
          <div className="pills-group" id="pillsGroup">
            {categoriesWithCounts.map((cat) => {
              const isActive = currentTag === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`filter-btn ${isActive ? 'active' : 'inactive'}`}
                  onClick={() => {
                    setCurrentTag(cat.id);
                    setVisibleCount(36);
                    persistFilter('category', cat.id);
                  }}
                >
                  <span>{cat.label}</span>
                  <span className="count-badge">{toBengaliNumber(cat.count)}</span>
                </button>
              );
            })}
          </div>

          {/* Search, Year & Sort Filters */}
          <div className="qb-search-filter-row">
            {/* Real-Time Search Box */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px', pointerEvents: 'none' }} />
              <input
                type="text"
                className="input-glass"
                id="searchInput"
                placeholder="অধ্যায় বা বিষয়ের নাম দিয়ে সার্চ করুন (যেমন: কারক, ইতিহাস, ত্রিকোণমিতি)..."
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  setVisibleCount(36);
                  persistFilter('search', val);
                }}
                style={{ paddingLeft: '42px', paddingRight: searchQuery ? '36px' : '14px', height: '46px' }}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setVisibleCount(36);
                    persistFilter('search', '');
                  }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    border: 'none',
                    background: 'transparent',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    lineHeight: 1
                  }}
                  title="ক্লিয়ার করুন"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Year Dropdown */}
            <div style={{ position: 'relative', width: '100%' }}>
              <select
                value={selectedYear}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedYear(val);
                  setVisibleCount(36);
                  persistFilter('year', val);
                }}
                className="input-glass"
                style={{ height: '46px', cursor: 'pointer' }}
              >
                <option value="all">সকল সাল (All Years)</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr} সাল
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div style={{ position: 'relative', width: '100%' }}>
              <select
                value={sortBy}
                onChange={(e) => {
                  const val = e.target.value;
                  setSortBy(val);
                  setVisibleCount(36);
                  persistFilter('sort', val);
                }}
                className="input-glass"
                style={{ height: '46px', cursor: 'pointer', fontWeight: 600, color: '#0f172a' }}
              >
                <option value="newest">অধ্যায় ক্রম (১ম ➔ ১০ম)</option>
                <option value="oldest">বিপরীত ক্রম (১০ম ➔ ১ম)</option>
                <option value="questions">প্রশ্ন সংখ্যা (বেশি থেকে কম)</option>
              </select>
            </div>
          </div>

          {/* Bilingual Search Hint / Recognized Bengali Terms */}
          {activeSuggestions.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px',
              fontSize: '0.82rem',
              color: 'var(--emerald-700, #047857)',
              background: '#ecfdf5',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #a7f3d0'
            }}>
              <Sparkles size={14} color="#10b981" />
              <span style={{ fontWeight: 600 }}>বাংলা রূপান্তর:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {activeSuggestions.map((sugg, idx) => (
                  <span
                    key={idx}
                    onClick={() => handleChipClick(sugg)}
                    style={{
                      fontSize: '0.78rem',
                      padding: '2px 8px',
                      background: '#d1fae5',
                      color: '#065f46',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {sugg}
                  </span>
                ))}
              </div>
              <span style={{ color: '#64748b', fontSize: '0.76rem' }}>(বাংলা টাইটেলে ম্যাচ করা হচ্ছে)</span>
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '28px', color: '#007bff', marginBottom: '14px' }}></i>
            <p style={{ fontWeight: 600, fontSize: '15px' }}>প্রশ্নব্যাংক লোড হচ্ছে...</p>
          </div>
        )}

        {/* Question Bank Cards Grid */}
        {!loading && filteredData.length > 0 && (
          <div className="cards-grid-layout" id="cardsGridLayout">
            {visibleItems.map((item) => {
              return (
                <div key={item.id} className="hub-card-item" data-id={item.id}>
                  <div>
                    {/* Header Chips with Search Tags */}
                    <div className="card-header-badges">
                      <span
                        className="category-chip"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChipClick(item.category);
                        }}
                        title="ক্লিক করে এই ক্যাটাগরিতে সার্চ করুন"
                      >
                        {item.category}
                      </span>
                      {item.displayTag && (
                        <span
                          className="tag-chip"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChipClick(item.displayTag);
                          }}
                          title="ক্লিক করে এই পদ/ব্যাচে সার্চ করুন"
                        >
                          {item.displayTag}
                        </span>
                      )}
                      {item.date && (
                        <span
                          className="tag-chip"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChipClick(item.yearAD || item.date);
                          }}
                          title="ক্লিক করে এই সালে সার্চ করুন"
                        >
                          {item.yearAD || item.date}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="card-exam-title">{item.year}</h3>

                    {/* Subject Breakdown Box */}
                    <div className="subject-breakdown-box">
                      {item.subjectStats}
                    </div>
                  </div>

                  <div>
                    {/* Meta Stats Row */}
                    <div className="meta-stats-row">
                      <span><strong>প্রশ্ন:</strong> {toBengaliNumber(item.totalQ)} টি</span>
                      <span><strong>সময়:</strong> {item.time}</span>
                      <span><strong>ক্যাটাগরি:</strong> {item.category}</span>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="card-buttons-flex">
                      <button
                        type="button"
                        className="btn-read-solution"
                        onClick={() => handleExamAction('read', item)}
                        title="প্রশ্নব্যাংক সমাধান পড়ুন"
                      >
                        <i className="fa-regular fa-folder-open"></i> <span>ব্যাখ্যা পড়ুন</span>
                      </button>
                      <button
                        type="button"
                        className="btn-start-exam"
                        onClick={() => handleExamAction('exam', item)}
                        title="পরীক্ষা দিন"
                      >
                        <span>পরীক্ষা দিন</span> <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {!loading && filteredData.length > visibleCount && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 36)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                color: '#007bff',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#eff6ff';
                e.currentTarget.style.borderColor = '#93c5fd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              <span>আরো পরীক্ষা দেখুন ({toBengaliNumber(filteredData.length - visibleCount)} টি বাকি)</span>
              <i className="fa-solid fa-angle-down"></i>
            </button>
          </div>
        )}

        {/* No Data Box */}
        {!loading && filteredData.length === 0 && (
          <div className="no-data-box" id="noDataBox" style={{ display: 'block', textAlign: 'center', padding: '50px 20px' }}>
            <p style={{ fontSize: '1.15rem', color: '#64748b', margin: 0, fontWeight: 600 }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '6px', color: '#f59e0b' }}></i> কোনো প্রশ্নব্যাংক পাওয়া যায়নি।
            </p>
            <button
              type="button"
              onClick={() => {
                setCurrentTag('All');
                setSelectedYear('all');
                setSortBy('newest');
                setSearchQuery('');
                setVisibleCount(36);
              }}
              style={{
                marginTop: '16px',
                padding: '8px 18px',
                borderRadius: '8px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BpscNonTechSuggestionSmartPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '32px', color: '#007bff' }}></i>
        <p style={{ marginTop: '16px', fontWeight: 600 }}>লোড হচ্ছে...</p>
      </div>
    }>
      <BpscNonTechSuggestionSmartContent />
    </Suspense>
  );
}
