import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/app/graph-images/vectorData.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

classes = re.findall(r'className=["\']([^"\']+)["\']', code)
print(f'Total className instances in vectorData.jsx: {len(classes)}')
for c in classes[:25]:
    print('  ', c)
