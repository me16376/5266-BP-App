// Most Important Questions Data Loader & Catalog Service

let cachedCatalog = null;
const questionsCache = new Map();

export async function getMostImportantCatalog() {
  if (cachedCatalog) return cachedCatalog;

  try {
    const res = await fetch('/data/most_important_index.json');
    if (!res.ok) throw new Error('Failed to fetch Most Important catalog: ' + res.status);
    const data = await res.json();
    
    // Filter out empty/dummy entries like summary.json with question_count === 0
    const validSubjects = (data.subjects || []).filter(
      s => s.question_count > 0 && s.id !== 'summary'
    ).map(s => ({
      ...s,
      file: s.file_path,
      clean_filename: `${s.title}.json`,
      year: ''
    }));

    cachedCatalog = {
      total_exams: validSubjects.length,
      total_subjects: validSubjects.length,
      total_questions: data.total_questions || validSubjects.reduce((sum, s) => sum + (s.question_count || 0), 0),
      categories: data.categories || [],
      exams: validSubjects,
      subjects: validSubjects
    };
    return cachedCatalog;
  } catch (err) {
    console.error('getMostImportantCatalog error:', err);
    return { total_exams: 0, total_subjects: 0, total_questions: 0, categories: [], exams: [], subjects: [] };
  }
}

export function cleanMostImportantTitle(title) {
  if (!title) return '';
  return title
    .replace(/^[০-৯0-9]{1,5}[@_]\s*/, '')
    .replace(/\.json$/i, '')
    .trim();
}

export async function getMostImportantBySlug(slugOrId) {
  if (!slugOrId) return null;
  const catalog = await getMostImportantCatalog();
  const normalized = String(slugOrId).toLowerCase().trim();
  const decoded = decodeURIComponent(normalized);

  const found = catalog.exams.find(
    s => s.slug.toLowerCase() === normalized || 
         s.slug.toLowerCase() === decoded ||
         s.id.toLowerCase() === normalized ||
         s.id.toLowerCase() === decoded ||
         s.title.toLowerCase() === normalized ||
         s.title.toLowerCase() === decoded
  );

  if (found) {
    return {
      ...found,
      title: cleanMostImportantTitle(found.title)
    };
  }
  return null;
}

export async function loadMostImportantQuestions(slugOrId) {
  if (!slugOrId) return { exam: null, questions: [] };
  const normalized = String(slugOrId).toLowerCase().trim();

  // Find metadata in catalog
  const subjectMeta = await getMostImportantBySlug(slugOrId);

  if (questionsCache.has(normalized)) {
    return {
      exam: subjectMeta || { title: 'Most Important Questions', question_count: questionsCache.get(normalized).length },
      questions: questionsCache.get(normalized)
    };
  }

  const filePath = subjectMeta ? (subjectMeta.file_path || subjectMeta.file) : `/data/most-important-questions/${normalized}.json`;

  try {
    let res = await fetch(encodeURI(filePath));
    if (!res.ok) res = await fetch(filePath);
    if (!res.ok) throw new Error('Failed to load questions from ' + filePath);
    
    const text = await res.text();
    const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
    const data = JSON.parse(cleanText);
    const rawList = Array.isArray(data) ? data : (data.questions || []);

    const bnAnsToIdx = { 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3 };
    const questions = rawList.map((item, idx) => {
      const opts = Array.isArray(item.options) ? item.options.map(o => String(o).trim()) : [];
      let ansIdx = -1;

      // 1. Prioritize matching exact option text from correct_answer, correctAnswer, or answer
      const textCandidates = [item.correct_answer, item.correctAnswer, item.answer];
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

      // 2. Case-insensitive text match
      if (ansIdx === -1) {
        for (const cand of textCandidates) {
          if (cand !== null && cand !== undefined) {
            const str = String(cand).trim().toLowerCase();
            if (str) {
              const foundIdx = opts.findIndex(o => o.toLowerCase() === str);
              if (foundIdx !== -1) {
                ansIdx = foundIdx;
                break;
              }
            }
          }
        }
      }

      // 3. Bengali letter matching 'ক', 'খ', 'গ', 'ঘ'
      if (ansIdx === -1) {
        for (const cand of textCandidates) {
          const str = String(cand || '').trim();
          if (bnAnsToIdx[str] !== undefined && bnAnsToIdx[str] < opts.length) {
            ansIdx = bnAnsToIdx[str];
            break;
          }
        }
      }

      // 4. If still not resolved, check item.ans as a valid number
      if (ansIdx === -1 && typeof item.ans === 'number' && item.ans >= 0 && item.ans < opts.length) {
        ansIdx = item.ans;
      }

      // 5. Final fallback
      if (ansIdx < 0) ansIdx = 0;

      const correctAns = opts[ansIdx] || item.correct_answer || item.answer || '';

      return {
        ...item,
        id: item.id || (idx + 1),
        question: item.question || item.q || '',
        question_text: item.question || item.q || '',
        options: opts,
        ans: ansIdx,
        answer: item.answer || (['ক', 'খ', 'গ', 'ঘ'][ansIdx] || 'ক'),
        correct_answer: correctAns,
        explanation: item.explanation || '',
        hints: item.hints || item.hint || '',
        subject: item.subject || subjectMeta?.title || 'সাধারণ জ্ঞান',
        category: item.category || subjectMeta?.category_name || '',
        exam: item.exam || subjectMeta?.title || '',
        times_repeated: item.times_repeated || item.repeated_count || 0,
        exam_count: item.exam_count || 0,
        exam_summary: item.exam_summary || '',
        repeated_count: item.repeated_count || item.times_repeated || 0
      };
    });

    questionsCache.set(normalized, questions);
    return {
      exam: subjectMeta || { title: 'Most Important Questions', question_count: questions.length },
      questions
    };
  } catch (err) {
    console.error('loadMostImportantQuestions error:', err);
    return {
      exam: subjectMeta || { title: 'Most Important Questions', question_count: 0 },
      questions: []
    };
  }
}
