import re
import json

def parse_ocr(text):
    words = []
    # Identify difficulty markers
    difficulty_ranges = [
        (0, "OneBee"),
        (text.find("two bee"), "TwoBee"),
        (text.find("three bee"), "ThreeBee")
    ]
    
    # Simple regex for words: usually start of line, no spaces, starts with lowercase or single char header
    # This is a heuristic and needs refinement
    lines = text.split('\n')
    current_difficulty = "OneBee"
    
    for i, line in enumerate(lines):
        line = line.strip()
        if "two bee" in line.lower(): current_difficulty = "TwoBee"
        if "three bee" in line.lower(): current_difficulty = "ThreeBee"
        
        # Look for word patterns (simplistic: alphabetic only, short)
        if re.match(r'^[a-z\-]+$', line) and len(line) > 1:
            # Check if next line is a definition (starts with lowercase, has spaces)
            definition = ""
            if i + 1 < len(lines):
                next_line = lines[i+1].strip()
                if " " in next_line and re.search(r'[a-z]', next_line):
                    definition = next_line
            
            words.append({
                "word": line,
                "difficulty": current_difficulty,
                "definition": definition
            })
    return words

# In a real scenario, I'd pass the actual OCR text here.
# For now, I'll simulate or use a background process.
