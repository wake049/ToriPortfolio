// @ts-ignore
import { v2 as cloudinary } from 'cloudinary';
// @ts-ignore
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio_tori',
    allowed_formats: ['jpg', 'png', 'jpeg', 'heic', 'heif'],
    transformation: [{ width: 1000, crop: 'limit', format: 'jpg' }],
  } as any,
});

export { cloudinary, storage };
