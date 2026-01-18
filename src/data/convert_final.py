import json

with open("words_final.json", "r") as f:
    words = json.load(f)

ts_content = """export type WordDifficulty = 'OneBee' | 'TwoBee' | 'ThreeBee';

export interface Word {
    id: string;
    word: string;
    definition: string;
    origin: string;
    difficulty: WordDifficulty;
    partOfSpeech: string;
    sentence: string;
}

export const words: Word[] = """

ts_content += json.dumps(words, indent=4)
ts_content += ";\n"

with open("words.ts", "w") as f:
    f.write(ts_content)

print(f"Converted {len(words)} words to words.ts")
