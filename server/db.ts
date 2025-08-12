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
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
  max: 10,
});

export const db = drizzle({ client: pool, schema });

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err.message);
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