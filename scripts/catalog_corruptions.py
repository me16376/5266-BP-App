import glob
import json
import sys
import re
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

corruptions = Counter()

patterns = [
    r'যন্ে\s*[০৭]র?',
    r'গণনাযন্ে\s*[০৭]র?',
    r'যান্[০ি\s]*ক',
    r'স্প্রডেশটি[ররে]*',
    r'রূপান্\[[রিত]*',
    r'প্রস্\[[ুত]*',
    r'স্\[[রের]*',
    r'স্\s*ঘরের',
    r'সম্প\s*জর্ণ',
    r'সাভার্র',
    r'এ[্যা]*পি−কেশন[রে]*',
    r'বিশে−ষণ[রে]*',
    r'উলে−খ[যোগ্য]*',
    r'ব−্যা[কগ]',
    r'ব−ু[টড]',
    r'গে−াব',
    r'প−টার[রে]*',
    r'বে−ইজ',
    r'গ−াস[গো]*',
    r'সাপ−াই',
    r'এক্সপে−ারার',
    r'আক্রান্[^\"]*পার্থক্য',
    r'ভাইরাস ও ভাইরাসের বিরুদ্ধে নিরাপত্তা ব্যবস্থা'
]

combined = re.compile('|'.join(patterns))

all_files = glob.glob('public/data/ict/class 9-10-Computer-GK/*.json') + ['public/data/ict/class-9-10-computer-gk.json']

for f in all_files:
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    for m in combined.finditer(c):
        corruptions[m.group(0).strip()] += 1

print('Unique corruptions found in ICT:')
for term, count in corruptions.most_common(100):
    print(f'{repr(term)} : {count} times')
