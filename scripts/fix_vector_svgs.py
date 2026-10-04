import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

filepath = os.path.join('src', 'app', 'graph-images', 'vectorData.jsx')
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any className="..." in svg tags with style={{ maxWidth: '220px', maxHeight: '160px', width: 'auto', height: 'auto', display: 'block', margin: '0 auto' }}
# Also clean up any div / span Tailwind classes in renderVector

def fix_svg_tag(match):
    tag = match.group(0)
    # Extract viewBox
    vb_match = re.search(r'viewBox=["\']([^"\']+)["\']', tag)
    viewBox = vb_match.group(1) if vb_match else "0 0 200 200"
    
    # Determine max-width based on viewBox aspect ratio
    parts = [float(x) for x in viewBox.split()]
    if len(parts) == 4:
        vw, vh = parts[2], parts[3]
        if vw > vh * 1.5:
            # wide svg (e.g. 340 100)
            max_w = "260px"
            max_h = "130px"
        elif vh > vw * 1.2:
            # tall svg (e.g. 220 250)
            max_w = "170px"
            max_h = "170px"
        else:
            # roughly square
            max_w = "180px"
            max_h = "160px"
    else:
        max_w = "200px"
        max_h = "160px"

    return f'<svg viewBox="{viewBox}" style={{{{ maxWidth: "{max_w}", maxHeight: "{max_h}", width: "100%", height: "auto", display: "block", margin: "0 auto" }}}} xmlns="http://www.w3.org/2000/svg">'

# Replace all <svg ...> in JSX
cleaned = re.sub(r'<svg\s+[^>]*viewBox=["\'][^"\']+["\'][^>]*>', fix_svg_tag, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(cleaned)

print(f"Successfully updated all SVG tags in {filepath} with explicit style objects!")
