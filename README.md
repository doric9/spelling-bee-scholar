# Spelling Bee Scholar 🐝

Spelling Bee Scholar is a modern web application designed to help students master the Scripps 4,000-word roster. It features intelligent flashcards, immersive mock competitions, and detailed etymology resources.

## Features

-   **Flashcard Learning**: Spaced repetition system with etymology, roots, and definitions.
-   **Mock Competition**: Immersive regional bee environment with a pronouncer.
-   **Dynamic Progress Tracking**: Real-time stats based on the latest 4,000+ word roster.
-   **Etymology Index**: Master Greek and Latin roots to decode complex word spellings.
-   **Scholar Handbook**: Lessons on language patterns like the schwa and silent letters.

## Tech Stack

-   **Frontend**: Next.js 16 (App Router), TypeScript, Vanilla CSS.
-   **Backend/Auth**: Firebase (Authentication & Firestore).
-   **Deployment**: Cloudflare Pages (Static Export).

## Getting Started

### Prerequisites

-   Node.js 22+
-   Firebase project credentials

### Local Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file with your Firebase credentials (see `.env.example` if available).
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000).

### Deployment

The project is configured for Cloudflare Pages.

-   **Build Command**: `npm run build`
-   **Output Directory**: `out`
-   **Environment Variables**: Managed via `wrangler.toml` (source of truth).

To deploy manually:
```bash
npm run pages:deploy
```

## Data

The application uses an official word list with **4,061** entries, dynamically calculated from `src/data/words.json`.

---

© 2026 Spelling Bee Scholar • Based on Words of the Champions
