/**
 * Data loader for the master catalog index and all 2,154 exams.
 */

let cachedIndex = null;

export async function getExamsCatalog() {
  if (cachedIndex) return cachedIndex;
  try {
    const res = await fetch('/data/exams_index.json');
    if (!res.ok) throw new Error('Failed to load catalog');
    const data = await res.json();
    cachedIndex = data;
    return data;
  } catch (err) {
    console.error('Error fetching exams index:', err);
    return {
      total_exams: 0,
      total_questions: 0,
      categories: [],
      exams: []
    };
  }
}

export function cleanExamTitle(title) {
  if (!title || typeof title !== 'string') return '';
  return title.replace(/^[০-৯0-9]+\s*_\s*/, '').trim();
}

export async function getExamBySlug(slugOrId) {
  const catalog = await getExamsCatalog();
  if (!slugOrId || !catalog?.exams) return null;
  const raw = String(slugOrId).trim();
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw).trim();
  } catch (e) {
    decoded = raw;
  }
  const searchLower = decoded.toLowerCase();
  const searchClean = cleanExamTitle(decoded).toLowerCase();

  // 1. Exact match on slug or id (highest priority)
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
    exam = catalog.exams.find(e => cleanExamTitle(e.title).toLowerCase() === searchClean);
  }

  // 5. Clean filename match
  if (!exam) {
    exam = catalog.exams.find(e => e.clean_filename && e.clean_filename.toLowerCase() === searchLower);
  }

  if (exam) {
    return {
      ...exam,
      title: cleanExamTitle(exam.title)
    };
  }
  return null;
}

export async function loadExamQuestions(slugOrId) {
  // First check if questions are in custom exams storage
  if (typeof window !== 'undefined') {
    try {
      const customExams = JSON.parse(localStorage.getItem('ujs_saved_custom_exams') || '[]');
      const found = customExams.find(e => e.slug === slugOrId || e.id === slugOrId);
      if (found && found.questions && found.questions.length > 0) {
        return {
          exam: found,
          questions: found.questions
        };
      }
    } catch (e) {
      console.warn('Error reading custom exams:', e);
    }
  }

  // Find metadata in catalog
  const examMeta = await getExamBySlug(slugOrId);
  let targetFile = examMeta?.file;

  if (targetFile) {
    if (targetFile.startsWith('/data/exams/')) {
      targetFile = targetFile.replace('/data/exams/', '/data/job-solution/');
    }
    try {
      const res = await fetch(encodeURI(targetFile));
      if (res.ok) {
        const text = await res.text();
        const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
        const questions = JSON.parse(cleanText);
        return {
          exam: examMeta,
          questions: Array.isArray(questions) ? questions : []
        };
      }
    } catch (e) {
      console.error('Failed to load exam questions from file:', e);
    }
  }

  return {
    exam: examMeta || { title: 'Exam Questions', question_count: 0 },
    questions: []
  };
}
