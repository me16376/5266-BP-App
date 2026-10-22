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
  Award,
  Monitor,
  Cpu,
  LayoutGrid
} from 'lucide-react';
import { getExamsCatalog, cleanExamTitle } from '../lib/examsData';
import { matchesExamSearch } from '../lib/searchUtils';

const SPECIAL_MODULES = [
  {
    id: 'ict',
    title: 'আইসিটি (ICT) প্রশ্নব্যাংক ও প্রস্তুতি',
    description: 'Class 9-10 Computer GK, NTRCA (313 & 325) এবং BPSC ICT Wizard-এর সকল অধ্যায়ভিত্তিক পূর্ণাঙ্গ প্রশ্নব্যাংক ও বিস্তারিত উত্তর।',
    stats: '২৮টি অধ্যায় • ২,৩২৫টি প্রশ্ন',
    tag: 'ICT প্রশ্নব্যাংক',
    icon: Monitor,
    accent: '#4f46e5',
    lightBg: '#eef2ff',
    badgeBorder: '#c7d2fe',
    badgeText: '#4338ca',
    boxUrl: '/ict',
    boxLabel: 'বক্স লেআউট',
    smartUrl: '/ict-smart',
    smartLabel: 'স্মার্ট ভিউ',
    practiceUrl: '/ict-practice?cat=class-9-10-computer-gk&folder=01-computer-poriciti'
  },
  {
    id: 'ampibian',
    title: 'অ্যাম্ফিবিয়ান সাজেশন (Ampibian Suggestion)',
    description: 'বাংলা, ইংরেজি, সাধারণ জ্ঞান ও গণিত বিষয়ের ৮৪টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও নির্ভুল সমাধান সংকলন।',
    stats: '৮৪টি অধ্যায় • ৬,১৫৭টি প্রশ্ন',
    tag: 'চূড়ান্ত সাজেশন',
    icon: BookOpen,
    accent: '#059669',
    lightBg: '#ecfdf5',
    badgeBorder: '#a7f3d0',
    badgeText: '#047857',
    boxUrl: '/ampibian-suggestion',
    boxLabel: 'বক্স লেআউট',
    smartUrl: '/ampibian-suggestion-smart',
    smartLabel: 'স্মার্ট ভিউ',
    practiceUrl: '/ampibian-suggestion-practice'
  },
  {
    id: 'biddabari',
    title: 'বিদ্যাবাড়ি শিক্ষক নিবন্ধন (Biddabari NTRCA)',
    description: 'শিক্ষক নিবন্ধন (NTRCA) প্রিলিমিনারি প্রস্তুতির বাংলা, ইংরেজি, গণিত ও জিকে লেকচার শিট ভিত্তিক পূর্ণাঙ্গ প্রশ্নব্যাংক।',
    stats: '৬৭টি লেকচার • ৯,৯৭৪টি প্রশ্ন',
    tag: 'শিক্ষক নিবন্ধন',
    icon: GraduationCap,
    accent: '#2563eb',
    lightBg: '#eff6ff',
    badgeBorder: '#bfdbfe',
    badgeText: '#1d4ed8',
    boxUrl: '/biddabari-ntrca',
    boxLabel: 'বক্স লেআউট',
    smartUrl: '/biddabari-ntrca-smart',
    smartLabel: 'স্মার্ট ভিউ',
    practiceUrl: '/biddabari-ntrca-practice'
  },
  {
    id: 'smart-ai',
    title: 'স্মার্ট AI (Smart AI) প্রশ্নব্যাংক',
    description: 'BPSC টেকনিক্যাল ও নন-ক্যাডার এবং NTRCA প্রিলিমিনারি ও আইসিটি বিষয়ের এআই কিউরেটেড সমৃদ্ধ প্রশ্নব্যাংক।',
    stats: '৮৯টি বিষয় • ১৭,১০০টি প্রশ্ন',
    tag: 'AI কিউরেটেড',
    icon: Cpu,
    accent: '#7c3aed',
    lightBg: '#f5f3ff',
    badgeBorder: '#ddd6fe',
    badgeText: '#6d28d9',
    boxUrl: '/smart-ai',
    boxLabel: 'বক্স লেআউট',
    smartUrl: '/smart-ai-smart',
    smartLabel: 'স্মার্ট ভিউ',
    practiceUrl: '/smart-ai-practice'
  },
  {
    id: 'buet-pattern',
    title: 'বুয়েট প্যাটার্ন সাজেশন (BUET Pattern)',
    description: 'বুয়েট প্যাটার্ন নিয়োগ পরীক্ষার জন্য বাংলা, ইংরেজি, সাধারণ জ্ঞান ও গণিত বিষয়ের ৫৭টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও নির্ভুল সমাধান।',
    stats: '৫৭টি অধ্যায় • ৫,৪৬০টি প্রশ্ন',
    tag: 'বুয়েট প্যাটার্ন',
    icon: Sparkles,
    accent: '#4338ca',
    lightBg: '#eef2ff',
    badgeBorder: '#c7d2fe',
    badgeText: '#3730a3',
    boxUrl: '/buet-pattern-suggestion',
    boxLabel: 'বক্স লেআউট',
    smartUrl: '/buet-pattern-suggestion-smart',
    smartLabel: 'স্মার্ট ভিউ',
    practiceUrl: '/buet-pattern-suggestion-practice'
  },
  {
    id: 'bpsc-non-tech-questions',
    title: 'BPSC নন-টেক প্রশ্নব্যাংক (Non Tech Questions)',
    description: 'বিপিএসসি নন-ক্যাডার ও নন-টেক নিয়োগ পরীক্ষার বাংলা, ইংরেজি, গণিত, বাংলাদেশ, আন্তর্জাতিক, বিজ্ঞান ও আইসিটির পূর্ণাঙ্গ সংকলন।',
    stats: '৭টি বিষয় • ৫,৬৬৪টি প্রশ্ন',
    tag: 'BPSC নন-ক্যাডার',
    icon: Layers,
    accent: '#0891b2',
    lightBg: '#ecfeff',
    badgeBorder: '#a5f3fc',
    badgeText: '#0e7490',
    boxUrl: '/bpsc-non-tech-questions',
    boxLabel: 'বক্স লেআউট',
    smartUrl: '/bpsc-non-tech-questions-smart',
    smartLabel: 'স্মার্ট ভিউ',
    practiceUrl: '/bpsc-non-tech-questions-practice'
  },
  {
    id: 'bpsc-non-tech-suggestion',
    title: 'BPSC নন-টেক সাজেশন (Non Tech Suggestion)',
    description: 'বিপিএসসি নন-ক্যাডার ও নন-টেক পরীক্ষার ৮টি বিষয়ের ৯১টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও বিস্তারিত সমাধান সংকলন।',
    stats: '৯১টি অধ্যায় • ৫,৬৬৪টি প্রশ্ন',
    tag: 'BPSC সাজেশন',
    icon: Sparkles,
    accent: '#d97706',
    lightBg: '#fffbeb',
    badgeBorder: '#fde68a',
    badgeText: '#b45309',
    boxUrl: '/bpsc-non-tech-suggestion',
    boxLabel: 'বক্স লেআউট',
    smartUrl: '/bpsc-non-tech-suggestion-smart',
    smartLabel: 'স্মার্ট ভিউ',
    practiceUrl: '/bpsc-non-tech-suggestion-practice'
  },
  {
    id: 'saif-ntrca-100-model',
    title: 'সাইফ স্যার NTRCA ১০০ MCQ মডেল টেস্ট',
    description: 'সাইফ স্যারের শিক্ষক নিবন্ধন (NTRCA) প্রিলিমিনারি প্রস্তুতির ৭৫টি পূর্ণাঙ্গ ১০০ নম্বরের স্পেশাল বুলেটিন মডেল টেস্ট ও নির্ভুল ব্যাখ্যা।',
    stats: '৭৫টি টেস্ট • ৭,২২৫টি প্রশ্ন',
    tag: '১০০ নম্বরের মডেল',
    icon: Award,
    accent: '#3b82f6',
    lightBg: '#eff6ff',
    badgeBorder: '#bfdbfe',
    badgeText: '#1d4ed8',
    boxUrl: '/saif-ntrca-100-model',
    boxLabel: 'বক্স লেআউট',
    smartUrl: '/saif-ntrca-100-model-smart',
    smartLabel: 'স্মার্ট ভিউ',
    practiceUrl: '/saif-ntrca-100-model-practice'
  },
  {
    id: 'saif-ntrca-suggestion',
    title: 'সাইফ স্যার NTRCA এক্সক্লুসিভ সাজেশন',
    description: 'শিক্ষক নিবন্ধন (NTRCA) প্রিলিমিনারি প্রস্তুতির ৩৩৮টি বিষয়ভিত্তিক শর্ট মডেল বুলেটিন ও চূড়ান্ত সাজেশন সংকলন।',
    stats: '৩৩৮টি বুলেটিন • ৭,২২৫টি প্রশ্ন',
    tag: 'শর্ট বুলেটিন',
    icon: BookOpen,
    accent: '#0d9488',
    lightBg: '#f0fdfa',
    badgeBorder: '#99f6e4',
    badgeText: '#0f766e',
    boxUrl: '/saif-ntrca-suggestion',
    boxLabel: 'বক্স লেআউট',
    smartUrl: '/saif-ntrca-suggestion-smart',
    smartLabel: 'স্মার্ট ভিউ',
    practiceUrl: '/saif-ntrca-suggestion-practice'
  },
  {
    id: 'most-important',
    title: 'সর্বাধিক কমন প্রশ্ন (Most Important)',
    description: 'প্রাইমারি শিক্ষক, NTRCA নিবন্ধন, বিসিএস, ব্যাংক, ১০ম-২০তম গ্রেড ও সাম্প্রতিক বাংলাদেশ-আন্তর্জাতিক বিষয়ের বাছাইকৃত প্রশ্নাবলি।',
    stats: '১২টি বিষয় • ৪,৯০৪টি প্রশ্ন',
    tag: 'সর্বাধিক কমন',
    icon: Award,
    accent: '#8b5cf6',
    lightBg: '#f5f3ff',
    badgeBorder: '#ddd6fe',
    badgeText: '#6d28d9',
    boxUrl: '/most-important-questions',
    boxLabel: 'বক্স লেআউট',
    smartUrl: '/most-important-smart',
    smartLabel: 'স্মার্ট ভিউ',
    practiceUrl: '/most-important-questions-practice?cat=primary-most-important&file=primary-assistant-teacher-final-suggestion'
  }
];

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
          {/* Top Pill Badges */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="badge badge-emerald" style={{ padding: '6px 14px', fontSize: '0.86rem' }}>
              <Sparkles size={14} />
              <span>২,৫০,০০০+ জব সলিউশনস</span>
            </span>
            <Link href="/ict" className="badge badge-indigo" style={{ padding: '6px 14px', fontSize: '0.86rem', textDecoration: 'none' }}>
              <Monitor size={14} />
              <span>২,৩২৫টি আইসিটি প্রশ্ন</span>
            </Link>
            <Link href="/most-important-questions" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', textDecoration: 'none' }}>
              <Award size={14} />
              <span>৪,৯০৪টি সর্বাধিক কমন</span>
            </Link>
            <Link href="/ampibian-suggestion" className="badge badge-emerald" style={{ padding: '6px 14px', fontSize: '0.86rem', textDecoration: 'none' }}>
              <BookOpen size={14} />
              <span>৬,১৫৭টি অ্যাম্ফিবিয়ান সাজেশন</span>
            </Link>
            <Link href="/biddabari-ntrca" className="badge badge-cyan" style={{ padding: '6px 14px', fontSize: '0.86rem', textDecoration: 'none' }}>
              <GraduationCap size={14} />
              <span>৯,৯৭৪টি বিদ্যাবাড়ি NTRCA</span>
            </Link>
            <Link href="/smart-ai" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', textDecoration: 'none' }}>
              <Cpu size={14} />
              <span>১৭,১০০টি স্মার্ট AI প্রশ্ন</span>
            </Link>
            <Link href="/buet-pattern-suggestion" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe', textDecoration: 'none' }}>
              <Sparkles size={14} />
              <span>৫,৪৬০টি বুয়েট প্যাটার্ন</span>
            </Link>
            <Link href="/bpsc-non-tech-suggestion" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', textDecoration: 'none' }}>
              <Sparkles size={14} />
              <span>৫,৬৬৪টি BPSC সাজেশন</span>
            </Link>
            <Link href="/saif-ntrca-100-model" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', textDecoration: 'none' }}>
              <GraduationCap size={14} />
              <span>৭,২২৫টি সাইফ স্যার মডেল</span>
            </Link>
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
            বাংলাদেশের সকল বিসিএস প্রিলিমিনারি, ব্যাংক নিয়োগ, শিক্ষক নিবন্ধন এবং মন্ত্রণালয়ের ২,১৫০+ পরীক্ষার শতভাগ নির্ভুল সমাধান, আইসিটি অধ্যায়ভিত্তিক ও সর্বাধিক কমন প্রশ্ন সংকলন।
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
                    href={`/job-solution-practice?exam=${encodeURIComponent(item.slug)}`}
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
            <Link href="/job-solution" className="btn-primary" style={{ padding: '13px 24px', fontSize: '0.95rem' }}>
              <Layers size={18} />
              <span>জব সলিউশনস ({catalog.total_exams.toLocaleString()} টি)</span>
            </Link>

            <Link href="/ict" className="btn-secondary" style={{ padding: '13px 20px', fontSize: '0.95rem', borderColor: '#818cf8', color: '#4338ca' }}>
              <Monitor size={18} color="#4f46e5" />
              <span>আইসিটি স্পেশাল (২৮ অধ্যায়)</span>
            </Link>

            <Link href="/most-important-questions" className="btn-secondary" style={{ padding: '13px 20px', fontSize: '0.95rem', borderColor: '#ddd6fe', color: '#6d28d9' }}>
              <Award size={18} color="#7c3aed" />
              <span>সর্বাধিক কমন (৪,৯০৪ প্রশ্ন)</span>
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

      {/* Special Exclusive Modules Section */}
      <section style={{ padding: '30px 0 60px', position: 'relative' }}>
        <div className="container">
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                color: '#4338ca',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '10px'
              }}>
                <Sparkles size={14} color="#4f46e5" />
                <span>স্পেশাল এক্সক্লুসিভ সংকলন</span>
              </div>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                lineHeight: '1.25'
              }}>
                বিশেষ প্রশ্নব্যাংক ও প্রস্তুতি মডিউল
              </h2>
              <p style={{
                fontSize: '0.96rem',
                color: '#64748b',
                marginTop: '6px',
                maxWidth: '680px',
                lineHeight: '1.6'
              }}>
                অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন, বিসিএস ও বিপিএসসি নন-ক্যাডার, শিক্ষক নিবন্ধন এবং স্পেশাল মডেল টেস্টের সমন্বিত এক্সক্লুসিভ সংকলন।
              </p>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#334155'
            }}>
              <Layers size={16} color="#6366f1" />
              <span>১০টি প্রিমিয়াম মডিউল • ৭৫,০০০+ MCQ</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {SPECIAL_MODULES.map(mod => {
              const IconComponent = mod.icon;
              return (
                <div 
                  key={mod.id} 
                  className="special-module-card"
                  style={{
                    borderBottom: `4px solid ${mod.accent}`
                  }}
                >
                  <div>
                    {/* Top: Icon & Stats Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: mod.lightBg,
                        border: `1px solid ${mod.badgeBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <IconComponent size={23} color={mod.accent} />
                      </div>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: mod.badgeText,
                        background: mod.lightBg,
                        border: `1px solid ${mod.badgeBorder}`,
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        whiteSpace: 'nowrap'
                      }}>
                        {mod.stats}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      lineHeight: '1.35',
                      marginBottom: '8px'
                    }}>
                      {mod.title}
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: '0.88rem',
                      color: '#64748b',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      minHeight: '44px'
                    }}>
                      {mod.description}
                    </p>
                  </div>

                  {/* Actions / Buttons */}
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <Link
                        href={mod.boxUrl}
                        className="special-module-btn-box"
                        style={{
                          background: mod.accent,
                          boxShadow: `0 3px 12px ${mod.accent}33`
                        }}
                      >
                        <LayoutGrid size={15} />
                        <span>{mod.boxLabel}</span>
                      </Link>
                      <Link
                        href={mod.smartUrl}
                        className="special-module-btn-smart"
                      >
                        <Sparkles size={14} color={mod.accent} />
                        <span>{mod.smartLabel}</span>
                      </Link>
                    </div>

                    {/* Practice Direct Link */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '11px',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      <Link
                        href={mod.practiceUrl}
                        className="special-module-practice-link"
                        style={{ color: mod.accent }}
                      >
                        <Zap size={13} />
                        <span>সরাসরি অনুশীলন</span>
                        <ArrowRight size={13} className="link-arrow" />
                      </Link>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                        {mod.tag}
                      </span>
                    </div>
                  </div>
                </div>
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
                      href={`/job-solution-practice?exam=${encodeURIComponent(exam.slug)}&mode=practice`}
                      className="btn-primary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}
                    >
                      প্র্যাকটিস
                    </Link>
                    <Link
                      href={`/job-solution-model-test?exam=${encodeURIComponent(exam.slug)}`}
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




    </div>
  );
}
