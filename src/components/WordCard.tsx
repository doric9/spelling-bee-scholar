"use client";
import React, { useState, useEffect } from 'react';

interface WordCardProps {
  word: string;
  definition: string;
  origin: string;
  partOfSpeech: string;
  difficulty: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onNext: () => void;
}

export default function WordCard({
  word,
  definition,
  origin,
  partOfSpeech,
  difficulty,
  isBookmarked = false,
  onToggleBookmark,
  onNext
}: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const v = window.speechSynthesis.getVoices();
        if (v.length > 0) {
          console.log("DEBUG: Voices found!", v.length);
          setVoicesLoaded(true);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      // Force-check voices every 500ms until they appear (for MacOS stability)
      const interval = setInterval(() => {
        const v = window.speechSynthesis.getVoices();
        if (v.length > 0) {
          setVoicesLoaded(true);
          clearInterval(interval);
        }
      }, 500);

      return () => {
        clearInterval(interval);
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();

      // Find a reliable MacOS voice - prefer Samantha, then any en-US voice
      const samantha = voices.find(v => v.name === 'Samantha');
      const preferredVoice = samantha ||
        voices.find(v => v.lang === 'en-US') ||
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0];

      console.log("DEBUG: Using voice:", preferredVoice?.name, "for word:", word);

      synth.cancel();
      synth.resume();

      const utterance = new SpeechSynthesisUtterance(word);
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.volume = 1.0;

      synth.speak(utterance);
    }
  };

  return (
    <div className="word-card-container" style={{ perspective: '1000px', width: '100%', maxWidth: '500px', height: '400px', margin: '0 auto' }}>
      <div
        className={`word-card ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '24px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'var(--glass-blur)',
          boxShadow: 'var(--card-shadow)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{difficulty}</span>

          {onToggleBookmark && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: isBookmarked ? 'var(--primary)' : 'var(--text-muted)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
          )}

          <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem', color: 'var(--foreground)' }}>{word}</h2>
          <button
            onClick={(e) => { e.stopPropagation(); speak(); }}
            className={!voicesLoaded ? 'vibrate' : ''}
            style={{
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: `1px solid ${voicesLoaded ? 'var(--border)' : 'var(--primary)'}`,
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'none',
              opacity: voicesLoaded ? 1 : 0.7
            }}
          >
            🔊
          </button>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '24px',
          background: '#1e293b',
          border: '1px solid var(--primary)',
          transform: 'rotateY(180deg)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Definition</h3>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: '1.5', color: '#f1f5f9' }}>{definition}</p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            <span>Origin: {origin}</span>
            <span>Type: {partOfSpeech}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        <button onClick={(e) => { e.stopPropagation(); setIsFlipped(false); onNext(); }} style={{ width: '200px' }}>Next Word</button>
      </div>
    </div>
  );
}
