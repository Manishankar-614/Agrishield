// AgriShield Centralized API Configuration
// Defaults to local backend (http://127.0.0.1:8000), or uses VITE_API_BASE_URL when hosted on Netlify/Vercel
export const API_BASE_URL: string = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');
