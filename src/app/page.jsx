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
  Timer, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Zap,
  Table
} from 'lucide-react';
import { getExamsCatalog, cleanExamTitle } from '../lib/examsData';
import { matchesExamSearch } from '../lib/searchUtils';

const CATEGORY_ICONS = {
  bcs: GraduationCap,
  bank: Landmark,
  teacher: BookOpen,
  ministry: Building2,
  admission: School,
  subject: Layers
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
    <div style={{ paddingBottom: '60px' }}>
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
            বাংলাদেশের সকল বিসিএস প্রিলিমিনারি, ব্যাংক নিয়োগ, শিক্ষক নিবন্ধন এবং মন্ত্রণালয়ের ২,১০০+ পরীক্ষার শতভাগ নির্ভুল সমাধান, ৩টি পড়ার মোড ও অফলাইন ফাইল স্টুডিও।
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
                href={`/exams?q=${encodeURIComponent(searchQuery)}`}
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
                    href={`/practice?exam=${item.slug}`}
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
            <Link href="/exams" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <Layers size={18} />
              <span>সকল পরীক্ষা দেখুন ({catalog.total_exams.toLocaleString()} টি)</span>
            </Link>

            <Link href="/file-studio" className="btn-secondary" style={{ padding: '14px 24px', fontSize: '1rem' }}>
              <Table size={18} />
              <span>টেবিল স্টুডিও (CSV/Excel/JSON)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Core Study Modes Showcase */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>৩টি পড়ার ও পরীক্ষার মোড</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              আপনার পছন্দমতো স্টাডি মোড নির্বাচন করুন
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {/* Mode 1: Practice */}
            <Link href="/practice?mode=practice" className="glass-card-interactive" style={{ padding: '30px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                border: '1px solid #a7f3d0'
              }}>
                <CheckCircle2 size={28} color="#059669" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                ১. প্র্যাকটিস মোড (Practice Mode)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '18px' }}>
                অপশনে ক্লিক করলেই সাথে সাথে সবুজ/লাল রঙে সঠিক উত্তর চিহ্নিত হবে এবং নিচে বিস্তারিত সাধারণ ব্যাখ্যা ও শর্টকাট নোট খুলবে।
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--emerald-600)', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>শুরু করুন</span>
                <ArrowRight size={16} />
              </div>
            </Link>

            {/* Mode 2: Read Mode */}
            <Link href="/practice?mode=read" className="glass-card-interactive" style={{ padding: '30px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: '#f0fdfa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                border: '1px solid #99f6e4'
              }}>
                <BookOpen size={28} color="#0891b2" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                ২. পড়ুন মোড (Read / Revision Mode)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '18px' }}>
                দ্রুত রিভিশন দেওয়ার জন্য আদর্শ। প্রতিটি প্রশ্নের সঠিক উত্তর এবং বিস্তারিত রেফারেন্স আগে থেকেই দৃশ্যমান থাকবে।
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan-600)', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>রিভিশন দিন</span>
                <ArrowRight size={16} />
              </div>
            </Link>

            {/* Mode 3: Live Exam */}
            <Link href="/model-test" className="glass-card-interactive" style={{ padding: '30px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: '#fffbeb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                border: '1px solid #fde68a'
              }}>
                <Timer size={28} color="#d97706" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                ৩. লাইভ মডেল টেস্ট (Model Test Room)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '18px' }}>
                কাউন্টডাউন টাইমার, প্রশ্ন জাম্পিং প্যালেট, ০.৫০ নেগেটিভ মার্কিং সহ রিয়েল-টাইম এক্সাম ও নির্ভুল মার্কশিট।
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--amber-600)', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>মডেল টেস্ট দিন</span>
                <ArrowRight size={16} />
              </div>
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
                ৬টি প্রধান পরীক্ষার ক্যাটাগরি
              </h2>
            </div>
            <Link href="/exams" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
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
                  href={`/exams?cat=${cat.id}`}
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
              <Link href="/exams" style={{ color: 'var(--emerald-600)', fontSize: '0.9rem', fontWeight: 700 }}>
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
                      href={`/practice?exam=${exam.slug}&mode=practice`}
                      className="btn-primary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}
                    >
                      প্র্যাকটিস
                    </Link>
                    <Link
                      href={`/model-test?exam=${exam.slug}`}
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

      {/* Universal File Studio Promo Banner */}
      <section style={{ padding: '20px 0' }}>
        <div className="container">
          <div className="glass-panel" style={{
            padding: '36px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <div style={{ maxWidth: '640px' }}>
              <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>
                <Table size={12} /> ডাটা ও ফাইল স্টুডিও
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                CSV, Excel (.xlsx) অথবা JSON ডেটা টেবিল আকারে দেখুন
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.6' }}>
                যেকোনো স্প্রেডশিট বা ডেটাসেট সরাসরি ব্রাউজারেই ওপেন করুন। ১০০% অফলাইন ও নিরাপদ প্রসেসিং সহ লাইভ সার্চ, সর্টিং, পেজিনেশন এবং নতুন ফরম্যাটে এক্সপোর্ট করার সুবিধা।
              </p>
            </div>

            <Link href="/file-studio" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem', whiteSpace: 'nowrap' }}>
              <Table size={18} />
              <span>টেবিল স্টুডিও ওপেন করুন</span>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .search-item-hover:hover {
          background: #f1f5f9;
        }
      `}</style>
    </div>
  );
}
