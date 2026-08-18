// Dynamic base-path resolution helper for public assets on GitHub Pages (/Project/)

export function getImage(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  const base = import.meta.env.BASE_URL || '/';
  // Ensure base ends with slash and cleanPath has no leading slash
  const formattedBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${formattedBase}${cleanPath}`;
}

export const IMAGES = {
  LOGO_PNG: getImage('/LOGO.png'),
  LOGO_JPEG: getImage('/logo.jpeg'),
  KPI_1: getImage('/KPI_1.jpeg'),
  KPI_2: getImage('/KPI_2.jpeg'),
  KPI_3: getImage('/KPI_3.jpeg'),
  KPI_4: getImage('/KPI_4.jpeg'),
  KPI_5: getImage('/KPI_5.jpeg'),
  KPI_6: getImage('/KPI_6.jpeg'),
};
