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
import ExamTimer from '../../../../components/ExamTimer';
import QuestionNavGrid from '../../../../components/QuestionNavGrid';
import QuestionCard from '../../../../components/QuestionCard';
import ResultModal from '../../../../components/ResultModal';
import { loadExamQuestions, getExamsCatalog, cleanExamTitle } from '../../../../lib/examsData';
import { saveTestResult } from '../../../../lib/storage';
import { useAuth } from '../../../../lib/authContext';

function ModelTestContent() {
  const { user, loading: authLoading, logout } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const examSlug = searchParams.get('exam');

  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [negativeMarkRate, setNegativeMarkRate] = useState(0.5); // Default 0.5 for BCS

  const isOwner = user?.role === 'owner';
  const isAdmin = user?.role === 'admin';
  const isApprovedUser = user?.status === 'approved';
  const isAuthorized = isOwner || isAdmin || isApprovedUser;

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

    loadExamQuestions(examSlug).then(res => {
      setExamData(res.exam);
      setQuestions(res.questions || []);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading exam questions:', err);
      setLoading(false);
    });
  }, [examSlug, isAuthorized]);

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

  // 2. Unauthenticated: User is not logged in
  if (!user) {
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
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '2px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)'
          }}>
            <i className="fa-solid fa-lock" style={{ fontSize: '2.4rem', color: '#d97706' }}></i>
          </div>

          <span className="badge badge-amber" style={{ marginBottom: '14px', padding: '6px 16px', fontSize: '0.84rem' }}>
            <i className="fa-solid fa-shield-halved" style={{ marginRight: '6px' }}></i> অ্যাক্সেস সীমাবদ্ধ
          </span>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', lineHeight: 1.3 }}>
            মডেল টেস্ট দিতে লগইন প্রয়োজন
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '28px' }}>
            টাইমার ও নেগেটিভ মার্কিং সহ লাইভ মডেল টেস্ট দিতে অনুগ্রহ করে লগইন করুন। শুধুমাত্র <strong>অনুমোদিত শিক্ষার্থী (Approved User)</strong> বা <strong>অ্যাডমিনিস্ট্রেটর</strong> ছাড়া এই পেজটি দেখা যাবে না।
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '18px 20px',
            textAlign: 'left',
            marginBottom: '28px',
            fontSize: '0.9rem',
            color: '#334155'
          }}>
            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--emerald-600)', marginRight: '8px' }}></i>
              অনুমোদিত অ্যাকাউন্টে যে সুবিধাসমূহ উন্মুক্ত হবে:
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>• ২,১৫৪টি বিসিএস, ব্যাংক, শিক্ষক ও সরকারি চাকরির লাইভ মডেল টেস্ট</li>
              <li>• পরীক্ষা ভিত্তিক সঠিক সময় নির্ধারণ ও কাউন্টডাউন টাইমার</li>
              <li>• স্বয়ংক্রিয় ভুল উত্তরের নেগেটিভ মার্কিং ও বিস্তারিত স্কোরশিট</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/profile"
              className="btn-primary"
              style={{ padding: '13px 28px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-right-to-bracket"></i>
              <span>লগইন বা সাইন আপ করুন</span>
            </Link>

            <Link
              href="/"
              className="btn-secondary"
              style={{ padding: '13px 24px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-house"></i>
              <span>হোম পেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
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
            প্রিয় <strong>{user.name}</strong>, আপনার অ্যাকাউন্টটি বর্তমানে পর্যালোচনার অধীনে রয়েছে। শুধুমাত্র <strong>অনুমোদিত শিক্ষার্থী (Approved User)</strong> বা <strong>অ্যাডমিনিস্ট্রেটর</strong> ছাড়া এই পেজটি দেখা যাবে না। সিস্টেম অ্যাডমিন অনুমোদন সম্পন্ন করার পর আপনি মডেল টেস্টে অংশগ্রহণ করতে পারবেন।
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

  // 4. If no exam selected (Show notice to pick from job solutions page)
  if (!examSlug) {
    return (
      <div style={{ padding: '60px 16px 100px', minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          maxWidth: '620px',
          width: '100%',
          padding: '44px 32px',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          transition: 'none',
          animation: 'none',
          transform: 'none'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#fef3c7',
            border: '2px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 22px',
            boxShadow: 'none',
            transition: 'none',
            animation: 'none'
          }}>
            <Timer size={36} color="#d97706" />
          </div>

          <span className="badge badge-amber" style={{ marginBottom: '14px', padding: '6px 16px', fontSize: '0.84rem' }}>
            লাইভ মডেল টেস্ট রুম
          </span>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', lineHeight: 1.3 }}>
            কোনো পরীক্ষা নির্বাচন করা হয়নি
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '28px' }}>
            মেইন জব সলিউশন পেজ থেকে একটা একটা এক্সাম চুজ করুন, তারপর মডেল টেস্ট দিতে পারবেন।
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/job-solution"
              className="btn-primary"
              style={{ padding: '12px 26px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'none', transform: 'none' }}
            >
              <Layers size={18} />
              <span>জব সলিউশন পেজে যান (সকল প্রশ্ন ব্যাংক)</span>
            </Link>

            <Link
              href="/"
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'none', transform: 'none' }}
            >
              <span>হোম পেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If loading
  if (loading) {
    return (
      <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: '3px solid #cbd5e1',
          borderTopColor: 'var(--emerald-600)',
          animation: 'none'
        }} />
        <div style={{ color: 'var(--emerald-700)', fontWeight: 700, fontSize: '1.05rem' }}>
          মডেল টেস্ট রুম প্রস্তুত করা হচ্ছে...
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          প্রশ্নপত্র ও টাইমার লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন।
        </p>
      </div>
    );
  }

  // If exam slug given but questions not found
  if (!examData || questions.length === 0) {
    return (
      <div style={{ padding: '60px 16px 100px', minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{
          maxWidth: '560px',
          width: '100%',
          padding: '40px 30px',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)'
        }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
            পরীক্ষার প্রশ্নপত্র পাওয়া যায়নি
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
            মেইন জব সলিউশন পেজ থেকে একটি সঠিক পরীক্ষা নির্বাচন করুন।
          </p>
          <Link href="/job-solution" className="btn-primary" style={{ padding: '12px 24px' }}>
            সকল প্রশ্ন ব্যাংকের তালিকা দেখুন
          </Link>
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
              href={`/job-solution-practice?exam=${examSlug}&mode=practice`}
              className="btn-secondary"
              style={{ padding: '7px 12px', fontSize: '0.84rem' }}
            >
              <ArrowLeft size={15} />
              <span>প্র্যাকটিস পেজে যান</span>
            </Link>

            <Link
              href="/job-solution"
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
              {cleanExamTitle(examData?.title) || 'মডেল টেস্ট'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Countdown Timer */}
            {!isSubmitted && (
              <ExamTimer
                initialMinutes={durationMinutes}
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
                  index={idx}
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
