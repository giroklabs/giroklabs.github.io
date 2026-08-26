export type AppRow = {
  id: string;
  name: string;
  bundle: string;
  platform: "iOS" | "Android" | "iOS+Android";
  category: string;
  installs7d: number;
  dau: number;
  d7: number;
  arpdau: number;
  status: "live" | "review" | "paused";
};

export const apps: AppRow[] = [
  { id: "com.orbit.focus", name: "Focus Timer", bundle: "com.orbit.focus", platform: "iOS+Android", category: "Productivity", installs7d: 12480, dau: 5230, d7: 0.34, arpdau: 0.12, status: "live" },
  { id: "com.orbit.ledger", name: "Ledger", bundle: "com.orbit.ledger", platform: "iOS", category: "Finance", installs7d: 3820, dau: 1980, d7: 0.41, arpdau: 0.28, status: "live" },
  { id: "com.orbit.habit", name: "HabitLoop", bundle: "com.orbit.habit", platform: "Android", category: "Health", installs7d: 8140, dau: 2610, d7: 0.29, arpdau: 0.09, status: "live" },
  { id: "com.orbit.notes", name: "Slate Notes", bundle: "com.orbit.notes", platform: "iOS+Android", category: "Productivity", installs7d: 6220, dau: 3110, d7: 0.37, arpdau: 0.05, status: "live" },
  { id: "com.orbit.weather", name: "Skycast", bundle: "com.orbit.weather", platform: "iOS", category: "Weather", installs7d: 15020, dau: 6890, d7: 0.22, arpdau: 0.03, status: "review" },
  { id: "com.orbit.vpn", name: "Tunnel VPN", bundle: "com.orbit.vpn", platform: "Android", category: "Utilities", installs7d: 4610, dau: 1240, d7: 0.18, arpdau: 0.44, status: "paused" },
];

export const kpis = {
  installs30d: 189420,
  dau: 21060,
  d7: 0.31,
  arpu: 0.14,
  autoRules: 24,
  msgsSent: 486210,
};

export const installsSeries = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const base = 5200 + Math.sin(i / 3) * 900 + i * 40;
  return {
    date: d.toISOString().slice(5, 10),
    organic: Math.round(base + Math.random() * 300),
    paid: Math.round(base * 0.45 + Math.random() * 200),
    crosspromo: Math.round(base * 0.28 + Math.random() * 150),
  };
});

export const retentionCohorts = [
  { cohort: "W-01", d1: 0.58, d3: 0.42, d7: 0.34, d14: 0.27, d30: 0.21 },
  { cohort: "W-02", d1: 0.61, d3: 0.44, d7: 0.36, d14: 0.28, d30: 0.22 },
  { cohort: "W-03", d1: 0.55, d3: 0.4, d7: 0.32, d14: 0.25, d30: 0.19 },
  { cohort: "W-04", d1: 0.63, d3: 0.47, d7: 0.38, d14: 0.3, d30: 0.24 },
  { cohort: "W-05", d1: 0.6, d3: 0.45, d7: 0.36, d14: 0.29, d30: 0.23 },
];

export const events = [
  { ts: "11:24:03", app: "Focus Timer", event: "purchase", user: "u_9f2b1", value: "$9.99", source: "crosspromo" },
  { ts: "11:24:01", app: "Skycast", event: "install", user: "u_a01c4", value: "-", source: "aso_search" },
  { ts: "11:23:58", app: "Ledger", event: "paywall_view", user: "u_712dd", value: "-", source: "push" },
  { ts: "11:23:55", app: "HabitLoop", event: "open", user: "u_5540e", source: "direct", value: "-" },
  { ts: "11:23:52", app: "Slate Notes", event: "signup", user: "u_88a0f", source: "referral", value: "-" },
  { ts: "11:23:47", app: "Focus Timer", event: "subscription", user: "u_44120", value: "$49.00/yr", source: "inapp_msg" },
  { ts: "11:23:41", app: "Skycast", event: "open", user: "u_c8871", source: "aso_browse", value: "-" },
  { ts: "11:23:38", app: "Ledger", event: "purchase", user: "u_2ab99", value: "$4.99", source: "push" },
  { ts: "11:23:31", app: "Tunnel VPN", event: "install", user: "u_e1102", source: "paid_google", value: "-" },
  { ts: "11:23:28", app: "HabitLoop", event: "signup", user: "u_63f22", source: "crosspromo", value: "-" },
];

export const links = [
  { id: "lnk_01", app: "Focus Timer", channel: "twitter", campaign: "launch_v3", clicks: 4210, installs: 612, cvr: 0.145 },
  { id: "lnk_02", app: "Ledger", channel: "reddit", campaign: "r_personalfinance", clicks: 1820, installs: 289, cvr: 0.159 },
  { id: "lnk_03", app: "HabitLoop", channel: "tiktok", campaign: "creator_pack_a", clicks: 12480, installs: 1104, cvr: 0.088 },
  { id: "lnk_04", app: "Skycast", channel: "web", campaign: "landing_hero", clicks: 6220, installs: 890, cvr: 0.143 },
  { id: "lnk_05", app: "Slate Notes", channel: "newsletter", campaign: "issue_042", clicks: 980, installs: 201, cvr: 0.205 },
  { id: "lnk_06", app: "Tunnel VPN", channel: "google_ads", clicks: 8420, installs: 612, cvr: 0.073, campaign: "search_privacy" },
];

export const segments = [
  { id: "seg_01", name: "Dormant 3d — Focus Timer", size: 8420, condition: "app=Focus Timer AND last_open > 3d", updated: "2m ago" },
  { id: "seg_02", name: "Paywall abandoners — Ledger", size: 1240, condition: "paywall_view AND NOT purchase (24h)", updated: "8m ago" },
  { id: "seg_03", name: "Cross-portfolio candidates", size: 15680, condition: "user_in(Focus Timer) AND NOT installed(Slate Notes)", updated: "12m ago" },
  { id: "seg_04", name: "High LTV — Any", size: 2109, condition: "ltv >= $20 AND active_30d", updated: "1h ago" },
  { id: "seg_05", name: "KR iOS active 7d", size: 6420, condition: "country=KR AND platform=iOS AND active_7d", updated: "1h ago" },
];

export const automations = [
  { id: "auto_01", name: "Reactivate D3 dormant", trigger: "user enters Dormant 3d", action: "Send push: '아직 집중이 필요해요?'", status: "on", ran: 3120, cvr: 0.14 },
  { id: "auto_02", name: "Paywall recovery", trigger: "paywall_view + 6h no purchase", action: "In-app: '첫 달 50% 할인'", status: "on", ran: 812, cvr: 0.22 },
  { id: "auto_03", name: "Cross-promo Focus→Slate", trigger: "Focus Timer 7d active + not installed Slate", action: "Show cross-promo card", status: "on", ran: 9210, cvr: 0.061 },
  { id: "auto_04", name: "KR launch teaser", trigger: "country=KR AND app=Skycast", action: "Push: '새 위젯이 도착했어요'", status: "paused", ran: 0, cvr: 0 },
  { id: "auto_05", name: "High LTV thanks", trigger: "ltv crosses $20", action: "In-app thanks + review prompt", status: "on", ran: 421, cvr: 0.38 },
];

export const crosspromo = [
  { from: "Focus Timer", to: "Slate Notes", slot: "session_end_card", impressions: 42100, clicks: 3120, installs: 512, cvr: 0.164 },
  { from: "Ledger", to: "Focus Timer", slot: "settings_banner", impressions: 12800, clicks: 620, installs: 88, cvr: 0.142 },
  { from: "HabitLoop", to: "Focus Timer", slot: "streak_complete", impressions: 22400, clicks: 2810, installs: 402, cvr: 0.143 },
  { from: "Slate Notes", to: "Ledger", slot: "onboarding_step_3", impressions: 6100, clicks: 410, installs: 71, cvr: 0.173 },
  { from: "Skycast", to: "HabitLoop", slot: "morning_widget", impressions: 31200, clicks: 1620, installs: 189, cvr: 0.117 },
];

export const asoVersions = [
  { app: "Focus Timer", locale: "en-US", version: "v14", title: "Focus Timer — Deep Work", subtitle: "Pomodoro that respects you", updated: "2d", cvrLift: 0.08 },
  { app: "Focus Timer", locale: "ko-KR", version: "v9", title: "포커스 타이머 — 딥워크", subtitle: "존중하는 뽀모도로", updated: "5d", cvrLift: 0.12 },
  { app: "Ledger", locale: "en-US", version: "v22", title: "Ledger — Personal Finance", subtitle: "One tap. Zero fluff.", updated: "1d", cvrLift: 0.04 },
  { app: "HabitLoop", locale: "en-US", version: "v7", title: "HabitLoop — Streaks", subtitle: "Small loops, big change", updated: "9d", cvrLift: -0.02 },
  { app: "Skycast", locale: "en-US", version: "v31", title: "Skycast — Minimal Weather", subtitle: "Just the forecast", updated: "3h", cvrLift: 0.19 },
  { app: "Slate Notes", locale: "ja-JP", version: "v4", title: "スレートノート", subtitle: "静かに書く場所", updated: "6d", cvrLift: 0.06 },
];

export function fmtNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k";
  return n.toString();
}

export function fmtPct(n: number) {
  return (n * 100).toFixed(1) + "%";
}