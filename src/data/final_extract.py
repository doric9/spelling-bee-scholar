import pypdf
import json
import re

def is_word_line(line):
    """Check if line is likely a word (lowercase, single word, no ending punctuation)"""
    line = line.strip()
    # Single letter section headers
    if len(line) == 1 and line.isalpha():
        return False
    # Must be lowercase alphabetic with optional hyphen/apostrophe
    if re.match(r'^[a-z][a-z\-\']*\s*$', line) and len(line.strip()) > 1:
        return True
    return False

def is_definition_line(line):
    """Check if line is likely part of a definition"""
    line = line.strip()
    if not line:
        return False
    # Page numbers
    if re.match(r'^\d+\s*\d*$', line):
        return False
    # Single letters
    if len(line) == 1:
        return False
    # Contains spaces (definitions have multiple words)
    # Or ends with punctuation (period, colon)
    if ' ' in line or line.endswith('.') or line.endswith(':'):
        return True
    return False

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
            i = 0
            while i < len(lines):
                line = lines[i].strip()
                
                if is_word_line(line):
                    word = line.strip()
                    definition_parts = []
                    
                    # Look ahead for definition lines
                    j = i + 1
                    while j < len(lines):
                        next_line = lines[j].strip()
                        if is_word_line(next_line):
                            break
                        if is_definition_line(next_line):
                            definition_parts.append(next_line)
                            # Stop if we hit a period at end
                            if next_line.endswith('.'):
                                j += 1
                                break
                        j += 1
                    
                    definition = ' '.join(definition_parts).strip()
                    # Clean up definition
                    definition = re.sub(r'\s+', ' ', definition)
                    
                    all_words.append({
                        "word": word,
                        "difficulty": diff,
                        "definition": definition if definition else "",
                        "origin": "",
                        "partOfSpeech": "",
                        "sentence": ""
                    })
                    
                    i = j  # Skip to after definition
                else:
                    i += 1
    
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
    
    # Count words with definitions
    with_def = sum(1 for w in unique if w["definition"])
    print(f"Extracted {len(unique)} unique words")
    print(f"Words with definitions: {with_def}")
    
    # Sample
    for w in unique[:15]:
        defn = w["definition"][:60] + "..." if len(w["definition"]) > 60 else w["definition"]
        print(f"  {w['word']}: {defn or '(no def)'}")
    
    with open("words_final.json", "w") as f:
        json.dump(unique, f, indent=2)
    
    return unique

if __name__ == "__main__":
    extract()
