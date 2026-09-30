'use client';

import React from 'react';
import Link from 'next/link';

export default function LoginRequiredModal({
  isOpen = true,
  title = 'লগইন প্রয়োজন',
  description = 'এই পেজের প্রশ্ন ও পরীক্ষা অনুশীলন করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।',
  featureList = [
    '২,১৫৪টি বিসিএস, ব্যাংক, শিক্ষক ও সরকারি চাকরির বিগত প্রশ্নপত্র',
    'টাইমার, স্কোরশিট ও বিস্তারিত নির্ভুল ব্যাখ্যা',
    'স্বয়ংক্রিয় ভুল উত্তর ট্র্যাকিং ও পারফরম্যান্স অ্যানালিটিক্স'
  ],
  loginRedirect = '',
  chooseExamUrl = '',
  chooseExamText = ''
}) {
  if (!isOpen) return null;

  const loginHref = loginRedirect
    ? `/login?redirect=${encodeURIComponent(loginRedirect)}`
    : '/login';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.72)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '24px',
        padding: '36px 28px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0',
        position: 'relative'
      }}>
        {/* Top Lock Icon Badge */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '2px solid #fde68a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)'
        }}>
          <i className="fa-solid fa-lock" style={{ fontSize: '2.1rem', color: '#d97706' }}></i>
        </div>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#fef3c7',
          color: '#b45309',
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <i className="fa-solid fa-shield-halved"></i> অ্যাক্সেস সীমাবদ্ধ
        </span>

        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', lineHeight: 1.3 }}>
          {title}
        </h2>

        <p style={{ color: '#64748b', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '22px' }}>
          {description}
        </p>

        {/* Feature List */}
        {featureList && featureList.length > 0 && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px 18px',
            textAlign: 'left',
            marginBottom: '24px',
            fontSize: '0.88rem',
            color: '#334155'
          }}>
            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
              লগইন করলে যে সুবিধাসমূহ পাবেন:
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {featureList.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.45 }}>
                  <span style={{ color: '#0284c7', fontWeight: 700 }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={loginHref}
            style={{
              padding: '12px 28px',
              fontSize: '0.96rem',
              fontWeight: 700,
              background: '#0284c7',
              color: '#ffffff',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fa-solid fa-right-to-bracket"></i>
            <span>লগইন বা সাইন আপ করুন</span>
          </Link>

          {chooseExamUrl ? (
            <Link
              href={chooseExamUrl}
              style={{
                padding: '12px 22px',
                fontSize: '0.96rem',
                fontWeight: 600,
                background: '#f1f5f9',
                color: '#475569',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-list-check"></i>
              <span>{chooseExamText || 'পরীক্ষা তালিকা'}</span>
            </Link>
          ) : (
            <Link
              href="/"
              style={{
                padding: '12px 22px',
                fontSize: '0.96rem',
                fontWeight: 600,
                background: '#f1f5f9',
                color: '#475569',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-house"></i>
              <span>হোম পেজ</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
