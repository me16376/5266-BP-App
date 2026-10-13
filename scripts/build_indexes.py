import os
import json
import re

def slugify(text):
    text = str(text).strip()
    # Remove extension if any
    text = re.sub(r'\.json$', '', text, flags=re.I)
    # Replace special punctuation and brackets with hyphen or nothing
    text = re.sub(r'[\s_/\\]+', '-', text)
    text = re.sub(r'[\(\)\[\]\{\}\<\>:"\',\.\?!#@%&*+=^`~|]+', '', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-').lower()

def clean_title(title):
    return re.sub(r'\.json$', '', str(title), flags=re.I).strip()

def build_ampibian_index():
    base_dir = os.path.join('public', 'data', 'Ampibian Suggestion')
    categories_def = [
        {
            'id': 'bangla',
            'name': 'Bangla',
            'bn_name': 'বাংলা ভাষা ও সাহিত্য',
            'icon': 'BookOpen',
            'desc': 'অ্যাম্ফিবিয়ান সাজেশন বাংলা ব্যাকরণ ও সাহিত্য অধ্যায়ভিত্তিক নির্ভুল সমাধান ও প্রস্তুতি',
            'folder': 'Bangla'
        },
        {
            'id': 'english',
            'name': 'English',
            'bn_name': 'ইংরেজি ভাষা ও সাহিত্য',
            'icon': 'Layers',
            'desc': 'অ্যাম্ফিবিয়ান সাজেশন English Grammar & Literature অধ্যায়ভিত্তিক প্রস্তুতি',
            'folder': 'English'
        },
        {
            'id': 'gk',
            'name': 'General Knowledge',
            'bn_name': 'সাধারণ জ্ঞান (বাংলাদেশ ও আন্তর্জাতিক)',
            'icon': 'Award',
            'desc': 'অ্যাম্ফিবিয়ান সাজেশন বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলির পূর্ণাঙ্গ সংকলন',
            'folder': 'GK'
        },
        {
            'id': 'math',
            'name': 'Mathematics',
            'bn_name': 'গণিত ও মানসিক দক্ষতা',
            'icon': 'Table',
            'desc': 'অ্যাম্ফিবিয়ান সাজেশন পাটিগণিত, বীজগণিত ও জ্যামিতি নির্ভুল সমাধান',
            'folder': 'Math'
        }
    ]

    exams = []
    total_questions = 0

    for cat in categories_def:
        folder_path = os.path.join(base_dir, cat['folder'])
        if not os.path.isdir(folder_path):
            continue
        files = [f for f in sorted(os.listdir(folder_path)) if f.endswith('.json')]
        cat['exam_count'] = len(files)
        cat_q = 0

        for idx, filename in enumerate(files):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
                count = len(data) if isinstance(data, list) else len(data.get('questions', []))

            cat_q += count
            title = clean_title(filename)
            exam_id = f"amp_{cat['id']}_{idx + 1}"
            slug = f"{cat['id']}-{slugify(title)}"

            exams.append({
                'id': exam_id,
                'slug': slug,
                'title': title,
                'clean_filename': filename,
                'category_id': cat['id'],
                'category_name': cat['name'],
                'question_count': count,
                'file': f"/data/Ampibian Suggestion/{cat['folder']}/{filename}"
            })

        cat['question_count'] = cat_q
        total_questions += cat_q

    index_data = {
        'total_exams': len(exams),
        'total_questions': total_questions,
        'categories': categories_def,
        'exams': exams
    }

    out_file = os.path.join('public', 'data', 'ampibian_index.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    print(f"Generated {out_file}: {len(exams)} exams, {total_questions} questions")


def build_biddabari_index():
    base_dir = os.path.join('public', 'data', 'Biddabari-NTRCA')
    categories_def = [
        {
            'id': 'bangla',
            'name': 'Bangla',
            'bn_name': 'বিদ্যাবাড়ি NTRCA বাংলা',
            'icon': 'BookOpen',
            'desc': 'বিদ্যাবাড়ি NTRCA শিক্ষক নিবন্ধন বাংলা লেকচারভিত্তিক প্রশ্নব্যাংক ও সমাধান',
            'folder': 'Bangla'
        },
        {
            'id': 'english',
            'name': 'English',
            'bn_name': 'বিদ্যাবাড়ি NTRCA ইংরেজি',
            'icon': 'Layers',
            'desc': 'বিদ্যাবাড়ি NTRCA শিক্ষক নিবন্ধন English লেকচারভিত্তিক প্রশ্নব্যাংক',
            'folder': 'English'
        },
        {
            'id': 'gk',
            'name': 'General Knowledge',
            'bn_name': 'বিদ্যাবাড়ি NTRCA সাধারণ জ্ঞান',
            'icon': 'Award',
            'desc': 'বিদ্যাবাড়ি NTRCA সাধারণ জ্ঞান বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি লেকচার শিট',
            'folder': 'GK'
        },
        {
            'id': 'math',
            'name': 'Mathematics',
            'bn_name': 'বিদ্যাবাড়ি NTRCA গণিত',
            'icon': 'Table',
            'desc': 'বিদ্যাবাড়ি NTRCA গণিত ও মানসিক দক্ষতা লেকচারভিত্তিক সম্পূর্ণ প্রশ্নব্যাংক',
            'folder': 'Math'
        }
    ]

    exams = []
    total_questions = 0

    for cat in categories_def:
        folder_path = os.path.join(base_dir, cat['folder'])
        if not os.path.isdir(folder_path):
            continue
        files = [f for f in sorted(os.listdir(folder_path)) if f.endswith('.json')]
        cat['exam_count'] = len(files)
        cat_q = 0

        for idx, filename in enumerate(files):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
                count = len(data.get('questions', [])) if isinstance(data, dict) else len(data)

            cat_q += count
            title = clean_title(filename)
            exam_id = f"biddabari_{cat['id']}_{idx + 1}"
            slug = f"{cat['id']}-{slugify(title)}"

            exams.append({
                'id': exam_id,
                'slug': slug,
                'title': title,
                'clean_filename': filename,
                'category_id': cat['id'],
                'category_name': cat['name'],
                'question_count': count,
                'file': f"/data/Biddabari-NTRCA/{cat['folder']}/{filename}"
            })

        cat['question_count'] = cat_q
        total_questions += cat_q

    index_data = {
        'total_exams': len(exams),
        'total_questions': total_questions,
        'categories': categories_def,
        'exams': exams
    }

    out_file = os.path.join('public', 'data', 'biddabari_index.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    print(f"Generated {out_file}: {len(exams)} exams, {total_questions} questions")


def build_smart_ai_index():
    base_dir = os.path.join('public', 'data', 'Smart AI')
    categories_def = [
        {
            'id': 'bpsc-technical-ai',
            'name': 'BPSC Technical AI',
            'bn_name': 'BPSC টেকনিক্যাল ও নন-ক্যাডার AI প্রশ্নব্যাংক',
            'icon': 'Cpu',
            'desc': 'বিপিএসসি টেকনিক্যাল ও নন-ক্যাডার পদসমূহের জন্য এআই ভিত্তিক পূর্ণাঙ্গ প্রশ্নব্যাংক',
            'folder': 'BPSC Technical AI'
        },
        {
            'id': 'ntrca-313-and-325-ai',
            'name': 'NTRCA 313 & 325 - AI',
            'bn_name': 'NTRCA ৩১৩ ও ৩২৫ AI প্রশ্নব্যাংক',
            'icon': 'Laptop',
            'desc': 'শিক্ষক নিবন্ধন NTRCA ৩১৩ ও ৩২৫ আইসিটি বিষয়ভিত্তিক এআই স্পেশাল সংকলন',
            'folder': 'NTRCA 313 and 325 - AI'
        },
        {
            'id': 'ntrca-452-ai',
            'name': 'NTRCA 452 - AI',
            'bn_name': 'NTRCA ৪৫২ কম্পিউটার অপারেশন AI',
            'icon': 'Sparkles',
            'desc': 'শিক্ষক নিবন্ধন NTRCA ৪৫২ কোডের জন্য কম্পিউটার সাইন্স ও আইসিটি এআই প্রস্তুতি',
            'folder': 'NTRCA 452 - AI'
        },
        {
            'id': 'ntrca-preliminary-ai',
            'name': 'NTRCA Preliminary AI',
            'bn_name': 'NTRCA প্রিলিমিনারি AI প্রশ্নব্যাংক',
            'icon': 'GraduationCap',
            'desc': 'শিক্ষক নিবন্ধন NTRCA প্রিলিমিনারি পরীক্ষার ৫০টি টপিক ভিত্তিক ১০,০০০টি এআই প্রশ্নব্যাংক',
            'folder': 'NTRCA Preminary AI'
        }
    ]

    exams = []
    total_questions = 0

    for cat in categories_def:
        folder_path = os.path.join(base_dir, cat['folder'])
        if not os.path.isdir(folder_path):
            continue
        files = [f for f in sorted(os.listdir(folder_path)) if f.endswith('.json')]
        cat['exam_count'] = len(files)
        cat_q = 0

        for idx, filename in enumerate(files):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
                count = len(data) if isinstance(data, list) else len(data.get('questions', []))

            cat_q += count
            title = clean_title(filename)
            exam_id = f"smartai_{cat['id']}_{idx + 1}"
            slug = f"{cat['id']}-{slugify(title)}"

            exams.append({
                'id': exam_id,
                'slug': slug,
                'title': title,
                'clean_filename': filename,
                'category_id': cat['id'],
                'category_name': cat['name'],
                'question_count': count,
                'file': f"/data/Smart AI/{cat['folder']}/{filename}"
            })

        cat['question_count'] = cat_q
        total_questions += cat_q

    index_data = {
        'total_exams': len(exams),
        'total_questions': total_questions,
        'categories': categories_def,
        'exams': exams
    }

    out_file = os.path.join('public', 'data', 'smart_ai_index.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    print(f"Generated {out_file}: {len(exams)} exams, {total_questions} questions")


if __name__ == '__main__':
    build_ampibian_index()
    build_biddabari_index()
    build_smart_ai_index()
