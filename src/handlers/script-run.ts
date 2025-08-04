import fs from 'fs/promises';
import path from 'path';
import { ScriptMetadata, ScriptRunArgs } from '../types/script.js';
import { ensureDirectory, findScriptFile, getLanguageFromExtension } from '../utils/file.js';
import { buildExecutionCommand, executeScript } from '../utils/executor.js';
import { getConfig } from '../config/index.js';

export async function handleScriptRun(args: ScriptRunArgs, scriptsDir: string, timeout: number) {
  await ensureDirectory(scriptsDir);

  const { name, args: scriptArgs = [] } = args;
  const config = getConfig();

  const scriptFile = await findScriptFile(scriptsDir, name);

  if (!scriptFile) {
    throw new Error(`Script '${name}' not found`);
  }

  const scriptPath = path.join(scriptsDir, scriptFile);
  const metadataPath = path.join(scriptsDir, `${name}.json`);

  let metadata: ScriptMetadata | null = null;
  try {
    const content = await fs.readFile(metadataPath, 'utf-8');
    metadata = JSON.parse(content);
  } catch {
    // No metadata file
  }

  try {
    const language = metadata?.language || getLanguageFromExtension(scriptFile);
    const command = buildExecutionCommand(scriptPath, language, scriptArgs);
    const output = executeScript(command, scriptsDir, timeout, config.shellEnvironment);

    return {
      content: [
        {
          type: 'text',
          text: `Script '${name}' executed successfully:\n\n${output}`,
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`Script execution failed: ${error.message}`);
  }
}