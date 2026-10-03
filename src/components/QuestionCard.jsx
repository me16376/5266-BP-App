'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Sparkles, 
  Bookmark, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toggleBookmark, isBookmarked } from '../lib/storage';
import FormattedContent from './FormattedContent';

const OPTION_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];

export default function QuestionCard({ 
  question, 
  index, 
  mode = 'practice', // 'practice' | 'read' | 'exam' | 'test'
  selectedOption = null,
  userAnswer = null,
  onSelectOption = null,
  showResult = false,
  isSubmitted = false
}) {
  const [localSelected, setLocalSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(mode === 'read');
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(question?.id));
  const [copied, setCopied] = useState(false);
  const [aiNotice, setAiNotice] = useState(false);

  const isExam = mode === 'exam' || mode === 'test';
  const isPractice = mode === 'practice';
  const isRead = mode === 'read';
  const actualShowResult = Boolean(showResult || isSubmitted);
  const activeSelection = isExam ? (selectedOption ?? userAnswer) : localSelected;

  const handleOptionClick = (opt) => {
    if (isExam) {
      if (actualShowResult) return;
      if (onSelectOption) {
        onSelectOption(opt, question?.id);
      }
      return;
    }

    if (isPractice && !localSelected) {
      setLocalSelected(opt);
      setShowExplanation(true);
    }
  };

  const handleBookmarkToggle = () => {
    if (!question) return;
    const newState = toggleBookmark(question);
    setBookmarked(newState);
  };

  const cleanText = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/\$\$([\s\S]*?)\$\$/g, '$1')
      .replace(/\\\[([\s\S]*?)\\\]/g, '$1')
      .replace(/\\\(([\s\S]*?)\\\)/g, '$1')
      .replace(/(^|[^\\])\$([^\$\r\n]+?)\$/g, '$1$2')
      .replace(/```[a-zA-Z0-9_\-\+]*\n([\s\S]*?)```/g, '$1')
      .replace(/`([^`\r\n]+)`/g, '$1')
      .trim();
  };

  const rawOptions = Array.isArray(question?.options) ? question.options : [];
  const qAns = (question?.correct_answer !== null && question?.correct_answer !== undefined) 
    ? String(question.correct_answer).trim() 
    : '';

  const handleAskAI = () => {
    if (typeof window !== 'undefined') {
      const qText = cleanText(question?.question_text || question?.question || '');
      const cleanOpts = rawOptions.map(cleanText);

      window.postMessage({
        type: '5266_ASK_AI',
        payload: {
          question: qText,
          options: cleanOpts,
          subject: question?.subject || '',
          exam: question?.exam || ''
        }
      }, '*');

      const isExtInstalled = typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-5266-extension-installed') === 'true';

      if (!isExtInstalled) {
        setAiNotice(true);
        setTimeout(() => setAiNotice(false), 6000);
      }
    }
  };

  const handleCopyQuestion = () => {
    const qTitle = cleanText(question?.question || question?.question_text || '');
    const text = `${qTitle}\n\n` +
      rawOptions.map((o, i) => `${OPTION_LABELS[i] || i+1}) ${cleanText(o)}`).join('\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!question) return null;

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      marginBottom: '20px',
      position: 'relative',
      borderLeft: '4px solid var(--emerald-500)',
      background: '#ffffff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
    }}>
      {/* Header Tags & Tools */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            background: 'var(--gradient-brand)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.85rem',
            padding: '2px 10px',
            borderRadius: '6px'
          }}>
            #{index !== undefined ? index + 1 : question.id}
          </span>

          {question.subject && (
            <span className="badge badge-emerald">
              {question.subject}
            </span>
          )}

          {question.exam && (
            <span className="badge badge-cyan" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {question.exam}
            </span>
          )}
        </div>

        {/* Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleBookmarkToggle}
            title={bookmarked ? 'বুকমার্ক সরানো' : 'বুকমার্কে সংরক্ষণ'}
            style={{
              background: bookmarked ? '#fffbeb' : '#f1f5f9',
              border: bookmarked ? '1px solid #fde68a' : '1px solid #e2e8f0',
              color: bookmarked ? '#b45309' : 'var(--text-muted)',
              borderRadius: '6px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <Bookmark size={15} fill={bookmarked ? '#fbbf24' : 'none'} />
          </button>

          <button
            onClick={handleCopyQuestion}
            title="প্রশ্ন কপি করুন"
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: 'var(--text-muted)',
              borderRadius: '6px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={15} color="#059669" /> : <Copy size={15} />}
          </button>
        </div>
      </div>

      {/* Question Text */}
      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: 700,
        color: '#0f172a',
        lineHeight: '1.75',
        marginBottom: '20px',
        fontFamily: 'var(--font-kalpurush)'
      }}>
        <FormattedContent content={question.question || question.question_text || ''} />
      </h3>

      {/* Options Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {rawOptions.map((option, optIdx) => {
          const optStr = (option !== null && option !== undefined) ? String(option).trim() : '';
          const isCorrect = qAns !== '' && optStr === qAns;
          const selStr = (activeSelection !== null && activeSelection !== undefined) ? String(activeSelection).trim() : null;
          const isSelected = selStr !== null && selStr === optStr;

          let optionBg = '#f8fafc';
          let optionBorder = '#e2e8f0';
          let optionColor = '#1e293b';
          let icon = null;

          if (isRead || (actualShowResult && isCorrect)) {
            if (isCorrect) {
              optionBg = '#ecfdf5';
              optionBorder = '#34d399';
              optionColor = '#047857';
              icon = <CheckCircle2 size={18} color="#059669" />;
            }
          } else if (isPractice && activeSelection) {
            if (isCorrect) {
              optionBg = '#ecfdf5';
              optionBorder = '#34d399';
              optionColor = '#047857';
              icon = <CheckCircle2 size={18} color="#059669" />;
            } else if (isSelected) {
              optionBg = '#fff1f2';
              optionBorder = '#fb7185';
              optionColor = '#be123c';
              icon = <XCircle size={18} color="#e11d48" />;
            }
          } else if (isExam) {
            if (actualShowResult) {
              if (isCorrect) {
                optionBg = '#ecfdf5';
                optionBorder = '#34d399';
                optionColor = '#047857';
                icon = <CheckCircle2 size={18} color="#059669" />;
              } else if (isSelected) {
                optionBg = '#fff1f2';
                optionBorder = '#fb7185';
                optionColor = '#be123c';
                icon = <XCircle size={18} color="#e11d48" />;
              }
            } else {
              if (isSelected) {
                optionBg = '#ecfdf5';
                optionBorder = '#10b981';
                optionColor = '#065f46';
              }
            }
          }

          return (
            <div
              key={optIdx}
              onClick={() => handleOptionClick(option)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                background: optionBg,
                border: `1px solid ${optionBorder}`,
                color: optionColor,
                fontWeight: isSelected || (isRead && isCorrect) || (actualShowResult && isCorrect) ? 600 : 500,
                cursor: (isPractice && activeSelection) || (isExam && actualShowResult) ? 'default' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                background: isSelected || (isRead && isCorrect) || (actualShowResult && isCorrect) ? 'rgba(0,0,0,0.06)' : '#edf2f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.98rem',
                fontFamily: 'var(--font-kalpurush)',
                flexShrink: 0,
                color: optionColor
              }}>
                {OPTION_LABELS[optIdx] || optIdx + 1}
              </div>
              <span style={{ flex: 1, fontSize: '1rem', lineHeight: '1.6' }}>
                <FormattedContent content={option} inline />
              </span>
              {icon}
            </div>
          );
        })}
      </div>

      {/* Explanation & 5266 AI Explainer Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
        {(isPractice || isRead || actualShowResult) && (question.explanation || question.hints) ? (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              color: 'var(--emerald-600)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            <BookOpen size={16} />
            <span>{showExplanation ? 'ব্যাখ্যা লুকান' : 'বিস্তারিত ব্যাখ্যা ও নোট দেখুন'}</span>
            {showExplanation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        ) : <div />}

        {/* 5266 AI Assistant Trigger Button & Follow-ups */}
        {(isPractice || isRead || actualShowResult) && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginLeft: 'auto',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleAskAI}
              title="5266 AI Assistant দিয়ে গুগল জেমিনিতে প্রশ্ন ও অপশন পাঠান"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '8px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#047857',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={14} color="#059669" />
              <span>5266 AI ব্যাখ্যা</span>
            </button>
          </div>
        )}
      </div>

      {/* Extension Info Notice if extension not yet loaded */}
      {aiNotice && (
        <div style={{
          marginTop: '8px',
          padding: '9px 14px',
          borderRadius: '8px',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <span>✨ <strong>5266 AI Assistant</strong> এক্সটেনশনটি ব্রাউজারে চালু থাকলে স্বয়ংক্রিয়ভাবে জেমিনি সাইড প্যানেলে এর ব্যাখ্যা চলে আসবে!</span>
          <button onClick={() => setAiNotice(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#047857', fontWeight: 700, fontSize: '0.9rem' }}>✕</button>
        </div>
      )}

      {/* Expanded Explanation Section */}
      {showExplanation && (
        <div style={{
          marginTop: '14px',
          padding: '18px',
          borderRadius: '10px',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          fontSize: '0.94rem',
          lineHeight: '1.7'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#047857',
            fontWeight: 700,
            marginBottom: '14px',
            fontSize: '1rem',
            flexWrap: 'wrap'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>সঠিক উত্তর: </span>
            {qAns ? (
              <FormattedContent content={question.correct_answer} inline style={{ color: '#047857', fontWeight: 700 }} />
            ) : (
              <span style={{ color: '#64748b', fontStyle: 'italic', fontWeight: 500 }}>উত্তর দেওয়া নেই বা তথ্যে নেই</span>
            )}
          </div>

          {question.explanation && (
            <div style={{ color: '#334155', marginBottom: question.hints ? '14px' : '0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={16} color="var(--emerald-600)" />
                <span>সাধারণ ব্যাখ্যা:</span>
              </div>
              <div style={{
                paddingLeft: '12px',
                borderLeft: '3px solid var(--emerald-500)',
                lineHeight: '1.8',
                fontSize: '1.02rem',
                fontFamily: 'var(--font-kalpurush)'
              }}>
                <FormattedContent content={question.explanation} />
              </div>
            </div>
          )}

          {(() => {
            const rawHint = question.hints?.replace(/^(?:[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{2300}-\u{23FF}\u{2700}-\u{27BF}\u{2B50}-\u{2B55}\uFE0E\uFE0F\u200D\s])+/u, '').trim();
            if (!rawHint) return null;

            // UI Safeguard: Do not display duplicate or truncated substring of explanation
            const cleanExp = (question.explanation || '').trim();
            if (cleanExp) {
              const strippedHint = rawHint.replace(/\.\.\.$/, '').trim();
              if (rawHint === cleanExp || cleanExp === strippedHint || (strippedHint.length > 15 && cleanExp.startsWith(strippedHint))) {
                return null;
              }
            }

            return (
              <div style={{
                marginTop: '14px',
                padding: '14px 16px',
                borderRadius: '8px',
                background: '#fffbeb',
                border: '1px solid #fde68a',
                color: '#92400e'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>
                  <span>স্পেশাল নোট ও শর্টকাট (Hints):</span>
                </div>
                <div style={{
                  lineHeight: '1.8',
                  fontSize: '0.98rem',
                  fontFamily: 'var(--font-kalpurush)'
                }}>
                  <FormattedContent content={rawHint} />
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
