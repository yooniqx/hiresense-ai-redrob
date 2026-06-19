import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { ScoreBadge, ScoreBar, Tag, GhostButton, PrimaryButton, SectionHeader } from "../components/ui-kit";
import { candidates, type Candidate } from "../lib/dummy-data";
import { ArrowLeft, Mail, MapPin, Briefcase, GraduationCap, Brain, Sparkles, FileText, ThumbsUp, AlertTriangle, Download, Send } from "lucide-react";

export const Route = createFileRoute("/candidates/$id")({
  head: ({ params }) => ({ meta: [{ title: `Candidate — HireSense AI` }, { name: "description", content: `Profile for candidate ${params.id}` }] }),
  loader: ({ params }) => {
    const c = candidates.find((x) => x.id === params.id);
    if (!c) throw notFound();
    return c;
  },
  component: CandidateDetails,
  notFoundComponent: () => (
    <AppLayout>
      <div className="text-center py-20">
        <h1 className="font-display text-3xl font-bold">Candidate not found</h1>
        <Link to="/results" className="text-accent mt-2 inline-block">Back to results</Link>
      </div>
    </AppLayout>
  ),
});

function CandidateDetails() {
  const c = Route.useLoaderData() as Candidate;
  return (
    <AppLayout>
      <Link to="/results" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent mb-4 transition">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to ranking
      </Link>

      <SectionHeader
        title={c.name}
        description={`${c.title} • ${c.location}`}
        actions={
          <>
            <GhostButton icon={<Download className="h-4 w-4" />}>Resume</GhostButton>
            <PrimaryButton icon={<Send className="h-4 w-4" />}>Contact</PrimaryButton>
          </>
        }
      />

      {/* Profile card */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8 mb-6">
        <div className="absolute inset-0 opacity-40 pointer-events-none"
             style={{ backgroundImage: "radial-gradient(ellipse 60% 80% at 100% 0%, oklch(0.62 0.22 27 / 0.25), transparent 60%)" }} />
        <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
          <div className="h-24 w-24 rounded-2xl grid place-items-center text-3xl font-bold text-white glow-ember"
               style={{ background: `linear-gradient(135deg, ${c.avatarColor}, #F97316)` }}>
            {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold">{c.name}</h2>
            <p className="text-muted-foreground">{c.title}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{c.location}</span>
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{c.email}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{c.yearsExperience} yrs</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Overall match</div>
            <div className="font-display text-6xl font-black text-gradient-ember leading-none">{c.score}<span className="text-2xl">%</span></div>
            <Tag tone={c.recommendation === "Strong Hire" ? "ember" : c.recommendation === "Hire" ? "flame" : "amber"}>{c.recommendation}</Tag>
          </div>
        </div>

        <div className="relative mt-7 grid sm:grid-cols-3 gap-4">
          <ScoreBar score={c.skillsMatch} label="Skills match" />
          <ScoreBar score={c.experienceMatch} label="Experience match" />
          <ScoreBar score={c.behavioralFit} label="Behavioral fit" />
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Explanation */}
          <Panel icon={<Sparkles className="h-4 w-4" />} title="AI Match Explanation" tone="ember">
            <p className="text-sm leading-relaxed text-muted-foreground">{c.explanation}</p>
          </Panel>

          {/* Skills */}
          <Panel icon={<Brain className="h-4 w-4" />} title="Skills" tone="flame">
            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((s) => <Tag key={s} tone="flame">{s}</Tag>)}
            </div>
          </Panel>

          {/* Experience */}
          <Panel icon={<Briefcase className="h-4 w-4" />} title="Experience" tone="amber">
            <div className="space-y-4">
              {c.experience.map((e, i) => (
                <div key={i} className="border-l-2 border-accent/40 pl-4">
                  <div className="font-semibold">{e.role} · <span className="text-accent">{e.company}</span></div>
                  <div className="text-xs text-muted-foreground mb-2">{e.period}</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {e.bullets.map((b, j) => <li key={j}>• {b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Panel>

          {/* Education */}
          <Panel icon={<GraduationCap className="h-4 w-4" />} title="Education" tone="ember">
            <div className="space-y-3">
              {c.education.map((e, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{e.degree}</div>
                    <div className="text-xs text-muted-foreground">{e.school}</div>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">{e.year}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Resume preview */}
          <Panel icon={<FileText className="h-4 w-4" />} title="Resume preview" tone="flame">
            <div className="rounded-xl bg-surface-2 border border-border p-6 min-h-[180px] grid place-items-center text-center">
              <div>
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <div className="text-sm font-medium">{c.name.toLowerCase().replace(" ", "_")}_resume.pdf</div>
                <div className="text-xs text-muted-foreground mt-1">412 KB · 2 pages</div>
                <GhostButton icon={<Download className="h-4 w-4" />}>Download PDF</GhostButton>
              </div>
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          {/* Score card */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-bold mb-3">Match breakdown</h3>
            <div className="space-y-3">
              <ScoreBar score={c.skillsMatch} label="Skills" />
              <ScoreBar score={c.experienceMatch} label="Experience" />
              <ScoreBar score={c.behavioralFit} label="Behavioral fit" />
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Overall</span>
              <ScoreBadge score={c.score} size="lg" />
            </div>
          </div>

          {/* Behavioral */}
          <Panel icon={<Brain className="h-4 w-4" />} title="Behavioral signals" tone="amber" compact>
            <ul className="text-sm space-y-2">
              {c.behavioral.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-glow mt-2 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </Panel>

          {/* Strengths */}
          <Panel icon={<ThumbsUp className="h-4 w-4" />} title="Strengths" tone="ember" compact>
            <ul className="text-sm space-y-2">
              {c.strengths.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">+</span>{s}
                </li>
              ))}
            </ul>
          </Panel>

          {/* Gaps */}
          <Panel icon={<AlertTriangle className="h-4 w-4" />} title="Gaps" tone="flame" compact>
            <ul className="text-sm space-y-2">
              {c.gaps.map((g) => (
                <li key={g} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">!</span>{g}
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </AppLayout>
  );
}

function Panel({ icon, title, children, tone = "ember", compact = false }: { icon: React.ReactNode; title: string; children: React.ReactNode; tone?: "ember" | "flame" | "amber"; compact?: boolean }) {
  const toneCls = tone === "ember" ? "bg-primary/15 text-primary" : tone === "flame" ? "bg-accent/15 text-accent" : "bg-amber-glow/15 text-amber-glow";
  return (
    <div className={`rounded-2xl border border-border bg-card ${compact ? "p-5" : "p-6"}`}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`h-8 w-8 rounded-lg grid place-items-center ${toneCls}`}>{icon}</div>
        <h3 className="font-display font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
