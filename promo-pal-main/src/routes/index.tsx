import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Mail, Github, LineChart, NotebookPen, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GIROK labs — 기록으로 더 나은 삶을 만듭니다" },
      {
        name: "description",
        content:
          "GIROK labs는 건강·습관·자기계발 분야의 기록 서비스를 만듭니다. 개인화된 데이터 시각화와 기록 기반 자기계발 도구를 설계합니다.",
      },
      { property: "og:title", content: "GIROK labs — 기록으로 더 나은 삶을" },
      {
        property: "og:description",
        content:
          "건강·습관·자기계발 기록 서비스를 만드는 1인 스튜디오. 개인화된 데이터 시각화와 기록 기반 자기계발 도구.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const SERVICES = [
  {
    icon: LineChart,
    title: "한눈에 보는 투자·금융 지표",
    body: "실시간 환율과 기업 공시, 배당과 자산 흐름까지. 복잡한 시장 데이터를 한눈에 파악하고 더 나은 결정을 내리도록 돕습니다.",
  },
  {
    icon: NotebookPen,
    title: "일상의 번거로움을 덜어주는 도구",
    body: "HWP 문서 열람부터 놓치기 쉬운 알림과 생활 주기까지. 번거롭고 반복되는 일상을 한결 가볍고 편리하게 만듭니다.",
  },
  {
    icon: Sparkles,
    title: "나와 가족을 위한 건강·일상 기록",
    body: "혈관 건강과 아이의 기질 리포트, 소소한 하루의 메모까지. 매일 쌓이는 작은 기록들이 나를 더 깊이 이해하는 데이터가 됩니다.",
  },
];

const FIELDS = ["투자·금융", "생산성 도구", "건강·라이프", "데이터 시각화", "모바일 앱", "1인 스튜디오"];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center gap-6">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="size-7 rounded-[3px] bg-primary grid place-items-center font-display font-extrabold text-[13px] italic tracking-tight text-primary-foreground">
              GL
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              GIROK labs
            </span>
          </a>
          <div className="flex-1" />
          <nav className="hidden sm:flex items-center gap-7 text-[13px] text-muted-foreground">
            <a className="hover:text-foreground transition-colors" href="#work">
              What we build
            </a>
            <a className="hover:text-foreground transition-colors" href="#about">
              About
            </a>
            <a className="hover:text-foreground transition-colors" href="#contact">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Incheon · Independent studio · Est. 2024
          </p>
          <h1 className="mt-7 font-display text-[2.6rem] leading-[1.06] sm:text-6xl font-extrabold tracking-[-0.035em] max-w-3xl">
            기록을 통해
            <br />
            <span className="relative inline-block">
              <span className="absolute inset-x-[-2px] bottom-1 h-3 sm:h-4 bg-primary -z-0" />
              <span className="relative">더 나은 삶</span>
            </span>
            을 만듭니다.
          </h1>
          <p className="mt-8 max-w-xl text-[15px] sm:text-base leading-relaxed text-muted-foreground">
            GIROK labs는 건강, 투자, 생산성앱 등 다양한 분야의 기록 서비스를 만드는 1인
            스튜디오입니다.
            <br />
            매일의 작은 기록이 스스로를 이해하는 데이터가 되도록 설계합니다.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-[3px] bg-foreground text-background text-[13px] font-medium hover:opacity-90 transition-opacity"
            >
              함께 일하기 <ArrowUpRight className="size-4" />
            </a>
            <a
              href="https://github.com/giroklabs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-[3px] border border-border text-[13px] font-medium hover:bg-secondary transition-colors"
            >
              <Github className="size-4" /> github.com/giroklabs
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="work" className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-[11px] text-muted-foreground">01</span>
            <h2 className="font-display text-2xl font-bold tracking-tight">주요 서비스</h2>
          </div>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-3 border border-border">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <article key={s.title} className="bg-card p-7 group">
                  <Icon className="size-5 text-foreground" strokeWidth={1.5} />
                  <h3 className="mt-6 font-display text-[17px] font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                  <span className="mt-6 block h-[2px] w-8 bg-primary transition-all duration-300 group-hover:w-16" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20 grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-[11px] text-muted-foreground">02</span>
            <h2 className="font-display text-2xl font-bold tracking-tight">About</h2>
          </div>
          <div>
            <p className="text-[15px] leading-relaxed">
              기록은 가장 조용한 형태의 자기 이해입니다. 우리는 사용자가 남긴 데이터를 과장 없이
              보여 주고, 그 안에서 스스로 방향을 찾을 수 있도록 돕는 도구를 만듭니다.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              기획부터 디자인, 개발, 운영까지 한 사람의 손에서 끝까지 다듬어집니다. 그래서 만드는
              제품의 수는 적지만, 하나하나 오래 씁니다.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {FIELDS.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground"
                >
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="/console"
              className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-medium hover:text-muted-foreground transition-colors"
            >
              내부 운영 콘솔 보기 <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-[11px] text-muted-foreground">03</span>
            <h2 className="font-display text-2xl font-bold tracking-tight">연락처</h2>
          </div>
          <div className="mt-10 border-t border-border">
            <a
              href="mailto:greego86@gmail.com"
              className="flex items-center gap-4 border-b border-border py-6 group"
            >
              <Mail className="size-4 text-muted-foreground" strokeWidth={1.5} />
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground w-20">
                Email
              </span>
              <span className="font-display text-lg sm:text-xl font-semibold tracking-tight">
                greego86@gmail.com
              </span>
              <span className="flex-1" />
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://github.com/giroklabs"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 border-b border-border py-6 group"
            >
              <Github className="size-4 text-muted-foreground" strokeWidth={1.5} />
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground w-20">
                GitHub
              </span>
              <span className="font-display text-lg sm:text-xl font-semibold tracking-tight">
                github.com/giroklabs
              </span>
              <span className="flex-1" />
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} GIROK labs</span>
          <span>
            개인정보처리방침은{" "}
            <a
              href="https://giroklabs.github.io/privacy.html"
              className="underline hover:text-foreground transition-colors"
            >
              여기
            </a>
            에서 확인하실 수 있습니다.
          </span>
          <span className="flex-1" />
          <span>Made in Incheon</span>
        </div>
      </footer>
    </div>
  );
}
