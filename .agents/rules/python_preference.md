---
description: "Mandatory rule to prioritize Python for all data processing, regex, JSON manipulation, file audits, math/image analysis, and scripting where beneficial."
alwaysApply: true
---

# Python Preference & Optimization Rule

Whenever an operation, analysis, or task can be done better, faster, more safely, or more accurately with Python, **ALWAYS use Python**.

### Scenarios Where Python Must Be Used:
1. **Large Dataset & JSON Operations**:
   - Bulk reading, modifying, or validating the 2,154+ exam JSON files, ICT files, and Most Important Question files.
   - Preserving Unicode (`ensure_ascii=False`) and consistent indentation.
2. **Text Processing & Regex**:
   - Utilizing compiled regular expressions (`re.compile`) for high-speed scanning and transformations.
   - In-memory buffers (`io.StringIO`, `io.BytesIO`) for high efficiency.
3. **Data Audits & Cataloging**:
   - Auditing corruptions, broken links, missing fields, or duplicate questions across directories.
4. **Image, Graph & Math Analysis**:
   - Processing image dimensions, vector coordinates, math equations, and KaTeX conversions.
5. **Automation & Scripting**:
   - Batch fixes, data migration, and verification scripts in the `scripts/` directory.

### Key Python Standards in this Workspace:
- Always enforce UTF-8 stdout encoding for Windows:
  ```python
  import sys
  sys.stdout.reconfigure(encoding='utf-8')
  ```
- Always open files with explicit UTF-8: `open(..., encoding='utf-8')`.
- Save output with `ensure_ascii=False`.
