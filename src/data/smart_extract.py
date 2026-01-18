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
            if not text: 
                continue
            
            lines = text.split('\n')
            current_word = None
            current_def_parts = []
            
            for line in lines:
                line = line.strip()
                
                # Skip empty, page numbers, single letters (section headers)
                if not line or line.isdigit() or (len(line) == 1 and line.isalpha()):
                    continue
                # Skip page number patterns like "13  12"
                if re.match(r'^\d+\s+\d+$', line):
                    continue
                
                # Check if this line is a word (single lowercase word, no spaces, or with hyphen)
                if re.match(r'^[a-z][a-z\-\']*$', line) and len(line) > 1:
                    # Save previous word if exists
                    if current_word:
                        definition = ' '.join(current_def_parts).strip()
                        if not definition:
                            definition = "See dictionary for definition."
                        all_words.append({
                            "word": current_word,
                            "difficulty": diff,
                            "definition": definition,
                            "origin": "",
                            "partOfSpeech": "",
                            "sentence": ""
                        })
                    
                    current_word = line
                    current_def_parts = []
                else:
                    # This is likely part of a definition
                    # Clean up: definitions end with .
                    current_def_parts.append(line)
            
            # Don't forget the last word on the page
            if current_word:
                definition = ' '.join(current_def_parts).strip()
                if not definition:
                    definition = "See dictionary for definition."
                all_words.append({
                    "word": current_word,
                    "difficulty": diff,
                    "definition": definition,
                    "origin": "",
                    "partOfSpeech": "",
                    "sentence": ""
                })
    
    # Deduplicate
    seen = set()
    unique = []
    for w in all_words:
        if w["word"] not in seen:
            seen.add(w["word"])
            unique.append(w)
    
    # Add IDs
    for i, w in enumerate(unique):
        w["id"] = str(i + 1)
    
    print(f"Extracted {len(unique)} unique words")
    # Sample with definitions
    for w in unique[:10]:
        defn = w["definition"][:80] if len(w["definition"]) > 80 else w["definition"]
        print(f"  {w['word']}: {defn}")
    
    with open("words_final.json", "w") as f:
        json.dump(unique, f, indent=2)
    
    return unique

if __name__ == "__main__":
    extract()
