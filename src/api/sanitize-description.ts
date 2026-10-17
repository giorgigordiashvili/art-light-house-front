// Dependency-free allowlist HTML sanitizer for CMS-provided rich text (server-side).
// Every allowed tag is rebuilt from scratch with only allowlisted, re-escaped attributes;
// all other markup is dropped and stray "<" / ">" in text are escaped.

const ALLOWED_TAGS = new Set([
  "address",
  "article",
  "aside",
  "footer",
  "header",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hgroup",
  "main",
  "nav",
  "section",
  "blockquote",
  "dd",
  "div",
  "dl",
  "dt",
  "figcaption",
  "figure",
  "hr",
  "li",
  "ol",
  "p",
  "pre",
  "ul",
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "br",
  "cite",
  "code",
  "data",
  "dfn",
  "em",
  "i",
  "kbd",
  "mark",
  "q",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr",
  "caption",
  "col",
  "colgroup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "img",
]);

const VOID_TAGS = new Set(["br", "hr", "img", "wbr", "col"]);

// Elements whose whole content is discarded, not just the tags.
const DROP_WITH_CONTENT = [
  "script",
  "style",
  "iframe",
  "textarea",
  "noscript",
  "xmp",
  "title",
  "template",
  "object",
  "embed",
  "noembed",
  "noframes",
];

const ALLOWED_ATTRS: Record<string, string[]> = {
  a: ["href", "target", "rel", "title"],
  img: ["src", "alt", "width", "height", "title"],
  "*": ["class"],
};

const URL_ATTRS = new Set(["href", "src"]);
const DEFAULT_SCHEMES = ["http", "https", "mailto", "tel"];
const SCHEMES_BY_TAG: Record<string, string[]> = { img: ["http", "https", "data"] };

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  colon: ":",
  tab: "\t",
  newline: "\n",
};

function decodeEntities(value: string) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);?/gi, (match, code: string) => {
    if (code[0] === "#") {
      const num =
        code[1] === "x" || code[1] === "X"
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);
      return Number.isFinite(num) && num >= 0 && num <= 0x10ffff ? String.fromCodePoint(num) : "";
    }
    const named = NAMED_ENTITIES[code.toLowerCase()];
    return named ?? match;
  });
}

function escapeAttr(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(value: string) {
  return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function isSafeUrl(raw: string, tag: string) {
  // Strip whitespace/control chars that browsers ignore inside schemes (e.g. "java\nscript:").
  const url = decodeEntities(raw)
    .replace(/[\u0000- \u007f-\u009f]/g, "")
    .toLowerCase();
  const schemeMatch = url.match(/^([a-z][a-z0-9+.-]*):/);
  if (!schemeMatch) {
    // Relative URL; reject anything that still contains a colon before a path delimiter.
    const firstDelim = url.search(/[/?#]/);
    const colon = url.indexOf(":");
    return colon === -1 || (firstDelim !== -1 && colon > firstDelim);
  }
  const allowed = SCHEMES_BY_TAG[tag] || DEFAULT_SCHEMES;
  if (!allowed.includes(schemeMatch[1])) return false;
  if (schemeMatch[1] === "data") return /^data:image\/(png|jpe?g|gif|webp|avif);/.test(url);
  return true;
}

function buildTag(tag: string, rawAttrs: string) {
  const allowed = [...(ALLOWED_ATTRS[tag] || []), ...ALLOWED_ATTRS["*"]];
  const attrs: Record<string, string> = {};
  const attrRe = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(rawAttrs))) {
    const name = m[1].toLowerCase();
    if (!allowed.includes(name) || name in attrs) continue;
    const value = m[2] ?? m[3] ?? m[4] ?? "";
    if (URL_ATTRS.has(name) && !isSafeUrl(value, tag)) continue;
    attrs[name] = decodeEntities(value);
  }
  if (tag === "a" && attrs.target === "_blank") attrs.rel = "noopener noreferrer";
  const serialized = Object.entries(attrs)
    .map(([k, v]) => ` ${k}="${escapeAttr(v)}"`)
    .join("");
  return `<${tag}${serialized}>`;
}

export function sanitizeDescription(html?: unknown): string | undefined {
  if (html == null) return undefined;
  if (typeof html !== "string") return undefined;

  let input = html.replace(/<!--[\s\S]*?(-->|$)/g, "");
  for (const tag of DROP_WITH_CONTENT) {
    input = input.replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}\\s*>`, "gi"), "");
  }

  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let out = "";
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(input))) {
    out += escapeText(input.slice(last, m.index));
    last = tagRe.lastIndex;
    const closing = m[1] === "/";
    const tag = m[2].toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) continue;
    if (closing) {
      if (!VOID_TAGS.has(tag)) out += `</${tag}>`;
    } else {
      out += buildTag(tag, m[3]);
    }
  }
  out += escapeText(input.slice(last));
  return out;
}
