import { startServer } from '../server/websocket';
import { query } from '../server/db';
import fs from 'fs';
import path from 'path';

async function migrate() {
  console.log('Running database migration...');
  
  const schemaPath = path.join(process.cwd(), 'scripts', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  try {
    await query(schema);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

async function main() {
  // Run migration first
  await migrate();
  
  // Start WebSocket server
  const port = parseInt(process.env.WS_PORT || '3001', 10);
  startServer(port);
}

main();
