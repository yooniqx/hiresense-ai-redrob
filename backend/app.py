"""
Flask API for HireSense AI
"""
import logging
import json
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pathlib import Path

# Import services
from services.data_loader import DataLoader
from services.ranker import CandidateRanker
import config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, static_folder='../dist', static_url_path='')
CORS(app)

# Global state
data_loader = None
ranker = None
ranked_candidates = []
all_candidates = []


def initialize_system():
    """Initialize the ranking system"""
    global data_loader, ranker, ranked_candidates, all_candidates
    
    logger.info("Initializing HireSense AI system...")
    
    try:
        # Load candidates
        data_loader = DataLoader(config.CANDIDATES_FILE)
        candidates = data_loader.load_candidates()
        all_candidates = data_loader.preprocess_all()
        
        # Initialize ranker
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
        
        # Rank candidates if we have any
        if all_candidates:
            ranked_candidates = ranker.rank_candidates(all_candidates)
            # Save submission CSV
            ranker.save_submission_csv(config.RANKED_OUTPUT_FILE)
            logger.info(f"System initialized successfully with {len(ranked_candidates)} candidates")
        else:
            logger.info("System initialized with no candidates - ready to accept new candidates via API")
            
    except Exception as e:
        logger.warning(f"Could not load initial candidates: {e}")
        logger.info("System starting without pre-loaded candidates - candidates can be added via API")
        # Initialize empty state
        data_loader = DataLoader(config.CANDIDATES_FILE)
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
        all_candidates = []
        ranked_candidates = []


@app.route('/')
def index():
    """Serve the main frontend page"""
    return send_from_directory(app.static_folder or '../dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files and fallback to index.html for client-side routing"""
    static_folder = app.static_folder or '../dist'
    file_path = Path(static_folder) / path
    if file_path.exists() and file_path.is_file():
        return send_from_directory(static_folder, path)
    return send_from_directory(static_folder, 'index.html')


@app.route('/api/candidates')
def get_candidates():
    """Get all candidates in frontend format"""
    try:
        if not ranked_candidates:
            return jsonify([])
        
        # Transform backend data to frontend format
        candidates_list = []
        colors = ["#DC2626", "#F97316", "#FBBF24", "#EA580C", "#B91C1C", "#D97706"]
        
        for idx, c in enumerate(ranked_candidates):
            profile = c["candidate"]["profile"]
            score_details = c["score_details"]
            
            # Calculate component scores as percentages
            skills_match = int(score_details["skills"]["score"] * 100)
            experience_match = int(score_details["experience"]["score"] * 100)
            behavioral_fit = int(score_details["signals"]["score"] * 100)
            overall_score = int(c["score"] * 100)
            
            # Determine recommendation
            if overall_score >= 85:
                recommendation = "Strong Hire"
            elif overall_score >= 70:
                recommendation = "Hire"
            elif overall_score >= 55:
                recommendation = "Maybe"
            else:
                recommendation = "Pass"
            
            # Extract skills
            skills_list = [skill["name"] for skill in c["candidate"]["skills"][:10]]
            
            # Extract experience
            experience_list = []
            for job in c["candidate"]["career_history"][:3]:
                experience_list.append({
                    "company": job.get("company", "Unknown"),
                    "role": job.get("title", "Unknown"),
                    "period": f"{job.get('start_date', '')} — {job.get('end_date', 'Present')}",
                    "bullets": job.get("responsibilities", [])[:2]
                })
            
            # Extract education
            education_list = []
            for edu in c["candidate"]["education"][:2]:
                education_list.append({
                    "school": edu.get("institution", "Unknown"),
                    "degree": edu.get("degree", "Unknown"),
                    "year": str(edu.get("graduation_year", ""))
                })
            
            # Extract behavioral signals
            behavioral = []
            signals = c["candidate"].get("redrob_signals", {})
            if signals.get("github_activity"):
                behavioral.append("Active GitHub contributor")
            if signals.get("stackoverflow_reputation", 0) > 1000:
                behavioral.append("Strong StackOverflow presence")
            if signals.get("blog_posts"):
                behavioral.append("Technical writer")
            
            candidate_data = {
                "id": c["candidate_id"],
                "name": profile.get("anonymized_name", "Unknown"),
                "title": profile.get("current_title", "Unknown"),
                "location": profile.get("location", "Unknown"),
                "email": profile.get("email", f"{c['candidate_id']}@example.com"),
                "avatarColor": colors[idx % len(colors)],
                "score": overall_score,
                "skillsMatch": skills_match,
                "experienceMatch": experience_match,
                "behavioralFit": behavioral_fit,
                "recommendation": recommendation,
                "yearsExperience": profile.get("years_of_experience", 0),
                "skills": skills_list,
                "education": education_list,
                "experience": experience_list,
                "behavioral": behavioral,
                "strengths": c["reasoning"].split(". ")[:2],
                "gaps": [],
                "explanation": c["reasoning"]
            }
            
            candidates_list.append(candidate_data)
        
        return jsonify(candidates_list)
    
    except Exception as e:
        logger.error(f"Error in candidates endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/candidates/<candidate_id>')
def get_candidate_by_id(candidate_id):
    """Get single candidate in frontend format"""
    try:
        # Find candidate
        candidate_data = None
        for c in ranked_candidates:
            if c["candidate_id"] == candidate_id:
                candidate_data = c
                break
        
        if not candidate_data:
            return jsonify({"error": "Candidate not found"}), 404
        
        # Transform to frontend format (same as above)
        colors = ["#DC2626", "#F97316", "#FBBF24", "#EA580C", "#B91C1C", "#D97706"]
        profile = candidate_data["candidate"]["profile"]
        score_details = candidate_data["score_details"]
        
        skills_match = int(score_details["skills"]["score"] * 100)
        experience_match = int(score_details["experience"]["score"] * 100)
        behavioral_fit = int(score_details["signals"]["score"] * 100)
        overall_score = int(candidate_data["score"] * 100)
        
        if overall_score >= 85:
            recommendation = "Strong Hire"
        elif overall_score >= 70:
            recommendation = "Hire"
        elif overall_score >= 55:
            recommendation = "Maybe"
        else:
            recommendation = "Pass"
        
        skills_list = [skill["name"] for skill in candidate_data["candidate"]["skills"][:10]]
        
        experience_list = []
        for job in candidate_data["candidate"]["career_history"][:3]:
            experience_list.append({
                "company": job.get("company", "Unknown"),
                "role": job.get("title", "Unknown"),
                "period": f"{job.get('start_date', '')} — {job.get('end_date', 'Present')}",
                "bullets": job.get("responsibilities", [])[:2]
            })
        
        education_list = []
        for edu in candidate_data["candidate"]["education"][:2]:
            education_list.append({
                "school": edu.get("institution", "Unknown"),
                "degree": edu.get("degree", "Unknown"),
                "year": str(edu.get("graduation_year", ""))
            })
        
        behavioral = []
        signals = candidate_data["candidate"].get("redrob_signals", {})
        if signals.get("github_activity"):
            behavioral.append("Active GitHub contributor")
        if signals.get("stackoverflow_reputation", 0) > 1000:
            behavioral.append("Strong StackOverflow presence")
        if signals.get("blog_posts"):
            behavioral.append("Technical writer")
        
        result = {
            "id": candidate_data["candidate_id"],
            "name": profile.get("anonymized_name", "Unknown"),
            "title": profile.get("current_title", "Unknown"),
            "location": profile.get("location", "Unknown"),
            "email": profile.get("email", f"{candidate_data['candidate_id']}@example.com"),
            "avatarColor": colors[0],
            "score": overall_score,
            "skillsMatch": skills_match,
            "experienceMatch": experience_match,
            "behavioralFit": behavioral_fit,
            "recommendation": recommendation,
            "yearsExperience": profile.get("years_of_experience", 0),
            "skills": skills_list,
            "education": education_list,
            "experience": experience_list,
            "behavioral": behavioral,
            "strengths": candidate_data["reasoning"].split(". ")[:2],
            "gaps": [],
            "explanation": candidate_data["reasoning"]
        }
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in candidate details endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/stats')
def get_stats():
    """Get dashboard statistics"""
    try:
        if not ranked_candidates:
            return jsonify({"error": "System not initialized"}), 500
        
        scores = [int(c["score"] * 100) for c in ranked_candidates]
        
        stats = {
            "totalCandidates": len(all_candidates),
            "rankedCandidates": len(ranked_candidates),
            "averageMatch": int(sum(scores) / len(scores)),
            "topCandidate": max(scores)
        }
        
        return jsonify(stats)
    
    except Exception as e:
        logger.error(f"Error in stats endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/activity')
def get_activity():
    """Get recent activity"""
    try:
        if not ranked_candidates:
            return jsonify([])
        
        # Generate activity from top candidates
        activity = []
        for idx, c in enumerate(ranked_candidates[:5]):
            activity.append({
                "who": c["candidate"]["profile"].get("anonymized_name", "Unknown"),
                "action": f"ranked #{idx + 1} for",
                "role": config.JOB_TITLE,
                "time": f"{idx * 2}m ago",
                "score": int(c["score"] * 100)
            })
        
        return jsonify(activity)
    
    except Exception as e:
        logger.error(f"Error in activity endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/job-description')
def get_job_description():
    """Get job description"""
    try:
        job_desc = {
            "title": config.JOB_TITLE,
            "department": "Engineering",
            "location": "Remote / Hybrid",
            "type": "Full-time",
            "description": "We're hiring a Senior Machine Learning Engineer to lead the development of our production LLM-powered features. You'll work across the stack — from training and fine-tuning models to deploying low-latency inference at scale.",
            "responsibilities": [
                "Lead development of production LLM-powered features",
                "Train and fine-tune machine learning models",
                "Deploy low-latency inference systems at scale",
                "Work with distributed systems and MLOps tooling",
                "Collaborate with cross-functional teams",
                "Mentor junior engineers and contribute to technical documentation"
            ],
            "requirements": {
                "required_skills": config.REQUIRED_SKILLS[:10],
                "preferred_skills": config.NICE_TO_HAVE_SKILLS,
                "min_experience": config.MIN_EXPERIENCE,
                "education": [
                    "Bachelor's or Master's degree in Computer Science, Engineering, or related field",
                    "PhD preferred but not required"
                ]
            },
            "benefits": [
                "Competitive salary and equity",
                "Remote-first work environment",
                "Health insurance and wellness benefits",
                "Professional development budget",
                "Flexible working hours"
            ]
        }
        
        return jsonify(job_desc)
    
    except Exception as e:
        logger.error(f"Error in job description endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/rank', methods=['POST'])
def trigger_rank():
    """Trigger ranking process"""
    try:
        initialize_system()
        return jsonify({
            "message": "Ranking completed successfully",
            "count": len(ranked_candidates)
        })
    
    except Exception as e:
        logger.error(f"Error in rank endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/analytics')
def get_analytics():
    """Get analytics data in frontend format"""
    try:
        if not ranked_candidates:
            return jsonify({"error": "System not initialized"}), 500
        
        # Score distribution buckets
        score_buckets = [
            {"range": "90-100", "label": "Top tier", "count": 0},
            {"range": "80-89", "label": "Strong", "count": 0},
            {"range": "70-79", "label": "Good", "count": 0},
            {"range": "60-69", "label": "Fair", "count": 0},
            {"range": "<60", "label": "Below bar", "count": 0}
        ]
        
        for c in ranked_candidates:
            score = int(c["score"] * 100)
            if score >= 90:
                score_buckets[0]["count"] += 1
            elif score >= 80:
                score_buckets[1]["count"] += 1
            elif score >= 70:
                score_buckets[2]["count"] += 1
            elif score >= 60:
                score_buckets[3]["count"] += 1
            else:
                score_buckets[4]["count"] += 1
        
        # Top skills
        skills_count = {}
        for candidate in ranked_candidates[:100]:
            for skill in candidate["candidate"]["skills"]:
                skill_name = skill["name"]
                skills_count[skill_name] = skills_count.get(skill_name, 0) + 1
        
        top_skills = [
            {"name": name, "count": count}
            for name, count in sorted(skills_count.items(), key=lambda x: x[1], reverse=True)[:10]
        ]
        
        # Funnel data
        funnel = [
            {"label": "Sourced", "count": len(all_candidates), "tone": "default"},
            {"label": "Parsed", "count": len(all_candidates), "tone": "amber"},
            {"label": "Ranked", "count": len(ranked_candidates), "tone": "flame"},
            {"label": "Shortlist", "count": len([c for c in ranked_candidates if c["score"] >= 0.85]), "tone": "ember"}
        ]
        
        analytics_data = {
            "scoreDistribution": score_buckets,
            "topSkills": top_skills,
            "funnel": funnel
        }
        
        return jsonify(analytics_data)
    
    except Exception as e:
        logger.error(f"Error in analytics endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/dashboard')
def get_dashboard():
    """Get dashboard overview data"""
    try:
        if not ranked_candidates:
            return jsonify({
                "totalCandidates": 0,
                "rankedCandidates": 0,
                "averageMatch": 0,
                "topCandidate": 0
            })
        
        # Calculate statistics
        total_candidates = len(all_candidates)
        top_10 = ranked_candidates[:10]
        
        # Score distribution
        score_ranges = {
            "0.8-1.0": 0,
            "0.6-0.8": 0,
            "0.4-0.6": 0,
            "0.2-0.4": 0,
            "0.0-0.2": 0
        }
        
        for candidate in ranked_candidates:
            score = candidate["score"]
            if score >= 0.8:
                score_ranges["0.8-1.0"] += 1
            elif score >= 0.6:
                score_ranges["0.6-0.8"] += 1
            elif score >= 0.4:
                score_ranges["0.4-0.6"] += 1
            elif score >= 0.2:
                score_ranges["0.2-0.4"] += 1
            else:
                score_ranges["0.0-0.2"] += 1
        
        # Location distribution
        location_dist = {}
        for candidate in ranked_candidates[:50]:
            loc = candidate["candidate"]["profile"].get("location", "Unknown")
            location_dist[loc] = location_dist.get(loc, 0) + 1
        
        # Top locations
        top_locations = sorted(location_dist.items(), key=lambda x: x[1], reverse=True)[:5]
        
        dashboard_data = {
            "total_candidates": total_candidates,
            "ranked_candidates": len(ranked_candidates),
            "avg_score": sum(c["score"] for c in ranked_candidates) / len(ranked_candidates),
            "top_score": ranked_candidates[0]["score"] if ranked_candidates else 0,
            "score_distribution": score_ranges,
            "top_locations": dict(top_locations),
            "top_10_preview": [
                {
                    "rank": c["rank"],
                    "candidate_id": c["candidate_id"],
                    "name": c["candidate"]["profile"].get("anonymized_name"),
                    "title": c["candidate"]["profile"].get("current_title"),
                    "score": c["score"],
                    "location": c["candidate"]["profile"].get("location")
                }
                for c in top_10
            ]
        }
        
        return jsonify(dashboard_data)
    
    except Exception as e:
        logger.error(f"Error in dashboard endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/leaderboard')
def get_leaderboard():
    """Get full leaderboard"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        start = (page - 1) * per_page
        end = start + per_page
        
        leaderboard_data = [
            {
                "rank": c["rank"],
                "candidate_id": c["candidate_id"],
                "name": c["candidate"]["profile"].get("anonymized_name"),
                "title": c["candidate"]["profile"].get("current_title"),
                "company": c["candidate"]["profile"].get("current_company"),
                "location": c["candidate"]["profile"].get("location"),
                "experience": c["candidate"]["profile"].get("years_of_experience"),
                "score": c["score"],
                "reasoning": c["reasoning"],
                "skills_score": c["score_details"]["skills"]["score"],
                "experience_score": c["score_details"]["experience"]["score"],
                "profile_score": c["score_details"]["profile"]["score"],
                "signals_score": c["score_details"]["signals"]["score"]
            }
            for c in ranked_candidates[start:end]
        ]
        
        return jsonify({
            "total": len(ranked_candidates),
            "page": page,
            "per_page": per_page,
            "candidates": leaderboard_data
        })
    
    except Exception as e:
        logger.error(f"Error in leaderboard endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/candidate/<candidate_id>')
def get_candidate_details(candidate_id):
    """Get detailed candidate information"""
    try:
        # Find candidate in ranked list
        candidate_data = None
        for c in ranked_candidates:
            if c["candidate_id"] == candidate_id:
                candidate_data = c
                break
        
        if not candidate_data:
            return jsonify({"error": "Candidate not found"}), 404
        
        candidate = candidate_data["candidate"]
        
        details = {
            "rank": candidate_data["rank"],
            "candidate_id": candidate_id,
            "score": candidate_data["score"],
            "reasoning": candidate_data["reasoning"],
            "profile": candidate["profile"],
            "career_history": candidate["career_history"],
            "education": candidate["education"],
            "skills": candidate["skills"],
            "certifications": candidate["certifications"],
            "languages": candidate["languages"],
            "redrob_signals": candidate["redrob_signals"],
            "score_breakdown": candidate_data["score_details"]
        }
        
        return jsonify(details)
    
    except Exception as e:
        logger.error(f"Error in candidate details endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/search')
def search_candidates():
    """Search candidates by name or ID"""
    try:
        query = request.args.get('q', '').lower()
        
        if not query:
            return jsonify({"results": []})
        
        results = []
        for c in ranked_candidates:
            candidate_id = c["candidate_id"].lower()
            name = c["candidate"]["profile"].get("anonymized_name", "").lower()
            
            if query in candidate_id or query in name:
                results.append({
                    "rank": c["rank"],
                    "candidate_id": c["candidate_id"],
                    "name": c["candidate"]["profile"].get("anonymized_name"),
                    "title": c["candidate"]["profile"].get("current_title"),
                    "score": c["score"]
                })
        
        return jsonify({"results": results[:10]})
    
    except Exception as e:
        logger.error(f"Error in search endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/candidates/add', methods=['POST'])
def add_candidate():
    """Add a new candidate and score them"""
    try:
        global ranked_candidates, all_candidates
        
        candidate_data = request.json
        
        if not candidate_data:
            return jsonify({"error": "No candidate data provided"}), 400
        
        # Generate unique candidate ID
        import random
        candidate_id = f"CAND_{random.randint(1000000, 9999999)}"
        candidate_data["candidate_id"] = candidate_id
        
        # Preprocess the new candidate
        from datetime import datetime
        
        # Calculate days since active
        last_active = candidate_data.get("redrob_signals", {}).get("last_active_date")
        if last_active:
            last_active_date = datetime.strptime(last_active, "%Y-%m-%d")
            days_since_active = (datetime.now() - last_active_date).days
            candidate_data["days_since_active"] = days_since_active
        else:
            candidate_data["days_since_active"] = 0
        
        # Score the new candidate
        if not ranker:
            return jsonify({"error": "Ranking system not initialized"}), 500
        
        # Use the ranker's scoring method (handles both semantic and basic scoring)
        composite_score, score_details = ranker.scorer.calculate_semantic_score(candidate_data) if ranker.use_semantic else ranker.scorer.calculate_composite_score(candidate_data)  # type: ignore
        
        # Create ranked entry
        rank_entry = {
            "candidate_id": candidate_id,
            "candidate": candidate_data,
            "score": composite_score,
            "score_details": score_details,
            "rank": 0  # Will be updated after re-ranking
        }
        
        # Add to all_candidates
        all_candidates.append(candidate_data)
        
        # Re-rank all candidates including the new one
        all_scored = []
        for c in all_candidates:
            cid = c.get("candidate_id")
            try:
                if not ranker:
                    continue
                
                # Use the ranker's scoring method
                comp_score, details = ranker.scorer.calculate_semantic_score(c) if ranker.use_semantic else ranker.scorer.calculate_composite_score(c)  # type: ignore
                
                all_scored.append({
                    "candidate_id": cid,
                    "candidate": c,
                    "score": comp_score,
                    "score_details": details,
                    "rounded_score": round(comp_score, 4)
                })
            except Exception as e:
                logger.error(f"Error scoring candidate {cid}: {e}")
                continue
        
        # Sort and take top 100
        all_scored.sort(key=lambda x: (-x["rounded_score"], x["candidate_id"]))
        top_100 = all_scored[:100]
        
        # Update ranks and reasoning
        new_ranked = []
        new_candidate_rank = None
        for rank, item in enumerate(top_100, start=1):
            reasoning = ""
            if ranker and hasattr(ranker, 'generate_reasoning'):
                reasoning = ranker.generate_reasoning(
                    item["candidate"],
                    item["score_details"],
                    rank
                )
            
            entry = {
                "rank": rank,
                "candidate_id": item["candidate_id"],
                "score": item["score"],
                "reasoning": reasoning,
                "candidate": item["candidate"],
                "score_details": item["score_details"]
            }
            
            new_ranked.append(entry)
            
            if item["candidate_id"] == candidate_id:
                new_candidate_rank = rank
        
        # Update global ranked_candidates
        ranked_candidates = new_ranked
        
        # Save updated rankings
        if ranker and hasattr(ranker, 'save_submission_csv'):
            ranker.ranked_candidates = ranked_candidates
            ranker.save_submission_csv(config.RANKED_OUTPUT_FILE)
        
        # Return result
        result = {
            "success": True,
            "candidate_id": candidate_id,
            "score": int(composite_score * 100),
            "rank": new_candidate_rank,
            "total_candidates": len(all_candidates),
            "message": f"Candidate added and ranked #{new_candidate_rank} out of {len(all_candidates)} candidates"
        }
        
        logger.info(f"New candidate {candidate_id} added with score {composite_score:.4f}, rank #{new_candidate_rank}")
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error adding candidate: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Initialize system on startup
    initialize_system()
    
    # Run Flask app
    app.run(
        host=config.FLASK_HOST,
        port=config.FLASK_PORT,
        debug=config.FLASK_DEBUG
    )

