import fs from 'fs/promises';
import path from 'path';

export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export function getExtension(language: string): string {
  switch (language.toLowerCase()) {
    case 'bash':
    case 'sh':
      return 'sh';
    case 'python':
    case 'py':
      return 'py';
    case 'node':
    case 'javascript':
    case 'js':
      return 'js';
    case 'typescript':
    case 'ts':
      return 'ts';
    default:
      return 'sh';
  }
}

export function getLanguageFromExtension(filename: string): string {
  const ext = path.extname(filename).slice(1);
  switch (ext) {
    case 'sh':
      return 'bash';
    case 'py':
      return 'python';
    case 'js':
      return 'node';
    case 'ts':
      return 'typescript';
    default:
      return 'bash';
  }
}

export async function findScriptFile(scriptsDir: string, name: string): Promise<string | null> {
  try {
    const files = await fs.readdir(scriptsDir);
    const scriptFile = files.find(f => f.startsWith(`${name}.`) && !f.endsWith('.json'));
    return scriptFile || null;
  } catch {
    return null;
  }
}