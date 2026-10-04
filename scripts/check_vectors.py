import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/app/graph-images/vectorData.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

quiz_dir = os.path.join('public', 'images', 'quiz')
quiz_files = sorted(os.listdir(quiz_dir))

found_filenames = set(re.findall(r"filename:\s*['\"]([^'\"]+)['\"]", code))
print(f"Total quiz files on disk: {len(quiz_files)}")
print(f"Total files in vectorData.jsx: {len(found_filenames)}")

missing = [fn for fn in quiz_files if fn not in found_filenames]
print(f"Missing from vectorData: {len(missing)}")
for m in missing:
    print(f"  Missing: {m}")
