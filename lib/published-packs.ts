import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { validatePackDocument } from "../src/validate-packs.ts";
import type { CandidatePack } from "./candidate-pack";

type RawQuestion = { title?: unknown; prompt?: unknown };

export async function listPublishedPacks(): Promise<CandidatePack[]> {
  const root = path.join(process.cwd(), "content", "packs");
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return [];
  }

  const packs: CandidatePack[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(
        await readFile(path.join(root, entry.name, "pack.json"), "utf8"),
      );
    } catch {
      continue;
    }
    if (validatePackDocument(parsed) !== null || !isRecord(parsed)) continue;
    const questions = Array.isArray(parsed.questions)
      ? parsed.questions.flatMap(questionSummary)
      : [];
    packs.push({
      id: entry.name,
      company: String(parsed.company),
      role: String(parsed.role),
      level: String(parsed.level),
      exclusive: parsed.exclusive === false ? false : true,
      brief: String(parsed.brief),
      questions,
    });
  }
  return packs.sort((left, right) => left.company.localeCompare(right.company));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function questionSummary(value: unknown): { title: string; prompt: string }[] {
  if (typeof value !== "object" || value === null) return [];
  const question = value as RawQuestion;
  if (typeof question.title !== "string" || typeof question.prompt !== "string")
    return [];
  return [{ title: question.title, prompt: question.prompt }];
}
