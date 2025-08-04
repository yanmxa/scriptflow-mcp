import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

export interface Config {
  scriptsDir: string;
  serverName: string;
  serverVersion: string;
  scriptTimeout: number;
  shellEnvironment: Record<string, string>;
}

function loadShellEnvironment(): Record<string, string> {
  try {
    const shell = process.env.SHELL || '/bin/bash';
    const shellName = path.basename(shell);
    
    let sourceCmd = '';
    if (shellName === 'zsh') {
      sourceCmd = 'source ~/.zshrc 2>/dev/null || true';
    } else if (shellName === 'bash') {
      sourceCmd = 'source ~/.bashrc 2>/dev/null || source ~/.bash_profile 2>/dev/null || true';
    } else {
      sourceCmd = 'true';
    }
    
    const cmd = `${shell} -c "${sourceCmd}; printenv"`;
    const output = execSync(cmd, { 
      encoding: 'utf8',
      timeout: 5000,
      stdio: ['ignore', 'pipe', 'ignore']
    });
    
    const env: Record<string, string> = {};
    output.split('\n').forEach(line => {
      const equalIndex = line.indexOf('=');
      if (equalIndex > 0) {
        const key = line.substring(0, equalIndex);
        const value = line.substring(equalIndex + 1);
        env[key] = value;
      }
    });
    
    return env;
  } catch (error) {
    return {};
  }
}

export function getConfig(): Config {
  const shellEnv = loadShellEnvironment();
  const env = { ...shellEnv, ...process.env };
  
  const defaultScriptsDir = path.join(os.tmpdir(), 'scriptflow-mcp', 'scripts');
  
  return {
    scriptsDir: env.SCRIPTFLOW_SCRIPTS_DIR || defaultScriptsDir,
    serverName: env.SCRIPTFLOW_SERVER_NAME || 'scriptflow-mcp',
    serverVersion: env.SCRIPTFLOW_SERVER_VERSION || '1.0.0',
    scriptTimeout: parseInt(env.SCRIPTFLOW_TIMEOUT || '30000', 10),
    shellEnvironment: Object.fromEntries(
      Object.entries({ ...shellEnv, ...process.env }).filter(([_, value]) => value !== undefined)
    ) as Record<string, string>,
  };
}