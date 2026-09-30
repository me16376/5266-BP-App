'use client';

import React from 'react';
import Link from 'next/link';

export default function ChooseExamPopup({
  target = 'job-solution', // 'job-solution' | 'question-bank-smart'
  title = '',
  description = ''
}) {
  const isSmart = target === 'question-bank-smart';
  const targetUrl = isSmart ? '/question-bank-smart' : '/job-solution';
  const targetLabel = isSmart ? 'পরীক্ষা নির্বাচন করুন (/question-bank-smart)' : 'পরীক্ষা নির্বাচন করুন (/job-solution)';
  
  const displayTitle = title || 'একটি পরীক্ষা নির্বাচন করুন';
  const displayDesc = description || (
    isSmart
      ? 'প্রশ্ন ও উত্তর স্মার্ট অনুশীলন শুরু করতে অনুগ্রহ করে /question-bank-smart/ পেজ থেকে একটি পরীক্ষা নির্বাচন করুন।'
      : 'অনুশীলন বা লাইভ মডেল টেস্ট শুরু করতে অনুগ্রহ করে /job-solution/ পেজ থেকে একটি পরীক্ষা নির্বাচন করুন।'
  );

  const accentColor = isSmart ? '#0284c7' : '#059669';
  const accentLight = isSmart ? '#e0f2fe' : '#ecfdf5';
  const accentBorder = isSmart ? '#7dd3fc' : '#a7f3d0';
  const badgeBg = isSmart ? '#f0f9ff' : '#ecfdf5';
  const badgeColor = isSmart ? '#0369a1' : '#047857';

  return (
    <div style={{
      padding: '60px 16px 100px',
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '620px',
        width: '100%',
        padding: '48px 32px',
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${accentBorder}`
      }}>
        {/* Top Icon Badge */}
        <div style={{
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${accentLight} 0%, #ffffff 100%)`,
          border: `2px solid ${accentBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: `0 8px 24px ${isSmart ? 'rgba(2, 132, 199, 0.18)' : 'rgba(16, 185, 129, 0.18)'}`
        }}>
          <i
            className={`fa-solid ${isSmart ? 'fa-list-check' : 'fa-stopwatch-20'}`}
            style={{ fontSize: '2.4rem', color: accentColor }}
          ></i>
        </div>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: badgeBg,
          color: badgeColor,
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.84rem',
          fontWeight: 700,
          marginBottom: '14px',
          border: `1px solid ${accentBorder}`
        }}>
          <i className={`fa-solid ${isSmart ? 'fa-book-open' : 'fa-clipboard-check'}`}></i>
          <span>পরীক্ষা নির্বাচন</span>
        </span>

        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', lineHeight: 1.3 }}>
          {displayTitle}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '28px' }}>
          {displayDesc}
        </p>

        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '16px 20px',
          textAlign: 'left',
          marginBottom: '28px',
          fontSize: '0.9rem',
          color: '#334155'
        }}>
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-circle-check" style={{ color: accentColor }}></i>
            <span>যেভাবে শুরু করবেন:</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>• ১. নিচের বাটনে ক্লিক করে <strong>{isSmart ? '/question-bank-smart/' : '/job-solution/'}</strong> পেজে যান</li>
            <li>• ২. বিসিএস, ব্যাংক বা যেকোনো পরীক্ষার কার্ড থেকে আপনার পছন্দের পরীক্ষাটি বাছাই করুন</li>
            <li>• ৩. তাৎক্ষণিক প্রশ্ন ও উত্তর অনুশীলন বা মডেল টেস্ট শুরু করুন</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={targetUrl}
            style={{
              padding: '13px 28px',
              fontSize: '0.98rem',
              fontWeight: 700,
              background: accentColor,
              color: '#ffffff',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: `0 6px 18px ${isSmart ? 'rgba(2, 132, 199, 0.25)' : 'rgba(5, 150, 105, 0.25)'}`,
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fa-solid fa-arrow-right"></i>
            <span>{targetLabel}</span>
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
