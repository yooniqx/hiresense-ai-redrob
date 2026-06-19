"""
Configuration settings for HireSense AI
"""
import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).parent.parent
DATASET_DIR = BASE_DIR / "datasets" / "[PUB] India_runs_data_and_ai_challenge" / "India_runs_data_and_ai_challenge"
DATA_DIR = BASE_DIR / "backend" / "data"
OUTPUT_DIR = BASE_DIR / "output"

# Dataset files
CANDIDATES_FILE = DATA_DIR / "candidates.json"
JOB_DESCRIPTION_FILE = DATASET_DIR / "job_description.docx"
CANDIDATE_SCHEMA_FILE = DATASET_DIR / "candidate_schema.json"
SAMPLE_CANDIDATES_FILE = DATASET_DIR / "sample_candidates.json"

# Output files
RANKED_OUTPUT_FILE = OUTPUT_DIR / "ranked_candidates.csv"
PROCESSED_DATA_FILE = OUTPUT_DIR / "processed_candidates.json"

# Scoring weights
SCORING_WEIGHTS = {
    "skills_match": 0.40,
    "experience_match": 0.30,
    "profile_quality": 0.20,
    "behavioral_signals": 0.10
}

# Job details
JOB_TITLE = "Senior Machine Learning Engineer"

# Job requirements (extracted from JD)
REQUIRED_SKILLS = [
    "embeddings", "vector database", "pinecone", "weaviate", "qdrant", "milvus",
    "faiss", "elasticsearch", "opensearch", "python", "retrieval", "ranking",
    "ndcg", "mrr", "map", "sentence-transformers", "bge", "e5"
]

NICE_TO_HAVE_SKILLS = [
    "llm", "fine-tuning", "lora", "qlora", "peft", "learning-to-rank",
    "xgboost", "hr-tech", "recruiting", "marketplace"
]

DISQUALIFYING_KEYWORDS = [
    "consulting", "tcs", "infosys", "wipro", "accenture", "cognizant", "capgemini"
]

# Experience requirements
MIN_EXPERIENCE = 5
MAX_EXPERIENCE = 9
OPTIMAL_EXPERIENCE = 7

# Location preferences
PREFERRED_LOCATIONS = ["pune", "noida", "delhi", "ncr", "gurgaon", "gurugram"]
TIER_1_CITIES = ["bangalore", "mumbai", "hyderabad", "chennai", "kolkata"]

# Behavioral signal thresholds
MIN_RESPONSE_RATE = 0.3
MIN_PROFILE_COMPLETENESS = 70
MAX_NOTICE_PERIOD = 90  # days
RECENT_ACTIVITY_DAYS = 60

# Flask configuration
FLASK_HOST = "0.0.0.0"
FLASK_PORT = int(os.environ.get("PORT", 5000))
FLASK_DEBUG = os.environ.get("FLASK_DEBUG", "False").lower() == "true"

# Create directories if they don't exist
OUTPUT_DIR.mkdir(exist_ok=True)
DATA_DIR.mkdir(exist_ok=True)

