export const getAssetUrl = (url?: string | null): string => {
  if (!url) return '';
  const backendBase = (
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api'
  ).replace(/\/api\/?$/, '');

  // If URL was previously saved with http://localhost:5000, swap it with the live backend URL
  if (url.startsWith('http://localhost:5000')) {
    return url.replace('http://localhost:5000', backendBase);
  }

  // If URL is a relative path like /uploads/...
  if (url.startsWith('/')) {
    return `${backendBase}${url}`;
  }

  return url;
};

