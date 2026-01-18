'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { words, Word, WordDifficulty } from '@/data/words';
import WordCard from '@/components/WordCard';

export default function LearnPage() {
    const [difficulty, setDifficulty] = useState<WordDifficulty | 'All'>('OneBee');
    const [studyList, setStudyList] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const filtered = difficulty === 'All'
            ? [...words]
            : words.filter(w => w.difficulty === difficulty);

        // Shuffle and take 20 for the session
        const sessionWords = filtered.sort(() => 0.5 - Math.random()).slice(0, 20);
        setStudyList(sessionWords);
        setCurrentIndex(0);
    }, [difficulty]);

    const handleNextWord = () => {
        if (currentIndex < studyList.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // End of session
            alert(`Great job! You've mastered another session of ${difficulty} words.`);
            // Reshuffle for next session
            const reshuffled = [...studyList].sort(() => 0.5 - Math.random());
            setStudyList(reshuffled);
            setCurrentIndex(0);
        }
    };

    if (studyList.length === 0) return (
        <main>
            <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--glass-bg)', borderRadius: '20px' }}>
                <h2 style={{ color: 'var(--primary)' }}>Preparing your session...</h2>
            </div>
        </main>
    );

    const currentWord = studyList[currentIndex];

    return (
        <main style={{ maxWidth: '1000px', padding: '2rem' }}>
            <div className="bg-mesh" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                opacity: 0.2,
                background: 'radial-gradient(circle at 10% 10%, var(--primary-glow) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(202, 138, 0, 0.1) 0%, transparent 40%)'
            }} />

            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>←</span> Back to Dashboard
                </Link>

                <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--secondary)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    {(['OneBee', 'TwoBee', 'ThreeBee', 'All'] as const).map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setDifficulty(lvl)}
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.85rem',
                                background: difficulty === lvl ? 'var(--accent-gradient)' : 'transparent',
                                color: difficulty === lvl ? '#000' : 'var(--text-muted)',
                                boxShadow: difficulty === lvl ? '0 4px 10px 0 var(--primary-glow)' : 'none',
                                borderRadius: '8px'
                            }}
                        >
                            {lvl === 'All' ? 'All Tiers' : lvl.replace('Bee', ' Bee')}
                        </button>
                    ))}
                </div>
            </nav>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem', alignItems: 'start' }}>
                <div>
                    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ height: '4px', flex: 1, background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${((currentIndex + 1) / studyList.length) * 100}%`, background: 'var(--primary)', transition: 'width 0.4s ease' }} />
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {currentIndex + 1} / {studyList.length}
                        </span>
                    </div>

                    <WordCard
                        word={currentWord.word}
                        definition={currentWord.definition}
                        origin={currentWord.origin}
                        partOfSpeech={currentWord.partOfSpeech}
                        difficulty={currentWord.difficulty}
                        onNext={handleNextWord}
                    />
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Session Stats</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Focus Level</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{difficulty === 'All' ? 'Mixed Roster' : difficulty.replace('Bee', ' Bee')}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Words Remaining</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{studyList.length - currentIndex - 1}</div>
                        </div>
                        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                Master these words by visualizing the roots and hearing the pronunciation. Flip the card to verify your mental spelling.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
