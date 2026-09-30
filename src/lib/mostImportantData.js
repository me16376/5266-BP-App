// Most Important Questions Data Loader & Catalog Service

let cachedCatalog = null;
const questionsCache = new Map();

export async function getMostImportantCatalog() {
  if (cachedCatalog) return cachedCatalog;

  try {
    const res = await fetch('/data/most_important_index.json');
    if (!res.ok) throw new Error('Failed to fetch Most Important catalog: ' + res.status);
    const data = await res.json();
    cachedCatalog = data;
    return data;
  } catch (err) {
    console.error('getMostImportantCatalog error:', err);
    return { total_subjects: 0, total_questions: 0, categories: [], subjects: [] };
  }
}

export function cleanMostImportantTitle(title) {
  if (!title) return '';
  return title
    .replace(/\.json$/i, '')
    .trim();
}

export async function getMostImportantBySlug(slug) {
  if (!slug) return null;
  const catalog = await getMostImportantCatalog();
  const normalized = slug.toLowerCase().trim();
  return catalog.subjects.find(
    s => s.slug.toLowerCase() === normalized || s.id.toLowerCase() === normalized
  ) || null;
}

export async function loadMostImportantQuestions(subjectSlug) {
  if (!subjectSlug) return [];
  const normalized = subjectSlug.toLowerCase().trim();

  if (questionsCache.has(normalized)) {
    return questionsCache.get(normalized);
  }

  const subject = await getMostImportantBySlug(normalized);
  const filePath = subject ? subject.file_path : `/data/most-important-questions/${normalized}.json`;

  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error('Failed to load questions from ' + filePath);
    const data = await res.json();
    const questions = Array.isArray(data) ? data : (data.questions || []);
    questionsCache.set(normalized, questions);
    return questions;
  } catch (err) {
    console.error('loadMostImportantQuestions error:', err);
    return [];
  }
}
