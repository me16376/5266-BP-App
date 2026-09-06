'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Timer, 
  ArrowLeft, 
  Search, 
  CheckCircle2
} from 'lucide-react';
import QuestionCard from '../../components/QuestionCard';
import { loadExamQuestions } from '../../lib/examsData';

function PracticeContent() {
  const searchParams = useSearchParams();
  const examSlug = searchParams.get('exam') || '45th-bcs-general-may-2023';
  const initialMode = searchParams.get('mode') || 'practice';

  const [mode, setMode] = useState(initialMode);
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    setLoading(true);
    loadExamQuestions(examSlug).then(res => {
      setExamData(res.exam);
      setQuestions(res.questions);
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
              href={`/file-exam?exam=${examSlug}`}
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
            {examData ? examData.title : 'পরীক্ষার প্রশ্নব্যাংক'}
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
