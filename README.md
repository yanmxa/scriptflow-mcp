# ScriptFlow MCP Server

ScriptFlow is a script workflow management system built on the Model Context Protocol (MCP). It transforms complex, repetitive AI interactions into persistent, executable scripts that can be managed, version-controlled, and reused across sessions.

## Why ScriptFlow?

1. **Transform Workflows into Scripts**: Convert successful AI interactions into reusable, executable scripts
2. **Save Time & Tokens**: Execute complex tasks instantly instead of repeating long conversations
3. **Guaranteed Consistency**: Scripts run the same way every time, eliminating AI randomness
4. **Powerful Management**: Search, organize, edit, and version your automation library
5. **Team Collaboration**: Share proven workflows across your organization

## Features

- **Add/Edit/Remove** scripts with metadata
- **List/Search** scripts by name, description, or tags  
- **Execute** scripts with arguments
- **Multi-language** support (Bash, Python, Node.js, TypeScript)

## Setup

Add to your MCP client config (e.g., Claude Desktop `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "scriptflow": {
      "command": "npx",
      "args": ["scriptflow-mcp"],
      "env": {
        "SCRIPTFLOW_SCRIPTS_DIR": "/your/custom/path"
      }
    }
  }
}
```

**Environment Variables:**
- `SCRIPTFLOW_SCRIPTS_DIR`: Scripts directory (default: `/tmp/scriptflow-mcp/scripts`)
- `SCRIPTFLOW_TIMEOUT`: Execution timeout in ms (default: `30000`)

## Available Tools

- `script_add` - Add new script (name, description, content, language, tags)
- `script_edit` - Update existing script  
- `script_get` - View script details
- `script_list` - Search/filter scripts
- `script_run` - Execute script with arguments
- `script_rm` - Remove script

## Quick Example

```json
// Add script
{"name": "hello", "description": "Hello script", "content": "echo 'Hello!'"}

// Run script  
{"name": "hello", "args": ["World"]}

// List scripts
{"search": "hello"}
```

## Storage

Scripts stored as `{name}.{ext}` + `{name}.json` metadata files.
Supports: Bash (.sh), Python (.py), JavaScript (.js), TypeScript (.ts)

## Testing

```bash
# Run tests
npm test

# Test with MCP Inspector
npx @modelcontextprotocol/inspector npx scriptflow-mcp
```