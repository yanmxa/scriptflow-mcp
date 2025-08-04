export interface ScriptMetadata {
  name: string;
  description: string;
  language: string;
  created: string;
  updated?: string;
  tags?: string[];
  parameters?: string[];
}

export interface ScriptAddArgs {
  name: string;
  description: string;
  content: string;
  language?: string;
  tags?: string[];
  parameters?: string[];
}

export interface ScriptEditArgs {
  name: string;
  description?: string;
  content?: string;
  language?: string;
  tags?: string[];
  parameters?: string[];
}

export interface ScriptGetArgs {
  name: string;
  include_content?: boolean;
}

export interface ScriptListArgs {
  search?: string;
  tag?: string;
}

export interface ScriptRunArgs {
  name: string;
  args?: string[];
}

export interface ScriptRemoveArgs {
  name: string;
}