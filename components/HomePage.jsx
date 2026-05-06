'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Factory,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Recycle,
  ShieldCheck,
  X,
} from 'lucide-react';
import useContent from './useContent';
import { defaultContent, googleMapsUrl, mapQuery, navItems, products, whatsappUrl } from './siteData';

const buttonClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 font-black transition hover:-translate-y-0.5';
const primaryButton = `${buttonClass} bg-brand-green text-white shadow-[0_16px_34px_rgba(10,91,53,0.22)]`;
const secondaryButton = `${buttonClass} border border-brand-green/15 bg-white text-brand-green`;

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-brand-green/15 bg-[#f8fff5]/90 px-[clamp(18px,5vw,72px)] py-3 backdrop-blur-xl">
      <a href="#home" aria-label="PlastiGold Recycling Ltd home">
        <img className="h-12 w-auto md:h-14" src="/assets/plastigold-logo.svg" alt="PlastiGold Recycling Ltd logo" />
      </a>
      <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-green/15 bg-white text-brand-green md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={`${open ? 'grid' : 'hidden'} absolute left-4 right-4 top-20 gap-1 rounded-lg border border-brand-green/15 bg-white p-3 shadow-xl md:static md:flex md:items-center md:bg-transparent md:p-0 md:shadow-none md:border-0`} aria-label="Primary navigation">
        {navItems.map((item) => (
          <a className="rounded-lg px-4 py-3 font-bold text-[#254c38] transition hover:bg-brand-gold/25 hover:text-brand-green md:rounded-full md:py-2" key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <a className="rounded-lg bg-brand-gold/25 px-4 py-3 font-bold text-brand-green md:rounded-full md:py-2" href="/admin">
          Admin
        </a>
      </nav>
    </header>
  );
}

export default function HomePage() {
  const { content, loading, error } = useContent();
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = content.slides.length ? content.slides : defaultContent.slides;
  const galleryImages = content.gallery.length ? content.gallery : defaultContent.gallery;

  useEffect(() => {
    if ('serviceWorker' in navigator) {
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
        <section id="home" className="min-h-[calc(100vh-73px)] bg-[linear-gradient(135deg,#f8fff5_0%,#eef9e9_52%,#ffffff_100%)] px-[clamp(18px,5vw,72px)] py-10 md:py-14">
          <div className="relative min-h-[660px] overflow-hidden rounded-lg border border-brand-green/15 shadow-[0_28px_90px_rgba(10,91,53,0.16)] md:min-h-[min(720px,calc(100vh-150px))]">
            <div className="absolute inset-0">
              {slides.map((slide, index) => (
                <img className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${index === activeSlide ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`} src={slide.image} alt={slide.title} key={slide.id || slide.title} />
              ))}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,255,245,0.98)_0%,rgba(248,255,245,0.9)_46%,rgba(248,255,245,0.12)_100%)] md:bg-[linear-gradient(90deg,rgba(248,255,245,0.98)_0%,rgba(248,255,245,0.9)_35%,rgba(248,255,245,0.44)_58%,rgba(248,255,245,0.08)_100%)]" />
            <div className="absolute left-5 right-5 top-7 z-10 max-w-[720px] md:left-[clamp(24px,5vw,72px)] md:top-[clamp(28px,7vw,112px)]">
              <h1 className="text-[clamp(2.6rem,7vw,6.1rem)] font-black leading-none text-brand-green">{content.hero.title}</h1>
              <p className="mt-5 text-xl font-black text-[#2e6c45] md:text-2xl">{content.hero.tagline}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-8">
                <a className={primaryButton} href="#products">View Products <ArrowRight size={18} /></a>
                <a className={secondaryButton} href="#contact">Contact Us <Phone size={18} /></a>
              </div>
              {error && <p className="mt-4 text-sm font-semibold text-brand-muted">Using saved website placeholders until content loads.</p>}
            </div>
            <div className="absolute bottom-28 left-5 right-5 z-10 flex items-center justify-center gap-3 md:bottom-7 md:left-[clamp(24px,5vw,72px)] md:right-auto">
              <button className="grid h-11 w-11 place-items-center rounded-full border border-brand-green/15 bg-white text-brand-green" onClick={() => goToSlide(-1)} aria-label="Previous slide"><ChevronLeft size={20} /></button>
              <div className="flex items-center gap-2 rounded-full border border-brand-green/15 bg-white/80 px-3 py-2">
                {slides.map((slide, index) => (
                  <button className={`h-2.5 rounded-full transition-all ${index === activeSlide ? 'w-7 bg-brand-gold' : 'w-2.5 bg-brand-green/30'}`} onClick={() => setActiveSlide(index)} aria-label={`Show ${slide.title}`} key={slide.id || slide.title} />
                ))}
              </div>
              <button className="grid h-11 w-11 place-items-center rounded-full border border-brand-green/15 bg-white text-brand-green" onClick={() => goToSlide(1)} aria-label="Next slide"><ChevronRight size={20} /></button>
            </div>
            <div className="absolute bottom-5 left-5 right-5 z-10 grid gap-1 rounded-lg border border-brand-green/15 bg-white p-4 shadow-xl md:left-auto md:max-w-[285px]">
              <Recycle className="text-brand-gold" size={28} />
              <strong className="text-brand-green">Waste to value</strong>
              <span className="text-brand-muted">Reliable recycled plastic materials for industry.</span>
            </div>
          </div>
        </section>

        <section id="about" className="grid gap-10 px-[clamp(18px,5vw,72px)] py-16 md:py-22 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#a78000]">About Us</p>
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-black leading-tight text-brand-green">Local recycling with industrial purpose.</h2>
            <p className="mt-5 text-lg leading-8 text-brand-muted">PlastiGold Recycling Ltd collects, sorts, processes, and supplies recycled plastic materials from Kano. We help businesses reduce waste, recover value, and support a cleaner circular economy.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[[Factory, 'Industrial Area', 'Based in Sharada, Kano.'], [Leaf, 'Cleaner Future', 'Focused on practical sustainability.'], [ShieldCheck, 'Quality Sorting', 'Prepared for manufacturing use.']].map(([Icon, title, text]) => (
              <div className="min-h-44 rounded-lg border border-brand-green/15 bg-white p-6 shadow-lg" key={title}>
                <Icon className="text-brand-green-2" />
                <strong className="mt-4 block text-brand-green">{title}</strong>
                <span className="mt-2 block text-brand-muted">{text}</span>
              </div>
            ))}
          </div>
        </section>

        <SectionGrid id="products" eyebrow="Products" title="Recycled plastic materials for production." items={products} loading={false} />

        <section id="sustainability" className="px-[clamp(18px,5vw,72px)] py-16 md:py-22">
          <SectionHeading eyebrow="Sustainability" title="Why choose PlastiGold?" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ['Responsible collection', 'We support cleaner communities by moving plastic waste back into productive use.'],
              ['Manufacturing-ready supply', 'Materials are prepared with consistency, sorting discipline, and practical quality control.'],
              ['Local economic value', 'Our work strengthens Kano recycling chain and creates value from discarded plastics.'],
            ].map(([title, text]) => (
              <div className="rounded-lg border border-brand-green/15 bg-white p-6 shadow-lg" key={title}>
                <CheckCircle2 className="text-brand-green-2" />
                <h3 className="mt-4 font-black text-brand-green">{title}</h3>
                <p className="mt-2 leading-7 text-brand-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <SectionGrid id="gallery" eyebrow="Gallery" title="Company and product images." items={galleryImages} loading={loading} gallery />

        <section id="contact" className="grid gap-10 px-[clamp(18px,5vw,72px)] py-16 md:py-22 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="rounded-lg border border-brand-green/15 bg-white p-6 shadow-lg md:p-8">
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#a78000]">Contact Us</p>
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-black leading-tight text-brand-green">Let's talk recycling.</h2>
            <ContactLine icon={<Phone />} text="+234 806 099 0928, +234 906 495 05266" />
            <ContactLine icon={<Mail />} text="yegroupholdings@gmail.com" />
            <ContactLine icon={<MapPin />} text="Sharada Industrial Area Phase 3, Opposite Aminci Radio, Kano, Nigeria" />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a className={primaryButton} href={googleMapsUrl} target="_blank" rel="noreferrer">Open Map <MapPin size={18} /></a>
              <a className={secondaryButton} href="mailto:yegroupholdings@gmail.com">Email Us <Mail size={18} /></a>
            </div>
          </div>
          <iframe className="h-[340px] w-full rounded-lg border-0 shadow-xl md:h-[440px]" title="PlastiGold Recycling Ltd location map" loading="lazy" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} />
        </section>
      </main>
      <footer className="flex flex-col gap-4 bg-[#082f20] px-[clamp(18px,5vw,72px)] py-7 text-[#dcebe2] sm:flex-row sm:items-center sm:justify-between">
        <img className="h-14 w-fit rounded-lg bg-white" src="/assets/plastigold-logo.svg" alt="PlastiGold Recycling Ltd" />
        <p>www.plastigoldrecycling.com</p>
      </footer>
      <a className="fixed bottom-6 right-6 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <MessageCircle size={26} />
      </a>
    </>
  );
}

function SectionHeading({ eyebrow, title, loading }) {
  return (
    <div className="mx-auto mb-8 max-w-3xl text-center">
      <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#a78000]">{eyebrow}</p>
      <h2 className="text-[clamp(2rem,4vw,4rem)] font-black leading-tight text-brand-green">{title}</h2>
      {loading && <p className="mt-2 text-brand-muted">Loading latest images...</p>}
    </div>
  );
}

function SectionGrid({ id, eyebrow, title, items, gallery = false, loading }) {
  return (
    <section id={id} className="bg-brand-soft px-[clamp(18px,5vw,72px)] py-16 md:py-22">
      <SectionHeading eyebrow={eyebrow} title={title} loading={loading} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article className="overflow-hidden rounded-lg border border-brand-green/15 bg-white shadow-lg" key={item.id || item.name}>
            <img className="aspect-[1.25] w-full object-cover" src={item.image} alt={item.title || item.name} />
            <div className="p-5">
              <h3 className="font-black text-brand-green">{item.title || item.name}</h3>
              <p className="mt-2 leading-7 text-brand-muted">{gallery ? item.caption : item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactLine({ icon, text }) {
  return (
    <div className="mt-5 flex items-start gap-3 text-brand-muted">
      <span className="mt-0.5 text-brand-green-2">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
