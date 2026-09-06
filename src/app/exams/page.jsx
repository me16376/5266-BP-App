'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Layers, 
  BookOpen, 
  Timer, 
  Calendar
} from 'lucide-react';
import { getExamsCatalog } from '../../lib/examsData';

function ExamsDirectoryContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [catalog, setCatalog] = useState({ categories: [], exams: [] });
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedYear, setSelectedYear] = useState('all');
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

  // Filtered exams
  const filteredExams = useMemo(() => {
    if (!catalog.exams) return [];
    return catalog.exams.filter(exam => {
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
  }, [catalog.exams, selectedCategory, selectedYear, searchQuery]);

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
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
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
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                border: selectedCategory === 'all' ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                background: selectedCategory === 'all' ? '#ecfdf5' : '#ffffff',
                color: selectedCategory === 'all' ? '#047857' : '#475569'
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
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: selectedCategory === cat.id ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                  background: selectedCategory === cat.id ? '#ecfdf5' : '#ffffff',
                  color: selectedCategory === cat.id ? '#047857' : '#475569'
                }}
              >
                {cat.name.split(' (')[0]} ({cat.exam_count})
              </button>
            ))}
          </div>

          {/* Search & Year Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
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
                    {exam.title}
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
                    href={`/file-exam?exam=${exam.slug}`}
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
