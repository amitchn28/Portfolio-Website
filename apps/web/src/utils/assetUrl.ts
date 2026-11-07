export const getAssetUrl = (url?: string | null): string => {
  if (!url) return '/avatar.webp';

  // If pointing to the old ephemeral upload that was wiped on Render, map to persistent CDN avatar
  if (url.includes('0c9c060d-eb50-4921-a6d8-040dfab5d84d.webp')) {
    return '/avatar.webp';
  }

  const backendBase = (
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api'
  ).replace(/\/api\/?$/, '');

  // If URL was previously saved with http://localhost:5000, swap it with live backend URL
  if (url.startsWith('http://localhost:5000')) {
    return url.replace('http://localhost:5000', backendBase);
  }

  // Only uploads starting with /uploads/ belong to backend disk
  if (url.startsWith('/uploads/')) {
    return `${backendBase}${url}`;
  }

  // Frontend public static assets like /avatar.webp or /Amit_Chauhan_Resume.pdf are served by Vercel
  if (url.startsWith('/')) {
    return url;
  }

  return url;
};

