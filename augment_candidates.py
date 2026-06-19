#!/usr/bin/env python3
"""
Augment the 50 sample candidates to create 100+ candidates by duplicating
and modifying them with variations in scores, locations, experience, etc.
"""
import json
import random
import os
from copy import deepcopy

INPUT_PATH = "backend/data/candidates.json"
OUTPUT_PATH = "backend/data/candidates.json"

# Variations for augmentation
LOCATIONS = ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "New York", "San Francisco", "Seattle", "Austin", "Boston"]
COUNTRIES = ["Canada", "India", "USA", "UK", "Germany", "Singapore", "Australia"]
COMPANIES = ["TechCorp", "DataSystems", "CloudWorks", "AILabs", "DevHub", "CodeFactory", "InnovateTech", "SmartSolutions"]
TITLES = ["Senior Engineer", "Lead Developer", "Staff Engineer", "Principal Engineer", "Engineering Manager", "Tech Lead", "Senior Developer", "Software Architect"]

def augment_candidate(candidate, index):
    """Create a variation of a candidate with modified data."""
    new_candidate = deepcopy(candidate)
    
    # Modify candidate ID
    original_id = candidate.get("candidate_id", "CAND_0000001")
    base_num = int(original_id.split("_")[-1])
    new_id = f"CAND_{(base_num + index * 1000):07d}"
    new_candidate["candidate_id"] = new_id
    
    # Modify profile
    profile = new_candidate.get("profile", {})
    
    # Vary location and country
    profile["location"] = random.choice(LOCATIONS)
    profile["country"] = random.choice(COUNTRIES)
    
    # Vary experience slightly
    original_exp = profile.get("years_of_experience", 5)
    profile["years_of_experience"] = round(original_exp + random.uniform(-1, 2), 1)
    
    # Vary current company and title
    profile["current_company"] = random.choice(COMPANIES)
    profile["current_title"] = random.choice(TITLES)
    
    # Modify redrob signals if present
    if "redrob_signals" in new_candidate:
        signals = new_candidate["redrob_signals"]
        
        # Vary activity score
        if "activity_score" in signals:
            signals["activity_score"] = round(random.uniform(0.3, 0.95), 2)
        
        # Vary engagement metrics
        if "profile_views_last_90_days" in signals:
            signals["profile_views_last_90_days"] = random.randint(10, 500)
        
        if "connection_growth_rate" in signals:
            signals["connection_growth_rate"] = round(random.uniform(0.01, 0.15), 3)
    
    # Modify skills slightly (add/remove random skills)
    if "skills" in new_candidate and len(new_candidate["skills"]) > 0:
        skills = new_candidate["skills"]
        # Randomly adjust endorsement counts
        for skill in skills:
            if "endorsement_count" in skill:
                skill["endorsement_count"] = random.randint(0, 50)
    
    return new_candidate

def main():
    """Load candidates and create augmented versions."""
    
    # Load original candidates
    print(f"[INFO] Loading candidates from {INPUT_PATH}")
    with open(INPUT_PATH, 'r', encoding='utf-8') as f:
        original_candidates = json.load(f)
    
    print(f"[INFO] Loaded {len(original_candidates)} original candidates")
    
    # Create augmented dataset
    all_candidates = []
    
    # Keep originals
    all_candidates.extend(original_candidates)
    
    # Create 2 variations of each candidate (50 * 2 = 100 more)
    for i in range(2):
        for candidate in original_candidates:
            augmented = augment_candidate(candidate, i + 1)
            all_candidates.append(augmented)
    
    print(f"[INFO] Created {len(all_candidates)} total candidates")
    
    # Save augmented dataset
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(all_candidates, f, indent=2)
    
    # Get file size
    file_size = os.path.getsize(OUTPUT_PATH)
    file_size_mb = file_size / (1024 * 1024)
    
    print(f"[OK] Saved {len(all_candidates)} candidates to {OUTPUT_PATH}")
    print(f"[INFO] File size: {file_size_mb:.2f} MB ({file_size:,} bytes)")
    
    if file_size_mb < 50:
        print("[OK] File size is good for GitHub (< 50 MB)")
    else:
        print(f"[WARN] File is large ({file_size_mb:.2f} MB)")

if __name__ == "__main__":
    main()

# Made with Bob
