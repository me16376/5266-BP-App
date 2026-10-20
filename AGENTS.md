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
   4. **Ampibian Suggestion**: Located at `public/data/Ampibian Suggestion/` containing 84 chapter exams across 4 subjects: Bangla, English, GK, Math (6,157 MCQs).
     - Catalog: `public/data/ampibian_index.json` | Loader: `src/lib/ampibianData.js`.
     - Routes: `/ampibian-suggestion`, `/ampibian-suggestion-practice`, `/ampibian-suggestion-model-test`, `/ampibian-suggestion-smart`, `/ampibian-suggestion-smart-questions`.
   5. **Biddabari-NTRCA**: Located at `public/data/Biddabari-NTRCA/` containing 67 lecture exams across Bangla, English, GK, Math (9,974 MCQs).
     - Catalog: `public/data/biddabari_index.json` | Loader: `src/lib/biddabariData.js`.
     - Routes: `/biddabari-ntrca`, `/biddabari-ntrca-practice`, `/biddabari-ntrca-model-test`, `/biddabari-ntrca-smart`, `/biddabari-ntrca-smart-questions`.
   6. **Smart AI**: Located at `public/data/Smart AI/` containing 89 curated exams across BPSC Technical AI, NTRCA 313 & 325, NTRCA 452, and NTRCA Preliminary (17,100 MCQs).
     - Catalog: `public/data/smart_ai_index.json` | Loader: `src/lib/smartAiData.js`.
     - Routes: `/smart-ai`, `/smart-ai-practice`, `/smart-ai-model-test`, `/smart-ai-smart`, `/smart-ai-smart-questions`.
   7. **BUET Pattern Suggestion**: Located at `public/data/BUET Patern Suggestion/` containing 57 chapter exams across Bangla, English, GK, Math (5,460 MCQs).
     - Catalog: `public/data/buet_pattern_index.json` | Loader: `src/lib/buetPatternData.js`.
     - Routes: `/buet-pattern-suggestion`, `/buet-pattern-suggestion-practice`, `/buet-pattern-suggestion-model-test`, `/buet-pattern-suggestion-smart`, `/buet-pattern-suggestion-smart-questions`.
   8. **BPSC Non Tech Questions**: Located at `public/data/BPSC Non Tech Questions/` containing 7 subject-wise full banks across Bangla, English, Math, Bangladesh Affairs, International Affairs, Science, ICT (5,664 MCQs).
     - Catalog: `public/data/bpsc_non_tech_questions_index.json` | Loader: `src/lib/bpscNonTechQuestionsData.js`.
     - Routes: `/bpsc-non-tech-questions`, `/bpsc-non-tech-questions-practice`, `/bpsc-non-tech-questions-model-test`, `/bpsc-non-tech-questions-smart`, `/bpsc-non-tech-questions-smart-questions`.
   9. **BPSC Non Tech Suggestion**: Located at `public/data/BPSC Non Tech Suggestion/` containing 91 chapter exams across 8 categories (5,664 MCQs).
     - Catalog: `public/data/bpsc_non_tech_suggestion_index.json` | Loader: `src/lib/bpscNonTechSuggestionData.js`.
     - Routes: `/bpsc-non-tech-suggestion`, `/bpsc-non-tech-suggestion-practice`, `/bpsc-non-tech-suggestion-model-test`, `/bpsc-non-tech-suggestion-smart`, `/bpsc-non-tech-suggestion-smart-questions`.
   10. **Saif Sir NTRCA 100 MCQ Model**: Located at `public/data/Saif Sir NTRCA 100 MCQ model/` containing 75 full 100 MCQ tests across Bangla, English, GK, Math (7,225 MCQs).
     - Catalog: `public/data/saif_ntrca_100_model_index.json` | Loader: `src/lib/saifNtrca100ModelData.js`.
     - Routes: `/saif-ntrca-100-model`, `/saif-ntrca-100-model-practice`, `/saif-ntrca-100-model-model-test`, `/saif-ntrca-100-model-smart`, `/saif-ntrca-100-model-smart-questions`.
   11. **Saif Sir NTRCA Suggestion**: Located at `public/data/Saif Sir NTRCA Suggestion/` containing 338 short bulletin model tests across Bangla, English, GK, Math (7,225 MCQs).
     - Catalog: `public/data/saif_ntrca_suggestion_index.json` | Loader: `src/lib/saifNtrcaSuggestionData.js`.
     - Routes: `/saif-ntrca-suggestion`, `/saif-ntrca-suggestion-practice`, `/saif-ntrca-suggestion-model-test`, `/saif-ntrca-suggestion-smart`, `/saif-ntrca-suggestion-smart-questions`.

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
1. **Always Read Rules First**: Refer to `.agents/rules/5266_ai_extension_guide.md`.
2. **Preserve Iframe & Header Bypass**: Never remove or alter the declarative net request security bypass rules in `rules.json` and `manifest.json`.
3. **Data Path Consistency**: Any exam JSON files must be referenced from `/data/job-solution/`.
4. **Auto-Sync 5266-AI-extension**: Whenever any code, page, route, component, or data format is changed in the website project, IMMEDIATELY verify whether `5266-AI-extension` requires corresponding updates (e.g., MCQ payload, `window.postMessage` listeners, allowed hosts, selectors, prompt formatting) and update the extension code and documentation synchronously.
5. **Always Run `npm run dev` After Coding**: Every time you finish coding, editing, or making changes, you MUST ensure `npm run dev` is executed and running without errors. Always keep the dev server fresh and verified.
6. **Never Auto Git Push**: Never run `git push` autonomously. Only push to Git when explicitly requested by the user ("nije nije git push dibe na").
7. **Always Prioritize Python When Beneficial / Perfect**: Wherever using Python or Python libraries/tools (such as in-memory buffers, compiled regex `re.compile`, JSON bulk parsing, dataset audits, data transformations, image/math calculations, and helper scripts) is better, faster, cleaner, or more reliable than alternative tools, ALWAYS use Python.

