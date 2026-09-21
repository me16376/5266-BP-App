'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Timer, 
  ArrowLeft, 
  Search, 
  CheckCircle2,
  Layers
} from 'lucide-react';
import QuestionCard from '../../components/QuestionCard';
import { loadExamQuestions, cleanExamTitle } from '../../lib/examsData';

function PracticeContent() {
  const searchParams = useSearchParams();
  const examSlug = searchParams.get('exam');
  const initialMode = searchParams.get('mode') || 'practice';

  const [mode, setMode] = useState(initialMode);
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    if (!examSlug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    loadExamQuestions(examSlug).then(res => {
      setExamData(res.exam);
      setQuestions(res.questions || []);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading questions:', err);
      setLoading(false);
    });
  }, [examSlug]);

  // Unique subjects in this exam
  const subjects = useMemo(() => {
    const set = new Set();
    questions.forEach(q => {
      if (q.subject) set.add(q.subject);
    });
    return Array.from(set);
  }, [questions]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) {
        return false;
      }
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchQ = q.question.toLowerCase().includes(query);
        const matchExp = q.explanation && q.explanation.toLowerCase().includes(query);
        if (!matchQ && !matchExp) return false;
      }
      return true;
    });
  }, [questions, selectedSubject, searchFilter]);

  // If no exam selected, show prompt to choose from job solutions (exams) page
  if (!examSlug) {
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
            <BookOpen size={38} color="var(--emerald-600)" />
          </div>

          <span className="badge badge-emerald" style={{ marginBottom: '14px', padding: '6px 16px', fontSize: '0.84rem' }}>
            প্র্যাকটিস ও রিড মোড
          </span>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', lineHeight: 1.3 }}>
            কোনো পরীক্ষা নির্বাচন করা হয়নি
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '28px' }}>
            মেইন জব সলিউশন পেজ থেকে একটা একটা এক্সাম চুজ করুন, তারপর প্র্যাকটিস করতে পারবেন।
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/exams"
              className="btn-primary"
              style={{ padding: '13px 28px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Layers size={18} />
              <span>জব সলিউশন পেজে যান (সকল পরীক্ষা)</span>
            </Link>

            <Link
              href="/"
              className="btn-secondary"
              style={{ padding: '13px 24px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <span>হোম পেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading questions state
  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '24px 36px', display: 'inline-flex', alignItems: 'center', gap: '14px', background: '#ffffff' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ color: 'var(--emerald-600)', fontSize: '1.4rem' }}></i>
          <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>প্রশ্নপত্র লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Top Breadcrumb & Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <Link
            href="/exams"
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.86rem' }}
          >
            <ArrowLeft size={16} />
            <span>অন্যান্য পরীক্ষা</span>
          </Link>

          {/* Mode Switcher Segmented Control */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1'
          }}>
            <button
              onClick={() => setMode('practice')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: mode === 'practice' ? 'var(--gradient-brand)' : 'transparent',
                color: mode === 'practice' ? '#ffffff' : '#475569',
                boxShadow: mode === 'practice' ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <CheckCircle2 size={16} />
              <span>প্র্যাকটিস মোড</span>
            </button>

            <button
              onClick={() => setMode('read')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: mode === 'read' ? 'var(--gradient-brand)' : 'transparent',
                color: mode === 'read' ? '#ffffff' : '#475569',
                boxShadow: mode === 'read' ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <BookOpen size={16} />
              <span>পড়ুন মোড (উত্তরসহ)</span>
            </button>

            <Link
              href={`/model-test?exam=${examSlug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--amber-600)',
                textDecoration: 'none'
              }}
            >
              <Timer size={16} />
              <span>মডেল টেস্ট দিন</span>
            </Link>
          </div>
        </div>

        {/* Exam Title Card */}
        <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: '28px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge badge-emerald">
              {mode === 'practice' ? 'প্র্যাকটিস ও ব্যাখ্যা' : 'রিভিশন ও পড়ুন মোড'}
            </span>
            {examData && examData.category_name && (
              <span className="badge badge-cyan">
                {examData.category_name}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            {examData ? cleanExamTitle(examData.title) : 'পরীক্ষার প্রশ্নব্যাংক'}
          </h1>

          <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            মোট প্রশ্ন: <strong style={{ color: '#0f172a' }}>{questions.length}</strong> টি
            {subjects.length > 0 && ` • বিষয় অন্তর্ভুক্ত: ${subjects.length} টি`}
          </div>

          {/* Search & Subject Filter Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="এই পরীক্ষার প্রশ্ন বা ব্যাখ্যায় খুঁজুন..."
                className="input-glass"
                style={{ paddingLeft: '38px', height: '42px', fontSize: '0.88rem' }}
              />
            </div>

            {subjects.length > 0 && (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input-glass"
                style={{ height: '42px', fontSize: '0.88rem', cursor: 'pointer' }}
              >
                <option value="all">সকল বিষয় ({questions.length})</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--emerald-600)', fontWeight: 600 }}>
            প্রশ্ন লোড হচ্ছে...
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff' }}>
            <BookOpen size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '6px' }}>
              কোনো প্রশ্ন পাওয়া যায়নি
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              এই পরীক্ষার জন্য এখনও অফলাইন JSON ফাইল লোড করা হয়নি, অথবা আপনি ফাইল স্টুডিও থেকে সরাসরি লোড করতে পারেন।
            </p>
            <Link href="/exams" className="btn-primary">
              সকল পরীক্ষা দেখুন
            </Link>
          </div>
        ) : (
          <div>
            {filteredQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id || idx}
                question={q}
                index={idx}
                mode={mode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center', color: '#047857' }}>লোড হচ্ছে...</div>}>
      <PracticeContent />
    </Suspense>
  );
}
