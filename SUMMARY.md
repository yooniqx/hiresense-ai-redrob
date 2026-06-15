# HireSense AI - Project Summary

## 🎯 Project Overview

**HireSense AI** is an intelligent candidate ranking system built for the INDIA.RUNS Data & AI Challenge. It processes 100,000 candidate profiles and ranks them against a Senior AI Engineer job description using explainable multi-component scoring.

---

## ✅ Completed Components

### 1. Backend System
- **Data Loader**: Loads and preprocesses 100K candidates from JSONL format
- **Honeypot Detector**: Identifies candidates with impossible/inconsistent profiles
- **Multi-Component Scorer**: 
  - Skills Match (40%): Core AI/ML skills, proficiency, endorsements
  - Experience Match (30%): Years, titles, company type, stability
  - Profile Quality (20%): Location, education tier, completeness
  - Behavioral Signals (10%): Activity, response rate, engagement
- **Ranker**: Generates top 100 ranked candidates with reasoning
- **Flask API**: RESTful endpoints for dashboard, leaderboard, analytics

### 2. Frontend Application
- **Dark Theme**: Professional UI with warm red/orange/yellow palette
- **Dashboard**: Overview stats, top 10 preview, score distribution
- **Leaderboard**: Paginated table with all 100 ranked candidates
- **Candidate Details**: Modal with complete profile and score breakdown
- **Analytics**: Skills distribution, experience ranges, score components
- **Search**: Real-time candidate search by name or ID

### 3. Output Files
- **ranked_candidates.csv**: Submission-ready CSV with 100 ranked candidates
- Format: `candidate_id,rank,score,reasoning`
- Validated against competition requirements

---

## 🔧 Technical Stack

**Backend:**
- Python 3.13
- Flask 3.1.0 (Web framework)
- pandas 3.0.3 (Data processing)
- scikit-learn 1.9.0 (ML utilities)
- python-docx 1.2.0 (Document parsing)

**Frontend:**
- Vanilla JavaScript (No frameworks)
- CSS3 with custom dark theme
- Fetch API for async data loading

---

## 📊 Ranking Algorithm

### Composite Score Formula
```
Score = (Skills × 0.40) + (Experience × 0.30) + (Profile × 0.20) + (Signals × 0.10)
```

### Key Features
1. **Explainable**: Every candidate has human-readable reasoning
2. **Honeypot-Aware**: Automatically filters impossible profiles
3. **Behavioral-Informed**: Active, responsive candidates ranked higher
4. **Location-Sensitive**: Prefers Pune/Noida, accepts Tier-1 cities
5. **Experience-Optimized**: 5-9 years range, 7 years ideal

### Example Reasoning
```
"Senior AI Engineer with 7.2 yrs; 8 core AI/ML skills; 
response rate 0.76; recently active; Pune-based."
```

---

## 📁 Project Structure

```
HireSense-AI/
├── backend/
│   ├── app.py                    # Flask API server
│   ├── config.py                 # Configuration
│   └── services/
│       ├── data_loader.py        # Data preprocessing
│       ├── honeypot_detector.py  # Profile validation
│       ├── scorer.py             # Scoring engine
│       └── ranker.py             # Ranking pipeline
├── frontend/
│   ├── index.html                # Main UI
│   ├── css/styles.css            # Dark theme styling
│   └── js/app.js                 # Application logic
├── output/
│   └── ranked_candidates.csv     # Final submission
├── requirements.txt              # Dependencies
├── run.py                        # Main entry point
├── generate_ranking.py           # Standalone ranker
└── README.md                     # Documentation
```

---

## 🚀 How to Run

### 1. Install Dependencies
```bash
pip install flask flask-cors python-docx pandas numpy scikit-learn nltk jsonschema python-dateutil pyyaml
```

### 2. Run the Application
```bash
python run.py
```

### 3. Access the Dashboard
Open browser to: **http://localhost:5000**

### 4. Generate Ranking Only (No Server)
```bash
python generate_ranking.py
```

---

## 📈 Performance Metrics

- **Dataset Size**: 100,000 candidates
- **Processing Time**: ~30-60 seconds
- **Memory Usage**: ~2-3 GB
- **Output**: Top 100 ranked candidates
- **Honeypots Detected**: ~0-100 (varies by dataset)

---

## 🎨 UI Features

### Color Palette
- Background: `#0a0a0a` (deep black)
- Cards: `#1a1a1a` (dark gray)
- Primary: `#ff4500` (red-orange)
- Secondary: `#ff8c00` (orange)
- Accent: `#ffd700` (yellow-gold)

### Pages
1. **Dashboard** - Overview and quick stats
2. **Leaderboard** - Full ranked list with pagination
3. **Analytics** - Deep insights and visualizations

---

## 🔍 Key Insights

### What Makes a Top Candidate?
1. 5-9 years experience in AI/ML at product companies
2. Strong skills in embeddings, vector databases, Python
3. Recent platform activity with good response rates
4. Located in Pune/Noida or willing to relocate
5. Tier-1/Tier-2 education background

### Disqualifying Factors
1. Pure consulting background (TCS, Infosys, etc.)
2. Keyword stuffing without real experience
3. Impossible profile timelines (honeypots)
4. Inactive for 6+ months
5. Non-technical roles claiming AI expertise

---

## 📝 Files Created

### Backend (7 files)
- `backend/app.py` - Flask API (318 lines)
- `backend/config.py` - Configuration (66 lines)
- `backend/services/data_loader.py` - Data loading (135 lines)
- `backend/services/honeypot_detector.py` - Validation (180 lines)
- `backend/services/scorer.py` - Scoring engine (318 lines)
- `backend/services/ranker.py` - Ranking pipeline (179 lines)

### Frontend (3 files)
- `frontend/index.html` - UI structure (177 lines)
- `frontend/css/styles.css` - Styling (577 lines)
- `frontend/js/app.js` - Application logic (476 lines)

### Configuration & Documentation (4 files)
- `requirements.txt` - Dependencies
- `run.py` - Entry point (38 lines)
- `generate_ranking.py` - Standalone ranker (40 lines)
- `README.md` - Full documentation (346 lines)

**Total**: ~2,900 lines of code

---

## ✨ Highlights

1. **No Dummy Data**: All rankings use real dataset candidates
2. **Explainable AI**: Every score has detailed reasoning
3. **Production-Ready**: Follows competition compute constraints
4. **Extensible**: Easy to add new scoring components
5. **Professional UI**: Dark theme with warm color palette
6. **Real-time Search**: Instant candidate lookup
7. **Responsive Design**: Works on desktop and mobile

---

## 🎓 Learning Outcomes

1. Large-scale data processing (100K records)
2. Multi-component scoring systems
3. Explainable AI principles
4. Flask API development
5. Modern frontend without frameworks
6. Data validation and quality checks
7. CSV format compliance

---

## 📦 Deliverables

✅ Working local application
✅ Ranked output CSV (100 candidates)
✅ Professional dark-themed UI
✅ Complete documentation
✅ Explainable ranking logic
✅ Honeypot detection
✅ Real dataset integration

---

## 🔮 Future Enhancements

1. Add machine learning model for scoring
2. Implement vector similarity search
3. Add candidate comparison feature
4. Export rankings to PDF
5. Add filtering and sorting options
6. Implement user authentication
7. Add candidate feedback loop

---

## 📄 License

Created for INDIA.RUNS Data & AI Challenge 2026

---

**Built with ❤️ for the hackathon**