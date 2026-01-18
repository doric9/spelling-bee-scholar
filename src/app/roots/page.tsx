'use client';

import { useState } from 'react';
import Link from 'next/link';
import { greekRoots, latinRoots } from '@/data/roots';

export default function RootsPage() {
    const [search, setSearch] = useState('');

    const filteredGreek = greekRoots.filter(r =>
        r.root.toLowerCase().includes(search.toLowerCase()) ||
        r.meaning.toLowerCase().includes(search.toLowerCase())
    );

    const filteredLatin = latinRoots.filter(r =>
        r.root.toLowerCase().includes(search.toLowerCase()) ||
        r.meaning.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main style={{ maxWidth: '1200px', padding: '2rem' }}>
            <div className="bg-mesh" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                opacity: 0.15,
                background: 'radial-gradient(circle at 50% 0%, var(--primary-glow) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(202, 138, 4, 0.05) 0%, transparent 40%)'
            }} />

            <nav style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>← Back to Dashboard</Link>
                <div style={{ position: 'relative', width: '300px' }}>
                    <input
                        type="text"
                        placeholder="Search roots..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            background: 'var(--secondary)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            color: 'var(--foreground)',
                            outline: 'none'
                        }}
                    />
                </div>
            </nav>

            <header style={{ marginBottom: '5rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #1e293b, #64748b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Etymology Index</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px' }}>
                    Master the building blocks of language. Understanding these roots will help you decode the spelling of thousands of complex words.
                </p>
            </header>

            <section style={{ marginBottom: '6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2rem', margin: 0, color: '#1e293b' }}>Greek Roots</h2>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {filteredGreek.map(root => (
                        <div key={root.id} className="card" style={{ padding: '2rem' }}>
                            <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Greek Origin</div>
                            <h3 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '1rem' }}>{root.root}</h3>
                            <p style={{ fontSize: '1.1rem', color: 'var(--foreground)', marginBottom: '1.5rem', fontWeight: 500 }}>{root.meaning}</p>
                            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Examples</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {root.examples.map(ex => (
                                        <span key={ex} style={{ padding: '0.25rem 0.75rem', background: 'rgba(22, 163, 74, 0.1)', color: '#1e293b', borderRadius: '6px', fontSize: '0.9rem' }}>{ex}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2rem', margin: 0, color: '#1e293b' }}>Latin Roots</h2>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {filteredLatin.map(root => (
                        <div key={root.id} className="card" style={{ padding: '2rem' }}>
                            <div style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Latin Origin</div>
                            <h3 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '1rem' }}>{root.root}</h3>
                            <p style={{ fontSize: '1.1rem', color: 'var(--foreground)', marginBottom: '1.5rem', fontWeight: 500 }}>{root.meaning}</p>
                            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Examples</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {root.examples.map(ex => (
                                        <span key={ex} style={{ padding: '0.25rem 0.75rem', background: 'rgba(180, 83, 9, 0.1)', color: '#1e293b', borderRadius: '6px', fontSize: '0.9rem' }}>{ex}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
