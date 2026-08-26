import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Boxes,
  Sparkles,
  Link2,
  Users,
  Zap,
  Shuffle,
  BarChart3,
  Search,
  Circle,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type NavItem = { to: string; label: string; icon: LucideIcon; hint: string };

const NAV: NavItem[] = [
  { to: "/console", label: "Portfolio", icon: LayoutDashboard, hint: "overview" },
  { to: "/apps", label: "Apps", icon: Boxes, hint: "6" },
  { to: "/aso", label: "ASO", icon: Sparkles, hint: "meta" },
  { to: "/links", label: "Links", icon: Link2, hint: "6" },
  { to: "/segments", label: "Segments", icon: Users, hint: "5" },
  { to: "/automations", label: "Automations", icon: Zap, hint: "5" },
  { to: "/crosspromo", label: "Cross-promo", icon: Shuffle, hint: "5" },
  { to: "/reports", label: "Reports", icon: BarChart3, hint: "" },
];

export function ConsoleLayout({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="dark min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-sm bg-primary/90 grid place-items-center">
              <Circle className="size-3 text-primary-foreground fill-current" />
            </div>
            <div>
              <div className="font-mono text-sm font-semibold tracking-tight text-sidebar-accent-foreground">
                orbit<span className="text-primary">.</span>console
              </div>
              <div className="font-mono text-[10px] text-muted-foreground">
                v0.4.1 · workspace: indie
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <div className="px-3 pt-2 pb-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Workspace
          </div>
          {NAV.map((n) => {
            const active =
              path === n.to || path.startsWith(n.to + "/");
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={
                  "group mx-2 flex items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] transition-colors " +
                  (active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground")
                }
              >
                <Icon className="size-3.5 opacity-80" />
                <span className="flex-1">{n.label}</span>
                {n.hint && (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {n.hint}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="px-3 pt-6 pb-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Status
          </div>
          <div className="px-4 space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>collector</span>
              <span className="flex items-center gap-1 text-primary">
                <span className="size-1.5 rounded-full bg-primary" /> ok
              </span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>rules eng.</span>
              <span className="flex items-center gap-1 text-primary">
                <span className="size-1.5 rounded-full bg-primary" /> ok
              </span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>msg queue</span>
              <span className="flex items-center gap-1 text-warning">
                <span className="size-1.5 rounded-full bg-warning" /> 214 lag
              </span>
            </div>
          </div>
        </nav>

        <div className="px-3 py-3 border-t border-sidebar-border font-mono text-[11px] text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>plan</span>
            <span className="text-sidebar-accent-foreground">Studio</span>
          </div>
          <div className="flex items-center justify-between">
            <span>events / mo</span>
            <span className="text-sidebar-accent-foreground">4.2M / 10M</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 border-b border-border flex items-center gap-3 px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span>~</span>
              <span>/</span>
              <span className="text-foreground">{title.toLowerCase()}</span>
            </div>
            <h1 className="text-[15px] font-semibold tracking-tight leading-none mt-0.5">
              {title}
              {subtitle && (
                <span className="ml-2 font-mono text-[11px] text-muted-foreground font-normal">
                  {subtitle}
                </span>
              )}
            </h1>
          </div>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2 h-8 w-72 px-2.5 rounded-sm bg-input/50 border border-border">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              placeholder="search apps, events, users…"
              className="flex-1 bg-transparent outline-none text-[12px] placeholder:text-muted-foreground font-mono"
            />
            <kbd className="font-mono text-[10px] text-muted-foreground border border-border rounded px-1">
              ⌘K
            </kbd>
          </div>
          {actions}
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
}) {
  const positive = delta?.startsWith("+");
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        {delta && (
          <div
            className={
              "font-mono text-[11px] " +
              (positive ? "text-primary" : "text-destructive")
            }
          >
            {delta}
          </div>
        )}
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </div>
      {hint && (
        <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>
      )}
    </div>
  );
}

export function Panel({
  title,
  right,
  children,
  className,
}: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={
        "rounded-sm border border-border bg-card overflow-hidden " +
        (className ?? "")
      }
    >
      <header className="flex items-center gap-2 px-4 h-10 border-b border-border">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
        <div className="flex-1" />
        {right}
      </header>
      <div>{children}</div>
    </section>
  );
}

export function Pill({
  tone = "muted",
  children,
}: {
  tone?: "muted" | "ok" | "warn" | "bad" | "info";
  children: ReactNode;
}) {
  const map = {
    muted: "bg-muted text-muted-foreground",
    ok: "bg-primary/15 text-primary",
    warn: "bg-warning/15 text-warning",
    bad: "bg-destructive/15 text-destructive",
    info: "bg-accent/15 text-accent",
  } as const;
  return (
    <span
      className={
        "inline-flex items-center rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider " +
        map[tone]
      }
    >
      {children}
    </span>
  );
}