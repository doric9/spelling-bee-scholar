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
 * Fetches user stats (total mastered words).
 */
export const getUserStats = async (uid: string) => {
    if (!db) return { masteredCount: 0 };
    const progressRef = collection(db, "users", uid, "progress");
    const snap = await getDocs(progressRef);
    let masteredCount = 0;
    snap.forEach((doc) => {
        if (doc.data().status === 'mastered') {
            masteredCount++;
        }
    });
    return { masteredCount };
};
