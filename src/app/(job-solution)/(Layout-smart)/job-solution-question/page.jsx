'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  BookOpen, 
  Search, 
  BrainCircuit, 
  Clock, 
  ArrowLeft, 
  Layers, 
  CheckCircle2, 
  Flame,
  FileQuestion,
  ChevronRight
} from 'lucide-react';

export default function JobSolutionQuestionComingSoonPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hind Siliguri", "Noto Sans Bengali", sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navbar Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link 
            href="/job-solution" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#f1f5f9',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <ArrowLeft size={16} />
            <span>সকল প্রশ্ন ব্যাংকে ফিরুন</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.78rem',
              padding: '3px 9px',
              borderRadius: '6px'
            }}>5266 AI</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
              Smart Question Engine
            </span>
          </div>
        </div>
      </header>

      {/* Main Hero & Coming Soon Container */}
      <main style={{
        flex: 1,
        maxWidth: '960px',
        margin: '0 auto',
        padding: '48px 20px 60px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Animated Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '30px',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#047857',
          fontSize: '0.84rem',
          fontWeight: 700,
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'inline-block'
          }}></span>
          <span>শীঘ্রই উন্মোচিত হচ্ছে • Coming Soon</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.6rem)',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.5px',
          lineHeight: 1.3,
          marginBottom: '16px',
          maxWidth: '750px'
        }}>
          প্রশ্নভিত্তিক জব সল্যুশন{' '}
          <span style={{
            background: 'linear-gradient(135deg, #059669, #0284c7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            (Job Solution by Questions)
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.05rem',
          color: '#64748b',
          lineHeight: 1.7,
          maxWidth: '680px',
          marginBottom: '40px'
        }}>
          বিসিএস, ব্যাংক, প্রাথমিক শিক্ষক ও বিভিন্ন নিয়োগ পরীক্ষার ২ লক্ষ ৫০ হাজারেরও বেশি প্রশ্নকে বিষয়, অধ্যায় ও টপিক অনুযায়ী আলাদাভাবে ফিল্টার করে সহজে অনুশীলনের আধুনিক স্মার্ট ইঞ্জিন।
        </p>

        {/* Feature Preview Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          width: '100%',
          marginBottom: '48px',
          textAlign: 'left'
        }}>
          {/* Card 1 */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              বিষয় ও অধ্যায়ভিত্তিক বিন্যাস
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
              বাংলা, ইংরেজি, গণিত, সাধারণ জ্ঞান ও বিজ্ঞানের প্রতিটি অধ্যায় অনুযায়ী প্রশ্ন আলাদা করে বাছাই করার সুবিধা।
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Flame size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              রিপিট ও গুরুত্বপূর্ণ প্রশ্ন অ্যানালাইসিস
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
              কোন প্রশ্নটি বিগত কতগুলো পরীক্ষায় এসেছে এবং সর্বাধিক রিপিট হওয়া হট টপিকগুলো এক নজরে দেখার স্মার্ট ফিচার।
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <BrainCircuit size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              তাৎক্ষণিক AI সমাধান ও শর্টকাট
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
              5266 AI এক্সটেনশনের সাহায্যে প্রতিটি প্রশ্নের সঠিক যুক্তি, অপশন বিশ্লেষণ ও মনে রাখার শর্টকাট কৌশল।
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px'
        }}>
          <Link
            href="/job-solution"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              transition: 'transform 0.15s ease'
            }}
          >
            <BookOpen size={18} />
            <span>সকল পরীক্ষা ব্রাউজ করুন (২,১৫৪টি)</span>
          </Link>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontSize: '0.95rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span>হোমে যান</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '20px',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: '#64748b'
      }}>
        © 5266-BP App • সকল চাকরির পরীক্ষার আধুনিক প্রস্তুতি প্ল্যাটফর্ম
      </footer>
    </div>
  );
}
