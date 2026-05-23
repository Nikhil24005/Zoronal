import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'node:fs';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import apiRoutes from './routes/index.js';
import companyRoutes from './routes/companyRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, '..', '.env');

dotenv.config({ path: rootEnvPath });

const allowedExactOrigins = new Set([
  'https://zoronal-hazel.vercel.app',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
]);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  let parsedOrigin;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    return false;
  }

  const isVercelPreview = parsedOrigin.protocol === 'https:' && parsedOrigin.hostname.endsWith('.vercel.app');

  return allowedExactOrigins.has(origin) || isVercelPreview;
}

const app = express();
const port = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
} catch (err) {
  console.error('Failed to create uploads directory:', err.message);
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers'] || 'Content-Type, Authorization, X-Requested-With',
    );
    res.setHeader('Access-Control-Max-Age', '86400');
  }

  if (req.method === 'OPTIONS') {
    if (!isAllowedOrigin(origin)) {
      res.sendStatus(403);
      return;
    }

    res.sendStatus(204);
    return;
  }

  next();
});

app.use(helmet());
// Allow larger JSON payloads for base64 image uploads (up to 12MB)
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Zoronal API is running',
  });
});

app.use('/api', apiRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    const listen = promisify(app.listen.bind(app));
    await listen(port);
    console.log(`Server running on port ${port}`);

    // Connect to MongoDB after the API is already accepting requests.
    // This avoids hard crashes and HTTP connection refused errors when the database is down.
    connectDB(process.env.MONGO_URI).catch((err) => {
      console.error('MongoDB connection is not available yet:', err.message || err);
    });
  } catch (err) {
    console.error('Server failed to start:', err.message || err);
    process.exit(1);
  }
}

startServer();
