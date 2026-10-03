'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Sparkles, Flame, Layers } from 'lucide-react';
import './style.css';
import { getMostImportantCatalog, cleanMostImportantTitle } from '../../../../lib/mostImportantData';
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

const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল বিষয়' },
  { id: 'language', label: 'ভাষা ও সাহিত্য', matchKey: 'language' },
  { id: 'affairs', label: 'বাংলাদেশ ও আন্তর্জাতিক', matchKey: 'affairs' },
  { id: 'science', label: 'বিজ্ঞান ও প্রযুক্তি', matchKey: 'science' },
  { id: 'math', label: 'গাণিতিক যুক্তি ও দক্ষতা', matchKey: 'math' },
  { id: 'geography', label: 'ভূগোল ও নৈতিকতা', matchKey: 'geography' }
];

function MostImportantSmartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthorized, loading: authLoading, logout } = useAuth();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const STORAGE_KEY_SMART_FILTERS = 'ujs_miq_smart_filters';

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
      const urlSort = searchParams.get('sort');

      const savedRaw = localStorage.getItem(STORAGE_KEY_SMART_FILTERS);
      const saved = savedRaw ? JSON.parse(savedRaw) : null;

      const effectiveCat = urlCat || saved?.category;
      if (effectiveCat) setCurrentTag(effectiveCat);

      const effectiveQ = urlQ !== null && urlQ !== undefined ? urlQ : saved?.search;
      if (effectiveQ !== undefined && effectiveQ !== null) setSearchQuery(effectiveQ);

      const effectiveSort = urlSort || saved?.sort;
      if (effectiveSort) setSortBy(effectiveSort);
    } catch (e) {
      console.warn('Failed to restore most important smart filters:', e);
    }
  }, [searchParams]);

  // Suggested Bengali keywords when user types in English
  const activeSuggestions = useMemo(() => {
    return getQueryBengaliSuggestions(searchQuery);
  }, [searchQuery]);

  // Load Catalog & map to card items
  useEffect(() => {
    let isMounted = true;

    getMostImportantCatalog()
      .then((catalog) => {
        if (!isMounted) return;
        const examsList = catalog.exams || catalog.subjects || [];
        if (Array.isArray(examsList) && examsList.length > 0) {
          const mapped = examsList.map((exam) => {
            const rawTitle = cleanMostImportantTitle(exam.title);
            const qCount = exam.question_count || 100;
            const yearStr = exam.year ? String(exam.year) : '';
            const bnYear = yearStr ? toBengaliNumber(yearStr) : '';

            // Calculate display time
            let timeStr = '১ ঘণ্টা';
            if (qCount >= 300) timeStr = '৩ ঘণ্টা';
            else if (qCount >= 180) timeStr = '২ ঘণ্টা';
            else if (qCount >= 100) timeStr = '১ ঘণ্টা ৩০ মিনিট';
            else if (qCount <= 50) timeStr = '৩০ মিনিট';

            const catId = (exam.category_id || '').toLowerCase();
            let catLabel = exam.category_name || 'কমন প্রশ্ন';

            const tags = [
              exam.category_id,
              catLabel,
              rawTitle,
              toEnglishNumberStr(rawTitle)
            ].filter(Boolean);

            return {
              id: exam.slug || exam.id,
              slug: exam.slug || exam.id,
              year: rawTitle,
              category: catLabel,
              categoryId: catId,
              date: bnYear || 'কমন প্রশ্ন',
              yearAD: yearStr,
              totalQ: qCount,
              time: timeStr,
              subjectStats: `${catLabel} • ৩+ বার রিপিটেড`,
              status: 'সম্পূর্ণ সমাধানসহ উপলব্ধ',
              tags: tags,
              displayTag: catLabel,
              rawYear: exam.year || 0,
              rawExam: exam
            };
          });

          setBankData(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching most important smart catalog:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered & Sorted items
  const filteredData = useMemo(() => {
    const activeCat = DEFAULT_CATEGORIES.find((c) => c.id === currentTag);

    return bankData.filter((item) => {
      // Category tag match
      if (activeCat && activeCat.matchKey) {
        if (item.categoryId !== activeCat.matchKey) return false;
      } else if (currentTag !== 'All' && item.category !== currentTag && item.categoryId !== currentTag) {
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
    }).sort((a, b) => {
      if (sortBy === 'most_q') {
        return (b.totalQ || 0) - (a.totalQ || 0);
      }
      if (sortBy === 'least_q') {
        return (a.totalQ || 0) - (b.totalQ || 0);
      }
      if (sortBy === 'name_asc') {
        return a.year.localeCompare(b.year, 'bn');
      }
      // default: most questions first
      return (b.totalQ || 0) - (a.totalQ || 0);
    });
  }, [bankData, currentTag, searchQuery, sortBy]);

  const displayedData = useMemo(() => {
    return filteredData.slice(0, visibleCount);
  }, [filteredData, visibleCount]);

  // Tag Counts
  const tagCounts = useMemo(() => {
    const counts = { All: bankData.length };
    DEFAULT_CATEGORIES.forEach((cat) => {
      if (cat.id !== 'All') {
        counts[cat.id] = bankData.filter((item) => {
          if (cat.matchKey) return item.categoryId === cat.matchKey;
          return item.category === cat.id || item.categoryId === cat.id;
        }).length;
      }
    });
    return counts;
  }, [bankData]);

  const handleTagClick = (tagId) => {
    setCurrentTag(tagId);
    setVisibleCount(36);
    persistFilter('category', tagId);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setVisibleCount(36);
    persistFilter('search', val);
  };

  // Navigate directly to explanation or exam without popup
  const handleExamAction = (action, item) => {
    const targetSlug = item.slug || item.id;
    const modeParam = action === 'exam' ? 'exam' : 'read';
    router.push(`/most-important-smart-questions/?exam=${encodeURIComponent(targetSlug)}&mode=${modeParam}`);
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

  // 2. Unauthenticated: User is not logged in
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
            কমন প্রশ্নব্যাংক স্মার্ট দেখতে লগইন প্রয়োজন
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '28px' }}>
            এই পেজের সর্বাধিক কমন ও রিপিটেড ৪,৯০৪টি স্মার্ট প্রশ্নভাণ্ডার ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন। শুধুমাত্র <strong>অনুমোদিত শিক্ষার্থী (Approved User)</strong> বা <strong>অ্যাডমিনিস্ট্রেটর</strong> ছাড়া এই পেজটি দেখা যাবে না।
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
              <li>• সর্বাধিক রিপিটেড ও কমন প্রশ্নব্যাংক</li>
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
            প্রিয় <strong>{user.name}</strong>, আপনার অ্যাকাউন্টটি বর্তমানে পর্যালোচনার অধীনে রয়েছে। শুধুমাত্র <strong>অনুমোদিত শিক্ষার্থী (Approved User)</strong> বা <strong>অ্যাডমিনিস্ট্রেটর</strong> ছাড়া এই পেজটি দেখা যাবে না। সিস্টেম অ্যাডমিন অনুমোদন সম্পন্ন করার পর আপনি পূর্ণাঙ্গ প্রশ্নভাণ্ডার অনুশীলন করতে পারবেন।
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

  // 4. Authorized User View
  return (
    <div className="qb-demo-wrapper">
      <div className="qb-container">
        {/* Header Section */}
        <section className="header-section">
          <div className="badge-archive">
            <Flame size={14} /> Layout Smart
          </div>
          <h1 className="title-main">সর্বাধিক কমন ও রিপিটেড প্রশ্নব্যাংক</h1>
          <p className="desc-sub">
            বিসিএস, ব্যাংক, প্রাথমিক শিক্ষক ও পিএসসির পরীক্ষায় ৩ বা ততোধিকবার আসা প্রশ্নসমূহের বিষয়ভিত্তিক সমাধান ও প্রস্তুতি।
          </p>
        </section>

        {/* Filter & Search Bar */}
        <div className="filter-control-card">
          <div className="pills-group">
            {DEFAULT_CATEGORIES.map((cat) => {
              const isActive = currentTag === cat.id;
              const count = tagCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  className={`filter-btn ${isActive ? 'active' : 'inactive'}`}
                  onClick={() => handleTagClick(cat.id)}
                >
                  <span>{cat.label}</span>
                  <span className="count-badge">{toBengaliNumber(count)}</span>
                </button>
              );
            })}
          </div>

          {/* Search, Year & Sort Filters Row */}
          <div className="qb-search-filter-row">
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                className="input-glass"
                placeholder="বিষয়ের নাম বা ক্যাটাগরি লিখে খুঁজুন (যেমন: বাংলা, ইংরেজি, সংবিধান)..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '4px'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              className="input-glass"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                persistFilter('sort', e.target.value);
              }}
            >
              <option value="newest">ডিফল্ট ক্রমানুসারে</option>
              <option value="most_q">বেশি প্রশ্ন সংখ্যা আগে</option>
              <option value="least_q">কম প্রশ্ন সংখ্যা আগে</option>
              <option value="name_asc">শিরোনাম অনুযায়ী (অ-ঔ, ক-হ)</option>
            </select>
          </div>

          {/* English to Bengali Search Suggestions */}
          {activeSuggestions.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              padding: '8px 12px',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} /> বাংলা সাজেশন:
              </span>
              {activeSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSearchChange(sug)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #86efac',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '0.82rem',
                    color: '#15803d',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          color: '#64748b',
          fontSize: '0.95rem'
        }}>
          <div>
            মোট পাওয়া গেছে:{' '}
            <strong style={{ color: '#0f172a' }}>{toBengaliNumber(filteredData.length)}</strong> টি বিষয়
          </div>
          {(searchQuery || currentTag !== 'All') && (
            <button
              onClick={() => {
                setCurrentTag('All');
                handleSearchChange('');
                setSortBy('newest');
                persistFilter('category', 'All');
                persistFilter('search', '');
                persistFilter('sort', 'newest');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              রিসেট ফিল্টার
            </button>
          )}
        </div>

        {/* Cards Grid Layout */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#5b50e6', fontWeight: 600 }}>
            লোড হচ্ছে...
          </div>
        ) : displayedData.length === 0 ? (
          <div className="no-data-box">
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '8px' }}>
              কোনো বিষয় পাওয়া যায়নি
            </h3>
            <p style={{ color: '#64748b' }}>
              অনুগ্রহ করে ভিন্ন কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা ফিল্টার পরিবর্তন করুন।
            </p>
          </div>
        ) : (
          <div className="cards-grid-layout">
            {displayedData.map((item) => (
              <div key={item.id} className="hub-card-item">
                <div>
                  <div className="card-header-badges">
                    <span
                      className="category-chip"
                      onClick={() => handleTagClick(item.categoryId || 'All')}
                    >
                      {item.category}
                    </span>
                    {item.displayTag && (
                      <span className="tag-chip">
                        {item.displayTag}
                      </span>
                    )}
                  </div>

                  <h3 className="card-exam-title">{item.year}</h3>

                  <div className="subject-breakdown-box">
                    {item.subjectStats}
                  </div>
                </div>

                <div>
                  <div className="meta-stats-row">
                    <span>
                      <i className="fa-regular fa-circle-question" style={{ marginRight: '4px' }}></i>{' '}
                      {toBengaliNumber(item.totalQ)} টি প্রশ্ন
                    </span>
                    <span>
                      <i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i>{' '}
                      {item.time}
                    </span>
                  </div>

                  <div className="card-buttons-flex">
                    <button
                      className="btn-read-solution"
                      onClick={() => handleExamAction('read', item)}
                    >
                      <i className="fa-solid fa-book-open"></i>
                      <span>পড়ুন ও ব্যাখ্যা</span>
                    </button>
                    <button
                      className="btn-start-exam"
                      onClick={() => handleExamAction('exam', item)}
                    >
                      <i className="fa-solid fa-play"></i>
                      <span>পরীক্ষা শুরু</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredData.length && (
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button
              onClick={() => setVisibleCount((prev) => prev + 36)}
              className="btn-read-solution"
              style={{
                display: 'inline-flex',
                padding: '12px 32px',
                fontSize: '0.95rem',
                backgroundColor: '#ffffff',
                border: '1.5px solid #cbd5e1'
              }}
            >
              আরো বিষয় দেখুন ({toBengaliNumber(filteredData.length - visibleCount)} টি বাকি)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MostImportantSmartPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center', color: '#047857' }}>লোড হচ্ছে...</div>}>
      <MostImportantSmartContent />
    </Suspense>
  );
}
