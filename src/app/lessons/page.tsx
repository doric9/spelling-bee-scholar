'use client';

import Link from 'next/link';
import { lessons } from '@/data/lessons';

export default function LessonsPage() {
    return (
        <main style={{ maxWidth: '1000px', padding: '2rem' }}>
            <div className="bg-mesh" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                opacity: 0.15,
                background: 'radial-gradient(circle at 30% 20%, var(--primary-glow) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(202, 138, 4, 0.05) 0%, transparent 40%)'
            }} />

            <nav style={{ marginBottom: '4rem' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>← Back to Dashboard</Link>
            </nav>

            <header style={{ marginBottom: '5rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #1e293b, #64748b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Scholar Handbook</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px' }}>
                    Master the nuances of English spelling with these key lessons from the official Words of the Champions study guide.
                </p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="card" style={{ padding: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'var(--accent-gradient)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: '#fff',
                                fontSize: '1.2rem'
                            }}>
                                {index + 1}
                            </div>
                            <h2 style={{ fontSize: '2rem', color: '#1e293b', margin: 0 }}>{lesson.title}</h2>
                        </div>
                        <div style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '2.5rem', color: 'var(--foreground)' }}>
                            {lesson.content}
                        </div>
                        <div style={{
                            background: 'var(--secondary)',
                            padding: '1.75rem',
                            borderRadius: '16px',
                            borderLeft: '4px solid var(--primary)'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>Expert Tip</div>
                            <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--foreground)', margin: 0 }}>{lesson.tip}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
