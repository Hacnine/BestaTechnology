// Dynamic API URL based on current hostname
// When accessing via localhost, use localhost:3001
// When accessing via IP (192.168.0.98), use 192.168.0.98:3001
const getBaseUrl = () => {
  // In browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Use the same hostname as the frontend, but port 3001 for backend
    return `${protocol}//${hostname}:3001`;
  }
  
  // Fallback for SSR or build time
  return import.meta.env.VITE_BASE_URL || 'http://localhost:3001';
};

const BASE_URL = getBaseUrl();
const ORIGIN_URL = import.meta.env.VITE_ORIGIN_URL;

export default {
  BASE_URL,
  ORIGIN_URL,
};
