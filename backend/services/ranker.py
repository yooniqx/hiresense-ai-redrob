"""
Main ranking pipeline for HireSense AI
"""
import logging
import csv
from typing import List, Dict, Any, Tuple
from pathlib import Path

from .scorer import CandidateScorer
from .honeypot_detector import HoneypotDetector

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CandidateRanker:
    """Main ranking pipeline"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.scorer = CandidateScorer(config)
        self.honeypot_detector = HoneypotDetector()
        self.ranked_candidates = []
    
    def generate_reasoning(self, candidate: Dict[str, Any], score_details: Dict[str, Any], rank: int) -> str:
        """
        Generate human-readable reasoning for a candidate's rank
        
        Args:
            candidate: Candidate dictionary
            score_details: Scoring details
            rank: Candidate's rank
            
        Returns:
            Reasoning string
        """
        profile = candidate.get("profile", {})
        skills_details = score_details.get("skills", {})
        exp_details = score_details.get("experience", {})
        signals_details = score_details.get("signals", {})
        
        # Extract key facts
        title = profile.get("current_title", "Unknown")
        years_exp = profile.get("years_of_experience", 0)
        location = profile.get("location", "Unknown")
        
        required_matches = skills_details.get("required_matches", 0)
        response_rate = signals_details.get("response_rate", 0)
        days_since_active = signals_details.get("days_since_active", 999)
        
        # Build reasoning based on rank tier
        if rank <= 10:
            # Top 10: Emphasize strengths
            reasoning = f"{title} with {years_exp:.1f} yrs; {required_matches} core AI/ML skills; "
            reasoning += f"response rate {response_rate:.2f}; "
            if days_since_active < 30:
                reasoning += "recently active; "
            reasoning += f"{location}-based."
        elif rank <= 50:
            # Top 50: Balanced view
            reasoning = f"{title} ({years_exp:.1f} yrs); {required_matches} required skills matched; "
            if response_rate > 0.5:
                reasoning += f"good engagement ({response_rate:.2f}); "
            else:
                reasoning += f"moderate engagement ({response_rate:.2f}); "
            reasoning += f"located in {location}."
        else:
            # 51-100: Acknowledge gaps
            reasoning = f"{title} with {years_exp:.1f} yrs; {required_matches} skill matches; "
            if response_rate < 0.3:
                reasoning += "lower response rate; "
            if days_since_active > 60:
                reasoning += "less recent activity; "
            reasoning += "potential fit with development."
        
        return reasoning[:200]  # Limit length
    
    def rank_candidates(self, candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Rank all candidates and generate output
        
        Args:
            candidates: List of preprocessed candidates
            
        Returns:
            List of ranked candidates with scores and reasoning
        """
        logger.info(f"Ranking {len(candidates)} candidates...")
        
        # Detect honeypots
        honeypots = self.honeypot_detector.detect_batch(candidates)
        logger.info(f"Detected {len(honeypots)} honeypot candidates")
        
        # Score all candidates
        scored_candidates = []
        for candidate in candidates:
            candidate_id = candidate.get("candidate_id")
            
            # Skip honeypots
            if candidate_id in honeypots:
                logger.debug(f"Skipping honeypot: {candidate_id}")
                continue
            
            # Calculate composite score
            try:
                composite_score, score_details = self.scorer.calculate_composite_score(candidate)
                
                scored_candidates.append({
                    "candidate_id": candidate_id,
                    "candidate": candidate,
                    "score": composite_score,
                    "score_details": score_details
                })
            except Exception as e:
                logger.error(f"Error scoring candidate {candidate_id}: {e}")
                continue
        
        # Round scores to 4 decimal places for consistent tie-breaking
        for item in scored_candidates:
            item["rounded_score"] = round(item["score"], 4)
        
        # Sort by rounded score (descending), then by candidate_id (ascending) for tie-breaking
        scored_candidates.sort(key=lambda x: (-x["rounded_score"], x["candidate_id"]))
        
        # Take top 100
        top_100 = scored_candidates[:100]
        
        # Add ranks and reasoning
        ranked_results = []
        for rank, item in enumerate(top_100, start=1):
            reasoning = self.generate_reasoning(
                item["candidate"],
                item["score_details"],
                rank
            )
            
            ranked_results.append({
                "rank": rank,
                "candidate_id": item["candidate_id"],
                "score": item["score"],
                "reasoning": reasoning,
                "candidate": item["candidate"],
                "score_details": item["score_details"]
            })
        
        self.ranked_candidates = ranked_results
        logger.info(f"Ranked top {len(ranked_results)} candidates")
        
        return ranked_results
    
    def save_submission_csv(self, output_path: Path) -> None:
        """
        Save ranked candidates to CSV in submission format
        
        Args:
            output_path: Path to output CSV file
        """
        if not self.ranked_candidates:
            logger.error("No ranked candidates to save")
            return
        
        logger.info(f"Saving submission to {output_path}")
        
        # Ensure output directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            
            # Write header
            writer.writerow(['candidate_id', 'rank', 'score', 'reasoning'])
            
            # Write data rows
            for item in self.ranked_candidates:
                writer.writerow([
                    item['candidate_id'],
                    item['rank'],
                    f"{item['score']:.4f}",
                    item['reasoning']
                ])
        
        logger.info(f"Submission saved successfully: {len(self.ranked_candidates)} candidates")
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        Get ranking statistics
        
        Returns:
            Dictionary of statistics
        """
        if not self.ranked_candidates:
            return {}
        
        scores = [c["score"] for c in self.ranked_candidates]
        
        return {
            "total_ranked": len(self.ranked_candidates),
            "avg_score": sum(scores) / len(scores),
            "max_score": max(scores),
            "min_score": min(scores),
            "top_10_avg": sum(scores[:10]) / 10 if len(scores) >= 10 else 0
        }

# Made with Bob
