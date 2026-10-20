import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

def slugify(text):
    text = str(text).strip()
    text = re.sub(r'\.json$', '', text, flags=re.I)
    text = re.sub(r'[\s_/\\]+', '-', text)
    text = re.sub(r'[\(\)\[\]\{\}\<\>:"\',\.\?!#@%&*+=^`~|]+', '', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-').lower()

def clean_title(title):
    return re.sub(r'\.json$', '', str(title), flags=re.I).strip()

def natural_sort_key(s):
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', str(s))]

def build_buet_pattern_index():
    base_dir = os.path.join('public', 'data', 'BUET Patern Suggestion')
    categories_def = [
        {
            'id': 'bangla',
            'name': 'Bangla',
            'bn_name': 'বাংলা ভাষা ও সাহিত্য',
            'icon': 'BookOpen',
            'desc': 'বুয়েট প্যাটার্ন বাংলা ব্যাকরণ ও সাহিত্য অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও সমাধান',
            'folder': 'Bangla'
        },
        {
            'id': 'english',
            'name': 'English',
            'bn_name': 'ইংরেজি ভাষা ও সাহিত্য',
            'icon': 'Layers',
            'desc': 'বুয়েট প্যাটার্ন English Grammar & Literature অধ্যায়ভিত্তিক প্রস্তুতি ও সমাধান',
            'folder': 'English'
        },
        {
            'id': 'gk',
            'name': 'General Knowledge',
            'bn_name': 'সাধারণ জ্ঞান (বাংলাদেশ ও আন্তর্জাতিক)',
            'icon': 'Award',
            'desc': 'বুয়েট প্যাটার্ন সাধারণ জ্ঞান বাংলাদেশ, আন্তর্জাতিক, আইসিটি ও খেলাধুলা সংকলন',
            'folder': 'GK'
        },
        {
            'id': 'math',
            'name': 'Mathematics',
            'bn_name': 'গণিত ও মানসিক দক্ষতা',
            'icon': 'Table',
            'desc': 'বুয়েট প্যাটার্ন পাটিগণিত, বীজগণিত, জ্যামিতি ও ক্যালকুলাস নির্ভুল সমাধান',
            'folder': 'Math'
        }
    ]

    exams = []
    total_questions = 0

    for cat in categories_def:
        folder_path = os.path.join(base_dir, cat['folder'])
        if not os.path.isdir(folder_path):
            continue
        files = sorted([f for f in os.listdir(folder_path) if f.endswith('.json')], key=natural_sort_key)
        cat['exam_count'] = len(files)
        cat_q = 0

        for idx, filename in enumerate(files):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
                count = len(data) if isinstance(data, list) else len(data.get('questions', []))

            cat_q += count
            title = clean_title(filename)
            exam_id = f"buet_{cat['id']}_{idx + 1}"
            slug = f"{cat['id']}-{slugify(title)}"

            exams.append({
                'id': exam_id,
                'slug': slug,
                'title': title,
                'clean_filename': filename,
                'category_id': cat['id'],
                'category_name': cat['name'],
                'question_count': count,
                'file': f"/data/BUET Patern Suggestion/{cat['folder']}/{filename}"
            })

        cat['question_count'] = cat_q
        total_questions += cat_q

    index_data = {
        'total_exams': len(exams),
        'total_questions': total_questions,
        'categories': categories_def,
        'exams': exams
    }

    out_file = os.path.join('public', 'data', 'buet_pattern_index.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    print(f"Generated {out_file}: {len(exams)} exams, {total_questions} questions")


def build_bpsc_non_tech_questions_index():
    base_dir = os.path.join('public', 'data', 'BPSC Non Tech Questions')
    categories_def = [
        {
            'id': 'bangla',
            'name': 'Bangla',
            'bn_name': 'বাংলা (১,২৪৮ প্রশ্ন)',
            'icon': 'BookOpen',
            'desc': 'বিপিএসসি নন-ক্যাডার ও নন-টেক পরীক্ষার বাংলা বিষয়ের পূর্ণাঙ্গ প্রশ্নব্যাংক',
            'folder': 'Bangla'
        },
        {
            'id': 'english',
            'name': 'English',
            'bn_name': 'English (১,৫৫৮ প্রশ্ন)',
            'icon': 'Layers',
            'desc': 'বিপিএসসি নন-ক্যাডার ও নন-টেক পরীক্ষার English বিষয়ের পূর্ণাঙ্গ প্রশ্নব্যাংক',
            'folder': 'English'
        },
        {
            'id': 'math',
            'name': 'Mathematics',
            'bn_name': 'গণিত (১,০০৩ প্রশ্ন)',
            'icon': 'Table',
            'desc': 'বিপিএসসি নন-ক্যাডার ও নন-টেক নিয়োগ পরীক্ষার গণিত বিষয়ের পূর্ণাঙ্গ প্রশ্নব্যাংক',
            'folder': 'Math'
        },
        {
            'id': 'bangladesh-affairs',
            'name': 'Bangladesh Affairs',
            'bn_name': 'বাংলাদেশ বিষয়াবলি (৬১৩ প্রশ্ন)',
            'icon': 'Award',
            'desc': 'বিপিএসসি নন-ক্যাডার ও নন-টেক নিয়োগ পরীক্ষার বাংলাদেশ বিষয়াবলি প্রশ্নব্যাংক',
            'folder': 'Bangladesh Affairs'
        },
        {
            'id': 'international-affairs',
            'name': 'International Affairs',
            'bn_name': 'আন্তর্জাতিক বিষয়াবলি (৫৪০ প্রশ্ন)',
            'icon': 'Globe',
            'desc': 'বিপিএসসি নন-ক্যাডার ও নন-টেক নিয়োগ পরীক্ষার আন্তর্জাতিক বিষয়াবলি প্রশ্নব্যাংক',
            'folder': 'International Affairs'
        },
        {
            'id': 'science',
            'name': 'Science',
            'bn_name': 'সাধারণ বিজ্ঞান (৫৪৫ প্রশ্ন)',
            'icon': 'Sparkles',
            'desc': 'বিপিএসসি নন-ক্যাডার ও নন-টেক নিয়োগ পরীক্ষার সাধারণ বিজ্ঞান পূর্ণাঙ্গ প্রশ্নব্যাংক',
            'folder': 'Science'
        },
        {
            'id': 'ict',
            'name': 'ICT',
            'bn_name': 'তথ্য ও যোগাযোগ প্রযুক্তি (১৫৭ প্রশ্ন)',
            'icon': 'Monitor',
            'desc': 'বিপিএসসি নন-ক্যাডার ও নন-টেক নিয়োগ পরীক্ষার আইসিটি প্রশ্নব্যাংক ও সমাধান',
            'folder': 'ICT'
        }
    ]

    exams = []
    total_questions = 0

    for cat in categories_def:
        folder_path = os.path.join(base_dir, cat['folder'])
        if not os.path.isdir(folder_path):
            continue
        files = sorted([f for f in os.listdir(folder_path) if f.endswith('.json')], key=natural_sort_key)
        cat['exam_count'] = len(files)
        cat_q = 0

        for idx, filename in enumerate(files):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
                count = len(data) if isinstance(data, list) else len(data.get('questions', []))

            cat_q += count
            raw_title = clean_title(filename).replace('_', ' ')
            title = f"{cat['bn_name']} - পূর্ণাঙ্গ প্রশ্নব্যাংক"
            exam_id = f"bpscq_{cat['id']}_{idx + 1}"
            slug = f"{cat['id']}-{slugify(raw_title)}"

            exams.append({
                'id': exam_id,
                'slug': slug,
                'title': title,
                'clean_filename': filename,
                'category_id': cat['id'],
                'category_name': cat['name'],
                'question_count': count,
                'file': f"/data/BPSC Non Tech Questions/{cat['folder']}/{filename}"
            })

        cat['question_count'] = cat_q
        total_questions += cat_q

    index_data = {
        'total_exams': len(exams),
        'total_questions': total_questions,
        'categories': categories_def,
        'exams': exams
    }

    out_file = os.path.join('public', 'data', 'bpsc_non_tech_questions_index.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    print(f"Generated {out_file}: {len(exams)} exams, {total_questions} questions")


def build_bpsc_non_tech_suggestion_index():
    base_dir = os.path.join('public', 'data', 'BPSC Non Tech Suggestion')
    categories_def = [
        {
            'id': 'bangla-byakoron',
            'name': 'Bangla Grammar',
            'bn_name': 'বাংলা ব্যাকরণ (১৪ অধ্যায়)',
            'icon': 'BookOpen',
            'desc': 'বিপিএসসি নন-টেক সাজেশন: কারক, প্রত্যয়, বাক্য, শব্দ ইত্যাদি ১৪টি অধ্যায়',
            'folder': 'বাংলা ব্যাকরণ'
        },
        {
            'id': 'bangla-sahitya',
            'name': 'Bangla Literature',
            'bn_name': 'বাংলা সাহিত্য (৫ অধ্যায়)',
            'icon': 'BookOpen',
            'desc': 'বিপিএসসি নন-টেক সাজেশন: প্রাচীন, মধ্যযুগ, রবীন্দ্রনাথ, নজরুল ও আধুনিক যুগ',
            'folder': 'বাংলা সাহিত্য'
        },
        {
            'id': 'english',
            'name': 'English',
            'bn_name': 'ইংরেজি ভাষা ও সাহিত্য (১৮ অধ্যায়)',
            'icon': 'Layers',
            'desc': 'বিপিএসসি নন-টেক সাজেশন: English Grammar, Vocabulary ও Literature ১৮টি অধ্যায়',
            'folder': 'English'
        },
        {
            'id': 'math',
            'name': 'Mathematics',
            'bn_name': 'গণিত ও মানসিক দক্ষতা (২৫ অধ্যায়)',
            'icon': 'Table',
            'desc': 'বিপিএসসি নন-টেক সাজেশন: পাটিগণিত, বীজগণিত, জ্যামিতি ও ত্রিকোণমিতির ২৫টি অধ্যায়',
            'folder': 'Math'
        },
        {
            'id': 'bangladesh-affairs',
            'name': 'Bangladesh Affairs',
            'bn_name': 'বাংলাদেশ বিষয়াবলি (১০ অধ্যায়)',
            'icon': 'Award',
            'desc': 'বিপিএসসি নন-টেক সাজেশন: বাংলাদেশের ইতিহাস, সংবিধান, অর্থনীতি ইত্যাদি ১০টি অধ্যায়',
            'folder': 'Bangladesh Affairs'
        },
        {
            'id': 'international-affairs',
            'name': 'International Affairs',
            'bn_name': 'আন্তর্জাতিক বিষয়াবলি (১০ অধ্যায়)',
            'icon': 'Globe',
            'desc': 'বিপিএসসি নন-টেক সাজেশন: আন্তর্জাতিক রাজনীতি, চুক্তি, পরিবেশ ইত্যাদি ১০টি অধ্যায়',
            'folder': 'International Affairs'
        },
        {
            'id': 'science',
            'name': 'Science',
            'bn_name': 'সাধারণ বিজ্ঞান (৮ অধ্যায়)',
            'icon': 'Sparkles',
            'desc': 'বিপিএসসি নন-টেক সাজেশন: পদার্থ, রসায়ন, জীববিজ্ঞান ও পরিবেশ বিজ্ঞান ৮টি অধ্যায়',
            'folder': 'Science'
        },
        {
            'id': 'ict',
            'name': 'ICT',
            'bn_name': 'তথ্য ও যোগাযোগ প্রযুক্তি (১ অধ্যায়)',
            'icon': 'Monitor',
            'desc': 'বিপিএসসি নন-টেক সাজেশন: তথ্য ও যোগাযোগ প্রযুক্তির চূড়ান্ত অধ্যায়ভিত্তিক সমাধান',
            'folder': 'ICT'
        }
    ]

    exams = []
    total_questions = 0

    for cat in categories_def:
        folder_path = os.path.join(base_dir, cat['folder'])
        if not os.path.isdir(folder_path):
            continue
        files = sorted([f for f in os.listdir(folder_path) if f.endswith('.json')], key=natural_sort_key)
        cat['exam_count'] = len(files)
        cat_q = 0

        for idx, filename in enumerate(files):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
                count = len(data) if isinstance(data, list) else len(data.get('questions', []))

            cat_q += count
            title = clean_title(filename)
            exam_id = f"bpscs_{cat['id']}_{idx + 1}"
            slug = f"{cat['id']}-{slugify(title)}"

            exams.append({
                'id': exam_id,
                'slug': slug,
                'title': title,
                'clean_filename': filename,
                'category_id': cat['id'],
                'category_name': cat['name'],
                'question_count': count,
                'file': f"/data/BPSC Non Tech Suggestion/{cat['folder']}/{filename}"
            })

        cat['question_count'] = cat_q
        total_questions += cat_q

    index_data = {
        'total_exams': len(exams),
        'total_questions': total_questions,
        'categories': categories_def,
        'exams': exams
    }

    out_file = os.path.join('public', 'data', 'bpsc_non_tech_suggestion_index.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    print(f"Generated {out_file}: {len(exams)} exams, {total_questions} questions")


def build_saif_ntrca_100_model_index():
    base_dir = os.path.join('public', 'data', 'Saif Sir NTRCA 100 MCQ model')
    categories_def = [
        {
            'id': 'bangla',
            'name': 'Bangla',
            'bn_name': 'বাংলা (১০০ MCQ মডেল)',
            'icon': 'BookOpen',
            'desc': 'সাইফ স্যারের শিক্ষক নিবন্ধন বাংলা ২৩টি ১০০ নম্বরের স্পেশাল মডেল টেস্ট',
            'folder': 'Bangla'
        },
        {
            'id': 'english',
            'name': 'English',
            'bn_name': 'English (১০০ MCQ মডেল)',
            'icon': 'Layers',
            'desc': 'সাইফ স্যারের শিক্ষক নিবন্ধন English ২১টি ১০০ নম্বরের স্পেশাল মডেল টেস্ট',
            'folder': 'English'
        },
        {
            'id': 'gk',
            'name': 'General Knowledge',
            'bn_name': 'সাধারণ জ্ঞান (১০০ MCQ মডেল)',
            'icon': 'Award',
            'desc': 'সাইফ স্যারের শিক্ষক নিবন্ধন সাধারণ জ্ঞান ২৩টি ১০০ নম্বরের স্পেশাল মডেল টেস্ট',
            'folder': 'GK'
        },
        {
            'id': 'math',
            'name': 'Mathematics',
            'bn_name': 'গণিত (১০০ MCQ মডেল)',
            'icon': 'Table',
            'desc': 'সাইফ স্যারের শিক্ষক নিবন্ধন গণিত ৮টি ১০০ নম্বরের স্পেশাল মডেল টেস্ট',
            'folder': 'Math'
        }
    ]

    exams = []
    total_questions = 0

    for cat in categories_def:
        folder_path = os.path.join(base_dir, cat['folder'])
        if not os.path.isdir(folder_path):
            continue
        files = sorted([f for f in os.listdir(folder_path) if f.endswith('.json')], key=natural_sort_key)
        cat['exam_count'] = len(files)
        cat_q = 0

        for idx, filename in enumerate(files):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
                count = len(data.get('questions', [])) if isinstance(data, dict) else len(data)
                doc_title = data.get('title') if isinstance(data, dict) else ''
                model_name = data.get('model_test') if isinstance(data, dict) else ''

            cat_q += count
            clean_fn = clean_title(filename)
            title = doc_title or clean_fn
            if model_name and model_name not in title:
                full_display_title = f"{title} ({model_name})"
            else:
                full_display_title = title

            exam_id = f"saif100_{cat['id']}_{idx + 1}"
            slug = f"{cat['id']}-{slugify(clean_fn)}"

            exams.append({
                'id': exam_id,
                'slug': slug,
                'title': full_display_title,
                'raw_bulletin_title': doc_title or title,
                'clean_filename': filename,
                'model_test': model_name or clean_fn,
                'category_id': cat['id'],
                'category_name': cat['name'],
                'question_count': count,
                'file': f"/data/Saif Sir NTRCA 100 MCQ model/{cat['folder']}/{filename}"
            })

        cat['question_count'] = cat_q
        total_questions += cat_q

    index_data = {
        'total_exams': len(exams),
        'total_questions': total_questions,
        'categories': categories_def,
        'exams': exams
    }

    out_file = os.path.join('public', 'data', 'saif_ntrca_100_model_index.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    print(f"Generated {out_file}: {len(exams)} exams, {total_questions} questions")


def build_saif_ntrca_suggestion_index():
    base_dir = os.path.join('public', 'data', 'Saif Sir NTRCA Suggestion')
    categories_def = [
        {
            'id': 'bangla',
            'name': 'Bangla',
            'bn_name': 'বাংলা বুলেটিন ও শর্ট টেস্ট',
            'icon': 'BookOpen',
            'desc': 'সাইফ স্যারের শিক্ষক নিবন্ধন বাংলা ১১১টি শর্ট মডেল ও এক্সক্লুসিভ সাজেশন',
            'folder': 'Bangla'
        },
        {
            'id': 'english',
            'name': 'English',
            'bn_name': 'English বুলেটিন ও শর্ট টেস্ট',
            'icon': 'Layers',
            'desc': 'সাইফ স্যারের শিক্ষক নিবন্ধন English ৯৮টি শর্ট মডেল ও এক্সক্লুসিভ সাজেশন',
            'folder': 'English'
        },
        {
            'id': 'gk',
            'name': 'General Knowledge',
            'bn_name': 'সাধারণ জ্ঞান বুলেটিন ও শর্ট টেস্ট',
            'icon': 'Award',
            'desc': 'সাইফ স্যারের শিক্ষক নিবন্ধন সাধারণ জ্ঞান ৯৯টি শর্ট মডেল ও এক্সক্লুসিভ সাজেশন',
            'folder': 'GK'
        },
        {
            'id': 'math',
            'name': 'Mathematics',
            'bn_name': 'গণিত বুলেটিন ও শর্ট টেস্ট',
            'icon': 'Table',
            'desc': 'সাইফ স্যারের শিক্ষক নিবন্ধন গণিত ৩০টি শর্ট মডেল ও এক্সক্লুসিভ সাজেশন',
            'folder': 'Math'
        }
    ]

    exams = []
    total_questions = 0

    for cat in categories_def:
        folder_path = os.path.join(base_dir, cat['folder'])
        if not os.path.isdir(folder_path):
            continue
        files = sorted([f for f in os.listdir(folder_path) if f.endswith('.json')], key=natural_sort_key)
        cat['exam_count'] = len(files)
        cat_q = 0

        for idx, filename in enumerate(files):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
                count = len(data.get('questions', [])) if isinstance(data, dict) else len(data)
                doc_title = data.get('title') if isinstance(data, dict) else ''
                model_name = data.get('model_test') if isinstance(data, dict) else ''

            cat_q += count
            clean_fn = clean_title(filename)
            title = doc_title or clean_fn
            if model_name and str(model_name) not in title:
                full_display_title = f"{title} (Model-{model_name})"
            else:
                full_display_title = title

            exam_id = f"saifs_{cat['id']}_{idx + 1}"
            slug = f"{cat['id']}-{slugify(clean_fn)}"

            exams.append({
                'id': exam_id,
                'slug': slug,
                'title': full_display_title,
                'raw_bulletin_title': doc_title or title,
                'clean_filename': filename,
                'model_test': str(model_name) if model_name else clean_fn,
                'category_id': cat['id'],
                'category_name': cat['name'],
                'question_count': count,
                'file': f"/data/Saif Sir NTRCA Suggestion/{cat['folder']}/{filename}"
            })

        cat['question_count'] = cat_q
        total_questions += cat_q

    index_data = {
        'total_exams': len(exams),
        'total_questions': total_questions,
        'categories': categories_def,
        'exams': exams
    }

    out_file = os.path.join('public', 'data', 'saif_ntrca_suggestion_index.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    print(f"Generated {out_file}: {len(exams)} exams, {total_questions} questions")


if __name__ == '__main__':
    build_buet_pattern_index()
    build_bpsc_non_tech_questions_index()
    build_bpsc_non_tech_suggestion_index()
    build_saif_ntrca_100_model_index()
    build_saif_ntrca_suggestion_index()
