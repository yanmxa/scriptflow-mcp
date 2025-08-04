import path from 'path';
import os from 'os';

export interface Config {
  scriptsDir: string;
  serverName: string;
  serverVersion: string;
  scriptTimeout: number;
}

export function getConfig(): Config {
  const defaultScriptsDir = path.join(os.tmpdir(), 'scriptflow-mcp', 'scripts');
  
  return {
    scriptsDir: process.env.SCRIPTFLOW_SCRIPTS_DIR || defaultScriptsDir,
    serverName: process.env.SCRIPTFLOW_SERVER_NAME || 'scriptflow-mcp',
    serverVersion: process.env.SCRIPTFLOW_SERVER_VERSION || '1.0.0',
    scriptTimeout: parseInt(process.env.SCRIPTFLOW_TIMEOUT || '30000', 10),
  };
}