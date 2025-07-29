// config/db.js
import dotenv from 'dotenv';
dotenv.config();

// config/db.js
export default {
  host: process.env.DB_HOST || '127.0.0.1', // Préférer 127.0.0.1 à localhost
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'classroom_user', // Pas root en production
  password: process.env.DB_PASSWORD || 'secure_password',
  database: process.env.DB_NAME || 'classroom_' + (process.env.NODE_ENV || 'dev'),
  logging: process.env.NODE_ENV === 'development' ? 
    (msg, timing) => console.log(`[SQL] ${msg} (${timing}ms)`) : 
    false,
  define: {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    min: parseInt(process.env.DB_POOL_MIN) || 2,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE) || 10000,
    evict: parseInt(process.env.DB_POOL_EVICT) || 5000
  },
  retry: {
    max: 3, // Tentatives de reconnexion
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /ESOCKETTIMEDOUT/,
      /EHOSTDOWN/,
      /EPIPE/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/
    ]
  }
};