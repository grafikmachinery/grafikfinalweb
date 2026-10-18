import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distPath = path.resolve(projectRoot, 'dist');
const distSsrPath = path.resolve(projectRoot, 'dist-ssr');

async function prerender() {
  console.log('🚀 Starting static pre-rendering...');

  const templatePath = path.resolve(distPath, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error('dist/index.html not found. Run client build first.');
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  // Load SSR bundle
  const ssrEntryPath = path.resolve(distSsrPath, 'entry-server.js');
  if (!fs.existsSync(ssrEntryPath)) {
    throw new Error('dist-ssr/entry-server.js not found. Run SSR build first.');
  }

  const { render, PRODUCTS } = await import(ssrEntryPath);

  const routes = [
    '/',
    '/about',
    '/products',
    '/gallery',
    '/contact',
    ...PRODUCTS.map(p => `/product/${p.id}`),
    '/404'
  ];

  console.log(`📄 Generating static HTML for ${routes.length} pages...`);

  for (const route of routes) {
    const { html, route: routeInfo } = render(route);

    let pageHtml = template;

    // Update <title>
    if (routeInfo && routeInfo.title) {
      pageHtml = pageHtml.replace(
        /<title>.*?<\/title>/,
        `<title>${routeInfo.title}</title>`
      );
    }

    // Update meta description
    let metaDesc = '';
    if (route === '/about') {
      metaDesc = 'Grafik Machinery International (founded 1989) — 35+ years of engineering excellence in high-performance printing, UV curing, and carton packaging machinery.';
    } else if (route === '/products') {
      metaDesc = 'Explore our complete catalog of industrial UV curing systems, LED UV dryers, carton folder gluers, roller coaters, and customized machinery.';
    } else if (route === '/gallery') {
      metaDesc = 'Visual tour and photo gallery of Grafik Machinery International factory floor, machinery assembly lines, and high-performance equipment.';
    } else if (route === '/contact') {
      metaDesc = 'Contact Grafik Machinery International in New Delhi, India. Request quotes, detailed technical specifications, and export details.';
    } else if (route.startsWith('/product/')) {
      const slug = route.replace('/product/', '');
      const prod = PRODUCTS.find(p => p.id === slug);
      if (prod) {
        metaDesc = `${prod.name} — ${prod.shortDesc} Built for high-volume industrial printing and packaging lines.`;
      }
    }

    if (metaDesc) {
      pageHtml = pageHtml.replace(
        /<meta name="description" content=".*?" \/>/,
        `<meta name="description" content="${metaDesc.replace(/"/g, '&quot;')}" />`
      );
    }

    // Add canonical link for SEO
    const canonicalUrl = `https://www.grafikmachinery.in${route === '/' ? '/' : route}`;
    if (!pageHtml.includes('rel="canonical"')) {
      pageHtml = pageHtml.replace(
        '</head>',
        `  <link rel="canonical" href="${canonicalUrl}" />\n  </head>`
      );
    } else {
      pageHtml = pageHtml.replace(
        /<link rel="canonical" href=".*?" \/>/,
        `<link rel="canonical" href="${canonicalUrl}" />`
      );
    }

    // Inject pre-rendered React component tree into #root
    pageHtml = pageHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`
    );

    // Save output files
    if (route === '/') {
      fs.writeFileSync(path.resolve(distPath, 'index.html'), pageHtml);
      console.log(`  ✓ / -> dist/index.html`);
    } else if (route === '/404') {
      fs.writeFileSync(path.resolve(distPath, '404.html'), pageHtml);
      console.log(`  ✓ /404 -> dist/404.html`);
    } else {
      const cleanRoute = route.replace(/^\/+/, '');
      const targetDir = path.resolve(distPath, cleanRoute);
      fs.mkdirSync(targetDir, { recursive: true });

      // Write both [route]/index.html and [route].html for maximum web server compatibility
      fs.writeFileSync(path.resolve(targetDir, 'index.html'), pageHtml);
      fs.writeFileSync(path.resolve(distPath, `${cleanRoute}.html`), pageHtml);
      console.log(`  ✓ ${route} -> dist/${cleanRoute}/index.html & dist/${cleanRoute}.html`);
    }
  }

  // Cleanup dist-ssr
  fs.rmSync(distSsrPath, { recursive: true, force: true });
  console.log('✨ Static pre-rendering successfully completed!');
}

prerender().catch(err => {
  console.error('❌ Pre-rendering failed:', err);
  process.exit(1);
});
