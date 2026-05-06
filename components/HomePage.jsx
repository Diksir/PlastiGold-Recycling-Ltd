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
import {
  defaultContent,
  googleMapsUrl,
  impactStats,
  mapQuery,
  navItems,
  partners,
  processSteps,
  services,
  whatsappUrl,
} from './siteData';

const pageX = 'px-[clamp(20px,5vw,80px)]';
const sectionY = 'py-20 md:py-28';
const container = 'mx-auto w-full max-w-7xl';
const buttonBase = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#c7a247]/45 focus:ring-offset-2';
const primaryButton = `${buttonBase} bg-[#0b5d34] text-white shadow-[0_16px_34px_rgba(11,93,52,0.25)] hover:-translate-y-0.5 hover:bg-[#084729]`;
const darkButton = `${buttonBase} bg-[#111827] text-white shadow-[0_16px_34px_rgba(17,24,39,0.20)] hover:-translate-y-0.5 hover:bg-black`;
const lightButton = `${buttonBase} border border-white/25 bg-white text-[#111827] hover:-translate-y-0.5 hover:bg-neutral-100`;
const outlineButton = `${buttonBase} border border-[#111827]/15 bg-white text-[#111827] hover:-translate-y-0.5 hover:border-[#0b5d34]/35 hover:text-[#0b5d34]`;

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-black/8 bg-white/95 backdrop-blur-xl">
      <div className={`${container} ${pageX} flex items-center justify-between gap-6 py-3`}>
        <a className="flex items-center" href="#home" aria-label="PlastiGold Recycling Ltd home">
          <img className="h-12 w-auto md:h-14" src="/assets/plastigold-logo.svg" alt="PlastiGold Recycling Ltd logo" />
        </a>
        <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#111827] shadow-sm lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={`${open ? 'grid' : 'hidden'} absolute left-4 right-4 top-20 gap-1 rounded-2xl border border-black/10 bg-white p-3 shadow-2xl lg:static lg:flex lg:items-center lg:bg-transparent lg:p-0 lg:shadow-none lg:border-0`} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a className="rounded-full px-4 py-3 text-sm font-bold text-[#374151] transition hover:text-[#0b5d34] lg:py-2" key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="rounded-full border border-[#111827]/15 px-5 py-3 text-sm font-black text-[#111827] transition hover:border-[#0b5d34] hover:text-[#0b5d34] lg:py-2.5" href="/admin">
            Admin
          </a>
        </nav>
      </div>
    </header>
  );
}

export default function HomePage() {
  const { content, loading, error } = useContent();
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = content.slides.length ? content.slides : defaultContent.slides;
  const galleryImages = content.gallery.length ? content.gallery : defaultContent.gallery;
  const activeImage = slides[activeSlide] || slides[0];

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % slides.length);
    }, 5200);
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
      <main className="overflow-x-hidden bg-white text-[#111827]">
        <section id="home" className="bg-[#101418] text-white">
          <div className={`${container} ${pageX} grid min-h-[calc(100vh-73px)] gap-10 py-12 md:py-16 lg:grid-cols-[0.94fr_1.06fr] lg:items-center`}>
            <div className="max-w-4xl">
              <p className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-[#c7a247]">Circular materials. Cleaner industry.</p>
              <h1 className="text-[clamp(3.1rem,8vw,7.4rem)] font-black leading-[0.9] tracking-tight">{content.hero.title}</h1>
              <p className="mt-6 max-w-2xl text-xl font-semibold leading-8 text-white/82 md:text-2xl">{content.hero.tagline}</p>
              <p className="mt-5 max-w-2xl leading-8 text-white/66">PlastiGold Recycling Ltd recovers plastic waste and prepares reliable recycled materials for manufacturers, businesses, and partners building cleaner value chains.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a className={primaryButton} href="#contact">Start a Partnership <ArrowRight size={18} /></a>
                <a className={lightButton} href="#services">Explore Services <Recycle size={18} /></a>
              </div>
              {error && <p className="mt-4 text-sm font-semibold text-white/70">Using saved website placeholders until content loads.</p>}
            </div>

            <div className="relative">
              <div className="relative aspect-[1.08] overflow-hidden rounded-[1.4rem] bg-neutral-900 shadow-[0_28px_70px_rgba(0,0,0,0.38)]">
                {slides.map((slide, index) => (
                  <img
                    className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${index === activeSlide ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
                    src={slide.image}
                    alt={slide.title}
                    key={slide.id || slide.title}
                  />
                ))}
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(16,20,24,0.72)_0%,rgba(16,20,24,0)_48%)]" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c7a247]">Featured material</p>
                    <p className="mt-1 text-lg font-black">{activeImage.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#111827] transition hover:bg-neutral-200" onClick={() => goToSlide(-1)} aria-label="Previous slide"><ChevronLeft size={18} /></button>
                    <button className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#111827] transition hover:bg-neutral-200" onClick={() => goToSlide(1)} aria-label="Next slide"><ChevronRight size={18} /></button>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2">
                {slides.slice(0, 7).map((slide, index) => (
                  <button
                    className={`h-2 rounded-full transition-all ${index === activeSlide ? 'w-9 bg-[#c7a247]' : 'w-2 bg-white/35'}`}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show ${slide.title}`}
                    key={`dot-${slide.id || slide.title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`${pageX} border-b border-black/10 bg-white py-10`}>
          <div className={`${container} grid gap-6 md:grid-cols-3 md:divide-x md:divide-black/10`}>
            {impactStats.map((stat) => (
              <Metric key={stat.label} stat={stat} />
            ))}
          </div>
        </section>

        <section id="about" className={`${pageX} ${sectionY} bg-white`}>
          <div className={`${container} grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center`}>
            <div>
              <SectionKicker>About PlastiGold</SectionKicker>
              <h2 className="mt-4 max-w-3xl text-[clamp(2.25rem,4.5vw,4.8rem)] font-black leading-[0.96] tracking-tight">Industrial recycling with discipline, transparency, and measurable value.</h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-[#4b5563]">PlastiGold Recycling Ltd collects, sorts, processes, and supplies recycled plastic materials from Kano. The company exists to turn plastic waste into dependable production input while supporting cleaner communities and local work.</p>
              <div className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {['Community collection networks', 'Material quality discipline', 'Manufacturing-ready supply', 'Cleaner circular production'].map((item) => (
                  <div className="flex items-center gap-3 font-bold text-[#111827]" key={item}>
                    <CheckCircle2 className="text-[#0b5d34]" size={20} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="services" className={`${pageX} ${sectionY} bg-[#f7f7f4]`}>
          <div className={container}>
            <SectionHeading eyebrow="Services" title="Recycling services for serious circular production." copy="No clutter, no gimmicks. Just disciplined recovery, processing, and recycled material supply for organizations that need dependable partners." />
            <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
              {services.map((service, index) => (
                <ServiceRow key={service.name} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className={`${pageX} ${sectionY} bg-[#101418] text-white`}>
          <div className={`${container} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center`}>
            <div>
              <SectionKicker dark>Measured impact</SectionKicker>
              <h2 className="mt-4 text-[clamp(2.25rem,4.5vw,4.8rem)] font-black leading-[0.96] tracking-tight">Environmental work with business-grade execution.</h2>
              <p className="mt-6 leading-8 text-white/66">Recovered plastic, reliable jobs, and stronger partnerships are the measurements that matter. The visual style should be quiet because the work is practical.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {impactStats.map((stat) => (
                <div className="border-t border-white/16 pt-6" key={stat.label}>
                  <strong className="block text-4xl font-black tracking-tight text-[#c7a247]">{stat.value}</strong>
                  <h3 className="mt-3 font-black">{stat.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className={`${pageX} ${sectionY} bg-white`}>
          <div className={container}>
            <SectionHeading eyebrow="Process" title="From waste stream to production stream." copy="A clear journey keeps recovered plastics accountable from collection through supply." />
            <ol className="mt-14 grid gap-8 md:grid-cols-4 md:gap-0">
              {processSteps.map((step) => (
                <li className="relative border-t border-black/14 pt-6 md:pr-8" key={step.step}>
                  <span className="text-sm font-black text-[#c7a247]">{step.step}</span>
                  <h3 className="mt-4 text-2xl font-black">{step.title}</h3>
                  <p className="mt-3 leading-7 text-[#4b5563]">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="gallery" className={`${pageX} ${sectionY} bg-[#f7f7f4]`}>
          <div className={container}>
            <SectionHeading eyebrow="Gallery" title="Materials and operations, presented plainly." copy="Images remain editable from the admin panel. The layout keeps the work visible without burying it in decorative cards." loading={loading} />
            <div className="mt-12 grid gap-5 lg:grid-cols-12">
              {galleryImages.map((image, index) => (
                <figure className={`${index === 0 ? 'lg:col-span-7' : 'lg:col-span-5'} group`} key={image.id || image.image}>
                  <div className="overflow-hidden rounded-[1.1rem] bg-neutral-200">
                    <img className={`w-full object-cover transition duration-300 group-hover:scale-[1.025] ${index === 0 ? 'aspect-[1.22]' : 'aspect-[1.58]'}`} src={image.image} alt={image.title} loading="lazy" decoding="async" />
                  </div>
                  <figcaption className="mt-4">
                    <strong>{image.title}</strong>
                    {image.caption && <p className="mt-1 leading-7 text-[#4b5563]">{image.caption}</p>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="partners" className={`${pageX} ${sectionY} bg-white`}>
          <div className={`${container} grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center`}>
            <div>
              <SectionKicker>Partners and clients</SectionKicker>
              <h2 className="mt-4 text-[clamp(2.1rem,4vw,4rem)] font-black leading-tight">Built for organizations that take sustainability seriously.</h2>
            </div>
            <div className="grid gap-0 border-y border-black/10 sm:grid-cols-2">
              {partners.map((partner) => (
                <div className="border-b border-black/10 py-5 font-black text-[#111827] sm:border-r sm:px-5" key={partner}>
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className={`${pageX} ${sectionY} bg-[#101418] text-white`}>
          <div className={`${container} grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center`}>
            <div>
              <SectionKicker dark>Contact PlastiGold</SectionKicker>
              <h2 className="mt-4 text-[clamp(2.3rem,4.5vw,4.8rem)] font-black leading-[0.96] tracking-tight">Build a cleaner plastic value chain with us.</h2>
              <p className="mt-6 leading-8 text-white/66">Talk to us about collection, recycled material supply, or a practical recycling partnership for your organization.</p>
              <ContactLine light icon={<Phone />} text="+234 806 099 0928, +234 906 495 05266" />
              <ContactLine light icon={<Mail />} text="yegroupholdings@gmail.com" />
              <ContactLine light icon={<MapPin />} text="Sharada Industrial Area Phase 3, Opposite Aminci Radio, Kano, Nigeria" />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a className={primaryButton} href={googleMapsUrl} target="_blank" rel="noreferrer">Open Map <MapPin size={18} /></a>
                <a className={lightButton} href="mailto:yegroupholdings@gmail.com">Email Us <Mail size={18} /></a>
              </div>
            </div>
            <iframe className="h-[360px] w-full rounded-[1.1rem] border-0 grayscale lg:h-[520px]" title="PlastiGold Recycling Ltd location map" loading="lazy" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} />
          </div>
        </section>
      </main>

      <footer className={`bg-white ${pageX} py-12 text-[#111827]`}>
        <div className={`${container} grid gap-10 border-t border-black/10 pt-10 md:grid-cols-[1.1fr_0.9fr] md:items-end`}>
          <div>
            <img className="h-16 w-fit" src="/assets/plastigold-logo.svg" alt="PlastiGold Recycling Ltd" />
            <p className="mt-6 max-w-xl leading-7 text-[#4b5563]">PlastiGold Recycling Ltd turns plastic waste into cleaner industrial value through collection, sorting, processing, and responsible material supply.</p>
          </div>
          <div className="grid gap-2 text-[#4b5563] md:text-right">
            <a className="font-bold text-[#111827] transition hover:text-[#0b5d34]" href="mailto:yegroupholdings@gmail.com">yegroupholdings@gmail.com</a>
            <span>www.plastigoldrecycling.com</span>
            <span>Kano, Nigeria</span>
          </div>
        </div>
      </footer>

      <a className="fixed bottom-6 right-6 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl transition hover:-translate-y-1" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <MessageCircle size={26} />
      </a>
    </>
  );
}

function Metric({ stat }) {
  return (
    <div className="py-2 md:px-8">
      <strong className="block text-4xl font-black tracking-tight text-[#111827]">{stat.value}</strong>
      <span className="mt-2 block font-black text-[#0b5d34]">{stat.label}</span>
      <p className="mt-2 text-sm leading-6 text-[#4b5563]">{stat.detail}</p>
    </div>
  );
}

function ServiceRow({ service, index }) {
  const icons = [Recycle, ShieldCheck, Factory];
  const Icon = icons[index % icons.length];

  return (
    <article className="grid gap-6 py-8 md:grid-cols-[140px_minmax(0,0.9fr)_minmax(0,1.25fr)_auto] md:items-center">
      <img className="aspect-[1.35] w-full rounded-xl object-cover md:h-24" src={service.image} alt={service.name} loading="lazy" decoding="async" />
      <div className="flex items-center gap-4">
        <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[#101418] text-[#c7a247]">
          <Icon size={20} />
        </span>
        <h3 className="text-2xl font-black">{service.name}</h3>
      </div>
      <p className="leading-7 text-[#4b5563]">{service.description}</p>
      <a className="inline-flex items-center gap-2 font-black text-[#0b5d34] transition hover:gap-3" href="#contact">
        Enquire <ArrowRight size={16} />
      </a>
    </article>
  );
}

function SectionKicker({ children, dark = false }) {
  return (
    <p className={`text-xs font-black uppercase tracking-[0.18em] ${dark ? 'text-[#c7a247]' : 'text-[#0b5d34]'}`}>
      {children}
    </p>
  );
}

function SectionHeading({ eyebrow, title, copy, loading }) {
  return (
    <div className="max-w-3xl">
      <SectionKicker>{eyebrow}</SectionKicker>
      <h2 className="mt-4 text-[clamp(2.2rem,4.4vw,4.5rem)] font-black leading-[0.98] tracking-tight">{title}</h2>
      {copy && <p className="mt-5 leading-8 text-[#4b5563]">{copy}</p>}
      {loading && <p className="mt-3 text-[#4b5563]">Loading latest images...</p>}
    </div>
  );
}

function ContactLine({ icon, text, light = false }) {
  return (
    <div className={`mt-5 flex items-start gap-3 ${light ? 'text-white/68' : 'text-[#4b5563]'}`}>
      <span className={`mt-0.5 ${light ? 'text-[#c7a247]' : 'text-[#0b5d34]'}`}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}
