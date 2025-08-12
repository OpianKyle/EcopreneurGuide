import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "@shared/schema";

// For development, create a simple in-memory fallback or default connection
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://runner@localhost:5432/postgres";

console.log("Attempting to connect to database...");

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: false, // Replit PostgreSQL doesn't require SSL
  // Add some connection parameters to make it more robust
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
  // Retry connection settings
  application_name: 'digitalpro_app',
});

export const db = drizzle({ client: pool, schema });

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

// Initialize database schema
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Create tables if they don't exist (simplified approach)
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);
    `);
    
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR UNIQUE NOT NULL,
        password VARCHAR,
        first_name VARCHAR,
        last_name VARCHAR,
        profile_image_url VARCHAR,
        google_id VARCHAR,
        github_id VARCHAR,
        stripe_customer_id VARCHAR,
        stripe_subscription_id VARCHAR,
        has_paid BOOLEAN DEFAULT false,
        is_admin BOOLEAN DEFAULT false,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    client.release();
    console.log('Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    // Don't fail the application startup due to database issues
    console.log('Application will continue without database initialization');
    return false;
  }
}