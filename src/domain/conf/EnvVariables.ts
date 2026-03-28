import { registerAs } from '@nestjs/config';
import { DEFAULT_LARGE_EXPIRATION_TIME } from '../constants/AppConstants';

export default registerAs('app', () => ({
  backend: {
    port: Number(process.env.NODE_PORT),
    baseUrl: process.env.NODE_APP_URL || `http://localhost:${process.env.NODE_PORT}`,
    env: process.env.NODE_ENV || 'development',
  },
  db: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/currency_exchange_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expiration: process.env.JWT_EXPIRATION_TIME || DEFAULT_LARGE_EXPIRATION_TIME,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM
  },
  rates: {
    url: process.env.RATES_URL || 'https://api.test.cambioseguro.com/api/v1.1/config/rates',
  },
}));