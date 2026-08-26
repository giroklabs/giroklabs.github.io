import { createFileRoute } from "@tanstack/react-router";
import { ConsoleLayout, Panel } from "@/components/console-layout";
import { fmtNum, segments } from "@/lib/mock-data";

export const Route = createFileRoute("/segments")({
  component: SegmentsPage,
});

function SegmentsPage() {
  return (
    <ConsoleLayout
      title="Segments"
      subtitle="rule-based audiences"
      actions={
        <button className="h-8 rounded-sm bg-primary text-primary-foreground font-mono text-[11px] px-3 hover:bg-primary/90">
          + new segment
        </button>
      }
    >
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="segments" className="lg:col-span-2">
          <div className="divide-y divide-border">
            {segments.map((s) => (
              <div key={s.id} className="px-4 py-3 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px]">{s.name}</div>
                    <div className="font-mono text-[11px] text-muted-foreground mt-0.5 truncate">
                      {s.condition}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[15px] tabular-nums">{fmtNum(s.size)}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      users · upd {s.updated}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="condition editor">
          <div className="p-4 space-y-3 font-mono text-[12px]">
            <div className="rounded-sm bg-muted/60 border border-border p-3 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground">WHEN</span>
                <span className="rounded-sm bg-card border border-border px-1.5 py-0.5">app</span>
                <span className="text-muted-foreground">=</span>
                <span className="rounded-sm bg-card border border-border px-1.5 py-0.5">Focus Timer</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground pl-8">AND</span>
                <span className="rounded-sm bg-card border border-border px-1.5 py-0.5">last_open</span>
                <span className="text-muted-foreground">&gt;</span>
                <span className="rounded-sm bg-card border border-border px-1.5 py-0.5">3d</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground pl-8">AND NOT</span>
                <span className="rounded-sm bg-card border border-border px-1.5 py-0.5">purchase</span>
                <span className="text-muted-foreground">in</span>
                <span className="rounded-sm bg-card border border-border px-1.5 py-0.5">30d</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between text-[11px]">
              <span className="text-muted-foreground">estimated size</span>
              <span className="text-primary text-lg tabular-nums">8,420 users</span>
            </div>
            <button className="w-full h-9 rounded-sm bg-primary text-primary-foreground text-[11px]">
              save segment
            </button>
          </div>
        </Panel>
      </div>
    </ConsoleLayout>
  );
}