import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ConsoleLayout, Panel } from "@/components/console-layout";
import { apps, fmtPct, retentionCohorts } from "@/lib/mock-data";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const barData = apps.map((a) => ({ name: a.name, installs: a.installs7d, dau: a.dau }));

  return (
    <ConsoleLayout title="Reports" subtitle="cohorts · funnels · channels">
      <div className="p-6 space-y-6">
        <Panel title="installs vs dau · by app · 7d">
          <div className="h-72 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={40} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                  }}
                />
                <Bar dataKey="installs" fill="var(--color-chart-1)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="dau" fill="var(--color-chart-2)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="retention cohorts">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] font-mono">
              <thead className="text-[10px] uppercase text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4 font-normal">cohort</th>
                  <th className="text-right py-2 font-normal">d1</th>
                  <th className="text-right py-2 font-normal">d3</th>
                  <th className="text-right py-2 font-normal">d7</th>
                  <th className="text-right py-2 font-normal">d14</th>
                  <th className="text-right py-2 px-4 font-normal">d30</th>
                </tr>
              </thead>
              <tbody>
                {retentionCohorts.map((c) => (
                  <tr key={c.cohort} className="border-b border-border/50">
                    <td className="py-2 px-4">{c.cohort}</td>
                    {(["d1", "d3", "d7", "d14", "d30"] as const).map((k, i) => {
                      const v = c[k];
                      const alpha = Math.max(0.08, v);
                      return (
                        <td
                          key={k}
                          className={"py-2 text-right tabular-nums " + (i === 4 ? "px-4" : "")}
                          style={{ background: `oklch(0.82 0.17 148 / ${alpha * 0.35})` }}
                        >
                          {fmtPct(v)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title="paywall funnel · Ledger">
            <div className="p-4 space-y-2 font-mono text-[12px]">
              {[
                { s: "open", n: 12480, w: 1 },
                { s: "paywall_view", n: 4210, w: 0.34 },
                { s: "checkout_start", n: 1820, w: 0.15 },
                { s: "purchase", n: 612, w: 0.05 },
              ].map((r) => (
                <div key={r.s}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>{r.s}</span>
                    <span className="tabular-nums text-muted-foreground">{r.n.toLocaleString()}</span>
                  </div>
                  <div className="h-6 mt-1 rounded-sm bg-muted/60 overflow-hidden">
                    <div className="h-full bg-primary/70" style={{ width: r.w * 100 + "%" }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="channel mix · 30d">
            <div className="p-4 space-y-3 font-mono text-[12px]">
              {[
                { s: "organic", pct: 0.52 },
                { s: "aso_search", pct: 0.18 },
                { s: "crosspromo", pct: 0.14 },
                { s: "paid_google", pct: 0.09 },
                { s: "referral", pct: 0.04 },
                { s: "push_reactivation", pct: 0.03 },
              ].map((c) => (
                <div key={c.s} className="grid grid-cols-[8rem_1fr_3rem] items-center gap-3">
                  <span>{c.s}</span>
                  <div className="h-2 rounded-sm bg-muted overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: c.pct * 100 + "%" }} />
                  </div>
                  <span className="text-right tabular-nums text-muted-foreground">{fmtPct(c.pct)}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </ConsoleLayout>
  );
}