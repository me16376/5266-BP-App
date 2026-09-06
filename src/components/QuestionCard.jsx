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

const OPTION_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];

export default function QuestionCard({ 
  question, 
  index, 
  mode = 'practice', // 'practice' | 'read' | 'exam'
  selectedOption = null,
  onSelectOption = null,
  showResult = false
}) {
  const [localSelected, setLocalSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(mode === 'read');
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(question.id));
  const [copied, setCopied] = useState(false);

  const activeSelection = mode === 'exam' ? selectedOption : localSelected;
  const isPractice = mode === 'practice';
  const isRead = mode === 'read';
  const isExam = mode === 'exam';

  const handleOptionClick = (opt) => {
    if (isExam) {
      if (onSelectOption) onSelectOption(question.id, opt);
      return;
    }

    if (isPractice && !localSelected) {
      setLocalSelected(opt);
      setShowExplanation(true);
    }
  };

  const handleBookmarkToggle = () => {
    const newState = toggleBookmark(question);
    setBookmarked(newState);
  };

  const handleCopyQuestion = () => {
    const text = `${question.question}\n` +
      question.options.map((o, i) => `(${OPTION_LABELS[i] || i+1}) ${o}`).join('\n') +
      `\nউত্তর: ${question.correct_answer}` +
      (question.explanation ? `\nব্যাখ্যা: ${question.explanation}` : '');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        fontSize: '1.15rem',
        fontWeight: 700,
        color: '#0f172a',
        lineHeight: '1.6',
        marginBottom: '20px'
      }}>
        {question.question}
      </h3>

      {/* Options Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {question.options.map((option, optIdx) => {
          const isCorrect = option.trim() === question.correct_answer.trim();
          const isSelected = activeSelection === option;

          let optionBg = '#f8fafc';
          let optionBorder = '#e2e8f0';
          let optionColor = '#1e293b';
          let icon = null;

          if (isRead || (showResult && isCorrect)) {
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
            if (isSelected) {
              optionBg = '#f0fdfa';
              optionBorder = '#22d3ee';
              optionColor = '#0f766e';
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
                fontWeight: isSelected || (isRead && isCorrect) ? 600 : 500,
                cursor: (isPractice && activeSelection) ? 'default' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: isSelected || (isRead && isCorrect) ? 'rgba(0,0,0,0.06)' : '#edf2f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0,
                color: optionColor
              }}>
                {OPTION_LABELS[optIdx] || optIdx + 1}
              </div>
              <span style={{ flex: 1, fontSize: '0.98rem' }}>
                {option}
              </span>
              {icon}
            </div>
          );
        })}
      </div>

      {/* Toggle Explanation Button (if practice or read) */}
      {(isPractice || isRead || showResult) && (question.explanation || question.hints) && (
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
            padding: '4px 0',
            marginTop: '8px'
          }}
        >
          <BookOpen size={16} />
          <span>{showExplanation ? 'ব্যাখ্যা লুকান' : 'বিস্তারিত ব্যাখ্যা ও নোট দেখুন'}</span>
          {showExplanation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
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
            marginBottom: '10px',
            fontSize: '1rem'
          }}>
            <CheckCircle2 size={18} />
            <span>সঠিক উত্তর: {question.correct_answer}</span>
          </div>

          {question.explanation && (
            <div style={{ color: '#334155', marginBottom: question.hints ? '12px' : '0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                📖 সাধারণ ব্যাখ্যা:
              </div>
              <div style={{ whiteSpace: 'pre-line', paddingLeft: '8px', borderLeft: '2px solid #94a3b8' }}>
                {question.explanation}
              </div>
            </div>
          )}

          {question.hints && (
            <div style={{
              marginTop: '12px',
              padding: '14px',
              borderRadius: '8px',
              background: '#fffbeb',
              border: '1px solid #fde68a',
              color: '#92400e'
            }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Sparkles size={15} color="#b45309" />
                <span>স্পেশাল নোট ও শর্টকাট (Hints):</span>
              </div>
              <div style={{ whiteSpace: 'pre-line', fontSize: '0.9rem' }}>
                {question.hints}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
