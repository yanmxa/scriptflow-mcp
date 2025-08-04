import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getConfig } from './config/index.js';
import { mcpTools } from './config/tools.js';
import {
  handleScriptAdd,
  handleScriptEdit,
  handleScriptRemove,
  handleScriptGet,
  handleScriptList,
  handleScriptRun,
} from './handlers/index.js';

export class ScriptManagerServer {
  private server: Server;
  private config: ReturnType<typeof getConfig>;

  constructor() {
    this.config = getConfig();
    
    this.server = new Server(
      {
        name: this.config.serverName,
        version: this.config.serverVersion,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools: mcpTools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'script_add':
            return await handleScriptAdd(args as any, this.config.scriptsDir);
          case 'script_edit':
            return await handleScriptEdit(args as any, this.config.scriptsDir);
          case 'script_rm':
            return await handleScriptRemove(args as any, this.config.scriptsDir);
          case 'script_get':
            return await handleScriptGet(args as any, this.config.scriptsDir);
          case 'script_list':
            return await handleScriptList(args as any, this.config.scriptsDir);
          case 'script_run':
            return await handleScriptRun(args as any, this.config.scriptsDir, this.config.scriptTimeout);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}