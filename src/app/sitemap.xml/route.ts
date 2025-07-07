import { NextResponse } from 'next/server';
import {pageDetails} from '@/app/[slug]/page'
import fs from 'fs';
import path from 'path';

function getBlogPosts() {
  try {
    const postsDirectory = path.join(process.cwd(), 'src/app/blogs/posts');
    const filenames = fs.readdirSync(postsDirectory);
    
    return filenames
      .filter(name => name.endsWith('.html')) 
      .map(filename => {
        const slug = filename.replace(/\.html$/, '');
        const filePath = path.join(postsDirectory, filename);
        const stats = fs.statSync(filePath);
        
        return {
          slug,
          lastmod: stats.mtime.toISOString()
        };
      });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

function getPageDetailsKeys() {
  return Object.keys(pageDetails);
}

export async function GET() {
  const baseUrl = 'https://www.lazedit.com';

  const staticPages = [
    '',
    '/blogs',
  ];

  // Get all blog posts dynamically
  const blogPosts = getBlogPosts();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map((path) => {
        return `
        <url>
          <loc>${baseUrl}${path}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>${path === '' ? '1.0' : '0.8'}</priority>
        </url>`;
      })
      .join('')}
    ${blogPosts
      .map((post) => {
        return `
        <url>
          <loc>${baseUrl}/blogs/${post.slug}</loc>
          <lastmod>${post.lastmod}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>`;
      })
      .join('')}
    ${getPageDetailsKeys()
      .map((slug) => {
        return `
        <url>
          <loc>${baseUrl}/${slug}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
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