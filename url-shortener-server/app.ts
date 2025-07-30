import express from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

import { DATABASE_CONFIG } from './config/database.js';

dotenv.config();

const app = express();
const port = parseInt(process.env.SERVER_PORT || '3001', 10);

const pool = new Pool(DATABASE_CONFIG);

app.use(
  cors({
    origin: `${process.env.BASE_URL || 'http://localhost'}:${
      process.env.FRONTEND_PORT || '5173'
    }`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'X-Forwarded-For', 'X-Fetch-Visit'],
  })
);
app.use(express.json());

function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

app.post('/api/shorten', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid URL' });
  }

  const trimmedUrl = url.trim();

  try {
    new URL(trimmedUrl);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  if (trimmedUrl.length > 2048) {
    return res.status(400).json({ error: 'URL too long' });
  }
  const shortCode = generateShortCode();
  const secretCode = uuidv4();
  try {
    await pool.query(
      'INSERT INTO urls (original_url, short_code, secret_code) VALUES ($1, $2, $3)',
      [trimmedUrl, shortCode, secretCode]
    );
    res.json({
      shortUrl: `${process.env.BASE_URL || 'http://localhost'}:${
        process.env.SERVER_PORT || '3001'
      }/r/${shortCode}`,
      statsUrl: `${process.env.BASE_URL || 'http://localhost'}:${
        process.env.FRONTEND_PORT || '5173'
      }/stats/${secretCode}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/r/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  try {
    const result = await pool.query(
      'SELECT original_url, secret_code FROM urls WHERE short_code = $1',
      [shortCode]
    );
    if (result.rows.length === 0) return res.sendStatus(404);

    const { original_url, secret_code } = result.rows[0];
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const today = new Date().toISOString().split('T')[0];

    await pool.query(
      'INSERT INTO stats (secret_code, ip_address, visit_date, visit_count) VALUES ($1, $2, $3, 1) ON CONFLICT (secret_code, ip_address, visit_date) DO UPDATE SET visit_count = stats.visit_count + 1',
      [secret_code, ip, today]
    );

    if (req.headers['x-fetch-visit']) {
      return res.json({ redirectTo: original_url });
    }

    res.redirect(original_url);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get('/api/stats/:secretCode', async (req, res) => {
  const { secretCode } = req.params;
  try {
    const uniqueVisitsPerDay = await pool.query(
      'SELECT visit_date, COUNT(DISTINCT ip_address) AS unique_visits FROM stats WHERE secret_code = $1 GROUP BY visit_date ORDER BY visit_date DESC',
      [secretCode]
    );

    const topIps = await pool.query(
      'SELECT ip_address, SUM(visit_count) AS total_visits FROM stats WHERE secret_code = $1 GROUP BY ip_address ORDER BY total_visits DESC LIMIT 10',
      [secretCode]
    );

    res.json({
      dailyUniqueVisits: uniqueVisitsPerDay.rows,
      topIps: topIps.rows,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
