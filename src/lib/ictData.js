/**
 * Data loader for ICT Catalog index and all 17 ICT chapters.
 */

let cachedIctIndex = null;

export async function getIctCatalog() {
  if (cachedIctIndex) return cachedIctIndex;
  try {
    const res = await fetch('/data/ict_index.json');
    if (!res.ok) throw new Error('Failed to load ICT catalog');
    const data = await res.json();
    cachedIctIndex = data;
    return data;
  } catch (err) {
    console.error('Error fetching ICT index:', err);
    return {
      total_exams: 0,
      total_questions: 0,
      categories: [],
      exams: []
    };
  }
}

export function cleanIctTitle(title) {
  if (!title || typeof title !== 'string') return '';
  return title
    .replace(/^[০-৯0-9]+[@_]\s*/, '')
    .replace(/\.json$/i, '')
    .trim();
}

export async function getIctBySlug(slugOrId) {
  const catalog = await getIctCatalog();
  if (!slugOrId || !catalog?.exams) return null;
  const raw = String(slugOrId).trim();
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw).trim();
  } catch (e) {
    decoded = raw;
  }
  const searchLower = decoded.toLowerCase();
  const searchClean = cleanIctTitle(decoded).toLowerCase();

  // 1. Exact match on slug or id
  let exam = catalog.exams.find(e => e.slug === raw || e.slug === decoded || e.id === raw);

  // 2. Case-insensitive slug match
  if (!exam) {
    exam = catalog.exams.find(e => e.slug && e.slug.toLowerCase() === searchLower);
  }

  // 3. Exact or case-insensitive title match
  if (!exam) {
    exam = catalog.exams.find(e => e.title && e.title.toLowerCase() === searchLower);
  }

  // 4. Cleaned title match
  if (!exam) {
    exam = catalog.exams.find(e => cleanIctTitle(e.title).toLowerCase() === searchClean);
  }

  // 5. Clean filename match
  if (!exam) {
    exam = catalog.exams.find(e => e.clean_filename && (e.clean_filename.toLowerCase() === searchLower || e.clean_filename.replace(/\.json$/i, '').toLowerCase() === searchLower));
  }

  // 6. Partial match or hyphen match
  if (!exam) {
    const searchNoHyphen = decoded.replace(/-/g, ' ').toLowerCase();
    const searchWithHyphen = decoded.replace(/\s+/g, '-').toLowerCase();
    exam = catalog.exams.find(e => 
      (e.slug && (e.slug.toLowerCase().includes(searchWithHyphen) || e.slug.replace(/-/g, ' ').toLowerCase().includes(searchNoHyphen))) ||
      (e.title && (e.title.toLowerCase().includes(searchNoHyphen) || e.title.replace(/\s+/g, '-').toLowerCase().includes(searchWithHyphen)))
    );
  }

  // 7. Check for Category "All Chapters" (e.g. all-class-9-10-computer-gk, class-9-10-computer-gk-all, or category id)
  if (!exam && catalog.categories && Array.isArray(catalog.categories)) {
    const matchedCategory = catalog.categories.find(c => {
      const cId = c.id.toLowerCase();
      return (
        raw === `all-${c.id}` ||
        raw === `${c.id}-all` ||
        decoded === `all-${c.id}` ||
        decoded === `${c.id}-all` ||
        raw === c.id ||
        decoded === c.id ||
        searchLower === `all-${cId}` ||
        searchLower === `${cId}-all` ||
        searchLower === cId ||
        (searchLower.includes('all') && searchLower.includes(cId))
      );
    });

    if (matchedCategory) {
      const categoryExams = catalog.exams.filter(e => e.category_id === matchedCategory.id);
      return {
        id: `all-${matchedCategory.id}`,
        slug: `all-${matchedCategory.id}`,
        title: 'সকল অধ্যায়',
        full_title: `${matchedCategory.name} - সকল অধ্যায়`,
        category_id: matchedCategory.id,
        category_name: matchedCategory.name,
        question_count: matchedCategory.question_count || categoryExams.reduce((sum, e) => sum + (e.question_count || 0), 0),
        is_all_category: true,
        files: categoryExams.map(e => e.file)
      };
    }
  }

  if (exam) {
    return {
      ...exam,
      title: cleanIctTitle(exam.title)
    };
  }
  return null;
}

export async function loadIctQuestions(slugOrId) {
  // Find metadata in catalog
  const examMeta = await getIctBySlug(slugOrId);

  // 1. If this is an All-Chapters category request, fetch and merge all files for this category
  if (examMeta?.is_all_category && Array.isArray(examMeta.files) && examMeta.files.length > 0) {
    try {
      const fileResults = await Promise.all(
        examMeta.files.map(async (fileUrl) => {
          try {
            let res = await fetch(encodeURI(fileUrl));
            if (!res.ok) res = await fetch(fileUrl);
            if (!res.ok) return [];
            const text = await res.text();
            const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
            const rawList = JSON.parse(cleanText);
            return Array.isArray(rawList) ? rawList : [];
          } catch (e) {
            console.error('Failed to load file:', fileUrl, e);
            return [];
          }
        })
      );

      const bnAnsToIdx = { 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3 };
      let globalIdx = 1;
      const allQuestions = [];

      for (const rawList of fileResults) {
        for (const item of rawList) {
          const opts = Array.isArray(item.options) ? item.options.map(o => String(o).trim()) : [];
          let ansIdx = typeof item.ans === 'number' ? item.ans : -1;

          if (ansIdx < 0 || ansIdx >= opts.length) {
            const rawAns = String(item.answer || '').trim();
            if (bnAnsToIdx[rawAns] !== undefined) {
              ansIdx = bnAnsToIdx[rawAns];
            } else if (item.correct_answer !== undefined) {
              const ansStr = String(item.correct_answer).trim();
              ansIdx = opts.findIndex(o => o === ansStr);
            }
          }
          if (ansIdx < 0) ansIdx = 0;

          const correctAns = opts[ansIdx] || item.correct_answer || '';

          allQuestions.push({
            id: item.id || globalIdx,
            question: item.question || item.q || '',
            question_text: item.question || item.q || '',
            options: opts,
            ans: ansIdx,
            answer: item.answer || (['ক', 'খ', 'গ', 'ঘ'][ansIdx] || 'ক'),
            correct_answer: correctAns,
            explanation: item.explanation || '',
            hints: item.hints || item.hint || '',
            subject: item.subject || examMeta.category_name || 'ICT',
            category: item.category || examMeta.category_name || 'ICT',
            exam: item.exam || examMeta.title || 'সকল অধ্যায়'
          });
          globalIdx++;
        }
      }

      return {
        exam: examMeta,
        questions: allQuestions
      };
    } catch (e) {
      console.error('Failed to load merged ICT category questions:', e);
    }
  }

  const targetFile = examMeta?.file;

  if (targetFile) {
    try {
      let res = await fetch(encodeURI(targetFile));
      if (!res.ok) {
        res = await fetch(targetFile);
      }
      if (res.ok) {
        const text = await res.text();
        const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
        const rawList = JSON.parse(cleanText);

        const bnAnsToIdx = { 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3 };

        const questions = (Array.isArray(rawList) ? rawList : []).map((item, idx) => {
          const opts = Array.isArray(item.options) ? item.options.map(o => String(o).trim()) : [];
          let ansIdx = typeof item.ans === 'number' ? item.ans : -1;

          if (ansIdx < 0 || ansIdx >= opts.length) {
            const rawAns = String(item.answer || '').trim();
            if (bnAnsToIdx[rawAns] !== undefined) {
              ansIdx = bnAnsToIdx[rawAns];
            } else if (item.correct_answer !== undefined) {
              const ansStr = String(item.correct_answer).trim();
              ansIdx = opts.findIndex(o => o === ansStr);
            }
          }
          if (ansIdx < 0) ansIdx = 0;

          const correctAns = opts[ansIdx] || item.correct_answer || '';

          return {
            id: item.id || (idx + 1),
            question: item.question || item.q || '',
            question_text: item.question || item.q || '',
            options: opts,
            ans: ansIdx,
            answer: item.answer || (['ক', 'খ', 'গ', 'ঘ'][ansIdx] || 'ক'),
            correct_answer: correctAns,
            explanation: item.explanation || '',
            hints: item.hints || item.hint || '',
            subject: item.subject || examMeta.category_name || 'ICT',
            category: item.category || examMeta.category_name || 'ICT',
            exam: item.exam || examMeta.title || ''
          };
        });

        return {
          exam: examMeta,
          questions
        };
      }
    } catch (e) {
      console.error('Failed to load ICT questions from file:', e);
    }
  }

  return {
    exam: examMeta || { title: 'ICT Questions', question_count: 0 },
    questions: []
  };
}

export const getIctChapterBySlug = getIctBySlug;
