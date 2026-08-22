import { APP_NAME, ROUTES } from "@opsora/config";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { Wordmark } from "@/components/common/Wordmark.tsx";
import { StatusDot } from "@/components/common/StatusDot.tsx";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  pitch: string;
  points: string[];
  children: ReactNode;
}

/** Two-column split screen shared by the login and signup pages. */
export function AuthLayout({ title, subtitle, pitch, points, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 gap-2 bg-bg p-2 lg:grid-cols-2">
      <div className="dot-field hidden flex-col justify-between rounded-panel border border-line bg-surface p-[34px] lg:flex">
        <Link to={ROUTES.home} className="flex w-fit items-center gap-2.5">
          <Wordmark size={26} className="bg-surface" />
          <span className="text-[13px] font-semibold tracking-[0.16em] text-ink">
            {APP_NAME}
          </span>
        </Link>

        <div className="flex max-w-[400px] flex-col gap-[18px]">
          <p className="text-[28px] font-medium leading-[1.2] tracking-[-0.035em] text-ink text-pretty">
            {pitch}
          </p>

          <ul className="flex flex-col gap-[9px]">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-2.5">
                <StatusDot tone="red" />
                <span className="text-[11.5px] text-mid">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[9px] uppercase tracking-[0.16em] text-faint">
          Secure workspace · Single tenant
        </p>
      </div>

      <div className="flex items-center justify-center rounded-panel border border-line bg-surface p-6 sm:p-[34px]">
        <div className="flex w-full max-w-[360px] flex-col gap-5">
          <Link to={ROUTES.home} className="flex w-fit items-center gap-2.5 lg:hidden">
            <Wordmark size={26} />
            <span className="text-[13px] font-semibold tracking-[0.16em] text-ink">
              {APP_NAME}
            </span>
          </Link>

          <div className="flex flex-col gap-[7px]">
            <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
              {title}
            </h1>
            <p className="text-[11.5px] text-mid">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
