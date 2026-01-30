'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserProgressByTier } from '@/lib/userService';
import { words } from '@/data/words';
import { calculateTieredStats } from '@/lib/progress';

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
    <main>
      <div className="bg-mesh" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.6,
        background: 'radial-gradient(circle at 20% 30%, var(--primary-glow) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)'
      }} />

      <header style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '4rem', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hello, {user.displayName}</span>
              {user.photoURL && (
                <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--secondary)' }}>
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
              <button onClick={logout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={login} style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', fontWeight: 600 }}>
              Sign In with Google
            </button>
          )}
        </div>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(22, 163, 74, 0.12)', borderRadius: '20px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Official 2026 Guide
        </div>
        <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '1.5rem', background: 'linear-gradient(to bottom, #1e293b 0%, #475569 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Spelling Bee <br /> Scholar
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto' }}>
          Master the Scripps 4,000-word roster with intelligent flashcards and immersive mock competitions.
        </p>
      </header>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        {user && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', background: 'var(--glass-bg)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden', gridColumn: '1 / -1' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'var(--primary-glow)', borderRadius: '50%', opacity: 0.05 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', margin: 0 }}>Progress Roadmap</h2>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{totalMastered.toLocaleString()} / {totalCount.toLocaleString()} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>words mastered</span></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
              {Object.values(tieredStats).map((tier, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600 }}>{tier.label}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{tier.mastered} / {tier.total}</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--secondary)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{
                      width: `${tier.percentage}%`,
                      height: '100%',
                      background: tier.color,
                      transition: 'width 1s ease-out'
                    }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: 'right' }}>
                    {Math.round(tier.percentage)}% Complete
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Flashcard Learning</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Deep dive into etymology, roots, and definitions using a spaced repetition system.
            </p>
          </div>
          <Link href="/learn">
            <button style={{ width: '100%' }}>Start Learning</button>
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Mock Competition</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Simulate the regional bee environment. Listen to the pronouncer and ask for info.
            </p>
          </div>
          <Link href="/mock-test">
            <button style={{ width: '100%', backgroundColor: '#1e293b', color: '#ffffff' }}>Enter Arena</button>
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: user ? 'rgba(22, 163, 74, 0.05)' : 'white' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>{user ? 'My Focus List' : '2026 New Words'}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {user
                ? "Study your personal bookmarked list of words for targeted practice."
                : "Focus on the 550+ words newly added to the 2026 Scripps study list."}
            </p>
          </div>
          <Link href={user ? "/focus-list" : "/learn"}>
            <button style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff' }}>
              {user ? 'View Focus List' : 'Study New Words'}
            </button>
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Etymology Index</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Master Greek and Latin roots to decode the spelling of complex words.
            </p>
          </div>
          <Link href="/roots">
            <button style={{ width: '100%', background: '#ffffff', border: '2px solid var(--primary)', color: 'var(--primary)' }}>Explore Roots</button>
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Scholar Handbook</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Key tips on the schwa, silent letters, and other hidden patterns.
            </p>
          </div>
          <Link href="/lessons">
            <button style={{ width: '100%', background: '#ffffff', border: '2px solid var(--primary)', color: 'var(--primary)' }}>Read Lessons</button>
          </Link>
        </div>
      </section>

      <footer style={{ marginTop: 'auto', padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>© 2026 Spelling Bee Scholar • Based on Words of the Champions</p>
      </footer>
    </main>
  );
}
