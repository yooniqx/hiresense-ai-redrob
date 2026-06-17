import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { SectionHeader, PrimaryButton, GhostButton, Tag } from "@/components/ui-kit";
import { UploadCloud, FileText, CheckCircle2, Loader2, Clock, Trash2, Users } from "lucide-react";
import { uploads } from "@/lib/dummy-data";
import { useState } from "react";

export const Route = createFileRoute("/candidates/")({
  head: () => ({ meta: [{ title: "Candidates — HireSense AI" }] }),
  component: CandidatesPage,
});

function CandidatesPage() {
  const [drag, setDrag] = useState(false);

  return (
    <AppLayout>
      <SectionHeader
        title="Candidate Upload"
        description="Drop resumes to parse and queue them for AI ranking"
        actions={
          <>
            <GhostButton icon={<Trash2 className="h-4 w-4" />}>Clear</GhostButton>
            <PrimaryButton icon={<CheckCircle2 className="h-4 w-4" />}>Rank All</PrimaryButton>
          </>
        }
      />

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Total uploaded", v: uploads.length, c: "text-foreground" },
          { l: "Parsed", v: uploads.filter((u) => u.status === "Parsed").length, c: "text-emerald-400" },
          { l: "Processing", v: uploads.filter((u) => u.status === "Processing").length, c: "text-accent" },
          { l: "Queued", v: uploads.filter((u) => u.status === "Queued").length, c: "text-amber-glow" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-card px-4 py-3">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className={`font-display text-2xl font-bold ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); }}
        className={[
          "relative rounded-3xl border-2 border-dashed p-10 md:p-16 text-center transition mb-8 overflow-hidden",
          drag ? "border-accent bg-accent/5 glow-flame" : "border-border bg-card hover:border-accent/50",
        ].join(" ")}
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none"
             style={{ backgroundImage: "radial-gradient(ellipse 60% 60% at 50% 0%, oklch(0.62 0.22 27 / 0.18), transparent 70%)" }} />
        <div className="relative mx-auto h-16 w-16 rounded-2xl gradient-ember grid place-items-center glow-ember mb-4">
          <UploadCloud className="h-7 w-7 text-white" />
        </div>
        <h3 className="font-display text-xl font-bold">Drop resumes here</h3>
        <p className="text-sm text-muted-foreground mt-1.5">or click to browse — bulk upload supported</p>
        <div className="mt-5 flex justify-center gap-3 flex-wrap">
          <PrimaryButton icon={<UploadCloud className="h-4 w-4" />}>Choose files</PrimaryButton>
          <GhostButton icon={<Users className="h-4 w-4" />}>Import from ATS</GhostButton>
        </div>
        <p className="text-xs text-muted-foreground mt-5">
          Supported formats: <span className="text-foreground font-medium">PDF</span> · <span className="text-foreground font-medium">DOCX</span> · <span className="text-foreground font-medium">TXT</span> · max 10MB each
        </p>
      </div>

      {/* Upload table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold">Upload status</h3>
            <p className="text-xs text-muted-foreground">{uploads.length} files in this batch</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3 font-medium">File</th>
                <th className="text-left px-5 py-3 font-medium">Size</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Uploaded</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {uploads.map((u, i) => (
                <tr key={i} className="hover:bg-surface-2/40 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-surface-2 grid place-items-center">
                        <FileText className="h-4 w-4 text-accent" />
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground tabular-nums">{u.size}</td>
                  <td className="px-5 py-3.5">
                    {u.status === "Parsed" && <Tag tone="ember"><CheckCircle2 className="h-3 w-3" /> Parsed</Tag>}
                    {u.status === "Processing" && <Tag tone="flame"><Loader2 className="h-3 w-3 animate-spin" /> Processing</Tag>}
                    {u.status === "Queued" && <Tag tone="amber"><Clock className="h-3 w-3" /> Queued</Tag>}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{u.time}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-muted-foreground hover:text-primary transition"><Trash2 className="h-4 w-4" /></button>
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
