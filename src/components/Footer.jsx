'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Shield, Cloud, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#f8fafc',
      borderTop: '1px solid var(--border-subtle)',
      padding: '48px 0 24px',
      marginTop: '80px',
      color: 'var(--text-secondary)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
              }}>
                <BookOpen size={18} color="#ffffff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>
                JobSolutions <span style={{ color: 'var(--emerald-600)' }}>BD</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
              বাংলাদেশের সকল বিসিএস, সরকারি ও বেসরকারি ব্যাংক, শিক্ষক নিয়োগ এবং মন্ত্রণালয়ের ২.৫ লাখ বিগত প্রশ্নব্যাংক ও প্রস্তুতি প্ল্যাটফর্ম।
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <span className="badge badge-emerald">
                <Cloud size={12} /> Cloudflare Pages Ready
              </span>
              <span className="badge badge-cyan">
                <Shield size={12} /> 100% Offline Capable
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.98rem', marginBottom: '14px' }}>
              প্রধান ক্যাটাগরি
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <li><Link href="/exams?cat=bcs" style={{ color: '#475569' }}>বিসিএস প্রিলিমিনারি (১০ম-৪৬তম)</Link></li>
              <li><Link href="/exams?cat=bank" style={{ color: '#475569' }}>সরকারি ও বাণিজ্যিক ব্যাংক নিয়োগ</Link></li>
              <li><Link href="/exams?cat=teacher" style={{ color: '#475569' }}>প্রাইমারি ও শিক্ষক নিবন্ধন (NTRCA)</Link></li>
              <li><Link href="/exams?cat=ministry" style={{ color: '#475569' }}>মন্ত্রণালয় ও পিএসসি নন-ক্যাডার</Link></li>
              <li><Link href="/exams?cat=subject" style={{ color: '#475569' }}>বিষয়ভিত্তিক প্রশ্নব্যাংক ও নোট</Link></li>
            </ul>
          </div>

          {/* Study Modes */}
          <div>
            <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.98rem', marginBottom: '14px' }}>
              পড়ার ও পরীক্ষার মোড
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <li><Link href="/practice?mode=practice" style={{ color: '#475569' }}>প্র্যাকটিস মোড (তাৎক্ষণিক ব্যাখ্যা)</Link></li>
              <li><Link href="/practice?mode=read" style={{ color: '#475569' }}>পড়ুন মোড (রিভিশন ও উত্তরসহ)</Link></li>
              <li><Link href="/model-test" style={{ color: '#475569' }}>লাইভ মডেল টেস্ট (টাইমার ও স্কোর)</Link></li>
              <li><Link href="/file-exam" style={{ color: '#475569' }}>ফাইল এক্সাম স্টুডিও (CSV/JSON/XLSX)</Link></li>
              <li><Link href="/bookmarks" style={{ color: '#475569' }}>বুকমার্ক ও সংরক্ষিত প্রশ্নমালা</Link></li>
            </ul>
          </div>

          {/* Helpful Links */}
          <div>
            <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.98rem', marginBottom: '14px' }}>
              সহায়ক সুবিধাসমূহ
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <li><Link href="/exams" style={{ color: '#475569' }}>সকল বিগত পরীক্ষার তালিকা</Link></li>
              <li><Link href="/practice" style={{ color: '#475569' }}>প্রশ্নব্যাংক সার্চ ও ফিল্টার</Link></li>
              <li><Link href="/model-test" style={{ color: '#475569' }}>মডেল টেস্ট রুম</Link></li>
              <li><Link href="/file-exam" style={{ color: '#475569' }}>ফাইল এক্সাম রুম</Link></li>
              <li><Link href="/file-studio" style={{ color: '#475569' }}>টেবিল স্টুডিও (CSV / Excel / JSON)</Link></li>
              <li><Link href="/bookmarks" style={{ color: '#475569' }}>ব্যক্তিগত লাইব্রেরি ও হিস্টোরি</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.84rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} JobSolutions BD. All rights reserved. Deployed with Next.js on Cloudflare.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Made with</span>
            <Heart size={14} color="#f43f5e" fill="#f43f5e" />
            <span>for Bangladeshi Job Seekers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
