import glob
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

for f in glob.glob('public/data/ict/**/*.json', recursive=True):
    with open(f, 'r', encoding='utf-8') as fp:
        data = json.load(fp)
    qs = data if isinstance(data, list) else data.get('questions', [])
    for idx, q in enumerate(qs):
        s = json.dumps(q, ensure_ascii=False)
        if 'যন্ে' in s or 'স্প্রডেশটি' in s or 'রূপান্[' in s or 'প্রস্[' in s or 'স্[' in s or 'আক্রান্' in s or 'ভাইরাস ও ভাইরাসের বিরুদ্ধে' in s:
            qid = q.get('id', idx+1)
            print(f"File: {f} | Q#{qid}")
            print(f"  Q: {q.get('question')}")
            print(f"  Opts: {q.get('options')}")
            print(f"  Ans: {q.get('correct_answer') or q.get('answer')}")
            print()
