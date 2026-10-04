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
    .replace(/^[০-৯0-9]+[@_]\s*/, '')
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
