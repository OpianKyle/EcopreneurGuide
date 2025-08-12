import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import fs from 'fs';

console.log("Setting up SQLite database for development...");

// Create database directory if it doesn't exist
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

// Use SQLite for development to avoid PostgreSQL connection issues
const sqlite = new Database('./data/digitalpro.db');
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

// Legacy pool export for compatibility (will create a mock interface)
export const pool = {
  connect: async () => ({
    query: (sql: string, params?: any[]) => sqlite.prepare(sql).all(...(params || [])),
    release: () => {}
  }),
  on: () => {},
  end: async () => sqlite.close()
};

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err.message);
  // Don't exit the process, let the app handle it gracefully
});

// Export a function to check database connection
export async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('Database connection test successful');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

// Initialize database schema - SQLite will create tables automatically when needed
export async function initializeDatabase() {
  try {
    // Create all necessary tables for the application
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid TEXT PRIMARY KEY,
        sess TEXT NOT NULL,
        expire INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);
      
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        first_name TEXT,
        last_name TEXT,
        profile_image_url TEXT,
        google_id TEXT,
        github_id TEXT,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        has_paid INTEGER DEFAULT 0,
        is_admin INTEGER DEFAULT 0,
        is_verified INTEGER DEFAULT 0,
        created_at INTEGER,
        updated_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        is_active INTEGER DEFAULT 1,
        created_at INTEGER,
        updated_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        download_url TEXT,
        file_name TEXT,
        file_size INTEGER,
        category_id TEXT,
        subcategory_id TEXT,
        is_active INTEGER DEFAULT 1,
        created_at INTEGER,
        updated_at INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      );
      
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        stripe_payment_intent_id TEXT,
        created_at INTEGER,
        updated_at INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      );
      
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        source TEXT DEFAULT 'landing_page',
        is_converted INTEGER DEFAULT 0,
        created_at INTEGER
      );
    `);
    
    console.log('SQLite database initialized successfully with all tables');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    console.log('Application will continue without database initialization');
    return false;
  }
}