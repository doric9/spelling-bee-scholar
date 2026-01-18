import json
import urllib.request
import urllib.error
import time
import sys

def fetch_definition(word):
    """Fetch definition from Free Dictionary API"""
    url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'SpellingBeeApp/1.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            if data and len(data) > 0:
                # Get the first meaning
                meanings = data[0].get('meanings', [])
                if meanings:
                    definitions = meanings[0].get('definitions', [])
                    if definitions:
                        defn = definitions[0].get('definition', '')
                        pos = meanings[0].get('partOfSpeech', '')
                        return defn, pos
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None, None  # Word not found
        print(f"  HTTP error for {word}: {e.code}")
    except Exception as e:
        print(f"  Error for {word}: {e}")
    return None, None

def main():
    # Load current words
    with open("words_final.json", "r") as f:
        words = json.load(f)
    
    # Find words without definitions
    missing = [w for w in words if not w.get("definition")]
    print(f"Total words: {len(words)}")
    print(f"Words missing definitions: {len(missing)}")
    
    # Fetch definitions (with rate limiting to be nice to API)
    fetched = 0
    failed = 0
    
    for i, word_obj in enumerate(missing):
        word = word_obj["word"]
        defn, pos = fetch_definition(word)
        
        if defn:
            word_obj["definition"] = defn
            if pos:
                word_obj["partOfSpeech"] = pos
            fetched += 1
        else:
            failed += 1
        
        # Progress update every 50 words
        if (i + 1) % 50 == 0:
            print(f"Progress: {i+1}/{len(missing)} - Fetched: {fetched}, Failed: {failed}")
            sys.stdout.flush()
        
        # Rate limit: ~3 requests per second
        time.sleep(0.35)
    
    print(f"\nCompleted! Fetched: {fetched}, Failed: {failed}")
    
    # Save updated words
    with open("words_final.json", "w") as f:
        json.dump(words, f, indent=2)
    
    # Count final stats
    with_def = sum(1 for w in words if w.get("definition"))
    print(f"Words with definitions now: {with_def}/{len(words)}")

if __name__ == "__main__":
    main()
