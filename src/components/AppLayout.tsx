import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  Trophy,
  BarChart3,
  Sparkles,
  Search,
} from "lucide-react";
import { SupportChat } from "./SupportChat";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/add-candidate", label: "Add Candidate", icon: UserPlus },
  { to: "/job-description", label: "Job Description", icon: FileText },
  { to: "/results", label: "Ranking Results", icon: Trophy },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/candidates?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl sticky top-0 h-screen">
        <div className="px-6 py-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl gradient-ember grid place-items-center glow-ember">
              <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-lg tracking-tight">HireSense</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">AI Recruiting</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  active
                    ? "bg-gradient-to-r from-primary/20 to-accent/10 text-foreground border border-primary/30 glow-ember"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
                ].join(" ")}
              >
                <Icon className={["h-4 w-4 shrink-0", active ? "text-accent" : ""].join(" ")} />
                <span className="font-medium">{item.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px] shadow-accent" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mx-3 mb-4 rounded-xl glass">
          <div className="flex items-center gap-2 text-xs font-semibold mb-1.5">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span>AI Engine</span>
            <span className="ml-auto text-[10px] text-muted-foreground">v2.4</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ranking model online. 1,284 inferences today.
          </p>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/70 backdrop-blur-xl flex items-center gap-4 px-4 md:px-8">
          <div className="md:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-ember grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold">HireSense</span>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex items-center gap-2 h-10 px-3.5 rounded-lg bg-surface border border-border focus-within:border-accent/50 transition">
            <button
              type="submit"
              className="shrink-0 hover:text-accent transition"
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-muted-foreground hover:text-accent transition" />
            </button>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidates, roles, skills..."
              className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground"
            />
          </form>

          <div className="ml-auto flex items-center gap-3">
            <SupportChat />
            <div className="flex items-center gap-2.5 pl-2">
              <div className="h-9 w-9 rounded-full gradient-ember grid place-items-center text-sm font-bold text-white">
                LR
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-medium">Lead Recruiter</div>
                <div className="text-xs text-muted-foreground">Recruiter Account</div>
              </div>
            </div>
          </div>
        </header>

        <nav className="md:hidden flex overflow-x-auto gap-1 px-3 py-2 border-b border-border bg-background/60">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  "shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition",
                  active ? "gradient-ember text-white" : "bg-surface text-muted-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">
          {children}
          
          {/* Copyright Footer */}
          <footer className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            <p>© 2026 Yooniq Forge. All rights reserved.</p>
            <p className="mt-1">
              Created for INDIA.RUN Hackathon organized by Redrob AI • Educational Purpose Only
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

// Made with Bob
