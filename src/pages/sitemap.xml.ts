import type { APIRoute } from 'astro';

export const prerender = false;

const SITE = 'https://ai.bitora.it';

const routes: { path: string; priority: number; changefreq: string }[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/automazioni', priority: 0.9, changefreq: 'monthly' },
  { path: '/chatbot', priority: 0.9, changefreq: 'monthly' },
  { path: '/siti-web', priority: 0.9, changefreq: 'monthly' },
  { path: '/gestionali', priority: 0.9, changefreq: 'monthly' },
  { path: '/formazione', priority: 0.85, changefreq: 'monthly' },
  { path: '/casi-studio', priority: 0.8, changefreq: 'monthly' },
  { path: '/piemonte', priority: 0.8, changefreq: 'monthly' },
  { path: '/contatti', priority: 0.85, changefreq: 'monthly' },
];

export const GET: APIRoute = () => {
  const now = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;
  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
