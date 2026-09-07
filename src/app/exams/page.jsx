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
  ArrowUpDown
} from 'lucide-react';
import { getExamsCatalog, cleanExamTitle } from '../../lib/examsData';

function ExamsDirectoryContent() {
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
    // 1. BCS Number (e.g. 50, 49, 48 ... 10)
    const bcsMatch = exam.title.match(/(\d+)(?:st|nd|rd|th)/i) || exam.slug.match(/(\d+)(?:st|nd|rd|th)/i);
    const bcsNum = bcsMatch ? parseInt(bcsMatch[1], 10) : 0;

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

    // 3. ID / Original sequence number
    const idNum = exam.id ? parseInt(exam.id.replace(/\D/g, ''), 10) || 0 : 0;

    return { bcsNum, year, idNum };
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
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = exam.title.toLowerCase().includes(q);
        const matchCat = exam.category_name.toLowerCase().includes(q);
        if (!matchTitle && !matchCat) return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'questions') {
        return (b.question_count || 0) - (a.question_count || 0);
      }

      const scoreA = getExamSortScore(a);
      const scoreB = getExamSortScore(b);

      // If category is BCS or both have BCS numbers, strictly sort by BCS edition
      if (scoreA.bcsNum > 0 && scoreB.bcsNum > 0) {
        if (scoreA.bcsNum !== scoreB.bcsNum) {
          return sortBy === 'oldest' 
            ? scoreA.bcsNum - scoreB.bcsNum 
            : scoreB.bcsNum - scoreA.bcsNum;
        }
      }

      // Next compare Year if different
      if (scoreA.year !== scoreB.year && scoreA.year > 0 && scoreB.year > 0) {
        return sortBy === 'oldest' 
          ? scoreA.year - scoreB.year 
          : scoreB.year - scoreA.year;
      }

      // If only one is BCS, place BCS on top in newest
      if (scoreA.bcsNum > 0 && scoreB.bcsNum === 0) return sortBy === 'oldest' ? 1 : -1;
      if (scoreB.bcsNum > 0 && scoreA.bcsNum === 0) return sortBy === 'oldest' ? -1 : 1;

      // Default fallback: reverse the original index order (since index is oldest to newest)
      return sortBy === 'oldest' 
        ? scoreA.idNum - scoreB.idNum 
        : scoreB.idNum - scoreA.idNum;
    });
  }, [catalog.exams, selectedCategory, selectedYear, searchQuery, sortBy]);

  const displayedExams = filteredExams.slice(0, visibleCount);

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-emerald">পরীক্ষার তালিকা</span>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              মোট ২,১১৯টি পরীক্ষার নির্ভুল প্রশ্নব্যাংক
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
              সকল পরীক্ষা ({catalog.exams.length})
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
                {cat.name.split(' (')[0]} ({cat.exam_count})
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
                placeholder="পরীক্ষার নাম দিয়ে ফিল্টার করুন..."
                className="input-glass"
                style={{ paddingLeft: '42px', height: '46px' }}
              />
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
            পাওয়া গেছে: <strong style={{ color: '#0f172a' }}>{filteredExams.length}</strong> টি পরীক্ষা
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
                    মোট প্রশ্ন: <strong style={{ color: '#1e293b' }}>{exam.question_count}</strong> টি
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
