import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { setupAuth } from './auth.js';
import { storage } from './cloudinary.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Pool } from 'pg';

dotenv.config();
console.log('Loaded password:', process.env.ADMIN_PASSWORD);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Base URL depending on environment
const API_BASE_URL =
  process.env.MODE === 'development'
    ? process.env.API_BASE_URL_DEV
    : process.env.API_BASE_URL_PRODUCTION;

console.log(`Running in mode: ${process.env.MODE}`);
console.log(`API Base URL: ${API_BASE_URL}`);

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Middleware
app.use(cors({
  origin: ['https://beautybytoria.com', 'https://www.beautybytoria.com'],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/styles', express.static(path.join(__dirname, 'uploads', 'styles')));

// Auth setup
setupAuth(app);

// Root check
app.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB connection failed');
  }
});

// GET homepage data from DB + image folder
app.get('/api/homepage', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM homepage_content ORDER BY id DESC LIMIT 1');
    const homepageData = result.rows[0] || {};

    const dirPath = path.join(__dirname, 'uploads', 'styles');
    const files = fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : [];

    homepageData.images = files.map(file => `${API_BASE_URL}/styles/${file}`);

    res.json(homepageData);
  } catch (err) {
    console.error('Failed to fetch homepage content:', err);
    res.status(500).send('Error fetching content');
  }
});

// POST homepage data to DB
app.post('/api/homepage', async (req: Request, res: Response) => {
  const { title, subtitle, about, phonenumber, email, images } = req.body;

  try {
    console.log('Received homepage content:', req.body);

    const existing = await pool.query('SELECT id FROM homepage_content WHERE id = 1');
    if (existing.rows.length > 0) {
      await pool.query(
        'UPDATE homepage_content SET title = $1, subtitle = $2, about = $3, phone = $4, email = $5, gallery_urls = $6 WHERE id = 1',
        [title, subtitle, about, phonenumber, email, images]
      );
    } else {
      await pool.query(
        'INSERT INTO homepage_content (id, title, subtitle, about, phone, email, gallery_urls) VALUES (1, $1, $2, $3, $4, $5, $6)',
        [title, subtitle, about, phonenumber, email, images]
      );
    }

    res.status(200).send('Homepage content updated');
  } catch (err) {
    console.error('Failed to update homepage data:', (err as Error).message);
    console.error('Full error:', err);
    res.status(500).send('Error saving homepage content');
  }
});

// Upload config
const upload = multer({ dest: path.join(__dirname, 'uploads', 'styles') });

// GET uploaded image URLs
app.get('/api/images', (_req: Request, res: Response) => {
  const dirPath = path.join(__dirname, 'uploads', 'styles');

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('Error reading styles directory:', err);
      return res.status(500).send('Failed to read images');
    }

    const imageUrls = files.map(file => `${API_BASE_URL}/styles/${file}`);
    res.json(imageUrls);
  });
});
const upload_images = multer({ storage });
// POST image uploads
app.post('/api/upload', upload_images.array('images'), (req: Request, res: Response) => {
  const urls = (req.files as Express.Multer.File[]).map(file => (file as any).path);
  res.status(200).json(urls);
});

// POST delete images
app.post('/api/delete', (req: Request, res: Response) => {
  const { images } = req.body;

  images.forEach((url: string) => {
    const filename = path.basename(url);
    const filePath = path.join(__dirname, 'uploads', 'styles', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  res.status(200).send('Images deleted');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});