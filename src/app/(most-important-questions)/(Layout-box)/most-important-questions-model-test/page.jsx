'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Send, 
  Timer, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Flame
} from 'lucide-react';
import ExamTimer from '../../../../components/ExamTimer';
import QuestionNavGrid from '../../../../components/QuestionNavGrid';
import QuestionCard from '../../../../components/QuestionCard';
import ResultModal from '../../../../components/ResultModal';
import { loadMostImportantQuestions, getMostImportantBySlug, cleanMostImportantTitle } from '../../../../lib/mostImportantData';
import { useAuth } from '../../../../lib/authContext';
import LoginRequiredModal from '../../../../components/LoginRequiredModal';

function MostImportantModelTestContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const subjectSlug = searchParams.get('subject') || searchParams.get('slug');

  const [subjectData, setSubjectData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [negativeMarkRate, setNegativeMarkRate] = useState(0.5);

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

    Promise.all([
      getMostImportantBySlug(subjectSlug),
      loadMostImportantQuestions(subjectSlug)
    ]).then(([meta, qs]) => {
      setSubjectData(meta);
      // For model test, take a curated subset of 50-100 questions
      const subset = (qs || []).slice(0, 100);
      setQuestions(subset);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading most important model test:', err);
      setLoading(false);
    });
  }, [subjectSlug, isAuthorized]);

  const handleSelectAnswer = (qId, optionIdx) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach(q => {
      const selected = userAnswers[q.id];
      if (selected === undefined) {
        unanswered++;
      } else if (selected === q.ans) {
        correct++;
      } else {
        wrong++;
      }
    });

    const score = correct - (wrong * negativeMarkRate);
    const result = {
      total: questions.length,
      correct,
      wrong,
      unanswered,
      score: Math.max(0, Math.round(score * 100) / 100),
      negativeMarks: Math.round((wrong * negativeMarkRate) * 100) / 100
    };

    setTestResult(result);
    setIsSubmitted(true);
    setShowResultModal(true);
  };

  const handleRestart = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setShowResultModal(false);
    setTestResult(null);
  };

  if (authLoading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>অ্যাকাউন্ট ভেরিফাই হচ্ছে...</div>;
  }

  if (!user || !isAuthorized) {
    return <LoginRequiredModal featureName="সর্বাধিক কমন মডেল টেস্ট" />;
  }

  if (!subjectSlug) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '70vh' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '16px' }}>পরীক্ষার জন্য কোনো বিষয় নির্বাচিত হয়নি</h2>
        <Link href="/most-important-questions" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 20px' }}>
          বিষয় তালিকা দেখুন
        </Link>
      </div>
    );
  }

  const examDurationMinutes = Math.max(10, Math.round(questions.length * 0.6));

  return (
    <div style={{ minHeight: '85vh', background: 'var(--bg-primary)', padding: '30px 0 80px' }}>
      <div className="container">
        {/* Top Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/most-important-questions" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            <ArrowLeft size={16} />
            <span>সকল বিষয়</span>
          </Link>

          {!isSubmitted && questions.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <ExamTimer durationMinutes={examDurationMinutes} onTimeUp={handleSubmit} />
              <button onClick={handleSubmit} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>
                <Send size={16} />
                <span>সাবমিট করুন</span>
              </button>
            </div>
          )}
        </div>

        {/* Exam Title Banner */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge" style={{ fontSize: '0.8rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
              <Flame size={14} />
              <span>{subjectData?.category_name || 'সর্বাধিক কমন'}</span>
            </span>
            <span className="badge badge-amber" style={{ fontSize: '0.8rem' }}>
              <Timer size={14} />
              <span>{examDurationMinutes} মিনিট সময়</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            {cleanMostImportantTitle(subjectData?.title || subjectSlug)} — মডেল টেস্ট
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            মোট প্রশ্ন: {questions.length} টি • সঠিক উত্তরে ১ নম্বর • ভুল উত্তরে -০.৫ নম্বর
          </p>
        </div>

        {/* Questions Grid & OMR */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <span>প্রশ্ন লোড হচ্ছে...</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '24px', alignItems: 'start' }}>
            {/* Questions Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {questions.map((q, idx) => (
                <QuestionCard
                  key={q.id || idx}
                  question={q}
                  index={idx + 1}
                  isExamMode={!isSubmitted}
                  isSubmitted={isSubmitted}
                  userAnswer={userAnswers[q.id]}
                  onSelectAnswer={(optIdx) => handleSelectAnswer(q.id, optIdx)}
                />
              ))}

              {!isSubmitted && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button onClick={handleSubmit} className="btn-primary" style={{ padding: '12px 32px', fontSize: '1rem' }}>
                    <Send size={18} />
                    <span>পরীক্ষা সমাপ্ত ও সাবমিট করুন</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar OMR Nav Grid */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <QuestionNavGrid
                questions={questions}
                userAnswers={userAnswers}
                isSubmitted={isSubmitted}
                onSelectQuestion={(idx) => {
                  const elem = document.getElementById(`q-${idx + 1}`);
                  if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              />
            </div>
          </div>
        )}

        {/* Result Modal */}
        {showResultModal && testResult && (
          <ResultModal
            result={testResult}
            onClose={() => setShowResultModal(false)}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}

export default function MostImportantModelTestPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>লোড হচ্ছে...</div>}>
      <MostImportantModelTestContent />
    </Suspense>
  );
}
