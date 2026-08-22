import { APP_NAME, ROUTES } from "@opsora/config";
import { Link } from "react-router";

import { Wordmark } from "@/components/common/Wordmark.tsx";
import { StatusDot } from "@/components/common/StatusDot.tsx";
import { LIVE_MODULE_COUNT, MODULES, MODULE_COUNT } from "@/lib/modules.ts";
import { useSession } from "@/lib/auth-client.ts";

const CTA_PRIMARY =
  "rounded-pill bg-red px-[26px] py-3.5 text-xs uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-85";
const CTA_SECONDARY =
  "rounded-pill border border-line px-[26px] py-3.5 text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:border-red";

const PROPOSITIONS = [
  {
    title: "Money, in one ledger",
    body: "Income and expenses tracked against a single running balance, with the opening and closing figures always in view — no reconciling two tools at month end.",
  },
  {
    title: "Documents that write themselves",
    body: "Markdown templates with dynamic variables. Fill the fields, generate the document, and it lands in the vault with its version history intact.",
  },
  {
    title: "One system, not eleven tools",
    body: "Every module writes into the same workspace, so a document knows its client and a payment knows its invoice without anyone copying anything across.",
  },
];

export function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen flex-col gap-2 bg-bg p-2">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-card border border-line bg-surface px-[22px] py-3.5">
        <div className="flex items-center gap-2.5">
          <Wordmark size={26} />
          <span className="text-[13px] font-semibold tracking-[0.16em] text-ink">
            {APP_NAME}
          </span>
        </div>

        <nav className="flex flex-1 gap-[22px] sm:pl-4">
          <a href="#platform" className="text-[11.5px] text-mid hover:text-ink">
            Platform
          </a>
          <a href="#modules" className="text-[11.5px] text-mid hover:text-ink">
            Modules
          </a>
        </nav>

        {session ? (
          <Link to={ROUTES.dashboard} className={CTA_PRIMARY}>
            Open workspace
          </Link>
        ) : (
          <>
            <Link
              to={ROUTES.login}
              className="rounded-pill border border-line px-[18px] py-2.5 text-[11px] uppercase tracking-[0.1em] text-ink transition-colors hover:border-red"
            >
              Sign in
            </Link>
            <Link
              to={ROUTES.signup}
              className="rounded-pill bg-red px-5 py-2.5 text-[11px] uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-85"
            >
              Get started
            </Link>
          </>
        )}
      </header>

      <section className="flex flex-col items-center gap-[22px] overflow-hidden rounded-panel border border-line bg-surface px-6 pt-[70px] sm:px-[60px]">
        <span className="text-[10px] uppercase tracking-[0.24em] text-red">
          Business operating system
        </span>

        <h1 className="max-w-[940px] text-center text-[clamp(34px,7vw,60px)] font-medium leading-[1.04] tracking-[-0.045em] text-ink text-pretty">
          One system for clients, sales, finances, documents and knowledge.
        </h1>

        <p className="max-w-[560px] text-center text-[13.5px] leading-[1.7] text-mid text-pretty">
          {APP_NAME} centralizes the operations a small company runs on, so nothing lives
          in a spreadsheet, an inbox, or someone&rsquo;s memory.
        </p>

        <div className="flex flex-wrap justify-center gap-2.5 pt-1">
          {session ? (
            <Link to={ROUTES.dashboard} className={CTA_PRIMARY}>
              Open workspace
            </Link>
          ) : (
            <>
              <Link to={ROUTES.signup} className={CTA_PRIMARY}>
                Create account
              </Link>
              <Link to={ROUTES.login} className={CTA_SECONDARY}>
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* The ledger, abstracted: a field of dots where the settled rows below
            the line carry the accent. The same mark the dashboard chart uses. */}
        <div
          aria-hidden
          className="dot-field relative mt-[26px] h-[190px] w-full max-w-[1000px] rounded-t-card border border-b-0 border-line bg-surface-2"
          style={{ "--dot-step": "14px" } as React.CSSProperties}
        >
          <div
            className="absolute inset-x-0 bottom-0 h-24 opacity-55"
            style={{
              backgroundImage:
                "radial-gradient(var(--color-red) 1.6px, transparent 1.6px)",
              backgroundSize: "14px 14px",
            }}
          />
        </div>
      </section>

      <section id="platform" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {PROPOSITIONS.map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-3 rounded-card border border-line bg-surface px-[22px] pb-[22px] pt-6"
          >
            <StatusDot tone="red" />
            <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">
              {card.title}
            </h2>
            <p className="text-xs leading-[1.65] text-mid text-pretty">{card.body}</p>
          </div>
        ))}
      </section>

      <section
        id="modules"
        className="rounded-card border border-line bg-surface px-[26px] pb-[22px] pt-[26px]"
      >
        <div className="flex items-baseline justify-between gap-4 border-b border-line-2 pb-4">
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-mid">
            The {MODULE_COUNT} modules
          </h2>
          <span className="text-[9px] uppercase tracking-[0.08em] text-faint">
            {LIVE_MODULE_COUNT} live · {MODULE_COUNT - LIVE_MODULE_COUNT} specified
          </span>
        </div>

        <div className="mt-4 grid gap-px overflow-hidden rounded-input bg-line-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {MODULES.map((module) => (
            <div
              key={module.ordinal}
              className="flex flex-col gap-2 bg-surface px-4 pb-[18px] pt-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-faint tabular-nums">
                  {String(module.ordinal).padStart(2, "0")}
                </span>
                <StatusDot tone={module.live ? "red" : "off"} />
              </div>
              <span className="text-xs leading-[1.4] text-ink">{module.title}</span>
              <span className="text-[9px] uppercase tracking-[0.1em] text-faint">
                {module.live ? "Live" : "Specified"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-2 px-[22px] pb-3 pt-[22px] text-[9.5px] uppercase tracking-[0.08em] text-faint">
        <span>{APP_NAME} · Business operating system</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

export default LandingPage;
