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
  Flame,
  Layers
} from 'lucide-react';
import QuestionCard from '../../../../components/QuestionCard';
import { loadMostImportantQuestions, cleanMostImportantTitle } from '../../../../lib/mostImportantData';
import { useAuth } from '../../../../lib/authContext';
import LoginRequiredModal from '../../../../components/LoginRequiredModal';
import ChooseExamPopup from '../../../../components/ChooseExamPopup';

function MostImportantPracticeContent() {
  const { user, loading: authLoading, logout } = useAuth();
  const searchParams = useSearchParams();
  const examSlug = searchParams.get('exam') || searchParams.get('subject') || searchParams.get('slug');
  const initialMode = searchParams.get('mode') || 'practice';

  const [mode, setMode] = useState(initialMode);
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedRange, setSelectedRange] = useState('all');
  const [visibleCount, setVisibleCount] = useState(100);

  const isOwner = user?.role === 'owner';
  const isAdmin = user?.role === 'admin';
  const isApprovedUser = user?.status === 'approved';
  const isAuthorized = isOwner || isAdmin || isApprovedUser;

  useEffect(() => {
    if (!examSlug || !isAuthorized) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setVisibleCount(100);
    setSelectedRange('all');
    loadMostImportantQuestions(examSlug).then(res => {
      setExamData(res.exam);
      setQuestions(res.questions || []);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading most important questions:', err);
      setLoading(false);
    });
  }, [examSlug, isAuthorized]);

  // Unique subjects/topics in this set
  const subjects = useMemo(() => {
    const set = new Set();
    questions.forEach(q => {
      if (q.subject) set.add(q.subject);
      else if (q.topic) set.add(q.topic);
    });
    return Array.from(set);
  }, [questions]);

  // Range chunks: 1-100, 101-200, 201-300...
  const rangeChunks = useMemo(() => {
    const total = questions.length;
    if (total <= 100) return [];
    const chunks = [];
    for (let start = 1; start <= total; start += 100) {
      const end = Math.min(start + 99, total);
      chunks.push({
        id: `${start}-${end}`,
        start,
        end,
        label: `${start} - ${end}`
      });
    }
    return chunks;
  }, [questions.length]);

  // Questions sliced by selectedRange
  const rangedQuestions = useMemo(() => {
    if (selectedRange === 'all') {
      return questions.map((q, idx) => ({ ...q, originalIndex: idx }));
    }
    const [start, end] = selectedRange.split('-').map(Number);
    if (!start || !end) {
      return questions.map((q, idx) => ({ ...q, originalIndex: idx }));
    }
    return questions.slice(start - 1, end).map((q, idx) => ({
      ...q,
      originalIndex: start - 1 + idx
    }));
  }, [questions, selectedRange]);

  // Filtered questions (applying range + subject + search)
  const filteredQuestions = useMemo(() => {
    return rangedQuestions.filter(q => {
      if (selectedSubject !== 'all' && q.subject !== selectedSubject && q.topic !== selectedSubject) {
        return false;
      }
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const qText = String(q.question || q.question_text || '').toLowerCase();
        const matchQ = qText.includes(query);
        const matchExp = q.explanation && String(q.explanation).toLowerCase().includes(query);
        if (!matchQ && !matchExp) return false;
      }
      return true;
    });
  }, [rangedQuestions, selectedSubject, searchFilter]);

  // 1. Loading State while checking auth
  if (authLoading) {
    return (
      <div style={{ padding: '100px 20px', minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '24px 36px', display: 'inline-flex', alignItems: 'center', gap: '14px', background: '#ffffff' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ color: 'var(--emerald-600)', fontSize: '1.4rem' }}></i>
          <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>ব্যবহারকারীর অ্যাকাউন্ট যাচাই করা হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: User is not logged in -> Show Login Required view
  if (!user) {
    return (
      <LoginRequiredModal
        isOpen={true}
        title="প্রশ্ন অনুশীলন করতে লগইন প্রয়োজন"
        description="সর্বাধিক রিপিটেড কমন প্রশ্ন ও উত্তর অনুশীলন করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।"
        loginRedirect={`/most-important-questions-practice/${examSlug ? `?exam=${encodeURIComponent(examSlug)}` : ''}`}
        chooseExamUrl="/most-important-questions"
        chooseExamText="কমন প্রশ্নব্যাংক বিষয় তালিকা"
      />
    );
  }

  // 3. User logged in, but not approved (pending / suspended)
  if (user && !isAuthorized) {
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
          border: '1px solid #fed7aa'
        }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: '#fffbeb',
            border: '2px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)'
          }}>
            <i className="fa-solid fa-hourglass-half" style={{ fontSize: '2.4rem', color: '#d97706' }}></i>
          </div>

          <span className="badge badge-amber" style={{ marginBottom: '14px', padding: '6px 16px', fontSize: '0.84rem' }}>
            <i className="fa-solid fa-clock" style={{ marginRight: '6px' }}></i> অ্যাকাউন্টের অনুমোদন বাকি
          </span>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', lineHeight: 1.3 }}>
            আপনার অ্যাকাউন্টটি এখনো অনুমোদিত হয়নি
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '24px' }}>
            প্রিয় <strong>{user.name}</strong>, আপনার অ্যাকাউন্টটি বর্তমানে পর্যালোচনার অধীনে রয়েছে। শুধুমাত্র <strong>অনুমোদিত শিক্ষার্থী (Approved User)</strong> বা <strong>অ্যাডমিনিস্ট্রেটর</strong> ছাড়া এই পেজটি দেখা যাবে না। সিস্টেম অ্যাডমিন অনুমোদন সম্পন্ন করার পর আপনি প্র্যাকটিস ও পড়াশোনা করতে পারবেন।
          </p>

          <div style={{
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '14px',
            padding: '16px 20px',
            textAlign: 'left',
            marginBottom: '28px',
            fontSize: '0.9rem',
            color: '#78350f'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>ইউজারনেম:</span>
              <strong>@{user.username}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>ইমেইল:</span>
              <strong>{user.email}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>বর্তমান স্ট্যাটাস:</span>
              <span className="badge badge-amber" style={{ fontSize: '0.78rem' }}>পেন্ডিং (অনুমোদনের অপেক্ষায়)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/profile"
              className="btn-primary"
              style={{ padding: '13px 26px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-user"></i>
              <span>প্রোফাইল স্ট্যাটাস দেখুন</span>
            </Link>

            <Link
              href="/"
              className="btn-secondary"
              style={{ padding: '13px 24px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-house"></i>
              <span>হোম পেজে যান</span>
            </Link>

            <button
              onClick={logout}
              className="btn-secondary"
              style={{ padding: '13px 22px', fontSize: '0.98rem', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. If user is logged in, but no exam selected -> Show Popup telling user to choose an exam from /most-important-questions/
  if (!examSlug) {
    return (
      <ChooseExamPopup
        targetUrl="/most-important-questions"
        targetLabel="বিষয় নির্বাচন করুন (/most-important-questions)"
        isOpen={true}
        title="একটি বিষয় নির্বাচন করুন"
        description="প্রশ্ন ও উত্তর অনুশীলন করতে অনুগ্রহ করে /most-important-questions/ পেজ থেকে যেকোনো একটি বিষয় নির্বাচন করুন।"
      />
    );
  }

  // Loading questions state
  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ padding: '20px 32px', display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1', borderTopColor: 'var(--emerald-600)' }} />
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
            href="/most-important-questions"
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.86rem' }}
          >
            <ArrowLeft size={16} />
            <span>অন্যান্য বিষয়</span>
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
              href={`/most-important-questions-model-test?exam=${encodeURIComponent(examSlug || '')}`}
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
              {mode === 'practice' ? 'কমন প্রশ্ন প্র্যাকটিস ও ব্যাখ্যা' : 'কমন প্রশ্ন পড়ুন মোড'}
            </span>
            {examData && examData.category_name && (
              <span className="badge badge-cyan">
                {examData.category_name}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            {examData ? cleanMostImportantTitle(examData.title) : 'কমন প্রশ্নব্যাংক'}
          </h1>

          <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            মোট প্রশ্ন: <strong style={{ color: '#0f172a' }}>{questions.length}</strong> টি
            {selectedRange !== 'all' && (
              <span className="badge badge-emerald" style={{ marginLeft: '8px', fontSize: '0.8rem', padding: '3px 10px' }}>
                রেঞ্জ: {selectedRange}
              </span>
            )}
          </div>

          {/* Range Selection Pills */}
          {rangeChunks.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                প্রশ্ন রেঞ্জ ফিল্টার:
              </span>
              <button
                onClick={() => { setSelectedRange('all'); setVisibleCount(100); }}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedRange === 'all' ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                  background: selectedRange === 'all' ? '#ecfdf5' : '#ffffff',
                  color: selectedRange === 'all' ? '#047857' : '#475569'
                }}
              >
                সকল প্রশ্ন ({questions.length})
              </button>
              {rangeChunks.map(chunk => {
                const isSelected = selectedRange === chunk.id;
                return (
                  <button
                    key={chunk.id}
                    onClick={() => { setSelectedRange(chunk.id); setVisibleCount(100); }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                      background: isSelected ? '#ecfdf5' : '#ffffff',
                      color: isSelected ? '#047857' : '#475569'
                    }}
                  >
                    {chunk.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Subject / Topic Pills (if exam has subjects) */}
          {subjects.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)' }}>বিষয়:</span>
              <button
                onClick={() => { setSelectedSubject('all'); setVisibleCount(100); }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedSubject === 'all' ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                  background: selectedSubject === 'all' ? '#ecfdf5' : '#ffffff',
                  color: selectedSubject === 'all' ? '#047857' : '#475569'
                }}
              >
                সকল বিষয়
              </button>
              {subjects.map(s => {
                const isSelected = selectedSubject === s;
                return (
                  <button
                    key={s}
                    onClick={() => { setSelectedSubject(s); setVisibleCount(100); }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                      background: isSelected ? '#ecfdf5' : '#ffffff',
                      color: isSelected ? '#047857' : '#475569'
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}

          {/* Search Filter */}
          <div style={{ marginTop: '16px', position: 'relative', maxWidth: '480px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="এই বিষয়ের নির্দিষ্ট কোনো প্রশ্ন বা টপিক খুঁজুন..."
              className="input-glass"
              style={{ paddingLeft: '38px', height: '40px', fontSize: '0.88rem' }}
            />
          </div>
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '6px' }}>
              কোনো প্রশ্ন পাওয়া যায়নি
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              অনুগ্রহ করে অন্য কোনো ফিল্টার বা সার্চ কি-ওয়ার্ড ব্যবহার করুন।
            </p>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              প্রদর্শিত হচ্ছে: <strong>{Math.min(visibleCount, filteredQuestions.length)}</strong> / {filteredQuestions.length} টি প্রশ্ন
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredQuestions.slice(0, visibleCount).map((q, idx) => (
                <QuestionCard
                  key={q.id || idx}
                  question={q}
                  index={q.originalIndex !== undefined ? q.originalIndex : idx}
                  mode={mode}
                />
              ))}
            </div>

            {visibleCount < filteredQuestions.length && (
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <button
                  onClick={() => setVisibleCount(prev => prev + 100)}
                  className="btn-secondary"
                  style={{ padding: '12px 32px', fontSize: '0.95rem' }}
                >
                  আরো ১০০টি প্রশ্ন লোড করুন ({filteredQuestions.length - visibleCount} টি বাকি)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MostImportantPracticePage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center', color: '#047857' }}>লোড হচ্ছে...</div>}>
      <MostImportantPracticeContent />
    </Suspense>
  );
}
