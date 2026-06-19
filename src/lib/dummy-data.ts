export interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  avatarColor: string;
  score: number;
  rank: number;
  skillsMatch: number;
  experienceMatch: number;
  behavioralFit: number;
  recommendation: string;
  yearsExperience: number;
  skills: string[];
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  certifications: string[];
  experience: Array<{
    company: string;
    role: string;
    period: string;
    bullets: string[];
  }>;
  behavioral: string[];
  strengths: string[];
  gaps: string[];
  explanation: string;
}

export const candidates: Candidate[] = [];

export const uploads = [
  {
    id: "1",
    filename: "candidates_batch_1.csv",
    uploadedAt: "2024-01-15T10:30:00Z",
    status: "completed" as const,
    candidatesCount: 150,
    rankedCount: 150,
  },
];

export const sampleJD = {
  title: "Senior Machine Learning Engineer",
  department: "Engineering",
  location: "Bangalore, India",
  type: "Full-time",
  description: "We are seeking an experienced ML Engineer to join our AI team.",
  responsibilities: [
    "Design and implement ML models",
    "Collaborate with cross-functional teams",
    "Optimize model performance",
  ],
  requirements: {
    required_skills: ["Python", "TensorFlow", "PyTorch"],
    preferred_skills: ["AWS", "Docker", "Kubernetes"],
    min_experience: 5,
    education: ["Bachelor's in Computer Science"],
  },
  benefits: ["Health insurance", "Remote work", "Learning budget"],
};

// Made with Bob
