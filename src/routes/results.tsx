import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { SectionHeader, ScoreBadge, ScoreBar, GhostButton, Tag } from "@/components/ui-kit";
import { Search, ArrowUpDown, Download, Eye } from "lucide-react";
import { fetchCandidates } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Ranking Results — HireSense AI" }] }),
  component: ResultsPage,
});

const recoTone: Record<string, "ember" | "flame" | "amber" | "default"> = {
  "Strong Hire": "ember",
  "Hire": "flame",
  "Maybe": "amber",
  "Pass": "default",
};

function ResultsPage() {
  const [q, setQ] = useState("");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const { data: raw = [], isLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: fetchCandidates,
  });

  const rows = useMemo(() => {
    return raw
      .filter((c) => (c.name + c.title + c.skills.join(" ")).toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (sortDir === "desc" ? b.score - a.score : a.score - b.score));
  }, [raw, q, sortDir]);

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
        title="Ranking Results"
        description={`Senior AI Engineer • ${rows.length} candidates scored`}
        actions={
          <>
            <GhostButton icon={<Download className="h-4 w-4" />}>Export CSV</GhostButton>
            <GhostButton icon={<ArrowUpDown className="h-4 w-4" />} onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}>
              Score {sortDir === "desc" ? "↓" : "↑"}
            </GhostButton>
          </>
        }
      />

      {/* Filter bar */}
      <div className="rounded-2xl border border-border bg-card p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[220px] flex items-center gap-2 h-10 px-3 rounded-lg bg-surface border border-border focus-within:border-accent/50">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, title or skill…" className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
        </div>
        <div className="flex gap-1.5">
          {["All", "Strong Hire", "Hire", "Maybe", "Pass"].map((f, i) => (
            <button key={f} className={`px-3 h-9 rounded-md text-xs font-medium transition ${i === 0 ? "gradient-ember text-white glow-ember" : "bg-surface border border-border text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium w-14">Rank</th>
                <th className="text-left px-4 py-3 font-medium">Candidate</th>
                <th className="text-left px-4 py-3 font-medium">Match</th>
                <th className="text-left px-4 py-3 font-medium min-w-[140px]">Skills</th>
                <th className="text-left px-4 py-3 font-medium min-w-[140px]">Experience</th>
                <th className="text-left px-4 py-3 font-medium min-w-[140px]">Behavioral</th>
                <th className="text-left px-4 py-3 font-medium">Recommendation</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((c, i) => (
                <tr key={c.id} className="hover:bg-surface-2/40 transition group">
                  <td className="px-4 py-4">
                    <div className={[
                      "h-8 w-8 rounded-lg grid place-items-center font-display font-bold text-sm",
                      i === 0 ? "gradient-ember text-white glow-ember" :
                      i === 1 ? "bg-accent/20 text-accent border border-accent/30" :
                      i === 2 ? "bg-amber-glow/20 text-amber-glow border border-amber-glow/30" :
                      "bg-surface-2 text-muted-foreground"
                    ].join(" ")}>{i + 1}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full grid place-items-center font-bold text-xs text-white shrink-0" style={{ background: `linear-gradient(135deg, ${c.avatarColor}, #F97316)` }}>
                        {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{c.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{c.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><ScoreBadge score={c.score} /></td>
                  <td className="px-4 py-4"><ScoreBar score={c.skillsMatch} /></td>
                  <td className="px-4 py-4"><ScoreBar score={c.experienceMatch} /></td>
                  <td className="px-4 py-4"><ScoreBar score={c.behavioralFit} /></td>
                  <td className="px-4 py-4"><Tag tone={recoTone[c.recommendation]}>{c.recommendation}</Tag></td>
                  <td className="px-4 py-4 text-right">
                    <Link to="/candidates/$id" params={{ id: c.id }} className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md bg-surface border border-border text-xs font-medium hover:border-accent/50 hover:text-accent transition">
                      <Eye className="h-3.5 w-3.5" /> Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

