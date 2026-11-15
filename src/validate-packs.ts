import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const DIMENSIONS = [
  "requirements",
  "estimation",
  "architecture",
  "depth",
  "tradeoffs",
  "communication",
  "ai_concerns",
] as const;

const TOP_LEVEL_FIELDS = new Set([
  "company",
  "role",
  "level",
  "exclusive",
  "brief",
  "sources",
  "questions",
]);

const LEVELS = new Set(["mid", "senior", "staff"]);

export type PackIssue = {
  file: string;
  rule: string;
};

export type DiscoveredPack = {
  id: string;
  directory: string;
  packJsonFiles: string[];
  readText: () => string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function trimmed(value: unknown, min: number, max: number): value is string {
  return (
    typeof value === "string" &&
    value === value.trim() &&
    value.length >= min &&
    value.length <= max
  );
}

function unknownField(
  value: Record<string, unknown>,
  allowed: Set<string>,
): string | null {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) return `unknown field ${key}`;
  }
  return null;
}

function isHttpUrl(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    value.length === 0 ||
    value.length > 2000
  ) {
    return false;
  }
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isKebabId(id: string): boolean {
  return (
    id.length >= 1 && id.length <= 80 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)
  );
}

export function validatePackDocument(doc: unknown): string | null {
  if (!isRecord(doc)) return "pack must be a JSON object";

  const unknown = unknownField(doc, TOP_LEVEL_FIELDS);
  if (unknown) return unknown;
  if (!trimmed(doc.company, 1, 120))
    return "company must be a trimmed string of 1–120 characters";
  if (!trimmed(doc.role, 1, 120))
    return "role must be a trimmed string of 1–120 characters";
  if (typeof doc.level !== "string" || !LEVELS.has(doc.level))
    return "level must be mid, senior, or staff";
  if ("exclusive" in doc && typeof doc.exclusive !== "boolean")
    return "exclusive must be a boolean";
  if (!trimmed(doc.brief, 1, 4000))
    return "brief must be a trimmed string of 1–4000 characters";

  const sources = validateSources(doc.sources);
  if (sources) return sources;
  return validateQuestions(doc.questions);
}

function validateSources(value: unknown): string | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 5) {
    return "sources must contain 1–5 items";
  }
  for (let index = 0; index < value.length; index += 1) {
    const rule = validateSource(value[index], index);
    if (rule) return rule;
  }
  return null;
}

function validateSource(value: unknown, index: number): string | null {
  const at = `sources[${index}]`;
  if (!isRecord(value)) return `${at} must be an object`;
  if (value.kind !== "note" && value.kind !== "url")
    return `${at}.kind must be note or url`;

  if (value.kind === "note") {
    const unknown = unknownField(value, new Set(["kind", "body"]));
    if (unknown) return `${at} has ${unknown}`;
    if (!trimmed(value.body, 20, 20000)) {
      return `${at}.body must be a trimmed note of 20–20000 characters`;
    }
    return null;
  }

  const unknown = unknownField(value, new Set(["kind", "body", "excerpt"]));
  if (unknown) return `${at} has ${unknown}`;
  if (!isHttpUrl(value.body)) {
    return `${at}.body must be an http or https URL of at most 2000 characters`;
  }
  if (!trimmed(value.excerpt, 20, 8000)) {
    return `${at}.excerpt must be a trimmed string of 20–8000 characters`;
  }
  return null;
}

function validateQuestions(value: unknown): string | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 3) {
    return "questions must contain 1–3 items";
  }
  for (let index = 0; index < value.length; index += 1) {
    const rule = validateQuestion(value[index], index);
    if (rule) return rule;
  }
  return null;
}

function validateQuestion(value: unknown, index: number): string | null {
  const at = `questions[${index}]`;
  if (!isRecord(value)) return `${at} must be an object`;
  const unknown = unknownField(
    value,
    new Set(["title", "prompt", "probes", "rubric", "referenceArchitecture"]),
  );
  if (unknown) return `${at} has ${unknown}`;
  if (!trimmed(value.title, 1, 200))
    return `${at}.title must be a trimmed string of 1–200 characters`;
  if (!trimmed(value.prompt, 1, 8000))
    return `${at}.prompt must be a trimmed string of 1–8000 characters`;

  const probes = validateProbes(value.probes, at);
  if (probes) return probes;
  const rubric = validateRubric(value.rubric, at);
  if (rubric) return rubric;
  if (!trimmed(value.referenceArchitecture, 1, 8000)) {
    return `${at}.referenceArchitecture must be a trimmed string of 1–8000 characters`;
  }
  return null;
}

function validateProbes(value: unknown, at: string): string | null {
  if (!Array.isArray(value) || value.length < 3 || value.length > 8) {
    return `${at}.probes must contain 3–8 non-empty strings`;
  }
  for (let index = 0; index < value.length; index += 1) {
    if (!trimmed(value[index], 1, 500)) {
      return `${at}.probes[${index}] must be a non-empty string of at most 500 characters`;
    }
  }
  return null;
}

function validateRubric(value: unknown, at: string): string | null {
  if (!Array.isArray(value) || value.length !== DIMENSIONS.length) {
    return `${at}.rubric must be the seven dimensions in order`;
  }
  for (let index = 0; index < DIMENSIONS.length; index += 1) {
    const row = value[index];
    if (!isRecord(row) || row.dimension !== DIMENSIONS[index]) {
      return `${at}.rubric must be the seven dimensions in order`;
    }
    const unknown = unknownField(
      row,
      new Set(["dimension", "whatGoodLooksLike"]),
    );
    if (unknown) return `${at}.rubric[${index}] has ${unknown}`;
    if (!trimmed(row.whatGoodLooksLike, 1, 2000)) {
      return `${at}.rubric[${index}].whatGoodLooksLike must be a trimmed string of 1–2000 characters`;
    }
  }
  return null;
}

export function issuesForPacks(packs: DiscoveredPack[]): PackIssue[] {
  const issues: PackIssue[] = [];
  const seen = new Set<string>();

  for (const pack of packs) {
    const expected = path.join(pack.directory, "pack.json");
    if (!isKebabId(pack.id)) {
      issues.push({
        file: expected,
        rule: "pack id must be kebab-case of 1–80 characters",
      });
      continue;
    }

    const expectedResolved = path.resolve(expected);
    const extras = pack.packJsonFiles.filter(
      (file) => path.resolve(file) !== expectedResolved,
    );
    const hasExpected = pack.packJsonFiles.some(
      (file) => path.resolve(file) === expectedResolved,
    );
    if (!hasExpected) {
      issues.push({
        file: expected,
        rule: "pack directory must contain pack.json",
      });
      continue;
    }
    if (extras.length > 0) {
      issues.push({
        file: extras[0],
        rule: "a pack directory may contain only one pack.json",
      });
      continue;
    }
    if (seen.has(pack.id)) {
      issues.push({ file: expected, rule: "duplicate pack id" });
      continue;
    }
    seen.add(pack.id);

    let parsed: unknown;
    try {
      parsed = JSON.parse(pack.readText());
    } catch {
      issues.push({ file: expected, rule: "pack.json must be valid JSON" });
      continue;
    }
    const rule = validatePackDocument(parsed);
    if (rule) issues.push({ file: expected, rule });
  }

  return issues;
}

async function packJsonFiles(directory: string): Promise<string[]> {
  const names = await readdir(directory, { recursive: true });
  return names
    .map((name) => String(name))
    .filter(
      (name) =>
        name === "pack.json" ||
        name.endsWith(`${path.sep}pack.json`) ||
        name.endsWith("/pack.json"),
    )
    .map((name) => path.join(directory, name))
    .sort();
}

export async function validatePackTree(packsDir: string): Promise<PackIssue[]> {
  let entries;
  try {
    entries = await readdir(packsDir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const issues: PackIssue[] = [];
  const packs: DiscoveredPack[] = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const directory = path.join(packsDir, entry.name);
    if (!entry.isDirectory()) {
      issues.push({
        file: directory,
        rule: "content/packs entries must be directories",
      });
      continue;
    }
    const files = await packJsonFiles(directory);
    const expected = path.join(directory, "pack.json");
    const hasExpected = files.some(
      (file) => path.resolve(file) === path.resolve(expected),
    );
    const text = hasExpected ? await readFile(expected, "utf8") : "";
    packs.push({
      id: entry.name,
      directory,
      packJsonFiles: files,
      readText: () => text,
    });
  }

  return [...issues, ...issuesForPacks(packs)];
}
