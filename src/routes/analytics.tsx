import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { SectionHeader, Tag } from "../components/ui-kit";
import { TrendingUp, Users, Filter, Target, Sparkles, Award, BarChart3, PieChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, Analytics } from "../lib/api";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — HireSense AI" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { data: analyticsData, isLoading } = useQuery<Analytics>({
    queryKey: ['analytics'],
    queryFn: api.getAnalytics,
  });

  if (isLoading || !analyticsData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const buckets = analyticsData.scoreDistribution;
  const max = Math.max(...buckets.map((b) => b.count), 1);

  const topSkills = analyticsData.topSkills.slice(0, 7);
  const maxSkill = Math.max(...topSkills.map((s) => s.count), 1);

  const funnel = analyticsData.funnel;

  return (
    <AppLayout>
      <SectionHeader
        title="Analytics Dashboard"
        description="Insights from candidate data"
      />

      {/* Funnel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {funnel.map((f, i) => (
          <div key={f.label} className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
            <div className="absolute top-2 right-3 text-[10px] uppercase tracking-wider text-muted-foreground">Stage {i + 1}</div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-8 w-8 rounded-lg gradient-ember grid place-items-center text-xs font-bold text-white">{i + 1}</div>
              <div className="text-sm font-medium text-muted-foreground">{f.label}</div>
            </div>
            <div className="font-display text-3xl font-bold">{f.count.toLocaleString()}</div>
            {i > 0 && (
              <div className="mt-1 text-xs text-muted-foreground">
                {Math.round((f.count / funnel[i - 1].count) * 100)}% pass-through
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Score distribution */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary grid place-items-center">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display font-bold">Score Distribution</h3>
                <p className="text-xs text-muted-foreground">Match score buckets across pool</p>
              </div>
            </div>
            <Tag tone="ember">Live</Tag>
          </div>
          <div className="space-y-3">
            {buckets.map((b) => (
              <div key={b.range} className="grid grid-cols-[80px_1fr_40px] items-center gap-3">
                <div className="text-xs">
                  <div className="font-semibold">{b.range}</div>
                  <div className="text-muted-foreground">{b.label}</div>
                </div>
                <div className="h-7 rounded-md bg-surface-2 overflow-hidden relative">
                  <div className="h-full gradient-ember glow-ember" style={{ width: `${(b.count / max) * 100}%` }} />
                </div>
                <div className="text-right font-display font-bold tabular-nums">{b.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top skills */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-accent/15 text-accent grid place-items-center">
                <PieChart className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display font-bold">Top Skills Distribution</h3>
                <p className="text-xs text-muted-foreground">Most common across ranked candidates</p>
              </div>
            </div>
          </div>
          <div className="space-y-2.5">
            {topSkills.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="text-xs font-bold tabular-nums text-muted-foreground w-5">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium truncate">{s.name}</span>
                    <span className="text-muted-foreground tabular-nums">{s.count} matches</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-amber-glow" style={{ width: `${(s.count / maxSkill) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <h3 className="font-display text-lg font-bold mb-3">AI Insights</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            icon: <TrendingUp className="h-4 w-4" />,
            tone: "ember",
            title: "Score uplift on remote-first signals",
            body: "Candidates with strong async-writing signals scored +14% on behavioral fit vs the pool average.",
          },
          {
            icon: <Target className="h-4 w-4" />,
            tone: "flame",
            title: "Skill gap: production LLMs",
            body: "Only 38% of top-half candidates have shipped LLMs in production. Consider widening the sourcing net.",
          },
          {
            icon: <Award className="h-4 w-4" />,
            tone: "amber",
            title: "Open-source correlation",
            body: "Active GitHub contributors are 2.3× more likely to land in the 'Strong Hire' bucket.",
          },
          {
            icon: <Users className="h-4 w-4" />,
            tone: "ember",
            title: "Geo distribution",
            body: "62% of top-tier candidates are remote — your remote policy is materially expanding the funnel.",
          },
          {
            icon: <Filter className="h-4 w-4" />,
            tone: "flame",
            title: "Education plateau",
            body: "Degree prestige shows no correlation with score above 80. Filter relaxation recommended.",
          },
          {
            icon: <Sparkles className="h-4 w-4" />,
            tone: "amber",
            title: "Top match identified",
            body: `${funnel[3].count} candidates in shortlist with scores above 85%. Recommended next action: outreach within 24h.`,
          },
        ].map((card) => (
          <InsightCard key={card.title} {...card} />
        ))}
      </div>
    </AppLayout>
  );
}

function InsightCard({ icon, title, body, tone }: { icon: React.ReactNode; title: string; body: string; tone: string }) {
  const toneCls = tone === "ember" ? "bg-primary/15 text-primary" : tone === "flame" ? "bg-accent/15 text-accent" : "bg-amber-glow/15 text-amber-glow";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 hover:border-accent/40 transition-all hover:-translate-y-0.5 group">
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full gradient-ember opacity-0 group-hover:opacity-20 blur-2xl transition" />
      <div className={`relative h-9 w-9 rounded-lg grid place-items-center mb-3 ${toneCls}`}>{icon}</div>
      <h4 className="relative font-display font-bold text-sm mb-1.5">{title}</h4>
      <p className="relative text-xs text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

