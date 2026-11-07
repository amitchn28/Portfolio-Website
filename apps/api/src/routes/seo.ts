import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';

const router = Router();

// GET /sitemap.xml (Dynamic XML Sitemap)
router.get('/sitemap.xml', async (_req: Request, res: Response) => {
  try {
    const siteUrl = process.env.VITE_SITE_URL || 'http://localhost:3000';

    const [projects, posts] = await Promise.all([
      prisma.project.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const staticRoutes = [
      { loc: `${siteUrl}/`, changefreq: 'daily', priority: '1.0' },
      { loc: `${siteUrl}/#about`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${siteUrl}/#education`, changefreq: 'monthly', priority: '0.7' },
      { loc: `${siteUrl}/#skills`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${siteUrl}/#projects`, changefreq: 'daily', priority: '0.9' },
      { loc: `${siteUrl}/#contact`, changefreq: 'monthly', priority: '0.6' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${route.loc}</loc>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic Published Projects
    for (const proj of projects) {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/project/${proj.slug}</loc>\n`;
      xml += `    <lastmod>${proj.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic Published Blog Posts
    for (const post of posts) {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${post.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (err) {
    res.status(500).send('<?xml version="1.0"?><error>Failed to generate sitemap</error>');
  }
});

// GET /robots.txt (Dynamic Robots Configuration)
router.get('/robots.txt', async (_req: Request, res: Response) => {
  try {
    const seo = await prisma.sEOSettings.findFirst();
    const siteUrl = process.env.VITE_SITE_URL || 'http://localhost:3000';
    const apiUrl = process.env.API_URL || process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 5000}`;

    const robotsRules = seo?.robots || 'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n';

    const output = `${robotsRules}\nSitemap: ${apiUrl}/sitemap.xml\nHost: ${siteUrl}\n`;

    res.header('Content-Type', 'text/plain');
    res.status(200).send(output);
  } catch (err) {
    res.status(200).send("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n");
  }
});

export const seoRoutes = router;

