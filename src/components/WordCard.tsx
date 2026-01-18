"use client";
import React, { useState } from 'react';

interface WordCardProps {
  word: string;
  definition: string;
  origin: string;
  partOfSpeech: string;
  difficulty: string;
  onNext: () => void;
}

export default function WordCard({ word, definition, origin, partOfSpeech, difficulty, onNext }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
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
          <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem', color: '#fff' }}>{word}</h2>
          <button onClick={(e) => { e.stopPropagation(); speak(); }} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          background: 'rgba(20, 20, 25, 0.95)',
          border: '1px solid var(--primary)',
          transform: 'rotateY(180deg)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Definition</h3>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: '1.5' }}>{definition}</p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
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
