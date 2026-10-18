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

    // Update meta description — exact text from SEO table
    const PRODUCT_DESCS = {
      'uv-curing-systems':    'High-performance ultraviolet curing systems in sizes from 250 mm to 1000 mm for printing and packaging. Contact Grafik Machinery International for details.',
      'led-uv-systems':       'Eco-friendly, energy-efficient LED UV curing solutions for modern presses, with specifications. Contact Grafik Machinery International for details.',
      'carton-folding-gluing':'Carton folding and gluing machine equipped with prefold and lock bottom attachments for versatile packaging lines. Contact Grafik Machinery International.',
      'cache-cover-gluer':    'Specialized folding and pasting machine for passport, cache and folder jackets. Contact Grafik Machinery International for details.',
      'window-patching':      'High-precision window film patching and liner carton machine for toy, cosmetic and food boxes. Contact Grafik Machinery International for details.',
      'roller-coater':        'High-speed automated roller coater for UV and aqueous varnish, for full sheet gloss. Contact Grafik Machinery International for details.',
      'print-plus-coat':      'Inline coating attachment that adds coating capability directly to existing offset presses. Contact Grafik Machinery International for details.',
      'interdeck-uv':         'Flexible interdeck and end of press UV curing systems for multicolor, high-speed offset setups. Contact Grafik Machinery International for details.',
      'sheet-stacker':        'High-speed automatic sheet stacker that organizes sheets directly at the end of coating runs. Contact Grafik Machinery International for details.',
    };

    let metaDesc = '';
    if (route === '/about') {
      metaDesc = '35+ years of engineering excellence in high-performance printing, UV curing, and carton packaging machinery from Grafik Machinery International, founded in 1989.';
    } else if (route === '/products') {
      metaDesc = 'UV curing systems, LED UV systems, carton folding and gluing machines, coaters and more from Grafik Machinery International in Okhla, New Delhi.';
    } else if (route === '/gallery') {
      metaDesc = 'Visual tour and photo gallery of Grafik Machinery International factory floor, machinery assembly lines, and high-performance equipment.';
    } else if (route === '/contact') {
      metaDesc = 'Contact Grafik Machinery International in New Delhi, India. Request quotes, detailed technical specifications, and export details.';
    } else if (route.startsWith('/product/')) {
      const slug = route.replace('/product/', '');
      metaDesc = PRODUCT_DESCS[slug] || '';
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
