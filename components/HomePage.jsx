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
  Users,
  X,
} from 'lucide-react';
import useContent from './useContent';
import {
  defaultContent,
  googleMapsUrl,
  impactStats,
  mapQuery,
  navItems,
  partners,
  services,
  whatsappUrl,
} from './siteData';

const pageX = 'px-[clamp(18px,5vw,72px)]';
const sectionY = 'py-16 md:py-24';
const buttonClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 font-black transition hover:-translate-y-0.5';
const primaryButton = `${buttonClass} bg-[#7BA717] text-white shadow-[0_16px_34px_rgba(123,167,23,0.28)] hover:bg-[#6a8f13]`;
const darkButton = `${buttonClass} bg-[#111827] text-white shadow-[0_16px_34px_rgba(17,24,39,0.22)] hover:bg-black`;
const lightButton = `${buttonClass} border border-white/25 bg-white text-[#234019] hover:bg-[#F0F9E3]`;
const outlineButton = `${buttonClass} border border-[#9DB36B]/40 bg-white text-[#5A7C2E] hover:bg-[#F0F9E3]`;

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-[#9DB36B]/25 bg-white/90 px-[clamp(18px,5vw,72px)] py-3 backdrop-blur-xl">
      <a href="#home" aria-label="PlastiGold Recycling Ltd home">
        <img className="h-12 w-auto md:h-14" src="/assets/plastigold-logo.svg" alt="PlastiGold Recycling Ltd logo" />
      </a>
      <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#9DB36B]/35 bg-white text-[#5A7C2E] lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={`${open ? 'grid' : 'hidden'} absolute left-4 right-4 top-20 gap-1 rounded-lg border border-[#9DB36B]/25 bg-white p-3 shadow-xl lg:static lg:flex lg:items-center lg:bg-transparent lg:p-0 lg:shadow-none lg:border-0`} aria-label="Primary navigation">
        {navItems.map((item) => (
          <a className="rounded-lg px-4 py-3 text-sm font-bold text-[#374151] transition hover:bg-[#F0F9E3] hover:text-[#5A7C2E] lg:rounded-full lg:py-2" key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <a className="rounded-lg bg-[#7BA717] px-4 py-3 text-sm font-black text-white transition hover:bg-[#6a8f13] lg:rounded-full lg:py-2" href="/admin">
          Admin
        </a>
      </nav>
    </header>
  );
}

export default function HomePage() {
  const { content, loading, error } = useContent();
  const [activeSlide, setActiveSlide] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const slides = content.slides.length ? content.slides : defaultContent.slides;
  const galleryImages = content.gallery.length ? content.gallery : defaultContent.gallery;
  const activeImage = slides[activeSlide] || slides[0];

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 1650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % slides.length);
    }, 4800);
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
      {showIntro && <IntroScreen />}
      <Navbar />
      <main className="overflow-x-hidden bg-[#F3F9E9] text-[#111827]">
        <section id="home" className={`relative grid min-h-[calc(100vh-73px)] items-end overflow-hidden bg-white ${pageX} py-10 md:items-center md:py-14`}>
          <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block">
            {slides.map((slide, index) => (
              <img
                className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${index === activeSlide ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
                src={slide.image}
                alt={slide.title}
                key={slide.id || slide.title}
              />
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.86)_14%,rgba(255,255,255,0.24)_48%,rgba(255,255,255,0)_100%)]" />
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.82fr)] lg:items-end">
            <div className="max-w-3xl py-10">
              <p className="mb-4 text-xs font-black uppercase tracking-widest text-[#7BA717]">Plastic recycling in Kano</p>
              <h1 className="text-[clamp(2.8rem,7vw,6.8rem)] font-black leading-none text-[#111827]">{content.hero.title}</h1>
              <p className="mt-5 max-w-2xl text-xl font-bold leading-8 text-[#5A7C2E] md:text-2xl">{content.hero.tagline}</p>
              <p className="mt-5 max-w-2xl leading-8 text-[#4b5563]">We recover, sort, process, and supply recycled plastic materials for businesses that want cleaner operations and stronger circular production.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a className={primaryButton} href="#services">Explore Services <ArrowRight size={18} /></a>
                <a className={outlineButton} href="#contact">Work With Us <Phone size={18} /></a>
              </div>
              {error && <p className="mt-4 text-sm font-semibold text-[#5A7C2E]">Using saved website placeholders until content loads.</p>}
            </div>

            <div className="rounded-lg border border-[#9DB36B]/25 bg-[#F3F9E9] p-4 shadow-2xl">
              <div className="relative aspect-[1.25] overflow-hidden rounded-lg">
                {slides.map((slide, index) => (
                  <img
                    className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${index === activeSlide ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
                    src={slide.image}
                    alt={slide.title}
                    key={`card-${slide.id || slide.title}`}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#7BA717]">Featured material</p>
                  <p className="mt-1 font-black text-[#111827]">{activeImage.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#5A7C2E]" onClick={() => goToSlide(-1)} aria-label="Previous slide"><ChevronLeft size={18} /></button>
                  <button className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#5A7C2E]" onClick={() => goToSlide(1)} aria-label="Next slide"><ChevronRight size={18} /></button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    className={`h-2.5 rounded-full transition-all ${index === activeSlide ? 'w-8 bg-[#7BA717]' : 'w-2.5 bg-[#9DB36B]/45'}`}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show ${slide.title}`}
                    key={`dot-${slide.id || slide.title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`bg-white ${pageX} py-6`}>
          <div className="grid gap-4 md:grid-cols-3">
            {impactStats.map((stat) => (
              <div className="rounded-lg border border-[#9DB36B]/25 bg-[#F3F9E9] p-5" key={stat.label}>
                <strong className="block text-4xl font-black text-[#5A7C2E]">{stat.value}</strong>
                <span className="mt-1 block font-black text-[#111827]">{stat.label}</span>
                <p className="mt-2 text-sm leading-6 text-[#4b5563]">{stat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className={`grid gap-10 bg-[#F3F9E9] ${pageX} ${sectionY} lg:grid-cols-[0.92fr_1.08fr] lg:items-center`}>
          <div>
            <SectionKicker>About PlastiGold</SectionKicker>
            <h2 className="mt-3 text-[clamp(2rem,4vw,4rem)] font-black leading-tight text-[#111827]">Turning local plastic waste into dependable industrial value.</h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">PlastiGold Recycling Ltd collects, sorts, processes, and supplies recycled plastic materials from Kano. Our work supports cleaner communities, practical sustainability, and manufacturing-ready material streams.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {['Community collection relationships', 'Industrial material preparation', 'Reliable local recycling supply', 'Cleaner circular production'].map((item) => (
                <div className="flex items-center gap-3 font-bold text-[#374151]" key={item}>
                  <CheckCircle2 className="text-[#7BA717]" size={20} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [Factory, 'Operations', 'Based in Sharada Industrial Area, Kano.'],
              [Leaf, 'Sustainability', 'Focused on waste recovery and circular value.'],
              [ShieldCheck, 'Quality Sorting', 'Prepared materials for manufacturing use.'],
              [Users, 'Community Value', 'Supporting local jobs and cleaner neighborhoods.'],
            ].map(([Icon, title, text]) => (
              <article className="rounded-lg border border-[#9DB36B]/25 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg" key={title}>
                <Icon className="text-[#7BA717]" />
                <h3 className="mt-4 font-black text-[#111827]">{title}</h3>
                <p className="mt-2 leading-7 text-[#4b5563]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className={`bg-white ${pageX} ${sectionY}`}>
          <SectionHeading eyebrow="Services" title="Recycling services built for responsible growth." copy="From collection to processed material supply, PlastiGold helps organizations move plastic waste back into productive use." />
          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <article className="group overflow-hidden rounded-lg border border-[#9DB36B]/25 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl" key={service.name}>
                <img className="aspect-[1.18] w-full object-cover transition group-hover:scale-[1.03]" src={service.image} alt={service.name} />
                <div className="p-6">
                  <h3 className="text-xl font-black text-[#111827]">{service.name}</h3>
                  <p className="mt-3 leading-7 text-[#4b5563]">{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="impact" className={`bg-[#111827] ${pageX} ${sectionY} text-white`}>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <SectionKicker dark>Impact</SectionKicker>
              <h2 className="mt-3 text-[clamp(2rem,4vw,4rem)] font-black leading-tight">Cleaner communities. Stronger recycling value chains.</h2>
              <p className="mt-5 leading-8 text-white/75">Our impact is measured in recovered plastic, practical jobs, and business partnerships that keep valuable materials out of unmanaged waste streams.</p>
              <a className={`${primaryButton} mt-8`} href="#contact">Start a Partnership <ArrowRight size={18} /></a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {impactStats.map((stat) => (
                <article className="rounded-lg border border-white/10 bg-white/10 p-6 backdrop-blur-sm" key={stat.label}>
                  <strong className="block text-4xl font-black text-[#C4F262]">{stat.value}</strong>
                  <h3 className="mt-3 font-black text-white">{stat.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">{stat.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className={`bg-[#F3F9E9] ${pageX} ${sectionY}`}>
          <SectionHeading eyebrow="Gallery" title="Materials, operations, and recycling progress." copy="A view into PlastiGold products and recycling activity." loading={loading} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image) => (
              <figure className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl" key={image.id || image.image}>
                <img className="aspect-[1.2] w-full object-cover transition group-hover:scale-[1.03]" src={image.image} alt={image.title} />
                <figcaption className="p-5">
                  <strong className="text-[#111827]">{image.title}</strong>
                  {image.caption && <p className="mt-2 leading-7 text-[#4b5563]">{image.caption}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="partners" className={`bg-white ${pageX} ${sectionY}`}>
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div>
              <SectionKicker>Partners</SectionKicker>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight text-[#111827]">Working with people who move recycling forward.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {partners.map((partner) => (
                <div className="rounded-lg border border-[#9DB36B]/25 bg-[#F3F9E9] p-5 font-black text-[#5A7C2E]" key={partner}>
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className={`grid gap-10 bg-[#F3F9E9] ${pageX} ${sectionY} lg:grid-cols-[0.86fr_1.14fr] lg:items-center`}>
          <div className="rounded-lg border border-[#9DB36B]/25 bg-white p-6 shadow-lg md:p-8">
            <SectionKicker>Contact Us</SectionKicker>
            <h2 className="mt-3 text-[clamp(2rem,4vw,4rem)] font-black leading-tight text-[#111827]">Build a cleaner plastic value chain with us.</h2>
            <ContactLine icon={<Phone />} text="+234 806 099 0928, +234 906 495 05266" />
            <ContactLine icon={<Mail />} text="yegroupholdings@gmail.com" />
            <ContactLine icon={<MapPin />} text="Sharada Industrial Area Phase 3, Opposite Aminci Radio, Kano, Nigeria" />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a className={darkButton} href={googleMapsUrl} target="_blank" rel="noreferrer">Open Map <MapPin size={18} /></a>
              <a className={outlineButton} href="mailto:yegroupholdings@gmail.com">Email Us <Mail size={18} /></a>
            </div>
          </div>
          <iframe className="h-[340px] w-full rounded-lg border-0 shadow-xl md:h-[460px]" title="PlastiGold Recycling Ltd location map" loading="lazy" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} />
        </section>
      </main>

      <footer className={`bg-[#111827] ${pageX} py-10 text-white`}>
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <img className="h-16 w-fit rounded-lg bg-white p-1" src="/assets/plastigold-logo.svg" alt="PlastiGold Recycling Ltd" />
            <p className="mt-5 max-w-xl leading-7 text-white/70">PlastiGold Recycling Ltd turns plastic waste into cleaner industrial value through collection, sorting, processing, and responsible material supply.</p>
          </div>
          <div className="grid gap-2 text-white/70 md:text-right">
            <a className="font-bold text-white hover:text-[#C4F262]" href="mailto:yegroupholdings@gmail.com">yegroupholdings@gmail.com</a>
            <span>www.plastigoldrecycling.com</span>
            <span>Kano, Nigeria</span>
          </div>
        </div>
      </footer>

      <a className="fixed bottom-6 right-6 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <MessageCircle size={26} />
      </a>
    </>
  );
}

function IntroScreen() {
  return (
    <div className="intro-screen fixed inset-0 z-50 flex items-start justify-center bg-white px-6 pt-16 md:pt-20">
      <div className="intro-mark relative overflow-hidden rounded-lg bg-white p-4">
        <img className="relative z-10 h-24 w-auto md:h-32" src="/assets/plastigold-logo.svg" alt="PlastiGold Recycling Ltd logo" />
        <span className="intro-light absolute inset-y-0 -left-1/2 w-1/2 bg-white/70" />
      </div>
    </div>
  );
}

function SectionKicker({ children, dark = false }) {
  return (
    <p className={`text-xs font-black uppercase tracking-widest ${dark ? 'text-[#C4F262]' : 'text-[#7BA717]'}`}>
      {children}
    </p>
  );
}

function SectionHeading({ eyebrow, title, copy, loading }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <SectionKicker>{eyebrow}</SectionKicker>
      <h2 className="mt-3 text-[clamp(2rem,4vw,4rem)] font-black leading-tight text-[#111827]">{title}</h2>
      {copy && <p className="mt-4 leading-8 text-[#4b5563]">{copy}</p>}
      {loading && <p className="mt-2 text-[#4b5563]">Loading latest images...</p>}
    </div>
  );
}

function ContactLine({ icon, text }) {
  return (
    <div className="mt-5 flex items-start gap-3 text-[#4b5563]">
      <span className="mt-0.5 text-[#7BA717]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
