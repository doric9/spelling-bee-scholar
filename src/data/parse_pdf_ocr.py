import re
import json

def parse_ocr(text):
    # Regex to catch words (start of line, lowercase)
    # Note: OCR often has line breaks within definitions.
    # Words in the PDF are usually lowercase and alphabetical.
    # Some have punctuation (e.g., OR criticised*)
    
    sections = {
        "OneBee": [],
        "TwoBee": [],
        "ThreeBee": []
    }
    
    current_difficulty = "OneBee"
    lines = text.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Difficulty markers
        if "one bee" in line.lower() and len(line) < 20: 
            current_difficulty = "OneBee"
            i += 1
            continue
        if "two bee" in line.lower() and len(line) < 20:
            current_difficulty = "TwoBee"
            i += 1
            continue
        if "three bee" in line.lower() and len(line) < 20:
            current_difficulty = "ThreeBee"
            i += 1
            continue
            
        # Detect word: usually a single word or words with OR/asterisks
        # Heuristic: starts with lowercase, no common sentence words (the, of, and)
        if re.match(r'^[a-z\*]+(\s+OR\s+[a-z\*]+)?$', line) and len(line) > 1:
            word_data = {
                "word": line.split()[0].replace('*', ''),
                "difficulty": current_difficulty,
                "definition": "",
                "origin": "", # Not easily extractable from list pages
                "partOfSpeech": "",
                "sentence": ""
            }
            
            # Look ahead for definitions (lines ending with . or containing : or having spaces)
            if i + 1 < len(lines):
                next_line = lines[i+1].strip()
                if next_line and not re.match(r'^[a-z\*]+$', next_line):
                    # Likely a definition or metadata
                    definition = next_line
                    # Definitions in this PDF often end with a period
                    # Or are in a grey box (OCR might indent them)
                    word_data["definition"] = definition
                    i += 1 # Skip the definition line
            
            sections[current_difficulty].append(word_data)
        
        i += 1
        
    return sections

# Normally would read from file, but for this task I'll process what I have
# In real application, I'd read the result of `pdftotext`
