import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const mcpTools: Tool[] = [
  {
    name: 'script_add',
    description: 'Add a new script to the repository',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Script name (without extension)',
        },
        description: {
          type: 'string',
          description: 'Description of what the script does',
        },
        content: {
          type: 'string',
          description: 'Script content/code',
        },
        language: {
          type: 'string',
          description: 'Programming language (bash, python, node, etc.)',
          default: 'bash',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional tags for categorization',
        },
        parameters: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional parameter descriptions',
        },
      },
      required: ['name', 'description', 'content'],
    },
  },
  {
    name: 'script_list',
    description: 'List and discover available scripts',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Optional search term to filter scripts',
        },
        tag: {
          type: 'string',
          description: 'Optional tag to filter scripts',
        },
      },
    },
  },
  {
    name: 'script_run',
    description: 'Execute a script by name',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the script to run',
        },
        args: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional arguments to pass to the script',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'script_edit',
    description: 'Edit an existing script',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the script to edit',
        },
        description: {
          type: 'string',
          description: 'Updated description',
        },
        content: {
          type: 'string',
          description: 'Updated script content/code',
        },
        language: {
          type: 'string',
          description: 'Updated programming language',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Updated tags for categorization',
        },
        parameters: {
          type: 'array',
          items: { type: 'string' },
          description: 'Updated parameter descriptions',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'script_rm',
    description: 'Remove a script from the repository',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the script to remove',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'script_get',
    description: 'Get detailed information about a specific script',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the script to get details for',
        },
        include_content: {
          type: 'boolean',
          description: 'Whether to include the script content in the response',
          default: false,
        },
      },
      required: ['name'],
    },
  },
];