#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate ranking output without starting the server
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from backend.services.data_loader import DataLoader
from backend.services.ranker import CandidateRanker
import backend.config as config

if __name__ == '__main__':
    print("Loading candidates...")
    data_loader = DataLoader(config.CANDIDATES_FILE)
    candidates = data_loader.load_candidates()
    all_candidates = data_loader.preprocess_all()
    
    print("Ranking candidates...")
    ranker = CandidateRanker({
        "SCORING_WEIGHTS": config.SCORING_WEIGHTS,
        "REQUIRED_SKILLS": config.REQUIRED_SKILLS,
        "NICE_TO_HAVE_SKILLS": config.NICE_TO_HAVE_SKILLS,
        "DISQUALIFYING_KEYWORDS": config.DISQUALIFYING_KEYWORDS,
        "MIN_EXPERIENCE": config.MIN_EXPERIENCE,
        "MAX_EXPERIENCE": config.MAX_EXPERIENCE,
        "OPTIMAL_EXPERIENCE": config.OPTIMAL_EXPERIENCE,
        "PREFERRED_LOCATIONS": config.PREFERRED_LOCATIONS,
        "TIER_1_CITIES": config.TIER_1_CITIES
    })
    
    ranked_candidates = ranker.rank_candidates(all_candidates)
    ranker.save_submission_csv(config.RANKED_OUTPUT_FILE)
    
    print(f"\nRanking complete!")
    print(f"Output saved to: {config.RANKED_OUTPUT_FILE}")
    print(f"Total ranked: {len(ranked_candidates)}")

# Made with Bob
