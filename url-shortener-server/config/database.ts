import dotenv from 'dotenv';

interface DatabaseConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

dotenv.config();

export const DATABASE_CONFIG: DatabaseConfig = {
  user: process.env.DATABASE_USER || '',
  host: process.env.DATABASE_HOST || '',
  database: process.env.DATABASE_NAME || '',
  password: process.env.DATABASE_PASSWORD || '',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
};

export const PORT = parseInt(process.env.DATABASE_PORT || '3001', 10);
