import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/app/graph-images/vectorData.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect how items are defined
items = re.findall(r"\{\s*id:\s*'([^']+)'", text)
print(f"Found {len(items)} item IDs")
