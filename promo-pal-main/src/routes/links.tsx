import { createFileRoute } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { ConsoleLayout, Panel } from "@/components/console-layout";
import { fmtNum, fmtPct, links } from "@/lib/mock-data";

export const Route = createFileRoute("/links")({
  component: LinksPage,
});

function LinksPage() {
  return (
    <ConsoleLayout
      title="Campaign Links"
      subtitle="deep links · attribution"
      actions={
        <button className="h-8 rounded-sm bg-primary text-primary-foreground font-mono text-[11px] px-3 hover:bg-primary/90">
          + new link
        </button>
      }
    >
      <div className="p-6 space-y-6">
        <Panel title="link builder">
          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { l: "app", v: "Focus Timer" },
              { l: "channel", v: "twitter" },
              { l: "campaign", v: "launch_v3" },
              { l: "creative", v: "card_a" },
            ].map((f) => (
              <label key={f.l} className="block">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{f.l}</div>
                <input defaultValue={f.v} className="w-full h-8 rounded-sm bg-input/50 border border-border px-2 font-mono text-[12px] outline-none focus:border-primary" />
              </label>
            ))}
          </div>
          <div className="px-4 pb-4 flex items-center gap-2">
            <code className="flex-1 h-9 rounded-sm bg-muted/60 border border-border px-3 grid items-center font-mono text-[11px] text-muted-foreground overflow-x-auto whitespace-nowrap">
              https://orbit.link/l/focus?src=twitter&camp=launch_v3&cr=card_a&ddl=/onboard
            </code>
            <button className="h-9 rounded-sm border border-border px-3 font-mono text-[11px] hover:bg-muted flex items-center gap-1.5">
              <Copy className="size-3" /> copy
            </button>
          </div>
        </Panel>

        <Panel title="link performance · 7d">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="font-mono text-[10px] uppercase text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-4 font-normal">id</th>
                  <th className="text-left py-2.5 font-normal">app</th>
                  <th className="text-left py-2.5 font-normal">channel</th>
                  <th className="text-left py-2.5 font-normal">campaign</th>
                  <th className="text-right py-2.5 font-normal">clicks</th>
                  <th className="text-right py-2.5 font-normal">installs</th>
                  <th className="text-right py-2.5 px-4 font-normal">cvr</th>
                </tr>
              </thead>
              <tbody>
                {links.map((l) => (
                  <tr key={l.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-muted-foreground">{l.id}</td>
                    <td className="py-2.5">{l.app}</td>
                    <td className="py-2.5 font-mono text-[11px]">{l.channel}</td>
                    <td className="py-2.5 font-mono text-[11px] text-muted-foreground">{l.campaign}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{fmtNum(l.clicks)}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{fmtNum(l.installs)}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-primary">{fmtPct(l.cvr)}</td>
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