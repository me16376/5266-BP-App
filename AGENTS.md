# 5266-BP App & 5266-AI-extension — Agent Master Guide

Welcome to **5266-BP App** repository. Before analyzing or modifying any code, read this guide thoroughly.

---

## 1. Project Overview & Architecture
- **Web App**: Next.js 14 App Router application deployed on Cloudflare Pages.
- **Master Question Banks**:
  1. **Job Solutions**: Located at `public/data/job-solution/` containing 2,154 exams across 8 categories (BCS, Bank, Primary, NTRCA, Ministries, Admission, Subject-wise, Judicial).
     - Catalog: `public/data/exams_index.json` | Loader: `src/lib/examsData.js`.
     - Routes: `/job-solution`, `/job-solution-practice`, `/job-solution-model-test`, `/question-bank-smart`, `/question-bank-smart-questions`.
  2. **ICT Question Bank**: Located at `public/data/ict/` containing 17 chapter exams across Class 9-10 Computer GK and ICT Wizard NTRCA (1,758 MCQs).
     - Catalog: `public/data/ict_index.json` | Loader: `src/lib/ictData.js`.
     - Routes: `/ict`, `/ict-practice`, `/ict-model-test`, `/ict-smart`, `/ict-smart-questions`.
  3. **Most Important Questions**: Located at `public/data/most-important-questions/` containing 12 high-priority subjects (4,904 MCQs) for Primary, NTRCA, BCS, Bank, 10th-20th Grade, Bangladesh & International Affairs.
     - Catalog: `public/data/most_important_index.json` | Loader: `src/lib/mostImportantData.js`.
     - Routes: `/most-important-questions`, `/most-important-questions-practice`, `/most-important-questions-model-test`, `/most-important-smart`, `/most-important-smart-questions`.
- **Development Server**: Must always be kept running locally (`npm run dev` on port 3000).

---

## 2. 5266-AI-extension — Personal Chrome Extension
> **CRITICAL RULE**: This extension is strictly for the website owner's **personal use** with this website. It is **NOT** for public users or students.

### Purpose
Allows the owner to get instant, unlimited, and detailed MCQ explanations using their personal logged-in Google Gemini account (`gemini.google.com`) directly inside the Chrome Side Panel without paying for Gemini API keys.

### File Structure & Workflow
- **`5266-AI-extension/manifest.json`**: Manifest V3 extension configuration with `sidePanel`, `declarativeNetRequest`, `storage`, and `tabs` permissions.
- **`5266-AI-extension/rules.json`**: Modifies response headers for `||gemini.google.com` by stripping `x-frame-options`, `content-security-policy`, and `frame-options` so Gemini safely loads inside the sidepanel iframe.
- **`5266-AI-extension/content-site.js`**: Injected into `localhost` and `pages.dev` to bridge `window.postMessage('5266_ASK_AI')` events to `chrome.runtime.sendMessage`.
- **`5266-AI-extension/content-gemini.js`**: Injected into `gemini.google.com`. Automatically populates Gemini's prompt input, avoids document text-selection highlighting (`window.getSelection().removeAllRanges()`), auto-clicks send/submits, and injects compact styles (`injectCompactStyles`) to eliminate excessive empty vertical gaps around KaTeX math equations.
- **`5266-AI-extension/background.js`**: Service worker. Enforces allowed sites per tab (`syncTabSidePanel`), cleans LaTeX/HTML formatting (`cleanText`), formats clean Bengali MCQ prompts (`formatBengaliPrompt`), and invokes `chrome.sidePanel.open()`.
- **`5266-AI-extension/sidepanel.html` / `.js` / `.css`**: Modern 42px header, brand badge, question snippet, quick copy, quick resend, question drawer toggle, reload, new chat session, quick prompt chips ("অন্যান্য অপশন তথ্য ও ভুল", "টেকনিক ও শর্টকাট কৌশল"), and full-height Gemini iframe.
- **`5266-AI-extension/5266-AI-extension.txt`**: User-facing Bengali documentation of the extension.

---

## 3. Mandatory Agent Instructions
1. **Always Read Rules First**: Refer to `.agents/rules/5266_ai_extension_guide.md` and `.agents/rules/always_run_dev.md`.
2. **Preserve Iframe & Header Bypass**: Never remove or alter the declarative net request security bypass rules in `rules.json` and `manifest.json`.
3. **Data Path Consistency**: Any exam JSON files must be referenced from `/data/job-solution/`.
4. **Dev Server**: Always ensure the Next.js dev server is running so the user can immediately test in their browser.
5. **Auto-Sync 5266-AI-extension**: Whenever any code, page, route, component, or data format is changed in the website project, IMMEDIATELY verify whether `5266-AI-extension` requires corresponding updates (e.g., MCQ payload, `window.postMessage` listeners, allowed hosts, selectors, prompt formatting) and update the extension code and documentation synchronously.
