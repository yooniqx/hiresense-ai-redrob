"""
Enhanced AI-powered semantic scoring that reads between the lines
Based on the job description's explicit guidance:
"The right answer involves reasoning about the gap between what the JD says and what the JD means"
"""
import logging
import re
from typing import Dict, Any, List, Tuple
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SemanticCandidateScorer:
    """
    Advanced scorer that understands context and reads between the lines
    instead of just matching keywords
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.weights = config.get("SCORING_WEIGHTS", {})
        
    def analyze_career_trajectory(self, candidate: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """
        Analyze if candidate shows genuine ML/AI career progression
        Not just keyword matching - look for actual product company experience
        """
        career_history = candidate.get("career_history", [])
        profile = candidate.get("profile", {})
        
        score = 0.0
        details = {
            "has_product_company_exp": False,
            "has_ml_production_exp": False,
            "career_progression": "unknown",
            "title_hopping_penalty": 0.0
        }
        
        if not career_history:
            return 0.3, details
        
        # Check for product company experience (not consulting)
        consulting_companies = ["tcs", "infosys", "wipro", "accenture", "cognizant", "capgemini", 
                               "consulting", "services", "solutions"]
        product_companies = []
        consulting_only = True
        
        for job in career_history:
            company = job.get("company", "").lower()
            title = job.get("title", "").lower()
            duration = job.get("duration_months", 0)
            
            # Check if it's a consulting company
            is_consulting = any(cons in company for cons in consulting_companies)
            
            if not is_consulting:
                consulting_only = False
                product_companies.append({
                    "company": company,
                    "title": title,
                    "duration": duration
                })
        
        # DISQUALIFY if only consulting experience
        if consulting_only and len(career_history) > 0:
            return 0.1, {**details, "consulting_only": True}
        
        details["has_product_company_exp"] = len(product_companies) > 0
        
        # Look for ML/AI production experience in job descriptions
        ml_indicators = ["machine learning", "ml engineer", "ai engineer", "data scientist",
                        "recommendation", "ranking", "search", "retrieval", "nlp", "deep learning",
                        "embeddings", "vector", "llm"]
        
        ml_roles = []
        for job in career_history:
            title = job.get("title", "").lower()
            description = job.get("description", "").lower()
            combined = f"{title} {description}"
            
            if any(indicator in combined for indicator in ml_indicators):
                ml_roles.append(job)
        
        details["has_ml_production_exp"] = len(ml_roles) > 0
        details["ml_roles_count"] = len(ml_roles)
        
        # Check for title hopping (red flag per JD)
        if len(career_history) >= 3:
            avg_tenure = sum(j.get("duration_months", 0) for j in career_history) / len(career_history)
            if avg_tenure < 18:  # Less than 1.5 years average
                details["title_hopping_penalty"] = 0.3
                score -= 0.3
        
        # Score based on ML production experience
        if len(ml_roles) >= 2:
            score += 0.5
        elif len(ml_roles) == 1:
            score += 0.3
        
        # Bonus for product company ML experience
        if details["has_product_company_exp"] and details["has_ml_production_exp"]:
            score += 0.3
        
        # Check for career progression (junior -> senior -> staff)
        titles = [j.get("title", "").lower() for j in career_history]
        if any("staff" in t or "principal" in t or "lead" in t for t in titles):
            if any("senior" in t for t in titles):
                details["career_progression"] = "strong"
                score += 0.2
        
        return min(max(score, 0), 1.0), details
    
    def analyze_technical_depth(self, candidate: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """
        Look for REAL technical depth, not just keyword lists
        Per JD: "A candidate who has all the AI keywords listed as skills but whose 
        title is 'Marketing Manager' is not a fit"
        """
        skills = candidate.get("skills", [])
        profile = candidate.get("profile", {})
        career_history = candidate.get("career_history", [])
        
        current_title = profile.get("current_title", "").lower()
        
        # CRITICAL: Check if title matches technical role
        technical_titles = ["engineer", "scientist", "developer", "architect", "tech lead", 
                           "ml", "ai", "data", "software"]
        non_technical_titles = ["manager", "marketing", "sales", "hr", "recruiter", "consultant",
                               "analyst", "coordinator", "admin"]
        
        is_technical_role = any(tech in current_title for tech in technical_titles)
        is_non_technical = any(non_tech in current_title for non_tech in non_technical_titles)
        
        # DISQUALIFY if non-technical role with AI keywords (the trap!)
        if is_non_technical and not is_technical_role:
            return 0.1, {
                "technical_role": False,
                "reason": "Non-technical title despite AI keywords - likely keyword stuffing"
            }
        
        if not is_technical_role:
            return 0.2, {"technical_role": False}
        
        # Now look for DEPTH not breadth
        # JD wants: embeddings, vector DB, retrieval, ranking experience
        core_depth_skills = {
            "embeddings": ["embedding", "sentence-transformer", "bge", "e5", "openai embedding"],
            "vector_db": ["pinecone", "weaviate", "qdrant", "milvus", "faiss", "opensearch", "elasticsearch"],
            "retrieval": ["retrieval", "search", "ranking", "recommendation", "information retrieval"],
            "evaluation": ["ndcg", "mrr", "map", "precision", "recall", "a/b test"]
        }
        
        depth_matches = {}
        for category, keywords in core_depth_skills.items():
            matches = []
            for skill in skills:
                skill_name = skill.get("name", "").lower()
                proficiency = skill.get("proficiency", "").lower()
                duration = skill.get("duration_months", 0)
                
                for keyword in keywords:
                    if keyword in skill_name:
                        matches.append({
                            "skill": skill_name,
                            "proficiency": proficiency,
                            "duration": duration
                        })
                        break
            depth_matches[category] = matches
        
        # Calculate depth score
        depth_score = 0.0
        categories_with_depth = 0
        
        for category, matches in depth_matches.items():
            if matches:
                categories_with_depth += 1
                # Bonus for expert proficiency and long duration
                for match in matches:
                    if match["proficiency"] == "expert":
                        depth_score += 0.15
                    elif match["proficiency"] == "advanced":
                        depth_score += 0.10
                    
                    if match["duration"] >= 24:  # 2+ years
                        depth_score += 0.05
        
        # Need at least 2 core categories for depth
        if categories_with_depth < 2:
            depth_score *= 0.5
        
        details = {
            "technical_role": True,
            "categories_with_depth": categories_with_depth,
            "depth_matches": {k: len(v) for k, v in depth_matches.items()},
            "depth_score": depth_score
        }
        
        return min(depth_score, 1.0), details
    
    def analyze_behavioral_availability(self, candidate: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """
        Per JD: "a perfect-on-paper candidate who hasn't logged in for 6 months 
        and has a 5% recruiter response rate is, for hiring purposes, not actually available"
        """
        redrob_signals = candidate.get("redrob_signals", {})
        
        # Recent activity
        days_since_active = candidate.get("days_since_active", 999)
        last_active_date = redrob_signals.get("last_active_date", "")
        
        # Response rate
        response_rate = redrob_signals.get("recruiter_response_rate", 0)
        
        # Open to work flag
        open_to_work = redrob_signals.get("open_to_work_flag", False)
        job_search_status = redrob_signals.get("job_search_status", "").lower()
        
        # Notice period
        notice_period = redrob_signals.get("notice_period_days", 90)
        
        score = 0.0
        details = {
            "days_since_active": days_since_active,
            "response_rate": response_rate,
            "open_to_work": open_to_work,
            "notice_period": notice_period,
            "availability_status": "unknown"
        }
        
        # CRITICAL: Down-weight inactive candidates heavily
        if days_since_active > 180:  # 6 months
            score = 0.1
            details["availability_status"] = "inactive"
            return score, details
        elif days_since_active > 90:  # 3 months
            score = 0.3
            details["availability_status"] = "low_activity"
        elif days_since_active <= 30:  # Active in last month
            score = 0.9
            details["availability_status"] = "highly_active"
        else:
            score = 0.6
            details["availability_status"] = "moderately_active"
        
        # Response rate is critical
        if response_rate < 0.1:  # Less than 10%
            score *= 0.3
            details["availability_status"] += "_low_response"
        elif response_rate > 0.7:  # High response rate
            score = min(score + 0.2, 1.0)
        
        # Open to work bonus
        if open_to_work or "actively" in job_search_status:
            score = min(score + 0.15, 1.0)
        
        # Notice period consideration (JD prefers <30 days)
        if notice_period <= 30:
            score = min(score + 0.1, 1.0)
        elif notice_period > 60:
            score *= 0.9
        
        return min(max(score, 0), 1.0), details
    
    def analyze_location_fit(self, candidate: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """
        JD says: Pune/Noida preferred, Tier-1 cities welcome, willing to relocate is good
        """
        profile = candidate.get("profile", {})
        redrob_signals = candidate.get("redrob_signals", {})
        
        location = profile.get("location", "").lower()
        country = profile.get("country", "").lower()
        willing_to_relocate = redrob_signals.get("willing_to_relocate", False)
        
        score = 0.5  # default
        details = {"location": location, "willing_to_relocate": willing_to_relocate}
        
        # Preferred locations (Pune/Noida)
        if "pune" in location or "noida" in location or "delhi" in location or "gurgaon" in location or "gurugram" in location:
            score = 1.0
            details["location_match"] = "preferred"
        # Tier-1 cities
        elif any(city in location for city in ["bangalore", "mumbai", "hyderabad", "chennai"]):
            score = 0.8
            details["location_match"] = "tier1"
        # India but other cities
        elif "india" in country or any(city in location for city in ["india", "indian"]):
            score = 0.6
            details["location_match"] = "india_other"
        # International
        else:
            score = 0.3
            details["location_match"] = "international"
        
        # Willing to relocate bonus
        if willing_to_relocate and score < 0.8:
            score = min(score + 0.3, 0.9)
            details["relocation_bonus"] = True
        
        return score, details
    
    def detect_keyword_stuffing(self, candidate: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Detect if candidate is just stuffing keywords without real experience
        """
        skills = candidate.get("skills", [])
        profile = candidate.get("profile", {})
        career_history = candidate.get("career_history", [])
        
        # Red flag 1: Too many skills with no depth
        if len(skills) > 50:
            return True, "Excessive skills count (>50) suggests keyword stuffing"
        
        # Red flag 2: All skills marked as "Expert" with short duration
        if len(skills) > 10:
            expert_count = sum(1 for s in skills if s.get("proficiency", "").lower() == "expert")
            if expert_count > len(skills) * 0.8:  # 80%+ expert
                avg_duration = sum(s.get("duration_months", 0) for s in skills) / len(skills)
                if avg_duration < 12:  # Less than 1 year average
                    return True, "Too many 'expert' skills with short duration"
        
        # Red flag 3: Skills don't match career history
        years_exp = profile.get("years_of_experience", 0)
        if len(skills) > years_exp * 5:  # More than 5 skills per year of experience
            return True, "Skills count disproportionate to experience"
        
        return False, ""
    
    def calculate_semantic_score(self, candidate: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """
        Calculate final semantic score that reads between the lines
        """
        candidate_id = candidate.get("candidate_id", "unknown")
        
        # Check for keyword stuffing first
        is_stuffing, stuffing_reason = self.detect_keyword_stuffing(candidate)
        if is_stuffing:
            return 0.15, {
                "disqualified": True,
                "reason": stuffing_reason,
                "candidate_id": candidate_id
            }
        
        # Analyze different dimensions
        career_score, career_details = self.analyze_career_trajectory(candidate)
        depth_score, depth_details = self.analyze_technical_depth(candidate)
        availability_score, availability_details = self.analyze_behavioral_availability(candidate)
        location_score, location_details = self.analyze_location_fit(candidate)
        
        # Weighted combination - emphasizing what JD actually wants
        composite_score = (
            career_score * 0.35 +      # Career trajectory is critical
            depth_score * 0.35 +        # Technical depth over breadth
            availability_score * 0.20 + # Actually available candidates
            location_score * 0.10       # Location fit
        )
        
        all_details = {
            "candidate_id": candidate_id,
            "career": {"score": career_score, **career_details},
            "technical_depth": {"score": depth_score, **depth_details},
            "availability": {"score": availability_score, **availability_details},
            "location": {"score": location_score, **location_details},
            "composite_score": composite_score,
            "scoring_method": "semantic_analysis"
        }
        
        return composite_score, all_details


# Made with Bob