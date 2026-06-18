import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  trend = "up",
  icon,
  accent = "ember",
}: {
  label: string;
  value: string | number;
  delta?: string;
  trend?: "up" | "down";
  icon?: ReactNode;
  accent?: "ember" | "flame" | "amber";
}) {
  const accentMap = {
    ember: "from-primary/20 to-primary/0 text-primary",
    flame: "from-accent/20 to-accent/0 text-accent",
    amber: "from-amber-glow/20 to-amber-glow/0 text-amber-glow",
  } as const;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 group hover:border-accent/40 transition-all hover:-translate-y-0.5 hover:glow-flame">
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-80 transition pointer-events-none ${accentMap[accent]}`}
        style={{ maskImage: "radial-gradient(ellipse at top right, black, transparent 70%)" }}
      />
      <div className="relative flex items-start justify-between mb-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
        {icon && (
          <div className={`h-9 w-9 rounded-lg bg-surface-2 grid place-items-center ${accentMap[accent].split(" ").pop()}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="relative">
        <div className="font-display text-3xl font-bold tracking-tight">{value}</div>
        {delta && (
          <div className="mt-1.5 flex items-center gap-1 text-xs">
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3 text-emerald-400" />
            ) : (
              <TrendingDown className="h-3 w-3 text-primary" />
            )}
            <span className={trend === "up" ? "text-emerald-400" : "text-primary"}>{delta}</span>
            <span className="text-muted-foreground">vs last week</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const tier =
    score >= 90 ? "ember" : score >= 75 ? "flame" : score >= 60 ? "amber" : "neutral";
  const styles = {
    ember: "from-primary to-accent text-white glow-ember",
    flame: "from-accent to-amber-glow text-white glow-flame",
    amber: "from-amber-glow/80 to-amber-glow/40 text-white",
    neutral: "from-surface-2 to-surface-2 text-white border border-border",
  }[tier];
  const sizing = {
    sm: "text-xs px-2 py-0.5 min-w-12",
    md: "text-sm px-2.5 py-1 min-w-14",
    lg: "text-base px-3 py-1.5 min-w-16",
  }[size];
  return (
    <span
      className={`inline-flex items-center justify-center font-display font-bold rounded-md bg-gradient-to-br ${styles} ${sizing}`}
    >
      {score}
    </span>
  );
}

export function ScoreBar({ score, label }: { score: number; label?: string }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium tabular-nums">{score}%</span>
        </div>
      )}
      <div className="h-1.5 w-full rounded-full bg-surface-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-amber-glow transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "ember" | "flame" | "amber" }) {
  const tones = {
    default: "bg-surface-2 text-foreground border-border",
    ember: "bg-primary/15 text-primary border-primary/30",
    flame: "bg-accent/15 text-accent border-accent/30",
    amber: "bg-amber-glow/15 text-amber-glow border-amber-glow/30",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function SectionHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  icon,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-lg gradient-ember text-white font-medium text-sm glow-ember hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {icon}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-surface border border-border text-foreground font-medium text-sm hover:border-accent/50 hover:bg-surface-2 transition"
    >
      {icon}
      {children}
    </button>
  );
}
