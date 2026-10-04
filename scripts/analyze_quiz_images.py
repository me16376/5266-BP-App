import os
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

quiz_img_dir = os.path.join('public', 'images', 'quiz')
available_images = set(os.listdir(quiz_img_dir)) if os.path.exists(quiz_img_dir) else set()
print(f"Total files in public/images/quiz: {len(available_images)}")

img_pattern = re.compile(r'/images/quiz/([^\s"\'<>]+)')

found_refs = {}
question_details = []

for root, dirs, files in os.walk(os.path.join('public', 'data')):
    for f in files:
        if f.endswith('.json') and not f.endswith('_index.json'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as fp:
                try:
                    data = json.load(fp)
                    questions = data if isinstance(data, list) else data.get('questions', [])
                    for q in questions:
                        q_str = json.dumps(q, ensure_ascii=False)
                        matches = img_pattern.findall(q_str)
                        if matches:
                            question_details.append({
                                'file': path,
                                'id': q.get('id'),
                                'question': q.get('question'),
                                'options': q.get('options'),
                                'correct_answer': q.get('correct_answer') or q.get('correctAnswer'),
                                'explanation': q.get('explanation'),
                                'subject': q.get('subject'),
                                'images': matches
                            })
                            if path not in found_refs:
                                found_refs[path] = set()
                            for m in matches:
                                found_refs[path].add(m)
                except Exception as e:
                    pass

print(f"Total JSON files referencing quiz images: {len(found_refs)}")
print(f"Total question objects with quiz images: {len(question_details)}")

all_referenced_images = set()
for p, imgs in found_refs.items():
    print(f"\nFile: {p} ({len(imgs)} images)")
    for img in sorted(imgs):
        exists = img in available_images
        print(f"  {img} -> exists: {exists}")
        all_referenced_images.add(img)

print(f"\nUnique images referenced in questions: {len(all_referenced_images)}")
print(f"Images in folder but not referenced: {len(available_images - all_referenced_images)}")
for unref in sorted(available_images - all_referenced_images):
    print(f"  Unreferenced: {unref}")

# Group questions by type of image
print("\n--- Detailed breakdown of questions with images ---")
for idx, qd in enumerate(question_details, 1):
    print(f"\n[{idx}] ID: {qd['id']} | Subject: {qd['subject']} | File: {os.path.basename(qd['file'])}")
    print(f"    Images: {qd['images']}")
    print(f"    Question text: {qd['question'][:120]}...")
    print(f"    Options: {qd['options']}")
