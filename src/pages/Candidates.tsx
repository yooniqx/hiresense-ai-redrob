import { Link, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { SectionHeader, ScoreBadge } from "@/components/ui-kit";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react";
import { useMemo } from "react";

export default function Candidates() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: api.getCandidates,
  });

  // Filter candidates based on search query
  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidates;
    
    const query = searchQuery.toLowerCase();
    return candidates.filter((candidate) => {
      return (
        candidate.name.toLowerCase().includes(query) ||
        candidate.title?.toLowerCase().includes(query) ||
        candidate.location?.toLowerCase().includes(query) ||
        candidate.skills.some((skill) => skill.toLowerCase().includes(query))
      );
    });
  }, [candidates, searchQuery]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading candidates...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <SectionHeader
        title="All Candidates"
        description={
          searchQuery
            ? `${filteredCandidates.length} of ${candidates.length} candidates matching "${searchQuery}"`
            : `${candidates.length} candidates from dataset`
        }
      />

      <div className="grid gap-4 mt-6">
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-border bg-card">
            <p className="text-muted-foreground">
              {searchQuery ? `No candidates found matching "${searchQuery}"` : 'No candidates available'}
            </p>
          </div>
        ) : (
          filteredCandidates.map((candidate) => (
          <Link
            key={candidate.id}
            to={`/candidates/${candidate.id}`}
            className="block rounded-2xl border border-border bg-card p-6 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="h-12 w-12 rounded-full gradient-ember grid place-items-center text-base font-bold text-white shrink-0">
                  {candidate.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-lg">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{candidate.title}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {candidate.yearsExperience} years
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {candidate.skills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-md bg-surface-2 text-xs">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 5 && (
                      <span className="px-2 py-1 rounded-md bg-surface-2 text-xs text-muted-foreground">
                        +{candidate.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {candidate.score && (
                <div className="shrink-0">
                  <ScoreBadge score={Math.round(candidate.score)} />
                </div>
              )}
            </div>
          </Link>
          ))
        )}
      </div>
    </AppLayout>
  );
}

// Made with Bob
