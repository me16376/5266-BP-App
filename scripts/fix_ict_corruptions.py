import glob
import json
import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# Replacement dictionary ordered from longest/most-specific to shortest
REPLACEMENTS = [
    # Question 16 and 128 specific fixes
    ("কম্পিউটার ভাইরাসে আক্রান্ ঘ হয়েছে কম্পিউটারের সঙ্গে অন্যান্য ইলেকট্রনিক যন্ে ০র পার্থক্য", "কম্পিউটার ভাইরাসে আক্রান্ত হয়েছে"),
    ("১ ঘণ্টা ভাইরাস ও ভাইরাসের বিরুদ্ধে নিরাপত্তা ব্যবস্থা", "১ ঘণ্টা"),
    
    # Machinery / Instrument
    ("গণনাযন্ে ০র", "গণনাযন্ত্রের"),
    ("গণনাযন্ে ৭র", "গণনাযন্ত্রের"),
    ("গণনা যন্ে ০", "গণনা যন্ত্রে"),
    ("গণনাযন্ে ০", "গণনাযন্ত্রে"),
    ("যন্ে ০র", "যন্ত্রের"),
    ("যন্ে ৭র", "যন্ত্রের"),
    ("যন্ে ০", "যন্ত্রে"),
    ("যন্ে ৭", "যন্ত্রে"),
    
    # Mechanical
    ("যান্ি ০ক", "যান্ত্রিক"),
    ("যান্০িক", "যান্ত্রিক"),
    
    # Levels / Layers
    ("উচ্চস্ [রের", "উচ্চস্তরের"),
    ("উচ্চস্ ঘরের", "উচ্চস্তরের"),
    ("মধ্যম স্ ঘরের", "মধ্যম স্তরের"),
    ("নম্নি স্ ঘরের", "নিম্ন স্তরের"),
    ("অতি উচ্চ স্ ঘরের", "অতি উচ্চ স্তরের"),
    ("স্ [রের", "স্তরের"),
    ("স্ ঘরের", "স্তরের"),
    ("স্ঘরের", "স্তরের"),
    ("স্[রের", "স্তরের"),
    ("স্[", "স্ত"),
    
    # Transformation
    ("রূপান্[রিত", "রূপান্তরিত"),
    ("রূপান্[র", "রূপান্তর"),
    ("প্রস্[ুত", "প্রস্তুত"),
    
    # Complete
    ("সম্প জর্ণ", "সম্পূর্ণ"),
    
    # Server
    ("সাভার্র", "সার্ভার"),
    
    # Spreadsheet
    ("স্প্রডেশটিরে", "স্প্রেডশিটের"),
    ("স্প্রডেশটিে", "স্প্রেডশিটে"),
    ("স্প্রডেশটি", "স্প্রেডশিট"),
    
    # Application
    ("এ্যাপি−কেশনের", "অ্যাপ্লিকেশনের"),
    ("অ্যাপি−কেশনের", "অ্যাপ্লিকেশনের"),
    ("এ্যাপি−কেশন", "অ্যাপ্লিকেশন"),
    ("এপি−কেশন", "অ্যাপ্লিকেশন"),
    ("অ্যাপি−কেশন", "অ্যাপ্লিকেশন"),
    
    # Blaise Pascal
    ("বে−ইজ প্যাস্কেল", "ব্লেইজ প্যাসকেল"),
    ("বে−ইজ", "ব্লেইজ"),
    
    # Mentionable
    ("উলে−খযোগ্য", "উল্লেখযোগ্য"),
    ("উলে−খ", "উল্লেখ"),
    
    # Analysis
    ("বিশে−ষণের", "বিশ্লেষণের"),
    ("বিশে−ষণে", "বিশ্লেষণে"),
    ("বিশে−ষণ", "বিশ্লেষণ"),
    
    # Plotter
    ("প−টারে", "প্লটারে"),
    ("প−টার", "প্লটার"),
    
    # Supply & Glasgow
    ("সাপ−াই", "সাপ্লাই"),
    ("গ−াসগো", "গ্লাসগো"),
    
    # Black, Bluetooth, Globe, Explorer
    ("ব−্যাক", "ব্ল্যাক"),
    ("ব−ুটুথ", "ব্লুটুথ"),
    ("গে−াব", "গ্লোব"),
    ("এক্সপে−ারার", "এক্সপ্লোরার"),
    
    # Text-based & One-fourth
    ("বণির্ভত্তিক", "বর্ণভিত্তিক"),
    ("এক-চতুথার্ংশ", "এক-চতুর্থাংশ")
]

def fix_string(text):
    if not text or not isinstance(text, str):
        return text
    res = text
    for old, new in REPLACEMENTS:
        res = res.replace(old, new)
    return res

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    is_list = isinstance(data, list)
    questions = data if is_list else data.get('questions', [])
    
    modified = False
    
    for q in questions:
        # Question text
        q_text = q.get('question') or q.get('q') or ''
        fixed_q = fix_string(q_text)
        if fixed_q != q_text:
            if 'question' in q:
                q['question'] = fixed_q
            if 'q' in q:
                q['q'] = fixed_q
            modified = True
            
        # Options
        opts = q.get('options', [])
        fixed_opts = [fix_string(o) for o in opts]
        if fixed_opts != opts:
            q['options'] = fixed_opts
            modified = True
            
        # Answer sync
        ans_idx = q.get('ans')
        if ans_idx is not None and isinstance(ans_idx, int) and 0 <= ans_idx < len(fixed_opts):
            current_correct = fixed_opts[ans_idx]
            if q.get('correct_answer') != current_correct:
                q['correct_answer'] = current_correct
                modified = True
            if q.get('correctAnswer') != current_correct:
                q['correctAnswer'] = current_correct
                modified = True
        else:
            # Sync by string if ans_idx not set
            old_ca = q.get('correct_answer') or q.get('correctAnswer')
            fixed_ca = fix_string(old_ca)
            if fixed_ca != old_ca:
                q['correct_answer'] = fixed_ca
                q['correctAnswer'] = fixed_ca
                modified = True
                
        # Explanation
        exp = q.get('explanation', '')
        fixed_exp = fix_string(exp)
        if fixed_exp != exp:
            q['explanation'] = fixed_exp
            modified = True
            
        # Hints
        hints = q.get('hints', '')
        fixed_hints = fix_string(hints)
        if fixed_hints != hints:
            q['hints'] = fixed_hints
            modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    return False

def main():
    print("=" * 60)
    print("FIXING ICT OCR CORRUPTIONS & TEXT ERRORS")
    print("=" * 60)
    
    files = glob.glob('public/data/ict/**/*.json', recursive=True)
    updated_files = 0
    
    for f in files:
        if process_file(f):
            print(f"Fixed: {f}")
            updated_files += 1
            
    print("=" * 60)
    print(f"Total files updated: {updated_files} / {len(files)}")
    print("=" * 60)

if __name__ == '__main__':
    main()
