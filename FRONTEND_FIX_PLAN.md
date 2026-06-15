# Frontend Structure Fix Plan

## Problem Identified

I accidentally created a **simple HTML/CSS/JavaScript frontend** in the `frontend/` folder, when the project already has a **professional React/TypeScript frontend** built with Lovable (stored in the GitHub repository).

## Current Incorrect Structure

```
HireSense-AI/
├── frontend/              ❌ WRONG - I created this by mistake
│   ├── index.html         ❌ Simple HTML file
│   ├── css/styles.css     ❌ Basic CSS
│   └── js/app.js          ❌ Vanilla JavaScript
├── backend/               ✅ CORRECT - Keep this
│   ├── app.py
│   ├── services/
│   └── config.py
└── datasets/              ✅ CORRECT - Keep this
```

## Correct Structure (from Lovable repo)

```
HireSense-AI/
├── src/                   ✅ React/TypeScript frontend
│   ├── routes/            (Dashboard, Candidates, Analytics, Results)
│   ├── components/        (UI components, shadcn/ui)
│   ├── lib/
│   │   └── dummy-data.ts  ❌ Contains mock data - needs removal
│   └── styles.css
├── backend/               ✅ Python Flask API
├── datasets/              ✅ Real candidate data
├── package.json           ✅ Node.js dependencies
├── vite.config.ts         ✅ Vite build config
└── tsconfig.json          ✅ TypeScript config
```

## Lovable Frontend Analysis

**Technology Stack:**
- React 19 with TypeScript
- TanStack Router for routing
- Vite for build tooling
- shadcn/ui + Radix UI components
- Tailwind CSS 4.x
- Dark theme with warm colors (red/orange/yellow)

**Key Routes:**
1. `/` - Dashboard with stats and activity
2. `/candidates` - Upload interface
3. `/results` - Ranked candidate leaderboard
4. `/candidates/$id` - Individual candidate details
5. `/analytics` - Score distribution and insights
6. `/job-description` - Job description view

**Dummy Data Location:**
- `src/lib/dummy-data.ts` - Contains 8 mock candidates

## Fix Strategy

### Phase 1: Clean Up Incorrect Files
1. Delete the entire `frontend/` folder I created
2. Keep all `backend/` files (they are correct)

### Phase 2: Copy Lovable Frontend
1. Copy all files from `temp_repo/` to project root:
   - `src/` directory
   - `package.json`
   - `vite.config.ts`
   - `tsconfig.json`
   - `.prettierrc`, `.prettierignore`
   - `eslint.config.js`
   - `components.json`
   - `bunfig.toml`, `bun.lock`

### Phase 3: Remove Dummy Data
1. Delete or empty `src/lib/dummy-data.ts`
2. Create new `src/lib/api.ts` for backend API calls

### Phase 4: Connect to Backend API
1. Update Flask backend to add CORS support
2. Create API service layer in frontend
3. Update routes to fetch from backend:
   - Dashboard: GET `/api/stats`, `/api/activity`
   - Results: GET `/api/candidates`
   - Candidate Details: GET `/api/candidates/:id`
   - Analytics: GET `/api/analytics`

### Phase 5: Backend API Endpoints Needed

```python
# Flask backend endpoints to create/modify:
GET  /api/candidates          # List all ranked candidates
GET  /api/candidates/:id      # Get single candidate details
GET  /api/stats               # Dashboard statistics
GET  /api/activity            # Recent ranking activity
GET  /api/analytics           # Score distribution, top skills
GET  /api/job-description     # Job description details
POST /api/rank                # Trigger ranking process
```

### Phase 6: Data Transformation

The backend returns candidates from `candidates.jsonl` with this structure:
```json
{
  "candidate_id": "c001",
  "name": "John Doe",
  "email": "john@example.com",
  "skills": ["Python", "ML"],
  "experience": [...],
  "education": [...]
}
```

Frontend expects this structure (from dummy-data.ts):
```typescript
{
  id: string,
  name: string,
  title: string,
  location: string,
  email: string,
  score: number,
  skillsMatch: number,
  experienceMatch: number,
  behavioralFit: number,
  recommendation: "Strong Hire" | "Hire" | "Maybe" | "Pass",
  skills: string[],
  experience: [...],
  education: [...]
}
```

Need to create transformation layer in backend to match frontend expectations.

## Implementation Order

1. ✅ Analyze current structure (DONE)
2. Delete incorrect `frontend/` folder
3. Copy Lovable frontend files to project root
4. Install Node.js dependencies (`npm install`)
5. Remove dummy data from `src/lib/dummy-data.ts`
6. Create `src/lib/api.ts` for API calls
7. Update Flask backend with CORS
8. Add new API endpoints to Flask
9. Update frontend routes to use API
10. Test integrated system
11. Document final setup

## Files to Keep vs Delete

**DELETE:**
- `frontend/` (entire folder)

**KEEP:**
- `backend/` (all files)
- `datasets/` (all files)
- `generate_ranking.py`
- `run.py`
- `requirements.txt`
- `README.md`
- `SUMMARY.md`

**ADD (from temp_repo):**
- `src/` (entire folder)
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- All config files

## Running the Final Application

```bash
# Terminal 1: Backend
python run.py

# Terminal 2: Frontend
npm run dev
```

Backend: http://localhost:5000
Frontend: http://localhost:5173 (Vite default)