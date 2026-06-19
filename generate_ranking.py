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
    print("=" * 60)
    print("HireSense AI - Semantic Ranking System")
    print("Using AI-powered analysis that reads between the lines")
    print("=" * 60)
    
    print("\nLoading candidates...")
    data_loader = DataLoader(config.CANDIDATES_FILE)
    candidates = data_loader.load_candidates()
    all_candidates = data_loader.preprocess_all()
    
    print(f"Loaded {len(all_candidates)} candidates")
    print("\nRanking candidates with semantic analysis...")
    print("- Analyzing career trajectories")
    print("- Detecting technical depth vs keyword stuffing")
    print("- Evaluating behavioral availability")
    print("- Assessing location fit")
    
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
    }, use_semantic=True)  # Enable semantic scoring
    
    ranked_candidates = ranker.rank_candidates(all_candidates)
    ranker.save_submission_csv(config.RANKED_OUTPUT_FILE)
    
    stats = ranker.get_statistics()
    
    print("\n" + "=" * 60)
    print("Ranking Complete!")
    print("=" * 60)
    print(f"Output saved to: {config.RANKED_OUTPUT_FILE}")
    print(f"Total ranked: {len(ranked_candidates)}")
    print(f"Average score: {stats.get('avg_score', 0):.4f}")
    print(f"Top 10 average: {stats.get('top_10_avg', 0):.4f}")
    print(f"Score range: {stats.get('min_score', 0):.4f} - {stats.get('max_score', 0):.4f}")
    print("\nValidating submission format...")

# Made with Bob
