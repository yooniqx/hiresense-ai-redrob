import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { SectionHeader, ScoreBadge, PrimaryButton } from "@/components/ui-kit";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Medal, Award, Sparkles } from "lucide-react";

export default function Results() {
  const queryClient = useQueryClient();
  
  const { data: rankedCandidates = [], isLoading } = useQuery({
    queryKey: ['ranked-candidates'],
    queryFn: api.getRankedCandidates,
  });

  const rankMutation = useMutation({
    mutationFn: api.rankCandidates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ranked-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const handleRankCandidates = () => {
    rankMutation.mutate();
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading results...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <SectionHeader
          title="Ranked Results"
          description={`${rankedCandidates.length} candidates ranked by AI`}
        />
        <PrimaryButton
          icon={<Sparkles className="h-4 w-4" />}
          onClick={handleRankCandidates}
          disabled={rankMutation.isPending}
        >
          {rankMutation.isPending ? 'Ranking...' : 'Re-rank Candidates'}
        </PrimaryButton>
      </div>

      {rankMutation.isSuccess && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600">
          Successfully ranked {rankMutation.data.ranked_count} candidates!
        </div>
      )}

      {rankedCandidates.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-border bg-card">
          <p className="text-muted-foreground mb-4">No ranked candidates yet</p>
          <PrimaryButton
            icon={<Sparkles className="h-4 w-4" />}
            onClick={handleRankCandidates}
            disabled={rankMutation.isPending}
          >
            Rank Candidates Now
          </PrimaryButton>
        </div>
      ) : (
        <div className="space-y-3">
          {rankedCandidates.map((candidate, index) => {
            const rank = candidate.rank || index + 1;
            const isTopThree = rank <= 3;
            
            return (
              <Link
                key={candidate.candidate_id}
                to={`/candidates/${candidate.candidate_id}`}
                className={`block rounded-2xl border p-6 transition-all hover:border-accent/50 ${
                  isTopThree 
                    ? 'bg-gradient-to-r from-accent/5 to-transparent border-accent/30' 
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`h-12 w-12 rounded-full grid place-items-center shrink-0 font-semibold ${
                    isTopThree
                      ? 'gradient-ember text-white'
                      : 'bg-accent/20 text-white border border-accent/40'
                  }`}>
                    {getRankIcon(rank) || `#${rank}`}
                  </div>

                  {/* Avatar */}
                  <div className="h-12 w-12 rounded-full gradient-ember grid place-items-center text-base font-bold text-white shrink-0">
                    {candidate.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.current_role}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {candidate.skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-surface-2 text-xs">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md bg-surface-2 text-xs text-muted-foreground">
                          +{candidate.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="shrink-0">
                    <ScoreBadge score={Math.round(candidate.score || 0)} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}

// Made with Bob
