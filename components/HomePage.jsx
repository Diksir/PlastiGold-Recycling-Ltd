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
  navItems,
  partners,
  processSteps,
  services,
  whatsappUrl,
} from './siteData';

const pageShell = 'mx-auto flex w-full max-w-[1500px] flex-col';
const sectionCard = 'border-b border-black/5 bg-white';
const sectionPad = 'px-[clamp(20px,5vw,72px)] py-16 md:py-24';
const buttonBase = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-[#c9a34a]/50 focus:ring-offset-2';
const primaryButton = `${buttonBase} bg-[#0a7a3e] text-white shadow-[0_16px_34px_rgba(10,122,62,0.24)] hover:-translate-y-0.5 hover:bg-[#086b36]`;
const goldButton = `${buttonBase} bg-[#c9a34a] text-white shadow-[0_16px_34px_rgba(201,163,74,0.28)] hover:-translate-y-0.5 hover:bg-[#b69038]`;
const outlineButton = `${buttonBase} border border-white/70 bg-transparent text-white hover:-translate-y-0.5 hover:bg-white hover:text-[#083d29]`;

const whyCards = [
  {
    title: 'Reliable Operations',
    text: 'Consistent recycling services for partners that need dependable execution.',
    icon: ShieldCheck,
  },
  {
    title: 'Local Expertise',
    text: 'Practical knowledge of local collection needs and sustainable solutions.',
    icon: MapPin,
  },
  {
    title: 'Environmental Impact',
    text: 'Focused on reducing pollution and protecting cleaner communities.',
    icon: Leaf,
  },
  {
    title: 'Transparent Process',
    text: 'Clear handling from collection through sorting, processing, and supply.',
    icon: CheckCircle2,
  },
];

export default function HomePage() {
  const { content, loading, error } = useContent();
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = content.slides.length ? content.slides : defaultContent.slides;
  const galleryImages = content.gallery.length ? content.gallery : defaultContent.gallery;
  const story = content.story || defaultContent.story;
  const activeImage = slides[activeSlide] || slides[0];
  const galleryGrid = [...galleryImages, ...slides].slice(0, 6);

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
      <main className="overflow-x-hidden bg-white text-[#13251b]">
        <div className={pageShell}>
          <HeroCard
            activeImage={activeImage}
            activeSlide={activeSlide}
            content={content}
            error={error}
            goToSlide={goToSlide}
            setActiveSlide={setActiveSlide}
            slides={slides}
          />

          <div className="grid gap-6">
            <ImpactSection />
            <AboutSection story={story} />
          </div>

          <ServicesSection />
          <ProcessSection />
          <GallerySection galleryGrid={galleryGrid} loading={loading} />
          <WhySection />
          <CtaSection story={story} />
          <Footer />
        </div>
      </main>

      <a className="fixed bottom-6 right-6 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl transition hover:-translate-y-1" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <MessageCircle size={26} />
      </a>
    </>
  );
}

function HeroCard({ activeImage, activeSlide, content, error, goToSlide, setActiveSlide, slides }) {
  return (
    <section id="home" className="relative min-h-[700px] overflow-hidden bg-[#031d14] px-[clamp(20px,5vw,72px)] py-6 text-white md:py-8 xl:min-h-[820px]">
      <img className="absolute inset-0 h-full w-full object-cover opacity-70" src={activeImage.image} alt={activeImage.title} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,23,15,0.96)_0%,rgba(2,30,20,0.88)_42%,rgba(2,23,15,0.34)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,163,74,0.24),transparent_34%)]" />

      <div className="relative z-10 flex min-h-[620px] flex-col md:min-h-[700px]">
        <HeroNav />

        <div className="flex flex-1 items-center py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-bold text-white/80">{content.hero.title}</p>
            <HeroTitle text={content.hero.tagline} />
            <p className="mt-6 max-w-xl text-base leading-8 text-white/82">
              PlastiGold Recycling Ltd is building a cleaner future through responsible plastic recycling, innovation, and community impact.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a className={primaryButton} href="#services">Explore Our Work</a>
              <a className={outlineButton} href="#contact">Contact Us</a>
            </div>
            {error && <p className="mt-4 text-sm font-semibold text-white/70">Using saved website placeholders until content loads.</p>}
          </div>
        </div>

        <div className="grid gap-4 border-t border-white/12 pt-6 sm:grid-cols-3">
          <HeroFeature icon={Leaf} title="Cleaner Environment" text="Greener future" />
          <HeroFeature icon={Recycle} title="Sustainable Solutions" text="For a better tomorrow" />
          <HeroFeature icon={MapPin} title="Proudly Recycling in" text="Kano, Nigeria" />
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-[#083d29]" onClick={() => goToSlide(-1)} aria-label="Previous slide"><ChevronLeft size={18} /></button>
          <div className="hidden items-center gap-2 sm:flex">
            {slides.slice(0, 7).map((slide, index) => (
              <button
                className={`h-2 rounded-full transition-all ${index === activeSlide ? 'w-8 bg-[#c9a34a]' : 'w-2 bg-white/45'}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show ${slide.title}`}
                key={`dot-${slide.id || slide.title}`}
              />
            ))}
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-[#083d29]" onClick={() => goToSlide(1)} aria-label="Next slide"><ChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}

function HeroNav() {
  const [open, setOpen] = useState(false);
  const heroLinks = navItems.filter((item) => ['Home', 'About Us', 'Services', 'Process', 'Gallery', 'Contact'].includes(item.label));

  return (
    <div className="relative z-20 flex items-center justify-between gap-5">
      <a className="inline-flex rounded-md bg-white/96 p-1.5 shadow-sm" href="#home" aria-label="PlastiGold Recycling Ltd home">
        <img className="h-12 w-auto" src="/assets/plastigold-logo.svg" alt="PlastiGold Recycling Ltd logo" />
      </a>
      <button className="grid h-11 w-11 place-items-center rounded-md border border-white/15 bg-white/10 text-white lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={`${open ? 'grid' : 'hidden'} absolute left-0 right-0 top-16 gap-1 rounded-lg border border-white/15 bg-[#062819]/95 p-3 shadow-2xl backdrop-blur lg:static lg:flex lg:items-center lg:bg-transparent lg:p-0 lg:shadow-none lg:border-0`} aria-label="Primary navigation">
        {heroLinks.map((item) => (
          <a className="rounded-md px-3 py-2 text-sm font-bold text-white/86 transition hover:bg-white/10 hover:text-white" key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label.replace('About Us', 'About')}
          </a>
        ))}
        <a className="rounded-md bg-[#c9a34a] px-5 py-3 text-sm font-black text-white transition hover:bg-[#b69038] lg:ml-5" href="#contact" onClick={() => setOpen(false)}>
          Get In Touch
        </a>
      </nav>
    </div>
  );
}

function HeroTitle({ text }) {
  const source = text || 'Turning Plastic Waste Into Sustainable Value';
  const match = source.match(/^(.*?)(Sustainable Value|Better Future|Industrial Value)$/i);

  if (!match) {
    return <h1 className="text-[clamp(2.9rem,5.8vw,5.75rem)] font-black leading-[1.02] tracking-tight">{source}</h1>;
  }

  return (
    <h1 className="text-[clamp(2.9rem,5.8vw,5.75rem)] font-black leading-[1.02] tracking-tight">
      {match[1]}
      <span className="text-[#69a94d]">{match[2]}</span>
    </h1>
  );
}

function HeroFeature({ icon: Icon, title, text }) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid h-12 w-12 flex-none place-items-center rounded-full border border-[#69a94d]/40 bg-[#0a7a3e]/35 text-[#8ed46d]">
        <Icon size={23} />
      </span>
      <div>
        <strong className="block text-sm">{title}</strong>
        <span className="text-xs text-white/70">{text}</span>
      </div>
    </div>
  );
}

function ImpactSection() {
  return (
    <section id="impact" className={`${sectionCard} ${sectionPad}`}>
      <CenteredTitle icon={Leaf} title="Our Impact in Numbers" copy="" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {impactStats.map((stat, index) => (
          <ImpactCard index={index} key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}

function ImpactCard({ index, stat }) {
  const icons = [Recycle, Factory, Leaf, ShieldCheck];
  const Icon = icons[index % icons.length];

  return (
    <article className="rounded-lg border border-black/8 bg-white p-5 text-center shadow-[0_10px_28px_rgba(17,24,39,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(17,24,39,0.12)]">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#1f7f37] text-white">
        <Icon size={19} />
      </span>
      <strong className="mt-4 block text-3xl font-black text-[#083d29]">{stat.value}</strong>
      <span className="mt-1 block text-sm leading-5 text-[#1d3025]">{stat.label}</span>
    </article>
  );
}

function AboutSection({ story }) {
  return (
    <section id="about" className={`${sectionCard} ${sectionPad} grid gap-10 md:items-center lg:grid-cols-[0.9fr_1.1fr]`}>
      <img className="aspect-[1.08] w-full rounded-lg object-cover" src={story.about.image} alt={story.about.title} loading="lazy" decoding="async" />
      <div>
        <h2 className="text-[clamp(2rem,3.2vw,3.5rem)] font-black leading-tight text-[#0e2118]">About PlastiGold Recycling Ltd.</h2>
        <Paragraphs className="mt-4 text-sm leading-7 text-[#334439]" text={story.about.body} limit={1} />
        <div className="mt-6 grid gap-4">
          <ValueLine title="Environmental Responsibility" text="We promote practices that reduce pollution and protect cleaner communities." />
          <ValueLine title="Community Empowerment" text="We create work opportunities through recycling and local collection initiatives." />
          <ValueLine title="Circular Economy" text="We turn recovered plastic into reusable materials that support production." />
        </div>
      </div>
    </section>
  );
}

function ValueLine({ title, text }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 grid h-8 w-8 flex-none place-items-center rounded-full bg-[#e7f4e6] text-[#1f7f37]">
        <CheckCircle2 size={16} />
      </span>
      <div>
        <strong className="text-sm text-[#0e2118]">{title}</strong>
        <p className="mt-1 text-sm leading-6 text-[#4f5f55]">{text}</p>
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <section id="services" className={`${sectionCard} ${sectionPad}`}>
      <CenteredTitle title="Our Services" copy="Comprehensive recycling solutions for a cleaner and sustainable future." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service, index) => (
          <ServiceCard index={index} key={service.name} service={service} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ index, service }) {
  const icons = [Recycle, Factory, Leaf, ShieldCheck];
  const Icon = icons[index % icons.length];

  return (
    <article className="group overflow-hidden rounded-lg border border-black/8 bg-white shadow-[0_10px_26px_rgba(17,24,39,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(17,24,39,0.13)]">
      <div className="relative">
        <img className="aspect-[1.6] w-full object-cover transition duration-300 group-hover:scale-[1.04]" src={service.image} alt={service.name} loading="lazy" decoding="async" />
        <span className="absolute -bottom-5 left-5 grid h-11 w-11 place-items-center rounded-full border-4 border-white bg-[#1f7f37] text-white">
          <Icon size={18} />
        </span>
      </div>
      <div className="px-5 pb-5 pt-8">
        <h3 className="text-lg font-black text-[#0e2118]">{service.name}</h3>
        <p className="mt-3 min-h-20 text-sm leading-6 text-[#4f5f55]">{service.description}</p>
        <a className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0a7a3e] transition hover:gap-3" href="#contact">
          Learn More <ArrowRight size={15} />
        </a>
      </div>
    </article>
  );
}

function ProcessSection() {
  return (
    <section id="process" className={`${sectionPad} bg-[radial-gradient(circle_at_50%_0%,rgba(92,149,62,0.38),transparent_34%),linear-gradient(135deg,#073a27_0%,#021b13_100%)] text-white`}>
      <CenteredTitle dark title="Our Recycling Process" copy="From waste to value, our process is simple, efficient, and environmentally responsible." />
      <ol className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-5">
        {processSteps.map((step, index) => (
          <li className="relative text-center" key={step.step}>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#2d8b3c] text-white shadow-[0_0_0_10px_rgba(255,255,255,0.06)]">
              <Recycle size={24} />
            </span>
            <strong className="mt-5 block text-lg">{step.title}</strong>
            <p className="mx-auto mt-3 max-w-[170px] text-xs leading-6 text-white/72">{step.text}</p>
            <span className="mx-auto mt-4 grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-black text-[#083d29]">{index + 1}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function GallerySection({ galleryGrid, loading }) {
  return (
    <section id="gallery" className={`${sectionCard} ${sectionPad}`}>
      <CenteredTitle title="Our Gallery" copy="A glimpse of our operations, team, and impact." />
      {loading && <p className="mt-3 text-center text-sm text-[#66736a]">Loading latest images...</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryGrid.map((image, index) => (
          <figure className="group overflow-hidden rounded-lg bg-[#eef1ed]" key={`${image.id || image.image}-${index}`}>
            <img className="aspect-[1.55] w-full object-cover transition duration-300 group-hover:scale-[1.04]" src={image.image} alt={image.title} loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
      <div className="mt-7 text-center">
        <a className={primaryButton} href="#contact">View More Photos</a>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className={`${sectionCard} ${sectionPad}`}>
      <CenteredTitle title="Why Choose PlastiGold?" copy="We deliver impact, value, and trust in everything we do." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {whyCards.map((card) => (
          <WhyCard card={card} key={card.title} />
        ))}
      </div>
    </section>
  );
}

function WhyCard({ card }) {
  const Icon = card.icon;

  return (
    <article className="rounded-lg border border-black/8 bg-white p-5 text-center shadow-[0_10px_26px_rgba(17,24,39,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(17,24,39,0.12)]">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-[#1f7f37]/25 bg-[#f5fbf4] text-[#1f7f37]">
        <Icon size={20} />
      </span>
      <h3 className="mt-5 text-sm font-black text-[#0e2118]">{card.title}</h3>
      <p className="mt-3 text-xs leading-6 text-[#5d6a61]">{card.text}</p>
    </article>
  );
}

function CtaSection({ story }) {
  return (
    <section id="partners" className={`relative min-h-[360px] overflow-hidden bg-[#063520] ${sectionPad} text-white`}>
      <img className="absolute inset-0 h-full w-full object-cover opacity-36" src={story.about.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,45,28,0.96),rgba(4,45,28,0.72),rgba(4,45,28,0.38))]" />
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-[clamp(2rem,3.8vw,3.8rem)] font-black leading-tight">Partner With Us for a Cleaner Future</h2>
        <p className="mt-4 max-w-lg leading-8 text-white/78">Let us work together to reduce plastic waste and build a sustainable community for generations to come.</p>
        <a className={`${goldButton} mt-8`} href="#contact">Contact PlastiGold <ArrowRight size={17} /></a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-[linear-gradient(135deg,#062819_0%,#02140e_100%)] px-[clamp(20px,5vw,72px)] py-12 text-white md:py-16">
      <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.9fr_1fr]">
        <div>
          <img className="h-14 w-auto rounded-md bg-white p-1.5" src="/assets/plastigold-logo.svg" alt="PlastiGold Recycling Ltd" />
          <p className="mt-6 text-sm leading-7 text-white/70">We are committed to transforming plastic waste into value while creating jobs and protecting the environment.</p>
        </div>
        <FooterLinks title="Quick Links" items={navItems.filter((item) => item.label !== 'Partners').slice(0, 6)} />
        <div>
          <h3 className="font-black">Our Services</h3>
          <div className="mt-5 grid gap-3 text-sm text-white/70">
            {services.map((service) => (
              <a className="transition hover:text-[#c9a34a]" href="#services" key={service.name}>{service.name}</a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-black">Contact Us</h3>
          <div className="mt-5 grid gap-4 text-sm text-white/70">
            <FooterContact icon={MapPin} text="Kano, Nigeria" />
            <FooterContact icon={Phone} text="+234 806 099 0928" />
            <FooterContact icon={Mail} text="yegroupholdings@gmail.com" />
            <a className={`${goldButton} mt-2 w-fit`} href={googleMapsUrl} target="_blank" rel="noreferrer">Open Map</a>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/50">
        © 2026 PlastiGold Recycling Ltd. All Rights Reserved.
      </div>
    </footer>
  );
}

function FooterLinks({ items, title }) {
  return (
    <div>
      <h3 className="font-black">{title}</h3>
      <div className="mt-5 grid gap-3 text-sm text-white/70">
        {items.map((item) => (
          <a className="transition hover:text-[#c9a34a]" href={item.href} key={item.href}>{item.label}</a>
        ))}
      </div>
    </div>
  );
}

function FooterContact({ icon: Icon, text }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 flex-none text-[#c9a34a]" size={16} />
      <span>{text}</span>
    </div>
  );
}

function CenteredTitle({ copy, dark = false, icon: Icon, title }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {Icon && (
        <span className={`mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full ${dark ? 'bg-white/10 text-[#c9a34a]' : 'bg-[#f0f8ed] text-[#1f7f37]'}`}>
          <Icon size={16} />
        </span>
      )}
      <h2 className={`text-[clamp(1.9rem,3vw,3rem)] font-black leading-tight ${dark ? 'text-white' : 'text-[#0e2118]'}`}>{title}</h2>
      <span className="mx-auto mt-3 block h-0.5 w-12 bg-[#c9a34a]" />
      {copy && <p className={`mx-auto mt-4 max-w-xl text-sm leading-7 ${dark ? 'text-white/70' : 'text-[#5d6a61]'}`}>{copy}</p>}
    </div>
  );
}

function Paragraphs({ className, limit, text }) {
  return String(text || '')
    .split('\n')
    .filter(Boolean)
    .slice(0, limit || undefined)
    .map((paragraph) => (
      <p className={className} key={paragraph}>
        {paragraph}
      </p>
    ));
}
