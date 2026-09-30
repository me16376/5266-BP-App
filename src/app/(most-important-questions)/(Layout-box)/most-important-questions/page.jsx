'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Layers, 
  BookOpen, 
  Timer, 
  Sparkles,
  Flame,
  Award
} from 'lucide-react';
import { getMostImportantCatalog, cleanMostImportantTitle } from '../../../../lib/mostImportantData';
import { useAuth } from '../../../../lib/authContext';

function MostImportantDirectoryContent() {
  const { user, isAuthorized, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [catalog, setCatalog] = useState({ categories: [], subjects: [] });
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
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
      const matchCat = selectedCategory === 'all' || s.category_id === selectedCategory;
      const matchQuery = !searchQuery.trim() || 
        s.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        s.category_name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchCat && matchQuery;
    });
  }, [catalog.subjects, selectedCategory, searchQuery]);

  return (
    <div style={{ minHeight: '85vh', background: 'var(--bg-primary)', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
              <Flame size={15} />
              <span>সর্বাধিক কমন প্রশ্নাবলি (Most Important)</span>
            </span>
            <span className="badge badge-emerald" style={{ padding: '6px 14px', fontSize: '0.86rem' }}>
              <Sparkles size={15} />
              <span>{catalog.total_subjects || 11} টি বিষয় • {catalog.total_questions || 4904} টি কমন প্রশ্ন</span>
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            বিগত সালের সর্বাধিক রিপিটেড ও কমন প্রশ্নব্যাংক
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
            বিসিএস, ব্যাংক, প্রাথমিক শিক্ষক ও পিএসসি পরীক্ষায় ৩ বা ততোধিকবার আসা প্রশ্নসমূহের বিষয়ভিত্তিক সমাধান ও প্রস্তুতি
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} color="#e11d48" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বিষয়ের নাম বা ক্যাটাগরি লিখে খুঁজুন..."
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

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {catalog.categories && catalog.categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`btn-secondary ${selectedCategory === cat.id ? 'active' : ''}`}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.88rem',
                    borderRadius: '10px',
                    background: selectedCategory === cat.id ? '#fff1f2' : '#ffffff',
                    borderColor: selectedCategory === cat.id ? '#f43f5e' : 'var(--border-subtle)',
                    color: selectedCategory === cat.id ? '#e11d48' : 'var(--text-primary)'
                  }}
                >
                  {cat.name} ({cat.subject_count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div className="skeleton-line" style={{ width: '200px', height: '24px', margin: '0 auto 16px' }} />
            <span>কমন প্রশ্নব্যাংক লোড হচ্ছে...</span>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <p>কোনো বিষয় পাওয়া যায়নি।</p>
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
                className="glass-panel" 
                style={{ 
                  padding: '22px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderRadius: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="badge" style={{ fontSize: '0.78rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
                      {s.category_name}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {s.question_count} টি প্রশ্ন
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px', lineHeight: 1.4 }}>
                    {cleanMostImportantTitle(s.title)}
                  </h3>

                  {s.max_repeated > 1 && (
                    <div style={{ fontSize: '0.8rem', color: '#e11d48', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Award size={14} />
                      <span>সর্বোচ্চ {s.max_repeated} বার পরীক্ষায় পুনরাবৃত্তি</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <Link
                    href={`/most-important-questions-practice?subject=${encodeURIComponent(s.slug)}`}
                    className="btn-primary"
                    style={{ flex: 1, padding: '9px 14px', fontSize: '0.88rem', justifyContent: 'center' }}
                  >
                    <BookOpen size={16} />
                    <span>অনুশীলন</span>
                  </Link>

                  <Link
                    href={`/most-important-questions-model-test?subject=${encodeURIComponent(s.slug)}`}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '9px 14px', fontSize: '0.88rem', justifyContent: 'center' }}
                  >
                    <Timer size={16} />
                    <span>মডেল টেস্ট</span>
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

export default function MostImportantDirectoryPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>লোড হচ্ছে...</div>}>
      <MostImportantDirectoryContent />
    </Suspense>
  );
}
