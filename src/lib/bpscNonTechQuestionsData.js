/**
 * Data loader for BPSC Non Tech Questions catalog index and questions.
 */

let cachedIndex = null;

export async function getBpscNonTechQuestionsCatalog() {
  if (cachedIndex) return cachedIndex;
  try {
    const res = await fetch('/data/bpsc_non_tech_questions_index.json');
    if (!res.ok) throw new Error('Failed to load BPSC Non Tech Questions catalog');
    const data = await res.json();
    cachedIndex = data;
    return data;
  } catch (err) {
    console.error('Error fetching BPSC Non Tech Questions index:', err);
    return {
      total_exams: 0,
      total_questions: 0,
      categories: [],
      exams: []
    };
  }
}

export function cleanBpscNonTechQuestionsTitle(title) {
  if (!title || typeof title !== 'string') return '';
  return title
    .replace(/^[০-৯0-9]{1,5}[@_]\s*/, '')
    .replace(/\.json$/i, '')
    .trim();
}

export async function getBpscNonTechQuestionsBySlug(slugOrId) {
  const catalog = await getBpscNonTechQuestionsCatalog();
  if (!slugOrId || !catalog?.exams) return null;
  const raw = String(slugOrId).trim();
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw).trim();
  } catch (e) {
    decoded = raw;
  }
  const searchLower = decoded.toLowerCase();
  const searchClean = cleanBpscNonTechQuestionsTitle(decoded).toLowerCase();

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
    exam = catalog.exams.find(e => cleanBpscNonTechQuestionsTitle(e.title).toLowerCase() === searchClean);
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

  // 7. Check for Category "All Chapters" (e.g. all-bangla, bangla-all, or category id)
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
      title: cleanBpscNonTechQuestionsTitle(exam.title)
    };
  }
  return null;
}

function normalizeQuestions(rawList, examMeta) {
  const bnAnsToIdx = { 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };

  return (Array.isArray(rawList) ? rawList : []).map((item, idx) => {
    const opts = Array.isArray(item.options) ? item.options.map(o => String(o).trim()) : [];
    let ansIdx = typeof item.ans === 'number' ? item.ans : -1;

    // 1. Check exact match in options with item.answer or item.correct_answer
    const textCandidates = [item.answer, item.correct_answer, item.correctAnswer];
    if (ansIdx < 0 || ansIdx >= opts.length) {
      for (const cand of textCandidates) {
        if (cand !== null && cand !== undefined) {
          const str = String(cand).trim();
          if (str) {
            const foundIdx = opts.findIndex(o => o === str);
            if (foundIdx !== -1) {
              ansIdx = foundIdx;
              break;
            }
          }
        }
      }
    }

    // 2. Check letter candidate (ক, খ, গ, ঘ)
    if (ansIdx < 0 || ansIdx >= opts.length) {
      for (const cand of textCandidates) {
        const str = String(cand || '').trim();
        if (bnAnsToIdx[str] !== undefined && bnAnsToIdx[str] < opts.length) {
          ansIdx = bnAnsToIdx[str];
          break;
        }
      }
    }

    // 3. Fallback
    if (ansIdx < 0 || ansIdx >= opts.length) ansIdx = 0;

    const correctAns = opts[ansIdx] || item.correct_answer || item.answer || '';

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
      subject: item.subject || examMeta?.category_name || 'BPSC Non Tech Questions',
      category: item.category || examMeta?.category_name || 'BPSC Non Tech Questions',
      exam: item.exam || examMeta?.title || '',
      topic: item.topic || ''
    };
  });
}

export async function loadBpscNonTechQuestionsQuestions(slugOrId) {
  const examMeta = await getBpscNonTechQuestionsBySlug(slugOrId);

  // 1. If this is an All-Chapters category request
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
            const parsed = JSON.parse(cleanText);
            return Array.isArray(parsed) ? parsed : (parsed.questions || []);
          } catch (e) {
            console.error('Failed to load file:', fileUrl, e);
            return [];
          }
        })
      );

      const allMerged = [];
      fileResults.forEach(rawList => allMerged.push(...rawList));
      const questions = normalizeQuestions(allMerged, examMeta);

      return {
        exam: examMeta,
        questions
      };
    } catch (e) {
      console.error('Failed to load merged BPSC Non Tech Questions category questions:', e);
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
        const parsed = JSON.parse(cleanText);
        const rawList = Array.isArray(parsed) ? parsed : (parsed.questions || []);
        const questions = normalizeQuestions(rawList, examMeta);

        return {
          exam: examMeta,
          questions
        };
      }
    } catch (e) {
      console.error('Failed to load BPSC Non Tech Questions questions from file:', e);
    }
  }

  return {
    exam: examMeta || { title: 'BPSC Non Tech Questions Questions', question_count: 0 },
    questions: []
  };
}

export const getBpscNonTechQuestionsChapterBySlug = getBpscNonTechQuestionsBySlug;
