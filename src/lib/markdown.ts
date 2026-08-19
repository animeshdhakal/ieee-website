import fs from "fs";

export interface ParsedMarkdown<T = Record<string, unknown>> {
  data: T;
  content: string;
}

export function parseMarkdownFile<T = Record<string, unknown>>(filePath: string): ParsedMarkdown<T> {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = frontmatterRegex.exec(fileContents);

  if (!match) {
    return { data: {} as T, content: fileContents.trim() };
  }

  const yamlText = match[1];
  const content = match[2].trim();
  const data: Record<string, unknown> = {};

  yamlText.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) return;

    const key = trimmed.slice(0, colonIdx).trim();
    let rawVal = trimmed.slice(colonIdx + 1).trim();

    if ((rawVal.startsWith('"') && rawVal.endsWith('"')) || (rawVal.startsWith("'") && rawVal.endsWith("'"))) {
      rawVal = rawVal.slice(1, -1);
    }

    if (rawVal === "true") data[key] = true;
    else if (rawVal === "false") data[key] = false;
    else if (!isNaN(Number(rawVal)) && rawVal !== "") data[key] = Number(rawVal);
    else data[key] = rawVal;
  });

  return { data: data as T, content };
}
