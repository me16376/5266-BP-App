/**
 * Helper utilities for managing bookmarks, test history, and notes in browser LocalStorage.
 */

const BOOKMARKS_KEY = 'ujs_bookmarks';
const TEST_HISTORY_KEY = 'ujs_test_history';
const SAVED_EXAMS_KEY = 'ujs_saved_custom_exams';

export const getBookmarks = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const isBookmarked = (questionId) => {
  const list = getBookmarks();
  return list.some(item => item.id === questionId);
};

export const toggleBookmark = (question) => {
  if (typeof window === 'undefined') return false;
  const list = getBookmarks();
  const index = list.findIndex(item => item.id === question.id);
  let updated;
  let bookmarked;
  if (index >= 0) {
    updated = list.filter(item => item.id !== question.id);
    bookmarked = false;
  } else {
    updated = [
      {
        ...question,
        bookmarkedAt: new Date().toISOString()
      },
      ...list
    ];
    bookmarked = true;
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  return bookmarked;
};

export const getTestHistory = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TEST_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveTestResult = (result) => {
  if (typeof window === 'undefined') return;
  const history = getTestHistory();
  const entry = {
    id: 'test_' + Date.now(),
    date: new Date().toISOString(),
    ...result
  };
  localStorage.setItem(TEST_HISTORY_KEY, JSON.stringify([entry, ...history.slice(0, 49)]));
};

export const getCustomExams = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_EXAMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveCustomExam = (exam) => {
  if (typeof window === 'undefined') return;
  const list = getCustomExams();
  const filtered = list.filter(e => e.id !== exam.id);
  localStorage.setItem(SAVED_EXAMS_KEY, JSON.stringify([exam, ...filtered]));
};
