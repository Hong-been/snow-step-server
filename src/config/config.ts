export const config = () => ({
  port: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback',
})