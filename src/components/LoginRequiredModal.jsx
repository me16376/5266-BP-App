'use client';

import React from 'react';
import Link from 'next/link';

export default function LoginRequiredModal({
  isOpen = true,
  title = 'পরীক্ষার তালিকা দেখতে লগইন প্রয়োজন',
  description = 'এই পেজের বিগত ২,১৫৪টি চাকরির প্রশ্নভাণ্ডার ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন। শুধুমাত্র অনুমোদিত শিক্ষার্থী (Approved User) বা অ্যাডমিনিস্ট্রেটর ছাড়া এই পেজটি দেখা যাবে না।',
  featureList = [
    '২,১৫৪টি বিসিএস, ব্যাংক, শিক্ষক ও সরকারি চাকরির বিগত প্রশ্নপত্র',
    'লাইভ মডেল টেস্ট, নেগেটিভ মার্কিং ও ওএমআর মার্কশিট',
    'তাৎক্ষণিক সঠিক উত্তর ও বিস্তারিত ব্যাখ্যাসহ সমাধান'
  ],
  loginRedirect = '',
  chooseExamUrl = '',
  chooseExamText = ''
}) {
  if (!isOpen) return null;

  // Account login page is at /profile (matching /job-solution/ page)
  const loginHref = loginRedirect
    ? `/profile?redirect=${encodeURIComponent(loginRedirect)}`
    : '/profile';

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
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Top Lock Icon Badge */}
        <div style={{
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 100%)',
          border: '2px solid #a7f3d0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)'
        }}>
          <i className="fa-solid fa-lock" style={{ fontSize: '2.4rem', color: 'var(--emerald-600)' }}></i>
        </div>

        <span className="badge badge-emerald" style={{ marginBottom: '14px', padding: '6px 16px', fontSize: '0.84rem' }}>
          <i className="fa-solid fa-shield-halved" style={{ marginRight: '6px' }}></i> অ্যাক্সেস সীমাবদ্ধ
        </span>

        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', lineHeight: 1.3 }}>
          {title}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '28px' }}>
          {description}
        </p>

        {/* Feature List */}
        {featureList && featureList.length > 0 && (
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
            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--emerald-600)' }}></i>
              <span>অনুমোদিত অ্যাকাউন্টে যে সুবিধাসমূহ উন্মুক্ত হবে:</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {featureList.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.45 }}>
                  <span style={{ color: 'var(--emerald-600)', fontWeight: 700 }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={loginHref}
            className="btn-primary"
            style={{ padding: '13px 28px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="fa-solid fa-right-to-bracket"></i>
            <span>লগইন বা সাইন আপ করুন</span>
          </Link>

          {chooseExamUrl ? (
            <Link
              href={chooseExamUrl}
              className="btn-secondary"
              style={{ padding: '13px 24px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-list-check"></i>
              <span>{chooseExamText || 'পরীক্ষা তালিকা'}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="btn-secondary"
              style={{ padding: '13px 24px', fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-house"></i>
              <span>হোম পেজে ফিরে যান</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
