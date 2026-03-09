const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const OUTPUT_PATH = path.join(ROOT, "DATABASE_USAGE_MAP.md");
const CODE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);

const tableUsage = new Map();
const rpcUsage = [];
const storageUsage = [];

const walk = (dir, files = []) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (CODE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
};

const normalizeWhitespace = (value) =>
  value.replace(/\s+/g, " ").trim();

const splitArgs = (value) => {
  const args = [];
  let current = "";
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escape = false;

  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i];

    if (escape) {
      current += ch;
      escape = false;
      continue;
    }

    if (ch === "\\") {
      current += ch;
      escape = true;
      continue;
    }

    if (inSingle) {
      if (ch === "'") inSingle = false;
      current += ch;
      continue;
    }

    if (inDouble) {
      if (ch === '"') inDouble = false;
      current += ch;
      continue;
    }

    if (inTemplate) {
      if (ch === "`") inTemplate = false;
      current += ch;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      current += ch;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      current += ch;
      continue;
    }

    if (ch === "`") {
      inTemplate = true;
      current += ch;
      continue;
    }

    if (ch === "(") depthParen += 1;
    if (ch === ")") depthParen -= 1;
    if (ch === "{") depthBrace += 1;
    if (ch === "}") depthBrace -= 1;
    if (ch === "[") depthBracket += 1;
    if (ch === "]") depthBracket -= 1;

    if (
      ch === "," &&
      depthParen === 0 &&
      depthBrace === 0 &&
      depthBracket === 0
    ) {
      args.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  if (current.trim()) {
    args.push(current.trim());
  }

  return args;
};

const extractCallArgs = (source, startIndex) => {
  let index = startIndex;
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escape = false;
  let args = "";

  while (index < source.length) {
    const ch = source[index];

    if (escape) {
      args += ch;
      escape = false;
      index += 1;
      continue;
    }

    if (ch === "\\") {
      args += ch;
      escape = true;
      index += 1;
      continue;
    }

    if (inSingle) {
      if (ch === "'") inSingle = false;
      args += ch;
      index += 1;
      continue;
    }

    if (inDouble) {
      if (ch === '"') inDouble = false;
      args += ch;
      index += 1;
      continue;
    }

    if (inTemplate) {
      if (ch === "`") inTemplate = false;
      args += ch;
      index += 1;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      args += ch;
      index += 1;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      args += ch;
      index += 1;
      continue;
    }

    if (ch === "`") {
      inTemplate = true;
      args += ch;
      index += 1;
      continue;
    }

    if (ch === "(") {
      depth += 1;
      args += ch;
      index += 1;
      continue;
    }

    if (ch === ")") {
      if (depth === 0) {
        return { args, endIndex: index };
      }
      depth -= 1;
      args += ch;
      index += 1;
      continue;
    }

    args += ch;
    index += 1;
  }

  return { args, endIndex: index };
};

const extractColumnsFromObject = (arg) => {
  const keys = [];
  const keyRegex = /([A-Za-z0-9_]+)\s*:/g;
  let match;
  while ((match = keyRegex.exec(arg)) !== null) {
    keys.push(match[1]);
  }
  const hasSpread = arg.includes("...");
  const uniqueKeys = Array.from(new Set(keys));
  return {
    keys: uniqueKeys,
    hasSpread,
  };
};

const recordTableUsage = (table, filePath, operation) => {
  if (!tableUsage.has(table)) {
    tableUsage.set(table, []);
  }
  tableUsage.get(table).push({ filePath, ...operation });
};

const files = walk(SRC_DIR);

files.forEach((filePath) => {
  const source = fs.readFileSync(filePath, "utf8");

  const tableRegex = /\.from\(\s*['"]([^'"]+)['"]\s*\)/g;
  let match;
  while ((match = tableRegex.exec(source)) !== null) {
    const table = match[1];
    const sliceStart = match.index + match[0].length;
    const slice = source.slice(sliceStart, sliceStart + 600);

    const opRegex = /\.(select|insert|update|upsert|delete)\s*\(/g;
    let opMatch;
    while ((opMatch = opRegex.exec(slice)) !== null) {
      const op = opMatch[1];
      const callStart = sliceStart + opMatch.index + opMatch[0].length;
      const { args } = extractCallArgs(source, callStart);
      const callArgs = args.slice(1); // drop opening paren
      const parsedArgs = splitArgs(callArgs);
      const firstArg = parsedArgs[0] || "";

      const operation = {
        type: op,
        rawArgs: normalizeWhitespace(firstArg || ""),
      };

      if (op === "select") {
        operation.columns = firstArg ? normalizeWhitespace(firstArg) : "*";
      }

      if (["insert", "update", "upsert"].includes(op)) {
        const { keys, hasSpread } = extractColumnsFromObject(firstArg || "");
        operation.columns = keys.length ? keys : [];
        operation.hasDynamic = hasSpread || !firstArg || firstArg.startsWith("{") === false;
      }

      recordTableUsage(table, filePath, operation);
      break;
    }
  }

  const rpcRegex = /\.rpc\(\s*['"]([^'"]+)['"]/g;
  while ((match = rpcRegex.exec(source)) !== null) {
    rpcUsage.push({
      filePath,
      functionName: match[1],
    });
  }

  const storageRegex = /storage\.from\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = storageRegex.exec(source)) !== null) {
    storageUsage.push({
      filePath,
      bucket: match[1],
    });
  }
});

const now = new Date().toISOString();
let output = `# Database Usage Map\n\nGenerated: ${now}\n\n`;

output += "## Tables\n\n";

Array.from(tableUsage.keys())
  .sort()
  .forEach((table) => {
    output += `### ${table}\n\n`;
    const usages = tableUsage.get(table);
    const byFile = new Map();

    usages.forEach((usage) => {
      if (!byFile.has(usage.filePath)) {
        byFile.set(usage.filePath, []);
      }
      byFile.get(usage.filePath).push(usage);
    });

    Array.from(byFile.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([filePath, ops]) => {
        const relPath = path.relative(ROOT, filePath).replace(/\\/g, "/");
        output += `- ${relPath}\n`;

        ops.forEach((op) => {
          if (op.type === "select") {
            output += `  - select: ${op.columns || "*"}\n`;
            return;
          }

          if (["insert", "update", "upsert"].includes(op.type)) {
            const columns = Array.isArray(op.columns) && op.columns.length
              ? op.columns.join(", ")
              : "(dynamic keys)";
            const dynamicNote = op.hasDynamic ? " (dynamic)" : "";
            output += `  - ${op.type}: ${columns}${dynamicNote}\n`;
            return;
          }

          output += `  - ${op.type}\n`;
        });
      });

    output += "\n";
  });

if (rpcUsage.length) {
  output += "## RPC Functions\n\n";
  rpcUsage
    .sort((a, b) => a.functionName.localeCompare(b.functionName))
    .forEach((rpc) => {
      const relPath = path.relative(ROOT, rpc.filePath).replace(/\\/g, "/");
      output += `- ${rpc.functionName} (from ${relPath})\n`;
    });
  output += "\n";
}

if (storageUsage.length) {
  output += "## Storage Buckets\n\n";
  storageUsage
    .sort((a, b) => a.bucket.localeCompare(b.bucket))
    .forEach((bucket) => {
      const relPath = path.relative(ROOT, bucket.filePath).replace(/\\/g, "/");
      output += `- ${bucket.bucket} (from ${relPath})\n`;
    });
  output += "\n";
}

fs.writeFileSync(OUTPUT_PATH, output, "utf8");
console.log(`Database usage map written to ${OUTPUT_PATH}`);
