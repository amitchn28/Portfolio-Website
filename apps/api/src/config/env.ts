import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.API_PORT || process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN_WEB: process.env.CORS_ORIGIN_WEB || 'http://localhost:3000',
  CORS_ORIGIN_ADMIN: process.env.CORS_ORIGIN_ADMIN || 'http://localhost:3001',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-super-secret-jwt-key',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'amitchn28@gmail.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminSecurePassword2026!',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Amit Chauhan',
  OWNER_EMAIL: process.env.OWNER_EMAIL || 'amitchn28@gmail.com',
  EMAIL_PROVIDER: (process.env.EMAIL_PROVIDER as 'resend' | 'smtp' | 'console') || 'resend',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || `"Amit Chauhan Portfolio" <${process.env.OWNER_EMAIL || 'amitchn28@gmail.com'}>`,
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || 'local',
  UPLOAD_DIR: path.resolve(__dirname, '../../uploads'),
  IS_PROD: process.env.NODE_ENV === 'production',
};
