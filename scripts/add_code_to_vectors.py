import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

filepath = os.path.join('src', 'app', 'graph-images', 'vectorData.jsx')
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find each item block
# Each item has:
# renderVector: () => (
#   ... (JSX code) ...
# )
# },

# We want to extract the JSX code inside renderVector: () => (\n(.*?)\n    \)
pattern = re.compile(r"(renderVector:\s*\(\)\s*=>\s*\(\n)(.*?)(\n\s*\)\n\s*\},?)", re.DOTALL)

def replacer(match):
    prefix = match.group(1)
    jsx_code = match.group(2)
    suffix = match.group(3)
    
    # Clean the jsx code to make a nice codeSnippet string
    # Remove leading 6 or 8 spaces
    lines = jsx_code.split('\n')
    cleaned_lines = []
    min_indent = 999
    for line in lines:
        if line.strip():
            indent = len(line) - len(line.lstrip())
            if indent < min_indent:
                min_indent = indent
    if min_indent == 999:
        min_indent = 0
    
    for line in lines:
        if len(line) >= min_indent:
            cleaned_lines.append(line[min_indent:])
        else:
            cleaned_lines.append(line.lstrip())
    
    clean_snippet = '\n'.join(cleaned_lines).replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')
    
    code_field = f"    codeSnippet: `{clean_snippet}`,\n"
    return f"{code_field}{prefix}{jsx_code}{suffix}"

new_content = pattern.sub(replacer, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Updated {filepath} with codeSnippet for all items successfully!")
