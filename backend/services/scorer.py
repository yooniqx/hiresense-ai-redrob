"""
Multi-component scoring engine for candidate ranking
"""
import logging
import re
from typing import Dict, Any, List, Tuple
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CandidateScorer:
    """Score candidates based on multiple components"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.weights = config.get("SCORING_WEIGHTS", {})
        self.required_skills = [s.lower() for s in config.get("REQUIRED_SKILLS", [])]
        self.nice_to_have_skills = [s.lower() for s in config.get("NICE_TO_HAVE_SKILLS", [])]
        self.disqualifying_keywords = [k.lower() for k in config.get("DISQUALIFYING_KEYWORDS", [])]
        self.min_exp = config.get("MIN_EXPERIENCE", 5)
        self.max_exp = config.get("MAX_EXPERIENCE", 9)
        self.optimal_exp = config.get("OPTIMAL_EXPERIENCE", 7)
        self.preferred_locations = [l.lower() for l in config.get("PREFERRED_LOCATIONS", [])]
        self.tier_1_cities = [c.lower() for c in config.get("TIER_1_CITIES", [])]
    
    def score_skills_match(self, candidate: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """
        Score candidate's skills match with job requirements
        
        Returns:
            (score, details)
        """
        skills = candidate.get("skills", [])
        skill_names = [s["name"].lower() for s in skills]
        skill_dict = {s["name"].lower(): s for s in skills}
        redrob_signals = candidate.get("redrob_signals", {})
        skill_assessments = redrob_signals.get("skill_assessment_scores", {})
        
        # Count required skills
        required_matches = []
        for req_skill in self.required_skills:
            for skill_name in skill_names:
                if req_skill in skill_name or skill_name in req_skill:
                    skill_info = skill_dict[skill_name]
                    required_matches.append({
                        "skill": skill_name,
                        "proficiency": skill_info.get("proficiency"),
                        "endorsements": skill_info.get("endorsements", 0),
                        "duration_months": skill_info.get("duration_months", 0)
                    })
                    break
        
        # Count nice-to-have skills
        nice_to_have_matches = []
        for nice_skill in self.nice_to_have_skills:
            for skill_name in skill_names:
                if nice_skill in skill_name or skill_name in nice_skill:
                    skill_info = skill_dict[skill_name]
                    nice_to_have_matches.append({
                        "skill": skill_name,
                        "proficiency": skill_info.get("proficiency")
                    })
                    break
        
        # Calculate base score
        required_score = min(len(required_matches) / len(self.required_skills), 1.0) * 0.7
        nice_to_have_score = min(len(nice_to_have_matches) / len(self.nice_to_have_skills), 1.0) * 0.3
        
        # Proficiency bonus
        proficiency_weights = {"expert": 1.0, "advanced": 0.8, "intermediate": 0.5, "beginner": 0.2}
        avg_proficiency = 0
        if required_matches:
            avg_proficiency = sum(proficiency_weights.get(m["proficiency"], 0) 
                                 for m in required_matches) / len(required_matches)
        
        # Assessment scores bonus
        assessment_bonus = 0
        if skill_assessments:
            avg_assessment = sum(skill_assessments.values()) / len(skill_assessments)
            assessment_bonus = (avg_assessment / 100) * 0.1
        
        # Endorsements bonus
        total_endorsements = sum(m["endorsements"] for m in required_matches)
        endorsement_bonus = min(total_endorsements / 100, 0.1)
        
        final_score = required_score + nice_to_have_score + (avg_proficiency * 0.1) + assessment_bonus + endorsement_bonus
        final_score = min(final_score, 1.0)
        
        details = {
            "required_matches": len(required_matches),
            "nice_to_have_matches": len(nice_to_have_matches),
            "avg_proficiency": avg_proficiency,
            "total_endorsements": total_endorsements,
            "assessment_scores": skill_assessments
        }
        
        return final_score, details
    
    def score_experience_match(self, candidate: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """
        Score candidate's experience match
        
        Returns:
            (score, details)
        """
        profile = candidate.get("profile", {})
        career_history = candidate.get("career_history", [])
        
        years_of_experience = profile.get("years_of_experience", 0)
        current_title = profile.get("current_title", "").lower()
        current_company = profile.get("current_company", "").lower()
        current_industry = profile.get("current_industry", "").lower()
        
        # Experience range score
        if self.min_exp <= years_of_experience <= self.max_exp:
            exp_score = 1.0 - abs(years_of_experience - self.optimal_exp) / (self.max_exp - self.min_exp)
        elif years_of_experience < self.min_exp:
            exp_score = years_of_experience / self.min_exp * 0.5
        else:
            exp_score = max(0, 1.0 - (years_of_experience - self.max_exp) / 10) * 0.7
        
        # Title relevance
        relevant_titles = ["ai engineer", "ml engineer", "machine learning", "data scientist", 
                          "senior engineer", "staff engineer", "tech lead"]
        title_score = 0.5
        for title in relevant_titles:
            if title in current_title:
                title_score = 1.0
                break
        
        # Check for disqualifying companies
        disqualifying_penalty = 0
        for keyword in self.disqualifying_keywords:
            if keyword in current_company or keyword in current_industry:
                disqualifying_penalty = 0.3
                break
        
        # Product company bonus
        product_indicators = ["product", "saas", "platform", "tech", "software"]
        product_bonus = 0
        if any(ind in current_industry.lower() for ind in product_indicators):
            product_bonus = 0.1
        
        # Career stability (check for job hopping)
        if len(career_history) > 0:
            avg_tenure = sum(job["duration_months"] for job in career_history) / len(career_history)
            stability_score = min(avg_tenure / 24, 1.0)  # 24 months = ideal
        else:
            stability_score = 0.5
        
        final_score = (exp_score * 0.4 + title_score * 0.3 + stability_score * 0.2 + product_bonus) - disqualifying_penalty
        final_score = max(0, min(final_score, 1.0))
        
        details = {
            "years_of_experience": years_of_experience,
            "current_title": current_title,
            "exp_score": exp_score,
            "title_score": title_score,
            "stability_score": stability_score,
            "disqualifying_penalty": disqualifying_penalty
        }
        
        return final_score, details
    
    def score_profile_quality(self, candidate: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """
        Score candidate's profile quality
        
        Returns:
            (score, details)
        """
        profile = candidate.get("profile", {})
        education = candidate.get("education", [])
        redrob_signals = candidate.get("redrob_signals", {})
        
        location = profile.get("location", "").lower()
        country = profile.get("country", "").lower()
        
        # Location score
        location_score = 0.3  # default
        if any(loc in location for loc in self.preferred_locations):
            location_score = 1.0
        elif any(city in location for city in self.tier_1_cities):
            location_score = 0.7
        
        # Relocation willingness
        willing_to_relocate = redrob_signals.get("willing_to_relocate", False)
        if willing_to_relocate:
            location_score = max(location_score, 0.8)
        
        # Education tier
        education_score = 0.5
        if education:
            best_tier = "tier_4"
            for edu in education:
                tier = edu.get("tier", "unknown")
                if tier == "tier_1":
                    best_tier = "tier_1"
                    break
                elif tier == "tier_2" and best_tier not in ["tier_1"]:
                    best_tier = "tier_2"
            
            tier_scores = {"tier_1": 1.0, "tier_2": 0.8, "tier_3": 0.6, "tier_4": 0.4, "unknown": 0.3}
            education_score = tier_scores.get(best_tier, 0.5)
        
        # Profile completeness
        completeness = redrob_signals.get("profile_completeness_score", 0) / 100
        
        # Verification status
        verified_email = redrob_signals.get("verified_email", False)
        verified_phone = redrob_signals.get("verified_phone", False)
        verification_score = (verified_email + verified_phone) / 2
        
        final_score = (location_score * 0.3 + education_score * 0.3 + 
                      completeness * 0.3 + verification_score * 0.1)
        
        details = {
            "location": location,
            "location_score": location_score,
            "education_score": education_score,
            "completeness": completeness,
            "verified": verified_email and verified_phone
        }
        
        return final_score, details
    
    def score_behavioral_signals(self, candidate: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """
        Score candidate's behavioral signals
        
        Returns:
            (score, details)
        """
        redrob_signals = candidate.get("redrob_signals", {})
        
        # Recent activity
        days_since_active = candidate.get("days_since_active", 999)
        activity_score = max(0, 1.0 - (days_since_active / 180))
        
        # Open to work
        open_to_work = redrob_signals.get("open_to_work_flag", False)
        open_to_work_score = 1.0 if open_to_work else 0.3
        
        # Response rate
        response_rate = redrob_signals.get("recruiter_response_rate", 0)
        response_score = response_rate
        
        # Interview completion rate
        interview_rate = redrob_signals.get("interview_completion_rate", 0)
        
        # Notice period
        notice_period = redrob_signals.get("notice_period_days", 90)
        notice_score = max(0, 1.0 - (notice_period / 180))
        
        # GitHub activity
        github_score = redrob_signals.get("github_activity_score", -1)
        if github_score >= 0:
            github_score = github_score / 100
        else:
            github_score = 0.3  # neutral if not linked
        
        # Engagement metrics
        profile_views = redrob_signals.get("profile_views_received_30d", 0)
        saved_by_recruiters = redrob_signals.get("saved_by_recruiters_30d", 0)
        engagement_score = min((profile_views + saved_by_recruiters * 5) / 100, 1.0)
        
        final_score = (activity_score * 0.25 + open_to_work_score * 0.2 + 
                      response_score * 0.25 + notice_score * 0.15 + 
                      github_score * 0.1 + engagement_score * 0.05)
        
        details = {
            "days_since_active": days_since_active,
            "open_to_work": open_to_work,
            "response_rate": response_rate,
            "notice_period": notice_period,
            "github_score": github_score,
            "profile_views": profile_views
        }
        
        return final_score, details
    
    def calculate_composite_score(self, candidate: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """
        Calculate composite score for a candidate
        
        Returns:
            (composite_score, all_details)
        """
        # Calculate component scores
        skills_score, skills_details = self.score_skills_match(candidate)
        exp_score, exp_details = self.score_experience_match(candidate)
        profile_score, profile_details = self.score_profile_quality(candidate)
        signals_score, signals_details = self.score_behavioral_signals(candidate)
        
        # Apply weights
        composite = (
            skills_score * self.weights.get("skills_match", 0.4) +
            exp_score * self.weights.get("experience_match", 0.3) +
            profile_score * self.weights.get("profile_quality", 0.2) +
            signals_score * self.weights.get("behavioral_signals", 0.1)
        )
        
        all_details = {
            "skills": {"score": skills_score, **skills_details},
            "experience": {"score": exp_score, **exp_details},
            "profile": {"score": profile_score, **profile_details},
            "signals": {"score": signals_score, **signals_details},
            "composite": composite
        }
        
        return composite, all_details

