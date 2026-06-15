# HireSense AI - Deployment Guide

## Project Overview

HireSense AI is an AI-powered candidate ranking system built for the INDIA.RUNS Data & AI Challenge. It processes 100,000+ candidate profiles and ranks them against a job description using explainable AI scoring.

## Architecture

```
HireSense-AI/
├── backend/                 # Python Flask API
│   ├── app.py              # Main API server with endpoints
│   ├── config.py           # Configuration and job requirements
│   └── services/           # Core ranking services
│       ├── data_loader.py  # Data preprocessing
│       ├── scorer.py       # Multi-component scoring engine
│       ├── ranker.py       # Ranking pipeline
│       └── honeypot_detector.py  # Profile validation
├── src/                    # React/TypeScript frontend (Lovable)
│   ├── routes/             # Page components
│   ├── components/         # UI components
│   └── lib/
│       └── api.ts          # Backend API client
├── datasets/               # Challenge dataset
│   └── [PUB] India_runs_data_and_ai_challenge/
│       └── India_runs_data_and_ai_challenge/
│           ├── candidates.jsonl  # 100K candidates
│           ├── job_description.docx
│           └── candidate_schema.json
├── output/                 # Generated rankings
│   └── ranked_candidates.csv
└── temp_repo/              # Original Lovable repo (can be deleted)
```

## Technology Stack

### Backend
- **Python 3.8+**
- **Flask** - REST API framework
- **Flask-CORS** - Cross-origin resource sharing
- **python-docx** - Document parsing
- **pandas** - Data processing

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **TanStack Router** - Routing
- **TanStack Query** - Data fetching
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library

## Ranking Algorithm

### Scoring Components (Weighted)

1. **Skills Match (40%)**
   - Required skills matching
   - Nice-to-have skills
   - Skill proficiency levels
   - Technology stack alignment

2. **Experience Match (30%)**
   - Years of experience (optimal: 5-8 years)
   - Relevant job titles
   - Company tier (FAANG, startups, etc.)
   - Career progression

3. **Profile Signals (20%)**
   - Education quality
   - Location preferences
   - Profile completeness
   - Professional summary

4. **Behavioral Signals (10%)**
   - GitHub activity
   - StackOverflow reputation
   - Blog posts
   - Open-source contributions

### Honeypot Detection

Identifies suspicious profiles with:
- Impossible skill combinations
- Unrealistic experience claims
- Inconsistent timelines
- Duplicate profiles

## Installation

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or bun

### Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Verify dataset location
ls datasets/[PUB]\ India_runs_data_and_ai_challenge/India_runs_data_and_ai_challenge/
```

### Frontend Setup

```bash
# Install Node.js dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
python run.py
```
- Backend runs on: http://localhost:5000
- API endpoints: http://localhost:5000/api/*

**Terminal 2 - Frontend:**
```bash
npm run dev
```
- Frontend runs on: http://localhost:5173

### Production Build

```bash
# Build frontend
npm run build

# Run backend (serves built frontend)
python run.py
```

## API Endpoints

### Candidate Endpoints
- `GET /api/candidates` - List all ranked candidates
- `GET /api/candidates/:id` - Get candidate details
- `GET /api/stats` - Dashboard statistics
- `GET /api/activity` - Recent ranking activity
- `GET /api/analytics` - Score distribution and insights
- `GET /api/job-description` - Job description text
- `POST /api/rank` - Trigger ranking process

### Response Format

**Candidate Object:**
```json
{
  "id": "c001",
  "name": "John Doe",
  "title": "Senior ML Engineer",
  "location": "San Francisco, CA",
  "email": "john@example.com",
  "score": 92,
  "skillsMatch": 95,
  "experienceMatch": 88,
  "behavioralFit": 85,
  "recommendation": "Strong Hire",
  "yearsExperience": 7,
  "skills": ["Python", "PyTorch", "LLMs"],
  "education": [...],
  "experience": [...],
  "explanation": "..."
}
```

## Output Files

### ranked_candidates.csv
Located in `output/ranked_candidates.csv`

Format:
```csv
candidate_id,score
c001,0.9234
c002,0.8956
...
```

- Sorted by score (descending)
- Tie-breaking by candidate_id (ascending)
- Scores rounded to 4 decimal places
- Validates against submission requirements

## Configuration

### Backend Config (`backend/config.py`)

```python
# Scoring weights
SCORING_WEIGHTS = {
    "skills": 0.40,
    "experience": 0.30,
    "profile": 0.20,
    "signals": 0.10
}

# Required skills
REQUIRED_SKILLS = [
    "python", "pytorch", "tensorflow",
    "machine learning", "deep learning"
]

# Experience range
MIN_EXPERIENCE = 3
MAX_EXPERIENCE = 15
OPTIMAL_EXPERIENCE = (5, 8)
```

### Frontend Config (`.env`)

```bash
VITE_API_URL=http://localhost:5000/api
```

## Features

### Dashboard
- Real-time statistics
- Top candidate highlight
- Recent activity feed
- Score distribution

### Candidate Leaderboard
- Sortable rankings
- Search and filter
- Score breakdowns
- Recommendation tags

### Candidate Details
- Complete profile view
- AI explanation
- Skills analysis
- Experience timeline
- Education history
- Behavioral signals

### Analytics
- Score distribution charts
- Top skills analysis
- Funnel metrics
- Experience distribution

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change port in backend/config.py
FLASK_PORT = 5001
```

**Dataset not found:**
```bash
# Verify path in backend/config.py
CANDIDATES_FILE = "datasets/[PUB] India_runs_data_and_ai_challenge/India_runs_data_and_ai_challenge/candidates.jsonl"
```

### Frontend Issues

**API connection failed:**
- Check backend is running on port 5000
- Verify CORS is enabled
- Check `.env` file has correct API_URL

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Performance

- **Dataset Size:** 100,000 candidates
- **Processing Time:** ~2-3 minutes (initial ranking)
- **Memory Usage:** ~2GB RAM
- **API Response Time:** <100ms per request

## Security

- CORS enabled for local development
- No authentication (challenge requirement)
- Input validation on all endpoints
- Honeypot detection for data quality

## Future Enhancements

1. **Resume Upload:** Parse PDF/DOCX resumes
2. **Batch Processing:** Handle multiple job descriptions
3. **ML Model:** Train custom ranking model
4. **Real-time Updates:** WebSocket for live rankings
5. **Export Options:** PDF reports, Excel exports
6. **Candidate Comparison:** Side-by-side analysis

## Support

For issues or questions:
- Check logs in terminal output
- Review API responses in browser DevTools
- Verify dataset integrity
- Ensure all dependencies are installed

## License

Built for INDIA.RUNS Data & AI Challenge