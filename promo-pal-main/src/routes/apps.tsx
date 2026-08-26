import { createFileRoute } from "@tanstack/react-router";
import { ConsoleLayout, Panel, Pill } from "@/components/console-layout";
import { apps, fmtNum, fmtPct } from "@/lib/mock-data";

export const Route = createFileRoute("/apps")({
  component: AppsPage,
});

function AppsPage() {
  return (
    <ConsoleLayout
      title="Apps"
      subtitle={`${apps.length} registered · portfolio`}
      actions={
        <button className="h-8 rounded-sm bg-primary text-primary-foreground font-mono text-[11px] px-3 hover:bg-primary/90">
          + register app
        </button>
      }
    >
      <div className="p-6">
        <Panel title="registered apps">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="font-mono text-[10px] uppercase text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-4 font-normal">app</th>
                  <th className="text-left py-2.5 font-normal">bundle</th>
                  <th className="text-left py-2.5 font-normal">platform</th>
                  <th className="text-left py-2.5 font-normal">category</th>
                  <th className="text-right py-2.5 font-normal">installs 7d</th>
                  <th className="text-right py-2.5 font-normal">dau</th>
                  <th className="text-right py-2.5 font-normal">d7</th>
                  <th className="text-right py-2.5 font-normal">arpdau</th>
                  <th className="text-left py-2.5 px-4 font-normal">status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-sm bg-muted grid place-items-center font-mono text-[11px] text-muted-foreground">
                          {a.name.slice(0, 2)}
                        </div>
                        <span>{a.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-muted-foreground">{a.bundle}</td>
                    <td className="py-2.5 font-mono text-[11px]">{a.platform}</td>
                    <td className="py-2.5 text-muted-foreground">{a.category}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{fmtNum(a.installs7d)}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{fmtNum(a.dau)}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{fmtPct(a.d7)}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">${a.arpdau.toFixed(2)}</td>
                    <td className="py-2.5 px-4">
                      <Pill tone={a.status === "live" ? "ok" : a.status === "review" ? "warn" : "muted"}>
                        {a.status}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </ConsoleLayout>
  );
}