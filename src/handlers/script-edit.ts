import fs from 'fs/promises';
import path from 'path';
import { ScriptMetadata, ScriptEditArgs } from '../types/script.js';
import { ensureDirectory, getExtension, findScriptFile } from '../utils/file.js';

export async function handleScriptEdit(args: ScriptEditArgs, scriptsDir: string) {
  await ensureDirectory(scriptsDir);

  const { name } = args;

  if (!name) {
    throw new Error('Script name is required');
  }

  const existingScriptFile = await findScriptFile(scriptsDir, name);
  const metadataPath = path.join(scriptsDir, `${name}.json`);

  if (!existingScriptFile) {
    throw new Error(`Script '${name}' not found`);
  }

  let existingMetadata: ScriptMetadata;
  try {
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    existingMetadata = JSON.parse(metadataContent);
  } catch {
    throw new Error(`Metadata for script '${name}' not found`);
  }

  const updatedMetadata: ScriptMetadata = {
    ...existingMetadata,
    description: args.description ?? existingMetadata.description,
    language: args.language ?? existingMetadata.language,
    tags: args.tags ?? existingMetadata.tags,
    parameters: args.parameters ?? existingMetadata.parameters,
    updated: new Date().toISOString(),
  };

  const oldScriptPath = path.join(scriptsDir, existingScriptFile);
  const newExtension = getExtension(updatedMetadata.language);
  const newScriptPath = path.join(scriptsDir, `${name}.${newExtension}`);

  if (args.content !== undefined) {
    await fs.writeFile(newScriptPath, args.content);
    if (updatedMetadata.language === 'bash') {
      await fs.chmod(newScriptPath, '755');
    }

    if (oldScriptPath !== newScriptPath) {
      try {
        await fs.unlink(oldScriptPath);
      } catch {
        // Ignore if old file doesn't exist
      }
    }
  } else if (oldScriptPath !== newScriptPath) {
    const existingContent = await fs.readFile(oldScriptPath, 'utf-8');
    await fs.writeFile(newScriptPath, existingContent);
    if (updatedMetadata.language === 'bash') {
      await fs.chmod(newScriptPath, '755');
    }
    await fs.unlink(oldScriptPath);
  }

  await fs.writeFile(metadataPath, JSON.stringify(updatedMetadata, null, 2));

  return {
    content: [
      {
        type: 'text',
        text: `Script '${name}' edited successfully`,
      },
    ],
  };
}