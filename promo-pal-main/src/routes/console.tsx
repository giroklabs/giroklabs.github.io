import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { ConsoleLayout, Panel, Pill, StatCard } from "@/components/console-layout";
import {
  apps,
  events,
  fmtNum,
  fmtPct,
  installsSeries,
  kpis,
} from "@/lib/mock-data";

export const Route = createFileRoute("/console")({
  head: () => ({
    meta: [
      { title: "Console — GIROK labs 운영 대시보드" },
      { name: "description", content: "GIROK labs 앱 포트폴리오의 설치, 리텐션, 자동화 지표를 한 화면에서 확인하는 내부 운영 콘솔." },
      { property: "og:title", content: "Console — GIROK labs" },
      { property: "og:description", content: "앱 포트폴리오 설치·리텐션·자동화 지표 운영 콘솔." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <ConsoleLayout
      title="Portfolio"
      subtitle="6 apps · last 30d · realtime"
      actions={
        <button className="h-8 rounded-sm bg-primary text-primary-foreground font-mono text-[11px] px-3 hover:bg-primary/90">
          + register app
        </button>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="installs 30d" value={fmtNum(kpis.installs30d)} delta="+12.4%" />
          <StatCard label="dau" value={fmtNum(kpis.dau)} delta="+3.1%" />
          <StatCard label="d7 retention" value={fmtPct(kpis.d7)} delta="+0.8%" />
          <StatCard label="arpu" value={"$" + kpis.arpu.toFixed(2)} delta="+$0.01" />
          <StatCard label="active rules" value={String(kpis.autoRules)} hint="3 paused" />
          <StatCard label="msgs sent" value={fmtNum(kpis.msgsSent)} delta="+8.9%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel
            title="installs by source · 30d"
            className="lg:col-span-2"
            right={
              <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-chart-1" />organic</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-chart-2" />paid</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-chart-3" />crosspromo</span>
              </div>
            }
          >
            <div className="h-72 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={installsSeries}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={30} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 4,
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                  <Area type="monotone" dataKey="organic" stroke="var(--color-chart-1)" fill="url(#g1)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="paid" stroke="var(--color-chart-2)" fill="url(#g2)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="crosspromo" stroke="var(--color-chart-3)" fill="url(#g3)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="apps · leaderboard">
            <div className="divide-y divide-border">
              {[...apps]
                .sort((a, b) => b.installs7d - a.installs7d)
                .map((a) => (
                  <div key={a.id} className="px-4 py-2.5 flex items-center gap-3">
                    <div className="size-7 rounded-sm bg-muted grid place-items-center font-mono text-[11px] text-muted-foreground">
                      {a.name.slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] truncate">{a.name}</div>
                      <div className="font-mono text-[10px] text-muted-foreground truncate">
                        {a.bundle}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[12px] tabular-nums">
                        {fmtNum(a.installs7d)}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        d7 {fmtPct(a.d7)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Panel>
        </div>

        <Panel
          title="live event stream"
          right={
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              streaming · 1.2k/s
            </span>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[12px]">
              <thead className="text-[10px] uppercase text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4 font-normal">ts</th>
                  <th className="text-left py-2 font-normal">app</th>
                  <th className="text-left py-2 font-normal">event</th>
                  <th className="text-left py-2 font-normal">user</th>
                  <th className="text-left py-2 font-normal">source</th>
                  <th className="text-right py-2 px-4 font-normal">value</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/40">
                    <td className="py-1.5 px-4 text-muted-foreground">{e.ts}</td>
                    <td className="py-1.5">{e.app}</td>
                    <td className="py-1.5">
                      <Pill
                        tone={
                          e.event === "purchase" || e.event === "subscription"
                            ? "ok"
                            : e.event === "install"
                              ? "info"
                              : "muted"
                        }
                      >
                        {e.event}
                      </Pill>
                    </td>
                    <td className="py-1.5 text-muted-foreground">{e.user}</td>
                    <td className="py-1.5 text-muted-foreground">{e.source}</td>
                    <td className="py-1.5 px-4 text-right tabular-nums">{e.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-border flex items-center justify-between font-mono text-[10px] text-muted-foreground">
            <span>showing last 10 · 4.2M this month</span>
            <a className="flex items-center gap-1 text-foreground hover:text-primary" href="#">
              open log <ArrowUpRight className="size-3" />
            </a>
          </div>
        </Panel>
      </div>
    </ConsoleLayout>
  );
}