'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Sparkles, 
  Code,
  Copy,
  Check,
  Palette,
  Maximize2,
  X,
  FileImage,
  Layers
} from 'lucide-react';
import { quizVectorList } from './vectorData';

export default function GraphImagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('সব ছবি');
  const [bgTheme, setBgTheme] = useState('white'); // 'white', 'slate', 'dark'
  const [openCodeMap, setOpenCodeMap] = useState({}); // track open code snippets per item
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [activeModalItem, setActiveModalItem] = useState(null);

  // Categories
  const categories = useMemo(() => {
    const set = new Set();
    quizVectorList.forEach(item => set.add(item.category));
    return ['সব ছবি', ...Array.from(set)];
  }, []);

  // Filtered list
  const filteredList = useMemo(() => {
    return quizVectorList.filter(item => {
      const matchCat = selectedCategory === 'সব ছবি' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term || 
        item.filename.toLowerCase().includes(term) ||
        item.qid.includes(term) ||
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.exam.toLowerCase().includes(term) ||
        item.subject.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Handle Copy Code
  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Toggle code snippet
  const toggleCode = (id) => {
    setOpenCodeMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Canvas background style helper for vector box
  const getVectorCanvasStyle = () => {
    if (bgTheme === 'slate') {
      return { 
        background: '#f1f5f9', 
        border: '1.5px solid #cbd5e1', 
        color: '#0f172a' 
      };
    }
    if (bgTheme === 'dark') {
      return { 
        background: '#0f172a', 
        border: '1.5px solid #334155', 
        color: '#f8fafc' 
      };
    }
    return { 
      background: '#ffffff', 
      border: '1.5px solid #e2e8f0', 
      color: '#0f172a' 
    };
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f1f5f9', 
      padding: '24px 16px 80px',
      fontFamily: "var(--font-sans, 'Kalpurush', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif)",
      color: '#0f172a'
    }}>
      {/* STRICT MAX-WIDTH 1300PX CONTAINER */}
      <div style={{ 
        maxWidth: '1300px', 
        margin: '0 auto', 
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontSize: '0.88rem', 
          color: '#64748b', 
          marginBottom: '16px' 
        }}>
          <Link href="/" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>হোম</Link>
          <span>/</span>
          <Link href="/job-solution" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>জব সল্যুশন</Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 700 }}>গ্রাফ ও ভেক্টর ইমেজ তুলনা</span>
        </div>

        {/* HERO HEADER BANNER (Light / White Theme - Max-Width 1300px) */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '28px 24px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          marginBottom: '20px',
          border: '1.5px solid #cbd5e1'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '10px'
              }}>
                <Sparkles style={{ width: '14px', height: '14px', color: '#059669' }} />
                সর্বোচ্চ প্রস্থ: ১৩০০ পিক্সেল (Max-Width: 1300px)
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.01em', lineHeight: 1.25, color: '#0f172a' }}>
                কুইজ ইমেজ বনাম ইনলাইন ভেক্টর ও ম্যাথ কোড তুলনা
              </h1>
              <p style={{ color: '#475569', fontSize: '0.96rem', margin: 0, lineHeight: 1.6, maxWidth: '820px' }}>
                নিচের টেবিলে <strong>বাম কলামে মূল ছবি (Original Image)</strong> এবং <strong>ডান কলামে ইনলাইন ভেক্টর ও ম্যাথ কোড</strong> পাশাপাশি তুলনা করে দেখুন।
              </p>
            </div>
          </div>

          {/* Quick Stat Cards in Light White/Slate Style */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            borderTop: '1px solid #e2e8f0',
            paddingTop: '18px'
          }}>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', fontWeight: 600 }}>মোট কুইজ ইমেজ</span>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#059669' }}>৪৬ টি</span>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', fontWeight: 600 }}>সম্পর্কিত প্রশ্ন সংখ্যা</span>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0284c7' }}>২৮ টি</span>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', fontWeight: 600 }}>ভেক্টর রূপান্তর স্কোর</span>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#d97706' }}>১০০% নিখুঁত</span>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', fontWeight: 600 }}>পৃষ্ঠার সর্বোচ্চ সাইজ</span>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#4f46e5' }}>1300px</span>
            </div>
          </div>
        </div>

        {/* SEARCH, CATEGORY & CONTROLS */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid #cbd5e1',
          marginBottom: '20px'
        }}>
          {/* Top row: Search + Canvas Theme */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search style={{ width: '18px', height: '18px', color: '#94a3b8', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="প্রশ্ন আইডি (QID), ফাইলের নাম বা বিষয় দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 38px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              )}
            </div>

            {/* Canvas Color Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f1f5f9',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.85rem'
            }}>
              <Palette style={{ width: '15px', height: '15px', color: '#475569' }} />
              <span style={{ color: '#475569', fontWeight: 700 }}>ভেক্টর ব্যাকগ্রাউন্ড:</span>
              <button
                onClick={() => setBgTheme('white')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: bgTheme === 'white' ? '#ffffff' : 'transparent',
                  fontWeight: bgTheme === 'white' ? 700 : 500,
                  color: bgTheme === 'white' ? '#0f172a' : '#64748b',
                  boxShadow: bgTheme === 'white' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.82rem'
                }}
              >
                সাদা
              </button>
              <button
                onClick={() => setBgTheme('slate')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: bgTheme === 'slate' ? '#ffffff' : 'transparent',
                  fontWeight: bgTheme === 'slate' ? 700 : 500,
                  color: bgTheme === 'slate' ? '#0f172a' : '#64748b',
                  boxShadow: bgTheme === 'slate' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.82rem'
                }}
              >
                ছাই
              </button>
              <button
                onClick={() => setBgTheme('dark')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: bgTheme === 'dark' ? '#0f172a' : 'transparent',
                  fontWeight: bgTheme === 'dark' ? 700 : 500,
                  color: bgTheme === 'dark' ? '#ffffff' : '#64748b',
                  boxShadow: bgTheme === 'dark' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.82rem'
                }}
              >
                ডার্ক
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, flexShrink: 0 }}>
              ক্যাটাগরি:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = cat === 'সব ছবি' ? quizVectorList.length : quizVectorList.filter(i => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: isSelected ? '1px solid #059669' : '1px solid #e2e8f0',
                    background: isSelected ? '#059669' : '#f8fafc',
                    color: isSelected ? '#ffffff' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* TABLE RESULTS BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem', color: '#475569', marginBottom: '10px', padding: '0 4px' }}>
          <span>
            মোট <strong style={{ color: '#0f172a' }}>{filteredList.length}</strong> টি ছবি ও ভেক্টর প্রদর্শিত হচ্ছে
          </span>
          <span style={{ color: '#047857', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#059669' }} />
            বাম পাশে ছবি এবং ডান পাশে ভেক্টর গ্রাফ ও কোড
          </span>
        </div>

        {/* COMPARISON TABLE (MAX-WIDTH 1300PX) */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          marginBottom: '32px'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              textAlign: 'left',
              minWidth: '760px',
              tableLayout: 'fixed'
            }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ 
                    padding: '14px 8px', 
                    width: '45px', 
                    textAlign: 'center', 
                    fontSize: '0.82rem', 
                    fontWeight: 700, 
                    color: '#64748b',
                    borderRight: '1px solid #cbd5e1'
                  }}>
                    #
                  </th>
                  <th style={{ 
                    padding: '14px 20px', 
                    width: '47%', 
                    background: '#fef3c7', 
                    color: '#92400e', 
                    fontSize: '0.96rem', 
                    fontWeight: 800,
                    borderRight: '2px solid #cbd5e1'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileImage style={{ width: '19px', height: '19px' }} />
                      বামে: মূল ছবি (Original Image)
                    </div>
                  </th>
                  <th style={{ 
                    padding: '14px 20px', 
                    width: '51%', 
                    background: '#d1fae5', 
                    color: '#065f46', 
                    fontSize: '0.96rem', 
                    fontWeight: 800 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles style={{ width: '19px', height: '19px' }} />
                      ডানে: ইনলাইন ভেক্টর গ্রাফ ও ম্যাথ কোড (Vector & Math Code)
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item, idx) => {
                  const isCodeOpen = !!openCodeMap[item.id];
                  const isCopied = copiedCodeId === item.id;
                  const rowBg = idx % 2 === 0 ? '#ffffff' : '#fcfcfd';

                  return (
                    <tr 
                      key={item.id} 
                      style={{ 
                        background: rowBg, 
                        borderBottom: '1.5px solid #e2e8f0'
                      }}
                    >
                      {/* # Serial Column */}
                      <td style={{ 
                        padding: '18px 8px', 
                        textAlign: 'center', 
                        fontSize: '0.82rem', 
                        color: '#64748b', 
                        fontWeight: 700,
                        verticalAlign: 'top',
                        fontFamily: 'monospace',
                        borderRight: '1px solid #e2e8f0'
                      }}>
                        {idx + 1}
                      </td>

                      {/* LEFT COLUMN: ORIGINAL IMAGE */}
                      <td style={{ 
                        padding: '20px', 
                        verticalAlign: 'top', 
                        borderRight: '2px solid #cbd5e1',
                        boxSizing: 'border-box'
                      }}>
                        {/* Image Preview Box (Controlled Fixed Dimensions) */}
                        <div style={{
                          background: '#ffffff',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          padding: '12px',
                          textAlign: 'center',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                          marginBottom: '12px',
                          height: '180px',
                          maxWidth: '280px',
                          margin: '0 auto 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          <img
                            src={`/images/quiz/${item.filename}`}
                            alt={item.title}
                            style={{
                              maxHeight: '160px',
                              maxWidth: '100%',
                              objectFit: 'contain',
                              display: 'block'
                            }}
                            loading="lazy"
                          />
                        </div>

                        {/* Meta Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '8px', justifyContent: 'center' }}>
                          <span style={{ 
                            background: '#e0e7ff', 
                            color: '#3730a3', 
                            padding: '3px 8px', 
                            borderRadius: '5px', 
                            fontSize: '0.78rem', 
                            fontWeight: 700,
                            fontFamily: 'monospace' 
                          }}>
                            QID: {item.qid}
                          </span>
                          <span style={{ 
                            background: '#f1f5f9', 
                            color: '#334155', 
                            padding: '3px 8px', 
                            borderRadius: '5px', 
                            fontSize: '0.78rem', 
                            fontWeight: 600 
                          }}>
                            {item.subject}
                          </span>
                          <span style={{ 
                            background: '#fef3c7', 
                            color: '#92400e', 
                            padding: '3px 8px', 
                            borderRadius: '5px', 
                            fontSize: '0.78rem', 
                            fontWeight: 600 
                          }}>
                            {item.category}
                          </span>
                        </div>

                        {/* Title & File Info */}
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace', marginBottom: '6px', wordBreak: 'break-all' }}>
                            ফাইল: {item.filename}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '10px' }}>
                            {item.exam}
                          </div>

                          <button
                            onClick={() => setActiveModalItem(item)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              color: '#4338ca',
                              padding: '5px 12px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <Maximize2 style={{ width: '13px', height: '13px' }} />
                            বড় স্ক্রিনে দেখুন
                          </button>
                        </div>
                      </td>

                      {/* RIGHT COLUMN: INLINE VECTOR & MATH CODE */}
                      <td style={{ 
                        padding: '20px', 
                        verticalAlign: 'top',
                        boxSizing: 'border-box'
                      }}>
                        {/* Top: Rendered Vector Preview (Bounded to same height) */}
                        <div style={{
                          ...getVectorCanvasStyle(),
                          borderRadius: '10px',
                          padding: '12px',
                          textAlign: 'center',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                          marginBottom: '12px',
                          height: '180px',
                          maxWidth: '280px',
                          margin: '0 auto 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: '100%', 
                            height: '100%',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}>
                            {item.renderVector()}
                          </div>
                        </div>

                        {/* Status Bar: Match Badge + Code Toggle Button */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          <span style={{ 
                            background: '#ecfdf5', 
                            border: '1px solid #a7f3d0', 
                            color: '#065f46', 
                            padding: '4px 10px', 
                            borderRadius: '999px', 
                            fontSize: '0.8rem', 
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981' }} />
                            {item.fidelity}
                          </span>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handleCopyCode(item.id, item.codeSnippet)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: isCopied ? '#ecfdf5' : '#f8fafc',
                                border: isCopied ? '1px solid #10b981' : '1px solid #cbd5e1',
                                color: isCopied ? '#065f46' : '#334155',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                              title="কোড কপি করুন"
                            >
                              {isCopied ? <Check style={{ width: '13px', height: '13px', color: '#10b981' }} /> : <Copy style={{ width: '13px', height: '13px' }} />}
                              {isCopied ? 'কপি সম্পন্ন!' : 'কোড কপি'}
                            </button>

                            <button
                              onClick={() => toggleCode(item.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: isCodeOpen ? '#059669' : '#f1f5f9',
                                border: isCodeOpen ? '1px solid #047857' : '1px solid #cbd5e1',
                                color: isCodeOpen ? '#ffffff' : '#065f46',
                                padding: '5px 12px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              <Code style={{ width: '13px', height: '13px' }} />
                              {isCodeOpen ? 'কোড লুকান' : 'কোড দেখুন'}
                            </button>
                          </div>
                        </div>

                        {/* Geometric / Math Logic Note */}
                        <div style={{
                          background: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          padding: '10px 14px',
                          fontSize: '0.86rem',
                          color: '#334155',
                          lineHeight: 1.55,
                          marginBottom: '10px'
                        }}>
                          <strong style={{ color: '#0f172a' }}>ব্যাখ্যা ও সমাধান:</strong> {item.description}
                        </div>

                        {/* EXPANDABLE RAW CODE SNIPPET (SVG / KaTeX / HTML) */}
                        {isCodeOpen && (
                          <div style={{
                            background: '#f8fafc',
                            borderRadius: '8px',
                            border: '1.5px solid #cbd5e1',
                            padding: '12px 14px',
                            color: '#0f172a',
                            fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                            fontSize: '0.78rem',
                            lineHeight: 1.45,
                            overflowX: 'auto',
                            maxHeight: '220px',
                            overflowY: 'auto'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                              <span style={{ color: '#475569', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                                ইনলাইন ভেক্টর / ম্যাথ কোড (SVG)
                              </span>
                              <button
                                onClick={() => handleCopyCode(item.id, item.codeSnippet)}
                                style={{
                                  background: '#ffffff',
                                  border: '1px solid #cbd5e1',
                                  color: '#059669',
                                  padding: '3px 10px',
                                  borderRadius: '5px',
                                  fontSize: '0.74rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                {isCopied ? 'কপি হয়েছে!' : 'কপি করুন'}
                              </button>
                            </div>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#1e293b' }}>
                              {item.codeSnippet}
                            </pre>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty Search Result */}
        {filteredList.length === 0 && (
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
            marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: '0 0 8px' }}>কোন মিল পাওয়া যায়নি</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>
              আপনার অনুসন্ধান অনুযায়ী কোনো কুইজ ইমেজ বা ভেক্টর পাওয়া যায়নি।
            </p>
            <button
              onClick={() => { setSelectedCategory('সব ছবি'); setSearchTerm(''); }}
              style={{
                padding: '8px 20px',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        )}

        {/* FOOTER SUMMARY & NEXT STEPS */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '24px 28px',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '999px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '6px'
            }}>
              <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981' }} />
              পরবর্তী পদক্ষেপ
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>
              তুলনা সম্পন্ন হলে আপনার মতামত জানান
            </h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              সবগুলো ভেক্টর ও কোড পরীক্ষা করে কোনোটিতে কোনো পরিবর্তন প্রয়োজন কি না জানাবেন। আপনার নির্দেশ পেলেই 
              আমরা মূল প্রশ্ন ডেটাসেটে (<code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace' }}>public/data/job-solution/</code>) 
              রাস্টার ছবির বদলে এই ইনলাইন ভেক্টর কোডগুলো যুক্ত করে দেব।
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              href="/job-solution"
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: '#ffffff'
              }}
            >
              জব সল্যুশনে ফিরুন
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#059669',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
              }}
            >
              উপরে যান
            </button>
          </div>
        </div>

      </div>

      {/* FULLSCREEN SIDE-BY-SIDE MODAL */}
      {activeModalItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '960px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #cbd5e1'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace' }}>
                    QID: {activeModalItem.qid}
                  </span>
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {activeModalItem.category}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px'
                }}
              >
                <X style={{ width: '22px', height: '22px' }} />
              </button>
            </div>

            {/* Modal Body: Large Side-by-side */}
            <div style={{ padding: '20px', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                {/* Left: Original Image */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-block',
                    background: '#fef3c7',
                    color: '#92400e',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    marginBottom: '8px'
                  }}>
                    মূল ছবি (Original Image)
                  </div>
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1.5px solid #e2e8f0',
                    padding: '16px',
                    height: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src={`/images/quiz/${activeModalItem.filename}`}
                      alt={activeModalItem.title}
                      style={{ maxHeight: '220px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace', marginTop: '6px' }}>
                    {activeModalItem.filename}
                  </div>
                </div>

                {/* Right: Inline Vector */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-block',
                    background: '#d1fae5',
                    color: '#065f46',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    marginBottom: '8px'
                  }}>
                    ইনলাইন ভেক্টর (Crisp Vector)
                  </div>
                  <div style={{
                    ...getVectorCanvasStyle(),
                    borderRadius: '10px',
                    padding: '16px',
                    height: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {activeModalItem.renderVector()}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, marginTop: '6px' }}>
                    রেজোলিউশন ইন্ডিপেন্ডেন্ট
                  </div>
                </div>
              </div>

              {/* Description & Solution */}
              <div style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '12px 14px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                  গাণিতিক ও জ্যামিতিক লজিক:
                </div>
                <div style={{ fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.55 }}>
                  {activeModalItem.description}
                </div>
              </div>

              {/* Code Snippet Box */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                padding: '12px',
                color: '#0f172a',
                fontFamily: "Consolas, Monaco, monospace",
                fontSize: '0.76rem',
                maxHeight: '160px',
                overflowY: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.74rem', fontWeight: 700, marginBottom: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
                  <span>ইনলাইন ভেক্টর সোর্স কোড</span>
                  <button
                    onClick={() => handleCopyCode(activeModalItem.id, activeModalItem.codeSnippet)}
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#059669', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    {copiedCodeId === activeModalItem.id ? 'কপি হয়েছে!' : 'কপি করুন'}
                  </button>
                </div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#1e293b' }}>
                  {activeModalItem.codeSnippet}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
              <button
                onClick={() => setActiveModalItem(null)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
