import { SitemapStream } from 'sitemap';
import { createWriteStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the pages you want to include in the sitemap
const pages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/sign-in', changefreq: 'monthly', priority: 0.8 },
    { url: '/sign-up', changefreq: 'monthly', priority: 0.8 },
    { url: '/manager', changefreq: 'monthly', priority: 0.9 },
    { url: '/issues', changefreq: 'weekly', priority: 0.6 }, // GitHub issues page
    { url: '/pulls', changefreq: 'weekly', priority: 0.6 }, // GitHub pull requests page
    { url: '/#readme', changefreq: 'monthly', priority: 0.7 }, // README section
    // Add more URLs as needed
];

async function generateSitemap() {
    // Create a write stream to save the sitemap.xml file
    const writeStream = createWriteStream(path.resolve(__dirname, 'public', 'sitemap.xml'));
    
    // Create a new SitemapStream with your website's hostname
    const sitemap = new SitemapStream({ hostname: 'https://github.com/jinx-vi-0/passop' });
    
    // Pipe the sitemap to the write stream and log success message on finish
    sitemap.pipe(writeStream).on('finish', () => {
        console.log('Sitemap generated successfully');
    });

    // Write each page to the sitemap
    pages.forEach(page => sitemap.write(page));
    
    // End the sitemap stream
    sitemap.end();
}

// Execute the generateSitemap function and catch any errors
generateSitemap().catch(error => {
    console.error('Error generating sitemap:', error);
});