import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import fixture from "./fixtures/valid-pack.json" with { type: "json" };
import {
  issuesForPacks,
  validatePackDocument,
  validatePackTree,
  type DiscoveredPack,
} from "../src/validate-packs.ts";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

function clone(): Record<string, unknown> {
  return structuredClone(fixture) as Record<string, unknown>;
}

test("fixture pack and this repo's content packs pass", async () => {
  assert.equal(validatePackDocument(fixture), null);
  const issues = await validatePackTree(
    path.join(repoRoot, "content", "packs"),
  );
  assert.deepEqual(issues, []);
});

test("omitted exclusive is valid", () => {
  const doc = clone();
  delete doc.exclusive;
  assert.equal(validatePackDocument(doc), null);
});

test("first schema rule names the broken field", () => {
  const cases: Array<[Record<string, unknown>, string]> = [];

  const company = clone();
  company.company = " Grab";
  cases.push([company, "company must be a trimmed string of 1–120 characters"]);

  const level = clone();
  level.level = "principal";
  cases.push([level, "level must be mid, senior, or staff"]);

  const exclusive = clone();
  exclusive.exclusive = "yes";
  cases.push([exclusive, "exclusive must be a boolean"]);

  const sources = clone();
  sources.sources = [];
  cases.push([sources, "sources must contain 1–5 items"]);

  const note = clone();
  note.sources = [{ kind: "note", body: "too short" }];
  cases.push([
    note,
    "sources[0].body must be a trimmed note of 20–20000 characters",
  ]);

  const url = clone();
  url.sources = [{ kind: "url", body: "https://example.com/job" }];
  cases.push([
    url,
    "sources[0].excerpt must be a trimmed string of 20–8000 characters",
  ]);

  const badUrl = clone();
  badUrl.sources = [
    {
      kind: "url",
      body: "ftp://example.com/job",
      excerpt: "A reviewed excerpt long enough.",
    },
  ];
  cases.push([
    badUrl,
    "sources[0].body must be an http or https URL of at most 2000 characters",
  ]);

  const questions = clone();
  questions.questions = [];
  cases.push([questions, "questions must contain 1–3 items"]);

  const probes = clone();
  const question = (probes.questions as Array<Record<string, unknown>>)[0];
  question.probes = ["one", "two"];
  cases.push([
    probes,
    "questions[0].probes must contain 3–8 non-empty strings",
  ]);

  const rubric = clone();
  const rubricQuestion = (
    rubric.questions as Array<Record<string, unknown>>
  )[0];
  const rows = rubricQuestion.rubric as Array<{
    dimension: string;
    whatGoodLooksLike: string;
  }>;
  const swapped = rows[0];
  rows[0] = rows[1];
  rows[1] = swapped;
  cases.push([
    rubric,
    "questions[0].rubric must be the seven dimensions in order",
  ]);

  const unknown = clone();
  unknown.companyName = "Grab";
  cases.push([unknown, "unknown field companyName"]);

  for (const [doc, rule] of cases) {
    assert.equal(validatePackDocument(doc), rule);
  }
});

test("pack id, extra pack.json, and duplicate id", () => {
  const valid = (id: string, file: string): DiscoveredPack => ({
    id,
    directory: path.dirname(file),
    packJsonFiles: [file],
    readText: () => JSON.stringify(fixture),
  });

  const badId = path.join("content", "packs", "Grab Senior", "pack.json");
  const idIssues = issuesForPacks([valid("Grab Senior", badId)]);
  assert.deepEqual(idIssues, [
    { file: badId, rule: "pack id must be kebab-case of 1–80 characters" },
  ]);

  const nested = path.join(
    "content",
    "packs",
    "grab-senior",
    "nested",
    "pack.json",
  );
  const top = path.join("content", "packs", "grab-senior", "pack.json");
  const extra = issuesForPacks([
    {
      id: "grab-senior",
      directory: path.dirname(top),
      packJsonFiles: [top, nested],
      readText: () => JSON.stringify(fixture),
    },
  ]);
  assert.deepEqual(extra, [
    { file: nested, rule: "a pack directory may contain only one pack.json" },
  ]);

  const first = path.join("content", "packs", "grab-senior", "pack.json");
  const second = path.join("content", "packs", "grab-senior-copy", "pack.json");
  const duplicates = issuesForPacks([
    valid("grab-senior", first),
    { ...valid("grab-senior", second), id: "grab-senior" },
  ]);
  assert.deepEqual(duplicates, [{ file: second, rule: "duplicate pack id" }]);
});

test("validatePackTree reads a directory of packs", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "packs-"));
  const goodDir = path.join(root, "grab-ai-platform-senior");
  const badDir = path.join(root, "Bad_ID");
  const extraDir = path.join(root, "momo-payments-senior");
  await mkdir(goodDir, { recursive: true });
  await mkdir(path.join(badDir, "nested"), { recursive: true });
  await mkdir(path.join(extraDir, "nested"), { recursive: true });
  await writeFile(path.join(goodDir, "pack.json"), JSON.stringify(fixture));
  await writeFile(path.join(badDir, "pack.json"), JSON.stringify(fixture));
  await writeFile(path.join(badDir, "nested", "pack.json"), "{}");
  await writeFile(path.join(extraDir, "pack.json"), JSON.stringify(fixture));
  await writeFile(path.join(extraDir, "nested", "pack.json"), "{}");

  try {
    const issues = await validatePackTree(root);
    assert.deepEqual(issues, [
      {
        file: path.join(badDir, "pack.json"),
        rule: "pack id must be kebab-case of 1–80 characters",
      },
      {
        file: path.join(extraDir, "nested", "pack.json"),
        rule: "a pack directory may contain only one pack.json",
      },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI names the file and the first broken rule", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "repo-"));
  const packDir = path.join(root, "content", "packs", "grab-senior");
  await mkdir(packDir, { recursive: true });
  const doc = clone();
  doc.questions = [];
  const file = path.join(packDir, "pack.json");
  await writeFile(file, JSON.stringify(doc));

  try {
    const result = spawnSync(
      process.execPath,
      [
        "--import",
        "tsx",
        path.join(repoRoot, "scripts", "validate-packs.ts"),
        root,
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );
    assert.equal(result.status, 1);
    assert.match(
      result.stderr,
      /grab-senior\/pack\.json: questions must contain 1–3 items/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
