'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Sparkles, Laptop, Cpu } from 'lucide-react';
import './style.css';
import { getIctCatalog, cleanIctTitle } from '../../../../lib/ictData';
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

// Initial Categories for ICT Smart (No 'সকল অধ্যায়' tab; every category has a 'সকল অধ্যায়' box inside)
const DEFAULT_CATEGORIES = [
  { id: 'class-9-10-computer-gk', label: 'Class 9-10 Computer GK', matchKey: 'class-9-10-computer-gk' },
  { id: 'ict-wizard-ntrca-313-and-325', label: 'ICT Wizard NTRCA (313 & 325)', matchKey: 'ict-wizard-ntrca-313-and-325' }
];

function IctSmartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthorized, loading: authLoading, logout } = useAuth();
  const initialCategory = searchParams.get('category') || 'class-9-10-computer-gk';
  const initialQuery = searchParams.get('q') || '';

  const STORAGE_KEY_SMART_FILTERS = 'ujs_ict_smart_filters';

  const [currentTag, setCurrentTag] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('default');
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(36);

  // Persist filter
  const persistFilter = (key, val) => {
    if (typeof window === 'undefined') return;
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY_SMART_FILTERS);
      const prev = savedRaw ? JSON.parse(savedRaw) : {};
      prev[key] = val;
      localStorage.setItem(STORAGE_KEY_SMART_FILTERS, JSON.stringify(prev));
    } catch (e) {}
  };

  // Restore filters from URL or localStorage
  useEffect(() => {
    try {
      const urlCat = searchParams.get('category');
      const urlQ = searchParams.get('q');
      const urlSort = searchParams.get('sort');

      const savedRaw = localStorage.getItem(STORAGE_KEY_SMART_FILTERS);
      const saved = savedRaw ? JSON.parse(savedRaw) : null;

      const effectiveCat = urlCat || saved?.category;
      if (effectiveCat && effectiveCat !== 'All') {
        setCurrentTag(effectiveCat);
      } else {
        setCurrentTag('class-9-10-computer-gk');
      }

      const effectiveQ = urlQ !== null && urlQ !== undefined ? urlQ : saved?.search;
      if (effectiveQ !== undefined && effectiveQ !== null) setSearchQuery(effectiveQ);

      const effectiveSort = urlSort || saved?.sort;
      if (effectiveSort) setSortBy(effectiveSort);
    } catch (e) {
      console.warn('Failed to restore ICT smart filters:', e);
    }
  }, [searchParams]);

  // Suggested Bengali keywords
  const activeSuggestions = useMemo(() => {
    return getQueryBengaliSuggestions(searchQuery);
  }, [searchQuery]);

  // Load ICT Catalog
  useEffect(() => {
    let isMounted = true;

    getIctCatalog()
      .then((catalog) => {
        if (!isMounted) return;
        if (catalog && Array.isArray(catalog.exams) && catalog.exams.length > 0) {
          const mapped = catalog.exams.map((exam) => {
            const rawTitle = cleanIctTitle(exam.title);
            const qCount = exam.question_count || 100;

            let timeStr = '১ ঘণ্টা';
            if (qCount >= 140) timeStr = '১ ঘণ্টা ৩০ মিনিট';
            else if (qCount <= 60) timeStr = '৪০ মিনিট';

            const catId = (exam.category_id || '').toLowerCase();
            const catLabel = catId.includes('class-9-10')
              ? 'Class 9-10 GK'
              : 'ICT Wizard NTRCA';

            // Display tag e.g. অধ্যায় ১, অধ্যায় ক
            let displayTag = '';
            const chMatch = rawTitle.match(/অধ্যায়-\s*([০-৯0-9ক-ছ]+)/);
            if (chMatch) {
              displayTag = `অধ্যায় ${chMatch[1]}`;
            }

            const subjectStats = catId.includes('class-9-10')
              ? 'নবম-দশম শ্রেণির কম্পিউটার ও তথ্যপ্রযুক্তি'
              : 'এনটিআরসিএ আইসিটি প্রভাষক ও শিক্ষক নিবন্ধন';

            const tags = [
              exam.category_id,
              catLabel,
              displayTag,
              rawTitle
            ].filter(Boolean);

            return {
              id: exam.slug || exam.id,
              slug: exam.slug || exam.id,
              year: rawTitle,
              category: catLabel,
              categoryId: catId,
              date: 'আইসিটি',
              totalQ: qCount,
              time: timeStr,
              subjectStats: subjectStats,
              status: 'সম্পূর্ণ সমাধানসহ উপলব্ধ',
              tags: tags,
              displayTag: displayTag,
              rawExam: exam
            };
          });

          setBankData(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching ICT smart catalog:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sorting score
  const getExamSortScore = (item) => {
    const title = item.year || '';
    const bnMatch = title.match(/অধ্যায়-\s*([০-৯0-9]+)/);
    if (bnMatch) {
      const bnMap = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
      const converted = bnMatch[1].replace(/[০-৯]/g, d => bnMap[d] || d);
      return parseInt(converted, 10) || 0;
    }
    const letterMap = { 'ক': 1, 'খ': 2, 'গ': 3, 'ঘ': 4, 'ঙ': 5, 'চ': 6, 'ছ': 7 };
    const letterMatch = title.match(/অধ্যায়-\s*([ক-ছ])/);
    if (letterMatch && letterMap[letterMatch[1]]) {
      return letterMap[letterMatch[1]];
    }
    return 0;
  };

  // Dynamic time calculation: 100 MCQs = 60 minutes
  const calcExamTimeStr = (totalQ) => {
    const totalMinutes = Math.round((totalQ * 60) / 100);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs > 0 && mins > 0) return `${toBengaliNumber(hrs)} ঘণ্টা ${toBengaliNumber(mins)} মিনিট`;
    if (hrs > 0) return `${toBengaliNumber(hrs)} ঘণ্টা`;
    return `${toBengaliNumber(mins)} মিনিট`;
  };

  // Filtered & Sorted Data
  const filteredData = useMemo(() => {
    const activeCat = DEFAULT_CATEGORIES.find((c) => c.id === currentTag) || DEFAULT_CATEGORIES[0];

    let list = bankData.filter((item) => {
      // Category tag match
      if (activeCat && activeCat.matchKey) {
        if (item.categoryId !== activeCat.matchKey) return false;
      } else if (item.category !== currentTag && item.categoryId !== currentTag) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = item.year.toLowerCase().includes(q);
        const catMatch = item.category.toLowerCase().includes(q);
        const tagMatch = item.tags.some((t) => String(t).toLowerCase().includes(q));

        if (!titleMatch && !catMatch && !tagMatch) {
          if (!matchesExamSearch(item.rawExam || { title: item.year }, searchQuery)) {
            return false;
          }
        }
      }

      return true;
    });

    const sorted = list.sort((a, b) => {
      if (sortBy === 'questions') {
        return (b.totalQ || 0) - (a.totalQ || 0);
      }
      if (sortBy === 'reverse') {
        return getExamSortScore(b) - getExamSortScore(a);
      }
      return getExamSortScore(a) - getExamSortScore(b);
    });

    // Add "সকল অধ্যায়" box as the first card in every category
    if (activeCat) {
      const q = searchQuery.toLowerCase().trim();
      const matchAll = !q || 'সকল অধ্যায়'.includes(q) || 'সকল'.includes(q) || (activeCat.label && activeCat.label.toLowerCase().includes(q));

      if (matchAll) {
        const categoryItems = bankData.filter(item => {
          if (activeCat.matchKey) return item.categoryId === activeCat.matchKey;
          return item.categoryId === activeCat.id;
        });
        const totalCatQ = categoryItems.reduce((sum, item) => sum + (item.totalQ || 0), 0);
        const isClass910 = activeCat.id.includes('class-9-10');

        const allCard = {
          id: `all-${activeCat.id}`,
          slug: `all-${activeCat.id}`,
          year: 'সকল অধ্যায়',
          category: isClass910 ? 'Class 9-10 GK' : 'ICT Wizard NTRCA',
          categoryId: activeCat.id,
          date: 'আইসিটি',
          totalQ: totalCatQ,
          time: calcExamTimeStr(totalCatQ),
          subjectStats: isClass910
            ? 'নবম-দশম শ্রেণির কম্পিউটার ও তথ্যপ্রযুক্তি'
            : 'এনটিআরসিএ আইসিটি প্রভাষক ও শিক্ষক নিবন্ধন',
          status: 'সম্পূর্ণ সমাধানসহ উপলব্ধ',
          tags: [activeCat.id, 'সকল অধ্যায়', 'সকল'],
          displayTag: 'সকল অধ্যায়',
          isAllCard: true
        };

        return [allCard, ...sorted];
      }
    }

    return sorted;
  }, [bankData, currentTag, searchQuery, sortBy]);

  const visibleItems = useMemo(() => {
    return filteredData.slice(0, visibleCount);
  }, [filteredData, visibleCount]);

  const handleChipClick = (val) => {
    if (!val) return;
    setSearchQuery(val);
    setVisibleCount(36);
    persistFilter('search', val);
  };

  const handleExamAction = (action, item) => {
    const targetSlug = item.slug || item.id;
    const modeParam = action === 'exam' ? 'exam' : 'read';
    router.push(`/ict-smart-questions/?exam=${encodeURIComponent(targetSlug)}&mode=${modeParam}`);
  };

  // 1. Loading State
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

  // 2. Unauthenticated
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
            আইসিটি স্মার্ট দেখতে লগইন প্রয়োজন
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '28px' }}>
            আইসিটির ১৭টি অধ্যায়ের ১,৭৫০+ স্মার্ট প্রশ্নভাণ্ডার ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন। শুধুমাত্র <strong>অনুমোদিত শিক্ষার্থী (Approved User)</strong> বা <strong>অ্যাডমিনিস্ট্রেটর</strong> ছাড়া এই পেজটি দেখা যাবে না।
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/profile" className="btn-primary" style={{ padding: '13px 28px', fontSize: '0.98rem' }}>
              <span>লগইন বা সাইন আপ করুন</span>
            </Link>
            <Link href="/" className="btn-secondary" style={{ padding: '13px 24px', fontSize: '0.98rem' }}>
              <span>হোম পেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. User logged in, but not approved
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
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
            আপনার অ্যাকাউন্টটি এখনো অনুমোদিত হয়নি
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginBottom: '24px' }}>
            সিস্টেম অ্যাডমিন অনুমোদন সম্পন্ন করার পর আপনি সকল আইসিটি অধ্যায় দেখতে পারবেন।
          </p>
          <Link href="/profile" className="btn-primary" style={{ padding: '13px 26px' }}>
            <span>প্রোফাইল স্ট্যাটাস দেখুন</span>
          </Link>
        </div>
      </div>
    );
  }

  // 4. Authorized
  return (
    <div className="qbank-smart-wrapper" style={{ minHeight: '85vh', background: '#f8fafc', padding: '30px 16px 80px' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top Header */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-cyan" style={{ padding: '5px 12px', fontSize: '0.85rem' }}>
              <Sparkles size={14} /> Layout Smart
            </span>
            <span style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>
              মোট ১৭টি অধ্যায়ের ১,৭৫৮টি প্রশ্নব্যাংক
            </span>
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            আইসিটি ও কম্পিউটার স্মার্ট প্রশ্নব্যাংক
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem', maxWidth: '680px', margin: '0 auto' }}>
            নবম-দশম শ্রেণির কম্পিউটার ও NTRCA ৩১৩/৩২৫ আইসিটি উইজার্ডের স্মার্ট প্র্যাকটিস ও ব্যাখ্যাসহ প্রস্তুতি
          </p>
        </div>

        {/* Filter Bar */}
        <div className="search-filter-card" style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          marginBottom: '28px'
        }}>
          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            paddingBottom: '16px',
            marginBottom: '16px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            {DEFAULT_CATEGORIES.map((cat) => {
              const isSelected = currentTag === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCurrentTag(cat.id);
                    setVisibleCount(36);
                    persistFilter('category', cat.id);
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: isSelected ? '1.5px solid #007bff' : '1px solid #cbd5e1',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    color: isSelected ? '#007bff' : '#475569',
                    boxShadow: isSelected ? '0 2px 8px rgba(0, 123, 255, 0.2)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(36);
                  persistFilter('search', e.target.value);
                }}
                placeholder="অধ্যায়ের নাম দিয়ে সার্চ করুন (যেমন: ইতিহাস, ডাটাবেজ)..."
                style={{
                  width: '100%',
                  height: '46px',
                  paddingLeft: '44px',
                  paddingRight: searchQuery ? '36px' : '14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
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
                    fontSize: '1rem'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setVisibleCount(36);
                  persistFilter('sort', e.target.value);
                }}
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="default">অধ্যায় ক্রমানুসারে (১ম ➔ ১০ম / ক ➔ ছ)</option>
                <option value="reverse">অধ্যায় উল্টো ক্রমে (১০ম ➔ ১ম)</option>
                <option value="questions">প্রশ্ন সংখ্যা (বেশি থেকে কম)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', color: '#64748b', fontSize: '0.9rem' }}>
          <div>পাওয়া গেছে: <strong style={{ color: '#0f172a' }}>{toBengaliNumber(filteredData.filter((i) => !i.isAllCard).length)}</strong> টি অধ্যায়</div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#007bff', fontWeight: 600 }}>
            লোড হচ্ছে...
          </div>
        ) : (
          <div className="qbank-grid-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '18px'
          }}>
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="qbank-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '20px',
                  border: item.isAllCard ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
                  boxShadow: item.isAllCard ? '0 4px 14px rgba(59, 130, 246, 0.12)' : '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span className="category-pill" style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: '#eff6ff',
                      color: '#007bff',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}>
                      {item.category}
                    </span>
                    {item.displayTag && (
                      <span className="tag-chip" style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: item.isAllCard ? '#dbeafe' : '#f1f5f9',
                        color: item.isAllCard ? '#1d4ed8' : '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}>
                        {item.displayTag}
                      </span>
                    )}
                  </div>

                  <h3 className="card-exam-title" style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '8px',
                    lineHeight: 1.5
                  }}>
                    {item.year}
                  </h3>

                  <div style={{
                    fontSize: '0.82rem',
                    color: '#64748b',
                    background: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    {item.subjectStats}
                  </div>
                </div>

                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: '#64748b',
                    marginBottom: '16px',
                    paddingTop: '10px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <span><strong>প্রশ্ন:</strong> {toBengaliNumber(item.totalQ)} টি</span>
                    <span><strong>সময়:</strong> {item.time}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleExamAction('read', item)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        background: '#ffffff',
                        border: '1.5px solid #007bff',
                        color: '#007bff',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fa-regular fa-folder-open" style={{ marginRight: '4px' }}></i> ব্যাখ্যা পড়ুন
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExamAction('exam', item)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        background: '#007bff',
                        border: 'none',
                        color: '#ffffff',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        cursor: 'pointer'
                      }}
                    >
                      পরীক্ষা দিন <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px' }}></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && filteredData.length > visibleCount && (
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 36)}
              className="btn-secondary"
              style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            >
              আরো অধ্যায় দেখুন ({toBengaliNumber(filteredData.length - visibleCount)} টি বাকি)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IctSmartPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '32px', color: '#007bff' }}></i>
        <p style={{ marginTop: '16px', fontWeight: 600 }}>লোড হচ্ছে...</p>
      </div>
    }>
      <IctSmartContent />
    </Suspense>
  );
}
