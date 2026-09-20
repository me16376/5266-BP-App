'use client';

import React from 'react';

export default function AnnouncementBar() {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #064e3b 0%, #047857 40%, #059669 75%, #0e7490 100%)',
      color: '#ffffff',
      borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
      position: 'relative',
      zIndex: 60,
      fontSize: '0.84rem',
      boxShadow: '0 2px 8px rgba(4, 120, 87, 0.18)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '8px',
        paddingBottom: '8px',
        textAlign: 'center'
      }}>
        {/* Text Message Only */}
        <span style={{
          color: '#f0fdf4',
          fontWeight: 500,
          fontSize: '0.87rem',
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          এই ওয়েবসাইটটি কোনো পাবলিক ওয়েবসাইট নয়, এটি ব্যক্তিগত অনুশীলন ও স্টাডি আর্কাইভের ওয়েবসাইট। এখানকার কনটেন্ট ও প্রশ্নাবলি কপিরাইট সংরক্ষিত।
        </span>
      </div>
    </div>
  );
}
