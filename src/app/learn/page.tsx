'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { words, Word, WordDifficulty } from '@/data/words';
import WordCard from '@/components/WordCard';
import { useAuth } from '@/context/AuthContext';
import { getUserBookmarks, toggleBookmark, ensureUserDoc, updateWordProgress, getUserProgressByTier } from '@/lib/userService';

type SessionSize = 20 | 50 | 100 | 'All';

export default function LearnPage() {
    const [difficulty, setDifficulty] = useState<WordDifficulty | 'All'>('OneBee');
    const [sessionSize, setSessionSize] = useState<SessionSize>(20);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { user } = useAuth();
    const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
    const [masteryMap, setMasteryMap] = useState<Record<string, string>>({});
    const [unmasteredOnly, setUnmasteredOnly] = useState(false);

    // Initialize study list with an empty array to prevent hydration mismatch
    const [studyList, setStudyList] = useState<Word[]>([]);

    useEffect(() => {
        let isMounted = true;

        async function initialize() {
            // 1. Immediate UI: Create a session from local data right away
            const initialFiltered = words.filter(w => w.difficulty === 'OneBee');
            const initialShuffled = initialFiltered.sort(() => 0.5 - Math.random()).slice(0, 20);

            if (isMounted) {
                setStudyList(initialShuffled);
            }

            // 2. Background Sync: Fetch user data (bookmarks and progress)
            if (user) {
                try {
                    await ensureUserDoc(user.uid, user.email || '');
                    const [bmarks, progress] = await Promise.all([
                        getUserBookmarks(user.uid),
                        getUserProgressByTier(user.uid)
                    ]);

                    if (isMounted) {
                        setBookmarks(bmarks);
                        setMasteryMap(progress);
                    }
                } catch (error) {
                    console.error("Firebase sync error - proceeding offline:", error);
                    if (isMounted) setBookmarks(new Set());
                }
            }
        }

        initialize();
        return () => { isMounted = false; };
    }, [user]);

    const handleToggleBookmark = async (wordId: string, wordStr: string) => {
        if (!user) {
            alert("Please sign in to bookmark words!");
            return;
        }

        const isBookmarked = bookmarks.has(wordId);
        const newBookmarks = new Set(bookmarks);
        if (isBookmarked) newBookmarks.delete(wordId);
        else newBookmarks.add(wordId);

        setBookmarks(newBookmarks);
        await toggleBookmark(user.uid, wordId, wordStr, isBookmarked);
    };

    const startNewSession = (diff: WordDifficulty | 'All', size: SessionSize, filterUnmastered: boolean = unmasteredOnly) => {
        let filtered = diff === 'All'
            ? [...words]
            : words.filter(w => w.difficulty === diff);

        if (filterUnmastered) {
            filtered = filtered.filter(w => masteryMap[w.id] !== 'mastered');
        }

        if (filtered.length === 0) {
            if (filterUnmastered) {
                alert(`Amazing! You've mastered all words in the ${diff === 'All' ? 'entire roster' : diff + ' tier'}!`);
                setUnmasteredOnly(false);
                startNewSession(diff, size, false);
            } else {
                alert("No words found for this selection.");
            }
            return;
        }

        // Shuffle and take the selected session size
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        const sessionWords = size === 'All' ? shuffled : shuffled.slice(0, size);
        setStudyList(sessionWords);
        setCurrentIndex(0);
    };

    const handleDifficultyChange = (lvl: WordDifficulty | 'All') => {
        setDifficulty(lvl);
        startNewSession(lvl, sessionSize);
    };

    const handleSizeChange = (size: SessionSize) => {
        setSessionSize(size);
        startNewSession(difficulty, size);
    };

    const handleToggleUnmastered = () => {
        const newVal = !unmasteredOnly;
        setUnmasteredOnly(newVal);
        startNewSession(difficulty, sessionSize, newVal);
    };

    const handleNextWord = async () => {
        // Mark as mastered when the user moves to the next word
        if (user) {
            const wordId = studyList[currentIndex].id;
            try {
                updateWordProgress(user.uid, wordId, 'mastered')
                    .catch(err => console.error("Failed to update progress:", err));

                // Update local state to reflect mastery immediately
                setMasteryMap(prev => ({ ...prev, [wordId]: 'mastered' }));
            } catch (error) {
                console.error("Progress update error:", error);
            }
        }

        if (currentIndex < studyList.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // End of session
            alert(`Great job! You've completed your session of ${studyList.length} words!`);
            // Reshuffle for next session
            startNewSession(difficulty, sessionSize);
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

            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>←</span> Back to Dashboard
                </Link>

                <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--secondary)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    {(['OneBee', 'TwoBee', 'ThreeBee', 'All'] as const).map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => handleDifficultyChange(lvl)}
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.85rem',
                                background: difficulty === lvl ? 'var(--accent-gradient)' : 'transparent',
                                color: difficulty === lvl ? '#fff' : 'var(--text-muted)',
                                boxShadow: difficulty === lvl ? '0 4px 10px 0 var(--primary-glow)' : 'none',
                                borderRadius: '8px'
                            }}
                        >
                            {lvl === 'All' ? 'All Tiers' : lvl.replace('Bee', ' Bee')}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Session Settings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Session Size:</span>
                    <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--secondary)', padding: '0.3rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        {([20, 50, 100, 'All'] as SessionSize[]).map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSizeChange(size)}
                                style={{
                                    padding: '0.4rem 0.9rem',
                                    fontSize: '0.8rem',
                                    background: sessionSize === size ? 'var(--primary)' : 'transparent',
                                    color: sessionSize === size ? '#fff' : 'var(--text-muted)',
                                    boxShadow: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 600
                                }}
                            >
                                {size === 'All' ? 'All' : size}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                        onClick={handleToggleUnmastered}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.85rem',
                            background: unmasteredOnly ? 'var(--accent-gradient)' : 'var(--secondary)',
                            color: unmasteredOnly ? '#fff' : 'var(--text-muted)',
                            borderRadius: '10px',
                            border: '1px solid var(--border)',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: unmasteredOnly ? '#fff' : 'var(--border)',
                            boxShadow: unmasteredOnly ? '0 0 8px #fff' : 'none'
                        }} />
                        New Words Only
                    </button>
                </div>

                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ({studyList.length} words in session)
                </span>
            </div>

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
                        isBookmarked={bookmarks.has(currentWord.id)}
                        isMastered={masteryMap[currentWord.id] === 'mastered'}
                        onToggleBookmark={() => handleToggleBookmark(currentWord.id, currentWord.word)}
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
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Session Size</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{sessionSize === 'All' ? 'Full List' : `${sessionSize} Words`}</div>
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
