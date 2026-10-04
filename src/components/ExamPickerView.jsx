'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Timer, Layers, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { getExamsCatalog, cleanExamTitle } from '../lib/examsData';

export default function ExamPickerView({ 
  targetMode = 'practice',
  customGetCatalog,
  customCleanTitle,
  basePracticeUrl = '/job-solution-practice',
  baseModelTestUrl = '/job-solution-model-test',
  customTitle,
  customSubtitle
}) {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(24);

  const isModelTest = targetMode === 'model-test';
  const fetchCatalog = customGetCatalog || getExamsCatalog;
  const cleanTitle = customCleanTitle || cleanExamTitle;

  useEffect(() => {
    fetchCatalog().then(data => {
      setCatalog(data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load exams catalog:', err);
      setLoading(false);
    });
  }, [fetchCatalog]);

  const exams = catalog?.exams || [];
  const categories = catalog?.categories || [];

  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      if (selectedCategory !== 'all' && exam.category_id !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = cleanTitle(exam.title).toLowerCase().includes(query);
        const catMatch = (exam.category_name || '').toLowerCase().includes(query);
        const slugMatch = (exam.slug || '').toLowerCase().includes(query);
        if (!titleMatch && !catMatch && !slugMatch) return false;
      }
      return true;
    });
  }, [exams, selectedCategory, searchQuery, cleanTitle]);

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1300px' }}>
        {/* Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '30px',
            background: isModelTest ? '#fffbeb' : '#ecfdf5',
            border: isModelTest ? '1px solid #fde68a' : '1px solid #a7f3d0',
            color: isModelTest ? '#b45309' : '#047857',
            fontSize: '0.86rem',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            {isModelTest ? <Timer size={16} /> : <BookOpen size={16} />}
            <span>{isModelTest ? 'লাইভ মডেল টেস্ট রুম' : 'প্র্যাকটিস ও রিভিশন রুম'}</span>
          </div>

          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '12px',
            lineHeight: 1.3
          }}>
            {customTitle || (isModelTest ? 'মডেল টেস্ট দেওয়ার জন্য পরীক্ষা নির্বাচন করুন' : 'অনুশীলন ও পড়ার জন্য পরীক্ষা নির্বাচন করুন')}
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.02rem',
            maxWidth: '680px',
            margin: '0 auto 28px',
            lineHeight: 1.6
          }}>
            {customSubtitle || (isModelTest
              ? 'তালিকা থেকে আপনার কাঙ্ক্ষিত পরীক্ষাটি বেছে নিয়ে সরাসরি রিয়েল-টাইম টাইমারসহ মডেল টেস্ট শুরু করুন।'
              : 'বিগত পরীক্ষার প্রশ্ন ও বিস্তারিত সমাধান সহকারে কার্যকরভাবে অনুশীলন করুন।')}
          </p>

          {/* Quick Search Input */}
          <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '15px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(24);
              }}
              placeholder="যেকোনো পরীক্ষা বা বিষয়ের নাম লিখে খুঁজুন (যেমন: ৪৪তম বিসিএস, সোনালী ব্যাংক, কম্পিউটার...)"
              className="input-glass"
              style={{
                paddingLeft: '46px',
                height: '48px',
                fontSize: '0.96rem',
                borderRadius: '14px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
              }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '28px',
          scrollbarWidth: 'none'
        }}>
          <button
            onClick={() => { setSelectedCategory('all'); setVisibleCount(24); }}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: selectedCategory === 'all' ? '1px solid var(--emerald-600)' : '1px solid #cbd5e1',
              background: selectedCategory === 'all' ? 'var(--gradient-brand)' : '#ffffff',
              color: selectedCategory === 'all' ? '#ffffff' : '#334155',
              fontWeight: 600,
              fontSize: '0.86rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            সকল পরীক্ষা ({exams.length})
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setVisibleCount(24); }}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: selectedCategory === cat.id ? '1px solid var(--emerald-600)' : '1px solid #cbd5e1',
                background: selectedCategory === cat.id ? 'var(--gradient-brand)' : '#ffffff',
                color: selectedCategory === cat.id ? '#ffffff' : '#334155',
                fontWeight: 600,
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Exam Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--emerald-600)', fontWeight: 600 }}>
            পরীক্ষাসমূহ লোড হচ্ছে...
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff' }}>
            <Layers size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '6px' }}>কোনো পরীক্ষা পাওয়া যায়নি</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>ভিন্ন কি-ওয়ার্ড দিয়ে আবার চেষ্টা করুন।</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="btn-secondary"
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {filteredExams.slice(0, visibleCount).map((exam) => {
                const practiceUrl = `${basePracticeUrl}?exam=${encodeURIComponent(exam.slug)}&mode=practice`;
                const readUrl = `${basePracticeUrl}?exam=${encodeURIComponent(exam.slug)}&mode=read`;
                const modelTestUrl = `${baseModelTestUrl}?exam=${encodeURIComponent(exam.slug)}`;

                return (
                  <div
                    key={exam.id}
                    className="glass-panel"
                    style={{
                      padding: '20px',
                      background: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <span className="badge badge-cyan" style={{ fontSize: '0.74rem', padding: '3px 8px' }}>
                          {exam.category_name}
                        </span>
                        {exam.year && (
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                            • {exam.year}
                          </span>
                        )}
                      </div>

                      <h3 style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: '1.45',
                        marginBottom: '10px'
                      }}>
                        {cleanTitle(exam.title)}
                      </h3>

                      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        মোট প্রশ্ন: <strong style={{ color: '#0f172a' }}>{exam.question_count}</strong> টি
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {isModelTest ? (
                        <Link
                          href={modelTestUrl}
                          className="btn-primary"
                          style={{
                            flex: 1,
                            padding: '9px 12px',
                            fontSize: '0.88rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <Timer size={15} />
                          <span>মডেল টেস্ট শুরু</span>
                        </Link>
                      ) : (
                        <>
                          <Link
                            href={practiceUrl}
                            className="btn-primary"
                            style={{
                              flex: 1,
                              padding: '8px 10px',
                              fontSize: '0.84rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <BookOpen size={14} />
                            <span>প্র্যাকটিস</span>
                          </Link>
                          <Link
                            href={readUrl}
                            className="btn-secondary"
                            style={{
                              flex: 1,
                              padding: '8px 10px',
                              fontSize: '0.84rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <span>পড়ুন (উত্তরসহ)</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load more button */}
            {visibleCount < filteredExams.length && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  onClick={() => setVisibleCount(prev => prev + 24)}
                  className="btn-secondary"
                  style={{ padding: '12px 32px', fontSize: '0.94rem' }}
                >
                  আরো ২৪টি পরীক্ষা লোড করুন (বাকি {filteredExams.length - visibleCount}টি)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
