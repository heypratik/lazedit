import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.lazedit.com';

  const staticPages = [
    '',
    '/blogs',
    '/pricing',
    '/about', 
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map((path) => {
        return `
        <url>
          <loc>${baseUrl}${path}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </url>`;
      })
      .join('')}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
