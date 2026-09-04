import { useState, useEffect } from 'react';
import { 
  Sun, 
  Cpu, 
  Layers, 
  Maximize, 
  Wind, 
  BookOpen, 
  Download, 
  PlusSquare, 
  Activity, 
  Award, 
  Shield, 
  Clock, 
  Globe, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ChevronRight, 
  FileText, 
  ArrowRight, 
  ExternalLink, 
  MessageSquare, 
  Check,
  Ruler,
  Zap,
  Gauge,
  Camera
} from 'lucide-react';

// Custom Social SVG Icon Components (Lucide brand icons fallback)
const FacebookIcon = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const LinkedinIcon = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// B2B Specifications Table Icons Mapping
const getSpecIcon = (lbl) => {
  const label = lbl.toLowerCase();
  if (label.includes('size')) return <Ruler size={16} style={{ marginRight: '8px' }} />;
  if (label.includes('power') || label.includes('voltage') || label.includes('lamp') || label.includes('saving')) return <Zap size={16} style={{ marginRight: '8px' }} />;
  if (label.includes('speed') || label.includes('capacity') || label.includes('limit')) return <Gauge size={16} style={{ marginRight: '8px' }} />;
  if (label.includes('cool')) return <Wind size={16} style={{ marginRight: '8px' }} />;
  if (label.includes('wavelength') || label.includes('wave') || label.includes('frequency')) return <Activity size={16} style={{ marginRight: '8px' }} />;
  if (label.includes('life') || label.includes('span') || label.includes('hour') || label.includes('time')) return <Clock size={16} style={{ marginRight: '8px' }} />;
  return <Check size={16} style={{ marginRight: '8px' }} />;
};

// Trust Stats Animating Component
function StatCounter({ target, suffix = '', label }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const targetNum = parseInt(target, 10);
    if (isNaN(targetNum)) {
      setCount(target);
      return;
    }

    let observer;
    const element = document.getElementById(`stat-counter-${label.replace(/\s+/g, '-').toLowerCase()}`);

    if (element && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500; // milliseconds
          const startTime = performance.now();

          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = progress * (2 - progress); // easeOutQuad
            
            let current;
            if (targetNum > 1000) {
              const startVal = 1940;
              current = Math.floor(startVal + (targetNum - startVal) * easeProgress);
            } else {
              current = Math.floor(targetNum * easeProgress);
            }
            
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(targetNum);
            }
          };

          requestAnimationFrame(animate);
        }
      }, { threshold: 0.1 });

      observer.observe(element);
    } else {
      setCount(targetNum);
    }

    return () => {
      if (observer && element) {
        observer.unobserve(element);
      }
    };
  }, [target, label, hasAnimated]);

  return (
    <div className="stat-item" id={`stat-counter-${label.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="stat-number">
        {typeof count === 'number' ? count : target}
        {suffix}
      </div>
      <div className="stat-accent-line"></div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// Product Catalog
const PRODUCTS = [
  {
    id: 'uv-curing-systems',
    name: 'U.V. Curing Systems',
    shortDesc: 'High-performance ultraviolet curing systems available in sizes from 250mm to 1000mm.',
    longDesc: 'Our flagship Grafik Tech U.V. Curing Systems are designed to resolve complex printing challenges. Built with premium materials, they offer exceptional drying speed, thermal stability, and energy efficiency. Suitable for various substrates and high-speed production lines.',
    specifications: {
      'Sizes Available': '250, 400, 500, 700 to 1000 mm',
      'Power Source': 'High-intensity UV lamps (imported from USA)',
      'Speed Control': 'Infinitely variable speed AC drive',
      'Cooling System': 'Air-cooled exhaust blower system',
      'Application': 'Post-press coating drying, gloss curing'
    },
    image: '/product_uv_curing.jpg',
    icon: Sun
  },
  {
    id: 'led-uv-systems',
    name: 'LED UV Systems',
    shortDesc: 'Eco-friendly and energy-efficient LED UV curing solutions for modern presses.',
    longDesc: 'Engineered for energy efficiency and minimal thermal stress on printing substrates. Our LED UV curing systems provide instant on/off capabilities, incredibly long life cycles (20,000+ hours), and zero ozone emissions, making them the future of B2B printing plants.',
    specifications: {
      'Wavelength': '395nm / 385nm',
      'Life Span': '20,000+ Operating Hours',
      'Energy Saving': 'Up to 70% compared to mercury UV',
      'Cooling': 'Water chilled system / Air cooled options',
      'Thermal Load': 'Zero heat radiation on paper'
    },
    image: '/product_led_uv.jpg',
    icon: Cpu
  },
  {
    id: 'carton-folding-gluing',
    name: 'Carton Folding and Gluing Machine',
    shortDesc: 'Equipped with prefold and lock bottom attachments for versatile packaging lines.',
    longDesc: 'A versatile machine capable of handling various carton designs. Standard configurations include lock-bottom and prefolding attachments. Precision guides, robust drive belts, and simple controls make it ideal for high-volume packaging manufacturers looking for high uptime.',
    specifications: {
      'Max Speed': '250 m/min',
      'Paperboard Range': '200 - 600 gsm',
      'Corrugated Option': 'N, F & E Flute',
      'Attachments': 'Prefold & Lock Bottom attachments included',
      'Drive System': 'Synchronized multi-belt drive'
    },
    image: '/product_carton_gluer.jpg',
    icon: Layers
  },
  {
    id: 'window-patching',
    name: 'Window Patching and Liner Carton Machine',
    shortDesc: 'High-precision window film patching for toy, cosmetic, and food boxes.',
    longDesc: 'Designed to apply clear film patches to pre-cut carton blanks for packaging styles requiring visual product displays (e.g. cosmetic boxes, toy packs). High gluing accuracy, adjustable film cutting length, and speed controls ensure zero-defect packaging runs.',
    specifications: {
      'Max Blank Width': '800 mm',
      'Film Length': '50 - 350 mm',
      'Glue Application': 'Precision rotary disc system',
      'Capacity': 'Up to 8,000 sheets/hour',
      'Materials': 'PET, PVC, OPP film window patch'
    },
    image: '/carton_gluer.jpg',
    icon: Maximize
  },
  {
    id: 'roller-coater',
    name: 'Roller Coater for UV and Aqueous Varnish',
    shortDesc: 'High-speed automated varnishing and coating machines for full sheet gloss.',
    longDesc: 'Our heavy-duty roller coating system provides beautiful, uniform coverage of both UV and water-based (aqueous) varnishes. It is the perfect unit for post-press finishing, delivering beautiful high-gloss or matte coatings on brochure covers, packaging sheets, and graphics cards.',
    specifications: {
      'Maximum Width': '750 mm / 1000 mm options',
      'Coating Material': 'UV Varnish & Aqueous Varnish',
      'Thickness Adjustment': 'Manual micrometer dial',
      'Production Capacity': 'Up to 4,000 sheets/hour',
      'Roller Type': 'Imported polyurethane application roller'
    },
    image: '/hero.jpg',
    icon: Wind
  },
  {
    id: 'cache-cover-gluer',
    name: 'Cache Cover Folder Gluer Machine',
    shortDesc: 'Specialized folding and pasting device for passport, cache, and folder jackets.',
    longDesc: 'Designed to handle folding and gluing of passport jackets, cache covers, file folders, and customized jackets. A highly specialized machine that eliminates manual folding errors, ensuring exact alignment and clean glue seams for premium products.',
    specifications: {
      'Suitable For': 'Passport covers, cache covers, pocket folders',
      'Folding Steps': 'Automatic dual fold',
      'Gluing System': 'Cold glue nozzle / Hot melt optional',
      'Control Panel': 'Digital touch counter display',
      'Feeder Type': 'Bottom suction friction feeder'
    },
    image: '/product_folder_gluer.jpg',
    icon: BookOpen
  },
  {
    id: 'sheet-stacker',
    name: 'Automatic Sheet Stacker',
    shortDesc: 'High-speed stacker to organize sheets directly at the end of coating runs.',
    longDesc: 'Enables continuous operation by automatically stacking coated and dried sheets neatly onto pallets. Synchronized with the speed of the coating machine, it features adjustable side-joggers and sheet deceleration to prevent graphics scratching.',
    specifications: {
      'Maximum Sheet Size': '800 x 1020 mm',
      'Minimum Sheet Size': '300 x 400 mm',
      'Stacking Height': '900 mm maximum',
      'Speed Match': 'Auto-synchronized with conveyor',
      'Pallet Type': 'Standard industrial pallets'
    },
    image: '/hero.jpg',
    icon: Download
  },
  {
    id: 'print-plus-coat',
    name: 'Print Plus Coat – Coating System',
    shortDesc: 'Inline coating attachment to add coating capability directly to existing offset presses.',
    longDesc: 'Print Plus Coat is our revolutionary retrofitted coating device. It allows you to coat your existing offset setup inline without affecting print paper quality. Compatible with major printing press brands like Heidelberg, Komori, Planeta, and Adast. It delivers immediate cost savings and inline efficiency.',
    specifications: {
      'Retrofit Brands': 'Heidelberg (SORS/SORSZ/SORMZ), Komori (L228/L540), Adast, Planeta',
      'Position': 'Installed directly on the offset press unit',
      'Advantages': 'No extra footprint, inline efficiency, minimal overhead',
      'Coating Style': 'Coarse or fine varnish coating',
      'Ink Compatibility': 'UV and conventional inks'
    },
    image: '/hero.jpg',
    icon: PlusSquare
  },
  {
    id: 'interdeck-uv',
    name: 'Interdeck/End of Press UV Curing System',
    shortDesc: 'Flexible interdeck drying systems for multicolor high-speed offset setups.',
    longDesc: 'Designed for multi-color sheetfed offset presses. Interdeck systems are installed between printing units to dry ink instantly before the next color is applied, preventing smearing and enabling printing on non-absorbent plastics, foils, and high-gloss boards.',
    specifications: {
      'Lamp Count': '1 to 3 interdeck units + end of press dryer',
      'Cooling Method': 'Water-cooled shutters & air-cooled lamp bodies',
      'Integration': 'Fully integrated with press safety interlocks',
      'Control': 'PLC touch screen console',
      'Shutters': 'Pneumatic fast-action shutter control'
    },
    image: '/hero.jpg',
    icon: Activity
  }
];

// Additional products list for About/Products Page
const ADDITIONAL_PRODUCTS = [
  'Carton Folder Gluer',
  'Mini Folder Gluer',
  'Baby Folder Gluer',
  'Jumbo Folder Gluer for Corrugated Cartons',
  'Carton Pasting Machine',
  'Automatic Paper Banding Machine',
  'UV Coating Machine (KBA)',
  'Customized Machinery',
  'Infrared Dryer',
  'Wide Range of Creasing Matrix'
];

// Installations List
const INSTALLATIONS = [
  { id: 1, client: 'Aar Aar Printers', location: 'Mumbai', press: 'Print Plus Coat on Heidelberg SORSZ' },
  { id: 2, client: 'Jaiswal Art Press', location: 'Naraina, New Delhi', press: 'Print Plus Coat on Heidelberg SORS' },
  { id: 3, client: 'Civni Packs', location: 'Rai, Haryana', press: 'Print Plus Coat on Adast 715' },
  { id: 4, client: 'Vibgyor Arts', location: 'Kolkata', press: 'Print Plus Coat on Komori L228' },
  { id: 5, client: 'Spectra Printers', location: 'Ambala', press: 'Roller Coater 30 and UV Drier' },
  { id: 6, client: 'Kongo Print Packin Pvt. Ltd.', location: 'Coimbatore', press: 'Print Plus Coat on Komori L540' },
  { id: 7, client: 'Classic Printers', location: 'Bawana, New Delhi', press: 'Print Plus Coat on Adast 715M' },
  { id: 8, client: 'Atharva Packaging Pvt. Ltd.', location: 'Indore', press: 'Print Plus Coat on Planeta P54' },
  { id: 9, client: 'Creators Creation', location: 'Bahadurgarh', press: 'Print Plus Coat on Planeta P24 and UV Drier' },
  { id: 10, client: 'Flutes and Grafix', location: 'Bawana, New Delhi', press: 'Print Plus Coat on Heidelberg SORMZ and UV & IR Drier' }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [quoteSubject, setQuoteSubject] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Scroll Listener for Frosted Glass Navbar Transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    // Run once on load in case page is already scrolled
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hash-based Routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setIsMobileMenuOpen(false);
      window.scrollTo(0, 0);

      if (hash.startsWith('#product/')) {
        const id = hash.replace('#product/', '');
        const exists = PRODUCTS.some(p => p.id === id);
        if (exists) {
          setSelectedProductId(id);
          setCurrentPage('product-detail');
        } else {
          setCurrentPage('products');
        }
      } else {
        const cleanHash = hash.replace('#', '');
        const validPages = ['home', 'about', 'products', 'gallery', 'brochure', 'contact'];
        if (validPages.includes(cleanHash)) {
          setCurrentPage(cleanHash);
        } else {
          setCurrentPage('home');
        }
      }
    };

    // Initialize routing on load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, { threshold: 0.1 });

      animatedElements.forEach(el => observer.observe(el));
      return () => {
        animatedElements.forEach(el => observer.unobserve(el));
      };
    } else {
      // Fallback
      animatedElements.forEach(el => el.classList.add('revealed'));
    }
  }, [currentPage]);

  // Navigate utility
  const navigateTo = (pageHash) => {
    window.location.hash = pageHash;
  };

  // Pre-fill quote message
  const triggerQuoteRequest = (productName) => {
    setFormData(prev => ({
      ...prev,
      message: `Hi Grafik Machinery, I would like to request a quote for the "${productName}" and obtain further technical details. Please contact me with pricing and export information.`
    }));
    navigateTo('contact');
  };

  // Contact Form Submission Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.company.trim()) errors.company = 'Company name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) errors.message = 'Message/Requirements cannot be empty';
    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Success Simulation
    setFormSubmitted(true);
    setFormErrors({});
  };

  const resetContactForm = () => {
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      message: ''
    });
    setFormSubmitted(false);
  };

  return (
    <div className="app-layout">
      {/* Sticky Header & Navbar */}
      <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#home" className="nav-logo-link" onClick={() => navigateTo('home')}>
            <img src="/grafik_full_logo.jpg" alt="Grafik Machinery Logo" className="nav-logo-img" />
            <span className="logo-text">GRAFIK MACHINERY INTERNATIONAL</span>
          </a>

          {/* Desktop Links */}
          <nav>
            <ul className="nav-links">
              <li>
                <a 
                  href="#home" 
                  className={`nav-item-link ${currentPage === 'home' ? 'active' : ''}`}
                >Home</a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className={`nav-item-link ${currentPage === 'about' ? 'active' : ''}`}
                >About Us</a>
              </li>
              <li>
                <a 
                  href="#products" 
                  className={`nav-item-link ${currentPage === 'products' || currentPage === 'product-detail' ? 'active' : ''}`}
                >Products</a>
              </li>
              <li>
                <a 
                  href="#gallery" 
                  className={`nav-item-link ${currentPage === 'gallery' ? 'active' : ''}`}
                >Gallery</a>
              </li>
              <li>
                <a 
                  href="#brochure" 
                  className={`nav-item-link ${currentPage === 'brochure' ? 'active' : ''}`}
                >Brochure</a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="btn btn-primary"
                  style={{ marginLeft: '12px', padding: '10px 20px' }}
                >Get a Quote</a>
              </li>
            </ul>
          </nav>

          {/* Mobile hamburger menu toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      <div 
        className={`mobile-drawer-backdrop ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <button 
          className="mobile-drawer-close"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={28} />
        </button>
        
        <ul className="mobile-nav-links">
          <li>
            <a 
              href="#home" 
              className={`mobile-nav-item-link ${currentPage === 'home' ? 'active' : ''}`}
            >Home</a>
          </li>
          <li>
            <a 
              href="#about" 
              className={`mobile-nav-item-link ${currentPage === 'about' ? 'active' : ''}`}
            >About Us</a>
          </li>
          <li>
            <a 
              href="#products" 
              className={`mobile-nav-item-link ${currentPage === 'products' || currentPage === 'product-detail' ? 'active' : ''}`}
            >Products</a>
          </li>
          <li>
            <a 
              href="#gallery" 
              className={`mobile-nav-item-link ${currentPage === 'gallery' ? 'active' : ''}`}
            >Gallery</a>
          </li>
          <li>
            <a 
              href="#brochure" 
              className={`mobile-nav-item-link ${currentPage === 'brochure' ? 'active' : ''}`}
            >Brochure</a>
          </li>
          <li style={{ marginTop: '16px' }}>
            <a 
              href="#contact" 
              className="btn btn-primary"
              style={{ width: '100%' }}
            >Get a Quote</a>
          </li>
        </ul>
      </div>

      {/* Main Pages Content Area */}
      <main className="main-content-flow">
        
        {/* ====================================================
            1. HOME VIEW 
            ==================================================== */}
        {currentPage === 'home' && (
          <div className="animate-fade-in">
            {/* Fixed Social Media Side Rail */}
            <div className="social-side-rail">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-side-link"
                aria-label="Facebook"
              >
                <FacebookIcon size={18} />
                <span className="social-side-tooltip">Facebook</span>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-side-link"
                aria-label="YouTube"
              >
                <YoutubeIcon size={18} />
                <span className="social-side-tooltip">YouTube</span>
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); alert("LinkedIn Profile is Coming Soon!"); }}
                className="social-side-link"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={18} />
                <span className="social-side-tooltip">LinkedIn</span>
              </a>
            </div>

            {/* Hero Banner Section */}
            <section className="hero-section">
              <div className="container hero-grid">
                <div>
                  <span className="hero-eyebrow animate-fade-in" style={{ color: 'rgba(255, 255, 255, 0.65)', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '16px' }}>
                    Grafik Machinery International
                  </span>
                  <h1 className="hero-title">Engineering Premium Machinery Since 1989</h1>
                  <p className="hero-subtitle">
                    Technical wizardry in the printing and packaging industry. Engineering premium, durable machinery for global print markets.
                  </p>
                  <div className="hero-buttons">
                    <a href="#contact" className="btn btn-primary">
                      Contact Us <ArrowRight size={18} />
                    </a>
                    <a href="#products" className="btn btn-outline-white">
                      Our Products
                    </a>
                  </div>
                </div>
                <div className="hero-image-wrapper">
                  <img 
                    src="/hero_main.jpg" 
                    alt="Grafik Machinery Premium folder and gluer machine" 
                    className="hero-image hero-zoom-anim"
                  />
                </div>
              </div>
            </section>

            {/* Credibility stat strip (Animated Count-up) */}
            <section className="stat-strip">
              <div className="container stat-grid">
                <StatCounter target="1989" label="Founded" />
                <StatCounter target="35" suffix="+" label="Years B2B Experience" />
                <StatCounter target="25" suffix="%" label="Exported Worldwide" />
                <StatCounter target="MENA & Asia" label="Primary Export Markets" />
              </div>
            </section>

            {/* Intro & About Excerpt */}
            <section className="section container reveal-on-scroll">
              <div className="split-grid">
                <div className="text-content">
                  <h2 style={{ textAlign: 'left' }}>Technical Wizardry in Printing Since 1989</h2>
                  <p>
                    Established by key industry specialists with over three decades of engineering expertise, Grafik Machinery International has earned a highly reputed brand status across India and international B2B print packaging markets.
                  </p>
                  <p>
                    We specialize in delivering high-end, cost-effective solutions for ultraviolet curing, inline press coating, and carton pasting. Our continuous R&D ensures every machine satisfies strict international quality standards.
                  </p>
                  <a href="#about" className="btn btn-text" style={{ paddingLeft: 0, marginTop: '8px' }}>
                    Read our full story <ChevronRight size={18} />
                  </a>
                </div>
                <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-premium)', aspectRatio: '4/3' }}>
                  <img src="/about_exhibition.jpg" alt="Grafik Machinery Trade Show Exhibition" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            {/* Featured Product Teaser Grid */}
            <section className="section section-alt">
              <div className="container">
                <div className="products-teaser-head">
                  <div style={{ textAlign: 'left' }}>
                    <h2>Featured Products</h2>
                    <p style={{ margin: 0 }}>Explore our highly-demanded industrial machinery models.</p>
                  </div>
                  <a href="#products" className="btn btn-secondary">
                    View All Products
                  </a>
                </div>

                <div className="product-grid">
                  {PRODUCTS.slice(0, 3).map(product => {
                    return (
                      <div 
                        key={product.id} 
                        className="product-card"
                        onClick={() => navigateTo(`product/${product.id}`)}
                      >
                        <div className="product-card-image-box">
                          <img src={product.image} alt={product.name} className="product-card-img" />
                        </div>
                        <div className="product-card-body">
                          <h3 className="product-card-title">{product.name}</h3>
                          <p className="product-card-desc">{product.shortDesc}</p>
                          <span className="product-card-link">
                            Product Details <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Installations Teaser Strip */}
            <section className="section container reveal-on-scroll">
              <h2 className="text-center" style={{ marginBottom: '12px' }}>Recent Installations</h2>
              <p className="text-center max-w-md" style={{ marginBottom: '48px' }}>
                We support key offset printing houses globally. Here are some of our recent installations in leading commercial facilities.
              </p>
              
              <div className="install-row">
                {INSTALLATIONS.slice(0, 3).map(inst => (
                  <div key={inst.id} className="install-card">
                    <div className="install-client">{inst.client}</div>
                    <div className="install-location">{inst.location}</div>
                    <div className="install-equip">
                      <MapPin size={18} style={{ color: 'var(--primary-steel)' }} />
                      <span>{inst.press}</span>
                    </div>
                  </div>
                ))}
              </div>
              
            </section>
          </div>
        )}

        {/* ====================================================
            2. ABOUT US VIEW
            ==================================================== */}
        {currentPage === 'about' && (
          <div className="animate-fade-in">
            {/* Header strip */}
            <div className="page-header-strip">
              <div className="container">
                <div className="section-header-left" style={{ marginBottom: 0 }}>
                  <span className="section-eyebrow">About Grafik Machinery</span>
                  <h1 className="page-header-title">About Our Company</h1>
                  <div className="page-breadcrumbs">
                    <span onClick={() => navigateTo('home')}>Home</span>
                    <ChevronRight size={14} />
                    <span className="active">About Us</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Corporate Overview */}
            <section className="section container">
              <div className="split-grid" style={{ marginBottom: '60px' }}>
                <div className="text-content">
                  <div className="section-header-left">
                    <span className="section-eyebrow">Corporate History</span>
                    <h2>Company Profile</h2>
                  </div>
                  <p>
                    Established in 1989 (with official business registration in 1992) by key engineering specialists possessing 35 years of collective field experience, **Grafik Machinery International** has built brilliant expertise and in-depth industry knowledge to serve clients with better-than-the-best printing machinery.
                  </p>
                  <p>
                    Today, we are a highly reputed manufacturer, exporter, supplier, and distributor with a unique collection of world-class post-press machinery. Our solutions resolve critical production challenges in folding, gluing, coating, and UV curing.
                  </p>
                  <p>
                    Supported by a specialized team of experienced engineers, we cater to precise custom requirements beyond customer expectations. Our client base spans India as well as leading export markets in Middle Eastern and South Asian countries. We export approximately 25% of our overall volume, and import distinguished quality components (Cutting Sticks, Ink Cleaning Knives, and UV lamps) directly from the USA to deliver global reliability.
                  </p>
                </div>
                <div>
                  <div className="fact-grid">
                    <div className="fact-card">
                      <div className="fact-card-title">Business Type</div>
                      <div className="fact-card-value">Manufacturer & Exporter</div>
                    </div>
                    <div className="fact-card">
                      <div className="fact-card-title">Established</div>
                      <div className="fact-card-value">1989 / 1992</div>
                    </div>
                    <div className="fact-card">
                      <div className="fact-card-title">Staff Engineers</div>
                      <div className="fact-card-value">3 Specialists</div>
                    </div>
                    <div className="fact-card">
                      <div className="fact-card-title">Primary Markets</div>
                      <div className="fact-card-value">Middle East & South Asia</div>
                    </div>
                  </div>
                  
                  <div style={{ backgroundColor: 'var(--neutral-light)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <h4 style={{ color: 'var(--primary-navy)', marginBottom: '12px' }}>Competitive Advantage</h4>
                    <p style={{ fontSize: '0.95rem', margin: 0 }}>
                      Our stability is anchored on three core pillars: Excellent quality products, highly competitive pricing, and on-time international delivery.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Trade Show Section */}
            <section className="section container reveal-on-scroll" style={{ paddingTop: 0 }}>
              <div className="split-grid" style={{ alignItems: 'center' }}>
                <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-premium)', aspectRatio: '1/1' }}>
                  <img src="/about_exhibition.jpg" alt="Grafik Machinery Trade Show Exhibition" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="text-content">
                  <div className="section-header-left">
                    <span className="section-eyebrow">Global Presence</span>
                    <h2>Industry Exhibition Showcase</h2>
                  </div>
                  <p>
                    Grafik Machinery International actively showcases its cutting-edge post-press solutions at leading national and international printing exhibitions. Our exhibition booths highlight our commitment to world-class manufacturing, displaying real machinery in action and facilitating direct B2B connections with packaging manufacturers worldwide.
                  </p>
                  <p>
                    Our brand stands for engineering excellence, reliable performance, and robust support, establishing trust with print service providers across the globe.
                  </p>
                </div>
              </div>
            </section>

            {/* Product range bullet section */}
            <section className="section section-alt">
              <div className="container">
                <div className="section-header-left">
                  <span className="section-eyebrow">Manufacturing Scope</span>
                  <h2>Complete Product Range</h2>
                </div>
                <p style={{ marginBottom: '40px', maxWidth: '600px', textAlign: 'left' }}>
                  We engineer a diverse catalog of automated machines and specialized attachment units.
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }} className="split-grid">
                  <ul style={{ listStyle: 'none' }}>
                    {ADDITIONAL_PRODUCTS.slice(0, 5).map((prod, idx) => (
                      <li key={idx} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Check size={18} style={{ color: 'var(--primary-steel)', flexShrink: 0 }} />
                        <span style={{ fontWeight: '600' }}>{prod}</span>
                      </li>
                    ))}
                  </ul>
                  <ul style={{ listStyle: 'none' }}>
                    {ADDITIONAL_PRODUCTS.slice(5).map((prod, idx) => (
                      <li key={idx} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Check size={18} style={{ color: 'var(--primary-steel)', flexShrink: 0 }} />
                        <span style={{ fontWeight: '600' }}>{prod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Quality & Infrastructure Section splits */}
            <section className="section container reveal-on-scroll">
              <div className="split-grid" style={{ marginBottom: '60px' }}>
                <div className="text-content">
                  <div className="section-header-left">
                    <span className="section-eyebrow">Quality Standards</span>
                    <h2>Our Quality Assurance</h2>
                  </div>
                  <p>
                    Grafik Machinery International's quest for quality is the key behind its ultimate success in the industry. Maintaining the highest standard of quality means satisfying client requirements in the best possible way — through the best products and services.
                  </p>
                  <p>
                    A dedicated quality control unit at the factory checks the entire production process, from procurement of raw materials (mild steel, electric goods, belts, lamps, etc.) to final delivery of finished products. Every machine is tested against international quality standards and inspected multiple times before delivery.
                  </p>
                </div>
                <div className="text-content">
                  <div className="section-header-left">
                    <span className="section-eyebrow">Advanced Facility</span>
                    <h2>Our Infrastructure</h2>
                  </div>
                  <p>
                    A robust infrastructure is the base of Grafik Machinery International's stability and success over nearly two decades. The company is equipped with every tool required for its trade, including a manufacturing unit loaded with sophisticated machinery for enhanced productivity and international quality standards, using cutting-edge production and quality-testing technology.
                  </p>
                  <p>
                    An in-house R&D facility keeps a team of experts engaged in continuous research for improvement of technology, products, and services. A highly skilled workforce makes the best use of this infrastructure to deliver the most reliable solutions in the field.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ====================================================
            3. PRODUCTS LIST VIEW
            ==================================================== */}
        {currentPage === 'products' && (
          <div className="animate-fade-in">
            {/* Header strip */}
            <div className="page-header-strip">
              <div className="container">
                <div className="section-header-left" style={{ marginBottom: 0 }}>
                  <span className="section-eyebrow">Our Catalog</span>
                  <h1 className="page-header-title">Our Products</h1>
                  <div className="page-breadcrumbs">
                    <span onClick={() => navigateTo('home')}>Home</span>
                    <ChevronRight size={14} />
                    <span className="active">Products Range</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Card Grid */}
            <section className="section container">
              <div className="product-grid">
                {PRODUCTS.map(product => {
                  return (
                    <div 
                      key={product.id} 
                      className="product-card"
                      onClick={() => navigateTo(`product/${product.id}`)}
                    >
                      <div className="product-card-image-box">
                        <img src={product.image} alt={product.name} className="product-card-img" />
                      </div>
                      <div className="product-card-body">
                        <h3 className="product-card-title">{product.name}</h3>
                        <p className="product-card-desc">{product.shortDesc}</p>
                        <span className="product-card-link">
                          Detailed Specs <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Additional custom range list */}
            <section className="section section-alt">
              <div className="container">
                <div className="section-header-left">
                  <span className="section-eyebrow">Custom Engineering</span>
                  <h2>Additional Models & Customized Machinery</h2>
                </div>
                <p style={{ marginBottom: '40px', maxWidth: '600px', textAlign: 'left' }}>
                  In addition to our primary categories, we also manufacture these specific models and support fully customized Turnkey industrial engineering projects.
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', maxWidth: '900px', margin: '0 auto' }}>
                  {ADDITIONAL_PRODUCTS.map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        backgroundColor: 'var(--neutral-white)', 
                        border: '1px solid var(--border-light)',
                        padding: '12px 20px', 
                        borderRadius: '4px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        color: 'var(--primary-navy)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="text-center" style={{ marginTop: '40px' }}>
                  <p style={{ marginBottom: '20px', fontWeight: '500' }}>Have unique manufacturing specs or need a turnkey solution?</p>
                  <a href="#contact" className="btn btn-primary">
                    Request Custom Engineering <MessageSquare size={18} />
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ====================================================
            4. PRODUCT DETAIL VIEW
            ==================================================== */}
        {currentPage === 'product-detail' && (
          <div className="animate-fade-in">
            {(() => {
              const product = PRODUCTS.find(p => p.id === selectedProductId);
              if (!product) return <p className="text-center section">Product not found.</p>;
              
              return (
                <div className="container" style={{ paddingBottom: '80px' }}>
                  {/* Header breadcrumbs */}
                  <div className="page-header-strip" style={{ background: 'transparent', padding: '32px 0 0 0', borderBottom: 'none' }}>
                    <div className="page-breadcrumbs">
                      <span onClick={() => navigateTo('home')}>Home</span>
                      <ChevronRight size={14} />
                      <span onClick={() => navigateTo('products')}>Products</span>
                      <ChevronRight size={14} />
                      <span className="active">{product.name}</span>
                    </div>
                  </div>

                  <div className="product-detail-layout">
                    {/* Media Gallery column */}
                    <div className="product-detail-gallery">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="product-detail-main-img"
                      />
                      
                      {/* Secondary thumb gallery to show working visual assets */}
                      <div className="product-detail-thumbs">
                        <img src="/hero.jpg" alt="UV drying" className="product-detail-thumb active" />
                        <img src="/carton_gluer.jpg" alt="Gluer unit" className="product-detail-thumb" />
                        <div style={{ backgroundColor: 'var(--neutral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-navy)' }}>SPEC SHEET</span>
                        </div>
                      </div>
                    </div>

                    {/* Information column */}
                    <div className="product-detail-info" style={{ textAlign: 'left' }}>
                      <h1 style={{ fontSize: '2.25rem', marginBottom: '16px' }}>{product.name}</h1>
                      <div style={{ height: '4px', width: '60px', backgroundColor: 'var(--primary-navy)', marginBottom: '24px' }} />
                      
                      <p style={{ fontSize: '1.05rem', color: 'var(--neutral-dark)', fontWeight: '500' }}>
                        {product.shortDesc}
                      </p>
                      
                      <p style={{ marginBottom: '24px' }}>
                        {product.longDesc}
                      </p>

                      {/* Specs card (Custom Bordered Specs Table) */}
                      <div className="product-detail-spec-card">
                        <h4 className="product-detail-spec-title" style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Technical Specifications</h4>
                        <div className="specs-table-container">
                          <ul className="product-detail-spec-list">
                            {Object.entries(product.specifications).map(([lbl, val]) => (
                              <li key={lbl}>
                                <span className="product-detail-spec-lbl">
                                  {getSpecIcon(lbl)}
                                  {lbl}
                                </span>
                                <span className="product-detail-spec-val">{val}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                        <button 
                          className="btn btn-primary"
                          onClick={() => triggerQuoteRequest(product.name)}
                          style={{ flex: 1 }}
                        >
                          Request Price Quote
                        </button>
                        <a href="#brochure" className="btn btn-secondary">
                          Brochure PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ====================================================
            5. PHOTO GALLERY VIEW
            ==================================================== */}
        {currentPage === 'gallery' && (
          <div className="animate-fade-in">
            {/* Header strip */}
            <div className="page-header-strip">
              <div className="container">
                <div className="section-header-left" style={{ marginBottom: 0 }}>
                  <span className="section-eyebrow">Visual Tour</span>
                  <h1 className="page-header-title">Product & Factory Gallery</h1>
                  <div className="page-breadcrumbs">
                    <span onClick={() => navigateTo('home')}>Home</span>
                    <ChevronRight size={14} />
                    <span className="active">Gallery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            <section className="section container">
              <div className="gallery-grid">
                <div className="gallery-item">
                  <div className="gallery-img-wrapper">
                    <img src="/hero.jpg" alt="UV Curing Assembly Showcase" className="gallery-img" />
                  </div>
                  <div className="gallery-caption">UV Curing and Coating Assembly Floor</div>
                </div>

                <div className="gallery-item">
                  <div className="gallery-img-wrapper">
                    <img src="/carton_gluer.jpg" alt="Carton Folder Gluer Machine" className="gallery-img" />
                  </div>
                  <div className="gallery-caption">Folder Gluer Automated Feed Conveyor</div>
                </div>

                {/* Polished Coming Soon placeholders */}
                <div className="gallery-item">
                  <div className="gallery-placeholder-tile">
                    <Camera size={32} />
                    <span className="gallery-placeholder-tile-text">Photo Coming Soon</span>
                  </div>
                  <div className="gallery-caption">Factory Quality Control Unit</div>
                </div>

                <div className="gallery-item">
                  <div className="gallery-placeholder-tile">
                    <Camera size={32} />
                    <span className="gallery-placeholder-tile-text">Photo Coming Soon</span>
                  </div>
                  <div className="gallery-caption">Export Packaging & Dispatch Area</div>
                </div>

                <div className="gallery-item">
                  <div className="gallery-placeholder-tile">
                    <Camera size={32} />
                    <span className="gallery-placeholder-tile-text">Photo Coming Soon</span>
                  </div>
                  <div className="gallery-caption">In-house Research & Development Lab</div>
                </div>

                <div className="gallery-item">
                  <div className="gallery-placeholder-tile">
                    <Camera size={32} />
                    <span className="gallery-placeholder-tile-text">Photo Coming Soon</span>
                  </div>
                  <div className="gallery-caption">Engineering Assembly Line</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ====================================================
            6. BROCHURE DOWNLOAD VIEW
            ==================================================== */}
        {currentPage === 'brochure' && (
          <div className="animate-fade-in">
            {/* Header strip */}
            <div className="page-header-strip">
              <div className="container">
                <div className="section-header-left" style={{ marginBottom: 0 }}>
                  <span className="section-eyebrow">PDF Documentation</span>
                  <h1 className="page-header-title">Technical Brochure</h1>
                  <div className="page-breadcrumbs">
                    <span onClick={() => navigateTo('home')}>Home</span>
                    <ChevronRight size={14} />
                    <span className="active">Download Brochure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Brochure Card */}
            <section className="section container">
              <div className="brochure-card animate-fade-in">
                <div style={{ marginBottom: '24px' }}>
                  <img src="/logo.png" alt="Grafik Machinery Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
                </div>
                
                <h2>Download Company Brochure</h2>
                <p className="max-w-md" style={{ marginTop: '12px' }}>
                  Get the complete technical catalog of Grafik Machinery International. Access specifications for all standard models, including sizes, electrical setups, and custom inline retrofits.
                </p>

                <div className="brochure-meta">
                  <div className="brochure-meta-item">
                    <strong>File Format</strong>
                    <span>PDF Document</span>
                  </div>
                  <div className="brochure-meta-item">
                    <strong>File Size</strong>
                    <span>1.2 MB</span>
                  </div>
                  <div className="brochure-meta-item">
                    <strong>Last Updated</strong>
                    <span>2026 Edition</span>
                  </div>
                </div>

                <a 
                  href="/brochure.pdf" 
                  download="Grafik_Machinery_International_Brochure.pdf"
                  className="btn btn-primary"
                  style={{ minWidth: '220px' }}
                >
                  Download Brochure PDF <Download size={18} />
                </a>
              </div>
            </section>
          </div>
        )}

        {/* ====================================================
            7. CONTACT US VIEW
            ==================================================== */}
        {currentPage === 'contact' && (
          <div className="animate-fade-in">
            {/* Header strip */}
            <div className="page-header-strip">
              <div className="container">
                <div className="section-header-left" style={{ marginBottom: 0 }}>
                  <span className="section-eyebrow">Inquiries & Quotes</span>
                  <h1 className="page-header-title">Contact Us</h1>
                  <div className="page-breadcrumbs">
                    <span onClick={() => navigateTo('home')}>Home</span>
                    <ChevronRight size={14} />
                    <span className="active">Contact</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact page layout */}
            <section className="section container">
              <div className="contact-layout">
                
                {/* Contact Form Card */}
                <div className="contact-form-card">
                  {!formSubmitted ? (
                    <form onSubmit={handleFormSubmit}>
                      <h3 className="contact-form-title" style={{ textAlign: 'left' }}>Get a Free Quote / Inquiry</h3>
                      
                      <div className="form-group">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        {formErrors.name && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{formErrors.name}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="company">Company Name</label>
                        <input 
                          type="text" 
                          id="company" 
                          name="company"
                          className="form-control"
                          value={formData.company}
                          onChange={handleInputChange}
                        />
                        {formErrors.company && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{formErrors.company}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="phone">Phone / Mobile</label>
                        <input 
                          type="text" 
                          id="phone" 
                          name="phone"
                          className="form-control"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        {formErrors.phone && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{formErrors.phone}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {formErrors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{formErrors.email}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="message">Message / Requirements</label>
                        <textarea 
                          id="message" 
                          name="message"
                          className="form-control"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Please describe your print packaging line details or specific models you are interested in..."
                        />
                        {formErrors.message && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{formErrors.message}</span>}
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Submit Inquiry
                      </button>
                    </form>
                  ) : (
                    <div className="form-success-card animate-fade-in">
                      <div className="form-success-icon-box">
                        <Check className="form-success-icon" size={32} />
                      </div>
                      <h2 className="form-success-title">Inquiry Submitted!</h2>
                      <p className="form-success-text">
                        Thank you for reaching out to Grafik Machinery International. Our technical division is processing your request.
                      </p>
                      
                      <div className="success-timeline">
                        <div className="timeline-step completed">
                          <div className="timeline-bullet">
                            <Check size={12} />
                          </div>
                          <div className="timeline-step-title">Inquiry Received</div>
                          <p className="timeline-step-desc">Your engineering specs have been successfully logged in our systems.</p>
                        </div>
                        <div className="timeline-step active">
                          <div className="timeline-bullet">
                            <Clock size={12} />
                          </div>
                          <div className="timeline-step-title">Technical Review</div>
                          <p className="timeline-step-desc">Our lead developers are checking your configurations (within 24 business hours).</p>
                        </div>
                        <div className="timeline-step">
                          <div className="timeline-bullet">
                            <Phone size={12} />
                          </div>
                          <div className="timeline-step-title">Proposal & Quote Delivery</div>
                          <p className="timeline-step-desc">An executive will contact you with a direct phone callback or email document proposal.</p>
                        </div>
                      </div>

                      <button 
                        className="btn btn-secondary" 
                        onClick={resetContactForm}
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  )}
                </div>

                {/* Company Address Details */}
                <div className="contact-info-column">
                  <div className="info-card">
                    <h3 className="info-card-title">Corporate Headquarters</h3>
                    
                    <ul className="info-list">
                      <li className="info-item">
                        <Users className="info-item-icon" size={20} />
                        <div className="info-item-text">
                          <strong>Director</strong>
                          Mr. Kanishk Jain
                        </div>
                      </li>
                      <li className="info-item">
                        <Phone className="info-item-icon" size={20} />
                        <div className="info-item-text">
                          <strong>Mobile / Call</strong>
                          <a href="tel:9811779251">+91 9811779251</a>, <a href="tel:9811088668">+91 9811088668</a>
                          <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--neutral-body)', marginTop: '4px' }}>Landline: 011-41802031</span>
                        </div>
                      </li>
                      <li className="info-item">
                        <Mail className="info-item-icon" size={20} />
                        <div className="info-item-text">
                          <strong>Email Enquiries</strong>
                          <a href="mailto:grafikmachinery@gmail.com">grafikmachinery@gmail.com</a>
                        </div>
                      </li>
                      <li className="info-item">
                        <MapPin className="info-item-icon" size={20} />
                        <div className="info-item-text">
                          <strong>Factory Address</strong>
                          F-289, Flatted Factory Complex,<br />
                          Okhla Industrial Area, Phase-III,<br />
                          New Delhi, 110020, Delhi, India
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Google Map Box */}
                  <div className="map-placeholder-box">
                    <iframe 
                      title="Grafik Machinery International location at Okhla Flatted Factory Complex"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.467888796853!2d77.27218671507963!3d28.5256334824602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce151cbe8d12d%3A0xe5cd12cf8f8df4f4!2sFlatted%20Factory%20Complex%2C%20Okhla%20Phase%20III%2C%20Okhla%20Industrial%20Area%2C%20New%20Delhi%2C%20Delhi%20110020!5e0!3m2!1sen!2sin!4v1628172900000!5m2!1sen!2sin"
                      allowFullScreen="" 
                      loading="lazy"
                    />
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}

      </main>

      {/* Footer Area */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-about">
            <div className="footer-logo" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="Grafik Machinery Logo" style={{ height: '48px', width: 'auto', filter: 'brightness(0) invert(1)', objectFit: 'contain' }} />
              <span className="footer-logo-text" style={{ marginLeft: '12px' }}>GRAFIK MACHINERY INTERNATIONAL</span>
            </div>
            <p className="footer-about-text">
              Engineering high-performance industrial UV curing setups, offset coating additions, and carton paste solutions since 1989.
            </p>
          </div>

          <div className="footer-links">
            <h4 className="footer-links-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#products">Products Range</a></li>
              <li><a href="#gallery">Photo Gallery</a></li>
              <li><a href="#brochure">Download Brochure</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-contact-title">Contact Info</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={16} />
                <span>F-289, Flatted Factory Complex, Okhla-III, New Delhi, India</span>
              </li>
              <li>
                <Phone size={16} />
                <span>+91 9811779251, +91 9811088668</span>
              </li>
              <li>
                <Mail size={16} />
                <a href="mailto:grafikmachinery@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>grafikmachinery@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} Grafik Machinery International. All Rights Reserved.
          </div>
          
          <div className="footer-socials">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-link"
              aria-label="Facebook"
            >
              <FacebookIcon size={20} />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-link"
              aria-label="YouTube"
            >
              <YoutubeIcon size={20} />
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert("LinkedIn Profile is Coming Soon!"); }}
              className="footer-social-link"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
