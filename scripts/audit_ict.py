import glob
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def audit_ict():
    print("=" * 70)
    print("ICT QUESTION BANK AUDIT REPORT")
    print("=" * 70)

    # 1. Audit ict_index.json
    index_path = 'public/data/ict_index.json'
    if not os.path.isfile(index_path):
        print("ERROR: public/data/ict_index.json does not exist!")
        return

    with open(index_path, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    categories = catalog.get('categories', [])
    exams = catalog.get('exams', [])
    print(f"Categories in index: {len(categories)}")
    for cat in categories:
        print(f"  - Category: {cat.get('id')} ({cat.get('name')}), declared count: {cat.get('question_count')}")

    print(f"\nExams declared in index: {len(exams)}")
    index_errors = 0
    total_index_questions = 0

    for ex in exams:
        f_url = ex.get('file', '')
        f_path = os.path.normpath(os.path.join('public', f_url.lstrip('/')))
        exists = os.path.isfile(f_path)
        if not exists:
            print(f"  [MISSING FILE] {ex.get('title')} -> {f_path}")
            index_errors += 1
            continue

        try:
            with open(f_path, 'r', encoding='utf-8') as fp:
                data = json.load(fp)
            q_list = data if isinstance(data, list) else data.get('questions', [])
            count = len(q_list)
            total_index_questions += count
            expected = ex.get('question_count', 0)
            status = "OK" if count == expected else f"MISMATCH (index={expected}, file={count})"
            if count != expected:
                index_errors += 1
            print(f"  [{status}] {ex.get('title')} -> {f_path} ({count} Qs)")
        except Exception as e:
            print(f"  [CORRUPT JSON] {f_path}: {e}")
            index_errors += 1

    print(f"\nTotal questions across indexed chapters: {total_index_questions}")

    # 2. Audit ALL JSON files in public/data/ict
    print("\n" + "=" * 70)
    print("DETAILED AUDIT OF ALL JSON FILES IN public/data/ict/")
    print("=" * 70)

    all_files = glob.glob('public/data/ict/**/*.json', recursive=True)
    print(f"Total JSON files found: {len(all_files)}")

    overall_stats = {
        'total_files': len(all_files),
        'valid_json_files': 0,
        'total_questions': 0,
        'has_id': 0,
        'has_question': 0,
        'has_options': 0,
        'has_correct_answer': 0,
        'has_ans_idx': 0,
        'has_explanation': 0,
        'has_hints': 0,
        'has_old_hint_key': 0,
        'emojis_in_hints': 0,
        'empty_questions': 0,
        'empty_options': 0,
        'option_count_issues': 0,
        'empty_explanations': 0,
        'empty_hints': 0
    }

    file_reports = []

    for f_path in all_files:
        rel_path = os.path.relpath(f_path)
        try:
            with open(f_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            overall_stats['valid_json_files'] += 1
        except Exception as e:
            print(f"ERROR reading {rel_path}: {e}")
            continue

        q_list = data if isinstance(data, list) else data.get('questions', [])
        f_q_count = len(q_list)
        f_no_exp = 0
        f_no_hints = 0
        f_old_hint = 0
        f_opt_issues = 0
        f_no_ans = 0

        for q in q_list:
            overall_stats['total_questions'] += 1

            # ID
            if q.get('id') is not None:
                overall_stats['has_id'] += 1

            # Question text
            q_text = (q.get('question') or q.get('q') or '').strip()
            if q_text:
                overall_stats['has_question'] += 1
            else:
                overall_stats['empty_questions'] += 1

            # Options
            opts = q.get('options', [])
            if isinstance(opts, list) and len(opts) >= 2:
                overall_stats['has_options'] += 1
            else:
                overall_stats['option_count_issues'] += 1
                f_opt_issues += 1

            # Answer
            ans = q.get('correct_answer') or q.get('correctAnswer') or q.get('answer')
            ans_idx = q.get('ans')
            if ans is not None:
                overall_stats['has_correct_answer'] += 1
            else:
                f_no_ans += 1

            if ans_idx is not None and isinstance(ans_idx, int) and 0 <= ans_idx < len(opts):
                overall_stats['has_ans_idx'] += 1

            # Explanation
            exp = (q.get('explanation') or '').strip()
            if exp:
                overall_stats['has_explanation'] += 1
            else:
                overall_stats['empty_explanations'] += 1
                f_no_exp += 1

            # Hints
            h = (q.get('hints') or '').strip()
            if h:
                overall_stats['has_hints'] += 1
            else:
                overall_stats['empty_hints'] += 1
                f_no_hints += 1

            # Check if deprecated 'hint' key still exists
            if 'hint' in q:
                overall_stats['has_old_hint_key'] += 1
                f_old_hint += 1

            # Check emojis
            for c in h:
                cp = ord(c)
                if (0x1F000 <= cp <= 0x1FAFF or 0x231A <= cp <= 0x23F9 or (0x2600 <= cp <= 0x26FF and cp not in [0x2605]) or (0x2700 <= cp <= 0x2712)):
                    overall_stats['emojis_in_hints'] += 1

        file_reports.append({
            'file': rel_path,
            'questions': f_q_count,
            'missing_exp': f_no_exp,
            'missing_hints': f_no_hints,
            'old_hint_keys': f_old_hint,
            'opt_issues': f_opt_issues,
            'no_ans': f_no_ans
        })

    print(f"\nAudit completed for {len(file_reports)} files.")
    print("-" * 70)
    for rep in file_reports:
        issues = []
        if rep['missing_exp'] > 0:
            issues.append(f"missing exp: {rep['missing_exp']}")
        if rep['missing_hints'] > 0:
            issues.append(f"missing hints: {rep['missing_hints']}")
        if rep['old_hint_keys'] > 0:
            issues.append(f"old 'hint' keys: {rep['old_hint_keys']}")
        if rep['opt_issues'] > 0:
            issues.append(f"opt issues: {rep['opt_issues']}")
        if rep['no_ans'] > 0:
            issues.append(f"no ans: {rep['no_ans']}")

        issue_str = ", ".join(issues) if issues else "All Perfect (100% OK)"
        print(f"[{issue_str}] {rep['file']} ({rep['questions']} Qs)")

    print("\n" + "=" * 70)
    print("SUMMARY METRICS")
    print("=" * 70)
    for k, v in overall_stats.items():
        print(f"  {k:25}: {v}")
    print("=" * 70)

if __name__ == '__main__':
    audit_ict()
