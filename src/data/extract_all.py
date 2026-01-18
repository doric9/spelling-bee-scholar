import pypdf
import json
import re

def extract():
    reader = pypdf.PdfReader("/Users/doric/spelling-bee/WordsOfChampions.pdf")
    all_words = []
    
    difficulty_maps = [
        (6, 17, "OneBee"),
        (18, 41, "TwoBee"),
        (42, 55, "ThreeBee")
    ]
    
    for start, end, diff in difficulty_maps:
        for p_idx in range(start - 1, end):
            page = reader.pages[p_idx]
            text = page.extract_text()
            if not text: continue
            
            lines = text.split('\n')
            for i, line in enumerate(lines):
                line = line.strip()
                # Skip numeric lines (page numbers) or empty
                if not line or line.isdigit(): continue
                
                # Detect potential word: usually alphabetical, lowercase start
                # Scripps list words are mostly single words here.
                # Heuristic: single word or "word1 OR word2"
                if re.match(r'^[a-z\*]+(\s+OR\s+[a-z\*]+)?$', line):
                    word_obj = {
                        "word": line.split()[0].replace('*', ''),
                        "difficulty": diff,
                        "definition": "",
                        "origin": "",
                        "partOfSpeech": "",
                        "sentence": ""
                    }
                    
                    # Look for definitions in subsequent lines
                    # Definitions often have spaces and standard punctuation
                    if i + 1 < len(lines):
                        next_line = lines[i+1].strip()
                        if " " in next_line and not re.match(r'^[a-z\*]+$', next_line):
                            word_obj["definition"] = next_line
                            
                    all_words.append(word_obj)
    
    with open("extracted_words.json", "w") as f:
        json.dump(all_words, f, indent=4)
    print(f"Extracted {len(all_words)} words.")

if __name__ == "__main__":
    extract()
