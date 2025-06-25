import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { setupAuth } from './auth.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';


interface HomepageData {
  title: string;
  subtitle: string;
  about: string;
  phonenumber: string;
  email:string;
  images: string[];
}
dotenv.config();
console.log('Loaded password:', process.env.ADMIN_PASSWORD);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 
const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use('/styles', express.static(path.join(__dirname, 'uploads', 'styles')));
app.use(express.json());

app.use(cors({
  origin: ['https://beautybytoria.com', 'https://www.beautybytoria.com'],
  credentials: true
}));

setupAuth(app);
    const API_BASE_URL = process.env.MODE === 'development'
  ? process.env.API_BASE_URL_DEV
  : process.env.API_BASE_URL_PRODUCTION;
console.log(`Server running on port` + process.env.MODE);
console.log(`Server running on port` + API_BASE_URL);
const homepageData: HomepageData = {
  title: 'Tori Styles',
  subtitle: 'Hairstyling with confidence, creativity, and care',
  about: 'Hi, I’m Tori – a passionate hairstylist...',
   phonenumber: 'string',
  email:'string',
  images: []
};
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Homepage content with dynamic images
app.get('/api/homepage', (_req: Request, res: Response) => {
  const dirPath = path.join(__dirname, 'uploads', 'styles');

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('Error reading styles directory:', err);
      return res.status(500).send('Failed to read images');
    }

    homepageData.images = files.map(file => `${API_BASE_URL}/styles/${file}`);
    res.json(homepageData);
  });
});

app.post('/api/homepage', (req: Request<unknown, unknown, Omit<HomepageData, 'images'>>, res: Response) => {
  const { title, subtitle, about, phonenumber, email } = req.body;
  homepageData.title = title;
  homepageData.subtitle = subtitle;
  homepageData.about = about;
  homepageData.phonenumber = phonenumber;
  homepageData.email = email;
  res.status(200).send('Homepage content updated');
});
// Upload config
const upload = multer({ dest: path.join(__dirname, 'uploads', 'styles') });

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

// Upload images
app.post('/api/upload', upload.array('images'), (_req: Request, res: Response) => {
  res.status(200).send('Images uploaded');
});

// Delete images
app.post('/api/delete', (req: Request, res: Response) => {
  const { images } = req.body;

  images.forEach((url:string) => {
    const filename = path.basename(url);
    const filePath = path.join(__dirname, 'uploads', 'styles', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  res.status(200).send('Images deleted');
});