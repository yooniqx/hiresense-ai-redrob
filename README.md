# HireSense AI

> Semantic AI-powered candidate ranking system for the INDIA.RUNS Data & AI Challenge

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🚀 Live Demo

**Deployed Application:** [https://hiresense-ai-redrob.onrender.com](https://hiresense-ai-redrob.onrender.com)

- ✅ Full-stack application with React frontend and Flask backend
- ✅ 10,000 candidates loaded and ranked in real-time
- ✅ Interactive dashboard, candidate search, and analytics
- ✅ Top 100 candidates ranked by semantic AI scoring

## Team Information

**Team Name:** Yooniq Forge

**Primary Contact:** Debopriya Bose (dbose0906@gmail.com)

**Team Members:**
- Debopriya Bose - Backend Development & AI Implementation
- Kumar Saket (exios343@gmail.com) - Frontend Ideation and Development

**Repository:** [https://github.com/yooniqx/hiresense-ai-redrob](https://github.com/yooniqx/hiresense-ai-redrob)

**Live Demo:** [https://hiresense-ai-redrob.onrender.com](https://hiresense-ai-redrob.onrender.com)

## Overview

HireSense AI is a semantic candidate ranking system that "reads between the lines" to identify truly qualified ML engineers. Unlike traditional keyword-matching systems, it analyzes career trajectories, technical depth, and behavioral signals to detect the job description's explicit trap of "candidates with AI keywords but non-technical roles."

Built for the INDIA.RUNS Data & AI Challenge by Team Yooniq Forge, combining advanced semantic analysis with a modern full-stack application.

## 🎯 Feature Status

### ✅ Fully Working Features

#### Backend (Python/Flask)
- ✅ **Semantic Scoring Engine** - Career Trajectory (35%), Technical Depth (35%), Behavioral Availability (20%), Location Fit (10%)
- ✅ **Contextual Analysis** - Detects keyword stuffing, validates technical roles, analyzes product company experience
- ✅ **Explainable AI Rankings** - Detailed reasoning for each candidate score
- ✅ **Honeypot Detection** - Identifies suspicious or impossible profiles
- ✅ **REST API** - 8 endpoints for candidate data and analytics
- ✅ **Data Processing** - Handles 100K+ candidates in ~2-3 minutes
- ✅ **CSV Export** - Generates ranked_candidates.csv in required format
- ✅ **Results** - 85% avg score (vs 76% with keyword matching), 96% top-10 avg

#### Frontend (React/TypeScript)
- ✅ **Dashboard** - Real-time statistics and activity monitoring
- ✅ **Candidate Search** - Search and filter candidates by name, skills, location
- ✅ **Candidate Details** - Comprehensive profile view with scoring breakdown
- ✅ **Results/Leaderboard** - Ranked candidate list with filtering
- ✅ **Analytics Dashboard** - Score distribution charts and insights
- ✅ **Job Description Viewer** - Display job requirements
- ✅ **Dark Theme UI** - Professional design with Tailwind CSS
- ✅ **Responsive Design** - Works on desktop and mobile

### ⚠️ Known Issues

#### Add Candidate Feature (Currently Not Working)
- ❌ **Form Submission Issue** - Page refreshes before API call completes
- ❌ **No Success Feedback** - Success message doesn't appear
- ❌ **Candidate Not Added** - New candidates don't persist in the system

**Technical Details:**
- Form validation works correctly
- API endpoint `/api/candidates/add` is functional on backend
- Issue is in frontend form submission handling
- Page navigation occurs before async API response is received

**Workaround:**
- Use the backend API directly via curl/Postman to add candidates
- Or manually add candidates to the `candidates.jsonl` file and restart backend

**Example API Call:**
```bash
curl -X POST http://localhost:5000/api/candidates/add \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "name": "John Doe",
      "headline": "Senior ML Engineer",
      "years_of_experience": 5
    },
    "skills": [
      {"name": "Python", "proficiency": "Expert"},
      {"name": "PyTorch", "proficiency": "Expert"},
      {"name": "Machine Learning", "proficiency": "Expert"}
    ]
  }'
```

## Tech Stack

### Backend
- **Python 3.8+** - Core language
- **Flask** - REST API framework with CORS support
- **pandas** - Data processing and analysis
- **python-docx** - Document parsing for job descriptions

### Frontend
- **React 19** - UI framework with hooks
- **TypeScript 5.8** - Type safety and better DX
- **TanStack Router** - Type-safe client-side routing
- **TanStack Query** - Server state management and caching
- **Vite** - Fast build tool with HMR
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Lucide React** - Icon library

## Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yooniqx/hiresense-ai-redrob.git
cd hiresense-ai-redrob

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Dataset Setup

**Important:** The large `candidates.jsonl` file (464MB) is not included in the repository due to GitHub's size limits.

1. Download the dataset from the INDIA.RUNS Data & AI Challenge
2. Place `candidates.jsonl` in: `datasets/[PUB] India_runs_data_and_ai_challenge/India_runs_data_and_ai_challenge/`

### Running the Application

**Terminal 1 - Start Backend:**
```bash
python run.py
```
Backend will run on: http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
Frontend will run on: http://localhost:5173

## Project Structure

```
hiresense-ai-redrob/
├── backend/                    # Python Flask API
│   ├── app.py                 # Main API server with 8 endpoints
│   ├── config.py              # Configuration and job requirements
│   └── services/              # Core ranking services
│       ├── data_loader.py     # Data preprocessing
│       ├── scorer.py          # Multi-component scoring engine
│       ├── ranker.py          # Ranking pipeline
│       └── honeypot_detector.py  # Profile validation
├── src/                       # React/TypeScript frontend
│   ├── routes/                # Page routes
│   │   ├── index.tsx          # Dashboard (✅ Working)
│   │   ├── results.tsx        # Leaderboard (✅ Working)
│   │   ├── candidates.index.tsx # Search (✅ Working)
│   │   ├── candidates.$id.tsx # Details (✅ Working)
│   │   ├── add-candidate.tsx  # Add Form (❌ Not Working)
│   │   ├── analytics.tsx      # Analytics (✅ Working)
│   │   └── job-description.tsx # Job Desc (✅ Working)
│   ├── pages/                 # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Results.tsx
│   │   ├── Candidates.tsx
│   │   ├── CandidateDetails.tsx
│   │   ├── AddCandidate.tsx   # ⚠️ Has form submission issue
│   │   ├── Analytics.tsx
│   │   └── JobDescription.tsx
│   ├── components/            # UI components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── ui-kit.tsx         # Custom components
│   │   ├── AppLayout.tsx      # Main layout
│   │   └── SupportChat.tsx    # Support widget
│   └── lib/
│       └── api.ts             # Backend API client
├── datasets/                  # Challenge dataset
│   └── [PUB] India_runs_data_and_ai_challenge/
│       └── India_runs_data_and_ai_challenge/
│           ├── candidates.jsonl      # 100K candidates (not in repo)
│           ├── job_description.docx  # Job requirements
│           └── candidate_schema.json # Data structure
├── output/                    # Generated rankings
│   └── ranked_candidates.csv # Final ranked output
├── package.json               # Node.js dependencies
├── requirements.txt           # Python dependencies
├── vite.config.ts            # Vite configuration
└── tsconfig.json             # TypeScript configuration
```

## API Endpoints

### Candidate Management
- `GET /api/candidates` - List all ranked candidates with pagination
- `GET /api/candidates/:id` - Get single candidate details with full profile
- `POST /api/candidates/add` - Add new candidate (⚠️ Frontend integration broken)
- `GET /api/candidates/search?q=query` - Search candidates by name/skills

### Analytics & Stats
- `GET /api/stats` - Dashboard statistics (total candidates, avg score, etc.)
- `GET /api/activity` - Recent ranking activity feed
- `GET /api/analytics` - Score distribution and insights
- `GET /api/job-description` - Job description text

### Ranking
- `POST /api/rank` - Trigger full ranking process for all candidates

### Response Format

```json
{
  "candidate_id": "c001",
  "name": "John Doe",
  "current_role": "Senior ML Engineer",
  "location": "San Francisco, CA",
  "score": 92.34,
  "rank": 1,
  "skills_match": 95,
  "experience_match": 88,
  "profile_score": 90,
  "behavioral_fit": 85,
  "recommendation": "Strong Hire",
  "skills": ["Python", "PyTorch", "LLMs"],
  "experience_years": 5,
  "explanation": "Strong technical background with relevant experience..."
}
```

## Ranking Algorithm

### Semantic Scoring Approach

**Key Innovation:** Replaced keyword matching with contextual analysis to detect the JD's explicit trap of "candidates with AI keywords but non-technical roles."

### Four-Component Semantic Scoring

1. **Career Trajectory Analysis (35%)**
   - Analyzes product company experience vs consulting backgrounds
   - Tracks ML role progression and career growth
   - Disqualifies consulting-only backgrounds (TCS, Infosys, Wipro, Accenture, etc.)
   - Evaluates genuine ML/AI career development
   - Detects title hopping and inconsistent career paths

2. **Technical Depth Verification (35%)**
   - Verifies technical roles vs non-technical positions
   - Detects keyword stuffing and fake profiles
   - Evaluates depth in: embeddings, vector databases, retrieval, evaluation
   - Validates hands-on experience with: Pinecone, Weaviate, Qdrant, FAISS
   - Assesses ranking metrics knowledge: NDCG, MRR, MAP

3. **Behavioral Availability (20%)**
   - Down-weights inactive candidates (6+ months since last activity)
   - Considers response rates and engagement levels
   - Evaluates notice periods and availability
   - Analyzes profile completeness and quality

4. **Location Fit (10%)**
   - Preferred: Pune, Noida, Delhi NCR, Gurgaon
   - Tier-1 cities welcome: Bangalore, Mumbai, Hyderabad, Chennai
   - Relocation bonus for strong candidates

### Recommendation Levels

- **Strong Hire** (85-100%): Exceptional match, immediate interview
- **Hire** (70-84%): Strong match, recommend interview
- **Maybe** (55-69%): Potential match, consider for interview
- **Pass** (<55%): Not a strong match for this role

### Honeypot Detection

Identifies suspicious profiles with:
- Impossible skill combinations
- Unrealistic experience claims (e.g., 20 years of experience at age 25)
- Inconsistent career timelines
- Duplicate or fake profiles

## Output Format

The system generates `output/ranked_candidates.csv` in the required format:

```csv
candidate_id,score
c001,0.9234
c002,0.8956
c003,0.8745
...
```

- Sorted by score (descending)
- Tie-breaking by candidate_id (ascending)
- Scores rounded to 4 decimal places
- Validates against submission requirements

## Configuration

### Backend Configuration

Edit `backend/config.py` to customize:

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

### Frontend Configuration

Create `.env` file:

```bash
VITE_API_URL=http://localhost:5000/api
```

## Development

### Backend Development

```bash
# Run with auto-reload
python run.py

# Generate rankings only (no server)
python generate_ranking.py

# Test API endpoints
curl http://localhost:5000/api/stats
```

### Frontend Development

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Backend Issues

**Port already in use:**
```python
# Change port in backend/config.py
FLASK_PORT = 5001
```

**Dataset not found:**
- Verify `candidates.jsonl` is in the correct location
- Check path in `backend/config.py`
- File should be 464MB in size

**CORS errors:**
- Backend has CORS enabled by default
- Check `flask_cors` is installed: `pip install flask-cors`

### Frontend Issues

**API connection failed:**
- Ensure backend is running on port 5000
- Check `.env` file has correct `VITE_API_URL`
- Verify CORS is enabled in backend
- Check browser console for detailed errors

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Regenerate route types
npm run type-check
```

### Add Candidate Issue

**Current Status:** Form submission causes page refresh before API completes

**Attempted Fixes:**
- Added `e.preventDefault()` to form handler
- Changed button type from `submit` to `button`
- Added inline preventDefault to form element
- Extensive logging added for debugging

**Next Steps for Fix:**
- Remove form element entirely, use div container
- Or investigate TanStack Router navigation behavior
- Or implement with React Hook Form for better control

## Performance

- **Dataset Size**: 100,000 candidates
- **Processing Time**: ~2-3 minutes (initial ranking)
- **Memory Usage**: ~2GB RAM
- **API Response Time**: <100ms per request
- **Frontend Load Time**: <2s initial load
- **Search Performance**: Real-time filtering of 100K records

## Testing

### Backend Testing
```bash
# Test ranking algorithm
python -c "from backend.services.ranker import rank_candidates; print('OK')"

# Test API endpoints
curl http://localhost:5000/api/stats
curl http://localhost:5000/api/candidates?limit=10
```

### Frontend Testing
```bash
# Type checking
npm run type-check

# Build test
npm run build
```

## Contributing

This project was built for the INDIA.RUNS Data & AI Challenge. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Priority Issues to Fix
1. **Add Candidate Form** - Fix form submission and page refresh issue
2. **Real-time Updates** - Add WebSocket support for live ranking updates
3. **Bulk Import** - Add CSV/JSON bulk candidate import
4. **Export Features** - Add PDF/Excel export for candidate reports

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## AI Tools Used

This project was developed with assistance from:
- **IBM Bob** - AI coding assistant for architecture, implementation, code review, and documentation
- **ChatGPT** - Prompt structuring and requirements analysis
- **Lovable** - Initial UI/UX prototype design and frontend mockups
- **GitHub Copilot** - Code autocomplete and boilerplate generation

**Important:** No candidate data was fed to any LLM. All ranking logic is deterministic and runs locally without network access.

## Acknowledgments

- **INDIA.RUNS** for organizing the Data & AI Challenge
- **Redrob AI** for the challenge dataset and requirements
- **shadcn/ui** for the excellent component library
- **TanStack** for Router and Query libraries
- **Vite** for the blazing fast build tool

## Contact

**Team Yooniq Forge**
- Primary Contact: Debopriya Bose (dbose0906@gmail.com)
- Repository: https://github.com/yooniqx/hiresense-ai-redrob
- For questions or support: Open an issue on GitHub

---

Built with ❤️ by Team Yooniq Forge for the INDIA.RUNS Data & AI Challenge

**Last Updated:** June 19, 2026