
import { StatusDot } from "@/components/common/StatusDot.tsx";
import { MODULE_COUNT, MODULES, moduleByRoute } from "@/lib/modules.ts";

/**
 * Placeholder for a module that is specified but not built. The dot row is a
 * position indicator, not decoration: it shows where this module sits in the
 * platform's eleven, which one you are looking at, and which are already live.
 */
export function ModuleStub({ route }: { route: string }) {
  const module = moduleByRoute(route);
  if (!module) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[18px] px-[30px] py-[70px] text-center">
      <div className="flex gap-[5px]">
        {MODULES.map((entry) => (
          <StatusDot
            key={entry.ordinal}
            size={6}
            tone={
              entry.ordinal === module.ordinal ? "red" : entry.live ? "faint" : "off"
            }
          />
        ))}
      </div>

      <p className="text-[10px] uppercase tracking-[0.2em] text-faint">
        Module {String(module.ordinal).padStart(2, "0")} of {MODULE_COUNT} · specified,
        not yet built
      </p>

      <h1 className="text-2xl font-semibold text-ink">{module.title}</h1>

      <p className="max-w-[440px] text-[13px] leading-[1.6] text-mid text-pretty">
        {module.description}
      </p>
    </div>
  );
}
