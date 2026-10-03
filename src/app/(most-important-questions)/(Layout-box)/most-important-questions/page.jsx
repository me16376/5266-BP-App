'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Layers, 
  BookOpen, 
  Timer, 
  Calendar,
  Sparkles,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { getMostImportantCatalog, cleanMostImportantTitle } from '../../../../lib/mostImportantData';
import { matchesExamSearch, getQueryBengaliSuggestions } from '../../../../lib/searchUtils';
import { useAuth } from '../../../../lib/authContext';

function MostImportantDirectoryContent() {
  const { user, loading: authLoading, logout } = useAuth();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [catalog, setCatalog] = useState({ categories: [], exams: [], subjects: [] });
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(30);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY_CAT = 'ujs_miq_filter_cat';

  // Suggested Bengali keywords when user types in English
  const activeSuggestions = useMemo(() => {
    return getQueryBengaliSuggestions(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    getMostImportantCatalog().then(data => {
      setCatalog(data);
      setLoading(false);
    });
  }, []);

  // Restore category from URL or localStorage
  useEffect(() => {
    const urlCat = searchParams.get('cat');
    if (urlCat) {
      setSelectedCategory(urlCat);
      try {
        localStorage.setItem(STORAGE_KEY_CAT, urlCat);
      } catch (e) {}
    } else {
      try {
        const savedCat = localStorage.getItem(STORAGE_KEY_CAT);
        if (savedCat) {
          setSelectedCategory(savedCat);
        }
      } catch (e) {}
    }
  }, [searchParams]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setVisibleCount(30);
    try {
      localStorage.setItem(STORAGE_KEY_CAT, catId);
    } catch (e) {}
  };

  // Extract unique years (if any)
  const availableYears = useMemo(() => {
    const examsList = catalog.exams || catalog.subjects || [];
    const set = new Set();
    examsList.forEach(e => {
      if (e.year) set.add(e.year);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [catalog.exams, catalog.subjects]);

  // Helper to score an item for sorting
  const getExamSortScore = (exam) => {
    const qCount = exam.question_count || 0;
    const title = exam.title || '';
    return { qCount, title };
  };

  // Filtered & Sorted items
  const filteredExams = useMemo(() => {
    const examsList = catalog.exams || catalog.subjects || [];
    const list = examsList.filter(exam => {
      // Category filter
      if (selectedCategory !== 'all' && exam.category_id !== selectedCategory) {
        return false;
      }
      // Year filter (if applied and exam has year)
      if (selectedYear !== 'all' && String(exam.year) !== String(selectedYear)) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        if (!matchesExamSearch(exam, searchQuery)) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    return [...list].sort((a, b) => {
      const scoreA = getExamSortScore(a);
      const scoreB = getExamSortScore(b);

      if (sortBy === 'question_desc') {
        return (b.question_count || 0) - (a.question_count || 0);
      }
      if (sortBy === 'question_asc') {
        return (a.question_count || 0) - (b.question_count || 0);
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title, 'bn');
      }
      if (sortBy === 'newest') {
        // High question count first or title
        return (b.question_count || 0) - (a.question_count || 0);
      }
      return 0;
    });
  }, [catalog.exams, catalog.subjects, selectedCategory, selectedYear, searchQuery, sortBy]);

  const displayedExams = useMemo(() => {
    return filteredExams.slice(0, visibleCount);
  }, [filteredExams, visibleCount]);

  const isOwner = user?.role === 'owner';
  const isAdmin = user?.role === 'admin';
  const isApprovedUser = user?.status === 'approved';
  const isAuthorized = isOwner || isAdmin || isApprovedUser;

  // 1. Loading State while checking auth
  if (authLoading) {
    return (
      <div style={{ padding: '100px 20px', minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '24px 36px', display: 'inline-flex', alignItems: 'center', gap: '14px', background: '#ffffff' }}>
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
            প্রশ্নতালিকা দেখতে লগইন প্রয়োজন
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '28px' }}>
            এই পেজের সর্বাধিক কমন ও রিপিটেড ৪,৯০৪টি প্রশ্নভাণ্ডার ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন। শুধুমাত্র <strong>অনুমোদিত শিক্ষার্থী (Approved User)</strong> বা <strong>অ্যাডমিনিস্ট্রেটর</strong> ছাড়া এই পেজটি দেখা যাবে না।
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
              <li>• বিগত সালের সর্বাধিক রিপিটেড ও কমন প্রশ্নব্যাংক</li>
              <li>• লাইভ মডেল টেস্ট, নেগেটিভ মার্কিং ও ওএমআর মার্কশিট</li>
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

  // 4. Authorized user: Render directory
  return (
    <div style={{ minHeight: '85vh', background: 'var(--bg-primary)', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="badge badge-emerald" style={{ padding: '6px 14px', fontSize: '0.86rem' }}>
              <Flame size={15} />
              <span>সর্বাধিক কমন প্রশ্নব্যাংক (Most Important)</span>
            </span>
            <span className="badge badge-amber" style={{ padding: '6px 14px', fontSize: '0.86rem' }}>
              <Sparkles size={15} />
              <span>{catalog.total_exams ? catalog.total_exams.toLocaleString('bn-BD') : '১১'} টি বিষয় • {catalog.total_questions ? catalog.total_questions.toLocaleString('bn-BD') : '৪,৯০৪'} টি প্রশ্ন</span>
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '12px'
          }}>
            বিগত সালের সর্বাধিক রিপিটেড ও কমন প্রশ্নব্যাংক
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            maxWidth: '640px',
            margin: '0 auto'
          }}>
            বিসিএস, ব্যাংক, প্রাথমিক শিক্ষক ও পিএসসি পরীক্ষায় ৩ বা ততোধিকবার আসা প্রশ্নসমূহের বিষয়ভিত্তিক সমাধান ও প্রস্তুতি
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px', background: '#ffffff' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                color="var(--emerald-600)"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বিষয়ের নাম বা ক্যাটাগরি লিখে খুঁজুন (যেমন: বাংলা, english, সংবিধান, math)..."
                className="input-glass"
                style={{
                  width: '100%',
                  paddingLeft: '46px',
                  paddingRight: '16px',
                  height: '50px',
                  borderRadius: '12px',
                  fontSize: '0.96rem'
                }}
              />
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
                    onClick={() => setSearchQuery(sug)}
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

            {/* Category Pills */}
            <div style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none'
            }}>
              <button
                onClick={() => handleCategorySelect('all')}
                className={`btn-secondary ${selectedCategory === 'all' ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.88rem',
                  borderRadius: '10px',
                  whiteSpace: 'nowrap',
                  background: selectedCategory === 'all' ? 'var(--emerald-600)' : '#f8fafc',
                  color: selectedCategory === 'all' ? '#ffffff' : '#334155',
                  borderColor: selectedCategory === 'all' ? 'var(--emerald-600)' : '#e2e8f0'
                }}
              >
                সকল বিষয় ({catalog.total_exams || 0})
              </button>

              {catalog.categories && catalog.categories.map((cat) => {
                if (cat.id === 'all') return null;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`btn-secondary ${isSelected ? 'active' : ''}`}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.88rem',
                      borderRadius: '10px',
                      whiteSpace: 'nowrap',
                      background: isSelected ? 'var(--emerald-600)' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#334155',
                      borderColor: isSelected ? 'var(--emerald-600)' : '#e2e8f0'
                    }}
                  >
                    {cat.name} ({cat.subject_count || cat.count || 0})
                  </button>
                );
              })}
            </div>

            {/* Filters Row: Sort & Reset */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
              paddingTop: '10px',
              borderTop: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px' }}>
                <ArrowUpDown size={15} color="var(--text-muted)" />
                <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>সাজান:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-glass"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.86rem',
                    borderRadius: '8px',
                    width: '100%',
                    height: '38px',
                    background: '#ffffff'
                  }}
                >
                  <option value="newest">ডিফল্ট ক্রমানুসারে</option>
                  <option value="question_desc">বেশি প্রশ্ন সংখ্যা আগে</option>
                  <option value="question_asc">কম প্রশ্ন সংখ্যা আগে</option>
                  <option value="title_asc">শিরোনাম অনুযায়ী (অ-ঔ, ক-হ)</option>
                </select>
              </div>

              {(searchQuery || selectedCategory !== 'all' || selectedYear !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSelectedYear('all');
                    try {
                      localStorage.setItem(STORAGE_KEY_CAT, 'all');
                    } catch (e) {}
                  }}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.86rem', height: '38px', color: '#ef4444' }}
                >
                  রিসেট ফিল্টার
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          <div>
            পাওয়া গেছে: <strong style={{ color: '#0f172a' }}>{filteredExams.length.toLocaleString('bn-BD')}</strong> টি বিষয়
          </div>
        </div>

        {/* Exams Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--emerald-600)', fontWeight: 600 }}>
            লোড হচ্ছে...
          </div>
        ) : displayedExams.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff' }}>
            <Layers size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '6px' }}>
              কোনো বিষয় পাওয়া যায়নি
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              অনুগ্রহ করে ভিন্ন কোনো কি-ওয়ার্ড বা ক্যাটাগরি নির্বাচন করুন।
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px',
            marginBottom: '36px'
          }}>
            {displayedExams.map((exam) => (
              <div
                key={exam.id || exam.slug}
                className="glass-panel"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: '3px solid var(--emerald-500)',
                  background: '#ffffff',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                    <span className="badge badge-emerald" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {exam.category_name ? exam.category_name.split(' (')[0] : 'কমন প্রশ্ন'}
                    </span>
                    {exam.year && (
                      <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={11} /> {exam.year}
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: '1.5',
                    marginBottom: '10px'
                  }}>
                    {cleanMostImportantTitle(exam.title)}
                  </h3>

                  <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    মোট কমন প্রশ্ন: <strong style={{ color: '#1e293b' }}>{exam.question_count?.toLocaleString('bn-BD')}</strong> টি
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href={`/most-important-questions-practice?exam=${encodeURIComponent(exam.slug)}&mode=practice`}
                    className="btn-primary"
                    style={{ flex: 1, padding: '9px 12px', fontSize: '0.86rem' }}
                  >
                    <BookOpen size={15} />
                    <span>প্র্যাকটিস</span>
                  </Link>

                  <Link
                    href={`/most-important-questions-model-test?exam=${encodeURIComponent(exam.slug)}`}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '9px 12px', fontSize: '0.86rem' }}
                  >
                    <Timer size={15} />
                    <span>মডেল টেস্ট</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredExams.length && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setVisibleCount(prev => prev + 30)}
              className="btn-secondary"
              style={{ padding: '12px 32px', fontSize: '0.95rem' }}
            >
              আরো বিষয় দেখুন ({filteredExams.length - visibleCount} টি বাকি)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MostImportantPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center', color: '#047857' }}>লোড হচ্ছে...</div>}>
      <MostImportantDirectoryContent />
    </Suspense>
  );
}
