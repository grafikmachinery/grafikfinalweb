import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distPath = path.resolve(projectRoot, 'dist');
const distSsrPath = path.resolve(projectRoot, 'dist-ssr');

const BASE_URL = 'https://www.grafikmachinery.in';
const DEFAULT_IMAGE = `${BASE_URL}/grafik_logo_transparent.png`;

// Per-product SEO data (titles, descriptions, images)
const PRODUCT_META = {
  'uv-curing-systems': {
    title: 'UV Curing Systems 250 to 1000 mm - Grafik Machinery',
    desc:  'High-performance ultraviolet curing systems in sizes from 250 mm to 1000 mm for printing and packaging. Contact Grafik Machinery International for details.',
    image: `${BASE_URL}/product_uv_curing.jpg`,
    name:  'U.V. Curing Systems',
  },
  'led-uv-systems': {
    title: 'LED UV Curing Systems - Grafik Machinery International',
    desc:  'Eco-friendly, energy-efficient LED UV curing solutions for modern presses, with specifications. Contact Grafik Machinery International for details.',
    image: `${BASE_URL}/product_led_uv.jpg`,
    name:  'LED UV Systems',
  },
  'carton-folding-gluing': {
    title: 'Carton Folding and Gluing Machine - Grafik Machinery',
    desc:  'Carton folding and gluing machine equipped with prefold and lock bottom attachments for versatile packaging lines. Contact Grafik Machinery International.',
    image: `${BASE_URL}/product_carton_gluer.jpg`,
    name:  'Carton Folding and Gluing Machine',
  },
  'cache-cover-gluer': {
    title: 'Cache Cover Folder Gluer Machine - Grafik Machinery',
    desc:  'Specialized folding and pasting machine for passport, cache and folder jackets. Contact Grafik Machinery International for details.',
    image: `${BASE_URL}/product_folder_gluer.jpg`,
    name:  'Cache Cover Folder Gluer Machine',
  },
  'window-patching': {
    title: 'Window Patching and Liner Carton Machine - Grafik',
    desc:  'High-precision window film patching and liner carton machine for toy, cosmetic and food boxes. Contact Grafik Machinery International for details.',
    image: `${BASE_URL}/carton_gluer.jpg`,
    name:  'Window Patching and Liner Carton Machine',
  },
  'roller-coater': {
    title: 'Roller Coater for UV and Aqueous Varnish - Grafik',
    desc:  'High-speed automated roller coater for UV and aqueous varnish, for full sheet gloss. Contact Grafik Machinery International for details.',
    image: `${BASE_URL}/hero.jpg`,
    name:  'Roller Coater for UV and Aqueous Varnish',
  },
  'print-plus-coat': {
    title: 'Print Plus Coat Coating System - Grafik Machinery',
    desc:  'Inline coating attachment that adds coating capability directly to existing offset presses. Contact Grafik Machinery International for details.',
    image: `${BASE_URL}/hero.jpg`,
    name:  'Print Plus Coat \u2013 Coating System',
  },
  'interdeck-uv': {
    title: 'Interdeck and End of Press UV Curing - Grafik',
    desc:  'Flexible interdeck and end of press UV curing systems for multicolor, high-speed offset setups. Contact Grafik Machinery International for details.',
    image: `${BASE_URL}/hero.jpg`,
    name:  'Interdeck/End of Press UV Curing System',
  },
  'sheet-stacker': {
    title: 'Automatic Sheet Stacker - Grafik Machinery International',
    desc:  'High-speed automatic sheet stacker that organizes sheets directly at the end of coating runs. Contact Grafik Machinery International for details.',
    image: `${BASE_URL}/hero.jpg`,
    name:  'Automatic Sheet Stacker',
  },
};

// Page-level SEO data for non-product routes
const PAGE_META = {
  '/': {
    title: 'Grafik Machinery International | Premium Industrial Printing & Packaging Solutions',
    desc:  'Grafik Machinery International \u2014 manufacturer and exporter of UV curing systems, LED UV dryers, carton folder gluers, roller coaters, and customized printing machinery since 1989.',
    image: DEFAULT_IMAGE,
    type:  'website',
  },
  '/about': {
    title: 'About Our Company - Grafik Machinery International',
    desc:  '35+ years of engineering excellence in high-performance printing, UV curing, and carton packaging machinery from Grafik Machinery International, founded in 1989.',
    image: `${BASE_URL}/about_exhibition.jpg`,
    type:  'website',
  },
  '/products': {
    title: 'Products - Grafik Machinery International',
    desc:  'UV curing systems, LED UV systems, carton folding and gluing machines, coaters and more from Grafik Machinery International in Okhla, New Delhi.',
    image: DEFAULT_IMAGE,
    type:  'website',
  },
  '/gallery': {
    title: 'Gallery - Grafik Machinery International',
    desc:  'Visual tour and photo gallery of Grafik Machinery International factory floor, machinery assembly lines, and high-performance equipment.',
    image: `${BASE_URL}/hero.jpg`,
    type:  'website',
  },
  '/contact': {
    title: 'Contact Us - Grafik Machinery International',
    desc:  'Contact Grafik Machinery International in New Delhi, India. Request quotes, detailed technical specifications, and export details.',
    image: DEFAULT_IMAGE,
    type:  'website',
  },
};

async function prerender() {
  console.log('\uD83D\uDE80 Starting static pre-rendering...');

  const templatePath = path.resolve(distPath, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error('dist/index.html not found. Run client build first.');
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

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

  console.log(`\uD83D\uDCC4 Generating static HTML for ${routes.length} pages...`);

  for (const route of routes) {
    const { html, route: routeInfo } = render(route);
    let pageHtml = template;

    // ── Resolve per-page metadata ─────────────────────────────────────────
    let meta;
    if (PAGE_META[route]) {
      meta = PAGE_META[route];
    } else if (route.startsWith('/product/')) {
      const slug = route.replace('/product/', '');
      const pm = PRODUCT_META[slug];
      if (pm) meta = { title: pm.title, desc: pm.desc, image: pm.image, type: 'product' };
    }
    if (!meta) {
      meta = { title: routeInfo?.title || 'Grafik Machinery International', desc: '', image: DEFAULT_IMAGE, type: 'website' };
    }

    const canonicalUrl = `${BASE_URL}${route === '/' ? '/' : route}`;
    const safeTitle = meta.title.replace(/"/g, '&quot;');
    const safeDesc  = meta.desc.replace(/"/g, '&quot;');

    // ── 1. <title> ────────────────────────────────────────────────────────
    if (routeInfo?.title) {
      pageHtml = pageHtml.replace(/<title>.*?<\/title>/, `<title>${routeInfo.title}</title>`);
    }

    // ── 2. Meta description ───────────────────────────────────────────────
    if (meta.desc) {
      pageHtml = pageHtml.replace(
        /<meta name="description" content=".*?" \/>/,
        `<meta name="description" content="${safeDesc}" />`
      );
    }

    // ── 3. Open Graph + Twitter Card ──────────────────────────────────────
    const ogBlock = [
      `    <!-- Open Graph / Social sharing -->`,
      `    <meta property="og:type"        content="${meta.type}" />`,
      `    <meta property="og:url"         content="${canonicalUrl}" />`,
      `    <meta property="og:site_name"   content="Grafik Machinery International" />`,
      `    <meta property="og:title"       content="${safeTitle}" />`,
      `    <meta property="og:description" content="${safeDesc}" />`,
      `    <meta property="og:image"       content="${meta.image}" />`,
      `    <meta property="og:image:width" content="1200" />`,
      `    <meta property="og:image:height" content="630" />`,
      `    <meta property="og:locale"      content="en_IN" />`,
      `    <!-- Twitter / X Card -->`,
      `    <meta name="twitter:card"        content="summary_large_image" />`,
      `    <meta name="twitter:title"       content="${safeTitle}" />`,
      `    <meta name="twitter:description" content="${safeDesc}" />`,
      `    <meta name="twitter:image"       content="${meta.image}" />`,
    ].join('\n');

    // ── 4. Schema.org JSON-LD ─────────────────────────────────────────────
    let schemaObj = null;

    if (route === '/') {
      schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Grafik Machinery International',
        'url': BASE_URL,
        'logo': `${BASE_URL}/grafik_logo_transparent.png`,
        'foundingDate': '1989',
        'description': 'Manufacturer, exporter, and supplier of UV curing systems, LED UV systems, carton folder gluers, roller coaters, and customized printing machinery.',
        'telephone': '+919811779251',
        'email': 'grafikmachinery@gmail.com',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'F-289, Flatted Factory Complex, Okhla Phase III',
          'addressLocality': 'New Delhi',
          'postalCode': '110020',
          'addressCountry': 'IN'
        },
        'sameAs': [
          'https://www.facebook.com/Grafikmachinery',
          'https://www.youtube.com/@grafikmachinery',
          'https://www.linkedin.com/in/kanishk-jain-43787236/'
        ]
      };
    } else if (route.startsWith('/product/')) {
      const slug = route.replace('/product/', '');
      const pm = PRODUCT_META[slug];
      if (pm) {
        schemaObj = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          'name': pm.name,
          'description': pm.desc,
          'image': pm.image,
          'url': canonicalUrl,
          'brand': { '@type': 'Brand', 'name': 'Grafik Machinery International' },
          'manufacturer': { '@type': 'Organization', 'name': 'Grafik Machinery International', 'url': BASE_URL },
          'offers': {
            '@type': 'Offer',
            'url': canonicalUrl,
            'availability': 'https://schema.org/InStock',
            'priceCurrency': 'INR',
            'seller': { '@type': 'Organization', 'name': 'Grafik Machinery International' }
          }
        };
      }
    }

    const schemaBlock = schemaObj
      ? `\n    <script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 6)}\n    </script>`
      : '';

    // ── 5. Canonical ──────────────────────────────────────────────────────
    const canonicalTag = `\n    <link rel="canonical" href="${canonicalUrl}" />`;

    // Remove any existing canonical then inject everything before </head>
    pageHtml = pageHtml.replace(/<link rel="canonical" href=".*?" \/>/, '');
    pageHtml = pageHtml.replace(
      '</head>',
      `${ogBlock}${schemaBlock}${canonicalTag}\n  </head>`
    );

    // ── 6. Pre-rendered HTML ──────────────────────────────────────────────
    pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

    // ── Write files ───────────────────────────────────────────────────────
    if (route === '/') {
      fs.writeFileSync(path.resolve(distPath, 'index.html'), pageHtml);
      console.log(`  \u2713 / -> dist/index.html`);
    } else if (route === '/404') {
      fs.writeFileSync(path.resolve(distPath, '404.html'), pageHtml);
      console.log(`  \u2713 /404 -> dist/404.html`);
    } else {
      const cleanRoute = route.replace(/^\/+/, '');
      const targetDir = path.resolve(distPath, cleanRoute);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.resolve(targetDir, 'index.html'), pageHtml);
      fs.writeFileSync(path.resolve(distPath, `${cleanRoute}.html`), pageHtml);
      console.log(`  \u2713 ${route} -> dist/${cleanRoute}/index.html & dist/${cleanRoute}.html`);
    }
  }

  fs.rmSync(distSsrPath, { recursive: true, force: true });
  console.log('\u2728 Static pre-rendering successfully completed!');
}

prerender().catch(err => {
  console.error('\u274C Pre-rendering failed:', err);
  process.exit(1);
});
