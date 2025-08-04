import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { handleScriptAdd } from '../handlers/script-add.js';
import { handleScriptList } from '../handlers/script-list.js';
import { handleScriptRun } from '../handlers/script-run.js';
import { handleScriptRemove } from '../handlers/script-remove.js';

describe('ScriptFlow Basic Functionality', () => {
  let testDir: string;

  test('setup test environment', async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'scriptflow-test-'));
  });

  test('add and run a simple script', async () => {
    // Add script
    const addResult = await handleScriptAdd({
      name: 'hello',
      description: 'Hello world script',
      content: '#!/bin/bash\necho "Hello, World!"',
      language: 'bash'
    }, testDir);
    
    assert.ok(addResult.content[0].text.includes('added successfully'));

    // Run script
    const runResult = await handleScriptRun({ name: 'hello' }, testDir, 5000);
    assert.ok(runResult.content[0].text.includes('Hello, World!'));
  });

  test('list scripts', async () => {
    const listResult = await handleScriptList({}, testDir);
    assert.ok(listResult.content[0].text.includes('hello'));
    assert.ok(listResult.content[0].text.includes('Found 1 script'));
  });

  test('remove script', async () => {
    const removeResult = await handleScriptRemove({ name: 'hello' }, testDir);
    assert.ok(removeResult.content[0].text.includes('removed successfully'));

    // Verify it's gone
    const listResult = await handleScriptList({}, testDir);
    assert.ok(listResult.content[0].text.includes('Found 0 script'));
  });

  test('cleanup', async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });
});