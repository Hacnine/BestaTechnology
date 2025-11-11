// Use the current hostname to ensure frontend and backend are accessed from the same domain
const getBaseUrl = () => {
  // If running in development mode locally, use localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  // Otherwise, use the current hostname with backend port
  return `http://${window.location.hostname}:3001`;
};

export default {
  BASE_URL: getBaseUrl(),
  ORIGIN_URL: "http://localhost:8081",
};
