import path from "node:path";
import { validatePackTree } from "../src/validate-packs.ts";

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const issues = await validatePackTree(path.join(root, "content", "packs"));

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`${path.relative(root, issue.file)}: ${issue.rule}`);
  }
  process.exit(1);
}
