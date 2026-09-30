'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Timer, 
  ArrowLeft, 
  Search, 
  Layers,
  Flame,
  Award
} from 'lucide-react';
import QuestionCard from '../../../../components/QuestionCard';
import { loadMostImportantQuestions, getMostImportantBySlug, cleanMostImportantTitle } from '../../../../lib/mostImportantData';
import { useAuth } from '../../../../lib/authContext';
import LoginRequiredModal from '../../../../components/LoginRequiredModal';

function MostImportantPracticeContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const subjectSlug = searchParams.get('subject') || searchParams.get('slug');

  const [subjectData, setSubjectData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [minRepetition, setMinRepetition] = useState('all');
  const [visibleCount, setVisibleCount] = useState(100);

  const isOwner = user?.role === 'owner';
  const isAdmin = user?.role === 'admin';
  const isApprovedUser = user?.status === 'approved';
  const isAuthorized = isOwner || isAdmin || isApprovedUser;

  useEffect(() => {
    if (!subjectSlug || !isAuthorized) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setVisibleCount(100);

    Promise.all([
      getMostImportantBySlug(subjectSlug),
      loadMostImportantQuestions(subjectSlug)
    ]).then(([meta, qs]) => {
      setSubjectData(meta);
      setQuestions(qs || []);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading most important practice questions:', err);
      setLoading(false);
    });
  }, [subjectSlug, isAuthorized]);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (minRepetition !== 'all') {
        const threshold = parseInt(minRepetition, 10);
        if ((q.times_repeated || 1) < threshold) return false;
      }
      if (!searchFilter.trim()) return true;
      const query = searchFilter.toLowerCase().trim();
      const matchQ = (q.question || '').toLowerCase().includes(query);
      const matchOpt = (q.options || []).some(o => (o || '').toLowerCase().includes(query));
      const matchExp = (q.explanation || '').toLowerCase().includes(query);
      return matchQ || matchOpt || matchExp;
    });
  }, [questions, searchFilter, minRepetition]);

  if (authLoading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>অ্যাকাউন্ট ভেরিফাই হচ্ছে...</div>;
  }

  if (!user || !isAuthorized) {
    return <LoginRequiredModal featureName="সর্বাধিক কমন প্রশ্নাবলি অনুশীলন" />;
  }

  if (!subjectSlug) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '70vh' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '16px' }}>কোনো বিষয় নির্বাচিত হয়নি</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>অনুগ্রহ করে কমন প্রশ্নব্যাংক থেকে একটি বিষয় বেছে নিন।</p>
        <Link href="/most-important-questions" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 20px' }}>
          বিষয় তালিকা দেখুন
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '85vh', background: 'var(--bg-primary)', padding: '30px 0 80px' }}>
      <div className="container">
        {/* Top Navigation Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/most-important-questions" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            <ArrowLeft size={16} />
            <span>সকল বিষয়</span>
          </Link>

          <Link href={`/most-important-questions-model-test?subject=${encodeURIComponent(subjectSlug)}`} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
            <Timer size={16} />
            <span>মডেল টেস্ট দিন</span>
          </Link>
        </div>

        {/* Subject Header Banner */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge" style={{ fontSize: '0.8rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
              <Flame size={14} />
              <span>{subjectData?.category_name || 'কমন প্রশ্নাবলি'}</span>
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.8rem' }}>
              <span>মোট {questions.length} টি প্রশ্ন</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            {cleanMostImportantTitle(subjectData?.title || subjectSlug)}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            বিসিএস ও অন্যান্য সরকারি চাকরির পরীক্ষায় বারবার আসা সর্বাধিক গুরুত্বপূর্ণ প্রশ্নসমূহ
          </p>

          {/* Quick Filters */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={16} color="#e11d48" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="প্রশ্ন খুঁজুন..."
                className="input-glass"
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '14px',
                  height: '42px',
                  borderRadius: '10px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <select
              value={minRepetition}
              onChange={(e) => setMinRepetition(e.target.value)}
              className="input-glass"
              style={{
                height: '42px',
                padding: '0 14px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              <option value="all">সকল পুনরাবৃত্তি</option>
              <option value="3">৩ বা ততোধিকবার আসা</option>
              <option value="5">৫ বা ততোধিকবার আসা</option>
              <option value="10">১০ বা ততোধিকবার আসা</option>
            </select>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <span>প্রশ্ন লোড হচ্ছে...</span>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <p>কোনো প্রশ্ন পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredQuestions.slice(0, visibleCount).map((q, idx) => (
              <QuestionCard
                key={q.id || idx}
                question={q}
                index={idx + 1}
                examTitle={cleanMostImportantTitle(subjectData?.title || subjectSlug)}
              />
            ))}

            {visibleCount < filteredQuestions.length && (
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button
                  onClick={() => setVisibleCount(prev => prev + 50)}
                  className="btn-secondary"
                  style={{ padding: '10px 24px', fontSize: '0.92rem' }}
                >
                  আরও প্রশ্ন দেখুন ({filteredQuestions.length - visibleCount} টি বাকি)
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
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>লোড হচ্ছে...</div>}>
      <MostImportantPracticeContent />
    </Suspense>
  );
}
