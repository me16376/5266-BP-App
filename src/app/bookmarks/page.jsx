'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bookmark, 
  Trash2, 
  History
} from 'lucide-react';
import QuestionCard from '../../components/QuestionCard';
import { getBookmarks, getTestHistory } from '../../lib/storage';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('bookmarks');

  useEffect(() => {
    setBookmarks(getBookmarks());
    setHistory(getTestHistory());
  }, []);

  const clearAllBookmarks = () => {
    if (confirm('আপনি কি নিশ্চিত যে সকল সংরক্ষিত বুকমার্ক মুছে ফেলতে চান?')) {
      localStorage.removeItem('ujs_bookmarks');
      setBookmarks([]);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-amber">
              <Bookmark size={12} fill="#b45309" /> ব্যক্তিগত লাইব্রেরি
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            সংরক্ষিত প্রশ্ন ও পরীক্ষার রেকর্ড
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem' }}>
            পড়ার সময় বুকমার্ক করা গুরুত্বপূর্ণ প্রশ্নমালা এবং বিগত মডেল টেস্টের ফলাফল দেখুন।
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '28px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px'
        }}>
          <button
            onClick={() => setActiveTab('bookmarks')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              border: activeTab === 'bookmarks' ? 'none' : '1px solid #cbd5e1',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              background: activeTab === 'bookmarks' ? 'var(--gradient-brand)' : '#ffffff',
              color: activeTab === 'bookmarks' ? '#ffffff' : '#475569',
              boxShadow: activeTab === 'bookmarks' ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none'
            }}
          >
            <Bookmark size={16} />
            <span>বুকমার্ক করা প্রশ্ন ({bookmarks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              border: activeTab === 'history' ? 'none' : '1px solid #cbd5e1',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              background: activeTab === 'history' ? 'var(--gradient-brand)' : '#ffffff',
              color: activeTab === 'history' ? '#ffffff' : '#475569',
              boxShadow: activeTab === 'history' ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none'
            }}
          >
            <History size={16} />
            <span>মডেল টেস্টের ইতিহাস ({history.length})</span>
          </button>
        </div>

        {/* Tab 1: Bookmarks */}
        {activeTab === 'bookmarks' && (
          <div>
            {bookmarks.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button
                  onClick={clearAllBookmarks}
                  className="btn-danger"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
                >
                  <Trash2 size={14} />
                  <span>সকল বুকমার্ক মুছুন</span>
                </button>
              </div>
            )}

            {bookmarks.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff' }}>
                <Bookmark size={44} color="var(--text-muted)" style={{ margin: '0 auto 14px' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '6px' }}>
                  এখনও কোনো প্রশ্ন বুকমার্ক করেননি
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  যেকোনো পরীক্ষা প্র্যাকটিস করার সময় বুকমার্ক আইকনটিতে ক্লিক করলে তা এখানে জমা থাকবে।
                </p>
                <Link href="/exams" className="btn-primary">
                  প্রশ্নব্যাংক এক্সপ্লোর করুন
                </Link>
              </div>
            ) : (
              <div>
                {bookmarks.map((q, idx) => (
                  <QuestionCard
                    key={q.id || idx}
                    question={q}
                    index={idx}
                    mode="practice"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Test History */}
        {activeTab === 'history' && (
          <div>
            {history.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff' }}>
                <History size={44} color="var(--text-muted)" style={{ margin: '0 auto 14px' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '6px' }}>
                  এখনও কোনো মডেল টেস্ট দেননি
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  টাইমার সহ মডেল টেস্ট দিয়ে আপনার প্রস্তুতি যাচাই করুন।
                </p>
                <Link href="/file-exam" className="btn-primary">
                  মডেল টেস্ট শুরু করুন
                </Link>
              </div>
            ) : (
              <div className="glass-panel" style={{ overflowX: 'auto', background: '#ffffff' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '14px 18px', textAlign: 'left', color: '#475569', fontWeight: 700 }}>পরীক্ষার নাম</th>
                      <th style={{ padding: '14px 18px', textAlign: 'left', color: '#475569', fontWeight: 700 }}>তারিখ</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center', color: '#475569', fontWeight: 700 }}>প্রাপ্ত নম্বর</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center', color: '#475569', fontWeight: 700 }}>সঠিক / ভুল</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center', color: '#475569', fontWeight: 700 }}>সঠিকতার হার</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0f172a' }}>
                          {item.examTitle || 'Model Test'}
                        </td>
                        <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          {new Date(item.date).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 800, color: '#059669' }}>
                          {item.marks.toFixed(2)} / {item.total}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <span style={{ color: '#059669', fontWeight: 600 }}>{item.correct}</span> / <span style={{ color: '#e11d48', fontWeight: 600 }}>{item.wrong}</span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 700, color: item.accuracy >= 60 ? '#059669' : '#d97706' }}>
                          {item.accuracy.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
