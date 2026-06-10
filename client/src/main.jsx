import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Factory,
  ImagePlus,
  Leaf,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Recycle,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import './styles.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const mapQuery = encodeURIComponent('Sharada Industrial Area Phase 3, Opposite Aminci Radio, Kano Nigeria');
const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
const whatsappUrl = 'https://wa.me/2348060990928';
const tokenKey = 'plastigold_admin_token';

const defaultContent = {
  hero: {
    title: 'PlastiGold Recycling Ltd',
    tagline: 'Turning Plastic Waste into a Better Future',
  },
  slides: [
    { id: 'slide-red-pellets-01', title: 'Red recycled plastic pellets', image: '/assets/slide-red-pellets-01.jpeg' },
    { id: 'slide-brown-pellets-01', title: 'Brown recycled plastic pellets', image: '/assets/slide-brown-pellets-01.jpeg' },
    { id: 'slide-dark-pellets-01', title: 'Dark recycled plastic pellets', image: '/assets/slide-dark-pellets-01.jpeg' },
    { id: 'slide-white-pellets-01', title: 'White recycled plastic pellets', image: '/assets/slide-white-pellets-01.jpeg' },
    { id: 'slide-dark-pellets-02', title: 'Sorted dark pellets', image: '/assets/slide-dark-pellets-02.jpeg' },
    { id: 'slide-brown-pellets-02', title: 'Sorted brown pellets', image: '/assets/slide-brown-pellets-02.jpeg' },
    { id: 'slide-red-pellets-02', title: 'Sorted red pellets', image: '/assets/slide-red-pellets-02.jpeg' },
  ],
  gallery: [
    {
      id: 'gallery-1',
      title: 'Recycling plant',
      caption: 'PlastiGold recycling operations and materials.',
      image: '/assets/recycling-plant.svg',
    },
    {
      id: 'gallery-2',
      title: 'Product pellets',
      caption: 'Processed recycled plastic materials for industry.',
      image: '/assets/pellets-green.svg',
    },
    {
      id: 'gallery-3',
      title: 'Collection yard',
      caption: 'Sorted plastic waste prepared for recycling.',
      image: '/assets/gallery-yard.svg',
    },
  ],
};

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

const customerNavItems = navItems.filter((item) => {
  const label = item.label?.trim().toLowerCase();
  const href = item.href?.trim().toLowerCase();
  return label !== 'admin' && href !== '/admin' && href !== '/pg-internal-console';
});

const products = [
  {
    name: 'HDPE Regrind',
    description: 'Cleaned and processed high-density plastic flakes for manufacturing durable plastic goods.',
    image: '/assets/product-brown-pellets.jpeg',
  },
  {
    name: 'PP Pellets',
    description: 'Consistent recycled polypropylene pellets prepared for injection and extrusion applications.',
    image: '/assets/product-white-pellets.jpeg',
  },
  {
    name: 'Mixed Plastic Materials',
    description: 'Sorted recyclable materials ready for industrial partners and circular production pipelines.',
    image: '/assets/product-dark-pellets.jpeg',
  },
];

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed.');
  }

  return data;
}

function useContent() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadContent = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/api/content');
      setContent({
        hero: data.hero || defaultContent.hero,
        slides: data.slides?.length ? data.slides : defaultContent.slides,
        gallery: data.gallery?.length ? data.gallery : defaultContent.gallery,
      });
    } catch (err) {
      setError(err.message);
      setContent(defaultContent);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  return { content, loading, error, loadContent, setContent };
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <a className="brand" href="#home" aria-label="PlastiGold Recycling Ltd home">
        <img src="/assets/plastigold-logo-transparent.png" alt="PlastiGold Recycling Ltd logo" />
      </a>
      <button className="icon-button menu-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
        {customerNavItems.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function HomePage() {
  const { content, loading, error } = useContent();
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = content.slides.length ? content.slides : defaultContent.slides;
  const galleryImages = content.gallery.length ? content.gallery : defaultContent.gallery;

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeSlide >= slides.length) setActiveSlide(0);
  }, [activeSlide, slides.length]);

  const goToSlide = (direction) => {
    setActiveSlide((index) => (index + direction + slides.length) % slides.length);
  };

  return (
    <>
      <Navbar />
      <main>
        <section id="home" className="hero section">
          <div className="hero-card reveal">
            <div className="hero-slider" aria-label="PlastiGold recycling image slideshow">
              {slides.map((slide, index) => (
                <img
                  className={index === activeSlide ? 'hero-slide active' : 'hero-slide'}
                  src={slide.image}
                  alt={slide.title}
                  key={slide.id || slide.title}
                />
              ))}
            </div>
            <div className="hero-content">
              <h1>{content.hero.title}</h1>
              <p className="hero-copy">{content.hero.tagline}</p>
              <div className="hero-actions">
                <a className="button primary" href="#products">
                  View Products <ArrowRight size={18} />
                </a>
                <a className="button secondary" href="#contact">
                  Contact Us <Phone size={18} />
                </a>
              </div>
              {error && <p className="subtle">Using saved website placeholders until the backend is available.</p>}
            </div>
            <div className="hero-controls" aria-label="Hero slideshow controls">
              <button className="icon-button" onClick={() => goToSlide(-1)} aria-label="Previous slide">
                <ChevronLeft size={20} />
              </button>
              <div className="hero-dots">
                {slides.map((slide, index) => (
                  <button
                    className={index === activeSlide ? 'dot active' : 'dot'}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show ${slide.title}`}
                    key={slide.id || slide.title}
                  />
                ))}
              </div>
              <button className="icon-button" onClick={() => goToSlide(1)} aria-label="Next slide">
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="impact-card">
              <Recycle size={28} />
              <strong>Waste to value</strong>
              <span>Reliable recycled plastic materials for industry.</span>
            </div>
          </div>
        </section>

        <section id="about" className="section two-column">
          <div className="section-copy reveal">
            <p className="eyebrow">About Us</p>
            <h2>Local recycling with industrial purpose.</h2>
            <p>
              PlastiGold Recycling Ltd collects, sorts, processes, and supplies recycled plastic materials from Kano.
              We help businesses reduce waste, recover value, and support a cleaner circular economy.
            </p>
          </div>
          <div className="stats-grid reveal">
            <div><Factory /><strong>Industrial Area</strong><span>Based in Sharada, Kano.</span></div>
            <div><Leaf /><strong>Cleaner Future</strong><span>Focused on practical sustainability.</span></div>
            <div><ShieldCheck /><strong>Quality Sorting</strong><span>Prepared for manufacturing use.</span></div>
          </div>
        </section>

        <section id="products" className="section muted">
          <div className="section-heading reveal">
            <p className="eyebrow">Products</p>
            <h2>Recycled plastic materials for production.</h2>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card reveal" key={product.name}>
                <img src={product.image} alt={product.name} />
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="sustainability" className="section why">
          <div className="section-heading reveal">
            <p className="eyebrow">Sustainability</p>
            <h2>Why choose PlastiGold?</h2>
          </div>
          <div className="why-grid">
            {[
              ['Responsible collection', 'We support cleaner communities by moving plastic waste back into productive use.'],
              ['Manufacturing-ready supply', 'Materials are prepared with consistency, sorting discipline, and practical quality control.'],
              ['Local economic value', 'Our work strengthens Kano recycling chain and creates value from discarded plastics.'],
            ].map(([title, text]) => (
              <div className="why-item reveal" key={title}>
                <CheckCircle2 />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="gallery" className="section muted">
          <div className="section-heading reveal">
            <p className="eyebrow">Gallery</p>
            <h2>Company and product images.</h2>
            {loading && <p className="subtle">Loading latest images...</p>}
          </div>
          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <figure className="gallery-item reveal" key={image.id || image.image}>
                <img src={image.image} alt={image.title} />
                {(image.title || image.caption) && (
                  <figcaption>
                    <strong>{image.title}</strong>
                    {image.caption && <span>{image.caption}</span>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="contact-panel reveal">
            <p className="eyebrow">Contact Us</p>
            <h2>Let's talk recycling.</h2>
            <ContactLine icon={<Phone />} text="+234 806 099 0928, +234 906 495 05266" />
            <ContactLine icon={<Mail />} text="yegroupholdings@gmail.com" />
            <ContactLine icon={<MapPin />} text="Sharada Industrial Area Phase 3, Opposite Aminci Radio, Kano, Nigeria" />
            <div className="contact-actions">
              <a className="button primary" href={googleMapsUrl} target="_blank" rel="noreferrer">
                Open Map <MapPin size={18} />
              </a>
              <a className="button secondary" href="mailto:yegroupholdings@gmail.com">
                Email Us <Mail size={18} />
              </a>
            </div>
          </div>
          <iframe
            className="map reveal"
            title="PlastiGold Recycling Ltd location map"
            loading="lazy"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          />
        </section>
      </main>
      <Footer />
      <a className="whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <MessageCircle size={26} />
      </a>
    </>
  );
}

function ContactLine({ icon, text }) {
  return (
    <div className="contact-line">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <img src="/assets/plastigold-logo-transparent.png" alt="PlastiGold Recycling Ltd" />
      <p>www.plastigoldrecycling.com</p>
    </footer>
  );
}

function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey) || '');

  const handleLogin = (newToken) => {
    localStorage.setItem(tokenKey, newToken);
    setToken(newToken);
  };

  const handleLogout = async () => {
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
        headers: authHeaders(token),
      });
    } catch {
      // Local logout still clears access if the server session has already expired.
    }
    localStorage.removeItem(tokenKey);
    setToken('');
  };

  return token ? <AdminDashboard token={token} onLogout={handleLogout} /> : <AdminLogin onLogin={handleLogin} />;
}

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('admin@plastigoldrecycling.com');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submitLogin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      onLogin(data.token);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="admin-page">
      <section className="login-card">
        <img src="/assets/plastigold-logo-transparent.png" alt="PlastiGold Recycling Ltd" />
        <h1>Admin Login</h1>
        <p>Sign in to update the homepage slides and gallery content.</p>
        <form onSubmit={submitLogin}>
          <label>
            Email address
            <input value={email} type="email" onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input value={password} type="password" onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <button className="button primary" type="submit" disabled={busy}>
            Login
          </button>
        </form>
        {message && <p className="admin-message error">{message}</p>}
        <a className="button secondary" href="/">
          Back to Website
        </a>
      </section>
    </main>
  );
}

function AdminDashboard({ token, onLogout }) {
  const { content, loading, error, loadContent, setContent } = useContent();
  const [heroDraft, setHeroDraft] = useState(defaultContent.hero);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setHeroDraft(content.hero);
  }, [content.hero]);

  const guarded = async (task, successMessage) => {
    setBusy(true);
    setMessage('');
    try {
      await task();
      setMessage(successMessage);
      await loadContent();
    } catch (err) {
      setMessage(err.message);
      if (err.message.includes('login')) {
        localStorage.removeItem(tokenKey);
      }
    } finally {
      setBusy(false);
    }
  };

  const saveHero = () => guarded(
    () => apiRequest('/api/content/hero', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify(heroDraft),
    }),
    'Homepage text saved.',
  );

  const moveSlide = async (index, direction) => {
    const next = [...content.slides];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setContent((current) => ({ ...current, slides: next }));
    await guarded(
      () => apiRequest('/api/slides/order', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
        body: JSON.stringify({ ids: next.map((slide) => slide.id) }),
      }),
      'Slide order saved.',
    );
  };

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-header">
          <a className="brand" href="/">
            <img src="/assets/plastigold-logo-transparent.png" alt="PlastiGold Recycling Ltd" />
          </a>
          <div className="admin-header-actions">
            <a className="button secondary" href="/">
              View Website
            </a>
            <button className="button primary" onClick={onLogout}>
              Logout <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="admin-title">
          <h1>Website Admin</h1>
          <p>Control homepage text, hero slide images, slide order, and gallery captions.</p>
          {loading && <p className="admin-message">Loading admin content...</p>}
          {error && <p className="admin-message error">{error}</p>}
          {message && <p className={message.includes('failed') || message.includes('required') ? 'admin-message error' : 'admin-message'}>{message}</p>}
        </div>

        <section className="admin-section">
          <div>
            <h2>Homepage Text</h2>
            <p>Change the main company title and tagline displayed on the first card.</p>
          </div>
          <div className="admin-form-grid">
            <label>
              Main title
              <input value={heroDraft.title} onChange={(event) => setHeroDraft({ ...heroDraft, title: event.target.value })} />
            </label>
            <label>
              Tagline
              <input value={heroDraft.tagline} onChange={(event) => setHeroDraft({ ...heroDraft, tagline: event.target.value })} />
            </label>
            <button className="button primary" onClick={saveHero} disabled={busy}>
              Save Text <Save size={18} />
            </button>
          </div>
        </section>

        <section className="admin-section">
          <div>
            <h2>Hero Slides</h2>
            <p>Upload, delete, rename, and rearrange the images used in the top homepage slider.</p>
          </div>
          <UploadPanel
            title="Add Slide"
            buttonText="Upload Slide"
            onUpload={(formData) => guarded(
              () => apiRequest('/api/slides', {
                method: 'POST',
                headers: authHeaders(token),
                body: formData,
              }),
              'Slide uploaded.',
            )}
          />
          <div className="admin-list">
            {content.slides.map((slide, index) => (
              <SlideAdminItem
                key={slide.id}
                slide={slide}
                index={index}
                total={content.slides.length}
                busy={busy}
                onMove={moveSlide}
                onRename={(title) => guarded(
                  () => apiRequest(`/api/slides/${slide.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
                    body: JSON.stringify({ title }),
                  }),
                  'Slide title saved.',
                )}
                onDelete={() => guarded(
                  () => apiRequest(`/api/slides/${slide.id}`, {
                    method: 'DELETE',
                    headers: authHeaders(token),
                  }),
                  'Slide deleted.',
                )}
              />
            ))}
          </div>
        </section>

        <section className="admin-section">
          <div>
            <h2>Gallery Images</h2>
            <p>Add images for the gallery and write the text that appears below each image.</p>
          </div>
          <UploadPanel
            title="Add Gallery Image"
            buttonText="Upload Gallery Image"
            includeCaption
            onUpload={(formData) => guarded(
              () => apiRequest('/api/gallery', {
                method: 'POST',
                headers: authHeaders(token),
                body: formData,
              }),
              'Gallery image uploaded.',
            )}
          />
          <div className="admin-gallery">
            {content.gallery.map((item) => (
              <GalleryAdminItem
                key={item.id}
                item={item}
                busy={busy}
                onSave={(draft) => guarded(
                  () => apiRequest(`/api/gallery/${item.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
                    body: JSON.stringify(draft),
                  }),
                  'Gallery text saved.',
                )}
                onDelete={() => guarded(
                  () => apiRequest(`/api/gallery/${item.id}`, {
                    method: 'DELETE',
                    headers: authHeaders(token),
                  }),
                  'Gallery image deleted.',
                )}
              />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function UploadPanel({ title, buttonText, includeCaption = false, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [titleText, setTitleText] = useState('');
  const [caption, setCaption] = useState('');
  const previewUrl = useMemo(() => (selectedFile ? URL.createObjectURL(selectedFile) : ''), [selectedFile]);

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const submitUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', titleText || selectedFile.name);
    if (includeCaption) formData.append('caption', caption);
    await onUpload(formData);
    setSelectedFile(null);
    setTitleText('');
    setCaption('');
  };

  return (
    <form className="upload-panel compact" onSubmit={submitUpload}>
      <ImagePlus size={28} />
      <h3>{title}</h3>
      <label>
        Title
        <input value={titleText} onChange={(event) => setTitleText(event.target.value)} placeholder="Image title" />
      </label>
      {includeCaption && (
        <label>
          Caption
          <textarea value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Text to show below the image" />
        </label>
      )}
      <label className="file-input">
        <Upload size={20} />
        <span>{selectedFile ? selectedFile.name : 'Choose an image'}</span>
        <input type="file" accept="image/*" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} />
      </label>
      {previewUrl && <img className="preview" src={previewUrl} alt="Selected preview" />}
      <button className="button primary" type="submit" disabled={!selectedFile}>
        {buttonText}
      </button>
    </form>
  );
}

function SlideAdminItem({ slide, index, total, busy, onMove, onRename, onDelete }) {
  const [title, setTitle] = useState(slide.title);

  useEffect(() => {
    setTitle(slide.title);
  }, [slide.title]);

  return (
    <article className="admin-row">
      <img src={slide.image} alt={slide.title} />
      <div className="admin-row-body">
        <label>
          Slide title
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <div className="admin-row-actions">
          <button className="icon-button" disabled={busy || index === 0} onClick={() => onMove(index, -1)} aria-label="Move slide up">
            <ArrowUp size={18} />
          </button>
          <button className="icon-button" disabled={busy || index === total - 1} onClick={() => onMove(index, 1)} aria-label="Move slide down">
            <ArrowDown size={18} />
          </button>
          <button className="button secondary" disabled={busy} onClick={() => onRename(title)}>
            Save
          </button>
          <button className="icon-button danger" disabled={busy || total <= 1} onClick={onDelete} aria-label="Delete slide">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

function GalleryAdminItem({ item, busy, onSave, onDelete }) {
  const [draft, setDraft] = useState({ title: item.title, caption: item.caption || '' });

  useEffect(() => {
    setDraft({ title: item.title, caption: item.caption || '' });
  }, [item.title, item.caption]);

  return (
    <article className="admin-image">
      <img src={item.image} alt={item.title} />
      <div className="gallery-edit">
        <label>
          Title
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        </label>
        <label>
          Caption
          <textarea value={draft.caption} onChange={(event) => setDraft({ ...draft, caption: event.target.value })} />
        </label>
        <div className="admin-row-actions">
          <button className="button secondary" disabled={busy} onClick={() => onSave(draft)}>
            Save Text
          </button>
          <button className="icon-button danger" disabled={busy} onClick={onDelete} aria-label="Delete gallery image">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

function App() {
  const path = window.location.pathname;
  return path.startsWith('/pg-internal-console') ? <AdminPage /> : <HomePage />;
}

createRoot(document.getElementById('root')).render(<App />);
