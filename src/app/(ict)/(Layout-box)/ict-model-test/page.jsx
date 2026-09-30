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
  Eye, 
  BookOpen, 
  Award, 
  Sparkles,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  Layers,
  Laptop
} from 'lucide-react';
import ExamTimer from '../../../../components/ExamTimer';
import QuestionNavGrid from '../../../../components/QuestionNavGrid';
import QuestionCard from '../../../../components/QuestionCard';
import ResultModal from '../../../../components/ResultModal';
import { loadIctQuestions, cleanIctTitle } from '../../../../lib/ictData';
import { saveTestResult } from '../../../../lib/storage';
import { useAuth } from '../../../../lib/authContext';
import LoginRequiredModal from '../../../../components/LoginRequiredModal';
import ChooseExamPopup from '../../../../components/ChooseExamPopup';

function IctModelTestContent() {
  const { user, loading: authLoading, logout } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const examSlug = searchParams.get('exam');

  const [examData, setExamData] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedRange, setSelectedRange] = useState('1-100');
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [negativeMarkRate, setNegativeMarkRate] = useState(0.25); // Default 0.25

  const isOwner = user?.role === 'owner';
  const isAdmin = user?.role === 'admin';
  const isApprovedUser = user?.status === 'approved';
  const isAuthorized = isOwner || isAdmin || isApprovedUser;

  // Range chunks: 1-100, 101-200...
  const rangeChunks = useMemo(() => {
    const total = allQuestions.length;
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
  }, [allQuestions.length]);

  const rangeStartOffset = useMemo(() => {
    if (selectedRange === 'all') return 1;
    const [start] = selectedRange.split('-').map(Number);
    return start || 1;
  }, [selectedRange]);

  const questions = useMemo(() => {
    if (!allQuestions || allQuestions.length === 0) return [];
    if (selectedRange === 'all' || allQuestions.length <= 100) {
      return allQuestions.map((q, idx) => ({ ...q, globalIndex: idx }));
    }
    const [start, end] = selectedRange.split('-').map(Number);
    if (!start || !end) {
      return allQuestions.map((q, idx) => ({ ...q, globalIndex: idx }));
    }
    return allQuestions.slice(start - 1, end).map((q, idx) => ({
      ...q,
      globalIndex: start - 1 + idx
    }));
  }, [allQuestions, selectedRange]);

  // Load exam questions
  useEffect(() => {
    if (!examSlug || !isAuthorized) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setUserAnswers({});
    setIsSubmitted(false);
    setShowResultModal(false);
    setTestResult(null);
    setCurrentIdx(0);

    loadIctQuestions(examSlug).then(res => {
      setExamData(res.exam);
      const loaded = res.questions || [];
      setAllQuestions(loaded);
      if (loaded.length > 100) {
        setSelectedRange('1-100');
      } else {
        setSelectedRange('all');
      }
      setLoading(false);
    }).catch(err => {
      console.error('Error loading ICT exam questions:', err);
      setLoading(false);
    });
  }, [examSlug, isAuthorized]);

  const handleRangeChange = (newRange) => {
    if (isSubmitted) return;
    if (userAnswers && Object.keys(userAnswers).length > 0) {
      if (!confirm('প্রশ্ন রেঞ্জ পরিবর্তন করলে বর্তমান উত্তরসমূহ রিসেট হবে। আপনি কি নিশ্চিত?')) return;
    }
    setUserAnswers({});
    setCurrentIdx(0);
    setSelectedRange(newRange);
  };

  // Handle option selection
  const handleSelectOption = (qIndex, option) => {
    if (isSubmitted) return;
    setUserAnswers(prev => {
      if (prev[qIndex] === option) {
        const next = { ...prev };
        delete next[qIndex];
        return next;
      }
      return {
        ...prev,
        [qIndex]: option
      };
    });
  };

  // Calculate results
  const calculateResult = () => {
    let correct = 0;
    let wrong = 0;
    const answeredIndices = Object.keys(userAnswers);
    const answeredCount = answeredIndices.length;

    questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected !== undefined && selected !== null) {
        const selectedStr = String(selected).trim();
        const correctStr = String(q.correct_answer || '').trim();
        if (selectedStr === correctStr) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const totalQuestions = questions.length;
    const skipped = Math.max(0, totalQuestions - answeredCount);
    const marks = Math.max(0, Number((correct - (wrong * negativeMarkRate)).toFixed(2)));
    const accuracy = answeredCount > 0 ? Math.round((correct / answeredCount) * 100) : 0;

    const res = {
      examTitle: examData?.title || 'আইসিটি মডেল টেস্ট',
      examSlug: examSlug || '',
      total: totalQuestions,
      answered: answeredCount,
      correct,
      wrong,
      skipped,
      marks,
      accuracy,
      timestamp: new Date().toISOString()
    };

    setTestResult(res);
    setIsSubmitted(true);
    setShowConfirmModal(false);
    setShowResultModal(true);
    setMobilePaletteOpen(false);

    try {
      saveTestResult(res);
    } catch (e) {
      console.warn('Could not save test result:', e);
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setShowResultModal(false);
    setShowConfirmModal(false);
    setTestResult(null);
    setCurrentIdx(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Duration: 100 MCQs = 60 minutes (36 sec per question)
  const durationSeconds = useMemo(() => {
    const count = questions ? questions.length : 0;
    if (count === 0) return 3600;
    return Math.round(count * 36);
  }, [questions]);

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
        title="আইসিটি মডেল টেস্ট দিতে লগইন প্রয়োজন"
        description="আইসিটি ও কম্পিউটার মডেল টেস্ট ও ফলাফল বিশ্লেষণ দেখতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।"
        loginRedirect={`/ict-model-test/${examSlug ? `?exam=${encodeURIComponent(examSlug)}` : ''}`}
        chooseExamUrl="/ict"
        chooseExamText="আইসিটি অধ্যায় তালিকা"
      />
    );
  }

  // 3. User logged in, but not approved
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
            প্রিয় <strong>{user.name}</strong>, আপনার অ্যাকাউন্টটি বর্তমানে পর্যালোচনার অধীনে রয়েছে। সিস্টেম অ্যাডমিন অনুমোদন সম্পন্ন করার পর আপনি মডেল টেস্ট দিতে পারবেন।
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/profile" className="btn-primary" style={{ padding: '13px 26px', fontSize: '0.98rem' }}>
              <span>প্রোফাইল স্ট্যাটাস দেখুন</span>
            </Link>
            <Link href="/" className="btn-secondary" style={{ padding: '13px 24px', fontSize: '0.98rem' }}>
              <span>হোম পেজে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. No exam selected
  if (!examSlug) {
    return (
      <ChooseExamPopup
        target="job-solution"
        isOpen={true}
        title="একটি আইসিটি অধ্যায় নির্বাচন করুন"
        description="লাইভ মডেল টেস্ট দিতে অনুগ্রহ করে /ict পেজ থেকে যেকোনো একটি অধ্যায় নির্বাচন করুন।"
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ padding: '20px 32px', display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1', borderTopColor: 'var(--emerald-600)' }} />
          <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>আইসিটি মডেল টেস্ট প্রস্তুত হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 0 80px' }}>
      <div className="container">
        {/* Top Action Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '24px'
        }}>
          <Link
            href="/ict"
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.86rem' }}
          >
            <ArrowLeft size={16} />
            <span>অন্যান্য আইসিটি অধ্যায়</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              href={`/ict-practice?exam=${encodeURIComponent(examSlug || '')}`}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.86rem' }}
            >
              <BookOpen size={16} />
              <span>প্র্যাকটিস মোড</span>
            </Link>

            {/* Mobile Palette Button */}
            <button
              onClick={() => setMobilePaletteOpen(true)}
              className="btn-secondary"
              style={{
                display: 'none',
                padding: '8px 14px',
                fontSize: '0.86rem'
              }}
              id="mobile-palette-toggle"
            >
              <Menu size={16} />
              <span>প্রশ্ন তালিকা ({Object.keys(userAnswers).length}/{questions.length})</span>
            </button>
          </div>
        </div>

        {/* Exam Title & Stats Banner */}
        <div className="glass-panel" style={{
          padding: '22px 26px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '18px',
          background: '#ffffff'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald">লাইভ মডেল টেস্ট</span>
              {examData && examData.category_name && (
                <span className="badge badge-cyan">{examData.category_name}</span>
              )}
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              {examData ? cleanIctTitle(examData.title) : 'আইসিটি মডেল টেস্ট'}
            </h1>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              মোট প্রশ্ন: <strong style={{ color: '#0f172a' }}>{questions.length}</strong> টি |
              উত্তর দিয়েছেন: <strong style={{ color: 'var(--emerald-600)' }}>{Object.keys(userAnswers).length}</strong> টি |
              বাকি: <strong style={{ color: 'var(--amber-600)' }}>{questions.length - Object.keys(userAnswers).length}</strong> টি
            </div>

            {/* Range Selection Pills */}
            {rangeChunks.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  প্রশ্ন রেঞ্জ:
                </span>
                <button
                  onClick={() => handleRangeChange('all')}
                  disabled={isSubmitted}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: isSubmitted ? 'not-allowed' : 'pointer',
                    border: selectedRange === 'all' ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                    background: selectedRange === 'all' ? '#ecfdf5' : '#ffffff',
                    color: selectedRange === 'all' ? '#047857' : '#475569',
                    opacity: isSubmitted ? 0.7 : 1
                  }}
                >
                  সকল প্রশ্ন ({allQuestions.length})
                </button>
                {rangeChunks.map(chunk => {
                  const isSelected = selectedRange === chunk.id;
                  return (
                    <button
                      key={chunk.id}
                      onClick={() => handleRangeChange(chunk.id)}
                      disabled={isSubmitted}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: isSubmitted ? 'not-allowed' : 'pointer',
                        border: isSelected ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                        background: isSelected ? '#ecfdf5' : '#ffffff',
                        color: isSelected ? '#047857' : '#475569',
                        opacity: isSubmitted ? 0.7 : 1
                      }}
                    >
                      {chunk.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Timer Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <ExamTimer
              durationSeconds={durationSeconds}
              onTimeUp={() => {
                if (!isSubmitted) {
                  alert('সময় শেষ হয়েছে! আপনার উত্তরসমূহ স্বয়ংক্রিয়ভাবে জমা নেওয়া হচ্ছে।');
                  calculateResult();
                }
              }}
              isSubmitted={isSubmitted}
            />
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '24px',
          alignItems: 'start'
        }} id="model-test-grid">
          {/* Left Column: Questions List */}
          <div>
            {questions.map((q, idx) => {
              const selectedOpt = userAnswers[idx];
              const qNumber = rangeStartOffset + idx;

              return (
                <div
                  key={q.id || idx}
                  id={`q-anchor-${idx}`}
                  style={{
                    marginBottom: '20px',
                    scrollMarginTop: '100px'
                  }}
                >
                  <QuestionCard
                    question={q}
                    index={idx}
                    displayIndex={qNumber}
                    mode="exam"
                    selectedOption={selectedOpt}
                    onSelectOption={(opt) => handleSelectOption(idx, opt)}
                    showResult={isSubmitted}
                    isSubmitted={isSubmitted}
                  />
                </div>
              );
            })}

            {/* Bottom Submit Action Bar */}
            <div className="glass-panel" style={{
              padding: '24px',
              textAlign: 'center',
              marginTop: '32px',
              background: '#ffffff'
            }}>
              {!isSubmitted ? (
                <div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '14px', fontSize: '0.94rem' }}>
                    আপনি {questions.length}টির মধ্যে <strong>{Object.keys(userAnswers).length}</strong>টি প্রশ্নের উত্তর দিয়েছেন।
                  </p>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="btn-primary"
                    style={{ padding: '12px 36px', fontSize: '1rem' }}
                  >
                    <Send size={18} />
                    <span>মডেল টেস্ট সাবমিট করুন</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setShowResultModal(true)}
                    className="btn-primary"
                    style={{ padding: '12px 28px', fontSize: '0.95rem' }}
                  >
                    <Eye size={18} />
                    <span>ফলাফল ও মার্কশিট দেখুন</span>
                  </button>

                  <button
                    onClick={handleRetake}
                    className="btn-secondary"
                    style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                  >
                    <RotateCcw size={18} />
                    <span>পুনরায় টেস্ট দিন</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Question Navigation Palette (Desktop) */}
          <div style={{ position: 'sticky', top: '90px' }} className="desktop-palette">
            <QuestionNavGrid
              totalQuestions={questions.length}
              userAnswers={userAnswers}
              currentIdx={currentIdx}
              isSubmitted={isSubmitted}
              questions={questions}
              rangeStartOffset={rangeStartOffset}
              onNavigate={(idx) => {
                setCurrentIdx(idx);
                const elem = document.getElementById(`q-anchor-${idx}`);
                if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              onSubmit={() => setShowConfirmModal(true)}
            />

            {/* Negative Marking Rate Setting */}
            {!isSubmitted && (
              <div className="glass-panel" style={{ padding: '14px 18px', marginTop: '16px', background: '#ffffff' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  নেগেটিভ মার্কিং হার:
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { label: '০.২৫ (PSC/Bank)', val: 0.25 },
                    { label: '০.৫০ (BCS)', val: 0.5 },
                    { label: '০.০০ (নো নেগেটিভ)', val: 0.0 }
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setNegativeMarkRate(item.val)}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: negativeMarkRate === item.val ? '1px solid var(--emerald-500)' : '1px solid #cbd5e1',
                        background: negativeMarkRate === item.val ? '#ecfdf5' : '#ffffff',
                        color: negativeMarkRate === item.val ? '#047857' : '#475569'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal before Submit */}
        {showConfirmModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}>
            <div className="glass-panel" style={{
              maxWidth: '480px',
              width: '100%',
              padding: '30px',
              textAlign: 'center',
              background: '#ffffff',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Send size={28} color="var(--emerald-600)" />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                মডেল টেস্ট সাবমিট করবেন?
              </h3>

              <div style={{
                background: '#f8fafc',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '20px',
                fontSize: '0.92rem',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>মোট প্রশ্ন:</span>
                  <strong>{questions.length} টি</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--emerald-600)' }}>
                  <span>উত্তর দিয়েছেন:</span>
                  <strong>{Object.keys(userAnswers).length} টি</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--amber-600)' }}>
                  <span>বাকি রয়েছে:</span>
                  <strong>{questions.length - Object.keys(userAnswers).length} টি</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '11px', fontSize: '0.92rem' }}
                >
                  ফিরে যান
                </button>
                <button
                  onClick={calculateResult}
                  className="btn-primary"
                  style={{ flex: 1, padding: '11px', fontSize: '0.92rem' }}
                >
                  হ্যাঁ, সাবমিট করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result Modal */}
        {showResultModal && testResult && (
          <ResultModal
            result={testResult}
            isOpen={showResultModal}
            onClose={() => setShowResultModal(false)}
            onRetake={handleRetake}
          />
        )}
      </div>
    </div>
  );
}

export default function IctModelTestPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center', color: '#047857' }}>লোড হচ্ছে...</div>}>
      <IctModelTestContent />
    </Suspense>
  );
}
