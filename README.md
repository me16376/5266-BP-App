# JobSolutions BD — Next.js MCQ Exam Platform & File Studio

A high-performance, modern Next.js web application for Bangladeshi competitive job exams (BCS Preliminary, Bank Recruitment, NTRCA & Primary Teachers, Ministries & Non-Cadre, University Admission, and Subject-wise Preparation) featuring an in-browser File Studio for `.xapk` and SQLite `.db` files.

Designed for instant zero-cold-start deployment to **Cloudflare Pages via GitHub**.

---

## 🌟 Key Features

1. **2,50,000+ Questions & 2,154 Exams:**
   - Covers 10th to 46th BCS Preliminary, Bangladesh Bank, Combined 8 Banks, Primary Assistant Teachers, 17th NTRCA, Ministries, and Academic Subjects.
   - Comprehensive metadata catalog with search & multi-level filters.

2. **3 Study & Exam Modes:**
   - **Practice Mode (প্র্যাকটিস মোড):** Instant feedback on click (green/red indicator), automatic reveal of detailed explanations (📖 সাধারণ ব্যাখ্যা) and shortcut notes (📝 স্পেশাল নোট ও শর্টকাট).
   - **Read Mode (পড়ুন মোড):** Ideal for rapid revision — all correct answers and notes visible.
   - **Live Model Test Room (মডেল টেস্ট):** Real-time countdown timer, question palette navigation grid (answered, skipped, marked), negative marking (0.50 per wrong answer), and analytical scorecard.

3. **Universal File Studio (`/file-studio`):**
   - **SQLite .DB Reader & SQL Console:** Uses client-side WebAssembly (`sql.js`) to open any SQLite `.db` file, list tables, run SQL queries, and extract MCQs into playable quizzes directly in memory!
   - **XAPK / ZIP Extractor:** In-browser archive unzipping via `JSZip` to view `manifest.json`, internal APKs, and assets.
   - **100% Client-Side:** Zero file uploads to servers. Private, secure, and works offline.

4. **Personal Library & Bookmarks (`/bookmarks`):**
   - Save difficult questions with one click.
   - Preserves complete model test scores and accuracy history in browser `localStorage`.

5. **Cloudflare Pages & GitHub Ready:**
   - Static export (`output: 'export'`) with `wrangler.toml`.
   - Lightweight repository (<25MB) for ultra-fast Git push and instant Cloudflare Pages edge builds.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm run install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Cloudflare Pages via GitHub

For detailed step-by-step deployment instructions, see [CLOUDFLARE_DEPLOYMENT_GUIDE.md](file:///c:/Users/Mosabber/Downloads/Mosabber/5266-BP%20App/CLOUDFLARE_DEPLOYMENT_GUIDE.md).

Summary:
- **Framework Preset:** `Next.js (Static Export)` or `None`
- **Build Command:** `npm run build`
- **Build Output Directory:** `out`
