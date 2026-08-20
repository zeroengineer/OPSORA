const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

/** Unique {{token}} names in a template body, in first-seen order. */
export function extractTemplateVariables(body: string): string[] {
  const seen = new Set<string>();
  const matches = body.matchAll(VARIABLE_PATTERN);

  for (const match of matches) {
    const name = match[1];
    if (name) seen.add(name);
  }

  return [...seen];
}

/** Substitutes {{token}} with its value; leaves unmatched tokens literal. */
export function renderTemplate(body: string, variables: Record<string, string>): string {
  return body.replace(VARIABLE_PATTERN, (match, name: string) => {
    const value = variables[name];
    return value && value.length > 0 ? value : match;
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineFormat(text: string): string {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

/**
 * Line-based markdown renderer supporting #, ##, "- " bullets and **bold**.
 * Intentionally minimal — matches exactly what the document templates use,
 * not a general-purpose markdown engine.
 */
export function renderMarkdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let inList = false;

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.length === 0) {
      closeList();
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inlineFormat(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      closeList();
      html.push(`<h1>${inlineFormat(line.slice(2))}</h1>`);
    } else if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineFormat(line.slice(2))}</li>`);
    } else {
      closeList();
      html.push(`<p>${inlineFormat(line)}</p>`);
    }
  }

  closeList();
  return html.join("\n");
}
