import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ConsoleLayout, Panel } from "@/components/console-layout";
import { crosspromo, fmtNum, fmtPct } from "@/lib/mock-data";

export const Route = createFileRoute("/crosspromo")({
  component: CrossPromoPage,
});

function CrossPromoPage() {
  const totalInstalls = crosspromo.reduce((s, r) => s + r.installs, 0);
  const totalClicks = crosspromo.reduce((s, r) => s + r.clicks, 0);
  return (
    <ConsoleLayout title="Cross-promotion" subtitle="internal traffic loop · 7d">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-sm border border-border bg-card p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">internal installs</div>
            <div className="mt-2 font-mono text-2xl tabular-nums">{fmtNum(totalInstalls)}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">saved ≈ ${(totalInstalls * 1.4).toFixed(0)} in UA</div>
          </div>
          <div className="rounded-sm border border-border bg-card p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">clicks</div>
            <div className="mt-2 font-mono text-2xl tabular-nums">{fmtNum(totalClicks)}</div>
          </div>
          <div className="rounded-sm border border-border bg-card p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">avg cvr</div>
            <div className="mt-2 font-mono text-2xl tabular-nums text-primary">{fmtPct(totalInstalls / totalClicks)}</div>
          </div>
        </div>

        <Panel title="active promotion slots">
          <div className="divide-y divide-border">
            {crosspromo.map((r, i) => (
              <div key={i} className="px-4 py-3 grid grid-cols-[1fr_auto_1fr_auto_auto_auto] items-center gap-6">
                <div>
                  <div className="font-mono text-[10px] uppercase text-muted-foreground">from</div>
                  <div className="text-[13px]">{r.from}</div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
                <div>
                  <div className="font-mono text-[10px] uppercase text-muted-foreground">to</div>
                  <div className="text-[13px]">{r.to}</div>
                </div>
                <div className="text-right w-32">
                  <div className="font-mono text-[10px] uppercase text-muted-foreground">slot</div>
                  <div className="font-mono text-[11px]">{r.slot}</div>
                </div>
                <div className="text-right w-24">
                  <div className="font-mono text-[10px] uppercase text-muted-foreground">installs</div>
                  <div className="font-mono text-[13px] tabular-nums">{fmtNum(r.installs)}</div>
                </div>
                <div className="text-right w-20">
                  <div className="font-mono text-[10px] uppercase text-muted-foreground">cvr</div>
                  <div className="font-mono text-[13px] tabular-nums text-primary">{fmtPct(r.cvr)}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </ConsoleLayout>
  );
}