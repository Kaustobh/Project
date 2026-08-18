// ES Module asset imports ensuring Vite bundles, hashes, and resolves exact URLs for GitHub Pages

import logoPng from '/public/LOGO.png?url';
import logoJpeg from '/public/logo.jpeg?url';
import kpi1 from '/public/KPI_1.jpeg?url';
import kpi2 from '/public/KPI_2.jpeg?url';
import kpi3 from '/public/KPI_3.jpeg?url';
import kpi4 from '/public/KPI_4.jpeg?url';
import kpi5 from '/public/KPI_5.jpeg?url';
import kpi6 from '/public/KPI_6.jpeg?url';

export const IMAGES = {
  LOGO_PNG: logoPng,
  LOGO_JPEG: logoJpeg,
  KPI_1: kpi1,
  KPI_2: kpi2,
  KPI_3: kpi3,
  KPI_4: kpi4,
  KPI_5: kpi5,
  KPI_6: kpi6
};

export function getImage(keyOrPath) {
  if (!keyOrPath) return logoPng;
  if (keyOrPath.startsWith('http://') || keyOrPath.startsWith('https://') || keyOrPath.startsWith('data:')) {
    return keyOrPath;
  }
  
  const map = {
    '/LOGO.png': logoPng,
    'LOGO.png': logoPng,
    '/logo.jpeg': logoJpeg,
    'logo.jpeg': logoJpeg,
    '/KPI_1.jpeg': kpi1,
    'KPI_1.jpeg': kpi1,
    '/KPI_2.jpeg': kpi2,
    'KPI_2.jpeg': kpi2,
    '/KPI_3.jpeg': kpi3,
    'KPI_3.jpeg': kpi3,
    '/KPI_4.jpeg': kpi4,
    'KPI_4.jpeg': kpi4,
    '/KPI_5.jpeg': kpi5,
    'KPI_5.jpeg': kpi5,
    '/KPI_6.jpeg': kpi6,
    'KPI_6.jpeg': kpi6,
  };

  return map[keyOrPath] || keyOrPath;
}
