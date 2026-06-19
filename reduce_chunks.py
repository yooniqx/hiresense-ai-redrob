#!/usr/bin/env python3
"""
Keep only first 10 chunks (10,000 candidates) to fit GitHub limits.
This gives us 10,000 candidates to rank from, which is still substantial.
"""
import json
import os
from pathlib import Path

CHUNKS_DIR = Path("backend/data/chunks")
KEEP_CHUNKS = 10  # Keep first 10 chunks = 10,000 candidates

def reduce_chunks():
    """Keep only first N chunks and update metadata"""
    
    if not CHUNKS_DIR.exists():
        print("[ERROR] Chunks directory not found")
        return False
    
    print(f"[INFO] Reducing to first {KEEP_CHUNKS} chunks...")
    
    # Delete chunks beyond KEEP_CHUNKS
    deleted_count = 0
    for i in range(KEEP_CHUNKS + 1, 101):
        chunk_file = CHUNKS_DIR / f"candidates_chunk_{i:03d}.json"
        if chunk_file.exists():
            chunk_file.unlink()
            deleted_count += 1
            if deleted_count % 10 == 0:
                print(f"   Deleted {deleted_count} chunks...")
    
    print(f"[OK] Deleted {deleted_count} chunks")
    
    # Update metadata
    metadata_file = CHUNKS_DIR / "metadata.json"
    chunk_files = [f"candidates_chunk_{i:03d}.json" for i in range(1, KEEP_CHUNKS + 1)]
    
    metadata = {
        "total_candidates": KEEP_CHUNKS * 1000,
        "num_chunks": KEEP_CHUNKS,
        "chunk_files": chunk_files
    }
    
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"[OK] Updated metadata")
    print(f"[OK] Total candidates: {metadata['total_candidates']}")
    print(f"[OK] Number of chunks: {metadata['num_chunks']}")
    
    # Calculate total size
    total_size = sum(os.path.getsize(CHUNKS_DIR / f) for f in chunk_files if (CHUNKS_DIR / f).exists())
    total_size_mb = total_size / (1024 * 1024)
    print(f"[INFO] Total size: {total_size_mb:.2f} MB")
    
    if total_size_mb < 50:
        print("[OK] Size is good for GitHub (< 50 MB)")
    else:
        print(f"[WARN] Size might be too large for GitHub: {total_size_mb:.2f} MB")
    
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("REDUCE CHUNKS TO FIT GITHUB")
    print("=" * 60)
    
    success = reduce_chunks()
    
    if success:
        print("\n" + "=" * 60)
        print("SUCCESS!")
        print("=" * 60)
        print("\nThe system will now:")
        print("- Load 10,000 candidates from 10 chunks")
        print("- Rank the top 100 using AI scoring")
        print("- Display them in the web app")
    else:
        print("\n[ERROR] Failed to reduce chunks")

# Made with Bob
