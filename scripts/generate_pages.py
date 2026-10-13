import os
import shutil
import re

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path, exist_ok=True)

# Common styles
ict_smart_css = os.path.join('src', 'app', '(ict)', '(Layout-smart)', 'ict-smart', 'style.css')
ict_smart_q_css = os.path.join('src', 'app', '(ict)', '(Layout-smart)', 'ict-smart-questions', 'style.css')

with open(ict_smart_css, 'r', encoding='utf-8') as f:
    smart_css = f.read()

with open(ict_smart_q_css, 'r', encoding='utf-8') as f:
    smart_q_css = f.read()

with open('src/app/(ict)/(Layout-box)/ict/page.jsx', 'r', encoding='utf-8') as f:
    tpl_dir = f.read()

with open('src/app/(ict)/(Layout-box)/ict-practice/page.jsx', 'r', encoding='utf-8') as f:
    tpl_practice = f.read()

with open('src/app/(ict)/(Layout-box)/ict-model-test/page.jsx', 'r', encoding='utf-8') as f:
    tpl_model = f.read()

with open('src/app/(ict)/(Layout-smart)/ict-smart/page.jsx', 'r', encoding='utf-8') as f:
    tpl_smart = f.read()

with open('src/app/(ict)/(Layout-smart)/ict-smart-questions/page.jsx', 'r', encoding='utf-8') as f:
    tpl_smart_q = f.read()

modules = [
    {
        'id': 'ampibian',
        'dir_name': '(ampibian-suggestion)',
        'route_prefix': 'ampibian-suggestion',
        'lib_name': 'ampibianData',
        'get_catalog': 'getAmpibianCatalog',
        'clean_title': 'cleanAmpibianTitle',
        'load_questions': 'loadAmpibianQuestions',
        'component_prefix': 'Ampibian',
        'storage_cat': 'ujs_ampibian_filter_cat',
        'storage_smart': 'ujs_ampibian_smart_filters',
        'preset_active': 'topmcqbd_ampibian_active_preset',
        'preset_profiles': 'topmcqbd_ampibian_preset_profiles',
        'badge_name': 'অ্যাম্ফিবিয়ান সাজেশন',
        'title_name': 'অ্যাম্ফিবিয়ান সাজেশন প্রশ্নব্যাংক',
        'subtitle_name': 'বাংলা, ইংরেজি, সাধারণ জ্ঞান ও গণিত বিষয়ের ৮৪টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও নির্ভুল সমাধান।',
        'login_subtitle': 'অ্যাম্ফিবিয়ান সাজেশন প্রশ্নব্যাংক অনুশীলন ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন।',
        'smart_categories_code': """const DEFAULT_CATEGORIES = [
  { id: 'bangla', label: 'বাংলা ভাষা ও সাহিত্য', matchKey: 'bangla' },
  { id: 'english', label: 'ইংরেজি (English)', matchKey: 'english' },
  { id: 'gk', label: 'সাধারণ জ্ঞান (GK)', matchKey: 'gk' },
  { id: 'math', label: 'গণিত ও মানসিক দক্ষতা', matchKey: 'math' }
];""",
        'default_smart_cat': 'bangla',
        'accent_badge_color': 'var(--emerald-600)'
    },
    {
        'id': 'biddabari',
        'dir_name': '(biddabari-ntrca)',
        'route_prefix': 'biddabari-ntrca',
        'lib_name': 'biddabariData',
        'get_catalog': 'getBiddabariCatalog',
        'clean_title': 'cleanBiddabariTitle',
        'load_questions': 'loadBiddabariQuestions',
        'component_prefix': 'Biddabari',
        'storage_cat': 'ujs_biddabari_filter_cat',
        'storage_smart': 'ujs_biddabari_smart_filters',
        'preset_active': 'topmcqbd_biddabari_active_preset',
        'preset_profiles': 'topmcqbd_biddabari_preset_profiles',
        'badge_name': 'বিদ্যাবাড়ি NTRCA',
        'title_name': 'বিদ্যাবাড়ি NTRCA প্রশ্নব্যাংক',
        'subtitle_name': 'শিক্ষক নিবন্ধন (NTRCA) প্রিলিমিনারি প্রস্তুতির ৬৭টি লেকচার শিটের বিষয়ভিত্তিক পূর্ণাঙ্গ প্রশ্নব্যাংক ও সমাধান।',
        'login_subtitle': 'বিদ্যাবাড়ি শিক্ষক নিবন্ধন প্রশ্নব্যাংক অনুশীলন ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন।',
        'smart_categories_code': """const DEFAULT_CATEGORIES = [
  { id: 'bangla', label: 'NTRCA বাংলা লেকচার', matchKey: 'bangla' },
  { id: 'english', label: 'NTRCA ইংরেজি লেকচার', matchKey: 'english' },
  { id: 'gk', label: 'NTRCA সাধারণ জ্ঞান লেকচার', matchKey: 'gk' },
  { id: 'math', label: 'NTRCA গণিত লেকচার', matchKey: 'math' }
];""",
        'default_smart_cat': 'bangla',
        'accent_badge_color': 'var(--emerald-600)'
    },
    {
        'id': 'smartai',
        'dir_name': '(smart-ai)',
        'route_prefix': 'smart-ai',
        'lib_name': 'smartAiData',
        'get_catalog': 'getSmartAiCatalog',
        'clean_title': 'cleanSmartAiTitle',
        'load_questions': 'loadSmartAiQuestions',
        'component_prefix': 'SmartAi',
        'storage_cat': 'ujs_smart_ai_filter_cat',
        'storage_smart': 'ujs_smart_ai_smart_filters',
        'preset_active': 'topmcqbd_smartai_active_preset',
        'preset_profiles': 'topmcqbd_smartai_preset_profiles',
        'badge_name': 'স্মার্ট AI প্রশ্নব্যাংক',
        'title_name': 'স্মার্ট AI (Smart AI) প্রশ্নব্যাংক',
        'subtitle_name': 'BPSC টেকনিক্যাল ও নন-ক্যাডার এবং NTRCA প্রিলিমিনারি ও আইসিটি বিষয়ের ৮৯টি এআই কিউরেটেড অধ্যায় ও ১৭,১০০+ প্রশ্ন।',
        'login_subtitle': 'স্মার্ট AI প্রশ্নব্যাংক অনুশীলন ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন।',
        'smart_categories_code': """const DEFAULT_CATEGORIES = [
  { id: 'bpsc-technical-ai', label: 'BPSC Technical AI', matchKey: 'bpsc-technical-ai' },
  { id: 'ntrca-313-and-325-ai', label: 'NTRCA 313 & 325 AI', matchKey: 'ntrca-313-and-325-ai' },
  { id: 'ntrca-452-ai', label: 'NTRCA 452 AI', matchKey: 'ntrca-452-ai' },
  { id: 'ntrca-preliminary-ai', label: 'NTRCA Preliminary AI (৫০ বিষয়)', matchKey: 'ntrca-preliminary-ai' }
];""",
        'default_smart_cat': 'bpsc-technical-ai',
        'accent_badge_color': 'var(--emerald-600)'
    }
]

for m in modules:
    base_box = os.path.join('src', 'app', m['dir_name'], '(Layout-box)')
    base_smart = os.path.join('src', 'app', m['dir_name'], '(Layout-smart)')
    
    # Paths for 7 files
    p_dir = os.path.join(base_box, m['route_prefix'], 'page.jsx')
    p_prac = os.path.join(base_box, f"{m['route_prefix']}-practice", 'page.jsx')
    p_model = os.path.join(base_box, f"{m['route_prefix']}-model-test", 'page.jsx')
    p_smart = os.path.join(base_smart, f"{m['route_prefix']}-smart", 'page.jsx')
    p_smart_css = os.path.join(base_smart, f"{m['route_prefix']}-smart", 'style.css')
    p_smart_q = os.path.join(base_smart, f"{m['route_prefix']}-smart-questions", 'page.jsx')
    p_smart_q_css = os.path.join(base_smart, f"{m['route_prefix']}-smart-questions", 'style.css')

    for p in [p_dir, p_prac, p_model, p_smart, p_smart_css, p_smart_q, p_smart_q_css]:
        ensure_dir(os.path.dirname(p))

    # Write CSS files
    with open(p_smart_css, 'w', encoding='utf-8') as f:
        f.write(smart_css)
    with open(p_smart_q_css, 'w', encoding='utf-8') as f:
        f.write(smart_q_css)

    # 1. Directory Page
    code_dir = tpl_dir
    code_dir = code_dir.replace("import { getIctCatalog, cleanIctTitle } from '../../../../lib/ictData';", 
                                f"import {{ {m['get_catalog']}, {m['clean_title']} }} from '../../../../lib/{m['lib_name']}';")
    code_dir = code_dir.replace('getIctCatalog', m['get_catalog'])
    code_dir = code_dir.replace('cleanIctTitle', m['clean_title'])
    code_dir = code_dir.replace('IctDirectoryContent', f"{m['component_prefix']}DirectoryContent")
    code_dir = code_dir.replace('IctPage', f"{m['component_prefix']}Page")
    code_dir = code_dir.replace('ujs_ict_filter_cat', m['storage_cat'])
    code_dir = code_dir.replace('/ict-practice?', f"/{m['route_prefix']}-practice?")
    code_dir = code_dir.replace('/ict-model-test?', f"/{m['route_prefix']}-model-test?")
    code_dir = code_dir.replace("আইসিটি প্রশ্নব্যাংক", m['badge_name'])
    code_dir = code_dir.replace("আইসিটি ও কম্পিউটার প্রশ্নব্যাংক", m['title_name'])
    code_dir = code_dir.replace("Class 9-10 কম্পিউটার জিকে ও এনটিআরসিএ আইসিটি উইজার্ড-এর অধ্যায়ভিত্তিক প্রশ্ন ও ব্যাখ্যা অনুশীলন করুন।", m['subtitle_name'])
    code_dir = code_dir.replace("আইসিটি ও কম্পিউটার প্রশ্নব্যাংক অনুশীলন ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন।", m['login_subtitle'])
    code_dir = code_dir.replace("'১৭'", "''")
    with open(p_dir, 'w', encoding='utf-8') as f:
        f.write(code_dir)

    # 2. Practice Page
    code_prac = tpl_practice
    code_prac = code_prac.replace("import { loadIctQuestions, cleanIctTitle } from '../../../../lib/ictData';",
                                  f"import {{ {m['load_questions']}, {m['clean_title']} }} from '../../../../lib/{m['lib_name']}';")
    code_prac = code_prac.replace('loadIctQuestions', m['load_questions'])
    code_prac = code_prac.replace('cleanIctTitle', m['clean_title'])
    code_prac = code_prac.replace('IctPracticeContent', f"{m['component_prefix']}PracticeContent")
    code_prac = code_prac.replace('IctPracticePage', f"{m['component_prefix']}PracticePage")
    code_prac = code_prac.replace("href=\"/ict\"", f"href=\"/{m['route_prefix']}\"")
    code_prac = code_prac.replace("/ict-practice/", f"/{m['route_prefix']}-practice/")
    code_prac = code_prac.replace("/ict-model-test", f"/{m['route_prefix']}-model-test")
    code_prac = code_prac.replace("targetUrl=\"/ict\"", f"targetUrl=\"/{m['route_prefix']}\"")
    code_prac = code_prac.replace("targetLabel=\"পরীক্ষা নির্বাচন করুন (/ict)\"", f"targetLabel=\"পরীক্ষা নির্বাচন করুন (/{m['route_prefix']})\"")
    code_prac = code_prac.replace("ICT Practice", f"{m['badge_name']} প্র্যাকটিস")
    code_prac = code_prac.replace("আইসিটি অধ্যায় নির্বাচন", "পরীক্ষা নির্বাচন")
    with open(p_prac, 'w', encoding='utf-8') as f:
        f.write(code_prac)

    # 3. Model Test Page
    code_model = tpl_model
    code_model = code_model.replace("import { loadIctQuestions, cleanIctTitle } from '../../../../lib/ictData';",
                                    f"import {{ {m['load_questions']}, {m['clean_title']} }} from '../../../../lib/{m['lib_name']}';")
    code_model = code_model.replace('loadIctQuestions', m['load_questions'])
    code_model = code_model.replace('cleanIctTitle', m['clean_title'])
    code_model = code_model.replace('IctModelTestContent', f"{m['component_prefix']}ModelTestContent")
    code_model = code_model.replace('IctModelTestPage', f"{m['component_prefix']}ModelTestPage")
    code_model = code_model.replace("href=\"/ict\"", f"href=\"/{m['route_prefix']}\"")
    code_model = code_model.replace("/ict-model-test/", f"/{m['route_prefix']}-model-test/")
    code_model = code_model.replace("/ict-practice", f"/{m['route_prefix']}-practice")
    code_model = code_model.replace("targetUrl=\"/ict\"", f"targetUrl=\"/{m['route_prefix']}\"")
    code_model = code_model.replace("targetLabel=\"পরীক্ষা নির্বাচন করুন (/ict)\"", f"targetLabel=\"পরীক্ষা নির্বাচন করুন (/{m['route_prefix']})\"")
    code_model = code_model.replace("ICT লাইভ মডেল টেস্ট", f"{m['badge_name']} লাইভ মডেল টেস্ট")
    code_model = code_model.replace("আইসিটি লাইভ মডেল টেস্ট", f"{m['badge_name']} লাইভ মডেল টেস্ট")
    code_model = code_model.replace("আইসিটি অধ্যায় নির্বাচন", "পরীক্ষা নির্বাচন")
    with open(p_model, 'w', encoding='utf-8') as f:
        f.write(code_model)

    # 4. Smart Page
    code_smart = tpl_smart
    code_smart = code_smart.replace("import { getIctCatalog, cleanIctTitle } from '../../../../lib/ictData';",
                                    f"import {{ {m['get_catalog']}, {m['clean_title']} }} from '../../../../lib/{m['lib_name']}';")
    code_smart = code_smart.replace('getIctCatalog', m['get_catalog'])
    code_smart = code_smart.replace('cleanIctTitle', m['clean_title'])
    code_smart = code_smart.replace('IctSmartContent', f"{m['component_prefix']}SmartContent")
    code_smart = code_smart.replace('IctSmartPage', f"{m['component_prefix']}SmartPage")
    code_smart = code_smart.replace('ujs_ict_smart_filters', m['storage_smart'])
    code_smart = code_smart.replace('/ict-smart-questions/', f"/{m['route_prefix']}-smart-questions/")
    code_smart = code_smart.replace("href=\"/ict\"", f"href=\"/{m['route_prefix']}\"")
    code_smart = code_smart.replace("initialCategory = searchParams.get('category') || 'class-9-10-computer-gk'",
                                    f"initialCategory = searchParams.get('category') || '{m['default_smart_cat']}'")
    code_smart = code_smart.replace("setCurrentTag('class-9-10-computer-gk');",
                                    f"setCurrentTag('{m['default_smart_cat']}');")
    
    # Replace DEFAULT_CATEGORIES
    def_cat_target = """const DEFAULT_CATEGORIES = [
  { id: 'class-9-10-computer-gk', label: 'Class 9-10 Computer GK', matchKey: 'class-9-10-computer-gk' },
  { id: 'ict-wizard-ntrca-313-and-325', label: 'ICT Wizard NTRCA (313 & 325)', matchKey: 'ict-wizard-ntrca-313-and-325' }
];"""
    code_smart = code_smart.replace(def_cat_target, m['smart_categories_code'])
    code_smart = code_smart.replace("আইসিটি স্মার্ট প্রশ্নব্যাংক", f"{m['badge_name']} স্মার্ট প্রশ্নব্যাংক")
    code_smart = code_smart.replace("আইসিটি ও কম্পিউটার স্মার্ট প্রশ্নব্যাংক", f"{m['badge_name']} স্মার্ট প্রশ্নব্যাংক")
    code_smart = code_smart.replace("আইসিটি স্মার্ট", f"{m['badge_name']} স্মার্ট")
    code_smart = code_smart.replace("বক্স লেআউট (/ict)", f"বক্স লেআউট (/{m['route_prefix']})")
    
    # Replace subheadings / titles
    code_smart = code_smart.replace("Class 9-10 কম্পিউটার জিকে ও এনটিআরসিএ আইসিটি উইজার্ড-এর অধ্যায়ভিত্তিক স্মার্ট প্রস্তুতি ও পূর্ণাঙ্গ সমাধান।", m['subtitle_name'])
    code_smart = code_smart.replace("বক্স লেআউট তালিকা (/ict)", f"বক্স লেআউট তালিকা (/{m['route_prefix']})")
    with open(p_smart, 'w', encoding='utf-8') as f:
        f.write(code_smart)

    # 5. Smart Questions Page
    code_smart_q = tpl_smart_q
    code_smart_q = code_smart_q.replace("import { loadIctQuestions as loadExamQuestions, cleanIctTitle as cleanExamTitle } from '../../../../lib/ictData';",
                                        f"import {{ {m['load_questions']} as loadExamQuestions, {m['clean_title']} as cleanExamTitle }} from '../../../../lib/{m['lib_name']}';")
    code_smart_q = code_smart_q.replace('IctSmartQuestionsContent', f"{m['component_prefix']}SmartQuestionsContent")
    code_smart_q = code_smart_q.replace('IctSmartQuestionsPage', f"{m['component_prefix']}SmartQuestionsPage")
    code_smart_q = code_smart_q.replace('topmcqbd_ict_active_preset', m['preset_active'])
    code_smart_q = code_smart_q.replace('topmcqbd_ict_preset_profiles', m['preset_profiles'])
    code_smart_q = code_smart_q.replace('/ict-smart/', f"/{m['route_prefix']}-smart/")
    code_smart_q = code_smart_q.replace('/ict-smart', f"/{m['route_prefix']}-smart")
    code_smart_q = code_smart_q.replace('/ict-smart-questions/', f"/{m['route_prefix']}-smart-questions/")
    code_smart_q = code_smart_q.replace('targetUrl="/ict-smart"', f'targetUrl="/{m["route_prefix"]}-smart"')
    code_smart_q = code_smart_q.replace('targetUrl: "/ict-smart"', f'targetUrl: "/{m["route_prefix"]}-smart"')
    code_smart_q = code_smart_q.replace("আইসিটি অধ্যায় নির্বাচন করুন", "পরীক্ষা নির্বাচন করুন")
    code_smart_q = code_smart_q.replace("আইসিটি প্রশ্ন", f"{m['badge_name']} প্রশ্ন")
    
    # In searchParams, allow exam, subject, chapter, category, slug
    code_smart_q = code_smart_q.replace("const examSlug = searchParams.get('exam') || searchParams.get('chapter') || searchParams.get('category') || searchParams.get('slug') || '';",
                                        "const examSlug = searchParams.get('exam') || searchParams.get('subject') || searchParams.get('chapter') || searchParams.get('category') || searchParams.get('slug') || '';")
    with open(p_smart_q, 'w', encoding='utf-8') as f:
        f.write(code_smart_q)

    print(f"Generated all 7 files for {m['id']} ({m['dir_name']})")

print("All module pages successfully generated!")
