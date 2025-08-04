# ScriptFlow MCP Server

An MCP (Model Context Protocol) server for managing and executing scripts as automated workflows. This provides a shell-like way to manage script automation in agentic AI systems.

## Features

- **Script Add**: Add new scripts to the repository with metadata
- **Script Edit**: Update existing scripts (content, description, language, tags, parameters)
- **Script Remove**: Delete scripts from the repository
- **Script Get**: View detailed script information with optional content
- **Script List**: Search and discover available scripts with filtering
- **Script Run**: Execute scripts with parameters

## Complete Script Lifecycle

✅ **ADD** → **GET** → **EDIT** → **REMOVE** → **RUN**

## Installation

```bash
npm install
npm run build
```

## Usage

### Tools Available

#### 1. `script_add`
Add a new script to the repository.

**Parameters:**
- `name` (required): Script name without extension
- `description` (required): What the script does
- `content` (required): Script content/code
- `language` (optional): Programming language (bash, python, node, etc.) - defaults to bash
- `tags` (optional): Array of tags for categorization
- `parameters` (optional): Array of parameter descriptions

#### 2. `script_edit`
Edit an existing script.

**Parameters:**
- `name` (required): Name of the script to edit
- `description` (optional): Updated description
- `content` (optional): Updated script content/code
- `language` (optional): Updated programming language
- `tags` (optional): Updated tags for categorization
- `parameters` (optional): Updated parameter descriptions

#### 3. `script_rm`
Remove a script from the repository.

**Parameters:**
- `name` (required): Name of the script to remove

#### 4. `script_get`
Get detailed information about a specific script.

**Parameters:**
- `name` (required): Name of the script to get details for
- `include_content` (optional): Whether to include script content - defaults to false

#### 5. `script_list`
List and discover available scripts.

**Parameters:**
- `search` (optional): Search term to filter scripts
- `tag` (optional): Tag to filter scripts

#### 6. `script_run`
Execute a script by name.

**Parameters:**
- `name` (required): Name of the script to run
- `args` (optional): Array of arguments to pass to the script

## Examples

### Complete Script Lifecycle Example

#### 1. Adding a Script
```json
{
  "name": "hello_world",
  "description": "Prints hello world message",
  "content": "#!/bin/bash\\necho \\"Hello, World!\\"",
  "language": "bash",
  "tags": ["demo", "greeting"],
  "parameters": ["message"]
}
```

#### 2. Getting Script Details
```json
{
  "name": "hello_world",
  "include_content": true
}
```

#### 3. Editing a Script
```json
{
  "name": "hello_world",
  "description": "Enhanced greeting script with customizable message",
  "content": "#!/bin/bash\\necho \\"Hello, ${1:-World}!\\"",
  "tags": ["demo", "greeting", "customizable"]
}
```

#### 4. Listing Scripts
```json
{
  "search": "hello"
}
```
```json
{
  "tag": "greeting"
}
```

#### 5. Running a Script
```json
{
  "name": "hello_world",
  "args": ["Claude"]
}
```

#### 6. Removing a Script
```json
{
  "name": "hello_world"
}
```

## Configuration

Scripts are stored in the `scripts/` directory with:
- Script files: `{name}.{extension}`
- Metadata files: `{name}.json`

## Supported Languages

- Bash/Shell (.sh)
- Python (.py)
- Node.js/JavaScript (.js)
- TypeScript (.ts)

## Development

```bash
npm run dev    # Watch mode
npm run build  # Build
npm start      # Run built server
```