import os

# Read the master question-bank-smart template
with open('src/app/(job-solution)/(Layout-smart)/question-bank-smart/page.jsx', 'r', encoding='utf-8') as f:
    master_tpl = f.read()

configs = [
    # 1. Ampibian Suggestion
    {
        'file_path': 'src/app/(ampibian-suggestion)/(Layout-smart)/ampibian-suggestion-smart/page.jsx',
        'get_catalog': 'getAmpibianCatalog',
        'clean_title': 'cleanAmpibianTitle',
        'lib_name': 'ampibianData',
        'component_name': 'AmpibianSmart',
        'storage_key': 'ujs_ampibian_smart_filters',
        'route_questions': 'ampibian-suggestion-smart-questions',
        'archive_badge': 'অ্যাম্ফিবিয়ান সাজেশন আর্কাইভ',
        'title_main': 'অ্যাম্ফিবিয়ান সাজেশন স্মার্ট প্রশ্নব্যাংক',
        'desc_sub': 'বাংলা, ইংরেজি, সাধারণ জ্ঞান ও গণিত বিষয়ের ৮৪টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও নির্ভুল ব্যাখ্যা।',
        'search_placeholder': 'অধ্যায় বা বিষয়ের নাম দিয়ে সার্চ করুন (যেমন: কারক, Tense, মুদ্রা)...',
        'categories_code': """const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল বিষয়' },
  { id: 'bangla', label: 'বাংলা ব্যাকরণ ও সাহিত্য', matchKey: 'bangla' },
  { id: 'english', label: 'English Grammar & Lit', matchKey: 'english' },
  { id: 'gk', label: 'সাধারণ জ্ঞান (GK)', matchKey: 'gk' },
  { id: 'math', label: 'গণিত ও মানসিক দক্ষতা', matchKey: 'math' }
];""",
        'mapping_code': """          const mapped = catalog.exams.map((exam) => {
            const rawTitle = cleanAmpibianTitle(exam.title);
            const qCount = exam.question_count || 100;

            let timeStr = '১ ঘণ্টা';
            if (qCount >= 180) timeStr = '২ ঘণ্টা';
            else if (qCount >= 140) timeStr = '১ ঘণ্টা ৩০ মিনিট';
            else if (qCount <= 50) timeStr = '৩০ মিনিট';
            else if (qCount <= 80) timeStr = '৪৫ মিনিট';

            const catId = (exam.category_id || '').toLowerCase();
            const catName = exam.category_name || '';

            let displayTag = '';
            if (catId === 'bangla') displayTag = 'বাংলা';
            else if (catId === 'english') displayTag = 'English';
            else if (catId === 'gk') displayTag = 'GK';
            else if (catId === 'math') displayTag = 'Math';

            let subjectStats = 'অ্যাম্ফিবিয়ান চূড়ান্ত সাজেশন';
            if (catId === 'bangla') {
              subjectStats = 'বাংলা ব্যাকরণ, ধ্বনি, বর্ণ, সন্ধি, সমাস ও সাহিত্য সংকলন';
            } else if (catId === 'english') {
              subjectStats = 'English Grammar, Vocabulary, Parts of Speech & Literature';
            } else if (catId === 'gk') {
              subjectStats = 'বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি, ভূ-রাজনীতি ও সাম্প্রতিক তথ্য';
            } else if (catId === 'math') {
              subjectStats = 'পাটিগণিত, বীজগণিত, জ্যামিতি ও মানসিক দক্ষতা শর্টকাট';
            }

            const tags = [
              exam.category_id,
              catName,
              displayTag,
              rawTitle,
              toEnglishNumberStr(rawTitle)
            ].filter(Boolean);

            return {
              id: exam.slug || exam.id,
              slug: exam.slug || exam.id,
              year: rawTitle,
              category: catName || 'অ্যাম্ফিবিয়ান সাজেশন',
              categoryId: catId,
              date: 'সাজেশন',
              yearAD: '২০২৪',
              totalQ: qCount,
              time: timeStr,
              subjectStats: subjectStats,
              status: 'সম্পূর্ণ সমাধানসহ উপলব্ধ',
              tags: tags,
              displayTag: displayTag,
              rawYear: 0,
              rawExam: exam
            };
          });""",
        'scoring_code': """    let editionNum = 0;
    let year = 0;
    const bnMatch = title.match(/([০-৯0-9]+)/);
    if (bnMatch) {
      editionNum = parseInt(toEnglishNumberStr(bnMatch[1]), 10) || 0;
    }"""
    },

    # 2. Biddabari NTRCA
    {
        'file_path': 'src/app/(biddabari-ntrca)/(Layout-smart)/biddabari-ntrca-smart/page.jsx',
        'get_catalog': 'getBiddabariCatalog',
        'clean_title': 'cleanBiddabariTitle',
        'lib_name': 'biddabariData',
        'component_name': 'BiddabariSmart',
        'storage_key': 'ujs_biddabari_smart_filters',
        'route_questions': 'biddabari-ntrca-smart-questions',
        'archive_badge': 'বিদ্যাবাড়ি NTRCA আর্কাইভ',
        'title_main': 'বিদ্যাবাড়ি শিক্ষক নিবন্ধন (NTRCA) স্মার্ট প্রশ্নব্যাংক',
        'desc_sub': 'শিক্ষক নিবন্ধন প্রিলিমিনারি প্রস্তুতির ৬৭টি বিষয়ভিত্তিক লেকচার শিটের পূর্ণাঙ্গ প্রশ্নব্যাংক ও বিস্তারিত ব্যাখ্যা।',
        'search_placeholder': 'লেকচার নম্বর বা বিষয়ের নাম দিয়ে সার্চ করুন (যেমন: লেকচার ০১, Parts of Speech)...',
        'categories_code': """const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল লেকচার' },
  { id: 'bangla', label: 'NTRCA বাংলা লেকচার', matchKey: 'bangla' },
  { id: 'english', label: 'NTRCA ইংরেজি লেকচার', matchKey: 'english' },
  { id: 'gk', label: 'NTRCA সাধারণ জ্ঞান লেকচার', matchKey: 'gk' },
  { id: 'math', label: 'NTRCA গণিত লেকচার', matchKey: 'math' }
];""",
        'mapping_code': """          const mapped = catalog.exams.map((exam) => {
            const rawTitle = cleanBiddabariTitle(exam.title);
            const qCount = exam.question_count || 100;

            let timeStr = '১ ঘণ্টা';
            if (qCount >= 180) timeStr = '২ ঘণ্টা';
            else if (qCount >= 140) timeStr = '১ ঘণ্টা ৩০ মিনিট';
            else if (qCount <= 50) timeStr = '৩০ মিনিট';
            else if (qCount <= 80) timeStr = '৪৫ মিনিট';

            const catId = (exam.category_id || '').toLowerCase();
            const catName = exam.category_name || '';

            let displayTag = '';
            const lecMatch = rawTitle.match(/লেকচার-?\s*([০-৯0-9]+)/);
            if (lecMatch) {
              displayTag = `Lecture-${toEnglishNumberStr(lecMatch[1])}`;
            } else if (catId === 'bangla') displayTag = 'বাংলা';
            else if (catId === 'english') displayTag = 'English';
            else if (catId === 'gk') displayTag = 'GK';
            else if (catId === 'math') displayTag = 'Math';

            let subjectStats = 'বিদ্যাবাড়ি NTRCA শিক্ষক নিবন্ধন প্রস্তুতি';
            if (catId === 'bangla') {
              subjectStats = 'বাংলা লেকচার শিট • Teacher’s Work & Self Study সমাধান';
            } else if (catId === 'english') {
              subjectStats = 'English Lecture Sheet • Grammar Rules & NTRCA MCQ Solution';
            } else if (catId === 'gk') {
              subjectStats = 'সাধারণ জ্ঞান লেকচার শিট • বাংলাদেশ, আন্তর্জাতিক ও সাম্প্রতিক তথ্য';
            } else if (catId === 'math') {
              subjectStats = 'গণিত লেকচার শিট • শর্টকাট টেকনিক, সূত্রাবলি ও বিস্তারিত ব্যাখ্যা';
            }

            const tags = [
              exam.category_id,
              catName,
              displayTag,
              rawTitle,
              toEnglishNumberStr(rawTitle)
            ].filter(Boolean);

            return {
              id: exam.slug || exam.id,
              slug: exam.slug || exam.id,
              year: rawTitle,
              category: catName || 'বিদ্যাবাড়ি NTRCA',
              categoryId: catId,
              date: 'NTRCA',
              yearAD: '২০২৪',
              totalQ: qCount,
              time: timeStr,
              subjectStats: subjectStats,
              status: 'সম্পূর্ণ সমাধানসহ উপলব্ধ',
              tags: tags,
              displayTag: displayTag,
              rawYear: 0,
              rawExam: exam
            };
          });""",
        'scoring_code': """    let editionNum = 0;
    let year = 0;
    const bnMatch = title.match(/লেকচার-?\s*([০-৯0-9]+)/);
    if (bnMatch) {
      editionNum = parseInt(toEnglishNumberStr(bnMatch[1]), 10) || 0;
    }"""
    },

    # 3. Smart AI
    {
        'file_path': 'src/app/(smart-ai)/(Layout-smart)/smart-ai-smart/page.jsx',
        'get_catalog': 'getSmartAiCatalog',
        'clean_title': 'cleanSmartAiTitle',
        'lib_name': 'smartAiData',
        'component_name': 'SmartAiSmart',
        'storage_key': 'ujs_smart_ai_smart_filters',
        'route_questions': 'smart-ai-smart-questions',
        'archive_badge': 'স্মার্ট AI স্পেশাল কালেকশন',
        'title_main': 'স্মার্ট AI (Smart AI) প্রশ্নব্যাংক ও প্রস্তুতি রুম',
        'desc_sub': 'বিপিএসসি টেকনিক্যাল ও নন-ক্যাডার এবং এনটিআরসিএ প্রিলিমিনারির ৮৯টি এআই কিউরেটেড অধ্যায় ও ১৭,১০০+ প্রশ্ন।',
        'search_placeholder': 'বিষয় বা অধ্যায়ের নাম দিয়ে সার্চ করুন (যেমন: ফান্ডামেন্টাল, Sentence, কোড ৪৫২)...',
        'categories_code': """const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল এআই বিষয়' },
  { id: 'bpsc-technical-ai', label: 'BPSC Technical AI (২৫ বিষয়)', matchKey: 'bpsc-technical-ai' },
  { id: 'ntrca-313-and-325-ai', label: 'NTRCA 313 & 325 AI', matchKey: 'ntrca-313-and-325-ai' },
  { id: 'ntrca-452-ai', label: 'NTRCA 452 AI', matchKey: 'ntrca-452-ai' },
  { id: 'ntrca-preliminary-ai', label: 'NTRCA Preliminary AI (৫০ বিষয়)', matchKey: 'ntrca-preliminary-ai' }
];""",
        'mapping_code': """          const mapped = catalog.exams.map((exam) => {
            const rawTitle = cleanSmartAiTitle(exam.title);
            const qCount = exam.question_count || 100;

            let timeStr = '১ ঘণ্টা';
            if (qCount >= 180) timeStr = '২ ঘণ্টা';
            else if (qCount >= 140) timeStr = '১ ঘণ্টা ৩০ মিনিট';
            else if (qCount <= 50) timeStr = '৩০ মিনিট';
            else if (qCount <= 80) timeStr = '৪৫ মিনিট';

            const catId = (exam.category_id || '').toLowerCase();
            const catName = exam.category_name || '';

            let displayTag = '';
            if (catId.includes('bpsc')) displayTag = 'BPSC Tech';
            else if (catId.includes('313')) displayTag = 'NTRCA 313';
            else if (catId.includes('452')) displayTag = 'NTRCA 452';
            else if (catId.includes('preliminary')) displayTag = 'NTRCA Preli';

            const subMatch = rawTitle.match(/(?:বিষয়|অধ্যায়|ইংরেজি|বাংলা|গণিত|সাধারণ জ্ঞান)-?\\s*([০-৯0-9ক-ছ]+)/);
            if (subMatch) {
              displayTag = `${displayTag} #${toEnglishNumberStr(subMatch[1])}`;
            }

            let subjectStats = 'এআই কিউরেটেড অধ্যায়ভিত্তিক সম্পূর্ণ প্রশ্নব্যাংক';
            if (catId.includes('bpsc')) {
              subjectStats = 'BPSC কম্পিউটার সায়েন্স, আইসিটি ও টেকনিক্যাল নন-ক্যাডার';
            } else if (catId.includes('313')) {
              subjectStats = 'শিক্ষক নিবন্ধন আইসিটি ও কম্পিউটার অপারেশন স্পেশাল';
            } else if (catId.includes('452')) {
              subjectStats = 'শিক্ষক নিবন্ধন ৪৫২ কোড কম্পিউটার সাইন্স ও আইসিটি প্রস্তুতি';
            } else if (catId.includes('preliminary')) {
              subjectStats = '৫০টি বিষয়ভিত্তিক টপিক, ১০,০০০টি বাছাইকৃত প্রশ্ন ও ব্যাখ্যা';
            }

            const tags = [
              exam.category_id,
              catName,
              displayTag,
              rawTitle,
              toEnglishNumberStr(rawTitle)
            ].filter(Boolean);

            return {
              id: exam.slug || exam.id,
              slug: exam.slug || exam.id,
              year: rawTitle,
              category: catName || 'স্মার্ট AI',
              categoryId: catId,
              date: 'AI Special',
              yearAD: '২০২৪',
              totalQ: qCount,
              time: timeStr,
              subjectStats: subjectStats,
              status: 'সম্পূর্ণ সমাধানসহ উপলব্ধ',
              tags: tags,
              displayTag: displayTag,
              rawYear: 0,
              rawExam: exam
            };
          });""",
        'scoring_code': """    let editionNum = 0;
    let year = 0;
    const bnMatch = title.match(/(?:বিষয়|অধ্যায়|ইংরেজি|বাংলা|গণিত|সাধারণ জ্ঞান)-?\\s*([০-৯0-9]+)/);
    if (bnMatch) {
      editionNum = parseInt(toEnglishNumberStr(bnMatch[1]), 10) || 0;
    }"""
    },

    # 4. ICT Smart
    {
        'file_path': 'src/app/(ict)/(Layout-smart)/ict-smart/page.jsx',
        'get_catalog': 'getIctCatalog',
        'clean_title': 'cleanIctTitle',
        'lib_name': 'ictData',
        'component_name': 'IctSmart',
        'storage_key': 'ujs_ict_smart_filters',
        'route_questions': 'ict-smart-questions',
        'archive_badge': 'আইসিটি প্রশ্নব্যাংক আর্কাইভ',
        'title_main': 'আইসিটি (ICT) স্মার্ট প্রশ্নব্যাংক ও প্রস্তুতি',
        'desc_sub': 'Class 9-10 কম্পিউটার জিকে ও এনটিআরসিএ আইসিটি উইজার্ড-এর অধ্যায়ভিত্তিক স্মার্ট প্রস্তুতি ও পূর্ণাঙ্গ সমাধান।',
        'search_placeholder': 'অধ্যায়ের নাম দিয়ে সার্চ করুন (যেমন: ইতিহাস, ডাটাবেজ, নেটওয়ার্ক)...',
        'categories_code': """const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল অধ্যায়' },
  { id: 'class-9-10-computer-gk', label: 'Class 9-10 Computer GK', matchKey: 'class-9-10-computer-gk' },
  { id: 'ict-wizard-ntrca-313-and-325', label: 'ICT Wizard NTRCA (313 & 325)', matchKey: 'ict-wizard-ntrca-313-and-325' }
];""",
        'mapping_code': """          const mapped = catalog.exams.map((exam) => {
            const rawTitle = cleanIctTitle(exam.title);
            const qCount = exam.question_count || 100;

            let timeStr = '১ ঘণ্টা';
            if (qCount >= 180) timeStr = '২ ঘণ্টা';
            else if (qCount >= 140) timeStr = '১ ঘণ্টা ৩০ মিনিট';
            else if (qCount <= 50) timeStr = '৩০ মিনিট';
            else if (qCount <= 80) timeStr = '৪৫ মিনিট';

            const catId = (exam.category_id || '').toLowerCase();
            const catName = exam.category_name || '';

            let displayTag = '';
            const chMatch = rawTitle.match(/অধ্যায়-?\\s*([০-৯0-9ক-ছ]+)/);
            if (chMatch) {
              displayTag = `অধ্যায় ${chMatch[1]}`;
            } else if (catId.includes('class-9-10')) {
              displayTag = 'Class 9-10';
            } else {
              displayTag = 'NTRCA';
            }

            let subjectStats = catId.includes('class-9-10')
              ? 'নবম-দশম শ্রেণির কম্পিউটার ও তথ্যপ্রযুক্তি পূর্ণাঙ্গ সমাধান'
              : 'এনটিআরসিএ আইসিটি প্রভাষক ও শিক্ষক নিবন্ধন প্রস্তুতি';

            const tags = [
              exam.category_id,
              catName,
              displayTag,
              rawTitle,
              toEnglishNumberStr(rawTitle)
            ].filter(Boolean);

            return {
              id: exam.slug || exam.id,
              slug: exam.slug || exam.id,
              year: rawTitle,
              category: catName || 'আইসিটি',
              categoryId: catId,
              date: 'আইসিটি',
              yearAD: '২০২৪',
              totalQ: qCount,
              time: timeStr,
              subjectStats: subjectStats,
              status: 'সম্পূর্ণ সমাধানসহ উপলব্ধ',
              tags: tags,
              displayTag: displayTag,
              rawYear: 0,
              rawExam: exam
            };
          });""",
        'scoring_code': """    let editionNum = 0;
    let year = 0;
    const bnMatch = title.match(/অধ্যায়-?\\s*([০-৯0-9]+)/);
    if (bnMatch) {
      editionNum = parseInt(toEnglishNumberStr(bnMatch[1]), 10) || 0;
    }"""
    }
]

# Replacement blocks from master
master_import = "import { getExamsCatalog, cleanExamTitle } from '../../../../lib/examsData';"
master_categories = """const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল' },
  { id: 'bcs', label: 'বিসিএস প্রিলি', matchKey: 'bcs' },
  { id: 'bank', label: 'ব্যাংক জবস', matchKey: 'bank' },
  { id: 'primary', label: 'প্রাথমিক শিক্ষক', matchKey: 'primary' },
  { id: 'ntrca', label: 'শিক্ষক নিবন্ধন', matchKey: 'ntrca' },
  { id: 'ministry', label: 'মন্ত্রণালয় ও নন-ক্যাডার', matchKey: 'ministry' },
  { id: 'admission', label: 'ভর্তি পরীক্ষা', matchKey: 'admission' },
  { id: 'subject', label: 'বিষয়ভিত্তিক', matchKey: 'subject' }
];"""

master_mapping_start = "          const mapped = catalog.exams.map((exam) => {"
master_mapping_end = "          setBankData(mapped);"

master_scoring_start = "    // 1. BCS / Registration Edition Number"
master_scoring_end = "    return { editionNum, year, idNum };"

for cfg in configs:
    code = master_tpl

    # 1. Imports
    code = code.replace(master_import, f"import {{ {cfg['get_catalog']} as getExamsCatalog, {cfg['clean_title']} as cleanExamTitle }} from '../../../../lib/{cfg['lib_name']}';")
    code = code.replace('cleanExamTitle', cfg['clean_title'])
    code = code.replace('getExamsCatalog', cfg['get_catalog'])

    # 2. Categories
    code = code.replace(master_categories, cfg['categories_code'])

    # 3. Component Name
    code = code.replace('QuestionBankSmartContent', f"{cfg['component_name']}Content")
    code = code.replace('QuestionBankSmartPage', f"{cfg['component_name']}Page")

    # 4. Storage Key
    code = code.replace('ujs_qbank_smart_filters', cfg['storage_key'])

    # 5. Mapping block
    # Find start and end of mapped = catalog.exams.map
    m_start = code.find("const mapped = catalog.exams.map((exam) => {")
    m_end = code.find("setBankData(mapped);", m_start)
    assert m_start != -1 and m_end != -1, f"Mapping block not found for {cfg['file_path']}"
    code = code[:m_start - 10] + cfg['mapping_code'] + '\n\n          ' + code[m_end:]

    # 6. Scoring block in getExamSortScore
    s_start = code.find("    // 1. BCS / Registration Edition Number")
    s_end = code.find("    return { editionNum, year, idNum };", s_start)
    assert s_start != -1 and s_end != -1, f"Scoring block not found for {cfg['file_path']}"
    code = code[:s_start] + cfg['scoring_code'] + '\n    ' + code[s_end:]

    # 7. Navigation action
    code = code.replace('/question-bank-smart-questions/', f"/{cfg['route_questions']}/")

    # 8. Header badges and texts
    code = code.replace('<span>প্রশ্নব্যাংক আর্কাইভ</span>', f"<span>{cfg['archive_badge']}</span>")
    code = code.replace('বিগত সালের প্রশ্ন ও নির্ভুল ব্যাখ্যা', cfg['title_main'])
    code = code.replace('বিসিএস, ব্যাংক, প্রাথমিক শিক্ষক ও NTRCA শিক্ষক নিবন্ধন পরীক্ষার বিগত প্রশ্ন সমাধান পড়ুন অথবা সরাসরি পরীক্ষা দিন।', cfg['desc_sub'])

    # 9. Search placeholder
    code = code.replace('placeholder="বাংলা বা ইংরেজিতে সার্চ করুন (যেমন: bcs, bank, shikkhok, 45)..."', f'placeholder="{cfg["search_placeholder"]}"')

    # 10. Meta row: replace date with category if needed, or keep clean
    code = code.replace("<span><strong>সাল:</strong> {item.date}</span>", "<span><strong>ক্যাটাগরি:</strong> {item.category}</span>")

    with open(cfg['file_path'], 'w', encoding='utf-8') as f:
        f.write(code)

    print(f"Successfully generated 100% matched smart page: {cfg['file_path']}")

print("All Smart pages rebuilt successfully!")
