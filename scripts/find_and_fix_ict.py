import glob
import json
import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

def find_issues():
    files = glob.glob('public/data/ict/**/*.json', recursive=True)
    
    issues = []
    
    for f in files:
        with open(f, 'r', encoding='utf-8') as fp:
            data = json.load(fp)
        qs = data if isinstance(data, list) else data.get('questions', [])
        
        for idx, q in enumerate(qs):
            q_id = q.get('id', idx + 1)
            q_text = q.get('question') or q.get('q') or ''
            opts = q.get('options', [])
            ans = q.get('correct_answer') or q.get('correctAnswer') or ''
            
            # Check 1: OCR errors like যন্ে ০র, গণনাযন্ে, আক্রান্ ঘ হয়েছে, etc.
            for opt_idx, opt in enumerate(opts):
                if 'যন্ে ০' in opt or 'যন্ে' in opt or '০র' in opt or 'আক্রান্' in opt:
                    issues.append((f, q_id, 'OPT_CORRUPTION', f"Opt[{opt_idx}]: {opt}", q))
                elif len(opt) > 50 and any(h in opt for h in ['পার্থক্য', 'নিরাপত্তা ব্যবস্থা', 'অধ্যায়', 'অনুশীলনী', 'টপিক']):
                    issues.append((f, q_id, 'OPT_HEADING_MERGE', f"Opt[{opt_idx}]: {opt}", q))
            
            if 'যন্ে ০' in q_text or 'যন্ে' in q_text or '০র' in q_text or 'আক্রান্' in q_text:
                issues.append((f, q_id, 'Q_CORRUPTION', q_text, q))
                
    print(f"Total issues found: {len(issues)}")
    for f, q_id, issue_type, desc, q in issues:
        print(f"[{issue_type}] {f} Q#{q_id}")
        print(f"  Desc: {desc}")
        print(f"  Q: {q.get('question')}")
        print(f"  Opts: {q.get('options')}")
        print()

if __name__ == '__main__':
    find_issues()
