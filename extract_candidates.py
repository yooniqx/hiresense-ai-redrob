#!/usr/bin/env python3
"""
Extract first 100 candidates from the large JSONL file and save as JSON.
This creates a smaller file that can be pushed to GitHub and used by Render.
"""
import json
import os

# Path to the large JSONL file
JSONL_PATH = "datasets/[PUB] India_runs_data_and_ai_challenge/India_runs_data_and_ai_challenge/candidates.jsonl"
OUTPUT_PATH = "backend/data/candidates.json"

def extract_candidates(num_candidates=100):
    """Extract first N candidates from JSONL file and save as JSON."""
    
    # Check if source file exists
    if not os.path.exists(JSONL_PATH):
        print(f"[X] Source file not found: {JSONL_PATH}")
        print("Using sample_candidates.json instead...")
        
        # Use sample file as fallback
        sample_path = "datasets/[PUB] India_runs_data_and_ai_challenge/India_runs_data_and_ai_challenge/sample_candidates.json"
        if os.path.exists(sample_path):
            with open(sample_path, 'r', encoding='utf-8') as f:
                candidates = json.load(f)
            
            # Create output directory
            os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
            
            # Save to backend/data
            with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
                json.dump(candidates, f, indent=2)
            
            print(f"[OK] Copied {len(candidates)} candidates from sample file")
            print(f"[OK] Saved to: {OUTPUT_PATH}")
            return
    
    # Extract from JSONL
    candidates = []
    print(f"[INFO] Reading from: {JSONL_PATH}")
    
    with open(JSONL_PATH, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= num_candidates:
                break
            
            try:
                candidate = json.loads(line.strip())
                candidates.append(candidate)
                
                if (i + 1) % 10 == 0:
                    print(f"   Extracted {i + 1} candidates...")
            except json.JSONDecodeError as e:
                print(f"[WARN] Skipping line {i + 1}: {e}")
                continue
    
    # Create output directory
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    # Save as JSON
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(candidates, f, indent=2)
    
    # Get file size
    file_size = os.path.getsize(OUTPUT_PATH)
    file_size_mb = file_size / (1024 * 1024)
    
    print(f"\n[OK] Successfully extracted {len(candidates)} candidates")
    print(f"[OK] Saved to: {OUTPUT_PATH}")
    print(f"[INFO] File size: {file_size_mb:.2f} MB ({file_size:,} bytes)")
    
    if file_size_mb > 50:
        print(f"[WARN] Warning: File is still large ({file_size_mb:.2f} MB)")
        print("   Consider reducing the number of candidates")
    else:
        print(f"[OK] File size is good for GitHub (< 50 MB)")

if __name__ == "__main__":
    extract_candidates(100)

# Made with Bob
