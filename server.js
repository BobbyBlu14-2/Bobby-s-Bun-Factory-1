// Bobby's Bun Factory - cPanel / Passenger Node.js Root Entrypoint
// This file allows cPanel to start the application from the root directory by loading the compiled bundle.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('./dist/server.cjs');
