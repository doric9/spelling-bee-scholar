'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserProgressByTier } from '@/lib/userService';
import { words } from '@/data/words';
import { calculateTieredStats } from '@/lib/progress';

import styles from './page.module.css';

export default function Home() {
  const { user, login, logout } = useAuth();
  const [stats, setStats] = useState<Record<string, string>>({});
  const totalCount = words.length;

  useEffect(() => {
    if (user) {
      getUserProgressByTier(user.uid).then(setStats);
    }
  }, [user]);

  const tieredStats = calculateTieredStats(words, stats);
  const totalMastered = Object.values(stats).filter(s => s === 'mastered').length;

  return (
    <main className={styles.main}>
      <div className={styles.meshBackground} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.authContainer}>
          {user ? (
            <div className={styles.userProfile}>
              <span className={styles.userEmail}>Hello, {user.displayName}</span>
              {user.photoURL && (
                <div className={styles.avatar}>
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    width={32}
                    height={32}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = '0';
                    }}
                  />
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: 'var(--primary)',
                  }}>
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                </div>
              )}
              <button onClick={logout} className={styles.signOutBtn}>
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={login}>
              Sign In with Google
            </button>
          )}
        </div>

        <div className={styles.badge}>
          Official 2026 Guide
        </div>

        <h1 className={styles.title}>
          Spelling Bee <br /> Scholar
        </h1>

        <p className={styles.subtitle}>
          Master the Scripps 4,000-word roster with intelligent flashcards and immersive mock competitions.
        </p>
      </header>

      <section className={styles.grid}>
        {user && (
          <div className={`${styles.progressCard} card`}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'var(--primary-glow)', borderRadius: '50%', opacity: 0.1 }} />

            <div className={styles.progressHeader}>
              <h2 className={styles.progressTitle}>Progress Roadmap</h2>
              <div className={styles.progressStats}>
                {totalMastered.toLocaleString()} / {totalCount.toLocaleString()}
                <span className={styles.progressSub}> words mastered</span>
              </div>
            </div>

            <div className={styles.tierContainer}>
              {Object.entries(tieredStats).map(([key, tier], idx) => (
                <div key={idx} className={styles.tierCard}>
                  <div className={styles.tierIcon} style={{ background: `${tier.color}15`, color: tier.color, borderColor: `${tier.color}30` }}>
                    {key === 'OneBee' ? '🐝' : key === 'TwoBee' ? '🐝🐝' : '👑'}
                  </div>
                  <div className={styles.tierContent}>
                    <div className={styles.tierInfo}>
                      <span className={styles.tierLabel}>{tier.label}</span>
                      <span className={styles.tierCount}>{tier.mastered} / {tier.total}</span>
                    </div>
                    <div className={styles.stackedProgress}>
                      <div className={styles.masteredFill} style={{
                        width: `${tier.masteredPercentage}%`,
                        background: tier.color,
                      }} />
                      <div className={styles.learningFill} style={{
                        width: `${tier.learningPercentage}%`,
                        background: tier.secondaryColor,
                      }} />
                    </div>
                    <div className={styles.progressPercent}>
                      <span>{Math.round(tier.masteredPercentage)}% Mastered</span>
                      {tier.learning > 0 && <span>{tier.learning} Learning</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`${styles.featureCard} card`}>
          <div className={styles.cardContent}>
            <h2>Flashcard Learning</h2>
            <p>
              Deep dive into etymology, roots, and definitions using a spaced repetition system.
            </p>
          </div>
          <Link href="/learn" style={{ display: 'block' }}>
            <button style={{ width: '100%' }}>Start Learning</button>
          </Link>
        </div>

        <div className={`${styles.featureCard} card`}>
          <div className={styles.cardContent}>
            <h2>Mock Competition</h2>
            <p>
              Simulate the regional bee environment. Listen to the pronouncer and ask for info.
            </p>
          </div>
          <Link href="/mock-test" style={{ display: 'block' }}>
            <button style={{ width: '100%', backgroundColor: 'var(--foreground)', color: '#ffffff' }}>Enter Arena</button>
          </Link>
        </div>

        <div className={`${styles.featureCard} card`} style={{ background: user ? 'rgba(22, 163, 74, 0.05)' : 'var(--glass-bg)' }}>
          <div className={styles.cardContent}>
            <h2>{user ? 'My Focus List' : '2026 New Words'}</h2>
            <p>
              {user
                ? "Study your personal bookmarked list of words for targeted practice."
                : "Focus on the 550+ words newly added to the 2026 Scripps study list."}
            </p>
          </div>
          <Link href={user ? "/focus-list" : "/learn"} style={{ display: 'block' }}>
            <button style={{ width: '100%', backgroundColor: 'var(--primary)', color: '#ffffff' }}>
              {user ? 'View Focus List' : 'Study New Words'}
            </button>
          </Link>
        </div>

        <div className={`${styles.featureCard} card`}>
          <div className={styles.cardContent}>
            <h2>Etymology Index</h2>
            <p>
              Master Greek and Latin roots to decode the spelling of complex words.
            </p>
          </div>
          <Link href="/roots" style={{ display: 'block' }}>
            <button style={{ width: '100%', background: '#ffffff', border: '2px solid var(--primary)', color: 'var(--primary)' }}>Explore Roots</button>
          </Link>
        </div>

        <div className={`${styles.featureCard} card`}>
          <div className={styles.cardContent}>
            <h2>Scholar Handbook</h2>
            <p>
              Key tips on the schwa, silent letters, and other hidden patterns.
            </p>
          </div>
          <Link href="/lessons" style={{ display: 'block' }}>
            <button style={{ width: '100%', background: '#ffffff', border: '2px solid var(--primary)', color: 'var(--primary)' }}>Read Lessons</button>
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 Spelling Bee Scholar • Based on Words of the Champions</p>
      </footer>
    </main>
  );
}

