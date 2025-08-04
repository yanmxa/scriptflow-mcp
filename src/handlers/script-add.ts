import fs from 'fs/promises';
import path from 'path';
import { ScriptMetadata, ScriptAddArgs } from '../types/script.js';
import { ensureDirectory, getExtension } from '../utils/file.js';

export async function handleScriptAdd(args: ScriptAddArgs, scriptsDir: string) {
  await ensureDirectory(scriptsDir);

  const { name, description, content, language = 'bash', tags = [], parameters = [] } = args;

  if (!name || !description || !content) {
    throw new Error('Script name, description, and content are required');
  }

  const scriptPath = path.join(scriptsDir, `${name}.${getExtension(language)}`);
  const metadataPath = path.join(scriptsDir, `${name}.json`);

  const metadata: ScriptMetadata = {
    name,
    description,
    language,
    created: new Date().toISOString(),
    tags,
    parameters,
  };

  try {
    await fs.access(scriptPath);
    throw new Error(`Script '${name}' already exists`);
  } catch {
    // Script doesn't exist, proceed
  }

  await fs.writeFile(scriptPath, content);
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

  if (language === 'bash') {
    await fs.chmod(scriptPath, '755');
  }

  return {
    content: [
      {
        type: 'text',
        text: `Script '${name}' added successfully to ${scriptPath}`,
      },
    ],
  };
}