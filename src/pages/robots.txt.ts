import type { APIRoute } from 'astro';

export const prerender = false;

const SITE = 'https://ai.bitora.it';

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /grazie

# Bloccato per future aree riservate
# Disallow: /admin/

Sitemap: ${SITE}/sitemap.xml
`;
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=86400',
    },
  });
};
