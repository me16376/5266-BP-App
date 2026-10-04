import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/quiz_refs.json', 'r', encoding='utf-8') as f:
    refs = json.load(f)

for qid in sorted(refs.keys(), key=lambda x: int(x) if x.isdigit() else 0):
    q = refs[qid]
    print(f"=== Question ID: {qid} ({q.get('file', '')}) ===")
    print("Question:", q.get('question', ''))
    print("Options:", q.get('options', []))
    print("Answer:", q.get('answer', ''))
    print("-" * 50)
