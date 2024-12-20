export const config = () => ({
  port: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI:
    process.env.GOOGLE_REDIRECT_URI ||
    'http://localhost:3001/auth/google/callback',
  NODE_ENV: process.env.NODE_ENV || 'production',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3001',
});
