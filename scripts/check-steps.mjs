// Offline check (no device needed): every step in a feature file must match a dispatcher
// sentence, and every quoted key must have a matching case in commonSteps.mjs. Catches typos like "log in buton" before a real run.
// Usage: npm run check:steps
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const FEATURES_DIR = 'test/UI-test/E2E0';
const STEPS_FILE = 'test/UI-test/step-definitions/commonSteps.mjs';

// Sentence shape in Gherkin -> which dispatcher handles it.
const PATTERNS = [
  { re: /Vijay (?:is on|is redirected to) the "([^"]+)" screen/, bucket: 'screen' },
  { re: /Vijay enters the "([^"]+)" as "/, bucket: 'case' },
  { re: /Vijay taps the "([^"]+)"/, bucket: 'case' },
  { re: /Vijay confirms the "([^"]+)"/, bucket: 'case' },
];

const steps = readFileSync(STEPS_FILE, 'utf8');
const cases = new Set([...steps.matchAll(/case '([^']+)':/g)].map((m) => m[1]));
const screensBlock = steps.match(/const SCREENS = \{([\s\S]*?)\n\};/)?.[1] ?? '';
const screens = new Set([...screensBlock.matchAll(/^\s*'?([^':\n]+?)'?\s*:/gm)].map((m) => m[1].trim()));

function featureFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return featureFiles(p);
    return p.endsWith('.feature') ? [p] : [];
  });
}

const problems = [];
let checked = 0;
for (const file of featureFiles(FEATURES_DIR)) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    const step = line.trim().match(/^(Given|When|Then|And|But) (.+)$/);
    if (!step) return;
    if (!PATTERNS.some(({ re }) => re.test(step[2]))) {
      checked += 1;
      problems.push(`${file}:${i + 1}  no step definition matches "${step[2]}"`);
      return;
    }
    for (const { re, bucket } of PATTERNS) {
      const m = line.match(re);
      if (!m) continue;
      checked += 1;
      const known = bucket === 'screen' ? screens : cases;
      if (!known.has(m[1])) {
        const where = bucket === 'screen' ? 'SCREENS' : 'the switch cases';
        problems.push(`${file}:${i + 1}  "${m[1]}" is missing from ${where} in commonSteps.mjs`);
      }
      break;
    }
  });
}

if (problems.length) {
  console.error(`Found ${problems.length} problem(s):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`All ${checked} step keys have a matching dispatcher case.`);
