"""
Honeypot candidate detection service
Identifies candidates with impossible or inconsistent profiles
"""
import logging
from typing import Dict, Any, List, Tuple
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class HoneypotDetector:
    """Detect honeypot candidates with impossible profiles"""
    
    def __init__(self):
        self.honeypot_flags = []
    
    def check_experience_timeline(self, candidate: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Check if experience timeline is consistent
        
        Returns:
            (is_honeypot, reason)
        """
        career_history = candidate.get("career_history", [])
        
        for job in career_history:
            try:
                start_date = datetime.strptime(job["start_date"], "%Y-%m-%d")
                duration_months = job["duration_months"]
                
                # Check if duration is impossibly long
                if duration_months > 600:  # 50 years
                    return True, f"Impossible job duration: {duration_months} months"
                
                # Check if start date is in the future
                if start_date > datetime.now():
                    return True, f"Future start date: {job['start_date']}"
                
                # Check if company founding date vs experience
                company = job["company"].lower()
                
                # Known company founding dates (simplified check)
                if "founded 3 years ago" in job.get("description", "").lower():
                    years_at_company = duration_months / 12
                    if years_at_company > 3.5:
                        return True, f"Experience exceeds company age"
                        
            except Exception as e:
                logger.debug(f"Error checking timeline: {e}")
                continue
        
        return False, ""
    
    def check_skill_consistency(self, candidate: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Check if skills are consistent with experience
        
        Returns:
            (is_honeypot, reason)
        """
        skills = candidate.get("skills", [])
        profile = candidate.get("profile", {})
        years_of_experience = profile.get("years_of_experience", 0)
        
        # Count expert skills with 0 duration
        expert_zero_duration = 0
        total_expert_skills = 0
        
        for skill in skills:
            if skill.get("proficiency") == "expert":
                total_expert_skills += 1
                if skill.get("duration_months", 0) == 0:
                    expert_zero_duration += 1
        
        # If more than 5 expert skills with 0 duration, likely honeypot
        if expert_zero_duration > 5:
            return True, f"{expert_zero_duration} expert skills with 0 months experience"
        
        # Check for impossible skill count
        if len(skills) > 50:
            return True, f"Unrealistic skill count: {len(skills)}"
        
        return False, ""
    
    def check_keyword_stuffing(self, candidate: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Check for keyword stuffing patterns
        
        Returns:
            (is_honeypot, reason)
        """
        profile = candidate.get("profile", {})
        skills = candidate.get("skills", [])
        
        # Check if current title doesn't match skills
        current_title = profile.get("current_title", "").lower()
        skill_names = [s["name"].lower() for s in skills]
        
        # Non-technical titles with excessive AI skills
        non_tech_titles = ["hr manager", "accountant", "sales executive", 
                          "marketing manager", "content writer", "graphic designer"]
        
        ai_skills = ["nlp", "machine learning", "deep learning", "llm", "gpt", 
                    "bert", "transformers", "pytorch", "tensorflow"]
        
        ai_skill_count = sum(1 for s in skill_names if any(ai in s for ai in ai_skills))
        
        if any(title in current_title for title in non_tech_titles):
            if ai_skill_count > 8:
                return True, f"Non-technical role with {ai_skill_count} AI skills"
        
        return False, ""
    
    def check_education_consistency(self, candidate: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Check education timeline consistency
        
        Returns:
            (is_honeypot, reason)
        """
        education = candidate.get("education", [])
        
        for edu in education:
            start_year = edu.get("start_year", 0)
            end_year = edu.get("end_year", 0)
            
            # Check for impossible duration
            duration = end_year - start_year
            if duration > 10 or duration < 0:
                return True, f"Impossible education duration: {duration} years"
            
            # Check for future dates
            if end_year > datetime.now().year + 1:
                return True, f"Future graduation year: {end_year}"
        
        return False, ""
    
    def detect(self, candidate: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """
        Run all honeypot detection checks
        
        Args:
            candidate: Candidate dictionary
            
        Returns:
            (is_honeypot, list of reasons)
        """
        reasons = []
        
        # Run all checks
        checks = [
            self.check_experience_timeline,
            self.check_skill_consistency,
            self.check_keyword_stuffing,
            self.check_education_consistency
        ]
        
        for check in checks:
            is_honeypot, reason = check(candidate)
            if is_honeypot:
                reasons.append(reason)
        
        return len(reasons) > 0, reasons
    
    def detect_batch(self, candidates: List[Dict[str, Any]]) -> Dict[str, List[str]]:
        """
        Detect honeypots in a batch of candidates
        
        Args:
            candidates: List of candidate dictionaries
            
        Returns:
            Dictionary mapping candidate_id to list of honeypot reasons
        """
        honeypots = {}
        
        for candidate in candidates:
            is_honeypot, reasons = self.detect(candidate)
            if is_honeypot:
                candidate_id = candidate.get("candidate_id")
                honeypots[candidate_id] = reasons
        
        logger.info(f"Detected {len(honeypots)} honeypot candidates")
        return honeypots

