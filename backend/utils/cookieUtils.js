
export const getCookieOptions = (req) => {
  // Dynamic cookie options based on environment and origin
  const origin = req.headers.origin || req.headers.referer || '';
  const isProduction = process.env.NODE_ENV === "production";
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

  return {
    httpOnly: true,
    secure: isProduction, 
    sameSite: isProduction ? "none" : "lax", 
    path: "/",
  };
};

