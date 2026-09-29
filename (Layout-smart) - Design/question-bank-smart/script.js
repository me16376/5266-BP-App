/**
 * TopMCQBD - Question Bank Smart Standalone JavaScript Logic
 * 100% Identical Feature Set, Dual Search, Category Filters, Chips & Question Bank Cards
 */

(function () {
  'use strict';

  // --- Helper Functions ---
  const toBengaliNumber = (num) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).split('').map((d) => bnDigits[parseInt(d)] || d).join('');
  };

  const toBengaliNumberStr = (str) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(str).replace(/[0-9]/g, (d) => bnDigits[parseInt(d)]);
  };

  const toEnglishNumberStr = (str) => {
    const enDigits = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return String(str).replace(/[০-৯]/g, (d) => enDigits[d] || d);
  };

  // --- Default Question Bank Generators (100% zero-setup fallback) ---
  const generateBcsExams = () => {
    const list = [];
    for (let i = 50; i >= 10; i--) {
      const bnNum = toBengaliNumber(i);
      const suffix = (i === 10) ? 'ম' : 'তম';
      let yearAD = 2026 - (48 - i);
      if (i <= 10) yearAD = 1989;
      const bnYear = toBengaliNumber(yearAD);

      list.push({
        id: `bcs-${i}`,
        year: `${bnNum}${suffix} বিসিএস প্রিলিমিনারি পরীক্ষা`,
        category: "BCS",
        date: bnYear,
        totalQ: 200,
        time: "২ ঘণ্টা",
        subjectStats: i >= 35
          ? "বাংলা ৩৫, ইংরেজি ৩৫, গণিত ১৫, বিজ্ঞান ১৫, কম্পিউটার ১৫, সাধারণ জ্ঞান ৫০"
          : "বাংলা ৪০, ইংরেজি ৪০, সাধারণ জ্ঞান ৮০, গণিত ৪০",
        status: "সম্পূর্ণ সমাধানসহ উপলব্ধ",
        tags: ['BCS', `${i}th BCS`, `${i}th`, 'BCS Preliminary', 'Prelims', `${i}`, `${yearAD}`, 'bcs exam'],
        displayTag: `${i}th`
      });
    }
    return list;
  };

  const generatePrimaryExams = () => {
    const list = [];
    const years = [2024, 2023, 2022, 2021, 2020];
    const steps = [
      { num: 3, text: '৩য় ধাপ' },
      { num: 2, text: '২য় ধাপ' },
      { num: 1, text: '১ম ধাপ' }
    ];

    years.forEach((year) => {
      const bnYear = toBengaliNumber(year);
      steps.forEach((step) => {
        list.push({
          id: `primary-${year}-step${step.num}`,
          year: `প্রাথমিক সহকারী শিক্ষক নিয়োগ (${bnYear} - ${step.text})`,
          category: "Primary",
          date: bnYear,
          totalQ: 80,
          time: "১ ঘণ্টা",
          subjectStats: "বাংলা ২০, ইংরেজি ২০, গণিত ২০, সাধারণ জ্ঞান ২০",
          status: "ব্যাখ্যামূলক সমাধান",
          tags: ['Primary', 'Primary Teacher', 'Assistant Teacher', `Primary ${year}`, `Step ${step.num}`, `Step-${step.num}`, `Step${step.num}`, `${step.num}rd Step`, `${step.num}nd Step`, `${step.num}st Step`, `${year}`, 'primary school'],
          displayTag: `Step-${step.num}`
        });
      });
    });

    return list;
  };

  const generateNtrcaExams = () => {
    const list = [];
    const yearsMap = {
      18: '২০২৪', 17: '২০২৩', 16: '২০১৯', 15: '২০১৮', 14: '২০১৭',
      13: '২০১৬', 12: '২০১৫', 11: '২০১৪', 10: '২০১৪', 9: '২০১৩', 8: '২০১২', 7: '২০১১', 6: '২০১০'
    };

    const levels = ['কলেজ পর্যায়', 'স্কুল পর্যায়', 'স্কুল-২ পর্যায়'];

    for (let i = 18; i >= 6; i--) {
      const bnNum = toBengaliNumber(i);
      const dateStr = yearsMap[i] || toBengaliNumber(2024 - (18 - i));

      levels.forEach((level, lIdx) => {
        list.push({
          id: `ntrca-${i}-level-${lIdx + 1}`,
          year: `${bnNum}তম শিক্ষক নিবন্ধন (${level})`,
          category: "NTRCA",
          date: dateStr,
          totalQ: 100,
          time: "১ ঘণ্টা",
          subjectStats: "বাংলা ২৫, ইংরেজি ২৫, গণিত ২৫, সাধারণ জ্ঞান ২৫",
          status: "ব্যাখ্যামূলক সমাধান",
          tags: ['NTRCA', 'Teacher Registration', `${i}th NTRCA`, `${i}th`, level, 'school', 'college'],
          displayTag: `${i}th`
        });
      });
    }

    return list;
  };

  const generateBankExams = () => {
    return [
      { id: "bb-ad-2024", year: "বাংলাদেশ ব্যাংক সহকারী পরিচালক (AD)", category: "Bank", date: "২০২৪", totalQ: 100, time: "১ ঘণ্টা", subjectStats: "English 25, Math 25, Bangla 20, GK 20, ICT 10", status: "ব্যাখ্যামূলক সমাধান", tags: ['Bank', 'Bank Job', 'Bangladesh Bank', 'AD', 'Assistant Director', '2024'], displayTag: 'AD' },
      { id: "bb-off-2024", year: "বাংলাদেশ ব্যাংক অফিসার (General)", category: "Bank", date: "২০২৪", totalQ: 100, time: "১ ঘণ্টা", subjectStats: "English 25, Math 25, Bangla 20, GK 20, ICT 10", status: "ব্যাখ্যামূলক সমাধান", tags: ['Bank', 'Bank Job', 'Bangladesh Bank', 'Officer', 'General Officer', '2024'], displayTag: 'Officer' },
      { id: "bsc-off-2024", year: "BSC কম্বাইন্ড ৮ ব্যাংক অফিসার (General)", category: "Bank", date: "২০২৪", totalQ: 100, time: "১ ঘণ্টা", subjectStats: "English 25, Math 25, Bangla 20, GK 20, ICT 10", status: "ব্যাখ্যামূলক সমাধান", tags: ['Bank', 'Bank Job', 'BSC Bank', 'Combined Bank', '8 Bank', '2024'], displayTag: 'Combined' },
      { id: "sonali-off-2024", year: "সোনালী ব্যাংক অফিসার (General)", category: "Bank", date: "২০২৪", totalQ: 100, time: "১ ঘণ্টা", subjectStats: "English 25, Math 25, Bangla 20, GK 20, ICT 10", status: "ব্যাখ্যামূলক সমাধান", tags: ['Bank', 'Bank Job', 'Sonali Bank', 'Officer', '2024'], displayTag: 'Sonali Officer' }
    ];
  };

  const DEFAULT_CATEGORIES = [
    { id: 'All', label: 'সকল' },
    { id: 'BCS', label: 'বিসিএস প্রিলি' },
    { id: 'Bank', label: 'ব্যাংক জবস' },
    { id: 'Primary', label: 'প্রাথমিক শিক্ষক' },
    { id: 'NTRCA', label: 'শিক্ষক নিবন্ধন' }
  ];

  const DEFAULT_QUESTION_BANK_DATA = [
    ...generateBcsExams(),
    ...generatePrimaryExams(),
    ...generateNtrcaExams(),
    ...generateBankExams()
  ];

  // --- State Variables ---
  let bankData = [...DEFAULT_QUESTION_BANK_DATA];
  let categoriesList = [...DEFAULT_CATEGORIES];
  let currentTag = 'All';
  let searchQuery = '';

  // --- Filtering Engine (Exact match to TopMCQBD algorithm) ---
  function getFilteredData() {
    return bankData.filter((item) => {
      const matchTag = currentTag === 'All' || item.category === currentTag;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchTag;

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

      return matchTag && textMatch;
    });
  }

  // --- Render Filter Pills ---
  function renderFilterPills() {
    const pillsContainer = document.getElementById('pillsGroup');
    if (!pillsContainer) return;

    const filterTags = categoriesList.map((tag) => {
      const count = tag.id === 'All'
        ? bankData.length
        : bankData.filter((i) => i.category === tag.id).length;
      return { ...tag, count };
    });

    pillsContainer.innerHTML = filterTags.map((tag) => {
      const isActive = currentTag === tag.id;
      return `
        <button
          type="button"
          class="filter-btn ${isActive ? 'active' : 'inactive'}"
          data-category="${tag.id}"
        >
          <span>${tag.label}</span>
          <span class="count-badge">${toBengaliNumber(tag.count)}</span>
        </button>
      `;
    }).join('');

    pillsContainer.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        currentTag = cat;
        renderFilterPills();
        renderCardsGrid();
      });
    });
  }

  // --- Render Question Bank Cards Grid ---
  function renderCardsGrid() {
    const gridContainer = document.getElementById('cardsGridLayout');
    const noDataBox = document.getElementById('noDataBox');
    if (!gridContainer) return;

    const filtered = getFilteredData();

    if (filtered.length === 0) {
      gridContainer.style.display = 'none';
      if (noDataBox) noDataBox.style.display = 'block';
      return;
    }

    if (noDataBox) noDataBox.style.display = 'none';
    gridContainer.style.display = 'grid';

    gridContainer.innerHTML = filtered.map((item) => {
      const displayTagHtml = item.displayTag ? `
        <span 
          class="tag-chip"
          data-search-chip="${item.displayTag}"
          title="ক্লিক করে এই পদ/ব্যাচে সার্চ করুন"
        >
          ${item.displayTag}
        </span>
      ` : '';

      const dateChipHtml = `
        <span 
          class="tag-chip"
          data-search-chip="${toEnglishNumberStr(item.date)}"
          title="ক্লিক করে এই সালে সার্চ করুন"
        >
          ${toEnglishNumberStr(item.date)}
        </span>
      `;

      return `
        <div class="hub-card-item" data-id="${item.id}">
          <div>
            <!-- Header Chips with Search Tags -->
            <div class="card-header-badges">
              <span 
                class="category-chip"
                data-search-chip="${item.category}"
                title="ক্লিক করে এই ক্যাটাগরিতে সার্চ করুন"
              >
                ${item.category}
              </span>
              ${displayTagHtml}
              ${dateChipHtml}
            </div>

            <!-- Title -->
            <h3 class="card-exam-title">${item.year}</h3>

            <!-- Subject Breakdown Box -->
            <div class="subject-breakdown-box">
              ${item.subjectStats}
            </div>
          </div>

          <div>
            <!-- Meta Stats Row -->
            <div class="meta-stats-row">
              <span><strong>প্রশ্ন:</strong> ${item.totalQ} টি</span>
              <span><strong>সময়:</strong> ${item.time}</span>
              <span><strong>সাল:</strong> ${item.date}</span>
            </div>

            <!-- Dual Action Buttons -->
            <div class="card-buttons-flex">
              <button 
                type="button"
                class="btn-read-solution"
                data-action="read"
                data-exam-id="${item.id}"
                data-exam-title="${item.year}"
                title="প্রশ্নব্যাংক সমাধান পড়ুন"
              >
                <i class="fa-regular fa-folder-open"></i> <span>ব্যাখ্যা পড়ুন</span>
              </button>
              <button 
                type="button"
                class="btn-start-exam"
                data-action="exam"
                data-exam-id="${item.id}"
                data-exam-title="${item.year}"
                title="পরীক্ষা দিন"
              >
                <span>পরীক্ষা দিন</span> <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach chip click listeners (fills search box & filters immediately)
    gridContainer.querySelectorAll('[data-search-chip]').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const query = chip.getAttribute('data-search-chip');
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.value = query;
          searchQuery = query;
          renderCardsGrid();
        }
      });
    });

    // Attach Action Buttons (Modal / Navigation)
    gridContainer.querySelectorAll('.btn-read-solution, .btn-start-exam').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        const examId = btn.getAttribute('data-exam-id');
        const examTitle = btn.getAttribute('data-exam-title');
        handleExamAction(action, examId, examTitle);
      });
    });
  }

  // --- Handle Card Actions (Read Solution / Start Exam) ---
  function handleExamAction(action, examId, examTitle) {
    const item = bankData.find((i) => i.id === examId) || { year: examTitle, totalQ: 100, time: '১ ঘণ্টা' };
    const isExam = action === 'exam';

    const modalTitle = isExam ? `পরীক্ষা শুরু করুন: ${item.year}` : `প্রশ্ন সমাধান: ${item.year}`;
    const modalContent = `
      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">${item.year}</h4>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 14px;">
          <p style="margin: 0 0 6px 0;"><strong>ক্যাটাগরি:</strong> ${item.category} (${item.date})</p>
          <p style="margin: 0 0 6px 0;"><strong>মোট প্রশ্ন:</strong> ${item.totalQ} টি &nbsp;|&nbsp; <strong>সময়:</strong> ${item.time}</p>
          <p style="margin: 0; color: #475569; font-size: 13.5px;"><strong>বিষয়ভিত্তিক মানবণ্টন:</strong> ${item.subjectStats}</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          ${isExam
            ? 'আপনি কি এই প্রশ্নব্যাংকের ওপর সরাসরি লাইভ পরীক্ষা দিতে চান? প্রতিটি প্রশ্নের জন্য নির্দিষ্ট সময় ও নেগেটিভ মার্কিং হিসাব করা হবে।'
            : 'আপনি কি প্রতিটি প্রশ্নের বিস্তারিত ব্যাখ্যা, তথ্যকণিকা ও সঠিক সমাধানসহ পড়তে চান?'
          }
        </p>
      </div>
    `;

    openModal(
      modalTitle,
      modalContent,
      isExam ? 'পরীক্ষা শুরু করুন' : 'সমাধান পড়ুন',
      () => {
        // Direct link to questions layout with mode parameter
        const catSlug = encodeURIComponent(String(item.year || item.id).trim().replace(/\s+/g, '-'));
        const targetUrl = `../questions-layout/index.html?category=${catSlug}${isExam ? '&mode=exam' : '&mode=read'}`;
        window.location.href = targetUrl;
      }
    );
  }

  // --- Modal Utilities ---
  function openModal(title, bodyHtml, confirmBtnText, onConfirm) {
    let overlay = document.getElementById('qbModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'qbModalOverlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h3>${title}</h3>
          <button type="button" class="modal-close-btn" id="btnModalClose">&times;</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        <div class="modal-footer">
          <button type="button" class="modal-btn modal-btn-cancel" id="btnModalCancel">বন্ধ করুন</button>
          <button type="button" class="modal-btn modal-btn-primary" id="btnModalConfirm">
            <span>${confirmBtnText}</span> <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;

    overlay.style.display = 'flex';

    const closeModal = () => {
      overlay.style.display = 'none';
    };

    document.getElementById('btnModalClose')?.addEventListener('click', closeModal);
    document.getElementById('btnModalCancel')?.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    document.getElementById('btnModalConfirm')?.addEventListener('click', () => {
      closeModal();
      if (typeof onConfirm === 'function') onConfirm();
    });
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Search Input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCardsGrid();
      });
    }

    // Mobile Navbar Toggle
    const mobileBtn = document.getElementById('mobile-toggle-btn');
    const siteNav = document.getElementById('site-nav');
    if (mobileBtn && siteNav) {
      mobileBtn.addEventListener('click', () => {
        siteNav.classList.toggle('mobile-active');
        const icon = mobileBtn.querySelector('i');
        if (icon) {
          icon.className = siteNav.classList.contains('mobile-active')
            ? 'fa-solid fa-xmark'
            : 'fa-solid fa-bars';
        }
      });
    }
  }

  // --- Initializer ---
  async function init() {
    // Attempt dynamic fetch from question-bank.json
    try {
      const res = await fetch('question-bank.json');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          bankData = data.items;
        }
        if (data && Array.isArray(data.categories) && data.categories.length > 0) {
          categoriesList = data.categories;
        }
      }
    } catch (e) {
      console.log('Running with embedded Question Bank dataset.');
    }

    setupEventListeners();
    renderFilterPills();
    renderCardsGrid();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
