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
  FileSpreadsheet
} from 'lucide-react';
import ExamTimer from '../../components/ExamTimer';
import QuestionNavGrid from '../../components/QuestionNavGrid';
import QuestionCard from '../../components/QuestionCard';
import ResultModal from '../../components/ResultModal';
import { loadExamQuestions, getExamsCatalog } from '../../lib/examsData';
import { saveTestResult } from '../../lib/storage';

function ModelTestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const examSlug = searchParams.get('exam');

  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [negativeMarkRate, setNegativeMarkRate] = useState(0.5); // Default 0.5 for BCS
  const [popularExams, setPopularExams] = useState([]);

  // Load popular exams for empty/fallback state
  useEffect(() => {
    if (!examSlug) {
      getExamsCatalog().then(catalog => {
        if (catalog && catalog.exams) {
          setPopularExams(catalog.exams.slice(0, 12));
        }
      });
    }
  }, [examSlug]);

  // Load exam questions
  useEffect(() => {
    if (!examSlug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setUserAnswers({});
    setIsSubmitted(false);
    setShowResultModal(false);
    setTestResult(null);
    setCurrentIdx(0);

    loadExamQuestions(examSlug).then(res => {
      setExamData(res.exam);
      setQuestions(res.questions || []);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading exam questions:', err);
      setLoading(false);
    });
  }, [examSlug]);

  // Handle option selection
  const handleSelectOption = (qIndex, option) => {
    if (isSubmitted) return;
    setUserAnswers(prev => {
      // If clicked again, optionally allow toggle or keep selection
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
      examTitle: examData?.title || 'মডেল টেস্ট',
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

  // Duration in minutes (approx 0.6 - 0.75 min per question, bounded between 15 and 150 mins)
  const durationMinutes = useMemo(() => {
    if (!questions || questions.length === 0) return 60;
    if (questions.length >= 200) return 120;
    if (questions.length >= 100) return 60;
    return Math.max(15, Math.ceil(questions.length * 0.7));
  }, [questions]);

  // If loading
  if (loading) {
    return (
      <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          border: '3px solid #e2e8f0',
          borderTopColor: 'var(--emerald-600)',
          animation: 'spin 0.8s linear infinite'
        }} />
        <div style={{ color: 'var(--emerald-700)', fontWeight: 700, fontSize: '1.1rem' }}>
          মডেল টেস্ট রুম প্রস্তুত করা হচ্ছে...
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          প্রশ্নপত্র ও টাইমার লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন।
        </p>
      </div>
    );
  }

  // If no exam selected (Landing / Fallback Selector)
  if (!examSlug || !examData || questions.length === 0) {
    return (
      <div style={{ padding: '40px 0 80px' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <div className="glass-panel" style={{ padding: '36px', background: '#ffffff', textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--emerald-600)'
            }}>
              <Timer size={32} />
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              লাইভ মডেল টেস্ট রুম
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', maxWidth: '600px', margin: '0 auto 24px', lineHeight: '1.6' }}>
              কাউন্টডাউন টাইমার, প্রশ্ন জাম্পিং প্যালেট, ০.৫০ নেগেটিভ মার্কিং সহ রিয়েল-টাইম মডেল টেস্ট দিন এবং তাৎক্ষণিক স্কোর ও ব্যাখ্যা দেখুন।
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/exams" className="btn-primary" style={{ padding: '10px 22px' }}>
                <Layers size={18} />
                <span>সকল ২,১৫৪+ পরীক্ষার তালিকা থেকে নির্বাচন করুন</span>
              </Link>
              <Link href="/file-exam" className="btn-secondary" style={{ padding: '10px 20px' }}>
                <FileSpreadsheet size={18} />
                <span>ফাইল এক্সাম স্টুডিও (CSV/JSON)</span>
              </Link>
            </div>
          </div>

          {popularExams.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--emerald-600)" />
                <span>জনপ্রিয় মডেল টেস্টসমূহ</span>
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '16px'
              }}>
                {popularExams.map((exam) => (
                  <div key={exam.id || exam.slug} className="glass-panel" style={{ padding: '20px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>
                          {exam.category_name?.split(' ')[0] || 'পরীক্ষা'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {exam.question_count} প্রশ্ন
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', lineHeight: '1.5', marginBottom: '16px' }}>
                        {exam.title}
                      </h4>
                    </div>

                    <Link
                      href={`/model-test?exam=${exam.slug}`}
                      className="btn-primary"
                      style={{ padding: '8px 14px', fontSize: '0.86rem', justifyContent: 'center' }}
                    >
                      <Timer size={15} />
                      <span>মডেল টেস্ট শুরু করুন</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              href={`/practice?exam=${examSlug}&mode=practice`}
              className="btn-secondary"
              style={{ padding: '7px 12px', fontSize: '0.84rem' }}
            >
              <ArrowLeft size={15} />
              <span>প্র্যাকটিস পেজে যান</span>
            </Link>

            <Link
              href="/exams"
              className="btn-secondary"
              style={{ padding: '7px 12px', fontSize: '0.84rem' }}
            >
              <Layers size={15} />
              <span>অন্যান্য পরীক্ষা</span>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--emerald-600)', fontWeight: 700, textTransform: 'uppercase' }}>
                {isSubmitted ? 'ফলাফল ও সমাধান পর্যালোচনা' : 'লাইভ মডেল টেস্ট চলমান'}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                উত্তর দিয়েছেন: <strong style={{ color: 'var(--emerald-600)' }}>{answeredCount}</strong> / {questions.length}
              </span>
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
              {examData?.title || 'মডেল টেস্ট'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Countdown Timer */}
            {!isSubmitted && (
              <ExamTimer 
                totalMinutes={durationMinutes} 
                onTimeUp={calculateResult} 
              />
            )}

            {/* Mobile palette toggle */}
            <button
              onClick={() => setMobilePaletteOpen(!mobilePaletteOpen)}
              className="btn-secondary mobile-only-btn"
              style={{ padding: '8px 12px', fontSize: '0.84rem' }}
              title="প্রশ্ন তালিকা দেখুন"
            >
              <Menu size={16} />
              <span>প্রশ্ন ({answeredCount}/{questions.length})</span>
            </button>

            {/* Action Buttons */}
            {!isSubmitted ? (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="btn-primary"
                style={{ padding: '9px 18px', fontSize: '0.9rem' }}
              >
                <Send size={16} />
                <span>পরীক্ষা জমা দিন</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowResultModal(true)}
                  className="btn-primary"
                  style={{ padding: '9px 16px', fontSize: '0.86rem' }}
                >
                  <Award size={16} />
                  <span>ফলাফল কার্ড</span>
                </button>
                <button
                  onClick={handleRetake}
                  className="btn-secondary"
                  style={{ padding: '9px 14px', fontSize: '0.86rem' }}
                >
                  <RotateCcw size={15} />
                  <span>আবার দিন</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Layout: Questions Feed + Sticky Sidebar Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 290px',
          gap: '24px',
          alignItems: 'start'
        }} className="exam-layout-grid">
          {/* Questions Column */}
          <div>
            {questions.map((q, idx) => (
              <div key={q.id || idx} id={`q_${idx}`} style={{ marginBottom: '18px' }}>
                <QuestionCard
                  question={q}
                  index={idx}
                  mode={isSubmitted ? 'read' : 'exam'}
                  selectedOption={userAnswers[idx]}
                  onSelectOption={(qId, option) => handleSelectOption(idx, option)}
                  showResult={isSubmitted}
                />
              </div>
            ))}

            {/* Bottom Final Submit / Review Banner */}
            {!isSubmitted ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '30px', marginTop: '20px', background: '#ffffff' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  সকল প্রশ্নের উত্তর দেওয়া সম্পন্ন হয়েছে?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                  আপনি মোট {questions.length}টির মধ্যে {answeredCount}টি প্রশ্নের উত্তর দিয়েছেন। পরীক্ষা জমা দিতে নিচের বাটনে ক্লিক করুন।
                </p>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="btn-primary"
                  style={{ padding: '13px 36px', fontSize: '1.02rem', margin: '0 auto' }}
                >
                  <Send size={18} />
                  <span>পরীক্ষা সমাপ্ত ও জমা দিন</span>
                </button>
              </div>
            ) : (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '24px', marginTop: '20px', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-700)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '10px' }}>
                  <CheckCircle2 size={20} />
                  <span>পরীক্ষা জমা দেওয়া হয়েছে এবং উত্তরপত্র প্রদর্শিত হচ্ছে</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={() => setShowResultModal(true)} className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.88rem' }}>
                    <Award size={16} />
                    <span>পূর্ণাঙ্গ রেজাল্ট ও মার্কশিট দেখুন</span>
                  </button>
                  <button onClick={handleRetake} className="btn-secondary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>
                    <RotateCcw size={16} />
                    <span>পুনরায় পরীক্ষা শুরু করুন</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar Navigation Grid (Desktop) */}
          <div className="exam-sidebar-nav">
            <QuestionNavGrid
              total={questions.length}
              userAnswers={userAnswers}
              currentIndex={currentIdx}
              onSelectIndex={(idx) => {
                setCurrentIdx(idx);
                const el = document.getElementById(`q_${idx}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
            />

            {/* Live Stats Box */}
            <div className="glass-panel" style={{ padding: '16px', marginTop: '16px', background: '#ffffff', fontSize: '0.86rem' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                পরীক্ষার সারাংশ
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-muted)' }}>মোট প্রশ্ন:</span>
                <strong style={{ color: '#0f172a' }}>{questions.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-muted)' }}>উত্তর দিয়েছেন:</span>
                <strong style={{ color: 'var(--emerald-600)' }}>{answeredCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-muted)' }}>বাকি প্রশ্ন:</span>
                <strong style={{ color: remainingCount > 0 ? '#d97706' : '#059669' }}>{remainingCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>ভুল উত্তরের শাস্তি:</span>
                <strong style={{ color: '#dc2626' }}>-{negativeMarkRate}</strong>
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

export default function ModelTestPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#047857', fontWeight: 600 }}>
        লোড হচ্ছে...
      </div>
    }>
      <ModelTestContent />
    </Suspense>
  );
}
