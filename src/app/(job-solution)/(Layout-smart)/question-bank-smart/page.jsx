'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import './style.css';
import { getExamsCatalog, cleanExamTitle } from '../../../../lib/examsData';

// Digits mapping
const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBengaliNumber = (num) => {
  if (num === undefined || num === null) return '০';
  return String(num).replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
};

const toEnglishNumberStr = (str) => {
  const enDigits = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  return String(str || '').replace(/[০-৯]/g, (d) => enDigits[d] || d);
};

const toBengaliNumberStr = (str) => {
  return String(str || '').replace(/[0-9]/g, (d) => BENGALI_DIGITS[d]);
};

// Initial Categories for Question Bank Smart
const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল' },
  { id: 'bcs', label: 'বিসিএস প্রিলি', matchKey: 'bcs' },
  { id: 'bank', label: 'ব্যাংক জবস', matchKey: 'bank' },
  { id: 'primary', label: 'প্রাথমিক শিক্ষক', matchKey: 'primary' },
  { id: 'ntrca', label: 'শিক্ষক নিবন্ধন', matchKey: 'ntrca' },
  { id: 'ministry', label: 'মন্ত্রণালয় ও নন-ক্যাডার', matchKey: 'ministry' },
  { id: 'admission', label: 'ভর্তি পরীক্ষা', matchKey: 'admission' },
  { id: 'subject', label: 'বিষয়ভিত্তিক', matchKey: 'subject' }
];

function QuestionBankSmartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [currentTag, setCurrentTag] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(36);

  // Load Exams Catalog from /data/exams_index.json & map to smart card items
  useEffect(() => {
    let isMounted = true;

    getExamsCatalog()
      .then((catalog) => {
        if (!isMounted) return;
        if (catalog && Array.isArray(catalog.exams) && catalog.exams.length > 0) {
          const mapped = catalog.exams.map((exam) => {
            const rawTitle = cleanExamTitle(exam.title);
            const qCount = exam.question_count || 100;
            const yearStr = exam.year ? String(exam.year) : '';
            const bnYear = yearStr ? toBengaliNumber(yearStr) : '';

            // Calculate display time
            let timeStr = '১ ঘণ্টা';
            if (qCount >= 180) timeStr = '২ ঘণ্টা';
            else if (qCount >= 140) timeStr = '১ ঘণ্টা ৩০ মিনিট';
            else if (qCount <= 50) timeStr = '৩০ মিনিট';

            // Determine category label & tag
            const catId = (exam.category_id || '').toLowerCase();
            let catLabel = 'বিসিএস প্রিলি';
            if (catId.includes('bank')) catLabel = 'ব্যাংক জবস';
            else if (catId.includes('primary')) catLabel = 'প্রাথমিক শিক্ষক';
            else if (catId.includes('ntrca')) catLabel = 'শিক্ষক নিবন্ধন';
            else if (catId.includes('ministry')) catLabel = 'মন্ত্রণালয়';
            else if (catId.includes('admission')) catLabel = 'ভর্তি পরীক্ষা';
            else if (catId.includes('subject')) catLabel = 'বিষয়ভিত্তিক';
            else if (catId.includes('judicial')) catLabel = 'জুডিশিয়ারি';

            // Extract display tag (e.g. 45th, 10th, AD, Step-1)
            let displayTag = '';
            const thMatch = rawTitle.match(/([০-৯0-9]+)\s*(th|তম|st|nd|rd)/i);
            if (thMatch) {
              displayTag = `${toEnglishNumberStr(thMatch[1])}th`;
            } else if (rawTitle.toLowerCase().includes('ad')) {
              displayTag = 'AD';
            } else if (rawTitle.toLowerCase().includes('officer')) {
              displayTag = 'Officer';
            } else if (rawTitle.includes('ধাপ')) {
              const stepMatch = rawTitle.match(/([১-৪1-4])\s*(ম|য়|র্থ)?\s*ধাপ/);
              if (stepMatch) displayTag = `Step-${toEnglishNumberStr(stepMatch[1])}`;
            }

            // Subject breakdown
            let subjectStats = exam.category_name || '';
            if (catId === 'bcs') {
              subjectStats = qCount >= 150
                ? 'বাংলা ৩৫, ইংরেজি ৩৫, গণিত ১৫, বিজ্ঞান ১৫, কম্পিউটার ১৫, সাধারণ জ্ঞান ৫০'
                : 'বাংলা ৪০, ইংরেজি ৪০, সাধারণ জ্ঞান ৮০, গণিত ৪০';
            } else if (catId === 'primary') {
              subjectStats = 'বাংলা ২০, ইংরেজি ২০, গণিত ২০, সাধারণ জ্ঞান ২০';
            } else if (catId === 'bank') {
              subjectStats = 'English 25, Math 25, Bangla 20, GK 20, ICT 10';
            } else if (catId === 'ntrca') {
              subjectStats = 'বাংলা ২৫, ইংরেজি ২৫, গণিত ২৫, সাধারণ জ্ঞান ২৫';
            }

            const tags = [
              exam.category_id,
              catLabel,
              displayTag,
              yearStr,
              bnYear,
              rawTitle,
              toEnglishNumberStr(rawTitle)
            ].filter(Boolean);

            return {
              id: exam.slug || exam.id,
              slug: exam.slug || exam.id,
              year: rawTitle,
              category: catLabel,
              categoryId: catId,
              date: bnYear || '২০২৪',
              yearAD: yearStr,
              totalQ: qCount,
              time: timeStr,
              subjectStats: subjectStats,
              status: 'সম্পূর্ণ সমাধানসহ উপলব্ধ',
              tags: tags,
              displayTag: displayTag || (yearStr ? `${yearStr}` : '')
            };
          });

          setBankData(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching question bank catalog:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Categories with live counts
  const categoriesWithCounts = useMemo(() => {
    return DEFAULT_CATEGORIES.map((cat) => {
      let count = 0;
      if (cat.id === 'All') {
        count = bankData.length;
      } else {
        count = bankData.filter((item) => {
          return item.categoryId === cat.matchKey || item.category === cat.label;
        }).length;
      }
      return { ...cat, count };
    });
  }, [bankData]);

  // Search & Filter Algorithm matching exact TopMCQBD engine
  const filteredData = useMemo(() => {
    return bankData.filter((item) => {
      const matchCat =
        currentTag === 'All' ||
        item.categoryId === currentTag ||
        item.category === currentTag ||
        (currentTag === 'bcs' && item.categoryId === 'bcs') ||
        (currentTag === 'bank' && item.categoryId === 'bank') ||
        (currentTag === 'primary' && item.categoryId === 'primary') ||
        (currentTag === 'ntrca' && item.categoryId === 'ntrca') ||
        (currentTag === 'ministry' && item.categoryId === 'ministry') ||
        (currentTag === 'admission' && item.categoryId === 'admission') ||
        (currentTag === 'subject' && item.categoryId === 'subject');

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCat;

      const qBn = toBengaliNumberStr(q);
      const qClean = q.replace(/[-_\s]/g, '');
      const qSpaced = q.replace(/[-_]/g, ' ');
      const itemYearEn = toEnglishNumberStr(item.year).toLowerCase();
      const itemDateEn = toEnglishNumberStr(item.date).toLowerCase();

      const cleanNumQuery = q.replace(/(st|nd|rd|th)/g, '');
      const cleanNumQueryNoSymbol = cleanNumQuery.replace(/[-_\s]/g, '');

      const checkMatch = (targetStr) => {
        if (!targetStr) return false;
        const str = String(targetStr).toLowerCase();
        const strClean = str.replace(/[-_\s]/g, '');
        const strSpaced = str.replace(/[-_]/g, ' ');

        return (
          str.includes(q) ||
          str.includes(qBn) ||
          str.includes(qSpaced) ||
          strClean.includes(qClean) ||
          (cleanNumQuery && strClean.includes(cleanNumQueryNoSymbol))
        );
      };

      const textMatch =
        checkMatch(item.year) ||
        checkMatch(itemYearEn) ||
        checkMatch(item.date) ||
        checkMatch(itemDateEn) ||
        checkMatch(item.category) ||
        checkMatch(item.displayTag) ||
        checkMatch(item.subjectStats) ||
        (item.tags && item.tags.some((t) => checkMatch(t)));

      return matchCat && textMatch;
    });
  }, [bankData, currentTag, searchQuery]);

  // Slice visible items
  const visibleItems = useMemo(() => {
    return filteredData.slice(0, visibleCount);
  }, [filteredData, visibleCount]);

  // Chip click handler
  const handleChipClick = (val) => {
    if (!val) return;
    setSearchQuery(val);
    setVisibleCount(36);
  };

  // Navigate directly to explanation or exam without popup
  const handleExamAction = (action, item) => {
    const targetSlug = item.slug || item.id;
    const modeParam = action === 'exam' ? 'exam' : 'read';
    router.push(`/question-bank-smart-questions/?exam=${encodeURIComponent(targetSlug)}&mode=${modeParam}`);
  };

  return (
    <div className="qb-demo-wrapper">
      <div className="qb-container">
        {/* Header Section */}
        <div className="header-section">
          <span className="badge-archive">
            <i className="fa-solid fa-book-open"></i>
            <span>প্রশ্নব্যাংক আর্কাইভ</span>
          </span>
          <h1 className="title-main">
            বিগত সালের প্রশ্ন ও নির্ভুল ব্যাখ্যা
          </h1>
          <p className="desc-sub">
            বিসিএস, ব্যাংক, প্রাথমিক শিক্ষক ও NTRCA শিক্ষক নিবন্ধন পরীক্ষার বিগত প্রশ্ন সমাধান পড়ুন অথবা সরাসরি পরীক্ষা দিন।
          </p>
        </div>

        {/* Filters & Search Control Card */}
        <div className="filter-control-card">
          {/* Category Filter Pills */}
          <div className="pills-group" id="pillsGroup">
            {categoriesWithCounts.map((cat) => {
              const isActive = currentTag === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`filter-btn ${isActive ? 'active' : 'inactive'}`}
                  onClick={() => {
                    setCurrentTag(cat.id);
                    setVisibleCount(36);
                  }}
                >
                  <span>{cat.label}</span>
                  <span className="count-badge">{toBengaliNumber(cat.count)}</span>
                </button>
              );
            })}
          </div>

          {/* Real-Time Search Box */}
          <div className="search-box-wrapper">
            <input
              type="text"
              className="search-input"
              id="searchInput"
              placeholder="খুঁজুন (যেমন: 50th, BCS, 2024, ব্যাংক)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(36);
              }}
              autoComplete="off"
            />
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '42px',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px'
                }}
                title="মুছুন"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '28px', color: '#007bff', marginBottom: '14px' }}></i>
            <p style={{ fontWeight: 600, fontSize: '15px' }}>প্রশ্নব্যাংক লোড হচ্ছে...</p>
          </div>
        )}

        {/* Question Bank Cards Grid */}
        {!loading && filteredData.length > 0 && (
          <div className="cards-grid-layout" id="cardsGridLayout">
            {visibleItems.map((item) => {
              return (
                <div key={item.id} className="hub-card-item" data-id={item.id}>
                  <div>
                    {/* Header Chips with Search Tags */}
                    <div className="card-header-badges">
                      <span
                        className="category-chip"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChipClick(item.category);
                        }}
                        title="ক্লিক করে এই ক্যাটাগরিতে সার্চ করুন"
                      >
                        {item.category}
                      </span>
                      {item.displayTag && (
                        <span
                          className="tag-chip"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChipClick(item.displayTag);
                          }}
                          title="ক্লিক করে এই পদ/ব্যাচে সার্চ করুন"
                        >
                          {item.displayTag}
                        </span>
                      )}
                      {item.date && (
                        <span
                          className="tag-chip"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChipClick(item.yearAD || item.date);
                          }}
                          title="ক্লিক করে এই সালে সার্চ করুন"
                        >
                          {item.yearAD || item.date}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="card-exam-title">{item.year}</h3>

                    {/* Subject Breakdown Box */}
                    <div className="subject-breakdown-box">
                      {item.subjectStats}
                    </div>
                  </div>

                  <div>
                    {/* Meta Stats Row */}
                    <div className="meta-stats-row">
                      <span><strong>প্রশ্ন:</strong> {toBengaliNumber(item.totalQ)} টি</span>
                      <span><strong>সময়:</strong> {item.time}</span>
                      <span><strong>সাল:</strong> {item.date}</span>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="card-buttons-flex">
                      <button
                        type="button"
                        className="btn-read-solution"
                        onClick={() => handleExamAction('read', item)}
                        title="প্রশ্নব্যাংক সমাধান পড়ুন"
                      >
                        <i className="fa-regular fa-folder-open"></i> <span>ব্যাখ্যা পড়ুন</span>
                      </button>
                      <button
                        type="button"
                        className="btn-start-exam"
                        onClick={() => handleExamAction('exam', item)}
                        title="পরীক্ষা দিন"
                      >
                        <span>পরীক্ষা দিন</span> <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {!loading && filteredData.length > visibleCount && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 36)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                color: '#007bff',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#eff6ff';
                e.currentTarget.style.borderColor = '#93c5fd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              <span>আরো পরীক্ষা দেখুন ({toBengaliNumber(filteredData.length - visibleCount)} টি বাকি)</span>
              <i className="fa-solid fa-angle-down"></i>
            </button>
          </div>
        )}

        {/* No Data Box */}
        {!loading && filteredData.length === 0 && (
          <div className="no-data-box" id="noDataBox" style={{ display: 'block', textAlign: 'center', padding: '50px 20px' }}>
            <p style={{ fontSize: '1.15rem', color: '#64748b', margin: 0, fontWeight: 600 }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '6px', color: '#f59e0b' }}></i> কোনো প্রশ্নব্যাংক পাওয়া যায়নি।
            </p>
            <button
              type="button"
              onClick={() => {
                setCurrentTag('All');
                setSearchQuery('');
              }}
              style={{
                marginTop: '16px',
                padding: '8px 18px',
                borderRadius: '8px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuestionBankSmartPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '32px', color: '#007bff' }}></i>
        <p style={{ marginTop: '16px', fontWeight: 600 }}>লোড হচ্ছে...</p>
      </div>
    }>
      <QuestionBankSmartContent />
    </Suspense>
  );
}
