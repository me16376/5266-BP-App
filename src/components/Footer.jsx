'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Heart, 
  FileSpreadsheet, 
  Table, 
  FolderOpen
} from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      padding: '48px 0 24px',
      color: '#475569',
      marginTop: 'auto'
    }}>
      <style>{`
        .footer-nav-link {
          color: #475569;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.18s ease;
        }
        .footer-nav-link:hover {
          color: #047857;
          transform: translateX(3px);
        }
        .footer-tool-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .footer-tool-btn:hover {
          border-color: #a7f3d0;
          background: #f0fdf4;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
        }
      `}</style>

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          {/* 1. Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-brand, linear-gradient(135deg, #059669 0%, #10b981 100%))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
              }}>
                <BookOpen size={18} color="#ffffff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>
                JobSolutions <span style={{ color: 'var(--emerald-600, #059669)' }}>BD</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.65', color: '#64748b', margin: 0 }}>
              বাংলাদেশের সকল বিসিএস, ব্যাংক, প্রাথমিক, NTRCA ও নিয়োগ পরীক্ষার সমৃদ্ধ প্রশ্নব্যাংক ও স্মার্ট সেলফ-স্টাডি প্ল্যাটফর্ম।
            </p>
          </div>

          {/* 2. Question Banks Archive */}
          <div>
            <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.96rem', marginBottom: '14px' }}>
              প্রশ্নব্যাংক আর্কাইভ
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', padding: 0, margin: 0 }}>
              <li>
                <Link href="/job-solution?cat=bcs" className="footer-nav-link">
                  বিসিএস প্রিলিমিনারি (১০ম–৪৬তম)
                </Link>
              </li>
              <li>
                <Link href="/job-solution?cat=bank" className="footer-nav-link">
                  সরকারি ও বাণিজ্যিক ব্যাংক নিয়োগ
                </Link>
              </li>
              <li>
                <Link href="/job-solution?cat=primary" className="footer-nav-link">
                  প্রাথমিক ও শিক্ষক নিবন্ধন (NTRCA)
                </Link>
              </li>
              <li>
                <Link href="/ict" className="footer-nav-link">
                  আইসিটি প্রশ্নব্যাংক (ICT GK)
                </Link>
              </li>
              <li>
                <Link href="/ampibian-suggestion" className="footer-nav-link">
                  স্পেশাল সাজেশন হাব
                </Link>
              </li>
              <li>
                <Link href="/smart-ai" className="footer-nav-link">
                  স্মার্ট এআই প্রশ্নভাণ্ডার
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Study Modes */}
          <div>
            <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.96rem', marginBottom: '14px' }}>
              স্টাডি ও প্র্যাকটিস মোড
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', padding: 0, margin: 0 }}>
              <li>
                <Link href="/job-solution-practice?mode=practice" className="footer-nav-link">
                  প্র্যাকটিস মোড (তাৎক্ষণিক ব্যাখ্যা)
                </Link>
              </li>
              <li>
                <Link href="/job-solution-practice?mode=read" className="footer-nav-link">
                  পড়ুন ও রিভিশন মোড (উত্তরসহ)
                </Link>
              </li>
              <li>
                <Link href="/job-solution-model-test" className="footer-nav-link">
                  লাইভ মডেল টেস্ট (টাইমার ও স্কোর)
                </Link>
              </li>
              <li>
                <Link href="/most-important-questions" className="footer-nav-link">
                  গুরুত্বপূর্ণ প্রশ্ন সংকলন
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="footer-nav-link">
                  বুকমার্ক ও সংরক্ষিত প্রশ্নমালা
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. File Tools */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <FolderOpen size={17} color="#059669" />
              <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.96rem', margin: 0 }}>
                ফাইল টুলস
              </h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.45', marginBottom: '12px' }}>
              নিজস্ব প্রশ্ন শিট আপলোড করে প্র্যাকটিস ও ফাইল কনভার্ট করুন।
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/file-exam" className="footer-tool-btn">
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileSpreadsheet size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                    ফাইল এক্সাম
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    এক্সেল / সিএসভি ফাইল দিয়ে পরীক্ষা
                  </div>
                </div>
              </Link>

              <Link href="/file-studio" className="footer-tool-btn">
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#f0fdf4',
                  color: '#047857',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Table size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                    ফাইল কনভার্ট
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    শিট কনভার্ট ও অটো ফরম্যাটার
                  </div>
                </div>
              </Link>
            </div>

            <div style={{
              marginTop: '10px',
              padding: '6px 10px',
              borderRadius: '6px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              fontSize: '0.74rem',
              color: '#64748b',
              textAlign: 'center',
              fontWeight: 500
            }}>
              CSV • Excel (XLSX) • JSON সমর্থিত
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.84rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} JobSolutions BD. সর্বস্বত্ব সংরক্ষিত।
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
