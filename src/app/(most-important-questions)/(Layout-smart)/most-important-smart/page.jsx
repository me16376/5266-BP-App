'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Sparkles, Flame, BookOpen, Layers } from 'lucide-react';
import './style.css';
import { getMostImportantCatalog, cleanMostImportantTitle } from '../../../../lib/mostImportantData';
import { useAuth } from '../../../../lib/authContext';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBengaliNumber = (num) => {
  if (num === undefined || num === null) return '০';
  return String(num).replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
};

function MostImportantSmartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthorized, loading: authLoading } = useAuth();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [currentTag, setCurrentTag] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [catalog, setCatalog] = useState({ categories: [], subjects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMostImportantCatalog().then(data => {
      setCatalog(data);
      setLoading(false);
    });
  }, []);

  const filteredSubjects = useMemo(() => {
    if (!catalog.subjects) return [];
    return catalog.subjects.filter(s => {
      const matchTag = currentTag === 'all' || s.category_id === currentTag;
      const matchSearch = !searchQuery.trim() ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        s.category_name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchTag && matchSearch;
    });
  }, [catalog.subjects, currentTag, searchQuery]);

  if (authLoading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>লোড হচ্ছে...</div>;
  }

  return (
    <div className="qb-demo-wrapper" style={{ minHeight: '85vh', background: '#f8fafc', padding: '30px 16px 80px' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top Header */}
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge" style={{ padding: '5px 12px', fontSize: '0.85rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
              <Flame size={14} /> Layout Smart
            </span>
            <span style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>
              {catalog.total_subjects || 11} টি বিষয় • {catalog.total_questions || 4904} টি কমন প্রশ্ন
            </span>
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            স্মার্ট প্রশ্নব্যাংক — সর্বাধিক কমন প্রশ্নাবলি
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem', maxWidth: '680px', margin: '0 auto' }}>
            পরীক্ষার আগে কম সময়ে শতভাগ প্রস্তুতির জন্য ৩ বা ততোধিকবার আসা প্রশ্নসমূহের স্মার্ট সমাধান ও পরীক্ষা
          </p>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel" style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          marginBottom: '28px'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
            {catalog.categories && catalog.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCurrentTag(cat.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: currentTag === cat.id ? '#e11d48' : '#f8fafc',
                  color: currentTag === cat.id ? '#ffffff' : '#334155',
                  border: currentTag === cat.id ? '1px solid #be123c' : '1px solid #e2e8f0',
                  transition: 'all 0.2s'
                }}
              >
                {cat.name} ({cat.subject_count})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#e11d48" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="বিষয়ের নাম দিয়ে ফিল্টার করুন..."
              style={{
                width: '100%',
                paddingLeft: '48px',
                paddingRight: '16px',
                height: '46px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.94rem',
                outline: 'none',
                background: '#f8fafc'
              }}
            />
          </div>
        </div>

        {/* Subjects Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            লোড হচ্ছে...
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            কোনো বিষয় পাওয়া যায়নি।
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {filteredSubjects.map(s => (
              <div
                key={s.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '22px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: '#fff1f2',
                      color: '#e11d48',
                      fontWeight: 700
                    }}>
                      {s.category_name}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                      {toBengaliNumber(s.question_count)} টি প্রশ্ন
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px', lineHeight: 1.4 }}>
                    {cleanMostImportantTitle(s.title)}
                  </h3>

                  {s.max_repeated > 1 && (
                    <div style={{ fontSize: '0.82rem', color: '#e11d48', fontWeight: 600, marginBottom: '12px' }}>
                      🔥 সর্বোচ্চ {toBengaliNumber(s.max_repeated)} বার পুনরাবৃত্তি
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <Link
                    href={`/most-important-smart-questions?subject=${encodeURIComponent(s.slug)}`}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '9px 14px',
                      borderRadius: '10px',
                      background: '#e11d48',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      textDecoration: 'none'
                    }}
                  >
                    <BookOpen size={15} />
                    <span>স্মার্ট পড়ুন</span>
                  </Link>

                  <Link
                    href={`/most-important-smart-questions?subject=${encodeURIComponent(s.slug)}&mode=exam`}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '9px 14px',
                      borderRadius: '10px',
                      background: '#fff1f2',
                      color: '#e11d48',
                      border: '1px solid #fecdd3',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      textDecoration: 'none'
                    }}
                  >
                    <Sparkles size={15} />
                    <span>স্মার্ট পরীক্ষা</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MostImportantSmartPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>লোড হচ্ছে...</div>}>
      <MostImportantSmartContent />
    </Suspense>
  );
}
