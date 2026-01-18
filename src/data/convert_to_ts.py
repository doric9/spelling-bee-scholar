import json

def convert():
    with open("extracted_words.json", "r") as f:
        words = json.load(f)
    
    # Add unique IDs
    for i, w in enumerate(words):
        w["id"] = str(i + 1)
        # Default placeholder values if empty
        if not w["definition"]: w["definition"] = "Definition not available in this list."
        w["origin"] = "See Merriam-Webster Unabridged"
        w["partOfSpeech"] = "unknown"
        w["sentence"] = "Sentence not provided."

    ts_content = "export type WordDifficulty = 'OneBee' | 'TwoBee' | 'ThreeBee';\n\n"
    ts_content += "export interface Word {\n"
    ts_content += "    id: string;\n"
    ts_content += "    word: string;\n"
    ts_content += "    definition: string;\n"
    ts_content += "    origin: string;\n"
    ts_content += "    difficulty: WordDifficulty;\n"
    ts_content += "    partOfSpeech: string;\n"
    ts_content += "    sentence: string;\n"
    ts_content += "}\n\n"
    ts_content += "export const words: Word[] = "
    ts_content += json.dumps(words, indent=4)
    ts_content += ";\n"
    
    with open("words.ts", "w") as f:
        f.write(ts_content)
    print("Converted to words.ts")

if __name__ == "__main__":
    convert()
