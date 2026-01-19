export type WordDifficulty = 'OneBee' | 'TwoBee' | 'ThreeBee';

export interface Word {
    id: string;
    word: string;
    definition: string;
    origin: string;
    difficulty: WordDifficulty;
    partOfSpeech: string;
    sentence: string;
}

import wordsData from './words.json';
export const words = wordsData as Word[];
