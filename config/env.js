// config/env.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import crypto from 'crypto';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chargement sécurisé du .env
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Validation des variables critiques avec messages d'erreur détaillés
const requiredConfigs = {
  DB_HOST: 'L\'hôte de la base de données est requis',
  DB_NAME: 'Le nom de la base de données est requis',
  JWT_SECRET: 'La clé secrète JWT est requise',
  NODE_ENV: 'L\'environnement (NODE_ENV) doit être défini'
};

// Validation avancée
for (const [varName, errorMsg] of Object.entries(requiredConfigs)) {
  if (!process.env[varName]) {
    throw new Error(`Configuration manquante: ${errorMsg}`);
  }

  // Validation spécifique pour JWT_SECRET
  if (varName === 'JWT_SECRET' && process.env.JWT_SECRET.length < 32) {
    throw new Error('La clé JWT_SECRET doit faire au moins 32 caractères');
  }
}

// Fonction de chiffrement pour les valeurs sensibles
const encryptValue = (value) => {
  if (!value) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32)),
    iv
  );
  let encrypted = cipher.update(value);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

// Configuration hiérarchisée avec valeurs par défaut sécurisées
const config = {
  // Base de données
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // En production, utiliser un vault
    name: process.env.DB_NAME,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
      min: parseInt(process.env.DB_POOL_MIN, 10) || 2,
      idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000
    },
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: true,
      ca: process.env.DB_SSL_CA || ''
    } : false
  },

  // Authentification
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    encryptionKey: encryptValue(process.env.ENCRYPTION_KEY)
  },

  // Serveur
  server: {
    port: parseInt(process.env.PORT, 10) || 5000,
    env: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    corsOrigins: process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',') 
      : ['http://localhost:3000'],
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15 * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100
    }
  },

  // Stockage
  storage: {
    uploadPath: process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads'),
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: process.env.ALLOWED_MIME_TYPES 
      ? process.env.ALLOWED_MIME_TYPES.split(',') 
      : [
          'image/jpeg',
          'image/png',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
  },

  // Email (configuration optionnelle)
  email: {
    service: process.env.EMAIL_SERVICE || 'smtp',
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    from: process.env.EMAIL_FROM || 'no-reply@classroom-app.com'
  },

  // Monitoring
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    prometheusEnabled: process.env.PROMETHEUS_ENABLED === 'true'
  }
};

// Validation supplémentaire pour l'environnement
if (!['development', 'test', 'production'].includes(config.server.env)) {
  throw new Error(`NODE_ENV invalide: ${config.server.env}`);
}

// Protection des logs en production
if (config.server.env === 'production') {
  const sensitiveKeys = ['password', 'secret', 'key', 'token'];
  const redactedConfig = JSON.parse(JSON.stringify(config));
  
  for (const key of sensitiveKeys) {
    if (redactedConfig[key]) {
      redactedConfig[key] = '*****';
    }
  }
  
  console.log('Configuration initialisée:', redactedConfig);
} else {
  console.log('Configuration initialisée:', config);
}

export default config;