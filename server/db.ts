import { Pool } from 'pg';

const getHost = () => {
  const host = process.env.POSTGRES_HOST || 'localhost';
  // If host contains port (e.g., "localhost:5432"), split it
  if (host.includes(':')) {
    const [h, p] = host.split(':');
    return { host: h, port: parseInt(p, 10) };
  }
  return { host, port: 5432 };
};

const { host, port } = getHost();

const pool = new Pool({
  host,
  port,
  database: process.env.POSTGRES_DATABASE || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rowCount });
  return result.rows as T[];
}

export async function queryOne<T = unknown>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export { pool };
