import fs from 'fs/promises';
import path from 'path';
import { ScriptMetadata, ScriptListArgs } from '../types/script.js';
import { ensureDirectory } from '../utils/file.js';

export async function handleScriptList(args: ScriptListArgs, scriptsDir: string) {
  await ensureDirectory(scriptsDir);

  const files = await fs.readdir(scriptsDir);
  const metadataFiles = files.filter(f => f.endsWith('.json'));

  const scripts: ScriptMetadata[] = [];

  for (const metadataFile of metadataFiles) {
    try {
      const metadataPath = path.join(scriptsDir, metadataFile);
      const content = await fs.readFile(metadataPath, 'utf-8');
      const metadata: ScriptMetadata = JSON.parse(content);
      scripts.push(metadata);
    } catch (error) {
      continue;
    }
  }

  let filteredScripts = scripts;

  if (args.search) {
    const searchTerm = args.search.toLowerCase();
    filteredScripts = filteredScripts.filter(
      script =>
        script.name.toLowerCase().includes(searchTerm) ||
        script.description.toLowerCase().includes(searchTerm)
    );
  }

  if (args.tag) {
    filteredScripts = filteredScripts.filter(script =>
      script.tags?.includes(args.tag!)
    );
  }

  const scriptList = filteredScripts
    .map(script => {
      const tags = script.tags?.length ? ` [${script.tags.join(', ')}]` : '';
      const params = script.parameters?.length ? ` (params: ${script.parameters.join(', ')})` : '';
      return `• ${script.name} (${script.language}): ${script.description}${tags}${params}`;
    })
    .join('\n');

  return {
    content: [
      {
        type: 'text',
        text: `Found ${filteredScripts.length} script(s):\n\n${scriptList || 'No scripts found.'}`,
      },
    ],
  };
}