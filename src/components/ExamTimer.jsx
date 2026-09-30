'use client';

import React, { useState, useEffect } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

export default function ExamTimer({ totalMinutes = 60, initialMinutes, totalSeconds: propTotalSeconds, onTimeUp, isSubmitted }) {
  const computedSeconds = propTotalSeconds !== undefined
    ? propTotalSeconds
    : Math.round((totalMinutes !== undefined ? totalMinutes : (initialMinutes !== undefined ? initialMinutes : 60)) * 60);

  const [secondsLeft, setSecondsLeft] = useState(computedSeconds);

  useEffect(() => {
    setSecondsLeft(computedSeconds);
  }, [computedSeconds]);

  useEffect(() => {
    if (isSubmitted) return;

    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp, isSubmitted]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;
  const isCritical = secondsLeft < 300; // less than 5 mins

  const displayTime = hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '10px',
      background: isCritical ? 'rgba(244, 63, 94, 0.18)' : 'rgba(16, 185, 129, 0.15)',
      border: `1px solid ${isCritical ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.3)'}`,
      color: isCritical ? '#fb7185' : '#34d399',
      fontWeight: 700,
      fontSize: '1.05rem',
      boxShadow: isCritical ? '0 0 15px rgba(244, 63, 94, 0.25)' : 'none'
    }}>
      {isCritical ? <AlertTriangle size={18} /> : <Timer size={18} />}
      <span>{displayTime}</span>
    </div>
  );
}
