import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const connection = neon(process.env.DATABASE_URL);
const db = drizzle(connection);

// List of tables in dependency order (tables with foreign keys first)
const tablesToDrop = [
  // Tables with foreign keys (drop first)
  'page_history',
  'collaboration_sessions', 
  'page_relations',
  'database_views',
  'activity_log',
  'templates',
  'saved_searches',
  'attachments',
  'note_permissions',
  'block_comments',
  'note_tags',
  'blocks',
  'notes',
  'tags',
  'folders',
  'workspace_members',
  'workspaces',
  
  // Auth tables
  'verification',
  'account',
  'session',
  
  // Base table (drop last)
  'users'
];

async function resetDatabase() {
  console.log('🗑️  Starting database reset...');
  
  try {
    // Drop tables in dependency order using CASCADE
    // CASCADE will automatically handle foreign key constraints
    for (const table of tablesToDrop) {
      try {
        console.log(`🗑️  Dropping table: ${table}`);
        await db.execute(sql.raw(`DROP TABLE IF EXISTS "${table}" CASCADE;`));
        console.log(`✅ Successfully dropped table: ${table}`);
      } catch (error) {
        console.warn(`⚠️  Warning: Could not drop table ${table}:`, error.message);
      }
    }
    
    console.log('✅ Database reset completed successfully!');
    console.log('💡 Run "npm run db:push" or "npm run db:migrate" to recreate the schema.');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

// Run the reset
resetDatabase()
  .then(() => {
    console.log('🎉 Database reset finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });