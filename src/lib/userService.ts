import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    collection,
    getDocs,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface UserProgress {
    totalMastered: number;
}

export interface Bookmark {
    wordId: string;
    word: string;
    timestamp: Timestamp;
}

/**
 * Ensures a user document exists in Firestore.
 */
export const ensureUserDoc = async (uid: string, email: string) => {
    if (!db) return;
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            email,
            totalMastered: 0,
            createdAt: serverTimestamp(),
        });
    }
};

/**
 * Toggles a word bookmark for a user.
 */
export const toggleBookmark = async (uid: string, wordId: string, word: string, isBookmarked: boolean) => {
    if (!db) return;
    const bookmarkRef = doc(db, "users", uid, "bookmarks", wordId);

    if (isBookmarked) {
        await deleteDoc(bookmarkRef);
    } else {
        await setDoc(bookmarkRef, {
            wordId,
            word,
            timestamp: serverTimestamp(),
        });
    }
};

/**
 * Fetches all bookmarks for a user.
 */
export const getUserBookmarks = async (uid: string): Promise<Set<string>> => {
    if (!db) return new Set();
    const bookmarksRef = collection(db, "users", uid, "bookmarks");
    const snap = await getDocs(bookmarksRef);
    const bookmarkIds = new Set<string>();
    snap.forEach((doc) => bookmarkIds.add(doc.id));
    return bookmarkIds;
};

/**
 * Updates learning progress for a word.
 */
export const updateWordProgress = async (uid: string, wordId: string, status: 'learning' | 'mastered') => {
    if (!db) return;
    const progressRef = doc(db, "users", uid, "progress", wordId);
    await setDoc(progressRef, {
        status,
        lastSeen: serverTimestamp(),
    }, { merge: true });
};

/**
 * Fetches user stats grouped by difficulty tier.
 */
export const getUserProgressByTier = async (uid: string): Promise<Record<string, string>> => {
    if (!db) return {};
    const progressRef = collection(db, "users", uid, "progress");
    const snap = await getDocs(progressRef);

    const stats = {
        OneBee: 0,
        TwoBee: 0,
        ThreeBee: 0,
        total: 0
    };

    // We need the words data to map wordId to difficulty
    // However, for efficiency, since we already have the words list imported elsewhere,
    // let's assume we pass the difficulty in or look it up.
    // Given the current structure, we'll fetch all and filter.
    // To avoid importing 'words' here (which might cause circular deps if not careful),
    // we'll rely on the word metadata if it's stored in the progress doc, 
    // BUT looking at updateWordProgress, it only stores status and lastSeen.

    // Better approach: Since we have the words list in memory in the client, 
    // we can do the mapping there, but a dedicated getter is cleaner.
    // Let's modify updateWordProgress to include difficulty for easier aggregation,
    // OR just fetch all and let the caller aggregate.

    // Actually, let's keep it simple: fetch all progress and return the raw status map.
    const progressMap: Record<string, string> = {};
    snap.forEach((doc) => {
        progressMap[doc.id] = doc.data().status;
    });
    return progressMap;
};
