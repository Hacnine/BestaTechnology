
export const getCookieOptions = (req) => {
  // Dynamic cookie options based on environment and origin
  const origin = req.headers.origin || req.headers.referer || '';
  const isProduction = process.env.NODE_ENV === "production";
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
  
  // Check if using HTTPS (for production with SSL)
  const protocol = req.protocol || (req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const isHttps = protocol === 'https';

  return {
    httpOnly: true,
    // Only set secure=true if actually using HTTPS
    // For HTTP-only VPS deployments, keep secure=false even in production
    secure: isProduction && isHttps, 
    // Use 'lax' for same-site requests (works with HTTP)
    // Only use 'none' if we have HTTPS (secure cookies)
    sameSite: (isProduction && isHttps) ? "none" : "lax", 
    path: "/",
  };
};

