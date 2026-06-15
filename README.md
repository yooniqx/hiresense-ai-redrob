# HireSense AI

> AI-powered candidate ranking system for the INDIA.RUNS Data & AI Challenge

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Overview

HireSense AI is an intelligent candidate ranking system that processes 100,000+ candidate profiles and ranks them against job requirements using explainable AI. Built for the INDIA.RUNS Data & AI Challenge, it combines a powerful Python backend with a modern React frontend.

### Key Features

- **🎯 Multi-Component Scoring**: Skills (40%), Experience (30%), Profile (20%), Behavioral Signals (10%)
- **🧠 Explainable AI**: Detailed reasoning for each candidate ranking
- **🔍 Honeypot Detection**: Identifies suspicious or impossible profiles
- **📊 Real-time Dashboard**: Live statistics and activity monitoring
- **🎨 Modern UI**: Dark theme with professional design
- **⚡ Fast Processing**: Ranks 100K candidates in minutes

## Tech Stack

### Backend
- **Python 3.8+** - Core language
- **Flask** - REST API framework
- **pandas** - Data processing
- **python-docx** - Document parsing

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **TanStack Router** - Client-side routing
- **TanStack Query** - Data fetching
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library

## Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn

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
│   ├── routes/                # Page components
│   │   ├── index.tsx          # Dashboard
│   │   ├── results.tsx        # Candidate leaderboard
│   │   ├── candidates.$id.tsx # Candidate details
│   │   └── analytics.tsx      # Analytics dashboard
│   ├── components/            # UI components
│   │   ├── ui/                # shadcn/ui components
│   │   └── ui-kit.tsx         # Custom components
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

### Candidate Endpoints
- `GET /api/candidates` - List all ranked candidates
- `GET /api/candidates/:id` - Get single candidate details
- `GET /api/stats` - Dashboard statistics
- `GET /api/activity` - Recent ranking activity
- `GET /api/analytics` - Score distribution and insights
- `GET /api/job-description` - Job description text
- `POST /api/rank` - Trigger ranking process

### Response Format

```json
{
  "id": "c001",
  "name": "John Doe",
  "title": "Senior ML Engineer",
  "location": "San Francisco, CA",
  "score": 92,
  "skillsMatch": 95,
  "experienceMatch": 88,
  "behavioralFit": 85,
  "recommendation": "Strong Hire",
  "skills": ["Python", "PyTorch", "LLMs"],
  "explanation": "Strong technical background with relevant experience..."
}
```

## Ranking Algorithm

### Scoring Components

1. **Skills Match (40%)**
   - Required skills: Python, PyTorch, TensorFlow, Machine Learning, Deep Learning
   - Nice-to-have: JAX, MLOps, RAG, RLHF
   - Skill proficiency levels
   - Technology stack alignment

2. **Experience Match (30%)**
   - Optimal range: 5-8 years
   - Relevant job titles and roles
   - Company tier (FAANG, unicorns, startups)
   - Career progression patterns

3. **Profile Signals (20%)**
   - Education quality (IIT, Stanford, MIT, etc.)
   - Location preferences
   - Profile completeness
   - Professional summary quality

4. **Behavioral Signals (10%)**
   - GitHub activity and contributions
   - StackOverflow reputation
   - Technical blog posts
   - Open-source contributions

### Recommendation Levels

- **Strong Hire** (85-100%): Exceptional match, immediate interview
- **Hire** (70-84%): Strong match, recommend interview
- **Maybe** (55-69%): Potential match, consider for interview
- **Pass** (<55%): Not a strong match for this role

### Honeypot Detection

Identifies suspicious profiles with:
- Impossible skill combinations
- Unrealistic experience claims
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

# Generate rankings only
python generate_ranking.py
```

### Frontend Development

```bash
# Development server with hot reload
npm run dev

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

### Frontend Issues

**API connection failed:**
- Ensure backend is running on port 5000
- Check `.env` file has correct API_URL
- Verify CORS is enabled in backend

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Performance

- **Dataset Size**: 100,000 candidates
- **Processing Time**: ~2-3 minutes (initial ranking)
- **Memory Usage**: ~2GB RAM
- **API Response Time**: <100ms per request

## Contributing

This project was built for the INDIA.RUNS Data & AI Challenge. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **INDIA.RUNS** for organizing the Data & AI Challenge
- **Lovable** for the initial UI design
- **shadcn/ui** for the component library
- **TanStack** for Router and Query libraries

## Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for the INDIA.RUNS Data & AI Challenge