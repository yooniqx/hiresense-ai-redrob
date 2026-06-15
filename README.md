# HireSense AI 🎯

AI-powered candidate ranking system for the **INDIA.RUNS Data & AI Challenge**.

![HireSense AI](https://img.shields.io/badge/AI-Powered-orange)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm

### Installation

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Install Node.js dependencies
npm install

# 3. Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Running the Application

**Terminal 1 - Backend:**
```bash
python run.py
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on: http://localhost:5173

## 📊 Features

### 🎯 Intelligent Ranking
- **Multi-component scoring** (Skills 40%, Experience 30%, Profile 20%, Signals 10%)
- **Explainable AI** with detailed reasoning for each candidate
- **Honeypot detection** to identify suspicious profiles
- **100,000+ candidates** processed in minutes

### 💻 Modern UI
- **Dark theme** with warm color palette (red/orange/yellow)
- **Real-time dashboard** with statistics and activity feed
- **Interactive leaderboard** with search and filtering
- **Detailed candidate profiles** with AI explanations
- **Analytics dashboard** with score distributions

### 🔧 Technical Stack

**Backend:**
- Flask REST API
- Python data processing
- Multi-component scoring engine
- DOCX parsing for job descriptions

**Frontend:**
- React 19 + TypeScript
- TanStack Router & Query
- Vite build tool
- Tailwind CSS 4
- shadcn/ui components

## 📁 Project Structure

```
HireSense-AI/
├── backend/              # Python Flask API
│   ├── app.py           # Main API server
│   ├── config.py        # Configuration
│   └── services/        # Ranking services
├── src/                 # React frontend
│   ├── routes/          # Page components
│   ├── components/      # UI components
│   └── lib/api.ts       # API client
├── datasets/            # Challenge dataset
│   └── candidates.jsonl # 100K candidates
├── output/              # Generated rankings
│   └── ranked_candidates.csv
└── docs/                # Documentation
```

## 🎯 Ranking Algorithm

### Scoring Components

1. **Skills Match (40%)**
   - Required skills: Python, PyTorch, TensorFlow, ML, DL
   - Nice-to-have: JAX, MLOps, RAG, RLHF
   - Skill proficiency levels
   - Technology stack alignment

2. **Experience Match (30%)**
   - Optimal: 5-8 years
   - Relevant job titles
   - Company tier (FAANG, unicorns, startups)
   - Career progression

3. **Profile Signals (20%)**
   - Education quality (IIT, Stanford, MIT, etc.)
   - Location preferences
   - Profile completeness
   - Professional summary

4. **Behavioral Signals (10%)**
   - GitHub activity
   - StackOverflow reputation
   - Technical blog posts
   - Open-source contributions

### Honeypot Detection

Identifies suspicious profiles:
- Impossible skill combinations
- Unrealistic experience claims
- Inconsistent career timelines
- Duplicate profiles

## 📊 API Endpoints

```
GET  /api/candidates          # List all ranked candidates
GET  /api/candidates/:id      # Get candidate details
GET  /api/stats               # Dashboard statistics
GET  /api/activity            # Recent ranking activity
GET  /api/analytics           # Score distribution
GET  /api/job-description     # Job description
POST /api/rank                # Trigger ranking
```

## 📈 Output Format

**ranked_candidates.csv:**
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
- Validates against submission spec

## 🎨 UI Screenshots

### Dashboard
- Real-time statistics
- Top candidate highlight
- Recent activity feed

### Leaderboard
- Sortable rankings
- Search and filter
- Score breakdowns

### Candidate Details
- Complete profile view
- AI explanation
- Skills & experience analysis

### Analytics
- Score distribution
- Top skills
- Funnel metrics

## 🔧 Configuration

### Backend (`backend/config.py`)

```python
SCORING_WEIGHTS = {
    "skills": 0.40,
    "experience": 0.30,
    "profile": 0.20,
    "signals": 0.10
}

REQUIRED_SKILLS = [
    "python", "pytorch", "tensorflow",
    "machine learning", "deep learning"
]

OPTIMAL_EXPERIENCE = (5, 8)
```

### Frontend (`.env`)

```bash
VITE_API_URL=http://localhost:5000/api
```

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[FRONTEND_FIX_PLAN.md](FRONTEND_FIX_PLAN.md)** - Frontend architecture notes
- **[SUMMARY.md](SUMMARY.md)** - Project summary

## 🐛 Troubleshooting

**Backend not starting:**
- Check Python version: `python --version`
- Verify dataset path in `backend/config.py`
- Check port 5000 is available

**Frontend not connecting:**
- Verify backend is running on port 5000
- Check `.env` file exists with correct API_URL
- Clear browser cache

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📊 Performance

- **Dataset:** 100,000 candidates
- **Processing Time:** ~2-3 minutes
- **Memory Usage:** ~2GB RAM
- **API Response:** <100ms

## 🎯 Challenge Submission

This project is built for the **INDIA.RUNS Data & AI Challenge**.

**Submission includes:**
- ✅ Ranked candidate CSV (`output/ranked_candidates.csv`)
- ✅ Explainable AI scoring
- ✅ Professional UI
- ✅ Complete documentation
- ✅ Source code

## 🚀 Future Enhancements

- [ ] Resume upload and parsing
- [ ] Multiple job description support
- [ ] Custom ML model training
- [ ] Real-time WebSocket updates
- [ ] PDF/Excel export options
- [ ] Candidate comparison tool

## 📝 License

Built for INDIA.RUNS Data & AI Challenge

## 👨‍💻 Author

Created with ❤️ for the INDIA.RUNS Data & AI Challenge

---

**Note:** This is a challenge submission project. The frontend was originally built with Lovable and integrated with a custom Python backend for candidate ranking.