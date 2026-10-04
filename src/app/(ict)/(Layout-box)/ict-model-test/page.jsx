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

  const startNumber = useMemo(() => {
    if (selectedRange === 'all' || !selectedRange.includes('-')) return 1;
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

  // Live Score calculation in real time
  const liveStats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected !== undefined && selected !== null) {
        const selectedStr = String(selected).trim();
        const correctStr = String(q.correct_answer || (q.options && q.options[q.ans]) || '').trim();
        const isMatch = (selectedStr === correctStr) || (typeof selected === 'number' && selected === q.ans);
        if (isMatch) correct++;
        else wrong++;
      }
    });
    const penalty = Number((wrong * negativeMarkRate).toFixed(2));
    const rawScore = Number((correct - penalty).toFixed(2));
    const score = Math.max(0, rawScore);
    return { correct, wrong, score, rawScore };
  }, [questions, userAnswers, negativeMarkRate]);

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

  // Duration: 100 MCQs = 60 minutes (0.6 min or 36 sec per question)
  const durationSeconds = useMemo(() => {
    const count = questions ? questions.length : 0;
    if (count === 0) return 3600;
    return Math.round(count * 36);
  }, [questions]);

  const durationMinutes = useMemo(() => {
    const count = questions ? questions.length : 0;
    if (count === 0) return 60;
    const mins = count * 0.6;
    return Number.isInteger(mins) ? mins : Math.round(mins * 10) / 10;
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
        targetUrl="/ict"
        targetLabel="আইসিটি অধ্যায় নির্বাচন করুন (/ict)"
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

  const answeredCount = Object.keys(userAnswers).length;
  const remainingCount = questions.length - answeredCount;

  return (
    <div style={{ padding: '20px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              href={`/ict-practice?exam=${encodeURIComponent(examSlug || '')}&mode=practice`}
              className="btn-secondary"
              style={{ padding: '7px 12px', fontSize: '0.84rem' }}
            >
              <ArrowLeft size={15} />
              <span>প্র্যাকটিস পেজে যান</span>
            </Link>

            <Link
              href="/ict"
              className="btn-secondary"
              style={{ padding: '7px 12px', fontSize: '0.84rem' }}
            >
              <Laptop size={15} />
              <span>অন্যান্য অধ্যায়</span>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Question Range Dropdown: 1-100, 101-200, 201-300... */}
            {rangeChunks.length > 0 && !isSubmitted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 10px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 700 }}>প্রশ্ন রেঞ্জ:</span>
                <select
                  value={selectedRange}
                  onChange={(e) => handleRangeChange(e.target.value)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: '#ffffff',
                    border: '1.5px solid #10b981',
                    color: '#065f46'
                  }}
                >
                  {rangeChunks.map(chunk => (
                    <option key={chunk.id} value={chunk.id}>
                      প্রশ্ন {chunk.label}
                    </option>
                  ))}
                  <option value="all">সকল প্রশ্ন (১ - {allQuestions.length})</option>
                </select>
              </div>
            )}
            <span className="badge badge-amber" style={{ fontSize: '0.8rem', padding: '5px 10px' }}>
              নেগেটিভ মার্ক: -{negativeMarkRate.toFixed(2)}
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '5px 10px' }}>
              মোট প্রশ্ন: {questions.length} টি
            </span>
          </div>
        </div>

        {/* Sticky Control & Status Bar */}
        <div className="glass-panel" style={{
          position: 'sticky',
          top: '76px',
          zIndex: 40,
          padding: '14px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          background: '#ffffff',
          borderLeft: '4px solid var(--emerald-500)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--emerald-600)', fontWeight: 700, textTransform: 'uppercase' }}>
                {isSubmitted ? 'ফলাফল ও সমাধান পর্যালোচনা' : 'লাইভ মডেল টেস্ট চলমান'}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                উত্তর দিয়েছেন: <strong style={{ color: 'var(--emerald-600)' }}>{answeredCount}</strong> / {questions.length}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                লাইভ স্কোর: <strong style={{ 
                  color: isSubmitted ? '#047857' : '#059669', 
                  background: '#ecfdf5', 
                  padding: '2px 8px', 
                  borderRadius: '6px', 
                  border: '1px solid #a7f3d0',
                  fontSize: '0.84rem' 
                }}>{(isSubmitted && testResult?.marks !== undefined) ? testResult.marks.toFixed(2) : liveStats.score.toFixed(2)}</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
              {cleanIctTitle(examData?.title) || 'আইসিটি মডেল টেস্ট'}
              {selectedRange !== 'all' && (
                <span className="badge badge-emerald" style={{ marginLeft: '10px', fontSize: '0.78rem', verticalAlign: 'middle' }}>
                  রেঞ্জ: {selectedRange}
                </span>
              )}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Countdown Timer */}
            {!isSubmitted && (
              <ExamTimer
                totalMinutes={durationMinutes}
                totalSeconds={durationSeconds}
                onTimeUp={() => {
                  alert('সময় শেষ হয়েছে! আপনার উত্তরপত্র স্বয়ংক্রিয়ভাবে জমা নেওয়া হচ্ছে।');
                  calculateResult();
                }}
                isSubmitted={isSubmitted}
              />
            )}

            {/* Mobile Palette Toggle Button */}
            <button
              onClick={() => setMobilePaletteOpen(true)}
              className="btn-secondary mobile-only-btn"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <Menu size={16} />
              <span>প্যালেট</span>
            </button>

            {/* Submit / Finish Button */}
            {!isSubmitted ? (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="btn-primary"
                style={{
                  padding: '9px 20px',
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                }}
              >
                <Send size={16} />
                <span>টেস্ট জমা দিন</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleRetake}
                  className="btn-secondary"
                  style={{ padding: '9px 16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RotateCcw size={15} />
                  <span>পুনরায় দিন</span>
                </button>
                <button
                  onClick={() => setShowResultModal(true)}
                  className="btn-primary"
                  style={{ padding: '9px 20px', fontSize: '0.88rem' }}
                >
                  <Award size={16} />
                  <span>ফলাফল ও স্কোর</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Test Layout: 2-Column (Questions Stream + Sticky Palette) */}
        <div className="exam-layout-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 300px',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Left: Questions Stream */}
          <div>
            {questions.map((q, idx) => (
              <div key={q.id || idx} id={`q_${idx}`} style={{ scrollMarginTop: '160px', marginBottom: '16px' }}>
                <QuestionCard
                  question={q}
                  index={q.globalIndex ?? idx}
                  mode="test"
                  userAnswer={userAnswers[idx]}
                  onSelectOption={(opt) => handleSelectOption(idx, opt)}
                  isSubmitted={isSubmitted}
                />
              </div>
            ))}

            {/* Bottom Submit Banner if not submitted */}
            {!isSubmitted && (
              <div className="glass-panel" style={{
                padding: '24px',
                textAlign: 'center',
                background: '#ffffff',
                marginTop: '32px'
              }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  সকল প্রশ্ন উত্তর দেওয়া সম্পন্ন হয়েছে?
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
                  আপনার উত্তরপত্র জমা দিলে সাথে সাথে সঠিক উত্তর, ব্যাখ্যা এবং বিস্তারিত নেগেটিভ মার্কিং স্কোরশিট দেখতে পাবেন।
                </p>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="btn-primary"
                  style={{ padding: '12px 32px', fontSize: '1rem' }}
                >
                  <Send size={18} />
                  <span>উত্তরপত্র জমা দিন ও ফলাফল দেখুন</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Sticky Question Navigation Palette (Desktop) */}
          <div className="exam-sidebar-nav" style={{
            position: 'sticky',
            top: '160px',
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.96rem' }}>
                প্রশ্ন তালিকা প্যালেট
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '0.76rem' }}>
                {answeredCount} / {questions.length}
              </span>
            </div>

            <QuestionNavGrid
              total={questions.length}
              startNumber={startNumber}
              userAnswers={userAnswers}
              currentIndex={currentIdx}
              onSelectIndex={(idx) => {
                setCurrentIdx(idx);
                const el = document.getElementById(`q_${idx}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            />

            {/* Quick summary stats */}
            <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-muted)' }}>উত্তর দিয়েছেন:</span>
                <strong style={{ color: '#059669' }}>{answeredCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-muted)' }}>বাকি প্রশ্ন:</span>
                <strong style={{ color: remainingCount > 0 ? '#d97706' : '#059669' }}>{remainingCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-muted)' }}>ভুল উত্তরের শাস্তি:</span>
                <strong style={{ color: '#dc2626' }}>-{negativeMarkRate}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>লাইভ স্কোর:</span>
                <strong style={{ color: '#059669', fontSize: '0.94rem' }}>{(isSubmitted && testResult?.marks !== undefined) ? testResult.marks.toFixed(2) : liveStats.score.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Submit */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 110,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '460px',
            padding: '28px',
            borderRadius: '16px',
            background: '#ffffff',
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#ecfdf5',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--emerald-600)'
            }}>
              <Send size={26} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              পরীক্ষা জমা দিতে চান?
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '20px' }}>
              আপনি মোট <strong>{questions.length}টি</strong> প্রশ্নের মধ্যে <strong>{answeredCount}টি</strong> উত্তর দিয়েছেন। বাকি <strong>{remainingCount}টি</strong> প্রশ্ন অনুত্তরিত রয়েছে।
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px', fontSize: '0.9rem' }}
              >
                ফিরে যান (যাচাই করুন)
              </button>
              <button
                onClick={calculateResult}
                className="btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '0.9rem' }}
              >
                হ্যাঁ, জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && testResult && (
        <ResultModal
          result={testResult}
          onRetake={handleRetake}
          onReviewAnswers={() => {
            setShowResultModal(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Mobile Floating Drawer for Question Navigation */}
      {mobilePaletteOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 120,
          background: 'rgba(15, 23, 42, 0.4)',
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setMobilePaletteOpen(false)}>
          <div style={{
            width: '85%',
            maxWidth: '340px',
            height: '100%',
            background: '#ffffff',
            padding: '20px',
            overflowY: 'auto',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.1)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                প্রশ্ন তালিকা প্যালেট
              </div>
              <button onClick={() => setMobilePaletteOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>
            <QuestionNavGrid
              total={questions.length}
              startNumber={startNumber}
              userAnswers={userAnswers}
              currentIndex={currentIdx}
              onSelectIndex={(idx) => {
                setCurrentIdx(idx);
                setMobilePaletteOpen(false);
                const el = document.getElementById(`q_${idx}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .mobile-only-btn {
          display: none !important;
        }
        @media (max-width: 860px) {
          .exam-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .exam-sidebar-nav {
            display: none !important;
          }
          .mobile-only-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
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
