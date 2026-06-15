import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatCard, ScoreBadge, SectionHeader, PrimaryButton, GhostButton } from "@/components/ui-kit";
import { Users, CheckCircle2, Gauge, Crown, Upload, FileText, Trophy, ArrowUpRight, Sparkles } from "lucide-react";
import { fetchCandidates, fetchStats, fetchActivity } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — HireSense AI" },
      { name: "description", content: "AI-powered candidate ranking for smarter hiring." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  // Fetch data from API
  const { data: candidates = [], isLoading: candidatesLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: fetchCandidates,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  const { data: activity = [], isLoading: activityLoading } = useQuery({
    queryKey: ['activity'],
    queryFn: fetchActivity,
  });

  // Get top candidate
  const topCandidate = candidates[0];

  // Show loading state
  if (candidatesLoading || statsLoading || activityLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12 mb-8">
        <div className="absolute inset-0 opacity-60 pointer-events-none"
             style={{ backgroundImage: "radial-gradient(ellipse 60% 80% at 0% 0%, oklch(0.62 0.22 27 / 0.35), transparent 60%), radial-gradient(ellipse 50% 70% at 100% 100%, oklch(0.85 0.16 85 / 0.18), transparent 60%)" }} />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full gradient-ember opacity-25 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mb-5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="font-medium">Live ranking engine</span>
            <span className="text-muted-foreground">• {stats?.totalCandidates || 0} candidates analyzed</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            <span className="text-gradient-ember">HireSense AI</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl">
            AI-powered candidate ranking for smarter hiring.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/candidates"><PrimaryButton icon={<Upload className="h-4 w-4" />}>Upload Resumes</PrimaryButton></Link>
            <Link to="/job-description"><GhostButton icon={<FileText className="h-4 w-4" />}>Add Job Description</GhostButton></Link>
            <Link to="/results"><GhostButton icon={<Trophy className="h-4 w-4" />}>View Results</GhostButton></Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Candidates" value={stats?.totalCandidates || 0} delta="+24%" icon={<Users className="h-4 w-4" />} accent="ember" />
        <StatCard label="Ranked Candidates" value={stats?.rankedCandidates || 0} delta="+18%" icon={<CheckCircle2 className="h-4 w-4" />} accent="flame" />
        <StatCard label="Average Match" value={`${stats?.averageMatch || 0}%`} delta="+6%" icon={<Gauge className="h-4 w-4" />} accent="amber" />
        <StatCard label="Top Candidate" value={`${stats?.topCandidate || 0}%`} delta="+2%" icon={<Crown className="h-4 w-4" />} accent="ember" />
      </div>

      {/* Activity + Quick */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <SectionHeader
            title="Recent ranking activity"
            description="Latest scoring events from the AI engine"
          />
          <div className="-mt-2 divide-y divide-border">
            {activity.map((a, i) => (
              <div key={i} className="px-1 py-4 flex items-center gap-4">
                <div className="h-9 w-9 rounded-lg gradient-ember grid place-items-center text-xs font-bold text-white shrink-0">
                  {a.who.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate">
                    <span className="font-semibold">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="font-medium">{a.role}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.time}</div>
                </div>
                {a.score ? <ScoreBadge score={a.score} /> : <span className="text-xs text-muted-foreground">—</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display font-bold text-lg mb-1">Top match</h3>
          <p className="text-xs text-muted-foreground mb-5">Best candidate this week</p>
          {topCandidate ? (
            <>
              <div className="relative rounded-xl p-5 gradient-ember glow-ember text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-white/15 backdrop-blur grid place-items-center text-base font-bold">
                    {topCandidate.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="font-bold">{topCandidate.name}</div>
                    <div className="text-xs opacity-90">{topCandidate.title}</div>
                  </div>
                </div>
                <div className="text-5xl font-display font-black tracking-tight">{topCandidate.score}<span className="text-2xl opacity-80">%</span></div>
                <div className="text-xs opacity-90 mt-1">match score</div>
                <Link to="/candidates/$id" params={{ id: topCandidate.id }} className="mt-4 inline-flex items-center gap-1 text-xs font-medium underline-offset-2 hover:underline">
                  View profile <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-surface-2 p-2">
                  <div className="font-display font-bold text-base">{topCandidate.skillsMatch}</div>
                  <div className="text-muted-foreground">Skills</div>
                </div>
                <div className="rounded-lg bg-surface-2 p-2">
                  <div className="font-display font-bold text-base">{topCandidate.experienceMatch}</div>
                  <div className="text-muted-foreground">Experience</div>
                </div>
                <div className="rounded-lg bg-surface-2 p-2">
                  <div className="font-display font-bold text-base">{topCandidate.behavioralFit}</div>
                  <div className="text-muted-foreground">Fit</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No candidates ranked yet
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// Made with Bob
