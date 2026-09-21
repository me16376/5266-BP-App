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
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { getExamsCatalog, cleanExamTitle } from '../../lib/examsData';
import { matchesExamSearch, getQueryBengaliSuggestions } from '../../lib/searchUtils';
import { useAuth } from '../../lib/authContext';

function ExamsDirectoryContent() {
  const { user, loading: authLoading, logout } = useAuth();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [catalog, setCatalog] = useState({ categories: [], exams: [] });
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(30);
  const [loading, setLoading] = useState(true);

  // Suggested Bengali keywords when user types in English
  const activeSuggestions = useMemo(() => {
    return getQueryBengaliSuggestions(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    getExamsCatalog().then(data => {
      setCatalog(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchParams.get('cat')) {
      setSelectedCategory(searchParams.get('cat'));
    }
  }, [searchParams]);

  // Extract unique years
  const availableYears = useMemo(() => {
    if (!catalog.exams) return [];
    const set = new Set();
    catalog.exams.forEach(e => {
      if (e.year) set.add(e.year);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [catalog.exams]);

  // Helper to score an exam for sorting
  const getExamSortScore = (exam) => {
    // 1. BCS / Registration Edition Number (e.g. 50, 49, 48 ... 10 BCS, or 18, 17, 16 ... NTRCA)
    const edMatch = exam.title.match(/(\d+)(?:st|nd|rd|th)/i) || exam.slug.match(/(\d+)(?:st|nd|rd|th)/i);
    let editionNum = edMatch ? parseInt(edMatch[1], 10) : 0;

    // Bengali edition numbers (e.g. ১৮তম, ১৭তম, ১৬ তম, ১৫ তম)
    if (!editionNum) {
      const bnMatch = exam.title.match(/([০-৯0-9]+)\s*(?:তম|ম|ষ্ঠ|র্থ)/);
      if (bnMatch) {
        const bnMap = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
        const converted = bnMatch[1].replace(/[০-৯]/g, d => bnMap[d] || d);
        editionNum = parseInt(converted, 10) || 0;
      }
    }

    // 2. Year from metadata or parsed from title/filename
    let year = exam.year || 0;
    if (!year) {
      const ym = exam.title.match(/\b(19\d\d|20\d\d)\b/);
      if (ym) year = parseInt(ym[1], 10);
    }
    if (!year) {
      const dm = exam.title.match(/\b\d{1,2}\.\d{1,2}\.(\d{2})\b/);
      if (dm) {
        const yy = parseInt(dm[1], 10);
        year = yy > 50 ? 1900 + yy : 2000 + yy;
      }
    }
    if (!year) {
      const bnYearMatch = exam.title.match(/(?:১৯\d\d|২০[০-৯]{2})/);
      if (bnYearMatch) {
        const bnMap = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
        const converted = bnYearMatch[0].replace(/[০-৯]/g, d => bnMap[d] || d);
        year = parseInt(converted, 10) || 0;
      }
    }

    // 3. ID / Original sequence number
    const idNum = exam.id ? parseInt(exam.id.replace(/\D/g, ''), 10) || 0 : 0;

    return { editionNum, year, idNum };
  };

  // Filtered & Sorted exams
  const filteredExams = useMemo(() => {
    if (!catalog.exams) return [];
    const list = catalog.exams.filter(exam => {
      // Category filter
      if (selectedCategory !== 'all' && exam.category_id !== selectedCategory) {
        return false;
      }
      // Year filter
      if (selectedYear !== 'all' && exam.year !== parseInt(selectedYear, 10)) {
        return false;
      }
      // Smart Bilingual Search (English / Banglish / Bengali / Digits)
      if (searchQuery.trim()) {
        if (!matchesExamSearch(exam, searchQuery)) {
          return false;
        }
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'questions') {
        return (b.question_count || 0) - (a.question_count || 0);
      }

      const scoreA = getExamSortScore(a);
      const scoreB = getExamSortScore(b);

      // If category has edition numbers (BCS / NTRCA), strictly sort by edition
      if (scoreA.editionNum > 0 && scoreB.editionNum > 0) {
        if (scoreA.editionNum !== scoreB.editionNum) {
          return sortBy === 'oldest' 
            ? scoreA.editionNum - scoreB.editionNum 
            : scoreB.editionNum - scoreA.editionNum;
        }
      }

      // Next compare Year if different
      if (scoreA.year !== scoreB.year && scoreA.year > 0 && scoreB.year > 0) {
        return sortBy === 'oldest' 
          ? scoreA.year - scoreB.year 
          : scoreB.year - scoreA.year;
      }

      // If only one has edition number, place it on top in newest
      if (scoreA.editionNum > 0 && scoreB.editionNum === 0) return sortBy === 'oldest' ? 1 : -1;
      if (scoreB.editionNum > 0 && scoreA.editionNum === 0) return sortBy === 'oldest' ? -1 : 1;

      // Default fallback: reverse the original index order (since index is oldest to newest)
      return sortBy === 'oldest' 
        ? scoreA.idNum - scoreB.idNum 
        : scoreB.idNum - scoreA.idNum;
    });
  }, [catalog.exams, selectedCategory, selectedYear, searchQuery, sortBy]);

  const displayedExams = filteredExams.slice(0, visibleCount);

  // Access Control: Only approved users, approved admins, or system owners are permitted
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
            পরীক্ষার তালিকা দেখতে লগইন প্রয়োজন
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '28px' }}>
            এই পেজের বিগত ২,১৫৪টি চাকরির প্রশ্নভাণ্ডার ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন। শুধুমাত্র <strong>অনুমোদিত শিক্ষার্থী (Approved User)</strong> বা <strong>অ্যাডমিনিস্ট্রেটর</strong> ছাড়া এই পেজটি দেখা যাবে না।
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
            প্রিয় <strong>{user.name}</strong>, আপনার অ্যাকাউন্টটি বর্তমানে পর্যালোচনার অধীনে রয়েছে। শুধুমাত্র <strong>অনুমোদিত শিক্ষার্থী (Approved User)</strong> বা <strong>অ্যাডমিনিস্ট্রেটর</strong> ছাড়া এই পেজটি দেখা যাবে না। সিস্টেম অ্যাডমিন অনুমোদন সম্পন্ন করার পর আপনি সকল পরীক্ষার তালিকা দেখতে পারবেন।
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

  // 4. Authorized: Approved User, Admin, or Owner
  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-emerald">পরীক্ষার তালিকা</span>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              মোট {catalog.exams?.length ? catalog.exams.length.toLocaleString('bn-BD') : '২,১৫৪'}টি পরীক্ষার নির্ভুল প্রশ্নব্যাংক
            </span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
            সকল চাকরির পরীক্ষা ও প্রশ্নভাণ্ডার
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '700px' }}>
            বিসিএস, ব্যাংক, প্রাইমারি শিক্ষক ও মন্ত্রণালয় পরীক্ষার বিগত বছরের প্রশ্নগুলো সাল ও বিষয় অনুযায়ী ফিল্টার করুন।
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px', background: '#ffffff' }}>
          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            paddingBottom: '14px',
            marginBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => { setSelectedCategory('all'); setVisibleCount(30); }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedCategory === 'all' ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                background: selectedCategory === 'all' ? '#ecfdf5' : '#ffffff',
                color: selectedCategory === 'all' ? '#047857' : '#475569',
                transition: 'all 0.15s ease'
              }}
            >
              সকল পরীক্ষা ({catalog.exams?.length ? catalog.exams.length.toLocaleString('bn-BD') : '২,১৫৪'})
            </button>

            {catalog.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setVisibleCount(30); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedCategory === cat.id ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                  background: selectedCategory === cat.id ? '#ecfdf5' : '#ffffff',
                  color: selectedCategory === cat.id ? '#047857' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.name.split(' (')[0]} ({cat.exam_count?.toLocaleString('bn-BD')})
              </button>
            ))}
          </div>

          {/* Search, Year & Sort Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {/* Text Search */}
            <div style={{ position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(30); }}
                placeholder="বাংলা বা ইংরেজিতে সার্চ করুন (যেমন: bcs, bank, shikkhok, 45)..."
                className="input-glass"
                style={{ paddingLeft: '42px', paddingRight: searchQuery ? '36px' : '14px', height: '46px' }}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setVisibleCount(30); }}
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
            <div style={{ position: 'relative' }}>
              <select
                value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); setVisibleCount(30); }}
                className="input-glass"
                style={{ height: '46px', cursor: 'pointer' }}
              >
                <option value="all">সকল সাল (All Years)</option>
                {availableYears.map(yr => (
                  <option key={yr} value={yr}>{yr} সাল</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setVisibleCount(30); }}
                className="input-glass"
                style={{ height: '46px', cursor: 'pointer', fontWeight: 600, color: '#0f172a' }}
              >
                <option value="newest">সর্বশেষ আপডেট আগে (৫০তম ➔ ১০ম)</option>
                <option value="oldest">পুরাতন পরীক্ষা আগে (১০ম ➔ ৫০তম)</option>
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
              marginTop: '12px',
              fontSize: '0.82rem',
              color: 'var(--emerald-700)',
              background: '#ecfdf5',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #a7f3d0'
            }}>
              <Sparkles size={14} />
              <span>বাংলা রূপান্তর:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {activeSuggestions.map((sugg, idx) => (
                  <span key={idx} className="badge badge-emerald" style={{ fontSize: '0.78rem', padding: '2px 8px' }}>
                    {sugg}
                  </span>
                ))}
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>(বাংলা টাইটেলে ম্যাচ করা হচ্ছে)</span>
            </div>
          )}
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
            পাওয়া গেছে: <strong style={{ color: '#0f172a' }}>{filteredExams.length.toLocaleString('bn-BD')}</strong> টি পরীক্ষা
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
              কোনো পরীক্ষা পাওয়া যায়নি
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              অনুগ্রহ করে ভিন্ন কোনো কি-ওয়ার্ড বা সাল নির্বাচন করুন।
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
                key={exam.id}
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
                      {exam.category_name.split(' (')[0]}
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
                    {cleanExamTitle(exam.title)}
                  </h3>

                  <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    মোট প্রশ্ন: <strong style={{ color: '#1e293b' }}>{exam.question_count?.toLocaleString('bn-BD')}</strong> টি
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href={`/practice?exam=${exam.slug}&mode=practice`}
                    className="btn-primary"
                    style={{ flex: 1, padding: '9px 12px', fontSize: '0.86rem' }}
                  >
                    <BookOpen size={15} />
                    <span>প্র্যাকটিস</span>
                  </Link>

                  <Link
                    href={`/model-test?exam=${exam.slug}`}
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
              আরো পরীক্ষা দেখুন ({filteredExams.length - visibleCount} টি বাকি)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExamsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center', color: '#047857' }}>লোড হচ্ছে...</div>}>
      <ExamsDirectoryContent />
    </Suspense>
  );
}
