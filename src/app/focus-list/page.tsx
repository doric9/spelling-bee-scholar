'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { words, Word } from '@/data/words';
import WordCard from '@/components/WordCard';
import { useAuth } from '@/context/AuthContext';
import { getUserBookmarks, toggleBookmark, getUserProgressByTier } from '@/lib/userService';

export default function FocusListPage() {
    const { user, loading } = useAuth();
    const [bookmarkedWords, setBookmarkedWords] = useState<Word[]>([]);
    const [masteryMap, setMasteryMap] = useState<Record<string, string>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            // 1. Immediate UI: Try to load from localStorage cache first
            if (typeof window !== 'undefined') {
                const cachedIds = localStorage.getItem('sb_focus_list');
                if (cachedIds) {
                    try {
                        const ids = new Set(JSON.parse(cachedIds));
                        const cachedFiltered = words.filter(w => ids.has(w.id));
                        if (isMounted && cachedFiltered.length > 0) {
                            setBookmarkedWords(cachedFiltered);
                            setIsRefreshing(false);
                        }
                    } catch {
                        // Fail silently
                    }
                }
            }

            // 2. Background Sync: Fetch fresh data from Firebase
            if (!loading && user) {
                try {
                    const [bookmarkIds, progress] = await Promise.all([
                        getUserBookmarks(user.uid),
                        getUserProgressByTier(user.uid)
                    ]);

                    const filtered = words.filter(w => bookmarkIds.has(w.id));

                    if (isMounted) {
                        setBookmarkedWords(filtered);
                        setMasteryMap(progress);
                        setIsRefreshing(false);

                        // Update cache
                        localStorage.setItem('sb_focus_list', JSON.stringify(Array.from(bookmarkIds)));
                    }
                } catch {
                    if (isMounted) setIsRefreshing(false);
                }
            } else if (!loading && !user) {
                if (isMounted) setIsRefreshing(false);
            }
        }

        load();
        return () => { isMounted = false; };
    }, [user, loading]);

    const handleToggleBookmark = async (wordId: string, wordStr: string) => {
        if (!user) return;

        // Remove from local list immediately for UI responsiveness
        setBookmarkedWords(prev => prev.filter(w => w.id !== wordId));
        await toggleBookmark(user.uid, wordId, wordStr, true);

        // Adjust index if we removed the last item
        if (currentIndex >= bookmarkedWords.length - 1 && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNextWord = () => {
        if (currentIndex < bookmarkedWords.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    if (loading) {
        return (
            <main>
                <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--glass-bg)', borderRadius: '20px' }}>
                    <h2 style={{ color: 'var(--primary)' }}>Authenticating...</h2>
                </div>
            </main>
        );
    }

    if (!user) {
        return (
            <main style={{ textAlign: 'center', padding: '4rem' }}>
                <h2 style={{ color: 'var(--text-muted)' }}>Please sign in to view your Focus List.</h2>
                <Link href="/">
                    <button style={{ marginTop: '2rem' }}>Back to Home</button>
                </Link>
            </main>
        );
    }

    if (bookmarkedWords.length === 0) {
        return (
            <main style={{ maxWidth: '1000px', padding: '2rem' }}>
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ← Back Dashboard
                    </Link>
                </nav>
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--glass-bg)', borderRadius: '24px' }}>
                    {isRefreshing ? (
                        <>
                            <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Syncing your list...</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Retrieving your bookmarked words from the Cloud.</p>
                        </>
                    ) : (
                        <>
                            <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Your Focus List is empty</h2>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
                                Star words you want to study more intensely in the Learning or Mock Test sections to add them here.
                            </p>
                            <Link href="/learn">
                                <button>Go to Learn Page</button>
                            </Link>
                        </>
                    )}
                </div>
            </main>
        );
    }

    const currentWord = bookmarkedWords[currentIndex];

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
                background: 'radial-gradient(circle at 50% 50%, var(--primary-glow) 0%, transparent 60%)'
            }} />

            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ← Back Dashboard
                </Link>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {isRefreshing && <span className="vibrate" style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>SYNCING</span>}
                        <h1 style={{ fontSize: '1.5rem', color: 'var(--primary)', margin: 0 }}>Focus List</h1>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{bookmarkedWords.length} words bookmarked</span>
                </div>
            </nav>

            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ height: '4px', flex: 1, background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((currentIndex + 1) / bookmarkedWords.length) * 100}%`, background: 'var(--primary)', transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {currentIndex + 1} / {bookmarkedWords.length}
                </span>
            </div>

            <WordCard
                word={currentWord.word}
                definition={currentWord.definition}
                origin={currentWord.origin}
                partOfSpeech={currentWord.partOfSpeech}
                difficulty={currentWord.difficulty}
                isBookmarked={true}
                isMastered={masteryMap[currentWord.id] === 'mastered'}
                onToggleBookmark={() => handleToggleBookmark(currentWord.id, currentWord.word)}
                onNext={handleNextWord}
            />
        </main>
    );
}
