"use client";
import React, { useState, useEffect } from 'react';

interface WordCardProps {
  word: string;
  definition: string;
  origin: string;
  partOfSpeech: string;
  difficulty: string;
  isBookmarked?: boolean;
  isMastered?: boolean;
  onToggleBookmark?: () => void;
  onNext: (mastered: boolean) => void;
}

import styles from './WordCard.module.css';

export default function WordCard({
  word,
  definition,
  origin,
  partOfSpeech,
  difficulty,
  isBookmarked = false,
  isMastered = false,
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
          setVoicesLoaded(true);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

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

      const samantha = voices.find(v => v.name === 'Samantha');
      const preferredVoice = samantha ||
        voices.find(v => v.lang === 'en-US') ||
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0];

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
    <div className={styles.container}>
      <div
        className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div className={`${styles.face} ${styles.front}`}>
          <span className={styles.difficulty}>{difficulty}</span>

          {isMastered && (
            <div className={styles.masteredBadge}>
              MASTERED
            </div>
          )}

          {onToggleBookmark && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
              className={`${styles.bookmarkBtn} ${isBookmarked ? styles.bookmarkActive : styles.bookmarkInactive}`}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
          )}

          <h2 className={styles.word}>{word}</h2>
          <button
            onClick={(e) => { e.stopPropagation(); speak(); }}
            className={`${styles.speakBtn} ${!voicesLoaded ? 'vibrate' : ''}`}
          >
            🔊
          </button>
        </div>

        {/* Back */}
        <div className={`${styles.face} ${styles.back}`}>
          <h3 className={styles.backTitle}>Definition</h3>
          <p className={styles.definition}>{definition}</p>
          <div className={styles.meta}>
            <span className={styles.metaItem}>Origin: {origin}</span>
            <span className={styles.metaItem}>Type: {partOfSpeech}</span>
          </div>

          <button
            className={styles.imageSearchBtn}
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(word)}`, '_blank');
            }}
          >
            🖼️ Search Visual Aid
          </button>
        </div>
      </div>

      <div className={styles.nextContainer}>
        {isFlipped ? (
          <div className={styles.flippedActions}>
            <button
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); onNext(false); }}
              className={`${styles.nextBtn} ${styles.practiceBtn}`}
            >
              Keep Practicing
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); onNext(true); }}
              className={`${styles.nextBtn} ${styles.masterBtn}`}
            >
              Mark as Mastered
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(false); }}
            className={styles.nextBtn}
          >
            Next Word
          </button>
        )}
      </div>
    </div>
  );
}

