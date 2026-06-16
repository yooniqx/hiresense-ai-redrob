import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { SectionHeader, PrimaryButton, GhostButton, Tag } from "@/components/ui-kit";
import { ClipboardPaste, Sparkles, FileText, Briefcase, Brain, Activity } from "lucide-react";
import { fetchJobDescription } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/job-description")({
  head: () => ({ meta: [{ title: "Job Description — HireSense AI" }] }),
  component: JDPage,
});

function JDPage() {
  const { data: fetchedJD } = useQuery({
    queryKey: ['job-description'],
    queryFn: fetchJobDescription,
  });
  
  const [jd, setJd] = useState("");
  const limit = 5000;

  useEffect(() => {
    if (fetchedJD) {
      setJd(fetchedJD);
    }
  }, [fetchedJD]);

  return (
    <AppLayout>
      <SectionHeader
        title="Job Description"
        description="Paste the role you're hiring for — the AI extracts requirements and signals"
        actions={
          <>
            <GhostButton icon={<ClipboardPaste className="h-4 w-4" />} onClick={() => navigator.clipboard?.readText().then(setJd).catch(() => {})}>Paste JD</GhostButton>
            <PrimaryButton icon={<Sparkles className="h-4 w-4" />}>Analyze Role</PrimaryButton>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg gradient-ember grid place-items-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-display font-bold">Role description</div>
                <div className="text-xs text-muted-foreground">Markdown supported</div>
              </div>
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              <span className={jd.length > limit ? "text-primary" : "text-foreground"}>{jd.length.toLocaleString()}</span> / {limit.toLocaleString()}
            </span>
          </div>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            spellCheck={false}
            className="w-full h-[480px] resize-none bg-transparent p-5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground font-mono"
            placeholder="Paste the full job description here…"
          />
        </div>

        <aside className="space-y-4">
          <ExtractCard icon={<Briefcase className="h-4 w-4" />} title="Required Skills" tone="ember"
            tags={["PyTorch", "LLMs", "Python", "RAG", "Distributed Systems", "MLOps"]} />
          <ExtractCard icon={<Activity className="h-4 w-4" />} title="Experience Level" tone="flame"
            tags={["5+ years", "Senior IC", "Production scale"]} />
          <ExtractCard icon={<Brain className="h-4 w-4" />} title="Behavioral Signals" tone="amber"
            tags={["Async writer", "Remote-first", "Mentor", "High autonomy"]} />
          <ExtractCard icon={<Sparkles className="h-4 w-4" />} title="Platform Activity" tone="ember"
            tags={["GitHub contributions", "Open-source maintainer", "Conference speaker"]} />
        </aside>
      </div>
    </AppLayout>
  );
}

function ExtractCard({ icon, title, tags, tone }: { icon: React.ReactNode; title: string; tags: string[]; tone: "ember" | "flame" | "amber" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`h-8 w-8 rounded-lg grid place-items-center ${tone === "ember" ? "bg-primary/15 text-primary" : tone === "flame" ? "bg-accent/15 text-accent" : "bg-amber-glow/15 text-amber-glow"}`}>
          {icon}
        </div>
        <div className="font-display font-bold text-sm">{title}</div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => <Tag key={t} tone={tone}>{t}</Tag>)}
      </div>
    </div>
  );
}
