import os
import glob
import json
import re
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

emoji_chars = (
    r'[\U0001F000-\U0001FAFF]'
    r'|[\u231A\u231B\u2328\u23E9\u23F0-\u23F3\u23F8\u23F9]'
    r'|[\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u261E\u2620\u2622\u2623\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2662\u2663\u2665\u2666\u2668\u266A\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26FA\u26FD]'
    r'|[\u2702\u2705\u2708-\u270D\u270F\u2710\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF]'
    r'|[\u2B50-\u2B55]'
)

emoji_token = rf'(?:(?:{emoji_chars})[\uFE0E\uFE0F]?(?:\u200D(?:{emoji_chars})[\uFE0E\uFE0F]?)*)'
emoji_regex = re.compile(emoji_token)

def clean_hint(text):
    if not text or not isinstance(text, str):
        return text
    # 1. Remove emojis
    res = emoji_regex.sub('', text)
    # 2. Strip leading whitespace/empty lines
    lines = [re.sub(r'^[ \t]+', '', l) for l in res.split('\n')]
    res = '\n'.join(lines)
    # 3. Collapse multiple horizontal spaces
    res = re.sub(r'[ \t]{2,}', ' ', res)
    return res.strip()

def process_all_files():
    start_time = time.time()
    folders = [
        'public/data/job-solution',
        'public/data/most-important-questions',
        'public/data/ict'
    ]

    total_files_scanned = 0
    total_files_updated = 0
    total_questions = 0
    total_hints_cleaned = 0

    for folder in folders:
        for filepath in glob.glob(f'{folder}/**/*.json', recursive=True):
            filename = os.path.basename(filepath).lower()
            if 'index' in filename:
                continue

            total_files_scanned += 1
            file_modified = False

            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                is_dict = isinstance(data, dict)
                questions = data.get('questions', []) if is_dict else (data if isinstance(data, list) else [])

                for q in questions:
                    total_questions += 1
                    hints = q.get('hints', '')
                    if hints:
                        cleaned = clean_hint(hints)
                        if cleaned != hints:
                            q['hints'] = cleaned
                            total_hints_cleaned += 1
                            file_modified = True

                if file_modified:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(data, f, ensure_ascii=False, indent=2)
                    total_files_updated += 1

            except Exception as e:
                print(f"Error processing {filepath}: {e}")

            if total_files_scanned % 200 == 0:
                print(f"Progress: scanned {total_files_scanned} files, cleaned {total_hints_cleaned} hints in {total_files_updated} files...")

    elapsed = time.time() - start_time
    print("=" * 60)
    print("EMOJI REMOVAL COMPLETED")
    print(f"Total files scanned: {total_files_scanned}")
    print(f"Total files updated: {total_files_updated}")
    print(f"Total questions scanned: {total_questions}")
    print(f"Total hints cleaned: {total_hints_cleaned}")
    print(f"Time taken: {elapsed:.2f} seconds")
    print("=" * 60)

if __name__ == '__main__':
    process_all_files()
