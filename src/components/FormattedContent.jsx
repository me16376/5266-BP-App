'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import katex from 'katex';

/**
 * Escapes HTML characters inside code blocks to prevent raw tag execution
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Unescapes basic HTML entities inside math expressions
 * so KaTeX can process <, >, &, etc.
 */
function unescapeMathEntities(mathStr) {
  if (!mathStr) return '';
  return mathStr
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/**
 * Formats a string containing Markdown Code blocks, Inline Code,
 * HTML, and/or LaTeX formulas.
 * 
 * Supports:
 * - Fenced code blocks ```lang ... ``` with copy button
 * - Inline code `...`
 * - Display math \[ ... \] and $$ ... $$
 * - Inline math \( ... \) and $ ... $
 * - HTML tags like <br/>, <p>, <table>, <b>, <i>, <u>, etc.
 * - Auto-converts raw newlines to <br/> outside code/math
 * - Security & responsive fixes for links and tables
 */
export function formatContentHtml(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText;
  const placeholders = [];

  const addPlaceholder = (html) => {
    const key = `@@@PH_${placeholders.length}_${Math.random().toString(36).substring(2, 7)}@@@`;
    placeholders.push({ key, html });
    return key;
  };

  // 1. Fenced Code Blocks: ```lang\ncode\n```
  text = text.replace(/(?:^|\n)```([a-zA-Z0-9_\-\+]*)\r?\n([\s\S]*?)```/g, (match, lang, code) => {
    const cleanLang = (lang || '').trim();
    const cleanCode = code.replace(/\r\n/g, '\n').replace(/\n$/, '');
    const encodedForCopy = encodeURIComponent(cleanCode);
    const escapedCode = escapeHtml(cleanCode);

    const badge = cleanLang ? `<span class="code-lang-badge">${escapeHtml(cleanLang)}</span>` : '<span class="code-lang-badge">code</span>';
    const copyBtn = `<button type="button" class="code-copy-btn" data-code="${encodedForCopy}" title="কোড কপি করুন">কপি</button>`;

    const blockHtml = `<div class="formatted-code-container"><div class="code-header">${badge}${copyBtn}</div><pre class="formatted-code-pre"><code>${escapedCode}</code></pre></div>`;
    return '\n' + addPlaceholder(blockHtml) + '\n';
  });

  // 2. Pre-existing HTML <pre>...</pre> tags
  text = text.replace(/<pre[\s\S]*?<\/pre>/gi, (match) => {
    return addPlaceholder(match);
  });

  // 3. Display Math: \[ ... \] or $$ ... $$
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (match, formula) => {
    try {
      const cleanFormula = unescapeMathEntities(formula.trim());
      const rendered = katex.renderToString(cleanFormula, {
        displayMode: true,
        throwOnError: false,
        strict: 'ignore'
      });
      return addPlaceholder(rendered);
    } catch (e) {
      return match;
    }
  });

  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    try {
      const cleanFormula = unescapeMathEntities(formula.trim());
      const rendered = katex.renderToString(cleanFormula, {
        displayMode: true,
        throwOnError: false,
        strict: 'ignore'
      });
      return addPlaceholder(rendered);
    } catch (e) {
      return match;
    }
  });

  // 4. Inline Math: \( ... \)
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (match, formula) => {
    try {
      const cleanFormula = unescapeMathEntities(formula.trim());
      const rendered = katex.renderToString(cleanFormula, {
        displayMode: false,
        throwOnError: false,
        strict: 'ignore'
      });
      return addPlaceholder(rendered);
    } catch (e) {
      return match;
    }
  });

  // 5. Inline Math: $ ... $ (excluding currency like $50 or $100.50)
  text = text.replace(/(^|[^\\])\$([^\$\r\n]+?)\$/g, (match, prefix, formula) => {
    const trimmed = formula.trim();
    // Exclude if empty or starts/ends with space or looks like currency number
    if (!trimmed || /^\s|\s$/.test(formula) || /^[\d,]+(\.\d+)?$/.test(trimmed)) {
      return match;
    }
    try {
      const cleanFormula = unescapeMathEntities(trimmed);
      const rendered = katex.renderToString(cleanFormula, {
        displayMode: false,
        throwOnError: false,
        strict: 'ignore'
      });
      return prefix + addPlaceholder(rendered);
    } catch (e) {
      return match;
    }
  });

  // 6. Inline Code: `...`
  text = text.replace(/`([^`\r\n]+)`/g, (match, inlineCode) => {
    const rendered = `<code class="formatted-inline-code">${escapeHtml(inlineCode)}</code>`;
    return addPlaceholder(rendered);
  });

  // 7. Normalize HTML and Line Breaks outside of code & math
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(text);
  if (!hasHtmlTags) {
    text = text.replace(/\r\n|\r|\n/g, '<br/>');
  } else {
    text = text
      .replace(/<br\s*\/?>\s*\n/gi, '<br/>')
      .replace(/\n\s*<br\s*\/?>/gi, '<br/>')
      .replace(/(<\/?(table|tbody|thead|tr|th|td|ul|ol|li|div|p|blockquote|h[1-6])[\s\S]*?>)\s*\n/gi, '$1')
      .replace(/\n\s*(<\/?(table|tbody|thead|tr|th|td|ul|ol|li|div|p|blockquote|h[1-6]))/gi, '$1')
      .replace(/\n/g, '<br/>');
  }

  // 8. Secure anchor links (<a href="...">)
  text = text.replace(/<a\s+([^>]*?)>/gi, (match, attrs) => {
    let clean = attrs;
    if (!/target=/i.test(clean)) clean += ' target="_blank"';
    if (!/rel=/i.test(clean)) clean += ' rel="noopener noreferrer"';
    return `<a ${clean}>`;
  });

  // 9. Restore all placeholders
  for (const { key, html } of placeholders) {
    text = text.replace(key, html);
  }

  return text;
}

export default function FormattedContent({
  content,
  inline = false,
  className = '',
  style = {}
}) {
  const containerRef = useRef(null);
  const html = useMemo(() => formatContentHtml(content), [content]);

  // Attach copy listeners for code blocks
  useEffect(() => {
    if (!containerRef.current) return;
    const buttons = containerRef.current.querySelectorAll('.code-copy-btn');
    if (!buttons || buttons.length === 0) return;

    const handleCopy = (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const rawCode = btn.getAttribute('data-code');
      if (rawCode) {
        try {
          const decoded = decodeURIComponent(rawCode);
          navigator.clipboard.writeText(decoded);
          const originalText = btn.textContent;
          btn.textContent = 'কপি হয়েছে!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code:', err);
        }
      }
    };

    buttons.forEach((btn) => btn.addEventListener('click', handleCopy));
    return () => {
      buttons.forEach((btn) => btn.removeEventListener('click', handleCopy));
    };
  }, [html]);

  if (!html) return null;

  const Tag = inline ? 'span' : 'div';

  return (
    <Tag
      ref={containerRef}
      className={`formatted-content ${className}`.trim()}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
