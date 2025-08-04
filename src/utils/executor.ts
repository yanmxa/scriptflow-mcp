import { execSync } from 'child_process';
import path from 'path';

export function buildExecutionCommand(scriptPath: string, language: string, args: string[]): string {
  const argsString = args.join(' ');
  
  switch (language) {
    case 'bash':
    case 'sh':
      return `bash "${scriptPath}" ${argsString}`;
    case 'python':
    case 'py':
      return `python3 "${scriptPath}" ${argsString}`;
    case 'node':
    case 'js':
      return `node "${scriptPath}" ${argsString}`;
    default:
      return `"${scriptPath}" ${argsString}`;
  }
}

export function executeScript(command: string, scriptsDir: string, timeout: number, env?: Record<string, string>): string {
  return execSync(command, {
    encoding: 'utf-8',
    timeout,
    cwd: scriptsDir,
    env: env ? { ...process.env, ...env } : process.env
  });
}