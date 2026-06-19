#!/usr/bin/env python3
"""
Split large candidates.jsonl into smaller chunk files using streaming.
More memory-efficient for very large files.
"""
import json
import os
from pathlib import Path

# Paths
BACKUP_FILE = "backup_data/[PUB] India_runs_data_and_ai_challenge/India_runs_data_and_ai_challenge/candidates.jsonl"
OUTPUT_DIR = Path("backend/data/chunks")
CANDIDATES_PER_CHUNK = 1000  # Number of candidates per chunk file

def split_candidates_streaming():
    """Split candidates into chunks using streaming approach"""
    
    if not os.path.exists(BACKUP_FILE):
        print(f"[ERROR] File not found: {BACKUP_FILE}")
        return False
    
    print(f"[INFO] Reading from {BACKUP_FILE}")
    file_size_mb = os.path.getsize(BACKUP_FILE) / (1024 * 1024)
    print(f"[INFO] File size: {file_size_mb:.2f} MB")
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Process file in streaming mode
    print(f"[INFO] Processing candidates (streaming mode)...")
    print(f"[INFO] Target: {CANDIDATES_PER_CHUNK} candidates per chunk")
    
    chunk_num = 0
    current_chunk = []
    total_candidates = 0
    chunk_files = []
    
    with open(BACKUP_FILE, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            if line_num % 1000 == 0:
                print(f"   Processed {line_num} lines...")
            
            line = line.strip()
            if not line:
                continue
            
            try:
                candidate = json.loads(line)
                current_chunk.append(candidate)
                total_candidates += 1
                
                # Save chunk when it reaches target size
                if len(current_chunk) >= CANDIDATES_PER_CHUNK:
                    chunk_num += 1
                    chunk_file = OUTPUT_DIR / f"candidates_chunk_{chunk_num:03d}.json"
                    
                    with open(chunk_file, 'w', encoding='utf-8') as cf:
                        json.dump(current_chunk, cf)
                    
                    chunk_size = os.path.getsize(chunk_file) / (1024 * 1024)
                    print(f"   Saved Chunk {chunk_num}: {len(current_chunk)} candidates, {chunk_size:.2f} MB")
                    
                    chunk_files.append(f"candidates_chunk_{chunk_num:03d}.json")
                    current_chunk = []
                    
            except json.JSONDecodeError as e:
                print(f"[WARN] Skipping line {line_num}: {e}")
    
    # Save remaining candidates
    if current_chunk:
        chunk_num += 1
        chunk_file = OUTPUT_DIR / f"candidates_chunk_{chunk_num:03d}.json"
        
        with open(chunk_file, 'w', encoding='utf-8') as cf:
            json.dump(current_chunk, cf)
        
        chunk_size = os.path.getsize(chunk_file) / (1024 * 1024)
        print(f"   Saved Chunk {chunk_num}: {len(current_chunk)} candidates, {chunk_size:.2f} MB")
        
        chunk_files.append(f"candidates_chunk_{chunk_num:03d}.json")
    
    print(f"\n[OK] Created {chunk_num} chunk files")
    print(f"[OK] Total candidates: {total_candidates}")
    print(f"[OK] Chunks saved to: {OUTPUT_DIR}")
    
    # Create metadata file
    metadata = {
        "total_candidates": total_candidates,
        "num_chunks": chunk_num,
        "chunk_files": chunk_files
    }
    
    metadata_file = OUTPUT_DIR / "metadata.json"
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"[OK] Metadata saved to: {metadata_file}")
    
    # Calculate total size
    total_size = sum(os.path.getsize(OUTPUT_DIR / f) for f in chunk_files)
    total_size_mb = total_size / (1024 * 1024)
    print(f"[INFO] Total chunks size: {total_size_mb:.2f} MB")
    
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("CANDIDATE DATA SPLITTER (STREAMING MODE)")
    print("=" * 60)
    
    success = split_candidates_streaming()
    
    if success:
        print("\n" + "=" * 60)
        print("SUCCESS!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Delete the old backend/data/candidates.json")
        print("2. Delete the backup_data folder")
        print("3. Test the backend with: python backend/app.py")
        print("4. Commit and push to GitHub")
    else:
        print("\n[ERROR] Failed to split candidates")

# Made with Bob
