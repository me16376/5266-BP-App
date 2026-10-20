import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

template = """/**
 * Data loader for {name_en} catalog index and questions.
 */

let cachedIndex = null;

export async function {get_catalog}() {{
  if (cachedIndex) return cachedIndex;
  try {{
    const res = await fetch('/data/{index_file}');
    if (!res.ok) throw new Error('Failed to load {name_en} catalog');
    const data = await res.json();
    cachedIndex = data;
    return data;
  }} catch (err) {{
    console.error('Error fetching {name_en} index:', err);
    return {{
      total_exams: 0,
      total_questions: 0,
      categories: [],
      exams: []
    }};
  }}
}}

export function {clean_title}(title) {{
  if (!title || typeof title !== 'string') return '';
  return title
    .replace(/^[০-৯0-9]{{1,5}}[@_]\\s*/, '')
    .replace(/\\.json$/i, '')
    .trim();
}}

export async function {get_by_slug}(slugOrId) {{
  const catalog = await {get_catalog}();
  if (!slugOrId || !catalog?.exams) return null;
  const raw = String(slugOrId).trim();
  let decoded = raw;
  try {{
    decoded = decodeURIComponent(raw).trim();
  }} catch (e) {{
    decoded = raw;
  }}
  const searchLower = decoded.toLowerCase();
  const searchClean = {clean_title}(decoded).toLowerCase();

  // 1. Exact match on slug or id
  let exam = catalog.exams.find(e => e.slug === raw || e.slug === decoded || e.id === raw);

  // 2. Case-insensitive slug match
  if (!exam) {{
    exam = catalog.exams.find(e => e.slug && e.slug.toLowerCase() === searchLower);
  }}

  // 3. Exact or case-insensitive title match
  if (!exam) {{
    exam = catalog.exams.find(e => e.title && e.title.toLowerCase() === searchLower);
  }}

  // 4. Cleaned title match
  if (!exam) {{
    exam = catalog.exams.find(e => {clean_title}(e.title).toLowerCase() === searchClean);
  }}

  // 5. Clean filename match
  if (!exam) {{
    exam = catalog.exams.find(e => e.clean_filename && (e.clean_filename.toLowerCase() === searchLower || e.clean_filename.replace(/\\.json$/i, '').toLowerCase() === searchLower));
  }}

  // 6. Partial match or hyphen match
  if (!exam) {{
    const searchNoHyphen = decoded.replace(/-/g, ' ').toLowerCase();
    const searchWithHyphen = decoded.replace(/\\s+/g, '-').toLowerCase();
    exam = catalog.exams.find(e => 
      (e.slug && (e.slug.toLowerCase().includes(searchWithHyphen) || e.slug.replace(/-/g, ' ').toLowerCase().includes(searchNoHyphen))) ||
      (e.title && (e.title.toLowerCase().includes(searchNoHyphen) || e.title.replace(/\\s+/g, '-').toLowerCase().includes(searchWithHyphen)))
    );
  }}

  // 7. Check for Category "All Chapters" (e.g. all-bangla, bangla-all, or category id)
  if (!exam && catalog.categories && Array.isArray(catalog.categories)) {{
    const matchedCategory = catalog.categories.find(c => {{
      const cId = c.id.toLowerCase();
      return (
        raw === `all-${{c.id}}` ||
        raw === `${{c.id}}-all` ||
        decoded === `all-${{c.id}}` ||
        decoded === `${{c.id}}-all` ||
        raw === c.id ||
        decoded === c.id ||
        searchLower === `all-${{cId}}` ||
        searchLower === `${{cId}}-all` ||
        searchLower === cId ||
        (searchLower.includes('all') && searchLower.includes(cId))
      );
    }});

    if (matchedCategory) {{
      const categoryExams = catalog.exams.filter(e => e.category_id === matchedCategory.id);
      return {{
        id: `all-${{matchedCategory.id}}`,
        slug: `all-${{matchedCategory.id}}`,
        title: 'সকল অধ্যায়',
        full_title: `${{matchedCategory.name}} - সকল অধ্যায়`,
        category_id: matchedCategory.id,
        category_name: matchedCategory.name,
        question_count: matchedCategory.question_count || categoryExams.reduce((sum, e) => sum + (e.question_count || 0), 0),
        is_all_category: true,
        files: categoryExams.map(e => e.file)
      }};
    }}
  }}

  if (exam) {{
    return {{
      ...exam,
      title: {clean_title}(exam.title)
    }};
  }}
  return null;
}}

function normalizeQuestions(rawList, examMeta) {{
  const bnAnsToIdx = {{ 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 }};

  return (Array.isArray(rawList) ? rawList : []).map((item, idx) => {{
    const opts = Array.isArray(item.options) ? item.options.map(o => String(o).trim()) : [];
    let ansIdx = typeof item.ans === 'number' ? item.ans : -1;

    // 1. Check exact match in options with item.answer or item.correct_answer
    const textCandidates = [item.answer, item.correct_answer, item.correctAnswer];
    if (ansIdx < 0 || ansIdx >= opts.length) {{
      for (const cand of textCandidates) {{
        if (cand !== null && cand !== undefined) {{
          const str = String(cand).trim();
          if (str) {{
            const foundIdx = opts.findIndex(o => o === str);
            if (foundIdx !== -1) {{
              ansIdx = foundIdx;
              break;
            }}
          }}
        }}
      }}
    }}

    // 2. Check letter candidate (ক, খ, গ, ঘ)
    if (ansIdx < 0 || ansIdx >= opts.length) {{
      for (const cand of textCandidates) {{
        const str = String(cand || '').trim();
        if (bnAnsToIdx[str] !== undefined && bnAnsToIdx[str] < opts.length) {{
          ansIdx = bnAnsToIdx[str];
          break;
        }}
      }}
    }}

    // 3. Fallback
    if (ansIdx < 0 || ansIdx >= opts.length) ansIdx = 0;

    const correctAns = opts[ansIdx] || item.correct_answer || item.answer || '';

    return {{
      id: item.id || (idx + 1),
      question: item.question || item.q || '',
      question_text: item.question || item.q || '',
      options: opts,
      ans: ansIdx,
      answer: item.answer || (['ক', 'খ', 'গ', 'ঘ'][ansIdx] || 'ক'),
      correct_answer: correctAns,
      explanation: item.explanation || '',
      hints: item.hints || item.hint || '',
      subject: item.subject || examMeta?.category_name || '{name_en}',
      category: item.category || examMeta?.category_name || '{name_en}',
      exam: item.exam || examMeta?.title || '',
      topic: item.topic || ''
    }};
  }});
}}

export async function {load_questions}(slugOrId) {{
  const examMeta = await {get_by_slug}(slugOrId);

  // 1. If this is an All-Chapters category request
  if (examMeta?.is_all_category && Array.isArray(examMeta.files) && examMeta.files.length > 0) {{
    try {{
      const fileResults = await Promise.all(
        examMeta.files.map(async (fileUrl) => {{
          try {{
            let res = await fetch(encodeURI(fileUrl));
            if (!res.ok) res = await fetch(fileUrl);
            if (!res.ok) return [];
            const text = await res.text();
            const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
            const parsed = JSON.parse(cleanText);
            return Array.isArray(parsed) ? parsed : (parsed.questions || []);
          }} catch (e) {{
            console.error('Failed to load file:', fileUrl, e);
            return [];
          }}
        }})
      );

      const allMerged = [];
      fileResults.forEach(rawList => allMerged.push(...rawList));
      const questions = normalizeQuestions(allMerged, examMeta);

      return {{
        exam: examMeta,
        questions
      }};
    }} catch (e) {{
      console.error('Failed to load merged {name_en} category questions:', e);
    }}
  }}

  const targetFile = examMeta?.file;
  if (targetFile) {{
    try {{
      let res = await fetch(encodeURI(targetFile));
      if (!res.ok) {{
        res = await fetch(targetFile);
      }}
      if (res.ok) {{
        const text = await res.text();
        const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
        const parsed = JSON.parse(cleanText);
        const rawList = Array.isArray(parsed) ? parsed : (parsed.questions || []);
        const questions = normalizeQuestions(rawList, examMeta);

        return {{
          exam: examMeta,
          questions
        }};
      }}
    }} catch (e) {{
      console.error('Failed to load {name_en} questions from file:', e);
    }}
  }}

  return {{
    exam: examMeta || {{ title: '{name_en} Questions', question_count: 0 }},
    questions: []
  }};
}}

export const {get_chapter_by_slug} = {get_by_slug};
"""

loaders = [
    {
        'file_name': 'buetPatternData.js',
        'name_en': 'BUET Pattern Suggestion',
        'index_file': 'buet_pattern_index.json',
        'get_catalog': 'getBuetPatternCatalog',
        'clean_title': 'cleanBuetPatternTitle',
        'get_by_slug': 'getBuetPatternBySlug',
        'load_questions': 'loadBuetPatternQuestions',
        'get_chapter_by_slug': 'getBuetPatternChapterBySlug'
    },
    {
        'file_name': 'bpscNonTechQuestionsData.js',
        'name_en': 'BPSC Non Tech Questions',
        'index_file': 'bpsc_non_tech_questions_index.json',
        'get_catalog': 'getBpscNonTechQuestionsCatalog',
        'clean_title': 'cleanBpscNonTechQuestionsTitle',
        'get_by_slug': 'getBpscNonTechQuestionsBySlug',
        'load_questions': 'loadBpscNonTechQuestionsQuestions',
        'get_chapter_by_slug': 'getBpscNonTechQuestionsChapterBySlug'
    },
    {
        'file_name': 'bpscNonTechSuggestionData.js',
        'name_en': 'BPSC Non Tech Suggestion',
        'index_file': 'bpsc_non_tech_suggestion_index.json',
        'get_catalog': 'getBpscNonTechSuggestionCatalog',
        'clean_title': 'cleanBpscNonTechSuggestionTitle',
        'get_by_slug': 'getBpscNonTechSuggestionBySlug',
        'load_questions': 'loadBpscNonTechSuggestionQuestions',
        'get_chapter_by_slug': 'getBpscNonTechSuggestionChapterBySlug'
    },
    {
        'file_name': 'saifNtrca100ModelData.js',
        'name_en': 'Saif Sir NTRCA 100 MCQ Model',
        'index_file': 'saif_ntrca_100_model_index.json',
        'get_catalog': 'getSaifNtrca100ModelCatalog',
        'clean_title': 'cleanSaifNtrca100ModelTitle',
        'get_by_slug': 'getSaifNtrca100ModelBySlug',
        'load_questions': 'loadSaifNtrca100ModelQuestions',
        'get_chapter_by_slug': 'getSaifNtrca100ModelChapterBySlug'
    },
    {
        'file_name': 'saifNtrcaSuggestionData.js',
        'name_en': 'Saif Sir NTRCA Suggestion',
        'index_file': 'saif_ntrca_suggestion_index.json',
        'get_catalog': 'getSaifNtrcaSuggestionCatalog',
        'clean_title': 'cleanSaifNtrcaSuggestionTitle',
        'get_by_slug': 'getSaifNtrcaSuggestionBySlug',
        'load_questions': 'loadSaifNtrcaSuggestionQuestions',
        'get_chapter_by_slug': 'getSaifNtrcaSuggestionChapterBySlug'
    }
]

out_dir = os.path.join('src', 'lib')
for l in loaders:
    content = template.format(**l)
    dest = os.path.join(out_dir, l['file_name'])
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Generated {dest}")
