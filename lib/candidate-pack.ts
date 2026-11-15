export type CandidatePack = {
  id: string;
  company: string;
  role: string;
  level: string;
  exclusive: boolean;
  brief: string;
  questions: { title: string; prompt: string }[];
};

export type Plan = "free" | "pro";

export type CandidatePackView =
  | {
      locked: true;
      id: string;
      company: string;
      role: string;
      level: string;
      exclusive: true;
    }
  | ({ locked: false } & CandidatePack);

export function packForCandidate(
  pack: CandidatePack,
  plan: Plan,
): CandidatePackView {
  if (pack.exclusive && plan !== "pro") {
    return {
      locked: true,
      id: pack.id,
      company: pack.company,
      role: pack.role,
      level: pack.level,
      exclusive: true,
    };
  }
  return { locked: false, ...pack };
}
