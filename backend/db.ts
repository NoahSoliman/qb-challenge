import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
};

export const pool = mysql.createPool(dbConfig);
