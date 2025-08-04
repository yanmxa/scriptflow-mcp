import fs from 'fs/promises';
import path from 'path';
import { ScriptMetadata, ScriptGetArgs } from '../types/script.js';
import { ensureDirectory, findScriptFile } from '../utils/file.js';

export async function handleScriptGet(args: ScriptGetArgs, scriptsDir: string) {
  await ensureDirectory(scriptsDir);

  const { name, include_content = false } = args;

  if (!name) {
    throw new Error('Script name is required');
  }

  const scriptFile = await findScriptFile(scriptsDir, name);
  const metadataPath = path.join(scriptsDir, `${name}.json`);

  if (!scriptFile) {
    throw new Error(`Script '${name}' not found`);
  }

  let metadata: ScriptMetadata;
  try {
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    metadata = JSON.parse(metadataContent);
  } catch {
    throw new Error(`Metadata for script '${name}' not found`);
  }

  let content = '';
  if (include_content) {
    const scriptPath = path.join(scriptsDir, scriptFile);
    try {
      content = await fs.readFile(scriptPath, 'utf-8');
    } catch {
      content = 'Error reading script content';
    }
  }

  const tags = metadata.tags?.length ? ` [${metadata.tags.join(', ')}]` : '';
  const params = metadata.parameters?.length ? ` (params: ${metadata.parameters.join(', ')})` : '';
  const updated = metadata.updated ? ` (updated: ${metadata.updated})` : '';

  let response = `Script Details:\n• Name: ${metadata.name}\n• Description: ${metadata.description}\n• Language: ${metadata.language}\n• Created: ${metadata.created}${updated}${tags}${params}`;

  if (include_content) {
    response += `\n\nContent:\n\`\`\`${metadata.language}\n${content}\n\`\`\``;
  }

  return {
    content: [
      {
        type: 'text',
        text: response,
      },
    ],
  };
}