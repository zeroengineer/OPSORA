import { APP_NAME } from "@opsora/config";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  pitch: string;
  points: string[];
  children: ReactNode;
}

/** Two-column split screen shared by the login and signup pages. */
export function AuthLayout({ title, subtitle, pitch, points, children }: AuthLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen grid-cols-1 gap-2 bg-bg p-2 lg:grid-cols-2">
      <div
        className="hidden flex-col justify-between rounded-panel border border-line bg-surface p-10 lg:flex"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-dot-off) 1.4px, transparent 1.4px)",
          backgroundSize: "16px 16px",
        }}
      >
        <button
          type="button"
          onClick={() => void navigate("/")}
          className="flex w-fit items-center gap-2"
        >
          <span className="size-2 rounded-full bg-red" />
          <span className="text-sm font-semibold tracking-[0.24em] text-ink">
            {APP_NAME}
          </span>
        </button>

        <div className="max-w-md">
          <p className="text-[28px] font-medium leading-tight text-ink text-wrap-pretty">
            {pitch}
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-mid">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-red" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[10px] uppercase tracking-[0.18em] text-faint">
          Secure workspace · Single tenant
        </p>
      </div>

      <div className="flex items-center justify-center rounded-panel border border-line bg-surface p-6">
        <div className="w-full max-w-[360px]">
          <h1 className="text-2xl font-medium text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-mid">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
