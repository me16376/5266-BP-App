import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path, exist_ok=True)

# Read base templates from ampibian-suggestion
with open('src/app/(ampibian-suggestion)/(Layout-box)/ampibian-suggestion/page.jsx', 'r', encoding='utf-8') as f:
    tpl_dir = f.read()

with open('src/app/(ampibian-suggestion)/(Layout-box)/ampibian-suggestion-practice/page.jsx', 'r', encoding='utf-8') as f:
    tpl_prac = f.read()

with open('src/app/(ampibian-suggestion)/(Layout-box)/ampibian-suggestion-model-test/page.jsx', 'r', encoding='utf-8') as f:
    tpl_model = f.read()

with open('src/app/(ampibian-suggestion)/(Layout-smart)/ampibian-suggestion-smart/page.jsx', 'r', encoding='utf-8') as f:
    tpl_smart = f.read()

with open('src/app/(ampibian-suggestion)/(Layout-smart)/ampibian-suggestion-smart/style.css', 'r', encoding='utf-8') as f:
    smart_css = f.read()

with open('src/app/(ampibian-suggestion)/(Layout-smart)/ampibian-suggestion-smart-questions/page.jsx', 'r', encoding='utf-8') as f:
    tpl_smart_q = f.read()

with open('src/app/(ampibian-suggestion)/(Layout-smart)/ampibian-suggestion-smart-questions/style.css', 'r', encoding='utf-8') as f:
    smart_q_css = f.read()

modules = [
    # 1. BUET Pattern Suggestion
    {
        'id': 'buet',
        'dir_name': '(buet-pattern-suggestion)',
        'route_prefix': 'buet-pattern-suggestion',
        'lib_name': 'buetPatternData',
        'get_catalog': 'getBuetPatternCatalog',
        'clean_title': 'cleanBuetPatternTitle',
        'load_questions': 'loadBuetPatternQuestions',
        'component_prefix': 'BuetPattern',
        'storage_cat': 'ujs_buet_pattern_filter_cat',
        'storage_smart': 'ujs_buet_pattern_smart_filters',
        'preset_active': 'topmcqbd_buet_pattern_active_preset',
        'preset_profiles': 'topmcqbd_buet_pattern_preset_profiles',
        'badge_name': 'বুয়েট প্যাটার্ন সাজেশন',
        'title_name': 'বুয়েট প্যাটার্ন সাজেশন প্রশ্নব্যাংক',
        'subtitle_name': 'বুয়েট প্যাটার্ন বিভিন্ন নিয়োগ পরীক্ষার জন্য বাংলা, ইংরেজি, সাধারণ জ্ঞান ও গণিত বিষয়ের ৫৭টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও নির্ভুল সমাধান।',
        'login_subtitle': 'বুয়েট প্যাটার্ন সাজেশন প্রশ্নব্যাংক অনুশীলন ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন।',
        'date_badge': 'বুয়েট প্যাটার্ন',
        'smart_categories_code': """const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল বিষয়' },
  { id: 'bangla', label: 'বাংলা ভাষা ও সাহিত্য', matchKey: 'bangla' },
  { id: 'english', label: 'English Language & Lit', matchKey: 'english' },
  { id: 'gk', label: 'সাধারণ জ্ঞান (GK & ICT)', matchKey: 'gk' },
  { id: 'math', label: 'গণিত ও ক্যালকুলাস', matchKey: 'math' }
];""",
        'subject_stats_code': """            let subjectStats = 'বুয়েট প্যাটার্ন চূড়ান্ত সাজেশন ও সমাধান';
            if (catId === 'bangla') {
              subjectStats = 'বাংলা ব্যাকরণ, পরিভাষা, উপসর্গ, সন্ধি, সমাস ও সাহিত্য সংকলন';
            } else if (catId === 'english') {
              subjectStats = 'English Grammar, Vocabulary, Appropriate Words & Literature';
            } else if (catId === 'gk') {
              subjectStats = 'বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি, কম্পিউটার ও তথ্যপ্রযুক্তি, খেলাধুলা';
            } else if (catId === 'math') {
              subjectStats = 'পাটিগণিত, বীজগণিত, জ্যামিতি, ত্রিকোণমিতি ও ক্যালকুলাস নির্ভুল সমাধান';
            }""",
        'search_placeholder': 'অধ্যায় বা বিষয়ের নাম দিয়ে সার্চ করুন (যেমন: উপসর্গ, Article, ক্যালকুলাস)...',
        'archive_badge': 'বুয়েট প্যাটার্ন আর্কাইভ'
    },

    # 2. BPSC Non Tech Questions
    {
        'id': 'bpscq',
        'dir_name': '(bpsc-non-tech-questions)',
        'route_prefix': 'bpsc-non-tech-questions',
        'lib_name': 'bpscNonTechQuestionsData',
        'get_catalog': 'getBpscNonTechQuestionsCatalog',
        'clean_title': 'cleanBpscNonTechQuestionsTitle',
        'load_questions': 'loadBpscNonTechQuestionsQuestions',
        'component_prefix': 'BpscNonTechQuestions',
        'storage_cat': 'ujs_bpscq_filter_cat',
        'storage_smart': 'ujs_bpscq_smart_filters',
        'preset_active': 'topmcqbd_bpscq_active_preset',
        'preset_profiles': 'topmcqbd_bpscq_preset_profiles',
        'badge_name': 'BPSC নন-টেক প্রশ্নব্যাংক',
        'title_name': 'BPSC নন-টেক পূর্ণাঙ্গ প্রশ্নব্যাংক',
        'subtitle_name': 'বিপিএসসি নন-ক্যাডার ও নন-টেক নিয়োগ পরীক্ষার ৭টি বিষয়ের ৫,৬৬৪টি বিগত ও অতি গুরুত্বপূর্ণ প্রশ্ন ও সমাধান।',
        'login_subtitle': 'বিপিএসসি নন-টেক প্রশ্নব্যাংক অনুশীলন ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন।',
        'date_badge': 'বিগত প্রশ্ন',
        'smart_categories_code': """const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল বিষয়' },
  { id: 'bangla', label: 'বাংলা (১,২৪৮ প্রশ্ন)', matchKey: 'bangla' },
  { id: 'english', label: 'English (১,৫৫৮ প্রশ্ন)', matchKey: 'english' },
  { id: 'math', label: 'গণিত (১,০০৩ প্রশ্ন)', matchKey: 'math' },
  { id: 'bangladesh-affairs', label: 'বাংলাদেশ বিষয়াবলি (৬১৩ প্রশ্ন)', matchKey: 'bangladesh-affairs' },
  { id: 'international-affairs', label: 'আন্তর্জাতিক বিষয়াবলি (৫৪০ প্রশ্ন)', matchKey: 'international-affairs' },
  { id: 'science', label: 'সাধারণ বিজ্ঞান (৫৪৫ প্রশ্ন)', matchKey: 'science' },
  { id: 'ict', label: 'তথ্য ও প্রযুক্তি (১৫৭ প্রশ্ন)', matchKey: 'ict' }
];""",
        'subject_stats_code': """            let subjectStats = 'বিপিএসসি নন-ক্যাডার ও নন-টেক পূর্ণাঙ্গ প্রশ্নব্যাংক';
            if (catId === 'bangla') {
              subjectStats = 'বিপিএসসি নন-টেক বিগত ও বাছাইকৃত ১,২৪৮টি বাংলা প্রশ্ন ও সমাধান';
            } else if (catId === 'english') {
              subjectStats = 'বিপিএসসি নন-টেক বিগত ও বাছাইকৃত ১,৫৫৮টি English প্রশ্ন ও সমাধান';
            } else if (catId === 'math') {
              subjectStats = 'বিপিএসসি নন-টেক বিগত ও বাছাইকৃত ১,০০৩টি গণিত প্রশ্ন ও সমাধান';
            } else if (catId === 'bangladesh-affairs') {
              subjectStats = 'বিপিএসসি নন-টেক বিগত ও বাছাইকৃত ৬১৩টি বাংলাদেশ বিষয়াবলি প্রশ্ন';
            } else if (catId === 'international-affairs') {
              subjectStats = 'বিপিএসসি নন-টেক বিগত ও বাছাইকৃত ৫৪০টি আন্তর্জাতিক বিষয়াবলি প্রশ্ন';
            } else if (catId === 'science') {
              subjectStats = 'বিপিএসসি নন-টেক বিগত ও বাছাইকৃত ৫৪৫টি সাধারণ বিজ্ঞান প্রশ্ন';
            } else if (catId === 'ict') {
              subjectStats = 'বিপিএসসি নন-টেক বিগত ও বাছাইকৃত ১৫৭টি কম্পিউটার ও তথ্যপ্রযুক্তি প্রশ্ন';
            }""",
        'search_placeholder': 'বিষয়ের নাম দিয়ে সার্চ করুন (যেমন: বাংলা, English, Math, Science)...',
        'archive_badge': 'BPSC নন-টেক মাস্টার আর্কাইভ'
    },

    # 3. BPSC Non Tech Suggestion
    {
        'id': 'bpscs',
        'dir_name': '(bpsc-non-tech-suggestion)',
        'route_prefix': 'bpsc-non-tech-suggestion',
        'lib_name': 'bpscNonTechSuggestionData',
        'get_catalog': 'getBpscNonTechSuggestionCatalog',
        'clean_title': 'cleanBpscNonTechSuggestionTitle',
        'load_questions': 'loadBpscNonTechSuggestionQuestions',
        'component_prefix': 'BpscNonTechSuggestion',
        'storage_cat': 'ujs_bpscs_filter_cat',
        'storage_smart': 'ujs_bpscs_smart_filters',
        'preset_active': 'topmcqbd_bpscs_active_preset',
        'preset_profiles': 'topmcqbd_bpscs_preset_profiles',
        'badge_name': 'BPSC নন-টেক সাজেশন',
        'title_name': 'BPSC নন-টেক চূড়ান্ত সাজেশন',
        'subtitle_name': 'বিপিএসসি নন-ক্যাডার ও নন-টেক নিয়োগ পরীক্ষার ৮টি বিষয়ের ৯১টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও নির্ভুল ব্যাখ্যা।',
        'login_subtitle': 'বিপিএসসি নন-টেক সাজেশন অনুশীলন ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন।',
        'date_badge': 'সাজেশন',
        'smart_categories_code': """const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল বিষয়' },
  { id: 'bangla-byakoron', label: 'বাংলা ব্যাকরণ (১৪ অধ্যায়)', matchKey: 'bangla-byakoron' },
  { id: 'bangla-sahitya', label: 'বাংলা সাহিত্য (৫ অধ্যায়)', matchKey: 'bangla-sahitya' },
  { id: 'english', label: 'English (১৮ অধ্যায়)', matchKey: 'english' },
  { id: 'math', label: 'গণিত (২৫ অধ্যায়)', matchKey: 'math' },
  { id: 'bangladesh-affairs', label: 'বাংলাদেশ বিষয়াবলি (১০ অধ্যায়)', matchKey: 'bangladesh-affairs' },
  { id: 'international-affairs', label: 'আন্তর্জাতিক বিষয়াবলি (১০ অধ্যায়)', matchKey: 'international-affairs' },
  { id: 'science', label: 'সাধারণ বিজ্ঞান (৮ অধ্যায়)', matchKey: 'science' },
  { id: 'ict', label: 'তথ্য প্রযুক্তি (১ অধ্যায়)', matchKey: 'ict' }
];""",
        'subject_stats_code': """            let subjectStats = 'বিপিএসসি নন-টেক অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন';
            if (catId === 'bangla-byakoron') {
              subjectStats = 'বাংলা ব্যাকরণ: কারক, বিভক্তি, প্রত্যয়, বাক্য, সমাস ও শুদ্ধিকরণ';
            } else if (catId === 'bangla-sahitya') {
              subjectStats = 'বাংলা সাহিত্য: প্রাচীন, মধ্যযুগ, রবীন্দ্র-নজরুল ও আধুনিক যুগ';
            } else if (catId === 'english') {
              subjectStats = 'English: Grammar Rules, Completing Sentence, Degree & Literature';
            } else if (catId === 'math') {
              subjectStats = 'গণিত: পাটিগণিত, বীজগণিত, জ্যামিতি, পরিমিতি ও মানসিক দক্ষতা';
            } else if (catId === 'bangladesh-affairs') {
              subjectStats = 'বাংলাদেশ বিষয়াবলি: ইতিহাস, মুক্তিযুদ্ধ, সংবিধান ও অর্থনীতি';
            } else if (catId === 'international-affairs') {
              subjectStats = 'আন্তর্জাতিক বিষয়াবলি: রাজনীতি, কূটনীতি, চুক্তি, সংগঠন ও মুদ্রা';
            } else if (catId === 'science') {
              subjectStats = 'সাধারণ বিজ্ঞান: পদার্থ, রসায়ন, উদ্ভিদবিজ্ঞান, প্রাণিবিজ্ঞান ও দুর্যোগ';
            } else if (catId === 'ict') {
              subjectStats = 'তথ্য ও যোগাযোগ প্রযুক্তি: কম্পিউটার, ইন্টারনেট ও ডিজিটাল সিকিউরিটি';
            }""",
        'search_placeholder': 'অধ্যায় বা বিষয়ের নাম দিয়ে সার্চ করুন (যেমন: কারক, ইতিহাস, ত্রিকোণমিতি)...',
        'archive_badge': 'BPSC নন-টেক সাজেশন হাব'
    },

    # 4. Saif Sir NTRCA 100 MCQ model
    {
        'id': 'saif100',
        'dir_name': '(saif-ntrca-100-model)',
        'route_prefix': 'saif-ntrca-100-model',
        'lib_name': 'saifNtrca100ModelData',
        'get_catalog': 'getSaifNtrca100ModelCatalog',
        'clean_title': 'cleanSaifNtrca100ModelTitle',
        'load_questions': 'loadSaifNtrca100ModelQuestions',
        'component_prefix': 'SaifNtrca100Model',
        'storage_cat': 'ujs_saif100_filter_cat',
        'storage_smart': 'ujs_saif100_smart_filters',
        'preset_active': 'topmcqbd_saif100_active_preset',
        'preset_profiles': 'topmcqbd_saif100_preset_profiles',
        'badge_name': 'সাইফ স্যার NTRCA ১০০ MCQ মডেল',
        'title_name': 'সাইফ স্যার NTRCA ১০০ MCQ স্পেশাল মডেল টেস্ট',
        'subtitle_name': 'সাইফ স্যারের শিক্ষক নিবন্ধন (NTRCA) প্রিলিমিনারি প্রস্তুতির ৭৫টি পূর্ণাঙ্গ ১০০ মার্কের বুলেটিন মডেল টেস্ট ও সমাধান।',
        'login_subtitle': 'সাইফ স্যার NTRCA ১০০ MCQ মডেল টেস্ট অনুশীলন ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন।',
        'date_badge': '১০০ MCQ',
        'smart_categories_code': """const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল মডেল টেস্ট' },
  { id: 'bangla', label: 'বাংলা বুলেটিন (২৩টি ১০০ MCQ মডেল)', matchKey: 'bangla' },
  { id: 'english', label: 'English বুলেটিন (২১টি ১০০ MCQ মডেল)', matchKey: 'english' },
  { id: 'gk', label: 'সাধারণ জ্ঞান বুলেটিন (২৩টি ১০০ MCQ মডেল)', matchKey: 'gk' },
  { id: 'math', label: 'গণিত বুলেটিন (৮টি ১০০ MCQ মডেল)', matchKey: 'math' }
];""",
        'subject_stats_code': """            let subjectStats = 'সাইফ স্যার NTRCA ১০০ MCQ স্পেশাল মডেল টেস্ট';
            if (catId === 'bangla') {
              subjectStats = 'শিক্ষক নিবন্ধন বাংলা ১০০ নম্বরের বুলেটিন মডেল টেস্ট ও নির্ভুল ব্যাখ্যা';
            } else if (catId === 'english') {
              subjectStats = 'শিক্ষক নিবন্ধন English ১০০ নম্বরের বুলেটিন মডেল টেস্ট ও বিস্তারিত নিয়ম';
            } else if (catId === 'gk') {
              subjectStats = 'শিক্ষক নিবন্ধন সাধারণ জ্ঞান ১০০ নম্বরের বুলেটিন মডেল টেস্ট ও সমাধান';
            } else if (catId === 'math') {
              subjectStats = 'শিক্ষক নিবন্ধন গণিত ১০০ নম্বরের বুলেটিন মডেল টেস্ট ও শর্টকাট সমাধান';
            }""",
        'search_placeholder': 'মডেল টেস্ট বা বুলেটিন নম্বর দিয়ে সার্চ করুন (যেমন: বুলেটিন-০১, Model Test-05)...',
        'archive_badge': 'সাইফ স্যার ১০০ MCQ স্পেশাল'
    },

    # 5. Saif Sir NTRCA Suggestion
    {
        'id': 'saifs',
        'dir_name': '(saif-ntrca-suggestion)',
        'route_prefix': 'saif-ntrca-suggestion',
        'lib_name': 'saifNtrcaSuggestionData',
        'get_catalog': 'getSaifNtrcaSuggestionCatalog',
        'clean_title': 'cleanSaifNtrcaSuggestionTitle',
        'load_questions': 'loadSaifNtrcaSuggestionQuestions',
        'component_prefix': 'SaifNtrcaSuggestion',
        'storage_cat': 'ujs_saifs_filter_cat',
        'storage_smart': 'ujs_saifs_smart_filters',
        'preset_active': 'topmcqbd_saifs_active_preset',
        'preset_profiles': 'topmcqbd_saifs_preset_profiles',
        'badge_name': 'সাইফ স্যার NTRCA সাজেশন',
        'title_name': 'সাইফ স্যার NTRCA এক্সক্লুসিভ সাজেশন ও শর্ট টেস্ট',
        'subtitle_name': 'শিক্ষক নিবন্ধন (NTRCA) প্রিলিমিনারি প্রস্তুতির ৩৩৮টি বিষয়ভিত্তিক শর্ট মডেল বুলেটিন ও চূড়ান্ত সাজেশন সংকলন।',
        'login_subtitle': 'সাইফ স্যার NTRCA সাজেশন অনুশীলন ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন।',
        'date_badge': 'শর্ট মডেল',
        'smart_categories_code': """const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল বুলেটিন ও টেস্ট' },
  { id: 'bangla', label: 'বাংলা বুলেটিন (১১১টি টেস্ট)', matchKey: 'bangla' },
  { id: 'english', label: 'English বুলেটিন (৯৮টি টেস্ট)', matchKey: 'english' },
  { id: 'gk', label: 'সাধারণ জ্ঞান বুলেটিন (৯৯টি টেস্ট)', matchKey: 'gk' },
  { id: 'math', label: 'গণিত বুলেটিন (৩০টি টেস্ট)', matchKey: 'math' }
];""",
        'subject_stats_code': """            let subjectStats = 'সাইফ স্যার NTRCA এক্সক্লুসিভ সাজেশন ও শর্ট টেস্ট';
            if (catId === 'bangla') {
              subjectStats = 'শিক্ষক নিবন্ধন বাংলা বুলেটিন শর্ট মডেল ও এক্সক্লুসিভ সাজেশন';
            } else if (catId === 'english') {
              subjectStats = 'শিক্ষক নিবন্ধন English বুলেটিন শর্ট মডেল ও এক্সক্লুসিভ সাজেশন';
            } else if (catId === 'gk') {
              subjectStats = 'শিক্ষক নিবন্ধন সাধারণ জ্ঞান বুলেটিন শর্ট মডেল ও এক্সক্লুসিভ সাজেশন';
            } else if (catId === 'math') {
              subjectStats = 'শিক্ষক নিবন্ধন গণিত বুলেটিন শর্ট মডেল ও এক্সক্লুসিভ সাজেশন';
            }""",
        'search_placeholder': 'বুলেটিন নম্বর দিয়ে সার্চ করুন (যেমন: বুলেটিন-০১, বুলেটিন-৫০, Model-10)...',
        'archive_badge': 'সাইফ স্যার ৩৩৮ বুলেটিন সাজেশন'
    }
]

for m in modules:
    base_box = os.path.join('src', 'app', m['dir_name'], '(Layout-box)')
    base_smart = os.path.join('src', 'app', m['dir_name'], '(Layout-smart)')

    p_dir = os.path.join(base_box, m['route_prefix'], 'page.jsx')
    p_prac = os.path.join(base_box, f"{m['route_prefix']}-practice", 'page.jsx')
    p_model = os.path.join(base_box, f"{m['route_prefix']}-model-test", 'page.jsx')
    p_smart = os.path.join(base_smart, f"{m['route_prefix']}-smart", 'page.jsx')
    p_smart_css = os.path.join(base_smart, f"{m['route_prefix']}-smart", 'style.css')
    p_smart_q = os.path.join(base_smart, f"{m['route_prefix']}-smart-questions", 'page.jsx')
    p_smart_q_css = os.path.join(base_smart, f"{m['route_prefix']}-smart-questions", 'style.css')

    for p in [p_dir, p_prac, p_model, p_smart, p_smart_css, p_smart_q, p_smart_q_css]:
        ensure_dir(os.path.dirname(p))

    # 0. Write CSS files
    with open(p_smart_css, 'w', encoding='utf-8') as f:
        f.write(smart_css)
    with open(p_smart_q_css, 'w', encoding='utf-8') as f:
        f.write(smart_q_css)

    # 1. Directory Page
    code_dir = tpl_dir
    code_dir = re.sub(
        r'import\s*\{\s*getAmpibianCatalog(?:\s+as\s+\w+)?,\s*cleanAmpibianTitle(?:\s+as\s+\w+)?\s*\}\s*from\s*[\'"][^\'"]+[\'"];',
        f"import {{ {m['get_catalog']}, {m['clean_title']} }} from '../../../../lib/{m['lib_name']}';",
        code_dir
    )
    code_dir = code_dir.replace('getAmpibianCatalog', m['get_catalog'])
    code_dir = code_dir.replace('cleanAmpibianTitle', m['clean_title'])
    code_dir = code_dir.replace('ampibianData', m['lib_name'])
    code_dir = code_dir.replace('AmpibianDirectoryContent', f"{m['component_prefix']}DirectoryContent")
    code_dir = code_dir.replace('AmpibianPage', f"{m['component_prefix']}Page")
    code_dir = code_dir.replace('ujs_ampibian_filter_cat', m['storage_cat'])
    code_dir = code_dir.replace('/ampibian-suggestion-practice?', f"/{m['route_prefix']}-practice?")
    code_dir = code_dir.replace('/ampibian-suggestion-model-test?', f"/{m['route_prefix']}-model-test?")
    code_dir = code_dir.replace('/ampibian-suggestion-practice', f"/{m['route_prefix']}-practice")
    code_dir = code_dir.replace('/ampibian-suggestion-model-test', f"/{m['route_prefix']}-model-test")
    code_dir = code_dir.replace('/ampibian-suggestion-smart', f"/{m['route_prefix']}-smart")
    code_dir = code_dir.replace('অ্যাম্ফিবিয়ান সাজেশন প্রশ্নব্যাংক', m['title_name'])
    code_dir = code_dir.replace('অ্যাম্ফিবিয়ান সাজেশন', m['badge_name'])
    code_dir = code_dir.replace('বাংলা, ইংরেজি, সাধারণ জ্ঞান ও গণিত বিষয়ের ৮৪টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও নির্ভুল সমাধান।', m['subtitle_name'])
    code_dir = code_dir.replace('অ্যাম্ফিবিয়ান সাজেশন প্রশ্নব্যাংক অনুশীলন ও সমাধান দেখতে অনুগ্রহ করে লগইন করুন।', m['login_subtitle'])
    with open(p_dir, 'w', encoding='utf-8') as f:
        f.write(code_dir)

    # 2. Practice Page
    code_prac = tpl_prac
    code_prac = re.sub(
        r'import\s*\{\s*loadAmpibianQuestions(?:\s+as\s+\w+)?,\s*cleanAmpibianTitle(?:\s+as\s+\w+)?\s*\}\s*from\s*[\'"][^\'"]+[\'"];',
        f"import {{ {m['load_questions']}, {m['clean_title']} }} from '../../../../lib/{m['lib_name']}';",
        code_prac
    )
    code_prac = code_prac.replace('loadAmpibianQuestions', m['load_questions'])
    code_prac = code_prac.replace('cleanAmpibianTitle', m['clean_title'])
    code_prac = code_prac.replace('ampibianData', m['lib_name'])
    code_prac = code_prac.replace('AmpibianPracticeContent', f"{m['component_prefix']}PracticeContent")
    code_prac = code_prac.replace('AmpibianPracticePage', f"{m['component_prefix']}PracticePage")
    code_prac = code_prac.replace('href="/ampibian-suggestion"', f'href="/{m["route_prefix"]}"')
    code_prac = code_prac.replace('/ampibian-suggestion-practice/', f'/{m["route_prefix"]}-practice/')
    code_prac = code_prac.replace('/ampibian-suggestion-model-test', f'/{m["route_prefix"]}-model-test')
    code_prac = code_prac.replace('targetUrl="/ampibian-suggestion"', f'targetUrl="/{m["route_prefix"]}"')
    code_prac = code_prac.replace('targetLabel="পরীক্ষা নির্বাচন করুন (/ampibian-suggestion)"', f'targetLabel="পরীক্ষা নির্বাচন করুন (/{m["route_prefix"]})"')
    code_prac = code_prac.replace('অ্যাম্ফিবিয়ান সাজেশন প্র্যাকটিস', f"{m['badge_name']} প্র্যাকটিস")
    code_prac = code_prac.replace('অ্যাম্ফিবিয়ান অধ্যায় নির্বাচন', 'পরীক্ষা নির্বাচন')
    code_prac = code_prac.replace('অ্যাম্ফিবিয়ান সাজেশন', m['badge_name'])
    with open(p_prac, 'w', encoding='utf-8') as f:
        f.write(code_prac)

    # 3. Model Test Page
    code_model = tpl_model
    code_model = re.sub(
        r'import\s*\{\s*loadAmpibianQuestions(?:\s+as\s+\w+)?,\s*cleanAmpibianTitle(?:\s+as\s+\w+)?\s*\}\s*from\s*[\'"][^\'"]+[\'"];',
        f"import {{ {m['load_questions']}, {m['clean_title']} }} from '../../../../lib/{m['lib_name']}';",
        code_model
    )
    code_model = code_model.replace('loadAmpibianQuestions', m['load_questions'])
    code_model = code_model.replace('cleanAmpibianTitle', m['clean_title'])
    code_model = code_model.replace('ampibianData', m['lib_name'])
    code_model = code_model.replace('AmpibianModelTestContent', f"{m['component_prefix']}ModelTestContent")
    code_model = code_model.replace('AmpibianModelTestPage', f"{m['component_prefix']}ModelTestPage")
    code_model = code_model.replace('href="/ampibian-suggestion"', f'href="/{m["route_prefix"]}"')
    code_model = code_model.replace('/ampibian-suggestion-model-test/', f'/{m["route_prefix"]}-model-test/')
    code_model = code_model.replace('/ampibian-suggestion-practice', f'/{m["route_prefix"]}-practice')
    code_model = code_model.replace('targetUrl="/ampibian-suggestion"', f'targetUrl="/{m["route_prefix"]}"')
    code_model = code_model.replace('targetLabel="পরীক্ষা নির্বাচন করুন (/ampibian-suggestion)"', f'targetLabel="পরীক্ষা নির্বাচন করুন (/{m["route_prefix"]})"')
    code_model = code_model.replace('অ্যাম্ফিবিয়ান সাজেশন লাইভ মডেল টেস্ট', f"{m['badge_name']} লাইভ মডেল টেস্ট")
    code_model = code_model.replace('অ্যাম্ফিবিয়ান লাইভ মডেল টেস্ট', f"{m['badge_name']} লাইভ মডেল টেস্ট")
    code_model = code_model.replace('অ্যাম্ফিবিয়ান অধ্যায় নির্বাচন', 'পরীক্ষা নির্বাচন')
    code_model = code_model.replace('অ্যাম্ফিবিয়ান সাজেশন', m['badge_name'])
    with open(p_model, 'w', encoding='utf-8') as f:
        f.write(code_model)

    # 4. Smart Page
    code_smart = tpl_smart
    code_smart = re.sub(
        r'import\s*\{\s*getAmpibianCatalog(?:\s+as\s+\w+)?,\s*cleanAmpibianTitle(?:\s+as\s+\w+)?\s*\}\s*from\s*[\'"][^\'"]+[\'"];',
        f"import {{ {m['get_catalog']}, {m['clean_title']} }} from '../../../../lib/{m['lib_name']}';",
        code_smart
    )
    code_smart = code_smart.replace('getAmpibianCatalog', m['get_catalog'])
    code_smart = code_smart.replace('cleanAmpibianTitle', m['clean_title'])
    code_smart = code_smart.replace('ampibianData', m['lib_name'])
    code_smart = code_smart.replace('AmpibianSmartContent', f"{m['component_prefix']}SmartContent")
    code_smart = code_smart.replace('AmpibianSmartPage', f"{m['component_prefix']}SmartPage")
    code_smart = code_smart.replace('ujs_ampibian_smart_filters', m['storage_smart'])
    code_smart = code_smart.replace('/ampibian-suggestion-smart-questions/', f"/{m['route_prefix']}-smart-questions/")
    code_smart = code_smart.replace('/ampibian-suggestion-smart-questions', f"/{m['route_prefix']}-smart-questions")
    code_smart = code_smart.replace('href="/ampibian-suggestion"', f'href="/{m["route_prefix"]}"')
    code_smart = code_smart.replace('targetUrl="/ampibian-suggestion"', f'targetUrl="/{m["route_prefix"]}"')
    code_smart = code_smart.replace('targetLabel="বক্স লেআউট (/ampibian-suggestion)"', f'targetLabel="বক্স লেআউট (/{m["route_prefix"]})"')
    code_smart = code_smart.replace('targetUrl="/ampibian-suggestion-smart"', f'targetUrl="/{m["route_prefix"]}-smart"')
    code_smart = code_smart.replace('targetLabel="স্মার্ট ভিউ (/ampibian-suggestion-smart)"', f'targetLabel="স্মার্ট ভিউ (/{m["route_prefix"]}-smart)"')
    code_smart = code_smart.replace('অ্যাম্ফিবিয়ান সাজেশন আর্কাইভ', m['archive_badge'])
    code_smart = code_smart.replace('অ্যাম্ফিবিয়ান সাজেশন স্মার্ট প্রশ্নব্যাংক', f"{m['badge_name']} স্মার্ট প্রশ্নব্যাংক")
    code_smart = code_smart.replace('category: catName || \'অ্যাম্ফিবিয়ান সাজেশন\'', f"category: catName || '{m['badge_name']}'")
    code_smart = code_smart.replace("date: 'সাজেশন'", f"date: '{m['date_badge']}'")
    code_smart = code_smart.replace('অ্যাম্ফিবিয়ান সাজেশন', m['badge_name'])
    code_smart = code_smart.replace('বাংলা, ইংরেজি, সাধারণ জ্ঞান ও গণিত বিষয়ের ৮৪টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও নির্ভুল ব্যাখ্যা।', m['subtitle_name'])
    code_smart = code_smart.replace('অধ্যায় বা বিষয়ের নাম দিয়ে সার্চ করুন (যেমন: কারক, Tense, মুদ্রা)...', m['search_placeholder'])

    # Replace DEFAULT_CATEGORIES
    amp_def_cat = """const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'সকল বিষয়' },
  { id: 'bangla', label: 'বাংলা ব্যাকরণ ও সাহিত্য', matchKey: 'bangla' },
  { id: 'english', label: 'English Grammar & Lit', matchKey: 'english' },
  { id: 'gk', label: 'সাধারণ জ্ঞান (GK)', matchKey: 'gk' },
  { id: 'math', label: 'গণিত ও মানসিক দক্ষতা', matchKey: 'math' }
];"""
    code_smart = code_smart.replace(amp_def_cat, m['smart_categories_code'])

    # Replace subjectStats
    amp_sub_stats = """            let subjectStats = 'অ্যাম্ফিবিয়ান চূড়ান্ত সাজেশন';
            if (catId === 'bangla') {
              subjectStats = 'বাংলা ব্যাকরণ, ধ্বনি, বর্ণ, সন্ধি, সমাস ও সাহিত্য সংকলন';
            } else if (catId === 'english') {
              subjectStats = 'English Grammar, Vocabulary, Parts of Speech & Literature';
            } else if (catId === 'gk') {
              subjectStats = 'বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি, ভূ-রাজনীতি ও সাম্প্রতিক তথ্য';
            } else if (catId === 'math') {
              subjectStats = 'পাটিগণিত, বীজগণিত, জ্যামিতি ও মানসিক দক্ষতা শর্টকাট';
            }"""
    code_smart = code_smart.replace(amp_sub_stats, m['subject_stats_code'])

    with open(p_smart, 'w', encoding='utf-8') as f:
        f.write(code_smart)

    # 5. Smart Questions Page
    code_smart_q = tpl_smart_q
    code_smart_q = re.sub(
        r'import\s*\{\s*loadAmpibianQuestions(?:\s+as\s+\w+)?,\s*cleanAmpibianTitle(?:\s+as\s+\w+)?\s*\}\s*from\s*[\'"][^\'"]+[\'"];',
        f"import {{ {m['load_questions']} as loadExamQuestions, {m['clean_title']} as cleanExamTitle }} from '../../../../lib/{m['lib_name']}';",
        code_smart_q
    )
    code_smart_q = code_smart_q.replace('loadAmpibianQuestions', m['load_questions'])
    code_smart_q = code_smart_q.replace('cleanAmpibianTitle', m['clean_title'])
    code_smart_q = code_smart_q.replace('ampibianData', m['lib_name'])
    code_smart_q = code_smart_q.replace('AmpibianSmartQuestionsContent', f"{m['component_prefix']}SmartQuestionsContent")
    code_smart_q = code_smart_q.replace('AmpibianSmartQuestionsPage', f"{m['component_prefix']}SmartQuestionsPage")
    code_smart_q = code_smart_q.replace('topmcqbd_ampibian_active_preset', m['preset_active'])
    code_smart_q = code_smart_q.replace('topmcqbd_ampibian_preset_profiles', m['preset_profiles'])
    code_smart_q = code_smart_q.replace('/ampibian-suggestion-smart/', f"/{m['route_prefix']}-smart/")
    code_smart_q = code_smart_q.replace('/ampibian-suggestion-smart', f"/{m['route_prefix']}-smart")
    code_smart_q = code_smart_q.replace('/ampibian-suggestion-smart-questions/', f"/{m['route_prefix']}-smart-questions/")
    code_smart_q = code_smart_q.replace('/ampibian-suggestion-smart-questions', f"/{m['route_prefix']}-smart-questions")
    code_smart_q = code_smart_q.replace('targetUrl="/ampibian-suggestion-smart"', f'targetUrl="/{m["route_prefix"]}-smart"')
    code_smart_q = code_smart_q.replace('targetUrl: "/ampibian-suggestion-smart"', f'targetUrl: "/{m["route_prefix"]}-smart"')
    code_smart_q = code_smart_q.replace('targetUrl="/ampibian-suggestion"', f'targetUrl="/{m["route_prefix"]}"')
    code_smart_q = code_smart_q.replace('targetUrl: "/ampibian-suggestion"', f'targetUrl: "/{m["route_prefix"]}"')
    code_smart_q = code_smart_q.replace('targetLabel="অধ্যায় নির্বাচন করুন (/ampibian-suggestion-smart)"', f'targetLabel="পরীক্ষা নির্বাচন করুন (/{m["route_prefix"]}-smart)"')
    code_smart_q = code_smart_q.replace('targetLabel="অধ্যায় নির্বাচন করুন (/ampibian-suggestion)"', f'targetLabel="পরীক্ষা নির্বাচন করুন (/{m["route_prefix"]})"')
    code_smart_q = code_smart_q.replace('targetLabel: "অধ্যায় নির্বাচন করুন (/ampibian-suggestion-smart)"', f'targetLabel: "পরীক্ষা নির্বাচন করুন (/{m["route_prefix"]}-smart)"')
    code_smart_q = code_smart_q.replace('targetLabel: "অধ্যায় নির্বাচন করুন (/ampibian-suggestion)"', f'targetLabel: "পরীক্ষা নির্বাচন করুন (/{m["route_prefix"]})"')
    code_smart_q = code_smart_q.replace('অধ্যায় নির্বাচন করুন', 'পরীক্ষা নির্বাচন করুন')
    code_smart_q = code_smart_q.replace('অ্যাম্ফিবিয়ান অধ্যায় নির্বাচন করুন', 'পরীক্ষা নির্বাচন করুন')
    code_smart_q = code_smart_q.replace('অ্যাম্ফিবিয়ান প্রশ্ন', f"{m['badge_name']} প্রশ্ন")
    code_smart_q = code_smart_q.replace('অ্যাম্ফিবিয়ান সাজেশন', m['badge_name'])
    code_smart_q = code_smart_q.replace('অ্যাম্ফিবিয়ান সাজেশন প্রশ্নব্যাংক', m['title_name'])
    with open(p_smart_q, 'w', encoding='utf-8') as f:
        f.write(code_smart_q)

    print(f"Generated 7 files cleanly for {m['id']} -> {m['dir_name']}")

print("All 5 modules (35 files total) re-generated cleanly!")
