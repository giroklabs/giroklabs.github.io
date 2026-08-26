import { createFileRoute } from "@tanstack/react-router";
import { ConsoleLayout, Panel } from "@/components/console-layout";
import { asoVersions, fmtPct } from "@/lib/mock-data";

export const Route = createFileRoute("/aso")({
  component: AsoPage,
});

function AsoPage() {
  return (
    <ConsoleLayout title="ASO" subtitle="metadata versions · localized copy">
      <div className="p-6 space-y-6">
        <Panel title="metadata versions">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="font-mono text-[10px] uppercase text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-4 font-normal">app</th>
                  <th className="text-left py-2.5 font-normal">locale</th>
                  <th className="text-left py-2.5 font-normal">ver</th>
                  <th className="text-left py-2.5 font-normal">title</th>
                  <th className="text-left py-2.5 font-normal">subtitle</th>
                  <th className="text-right py-2.5 font-normal">updated</th>
                  <th className="text-right py-2.5 px-4 font-normal">cvr Δ</th>
                </tr>
              </thead>
              <tbody>
                {asoVersions.map((v, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2.5 px-4">{v.app}</td>
                    <td className="py-2.5 font-mono text-[11px]">{v.locale}</td>
                    <td className="py-2.5 font-mono text-[11px] text-muted-foreground">{v.version}</td>
                    <td className="py-2.5">{v.title}</td>
                    <td className="py-2.5 text-muted-foreground">{v.subtitle}</td>
                    <td className="py-2.5 text-right font-mono text-[11px] text-muted-foreground">{v.updated}</td>
                    <td className={"py-2.5 px-4 text-right font-mono tabular-nums " + (v.cvrLift >= 0 ? "text-primary" : "text-destructive")}>
                      {v.cvrLift >= 0 ? "+" : ""}
                      {fmtPct(v.cvrLift)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="active A/B tests">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {[
              { app: "Focus Timer", assay: "screenshot_hero_v3_vs_v2", lift: "+18%", conf: "97%" },
              { app: "Ledger", assay: "icon_dark_vs_gradient", lift: "+4%", conf: "62%" },
              { app: "Skycast", assay: "subtitle_minimal_vs_data", lift: "+11%", conf: "88%" },
              { app: "HabitLoop", assay: "screenshot_streak_hero", lift: "-2%", conf: "44%" },
            ].map((t, i) => (
              <div key={i} className="bg-card p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t.app}</div>
                <div className="mt-1 font-mono text-[12px]">{t.assay}</div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className={"font-mono text-lg " + (t.lift.startsWith("+") ? "text-primary" : "text-destructive")}>{t.lift}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">conf {t.conf}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </ConsoleLayout>
  );
}