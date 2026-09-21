'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Landmark, 
  BookOpen, 
  Building2, 
  School, 
  Layers, 
  Search,
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  Table,
  Award
} from 'lucide-react';
import { getExamsCatalog, cleanExamTitle } from '../lib/examsData';
import { matchesExamSearch } from '../lib/searchUtils';

const CATEGORY_ICONS = {
  bcs: GraduationCap,
  bank: Landmark,
  primary: BookOpen,
  ntrca: GraduationCap,
  teacher: BookOpen,
  ministry: Building2,
  admission: School,
  subject: Layers,
  education: School,
  judicial: Award
};

export default function HomePage() {
  const [catalog, setCatalog] = useState({ categories: [], exams: [], total_exams: 0, total_questions: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExamsCatalog().then(data => {
      setCatalog(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || !catalog.exams) {
      setSearchResults([]);
      return;
    }
    const matches = catalog.exams
      .filter(e => matchesExamSearch(e, searchQuery))
      .slice(0, 6);
    setSearchResults(matches);
  }, [searchQuery, catalog.exams]);

  const featuredExams = catalog.exams ? catalog.exams.filter(e => e.is_curated).slice(0, 8) : [];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '70px 0 60px',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'radial-gradient(circle at 50% -20%, rgba(16, 185, 129, 0.12) 0%, rgba(248, 250, 252, 0) 70%), #f8fafc'
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          {/* Top Pill Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span className="badge badge-emerald" style={{ padding: '6px 14px', fontSize: '0.86rem' }}>
              <Sparkles size={14} />
              <span>২,৫০,০০০+ প্রশ্নব্যাংক ও অফলাইন স্টুডিও</span>
            </span>
            <span className="badge badge-cyan" style={{ padding: '6px 14px', fontSize: '0.86rem' }}>
              <Zap size={14} />
              <span>ক্লাউডফ্লেয়ার এজ সিডিএন</span>
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: '1.25',
            marginBottom: '18px',
            letterSpacing: '-0.02em',
            color: '#0f172a'
          }}>
            বিসিএস, ব্যাংক ও সরকারি চাকরির <br />
            <span style={{
              background: 'var(--gradient-brand)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              চূড়ান্ত প্রস্তুতি ও প্রশ্নব্যাংক
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 32px',
            lineHeight: '1.7'
          }}>
            বাংলাদেশের সকল বিসিএস প্রিলিমিনারি, ব্যাংক নিয়োগ, শিক্ষক নিবন্ধন এবং মন্ত্রণালয়ের ২,১৫০+ পরীক্ষার শতভাগ নির্ভুল সমাধান ও প্রস্তুতি প্ল্যাটফর্ম।
          </p>

          {/* Live Search Bar */}
          <div style={{ maxWidth: '620px', margin: '0 auto 28px', position: 'relative' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={20} color="var(--emerald-600)" style={{ position: 'absolute', left: '16px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="যেকোনো পরীক্ষার নাম দিয়ে খুঁজুন (যেমন: 45th BCS, Bangladesh Bank, NTRCA)..."
                className="input-glass"
                style={{
                  paddingLeft: '48px',
                  paddingRight: '120px',
                  height: '56px',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Link
                href={`/job-solution?q=${encodeURIComponent(searchQuery)}`}
                className="btn-primary"
                style={{
                  position: 'absolute',
                  right: '6px',
                  height: '44px',
                  padding: '0 18px',
                  borderRadius: '10px',
                  fontSize: '0.9rem'
                }}
              >
                অনুসন্ধান
              </Link>
            </div>

            {/* Live Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div className="glass-panel" style={{
                position: 'absolute',
                top: '64px',
                left: 0,
                right: 0,
                zIndex: 40,
                padding: '8px',
                textAlign: 'left',
                borderRadius: '14px',
                background: '#ffffff',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
              }}>
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/job-solution-practice?exam=${item.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
                      transition: 'background 0.15s ease'
                    }}
                    className="search-item-hover"
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.category_name} • {item.question_count} টি প্রশ্ন
                      </div>
                    </div>
                    <ArrowRight size={16} color="var(--emerald-600)" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link href="/job-solution" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <Layers size={18} />
              <span>সকল প্রশ্ন ব্যাংক দেখুন ({catalog.total_exams.toLocaleString()} টি)</span>
            </Link>

            <Link href="/file-studio" className="btn-secondary" style={{ padding: '14px 24px', fontSize: '1rem' }}>
              <Table size={18} />
              <span>ফাইল কনভার্ট (CSV/Excel/JSON)</span>
            </Link>
          </div>
        </div>
      </section>



      {/* 6 Core Categories Grid */}
      <section style={{ padding: '20px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>ক্যাটাগরি ভিত্তিক প্রশ্নব্যাংক</span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
                প্রধান পরীক্ষার ক্যাটাগরিসমূহ
              </h2>
            </div>
            <Link href="/job-solution" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
              সকল ক্যাটাগরি এক্সপ্লোর করুন
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {catalog.categories.map((cat) => {
              const IconComponent = CATEGORY_ICONS[cat.id] || Layers;
              return (
                <Link
                  key={cat.id}
                  href={`/job-solution?cat=${cat.id}`}
                  className="glass-card-interactive"
                  style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconComponent size={24} color="var(--emerald-600)" />
                      </div>
                      <span className="badge badge-emerald">
                        {cat.exam_count} টি পরীক্ষা
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                      {cat.name}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                      {cat.desc}
                    </p>
                  </div>

                  <div style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <span>মোট {cat.question_count.toLocaleString()} টি প্রশ্ন</span>
                    <span style={{ color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      ওপেন করুন <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured / Popular Curated Exams */}
      {featuredExams.length > 0 && (
        <section style={{ padding: '10px 0 60px' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Flame size={24} color="#f59e0b" />
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                  জনপ্রিয় ও নির্বাচিত পরীক্ষা
                </h2>
              </div>
              <Link href="/job-solution" style={{ color: 'var(--emerald-600)', fontSize: '0.9rem', fontWeight: 700 }}>
                সবগুলো দেখুন ({catalog.total_exams.toLocaleString()}) →
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px'
            }}>
              {featuredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
                      {exam.category_name}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px', lineHeight: '1.5' }}>
                      {cleanExamTitle(exam.title)}
                    </h4>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      মোট প্রশ্ন: {exam.question_count} টি {exam.year ? `• সাল: ${exam.year}` : ''}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={`/job-solution-practice?exam=${exam.slug}&mode=practice`}
                      className="btn-primary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}
                    >
                      প্র্যাকটিস
                    </Link>
                    <Link
                      href={`/job-solution-model-test?exam=${exam.slug}`}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}
                    >
                      মডেল টেস্ট
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}



      <style jsx>{`
        .search-item-hover:hover {
          background: #f1f5f9;
        }
      `}</style>
    </div>
  );
}
