import Link from 'next/link';

export default function Home() {
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

      <header style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '4rem' }}>
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
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Flashcard Learning</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Deep dive into etymology, roots, and definitions using a spaced repetition system.
              Perfect for building long-term memory.
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
              Simulate the regional bee environment. Listen to the pronouncer, ask for info,
              and type your spelling under pressure.
            </p>
          </div>
          <Link href="/mock-test">
            <button style={{ width: '100%', backgroundColor: '#1e293b', color: '#ffffff' }}>Enter Arena</button>
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Etymology Index</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Master Greek and Latin roots to decode the spelling of thousands of complex words
              used in later rounds.
            </p>
          </div>
          <Link href="/roots">
            <button style={{ width: '100%', backgroundColor: '#b45309', color: '#ffffff' }}>Explore Roots</button>
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Scholar Handbook</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Key tips on the schwa, silent letters, and other hidden patterns of the English
              language.
            </p>
          </div>
          <Link href="/lessons">
            <button style={{ width: '100%', background: '#ffffff', border: '2px solid var(--primary)', color: 'var(--primary)' }}>Read Lessons</button>
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px dashed var(--primary)' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>2026 New Words</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Focus on the 550+ words newly added to the 2026 Scripps study list.
            </p>
          </div>
          <Link href="/learn">
            <button style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff' }}>Study New Words</button>
          </Link>
        </div>
      </section>

      <footer style={{ marginTop: 'auto', padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>© 2026 Spelling Bee Scholar • Based on Words of the Champions</p>
      </footer>
    </main>
  );
}
