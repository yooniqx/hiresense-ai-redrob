"""
Data loading and preprocessing service
"""
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DataLoader:
    """Load and preprocess candidate data"""
    
    def __init__(self, candidates_file: Path):
        self.candidates_file = candidates_file
        self.candidates = []
        
    def load_candidates(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Load candidates from JSON or JSONL file
        
        Args:
            limit: Maximum number of candidates to load (None for all)
            
        Returns:
            List of candidate dictionaries
        """
        logger.info(f"Loading candidates from {self.candidates_file}")
        
        candidates = []
        try:
            with open(self.candidates_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Try JSON array format first
                try:
                    data = json.loads(content)
                    if isinstance(data, list):
                        candidates = data[:limit] if limit else data
                        logger.info(f"Loaded {len(candidates)} candidates from JSON array")
                    else:
                        logger.warning("JSON file does not contain an array")
                except json.JSONDecodeError:
                    # Fall back to JSONL format
                    logger.info("Trying JSONL format...")
                    for i, line in enumerate(content.split('\n')):
                        if limit and i >= limit:
                            break
                        
                        line = line.strip()
                        if line:
                            try:
                                candidate = json.loads(line)
                                candidates.append(candidate)
                            except json.JSONDecodeError as e:
                                logger.warning(f"Failed to parse line {i+1}: {e}")
                                continue
                    
                    logger.info(f"Loaded {len(candidates)} candidates from JSONL")
                            
            self.candidates = candidates
            return candidates
            
        except FileNotFoundError:
            logger.warning(f"Candidates file not found: {self.candidates_file}")
            logger.info("System will start with empty candidate list")
            self.candidates = []
            return []
        except Exception as e:
            logger.error(f"Error loading candidates: {e}")
            raise
    
    def preprocess_candidate(self, candidate: Dict[str, Any]) -> Dict[str, Any]:
        """
        Preprocess a single candidate record
        
        Args:
            candidate: Raw candidate dictionary
            
        Returns:
            Preprocessed candidate dictionary
        """
        # Extract key fields
        processed = {
            "candidate_id": candidate.get("candidate_id"),
            "profile": candidate.get("profile", {}),
            "career_history": candidate.get("career_history", []),
            "education": candidate.get("education", []),
            "skills": candidate.get("skills", []),
            "certifications": candidate.get("certifications", []),
            "languages": candidate.get("languages", []),
            "redrob_signals": candidate.get("redrob_signals", {})
        }
        
        # Add computed fields
        processed["skill_names"] = [s["name"].lower() for s in processed["skills"]]
        processed["current_title"] = processed["profile"].get("current_title", "").lower()
        processed["current_company"] = processed["profile"].get("current_company", "").lower()
        processed["location"] = processed["profile"].get("location", "").lower()
        processed["country"] = processed["profile"].get("country", "").lower()
        
        # Parse dates
        signals = processed["redrob_signals"]
        if "last_active_date" in signals:
            try:
                last_active = datetime.strptime(signals["last_active_date"], "%Y-%m-%d")
                days_since_active = (datetime.now() - last_active).days
                processed["days_since_active"] = days_since_active
            except:
                processed["days_since_active"] = 999
        
        return processed
    
    def preprocess_all(self) -> List[Dict[str, Any]]:
        """
        Preprocess all loaded candidates
        
        Returns:
            List of preprocessed candidates
        """
        logger.info("Preprocessing candidates...")
        processed = [self.preprocess_candidate(c) for c in self.candidates]
        logger.info(f"Preprocessed {len(processed)} candidates")
        return processed
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        Get dataset statistics
        
        Returns:
            Dictionary of statistics
        """
        if not self.candidates:
            return {}
        
        stats = {
            "total_candidates": len(self.candidates),
            "avg_experience": sum(c.get("profile", {}).get("years_of_experience", 0) 
                                 for c in self.candidates) / len(self.candidates),
            "countries": list(set(c.get("profile", {}).get("country", "") 
                                 for c in self.candidates)),
            "total_skills": sum(len(c.get("skills", [])) for c in self.candidates),
        }
        
        return stats

