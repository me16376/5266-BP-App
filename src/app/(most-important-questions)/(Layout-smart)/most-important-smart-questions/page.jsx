'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Flame,
  Award,
  BookOpen
} from 'lucide-react';
import './style.css';
import { loadMostImportantQuestions, getMostImportantBySlug, cleanMostImportantTitle } from '../../../../lib/mostImportantData';
import { useAuth } from '../../../../lib/authContext';
import LoginRequiredModal from '../../../../components/LoginRequiredModal';
import FormattedContent from '../../../../components/FormattedContent';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBengaliNumber = (num) => {
  if (num === undefined || num === null) return '০';
  return String(num).replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
};

const BANGLA_LETTERS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];

function MostImportantSmartQuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthorized, loading: authLoading } = useAuth();
  const subjectSlug = searchParams.get('subject') || searchParams.get('slug') || '';
  const initialMode = searchParams.get('mode') || 'practice';

  const [subjectData, setSubjectData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // States
  const [activeTab, setActiveTab] = useState('all'); // all, correct, wrong, skipped, high_repeat
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [bookmarks, setBookmarks] = useState(new Set());

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
      setQuestions(qs || []);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading most important smart questions:', err);
      setLoading(false);
    });
  }, [subjectSlug, isAuthorized]);

  const handleSelectOption = (qId, optIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optIdx
    }));
  };

  const toggleBookmark = (qId) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleReset = () => {
    setUserAnswers({});
  };

  // Stats calculation
  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let answered = 0;

    questions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans !== undefined) {
        answered++;
        if (ans === q.ans) correct++;
        else wrong++;
      }
    });

    const skipped = questions.length - answered;
    const highRepeat = questions.filter(q => (q.times_repeated || 1) >= 4).length;
    return { correct, wrong, answered, skipped, highRepeat, total: questions.length };
  }, [questions, userAnswers]);

  // Filtered list by active tab
  const displayQuestions = useMemo(() => {
    return questions.filter(q => {
      const ans = userAnswers[q.id];
      if (activeTab === 'all') return true;
      if (activeTab === 'correct') return ans !== undefined && ans === q.ans;
      if (activeTab === 'wrong') return ans !== undefined && ans !== q.ans;
      if (activeTab === 'skipped') return ans === undefined;
      if (activeTab === 'bookmarks') return bookmarks.has(q.id);
      if (activeTab === 'high_repeat') return (q.times_repeated || 1) >= 4;
      return true;
    });
  }, [questions, userAnswers, activeTab, bookmarks]);

  if (authLoading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>লোড হচ্ছে...</div>;
  }

  if (!user || !isAuthorized) {
    return <LoginRequiredModal featureName="সর্বাধিক কমন প্রশ্নাবলি (Layout Smart)" />;
  }

  if (!subjectSlug) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '70vh' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '16px' }}>কোনো বিষয় নির্বাচিত হয়নি</h2>
        <Link href="/most-important-smart" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 20px' }}>
          স্মার্ট বিষয় তালিকা দেখুন
        </Link>
      </div>
    );
  }

  return (
    <div className="quiz-container" style={{ minHeight: '90vh', background: '#f8fafc', padding: '24px 16px 80px' }}>
      <div className="container" style={{ maxWidth: '1040px', margin: '0 auto' }}>
        {/* Top Control Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '14px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href="/most-important-smart" className="btn-secondary" style={{ padding: '7px 12px', fontSize: '0.85rem' }}>
              <ArrowLeft size={15} />
              <span>তালিকা</span>
            </Link>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
              {cleanMostImportantTitle(subjectData?.title || subjectSlug)}
            </div>
          </div>

          {/* Quick Switches */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowAnswer(prev => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: showAnswer ? '#fff1f2' : '#f1f5f9',
                color: showAnswer ? '#e11d48' : '#475569',
                border: showAnswer ? '1px solid #fecdd3' : '1px solid #e2e8f0'
              }}
            >
              <span>উত্তর: {showAnswer ? 'চালু' : 'বন্ধ'}</span>
            </button>

            <button
              onClick={() => setShowExplanation(prev => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: showExplanation ? '#ecfdf5' : '#f1f5f9',
                color: showExplanation ? '#047857' : '#475569',
                border: showExplanation ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
              }}
            >
              <span>ব্যাখ্যা: {showExplanation ? 'চালু' : 'বন্ধ'}</span>
            </button>

            <button
              onClick={handleReset}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              title="উত্তর রিসেট করুন"
            >
              <RotateCcw size={14} />
              <span>রিসেট</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'all' ? '#e11d48' : '#ffffff',
              color: activeTab === 'all' ? '#ffffff' : '#334155',
              border: '1px solid ' + (activeTab === 'all' ? '#be123c' : '#cbd5e1')
            }}
          >
            সকল ({toBengaliNumber(stats.total)})
          </button>

          <button
            onClick={() => setActiveTab('high_repeat')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'high_repeat' ? '#f59e0b' : '#ffffff',
              color: activeTab === 'high_repeat' ? '#ffffff' : '#b45309',
              border: '1px solid ' + (activeTab === 'high_repeat' ? '#d97706' : '#fde68a')
            }}
          >
            🔥 ৪+ বার রিপিটেড ({toBengaliNumber(stats.highRepeat)})
          </button>

          <button
            onClick={() => setActiveTab('correct')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'correct' ? '#22c55e' : '#ffffff',
              color: activeTab === 'correct' ? '#ffffff' : '#15803d',
              border: '1px solid ' + (activeTab === 'correct' ? '#16a34a' : '#bbf7d0')
            }}
          >
            সঠিক ({toBengaliNumber(stats.correct)})
          </button>

          <button
            onClick={() => setActiveTab('wrong')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'wrong' ? '#ef4444' : '#ffffff',
              color: activeTab === 'wrong' ? '#ffffff' : '#b91c1c',
              border: '1px solid ' + (activeTab === 'wrong' ? '#dc2626' : '#fecaca')
            }}
          >
            ভুল ({toBengaliNumber(stats.wrong)})
          </button>

          <button
            onClick={() => setActiveTab('skipped')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'skipped' ? '#64748b' : '#ffffff',
              color: activeTab === 'skipped' ? '#ffffff' : '#475569',
              border: '1px solid ' + (activeTab === 'skipped' ? '#475569' : '#cbd5e1')
            }}
          >
            বাকি ({toBengaliNumber(stats.skipped)})
          </button>
        </div>

        {/* Questions Area */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            প্রশ্ন লোড হচ্ছে...
          </div>
        ) : displayQuestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            এই ফিল্টারে কোনো প্রশ্ন নেই।
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {displayQuestions.map((q, idx) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.ans;
              const isWrong = isAnswered && selectedOpt !== q.ans;

              return (
                <div
                  key={q.id || idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  {/* Question Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: '#fff1f2',
                        color: '#e11d48',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}>
                        {toBengaliNumber(idx + 1)}
                      </span>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.6 }}>
                          <FormattedContent content={q.question} />
                        </div>
                        {q.times_repeated > 1 && (
                          <span style={{
                            display: 'inline-block',
                            marginTop: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: '#fef3c7',
                            color: '#b45309',
                            border: '1px solid #fde68a'
                          }}>
                            🔥 {toBengaliNumber(q.times_repeated)} বার পরীক্ষায় এসেছে
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleBookmark(q.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: bookmarks.has(q.id) ? '#f59e0b' : '#cbd5e1'
                      }}
                      title="বুকমার্ক"
                    >
                      <i className={`fa-${bookmarks.has(q.id) ? 'solid' : 'regular'} fa-bookmark`} style={{ fontSize: '18px' }}></i>
                    </button>
                  </div>

                  {/* Options */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '10px',
                    marginBottom: '16px'
                  }}>
                    {q.options && q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isRealAnswer = q.ans === optIdx;

                      let optBg = '#f8fafc';
                      let optBorder = '#e2e8f0';
                      let optColor = '#1e293b';

                      if (isOptionSelected) {
                        if (isRealAnswer) {
                          optBg = '#dcfce7';
                          optBorder = '#22c55e';
                          optColor = '#15803d';
                        } else {
                          optBg = '#fee2e2';
                          optBorder = '#ef4444';
                          optColor = '#b91c1c';
                        }
                      } else if ((isAnswered || showAnswer) && isRealAnswer) {
                        optBg = '#fff1f2';
                        optBorder = '#f43f5e';
                        optColor = '#e11d48';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: optBg,
                            border: `1px solid ${optBorder}`,
                            color: optColor,
                            cursor: 'pointer',
                            fontSize: '0.94rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            background: isOptionSelected ? (isRealAnswer ? '#22c55e' : '#ef4444') : '#e2e8f0',
                            color: isOptionSelected ? '#ffffff' : '#475569'
                          }}>
                            {BANGLA_LETTERS[optIdx] || optIdx + 1}
                          </span>
                          <span style={{ flex: 1 }}>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Section */}
                  {(showExplanation || isAnswered || showAnswer) && q.explanation && (
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '10px',
                      padding: '14px 16px',
                      borderLeft: '4px solid #e11d48',
                      marginTop: '12px',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: '#334155'
                    }}>
                      <div style={{ fontWeight: 700, color: '#e11d48', marginBottom: '6px' }}>
                        <i className="fa-solid fa-lightbulb" style={{ marginRight: '6px' }}></i>
                        ব্যাখ্যা ও পরীক্ষার সামারি:
                      </div>
                      <FormattedContent content={q.explanation} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MostImportantSmartQuestionsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>লোড হচ্ছে...</div>}>
      <MostImportantSmartQuestionsContent />
    </Suspense>
  );
}
