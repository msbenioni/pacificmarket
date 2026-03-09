const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const SCHEMA_PATH = path.join(ROOT, "database_dumps", "prod_schema.sql");
const OUTPUT_PATH = path.join(ROOT, "DATABASE_SCHEMA_CODE_MAP.md");
const CODE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);

if (!fs.existsSync(SCHEMA_PATH)) {
  throw new Error(`Schema dump not found at ${SCHEMA_PATH}`);
}

const schemaSql = fs.readFileSync(SCHEMA_PATH, "utf8");

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

const parseSelectColumns = (selectArg) => {
  if (!selectArg) {
    return { columns: [], raw: [] };
  }

  const trimmed = selectArg.trim();
  if (trimmed === "*" || trimmed === "'*'" || trimmed === '"*"') {
    return { columns: ["*"], raw: [trimmed] };
  }

  const items = splitArgs(trimmed);
  const columns = [];
  const raw = [];

  items.forEach((item) => {
    if (!item) return;
    raw.push(item);

    const clean = item.trim();
    if (/[*]/.test(clean)) {
      columns.push("*");
      return;
    }

    if (/[():]/.test(clean)) {
      return;
    }

    const simple = clean.replace(/['"`]/g, "").trim();
    if (simple) {
      columns.push(simple);
    }
  });

  return {
    columns: Array.from(new Set(columns)),
    raw,
  };
};

const parseSchema = () => {
  const tables = new Map();
  const policies = new Map();
  const dependencies = new Map();

  const tableRegex = /CREATE TABLE\s+public\.(["\w-]+)\s*\(([^]*?)\n\);/g;
  let match;

  while ((match = tableRegex.exec(schemaSql)) !== null) {
    const rawName = match[1];
    const tableName = rawName.replace(/"/g, "");
    const body = match[2];
    const lines = body.split("\n");
    const columns = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (/^(CONSTRAINT|PRIMARY KEY|UNIQUE|CHECK|FOREIGN KEY)/i.test(trimmed)) return;
      if (trimmed.startsWith("--")) return;

      const cleaned = trimmed.replace(/,$/, "");
      const nameMatch = cleaned.match(/^"?([A-Za-z0-9_]+)"?\s+(.*)$/);
      if (!nameMatch) return;

      const name = nameMatch[1];
      const rest = nameMatch[2];
      const typeTokens = [];
      const restTokens = rest.split(/\s+/);
      for (const token of restTokens) {
        if (["NOT", "NULL", "DEFAULT", "CONSTRAINT", "PRIMARY", "REFERENCES", "CHECK", "UNIQUE"].includes(token.toUpperCase())) {
          break;
        }
        typeTokens.push(token);
      }
      const dataType = typeTokens.join(" ");
      const defaultMatch = rest.match(/DEFAULT\s+([^,]+)/i);
      columns.push({
        name,
        type: dataType || "unknown",
        nullable: !/NOT NULL/i.test(rest),
        default: defaultMatch ? defaultMatch[1].trim() : null,
      });
    });

    tables.set(tableName, columns);

    const referenceRegex = /REFERENCES\s+public\.(["\w-]+)\s*\(([^)]+)\)/gi;
    let refMatch;
    while ((refMatch = referenceRegex.exec(body)) !== null) {
      const refTable = refMatch[1].replace(/"/g, "");
      const refColumn = refMatch[2];
      if (!dependencies.has(tableName)) {
        dependencies.set(tableName, []);
      }
      dependencies.get(tableName).push({
        references: refTable,
        column: refColumn,
      });
    }
  }

  const policyRegex = /CREATE POLICY\s+([^\s]+)\s+ON\s+public\.(["\w-]+)/gi;
  while ((match = policyRegex.exec(schemaSql)) !== null) {
    const policyName = match[1].replace(/"/g, "");
    const tableName = match[2].replace(/"/g, "");
    if (!policies.has(tableName)) {
      policies.set(tableName, []);
    }
    policies.get(tableName).push(policyName);
  }

  const alterFkRegex = /ALTER TABLE\s+ONLY\s+public\.(["\w-]+).*?REFERENCES\s+public\.(["\w-]+)\s*\(([^)]+)\)/gis;
  while ((match = alterFkRegex.exec(schemaSql)) !== null) {
    const tableName = match[1].replace(/"/g, "");
    const refTable = match[2].replace(/"/g, "");
    const refColumn = match[3];
    if (!dependencies.has(tableName)) {
      dependencies.set(tableName, []);
    }
    dependencies.get(tableName).push({
      references: refTable,
      column: refColumn,
    });
  }

  return { tables, policies, dependencies };
};

const parseCodeUsage = () => {
  const usage = new Map();
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
        const parsedArgs = splitArgs(args);
        const firstArg = parsedArgs[0] || "";

        if (!usage.has(table)) {
          usage.set(table, []);
        }

        const entry = {
          filePath,
          type: op,
          rawArgs: firstArg,
          columns: [],
          rawSelect: [],
          dynamic: false,
        };

        if (op === "select") {
          const parsed = parseSelectColumns(firstArg);
          entry.columns = parsed.columns;
          entry.rawSelect = parsed.raw;
        }

        if (["insert", "update", "upsert"].includes(op)) {
          const { keys, hasSpread } = extractColumnsFromObject(firstArg || "");
          entry.columns = keys;
          entry.dynamic = hasSpread || !firstArg || firstArg.startsWith("{") === false;
        }

        usage.get(table).push(entry);
        break;
      }
    }
  });

  return usage;
};

const { tables, policies, dependencies } = parseSchema();
const usage = parseCodeUsage();
const now = new Date().toISOString();

let output = `# Database Schema + Code Map\n\nGenerated: ${now}\n\n`;

const allTables = Array.from(new Set([...tables.keys(), ...usage.keys()])).sort();

allTables.forEach((table) => {
  output += `## ${table}\n\n`;

  const schemaColumns = tables.get(table) || [];
  if (schemaColumns.length) {
    output += "**Schema columns**\n\n";
    schemaColumns.forEach((col) => {
      const defaultText = col.default ? ` DEFAULT ${col.default}` : "";
      const nullableText = col.nullable ? "NULL" : "NOT NULL";
      output += `- ${col.name} (${col.type}, ${nullableText}${defaultText})\n`;
    });
    output += "\n";
  } else {
    output += "**Schema columns**\n\n- _Not found in schema dump._\n\n";
  }

  const policyList = policies.get(table) || [];
  output += "**RLS policies**\n\n";
  if (policyList.length) {
    policyList.forEach((policy) => {
      output += `- ${policy}\n`;
    });
  } else {
    output += "- _None found in dump._\n";
  }
  output += "\n";

  const dependencyList = dependencies.get(table) || [];
  output += "**Dependencies (FK references)**\n\n";
  if (dependencyList.length) {
    dependencyList.forEach((dep) => {
      output += `- references ${dep.references} (${dep.column})\n`;
    });
  } else {
    output += "- _None found._\n";
  }
  output += "\n";

  const tableUsage = usage.get(table) || [];
  output += "**Code usage**\n\n";
  if (tableUsage.length) {
    const byFile = new Map();
    tableUsage.forEach((item) => {
      if (!byFile.has(item.filePath)) {
        byFile.set(item.filePath, []);
      }
      byFile.get(item.filePath).push(item);
    });

    Array.from(byFile.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([filePath, ops]) => {
        const relPath = path.relative(ROOT, filePath).replace(/\\/g, "/");
        output += `- ${relPath}\n`;
        ops.forEach((op) => {
          if (op.type === "select") {
            const selectText = op.rawSelect.length ? op.rawSelect.join(", ") : "*";
            output += `  - select: ${selectText}\n`;
            return;
          }
          if (["insert", "update", "upsert"].includes(op.type)) {
            const columns = op.columns.length ? op.columns.join(", ") : "(dynamic keys)";
            const dynamicNote = op.dynamic ? " (dynamic)" : "";
            output += `  - ${op.type}: ${columns}${dynamicNote}\n`;
            return;
          }
          output += `  - ${op.type}\n`;
        });
      });
  } else {
    output += "- _No code usage found._\n";
  }

  output += "\n";

  const schemaColumnNames = new Set(schemaColumns.map((col) => col.name));
  const usedColumns = new Set();
  let usesAllColumns = false;

  tableUsage.forEach((op) => {
    if (op.type === "select") {
      if (op.columns.includes("*")) {
        usesAllColumns = true;
      }
      op.columns.forEach((col) => {
        if (col !== "*") usedColumns.add(col);
      });
    }
    if (["insert", "update", "upsert"].includes(op.type)) {
      op.columns.forEach((col) => usedColumns.add(col));
    }
  });

  if (schemaColumnNames.size && usedColumns.size) {
    const missingColumns = Array.from(usedColumns).filter((col) => !schemaColumnNames.has(col));
    const unusedColumns = usesAllColumns ? [] : Array.from(schemaColumnNames).filter((col) => !usedColumns.has(col));

    output += "**Potential mismatches**\n\n";
    if (missingColumns.length) {
      output += `- Columns referenced in code but not found in schema: ${missingColumns.join(", ")}\n`;
    } else {
      output += "- Columns referenced in code but not found in schema: _None detected._\n";
    }

    if (unusedColumns.length) {
      output += `- Schema columns not directly referenced in code: ${unusedColumns.join(", ")}\n`;
      output += "  - _Note: may still be used by triggers, RLS policies, or admin tooling._\n";
    } else {
      output += "- Schema columns not directly referenced in code: _None detected (or select * in use)._\n";
    }
    output += "\n";
  }
});

fs.writeFileSync(OUTPUT_PATH, output, "utf8");
console.log(`Schema/code map written to ${OUTPUT_PATH}`);
