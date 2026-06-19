#!/usr/bin/env python3
"""
Split large candidates.jsonl into smaller chunk files for GitHub.
Each chunk will be under 40MB to ensure GitHub compatibility.
"""
import json
import os
from pathlib import Path

# Paths
BACKUP_FILE = "backup_data/[PUB] India_runs_data_and_ai_challenge/India_runs_data_and_ai_challenge/candidates.jsonl"
OUTPUT_DIR = Path("backend/data/chunks")
CHUNK_SIZE_MB = 35  # Target size per chunk in MB

def get_file_size_mb(data):
    """Calculate size of JSON data in MB"""
    return len(json.dumps(data)) / (1024 * 1024)

def split_candidates():
    """Split candidates into chunks"""
    
    if not os.path.exists(BACKUP_FILE):
        print(f"[ERROR] File not found: {BACKUP_FILE}")
        print("Please place candidates.jsonl in backup_data/ folder")
        return False
    
    print(f"[INFO] Reading from {BACKUP_FILE}")
    file_size_mb = os.path.getsize(BACKUP_FILE) / (1024 * 1024)
    print(f"[INFO] File size: {file_size_mb:.2f} MB")
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Read all candidates
    all_candidates = []
    print("[INFO] Loading candidates...")
    
    with open(BACKUP_FILE, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if (i + 1) % 1000 == 0:
                print(f"   Loaded {i + 1} candidates...")
            
            line = line.strip()
            if line:
                try:
                    candidate = json.loads(line)
                    all_candidates.append(candidate)
                except json.JSONDecodeError as e:
                    print(f"[WARN] Skipping line {i + 1}: {e}")
    
    total_candidates = len(all_candidates)
    print(f"\n[OK] Loaded {total_candidates} total candidates")
    
    # Split into chunks
    print(f"\n[INFO] Splitting into chunks (target: {CHUNK_SIZE_MB}MB per chunk)...")
    
    chunk_num = 0
    current_chunk = []
    chunk_files = []
    
    for i, candidate in enumerate(all_candidates):
        current_chunk.append(candidate)
        
        # Check if chunk is large enough
        if get_file_size_mb(current_chunk) >= CHUNK_SIZE_MB or i == total_candidates - 1:
            chunk_num += 1
            chunk_file = OUTPUT_DIR / f"candidates_chunk_{chunk_num:03d}.json"
            
            with open(chunk_file, 'w', encoding='utf-8') as f:
                json.dump(current_chunk, f)
            
            chunk_size = os.path.getsize(chunk_file) / (1024 * 1024)
            print(f"   Chunk {chunk_num}: {len(current_chunk)} candidates, {chunk_size:.2f} MB")
            
            chunk_files.append(chunk_file)
            current_chunk = []
    
    print(f"\n[OK] Created {chunk_num} chunk files")
    print(f"[OK] Total candidates: {total_candidates}")
    print(f"[OK] Chunks saved to: {OUTPUT_DIR}")
    
    # Create metadata file
    metadata = {
        "total_candidates": total_candidates,
        "num_chunks": chunk_num,
        "chunk_files": [f"candidates_chunk_{i:03d}.json" for i in range(1, chunk_num + 1)]
    }
    
    metadata_file = OUTPUT_DIR / "metadata.json"
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"[OK] Metadata saved to: {metadata_file}")
    
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("CANDIDATE DATA SPLITTER")
    print("=" * 60)
    
    success = split_candidates()
    
    if success:
        print("\n" + "=" * 60)
        print("SUCCESS!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Review the chunks in backend/data/chunks/")
        print("2. Delete the backup_data folder")
        print("3. Run the updated backend to test")
        print("4. Commit and push to GitHub")
    else:
        print("\n[ERROR] Failed to split candidates")
        print("Make sure candidates.jsonl is in backup_data/ folder")


