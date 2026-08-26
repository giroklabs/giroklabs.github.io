import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Zap } from "lucide-react";
import { ConsoleLayout, Panel, Pill } from "@/components/console-layout";
import { automations, fmtNum, fmtPct } from "@/lib/mock-data";

export const Route = createFileRoute("/automations")({
  component: AutomationsPage,
});

function AutomationsPage() {
  return (
    <ConsoleLayout
      title="Automations"
      subtitle="trigger → action rules"
      actions={
        <button className="h-8 rounded-sm bg-primary text-primary-foreground font-mono text-[11px] px-3 hover:bg-primary/90">
          + new rule
        </button>
      }
    >
      <div className="p-6 space-y-4">
        {automations.map((a) => (
          <Panel
            key={a.id}
            title={a.name}
            right={
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  ran {fmtNum(a.ran)} · cvr {fmtPct(a.cvr)}
                </span>
                <Pill tone={a.status === "on" ? "ok" : "muted"}>{a.status}</Pill>
              </div>
            }
          >
            <div className="p-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="rounded-sm bg-muted/40 border border-border p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  trigger
                </div>
                <div className="font-mono text-[12px]">{a.trigger}</div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
              <div className="rounded-sm bg-muted/40 border border-border p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  <Zap className="size-3" /> action
                </div>
                <div className="font-mono text-[12px]">{a.action}</div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </ConsoleLayout>
  );
}