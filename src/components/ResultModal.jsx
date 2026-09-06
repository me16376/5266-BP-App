'use client';

import React from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  RotateCcw, 
  ArrowLeft,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function ResultModal({ 
  result, 
  onRetake, 
  onReviewAnswers 
}) {
  const { total, answered, correct, wrong, skipped, marks, accuracy } = result;

  const isPassed = accuracy >= 60;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '540px',
        padding: '36px',
        borderRadius: '20px',
        border: '1px solid #cbd5e1',
        background: '#ffffff',
        textAlign: 'center',
        boxShadow: '0 20px 45px rgba(0,0,0,0.18)',
        animation: 'fadeIn 0.3s ease'
      }}>
        {/* Trophy / Status Icon */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: isPassed ? '#ecfdf5' : '#fffbeb',
          border: `2px solid ${isPassed ? '#10b981' : '#f59e0b'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: isPassed ? '0 4px 16px rgba(16, 185, 129, 0.25)' : 'none'
        }}>
          {isPassed ? <Trophy size={40} color="#059669" /> : <Award size={40} color="#d97706" />}
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          {isPassed ? 'অভিনন্দন! সফলভাবে সম্পন্ন হয়েছে 🎉' : 'পরীক্ষা সম্পন্ন হয়েছে 👍'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
          আপনার পরীক্ষার পূর্ণাঙ্গ ফলাফল ও পারফরম্যান্স বিশ্লেষণ নিচে দেওয়া হলো:
        </p>

        {/* Score & Marks Display */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '14px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            অর্জিত মোট নম্বর
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '4px 0'
          }}>
            {marks.toFixed(2)} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/ {total}</span>
          </div>

          <div style={{ fontSize: '0.88rem', color: '#475569' }}>
            সঠিকতার হার (Accuracy): <strong style={{ color: isPassed ? '#059669' : '#d97706' }}>{accuracy.toFixed(1)}%</strong>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          marginBottom: '28px'
        }}>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 6px'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>মোট</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{total}</div>
          </div>

          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '12px 6px'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#047857', marginBottom: '4px' }}>সঠিক</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#047857' }}>{correct}</div>
          </div>

          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '10px',
            padding: '12px 6px'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#be123c', marginBottom: '4px' }}>ভুল</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#be123c' }}>{wrong}</div>
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 6px'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>অনুক্ত</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{skipped}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={onReviewAnswers}
            className="btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            <CheckCircle2 size={18} />
            <span>উত্তর ও ব্যাখ্যা রিভিউ করুন</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onRetake}
              className="btn-secondary"
              style={{ flex: 1, padding: '10px' }}
            >
              <RotateCcw size={16} />
              <span>পুনরায় পরীক্ষা দিন</span>
            </button>

            <Link
              href="/exams"
              className="btn-secondary"
              style={{ flex: 1, padding: '10px' }}
            >
              <ArrowLeft size={16} />
              <span>অন্যান্য পরীক্ষা</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
