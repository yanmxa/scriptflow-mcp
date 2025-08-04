import fs from 'fs/promises';
import path from 'path';
import { ScriptRemoveArgs } from '../types/script.js';
import { ensureDirectory, findScriptFile } from '../utils/file.js';

export async function handleScriptRemove(args: ScriptRemoveArgs, scriptsDir: string) {
  await ensureDirectory(scriptsDir);

  const { name } = args;

  if (!name) {
    throw new Error('Script name is required');
  }

  const scriptFile = await findScriptFile(scriptsDir, name);
  const metadataPath = path.join(scriptsDir, `${name}.json`);

  if (!scriptFile) {
    throw new Error(`Script '${name}' not found`);
  }

  const scriptPath = path.join(scriptsDir, scriptFile);

  try {
    await fs.unlink(scriptPath);
  } catch {
    // Script file might not exist
  }

  try {
    await fs.unlink(metadataPath);
  } catch {
    // Metadata file might not exist
  }

  return {
    content: [
      {
        type: 'text',
        text: `Script '${name}' removed successfully`,
      },
    ],
  };
}