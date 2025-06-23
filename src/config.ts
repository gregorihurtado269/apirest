import dotenv from 'dotenv';
dotenv.config();

export default {
  port: parseInt(process.env.PORT || '5000'),
  mongodbUrl: process.env.MONGODB_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'super-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development'
};
