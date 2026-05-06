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
const primaryButton = `${buttonBase} bg-[#b8ff12] text-[#111827] shadow-[0_16px_34px_rgba(184,255,18,0.28)] hover:-translate-y-0.5 hover:bg-[#a6eb0f]`;
const playButton = 'inline-flex items-center gap-4 font-black text-[#29476b] transition hover:text-[#0b5d34]';
const outlineButton = `${buttonBase} border border-[#111827]/15 bg-white text-[#111827] hover:-translate-y-0.5 hover:border-[#0b5d34]/35 hover:text-[#0b5d34]`;

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl">
      <div className={`${container} ${pageX} flex items-center justify-between gap-6 py-7`}>
        <a className="flex items-center" href="#home" aria-label="PlastiGold Recycling Ltd home">
          <img className="h-14 w-auto md:h-16" src="/assets/plastigold-logo.svg" alt="PlastiGold Recycling Ltd logo" />
        </a>
        <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#111827] shadow-sm lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={`${open ? 'grid' : 'hidden'} absolute left-4 right-4 top-24 gap-1 rounded-2xl border border-black/10 bg-white p-3 shadow-2xl lg:static lg:flex lg:items-center lg:bg-transparent lg:p-0 lg:shadow-none lg:border-0`} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a className="rounded-full px-4 py-3 text-sm font-medium text-[#23517a] transition hover:text-[#0b5d34] lg:py-2" key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="rounded-full px-5 py-3 text-sm font-black text-[#111827] transition hover:text-[#0b5d34] lg:ml-10 lg:py-2.5" href="/admin">
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
  const story = content.story || defaultContent.story;
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
        <section id="home" className="relative bg-white">
          <div className={`${container} ${pageX} grid min-h-[calc(100vh-122px)] gap-12 pb-20 pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pt-20`}>
            <div className="max-w-3xl">
              <p className="mb-6 text-sm font-medium text-[#23517a]">{content.hero.title}</p>
              <h1 className="text-[clamp(3.4rem,7.2vw,7.2rem)] font-black leading-[0.92] tracking-tight text-[#202b45]">
                Transforming plastic waste into{' '}
                <span className="bg-[linear-gradient(90deg,#fff9af_0%,#b8ff12_82%)] bg-clip-text text-transparent">industrial value</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4c6f94]">{content.hero.tagline}. PlastiGold recovers, processes, and supplies recycled plastic materials for cleaner production in Nigeria.</p>
              <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center">
                <a className={primaryButton} href="#contact">Recycle with us</a>
                <a className={playButton} href="#process">
                  <span className="grid h-14 w-14 place-items-center rounded-full border border-[#111827] text-[#111827]">
                    <ArrowRight size={18} />
                  </span>
                  <span className="leading-tight">See our<br />process</span>
                </a>
              </div>
              {error && <p className="mt-4 text-sm font-semibold text-[#4c6f94]">Using saved website placeholders until content loads.</p>}
            </div>

            <div className="relative min-h-[420px] lg:min-h-[640px]">
              <div className="absolute right-0 top-8 h-[72%] w-[78%] rounded-[54%_46%_48%_52%/45%_55%_45%_55%] bg-[#b8ff12]" />
              <div className="absolute bottom-6 left-0 h-[58%] w-[82%] overflow-hidden rounded-[52%_48%_44%_56%/50%_43%_57%_50%] bg-neutral-100 shadow-[0_32px_80px_rgba(32,43,69,0.14)] md:left-8 md:w-[86%]">
                {slides.map((slide, index) => (
                  <img
                    className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${index === activeSlide ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
                    src={slide.image}
                    alt={slide.title}
                    key={slide.id || slide.title}
                  />
                ))}
              </div>
              <div className="absolute bottom-0 right-0 rounded-2xl bg-white/90 p-4 shadow-[0_18px_45px_rgba(32,43,69,0.12)] backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b5d34]">Featured material</p>
                <p className="mt-1 font-black text-[#202b45]">{activeImage.title}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white text-[#111827] transition hover:bg-neutral-100" onClick={() => goToSlide(-1)} aria-label="Previous slide"><ChevronLeft size={18} /></button>
                  <button className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white text-[#111827] transition hover:bg-neutral-100" onClick={() => goToSlide(1)} aria-label="Next slide"><ChevronRight size={18} /></button>
                </div>
              </div>
              <div className="absolute bottom-1 left-8 flex items-center gap-2">
                {slides.slice(0, 7).map((slide, index) => (
                  <button
                    className={`h-2 rounded-full transition-all ${index === activeSlide ? 'w-9 bg-[#b8ff12]' : 'w-2 bg-[#202b45]/25'}`}
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
          <div className={`${container} grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start`}>
            <img className="aspect-[1.38] w-full rounded-[1.35rem] object-cover" src={story.about.image} alt={story.about.title} />
            <div className="pt-2">
              <SectionKicker>{story.about.eyebrow}</SectionKicker>
              <h2 className="mt-4 max-w-3xl text-[clamp(2.25rem,4.5vw,4.8rem)] font-black leading-[0.96] tracking-tight">
                <HighlightedTitle title={story.about.title} highlight={story.about.highlight} />
              </h2>
              <Paragraphs className="mt-6 text-lg leading-8 text-[#4b5563]" text={story.about.body} />
              {story.about.quote && (
                <blockquote className="mt-7 border-l-4 border-[#b8ff12] pl-5 italic leading-8 text-[#4c6f94]">
                  {story.about.quote}
                </blockquote>
              )}
            </div>
          </div>
        </section>

        <section className={`${pageX} bg-white pb-20 md:pb-28`}>
          <div className={container}>
            <h2 className="text-center text-[clamp(1.8rem,3vw,2.6rem)] font-black text-[#202b45]">{story.video.title}</h2>
            {story.video.caption && <p className="mx-auto mt-4 max-w-2xl text-center leading-8 text-[#4b5563]">{story.video.caption}</p>}
            <div className="relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-[1.35rem] bg-neutral-100 shadow-[0_24px_70px_rgba(32,43,69,0.12)]">
              {story.video.videoUrl ? (
                <video className="aspect-video w-full object-cover" controls poster={story.video.poster}>
                  <source src={story.video.videoUrl} />
                </video>
              ) : (
                <>
                  <img className="aspect-video w-full object-cover" src={story.video.poster} alt={story.video.title} />
                  <div className="absolute inset-0 grid place-items-center bg-black/10">
                    <span className="grid h-20 w-20 place-items-center rounded-full border-2 border-white bg-black/20 text-white backdrop-blur-sm">
                      <ArrowRight size={32} />
                    </span>
                  </div>
                </>
              )}
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
                <a className={outlineButton} href="mailto:yegroupholdings@gmail.com">Email Us <Mail size={18} /></a>
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

function HighlightedTitle({ title, highlight }) {
  if (!highlight || !title.toLowerCase().includes(highlight.toLowerCase())) {
    return title;
  }

  const start = title.toLowerCase().indexOf(highlight.toLowerCase());
  const before = title.slice(0, start);
  const match = title.slice(start, start + highlight.length);
  const after = title.slice(start + highlight.length);

  return (
    <>
      {before}
      <span className="bg-[linear-gradient(90deg,#fff9af_0%,#b8ff12_82%)] bg-clip-text text-transparent">{match}</span>
      {after}
    </>
  );
}

function Paragraphs({ text, className }) {
  return String(text || '')
    .split('\n')
    .filter(Boolean)
    .map((paragraph) => (
      <p className={className} key={paragraph}>
        {paragraph}
      </p>
    ));
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
