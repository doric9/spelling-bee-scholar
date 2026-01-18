'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { words, Word } from '@/data/words';

export default function MockTestPage() {
    const [testList, setTestList] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({ type: null, message: '' });
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [requestedInfo, setRequestedInfo] = useState<{ definition: boolean, origin: boolean, sentence: boolean }>({ definition: false, origin: false, sentence: false });
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const shuffled = [...words].sort(() => 0.5 - Math.random()).slice(0, 10);
        setTestList(shuffled);
    }, []);

    const currentWord = testList[currentIndex];

    useEffect(() => {
        if (currentWord && !showResult && feedback.type === null) {
            handleSpeak(currentWord.word);
            inputRef.current?.focus();
            setRequestedInfo({ definition: false, origin: false, sentence: false });
        }
    }, [currentIndex, currentWord, showResult, feedback.type]);

    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || feedback.type !== null) return;

        const isCorrect = userInput.toLowerCase().trim() === currentWord.word.toLowerCase();

        if (isCorrect) {
            setScore(s => s + 1);
            setFeedback({ type: 'correct', message: 'Masterful!' });
        } else {
            setFeedback({ type: 'incorrect', message: `Incorrect. Correct spelling: ${currentWord.word.toUpperCase()}` });
        }

        setTimeout(() => {
            setFeedback({ type: null, message: '' });
            setUserInput('');
            if (currentIndex < testList.length - 1) {
                setCurrentIndex(c => c + 1);
            } else {
                setShowResult(true);
            }
        }, 1800);
    };

    if (showResult) {
        return (
            <main style={{ textAlign: 'center', justifyContent: 'center', height: '100vh' }}>
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem' }}>
                    <div style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase' }}>Results</div>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{score >= 8 ? 'Outstanding!' : 'Test Complete'}</h1>
                    <p style={{ fontSize: '1.5rem', marginBottom: '3rem', color: 'var(--text-muted)' }}>
                        You correctly spelled <span style={{ color: 'var(--foreground)', fontWeight: 'bold' }}>{score}</span> out of {testList.length} words.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button onClick={() => window.location.reload()} style={{ padding: '1rem 2rem' }}>Practice Again</button>
                        <Link href="/">
                            <button style={{ background: 'transparent', border: '2px solid var(--primary)', color: 'var(--primary)', padding: '1rem 2rem' }}>Dashboard</button>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (!currentWord) return (
        <main>
            <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--glass-bg)', borderRadius: '20px' }}>
                <h2 style={{ color: 'var(--primary)' }}>Entering the Arena...</h2>
            </div>
        </main>
    );

    return (
        <main style={{ maxWidth: '900px', padding: '2rem' }}>
            <div className="bg-mesh" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                opacity: 0.2,
                background: 'radial-gradient(circle at 80% 20%, var(--primary-glow) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.05) 0%, transparent 40%)'
            }} />

            <nav style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>← Exit Arena</Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Score</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{score}</div>
                    </div>
                    <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />
                    <div style={{ fontWeight: '600' }}>Word {currentIndex + 1} of {testList.length}</div>
                </div>
            </nav>

            <div className="card" style={{
                textAlign: 'center',
                padding: '4rem 3rem',
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div style={{ marginBottom: '4rem' }}>
                    <button
                        onClick={() => handleSpeak(currentWord.word)}
                        style={{
                            borderRadius: '50%',
                            width: '90px',
                            height: '90px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            background: 'var(--secondary)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer'
                        }}
                    >
                        🔊
                    </button>
                    <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>Listen carefully and spell the word.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ marginBottom: requestedInfo.definition || requestedInfo.origin || requestedInfo.sentence ? '3rem' : '0' }}>
                    <input
                        ref={inputRef}
                        type="text"
                        className="minimal-input"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={feedback.type !== null}
                        placeholder="Type spelling..."
                        autoComplete="off"
                        autoFocus
                        style={{
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3em',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            borderBottomColor: feedback.type === 'correct' ? 'var(--success)' : feedback.type === 'incorrect' ? 'var(--error)' : 'var(--border)'
                        }}
                    />
                </form>

                {feedback.message && (
                    <div style={{
                        marginTop: '2rem',
                        color: feedback.type === 'correct' ? 'var(--success)' : 'var(--error)',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        {feedback.message}
                    </div>
                )}

                {!feedback.message && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '4rem' }}>
                        <button
                            onClick={() => setRequestedInfo(prev => ({ ...prev, definition: true }))}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--foreground)', fontSize: '0.85rem' }}
                        >
                            Definition
                        </button>
                        <button
                            onClick={() => setRequestedInfo(prev => ({ ...prev, origin: true }))}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--foreground)', fontSize: '0.85rem' }}
                        >
                            Origin
                        </button>
                        <button
                            onClick={() => setRequestedInfo(prev => ({ ...prev, sentence: true }))}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--foreground)', fontSize: '0.85rem' }}
                        >
                            Sentence
                        </button>
                    </div>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px', margin: '2rem auto 0' }}>
                    {requestedInfo.definition && (
                        <div style={{ background: 'var(--secondary)', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '1rem', borderLeft: '4px solid var(--primary)', animation: 'fadeIn 0.3s ease' }}>
                            <strong style={{ color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Definition</strong>
                            <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>{currentWord.definition}</p>
                        </div>
                    )}
                    {requestedInfo.origin && (
                        <div style={{ background: 'var(--secondary)', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '1rem', borderLeft: '4px solid var(--primary)', animation: 'fadeIn 0.3s ease' }}>
                            <strong style={{ color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Language of Origin</strong>
                            <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>{currentWord.origin}</p>
                        </div>
                    )}
                    {requestedInfo.sentence && (
                        <div style={{ background: 'var(--secondary)', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '1rem', borderLeft: '4px solid var(--primary)', animation: 'fadeIn 0.3s ease' }}>
                            <strong style={{ color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Sentence</strong>
                            <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>"{currentWord.sentence}"</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
