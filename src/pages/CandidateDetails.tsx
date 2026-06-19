import { useParams, Link } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { ScoreBadge, GhostButton } from "../components/ui-kit";
import { api } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Briefcase, Calendar, Award, ExternalLink, ArrowLeft, GraduationCap, Link2 } from "lucide-react";

export default function CandidateDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => api.getCandidate(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading candidate...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!candidate) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Candidate not found</p>
          <Link to="/candidates" className="mt-4 inline-block">
            <GhostButton icon={<ArrowLeft className="h-4 w-4" />}>Back to Candidates</GhostButton>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <Link to="/candidates">
          <GhostButton icon={<ArrowLeft className="h-4 w-4" />}>Back to Candidates</GhostButton>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-16 w-16 rounded-full gradient-ember grid place-items-center text-xl font-bold text-white shrink-0">
                  {candidate.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <h1 className="font-display font-bold text-2xl">{candidate.name}</h1>
                  <p className="text-muted-foreground mt-1">{candidate.current_role}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {candidate.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {candidate.experience_years} years
                    </div>
                  </div>
                </div>
              </div>
              {candidate.score && (
                <ScoreBadge score={Math.round(candidate.score)} />
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display font-bold text-lg mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-surface-2 text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </h2>
            <div className="space-y-4">
              {candidate.education.map((edu, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-surface-2 grid place-items-center shrink-0">
                    <GraduationCap className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold">{edu.degree}</div>
                    <div className="text-sm text-muted-foreground">{edu.institution}</div>
                    <div className="text-xs text-muted-foreground mt-1">{edu.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {candidate.certifications && candidate.certifications.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </h2>
              <div className="space-y-2">
                {candidate.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-accent" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Links */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display font-bold text-lg mb-4">Links</h3>
            <div className="space-y-3">
              {candidate.linkedin_url && (
                <a
                  href={candidate.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  <Link2 className="h-4 w-4" />
                  LinkedIn
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {candidate.github_url && (
                <a
                  href={candidate.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  <Link2 className="h-4 w-4" />
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {candidate.portfolio_url && (
                <a
                  href={candidate.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  <Link2 className="h-4 w-4" />
                  Portfolio
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Rank Info */}
          {candidate.rank && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display font-bold text-lg mb-4">Ranking</h3>
              <div className="text-center">
                <div className="text-5xl font-display font-black text-gradient-ember">
                  #{candidate.rank}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Overall Rank
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

