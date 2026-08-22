import { MONO_FONT_STACK } from "@opsora/config";

/**
 * Scalar theme matching the OPSORA design system.
 *
 * The plugin ships a pink/indigo default; these are the same tokens the web
 * app defines in `apps/web/src/index.css`, so the API reference reads as part
 * of the product rather than a third-party page bolted onto it.
 *
 * Passed to Scalar as `customCss`, which it injects after its own stylesheet.
 */
export const scalarTheme = `
:root, .light-mode, .dark-mode {
  --scalar-color-1: #f6f6f6;
  --scalar-color-2: #9a9a9a;
  --scalar-color-3: #5c5c5c;
  --scalar-color-accent: #e10600;

  --scalar-background-1: #050505;
  --scalar-background-2: #101010;
  --scalar-background-3: #171717;
  --scalar-background-accent: #2a0b09;

  --scalar-border-color: #252525;

  --scalar-font: ${MONO_FONT_STACK};
  --scalar-font-code: ${MONO_FONT_STACK};

  --scalar-radius: 10px;
  --scalar-radius-lg: 16px;
  --scalar-radius-xl: 20px;
}

.light-mode .t-doc__sidebar,
.dark-mode .t-doc__sidebar {
  --scalar-sidebar-background-1: #101010;
  --scalar-sidebar-color-1: #f6f6f6;
  --scalar-sidebar-color-2: #9a9a9a;
  --scalar-sidebar-border-color: #252525;

  --scalar-sidebar-item-hover-background: #171717;
  --scalar-sidebar-item-hover-color: #f6f6f6;

  --scalar-sidebar-item-active-background: #2a0b09;
  --scalar-sidebar-color-active: #e10600;

  --scalar-sidebar-search-background: #171717;
  --scalar-sidebar-search-color: #5c5c5c;
  --scalar-sidebar-search-border-color: #252525;
}

:root, .light-mode, .dark-mode {
  --scalar-button-1: #f6f6f6;
  --scalar-button-1-color: #050505;
  --scalar-button-1-hover: #ffffff;

  --scalar-color-green: #a3ffa9;
  --scalar-color-red: #e10600;
  --scalar-color-yellow: #fffca3;
  --scalar-color-blue: #a5d6ff;
  --scalar-color-orange: #e2ae83;
  --scalar-color-purple: #d2a8ff;

  --scalar-scrollbar-color: #252525;
  --scalar-scrollbar-color-active: #5c5c5c;
}

/* The stock header flare is a rainbow gradient; OPSORA uses one accent. */
.section-flare {
  width: 100%;
  height: 420px;
  position: absolute;
  background:
    radial-gradient(ellipse 60% 100% at 78% 0%, #e1060022, transparent 70%),
    radial-gradient(ellipse 50% 100% at 20% 0%, #ffffff08, transparent 70%);
  pointer-events: none;
}
`;
