import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

filepath = 'public/data/ict/Ict-wizard-NTRCA-313-and-325/অধ্যায়- খ. সংখ্যা পদ্ধতি.json'
with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

for q in data:
    s = json.dumps(q, ensure_ascii=False)
    if 'iii' in s or 'III' in s or '\\n' in s:
        qid = q.get('id')
        print(f"Q#{qid}: {q.get('question')}")
        print(f"  Opts: {q.get('options')}")
        print(f"  Ans: {q.get('correct_answer') or q.get('answer')}")
        print()
