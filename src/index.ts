#!/usr/bin/env node

import { ScriptManagerServer } from './server.js';

const server = new ScriptManagerServer();
server.run().catch(console.error);