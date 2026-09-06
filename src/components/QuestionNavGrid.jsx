'use client';

import React from 'react';

export default function QuestionNavGrid({ 
  total, 
  userAnswers, 
  currentIndex, 
  onSelectIndex 
}) {
  return (
    <div className="glass-panel" style={{ padding: '16px', position: 'sticky', top: '90px', background: '#ffffff' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        fontSize: '0.9rem',
        fontWeight: 700,
        color: '#0f172a'
      }}>
        <span>প্রশ্ন তালিকা ({Object.keys(userAnswers).length}/{total})</span>
      </div>

      {/* Mini Status Legend */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', fontSize: '0.78rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--emerald-500)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>উত্তর দিয়েছেন</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#e2e8f0' }} />
          <span style={{ color: 'var(--text-muted)' }}>বাকি আছে</span>
        </div>
      </div>

      {/* Grid Palette */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))',
        gap: '6px',
        maxHeight: '360px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {Array.from({ length: total }, (_, i) => {
          const isAnswered = userAnswers[i] !== undefined;
          const isCurrent = currentIndex === i;

          let bg = '#f8fafc';
          let border = '1px solid #e2e8f0';
          let color = '#475569';

          if (isAnswered) {
            bg = '#ecfdf5';
            border = '1px solid var(--emerald-500)';
            color = '#047857';
          }

          if (isCurrent) {
            border = '2px solid #0284c7';
          }

          return (
            <button
              key={i}
              onClick={() => onSelectIndex(i)}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '6px',
                background: bg,
                border: border,
                color: color,
                fontWeight: 700,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
