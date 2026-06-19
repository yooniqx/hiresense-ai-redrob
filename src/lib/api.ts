const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export interface Candidate {
  candidate_id: string;
  id?: string;
  name: string;
  current_role: string;
  title?: string;
  current_title?: string;
  location: string;
  email: string;
  phone?: string;
  avatarColor?: string;
  score?: number;
  rank?: number;
  skillsMatch?: number;
  experienceMatch?: number;
  behavioralFit?: number;
  recommendation?: string;
  experience_years?: number;
  yearsExperience?: number;
  skills: string[];
  education: Array<{
    institution?: string;
    school?: string;
    degree: string;
    year: string;
  }>;
  certifications?: string[];
  experience?: Array<{
    company: string;
    role: string;
    period: string;
    bullets?: string[];
  }>;
  behavioral?: string[];
  strengths?: string[];
  gaps?: string[];
  explanation?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
}

export interface Stats {
  totalCandidates: number;
  rankedCandidates: number;
  averageMatch: number;
  topCandidate: number;
}

export interface Analytics {
  scoreDistribution: Array<{
    range: string;
    label: string;
    count: number;
  }>;
  topSkills: Array<{
    name: string;
    count: number;
  }>;
  funnel: Array<{
    label: string;
    count: number;
    tone: string;
  }>;
}

export interface JobDescription {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: {
    required_skills: string[];
    preferred_skills: string[];
    min_experience: number;
    education: string[];
  };
  benefits: string[];
}

export const api = {
  async getCandidates(): Promise<Candidate[]> {
    const response = await fetch(`${API_BASE_URL}/candidates`);
    if (!response.ok) throw new Error('Failed to fetch candidates');
    return response.json();
  },

  async getCandidate(id: string): Promise<Candidate> {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
    if (!response.ok) throw new Error('Failed to fetch candidate');
    return response.json();
  },

  async getStats(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  async getAnalytics(): Promise<Analytics> {
    const response = await fetch(`${API_BASE_URL}/analytics`);
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },

  async getJobDescription(): Promise<JobDescription> {
    const response = await fetch(`${API_BASE_URL}/job-description`);
    if (!response.ok) throw new Error('Failed to fetch job description');
    return response.json();
  },

  async getRankedCandidates(): Promise<Candidate[]> {
    const response = await fetch(`${API_BASE_URL}/candidates`);
    if (!response.ok) throw new Error('Failed to fetch ranked candidates');
    return response.json();
  },

  async rankCandidates(): Promise<{ message: string; ranked_count: number }> {
    const response = await fetch(`${API_BASE_URL}/rank`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to rank candidates');
    return response.json();
  },

  async addCandidate(candidateData: any): Promise<{
    success: boolean;
    candidate_id: string;
    score: number;
    rank: number;
    total_candidates: number;
    message: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/candidates/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidateData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add candidate');
    }
    return response.json();
  },
};

// Made with Bob
