import pypdf
import json
import re

def extract():
    reader = pypdf.PdfReader("/Users/doric/spelling-bee/WordsOfChampions.pdf")
    all_words = []
    
    # Page ranges for each difficulty
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
            i = 0
            while i < len(lines):
                line = lines[i].strip()
                
                # Skip empty lines, page numbers, headers
                if not line or line.isdigit() or 'Bee' in line and len(line) < 15:
                    i += 1
                    continue
                
                # Words in the list are typically: word followed by definition on same/next line
                # Format in PDF appears to be: "word definition text here" 
                # OR multi-line with word on one line, definition on next
                
                # Try to detect word + definition on same line
                # Words are lowercase, definitions have spaces and punctuation
                parts = line.split(' ', 1)
                if len(parts) >= 1:
                    potential_word = parts[0].lower().strip()
                    # Check if it looks like a single word (alphabetic, possibly with asterisk)
                    if re.match(r'^[a-z\*\-]+$', potential_word) and len(potential_word) > 1:
                        word_entry = {
                            "word": potential_word.replace('*', ''),
                            "difficulty": diff,
                            "definition": "",
                            "origin": "",
                            "partOfSpeech": "",
                            "sentence": ""
                        }
                        
                        # Check if definition is on same line
                        if len(parts) > 1 and len(parts[1]) > 10:
                            word_entry["definition"] = parts[1].strip()
                        # Or check next line for definition
                        elif i + 1 < len(lines):
                            next_line = lines[i+1].strip()
                            # Definition likely has spaces and is longer
                            if ' ' in next_line and len(next_line) > 15 and not re.match(r'^[a-z\*\-]+$', next_line.split()[0].lower()):
                                word_entry["definition"] = next_line
                                i += 1  # Skip the definition line
                        
                        if not word_entry["definition"]:
                            word_entry["definition"] = "See dictionary for full definition."
                        
                        all_words.append(word_entry)
                
                i += 1
    
    # Deduplicate by word
    seen = set()
    unique_words = []
    for w in all_words:
        if w["word"] not in seen:
            seen.add(w["word"])
            unique_words.append(w)
    
    print(f"Extracted {len(unique_words)} unique words")
    
    # Sample some to verify definitions
    for w in unique_words[:5]:
        print(f"  {w['word']}: {w['definition'][:60]}...")
    
    with open("extracted_words_v2.json", "w") as f:
        json.dump(unique_words, f, indent=2)

if __name__ == "__main__":
    extract()
