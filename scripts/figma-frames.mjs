// Extract top-level FRAME nodes from a Figma file dump.
// Usage: node scripts/figma-frames.mjs
import fs from "node:fs";

const raw = fs.readFileSync(".figma-file.json", "utf8");
const data = JSON.parse(raw);

const frames = [];
function walk(node, depth = 0, parentName = "") {
  if (!node) return;
  if (node.type === "FRAME" && depth <= 3) {
    frames.push({
      id: node.id,
      name: node.name,
      w: node.absoluteBoundingBox?.width,
      h: node.absoluteBoundingBox?.height,
      parent: parentName,
    });
  }
  if (node.children && depth <= 3) {
    for (const c of node.children) walk(c, depth + 1, node.name || parentName);
  }
}
walk(data.document);

console.log(`Pages/canvas: ${data.document.children.map((c) => c.name).join(", ")}`);
console.log(`\nTop-level frames (${frames.length}):`);
for (const f of frames) {
  console.log(
    `  ${f.id.padEnd(10)} ${String(f.w || "").padStart(5)}x${String(
      f.h || ""
    ).padEnd(5)}  ${f.parent ? f.parent + " > " : ""}${f.name}`
  );
}
