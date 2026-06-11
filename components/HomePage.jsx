'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Factory,
  Heart,
  Instagram,
  Leaf,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Phone,
  Play,
  Quote,
  Recycle,
  ShieldCheck,
  Star,
  Truck,
  Twitter,
  Users,
  X,
} from 'lucide-react';
import useContent from './useContent';
import {
  defaultContent,
  googleMapsEmbedForContact,
  googleMapsUrlForContact,
  whatsappUrlForContact,
} from './siteData';

// ─── Animation config ─────────────────────────────────────────────────────────

const VP = { once: false, amount: 0.12 };

const fadeUp = {
  hidden: { opacity: 0, y: 44, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ raw, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isInView) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setDisplay(0);
      return;
    }
    const target = raw;
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * target));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isInView, raw]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

function parseStat(value) {
  const raw = parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = String(value).replace(/[0-9,]/g, '').trim();
  return { raw, suffix };
}

function publicNavigationItems(navItems = []) {
  return (Array.isArray(navItems) ? navItems : []).filter((item) => {
    const label = item.label?.trim().toLowerCase();
    const href = item.href?.trim().toLowerCase();
    return label !== 'admin' && href !== '/admin' && href !== '/pg-internal-console';
  });
}

function wrapIndex(index, length) {
  return length > 0 ? (index + length) % length : 0;
}

function testimonialInitials(name) {
  const initials = String(name || 'Guest')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return initials || 'G';
}

function arrayWithFallback(value, fallback) {
  return Array.isArray(value) && value.length ? value : fallback;
}

function firstArrayItem(value) {
  return Array.isArray(value) ? value.find(() => true) : undefined;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ navItems }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const publicNavItems = publicNavigationItems(navItems);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)]' : 'bg-white/96 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center" aria-label="PlastiGold Recycling Ltd home">
            <img
              className="h-16 w-auto object-contain"
              src="/assets/plastigold-logo-transparent.png"
              alt="PlastiGold Recycling Ltd"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex">
            {publicNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] font-semibold text-[#153426] transition-colors hover:text-[#0A5C36]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden rounded-full bg-[#0A5C36] px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#086b36] md:inline-flex"
            >
              Get In Touch
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#153426] md:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-black/5 bg-white px-5 pb-5 md:hidden">
          {publicNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-black/5 py-3 text-sm font-semibold text-[#153426] hover:text-[#0A5C36]"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-full bg-[#0A5C36] px-5 py-3 text-center text-sm font-bold text-white"
          >
            Get In Touch
          </a>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ slides, hero, impactStats, heroFeatures }) {
  const [active, setActive] = useState(0);
  const safeSlides = Array.isArray(slides) && slides.length ? slides : defaultContent.slides;
  const safeImpactStats = Array.isArray(impactStats) && impactStats.length ? impactStats : defaultContent.impactStats;
  const safeHeroFeatures = Array.isArray(heroFeatures) && heroFeatures.length ? heroFeatures : defaultContent.heroFeatures;
  const heroBadge =
    safeImpactStats.find((stat) => stat.label?.toLowerCase().includes('year')) ||
    safeImpactStats.find((_, index) => index === 3) ||
    firstArrayItem(safeImpactStats);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => wrapIndex(p + 1, safeSlides.length)), 5500);
    return () => clearInterval(t);
  }, [safeSlides.length]);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Slide backgrounds */}
      <div className="absolute inset-0">
        {safeSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1200 ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#021A0D]/92 via-[#021A0D]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#021A0D]/55 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex min-h-screen flex-col justify-center pt-28 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[640px]"
          >
            {/* Eyebrow badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#52BD71]/30 bg-[#52BD71]/10 px-4 py-2">
              <Leaf className="h-3.5 w-3.5 text-[#52BD71]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
                {hero.tagline}
              </span>
            </div>

            <h1 className="mb-6 text-[clamp(36px,5.5vw,70px)] font-extrabold leading-[1.08] tracking-tight text-white">
              {hero.title}
            </h1>

            <p className="mb-8 max-w-lg text-[clamp(14px,1.6vw,18px)] leading-relaxed text-white/72">
              {hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a
                href={hero.primaryCtaHref}
                className="inline-flex items-center gap-2 rounded-full bg-[#52BD71] px-7 py-3.5 text-[13px] font-bold text-white shadow-lg transition hover:bg-[#3da85e] hover:-translate-y-0.5"
              >
                {hero.primaryCtaText}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={hero.secondaryCtaHref}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-7 py-3.5 text-[13px] font-bold text-white transition hover:border-white hover:bg-white/10"
              >
                {hero.secondaryCtaText}
              </a>
            </div>

            {/* Feature row */}
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {safeHeroFeatures.map((feature, i) => (
                <div key={`${feature.title}-${i}`} className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#52BD71]/18">
                    <CheckCircle2 className="h-4 w-4 text-[#52BD71]" />
                  </div>
                  <div className="text-sm font-bold text-white">{feature.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-white/65">{feature.text}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating badge */}
          {heroBadge && (
          <div className="absolute top-36 right-6 hidden max-w-[160px] rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur-md md:block">
            <span className="block text-3xl font-extrabold text-[#52BD71]">{heroBadge.value}</span>
            <span className="text-[11px] leading-tight text-white/75">
              {heroBadge.label}
            </span>
          </div>
          )}

          {/* Slide controls */}
          <div className="absolute bottom-10 right-6 flex items-center gap-3 md:right-10">
            <button
              onClick={() => setActive((p) => wrapIndex(p - 1, safeSlides.length))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1.5">
              {safeSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 bg-[#52BD71]' : 'w-1.5 bg-white/35'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setActive((p) => wrapIndex(p + 1, safeSlides.length))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const STAT_ICONS = [Recycle, Users, MapPin, Award];
const STAT_COLORS = ['#0A5C36', '#52BD71', '#f3c623', '#0A5C36'];

function StatsSection({ impactStats, sections }) {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="mb-12 text-center"
        >
          <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
            Impact
          </div>
          <h2 className="mb-4 text-[clamp(28px,3.5vw,46px)] font-extrabold text-[#153426]">
            {sections.impactTitle}
          </h2>
          <div className="mx-auto h-1 w-14 rounded-full bg-[#52BD71]" />
          {sections.impactCopy && <p className="mx-auto mt-5 max-w-xl text-[#5d7467]">{sections.impactCopy}</p>}
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {impactStats.map((stat, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length];
            const color = STAT_COLORS[i % STAT_COLORS.length];
            const { raw, suffix } = parseStat(stat.value);
            return (
              <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center">
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <div className="mb-1 text-[clamp(28px,3vw,38px)] font-extrabold" style={{ color: '#0A5C36' }}>
                  <AnimatedCounter raw={raw} suffix={suffix} />
                </div>
                <div className="text-sm font-semibold text-[#153426]">{stat.label}</div>
                <div className="mt-1 text-xs text-[#5d7467]">{stat.detail}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

const ABOUT_FEATURES = [
  { icon: Leaf, label: 'Eco-Friendly Operations' },
  { icon: Recycle, label: 'Full Cycle Recycling' },
  { icon: ShieldCheck, label: 'Certified & Trusted' },
];

function AboutSection({ story }) {
  const { about, video } = story;
  const hasStoryVideo = Boolean(video?.videoUrl);
  return (
    <section id="about" className="bg-[#F5F7F5] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="grid gap-10 md:grid-cols-3"
        >
          {/* Image */}
          <motion.div variants={fadeUp} className="relative">
            <div className="overflow-hidden rounded-3xl shadow-xl">
              {hasStoryVideo ? (
                <video
                  className="h-[340px] w-full object-cover md:h-[460px]"
                  controls
                  playsInline
                  poster={video.poster}
                >
                  <source src={video.videoUrl} />
                </video>
              ) : (
                <img
                  src={about.image}
                  alt={about.title}
                  className="h-[340px] w-full object-cover md:h-[460px]"
                />
              )}
            </div>
          </motion.div>

          {/* Text */}
          <motion.div variants={fadeUp} className="flex flex-col justify-center">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
              {about.eyebrow}
            </div>
            <h2 className="mb-5 text-[clamp(26px,3vw,42px)] font-extrabold leading-tight text-[#153426]">
              {about.title}
            </h2>
            <p className="mb-6 leading-relaxed text-[#5d7467]">{about.body}</p>
            <blockquote className="mb-8 border-l-4 border-[#52BD71] pl-4 text-sm italic text-[#5d7467]">
              "{about.quote}"
            </blockquote>
            <a
              href="#services"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0A5C36] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#086b36] hover:-translate-y-0.5"
            >
              Explore Our Services <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Feature mini-cards */}
          <motion.div variants={fadeUp} className="flex flex-col justify-center gap-4">
            <div id="story-video" className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {hasStoryVideo ? (
                <video className="aspect-video w-full object-cover" controls poster={video.poster}>
                  <source src={video.videoUrl} />
                </video>
              ) : (
                <img className="aspect-video w-full object-cover" src={video.poster} alt={video.title} />
              )}
              <div className="p-5">
                <div className="mb-1 font-bold text-[#153426]">{video.title}</div>
                <p className="text-sm leading-relaxed text-[#5d7467]">{video.caption}</p>
              </div>
            </div>
            {ABOUT_FEATURES.map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F5ED]">
                  <Icon className="h-5 w-5 text-[#0A5C36]" />
                </div>
                <span className="font-semibold text-[#153426]">{label}</span>
              </div>
            ))}
            <div className="mt-1 rounded-2xl bg-[#0A5C36] p-5 text-white">
              <div className="mb-1 text-3xl font-extrabold">
                10,000<span className="text-[#52BD71]">+</span>
              </div>
              <div className="text-sm text-white/75">Tons of Plastic Recycled</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

const SERVICE_ICONS = [Truck, Factory, Package, Heart];

function ServicesSection({ services, sections }) {
  return (
    <section id="services" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="mb-14 text-center"
        >
          <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
            What We Do
          </div>
          <h2 className="mb-4 text-[clamp(28px,3.5vw,46px)] font-extrabold text-[#153426]">
            {sections.servicesTitle}
          </h2>
          <div className="mx-auto h-1 w-14 rounded-full bg-[#52BD71]" />
          <p className="mx-auto mt-5 max-w-xl text-[#5d7467]">{sections.servicesCopy}</p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group overflow-hidden rounded-3xl border border-black/5 bg-[#F5F7F5] transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative">
                  <img
                    src={service.image || '/assets/recycling-plant.svg'}
                    alt={service.name}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition duration-300 group-hover:bg-[#0A5C36]">
                    <Icon className="h-5 w-5 text-[#0A5C36] transition duration-300 group-hover:text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-[15px] font-bold text-[#153426]">{service.name}</h3>
                  <p className="mb-5 text-sm leading-relaxed text-[#5d7467]">{service.description}</p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0A5C36] transition duration-200 hover:gap-3"
                  >
                    Learn More <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Process ──────────────────────────────────────────────────────────────────

function ProcessSection({ processSteps, sections }) {
  return (
    <section id="process" className="bg-[#F5F7F5] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Left */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            className="flex flex-col justify-center"
          >
            <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
              How It Works
            </div>
            <h2 className="mb-5 text-[clamp(28px,3vw,44px)] font-extrabold leading-tight text-[#153426]">
              {sections.processTitle}
            </h2>
            <p className="mb-8 leading-relaxed text-[#5d7467]">{sections.processCopy}</p>
            <a
              href="#contact"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0A5C36] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#086b36] hover:-translate-y-0.5"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Steps */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            className="flex flex-col gap-4"
          >
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0A5C36] text-sm font-extrabold text-white">
                  {step.step}
                </div>
                <div>
                  <h4 className="mb-1 font-bold text-[#153426]">{step.title}</h4>
                  <p className="text-sm leading-relaxed text-[#5d7467]">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Gallery + Testimonials ───────────────────────────────────────────────────

const WHY_ICONS = [ShieldCheck, MapPin, Leaf, CheckCircle2];

function WhySection({ whyCards, sections }) {
  const safeWhyCards = Array.isArray(whyCards) && whyCards.length ? whyCards : defaultContent.whyCards;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="mb-14 text-center"
        >
          <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
            Why Us
          </div>
          <h2 className="mb-4 text-[clamp(28px,3.5vw,46px)] font-extrabold text-[#153426]">
            {sections.whyTitle}
          </h2>
          <div className="mx-auto h-1 w-14 rounded-full bg-[#52BD71]" />
          {sections.whyCopy && <p className="mx-auto mt-5 max-w-xl text-[#5d7467]">{sections.whyCopy}</p>}
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {safeWhyCards.map((card, i) => {
            const Icon = WHY_ICONS[i % WHY_ICONS.length];
            return (
              <motion.div key={`${card.title}-${i}`} variants={fadeUp} className="rounded-2xl bg-[#F5F7F5] p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5ED]">
                  <Icon className="h-5 w-5 text-[#0A5C36]" />
                </div>
                <h3 className="mb-3 font-bold text-[#153426]">{card.title}</h3>
                <p className="text-sm leading-relaxed text-[#5d7467]">{card.text}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function GalleryTestimonialsSection({ galleryGrid, onFeedbackAdded, sections, testimonials }) {
  const [active, setActive] = useState(0);
  const [feedback, setFeedback] = useState({ name: '', role: '', text: '', rating: 5 });
  const [feedbackStatus, setFeedbackStatus] = useState('');
  const safeGalleryGrid = Array.isArray(galleryGrid) && galleryGrid.length ? galleryGrid : defaultContent.gallery;
  const safeTestimonials = Array.isArray(testimonials) && testimonials.length ? testimonials : defaultContent.testimonials;
  const activeTestimonial =
    safeTestimonials.find((_, index) => index === active) || firstArrayItem(safeTestimonials);

  useEffect(() => {
    if (active >= safeTestimonials.length) setActive(0);
  }, [active, safeTestimonials.length]);

  const submitFeedback = async (event) => {
    event.preventDefault();
    setFeedbackStatus('sending');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Could not save feedback.');
      onFeedbackAdded(data);
      setActive(0);
      setFeedback({ name: '', role: '', text: '', rating: 5 });
      setFeedbackStatus('saved');
    } catch (error) {
      setFeedbackStatus(error.message || 'error');
    }
  };

  return (
    <section id="gallery" className="overflow-hidden">
      <div className="flex min-h-[560px] flex-col lg:flex-row">
        {/* Gallery – left */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="flex-1 bg-white p-5 sm:p-8 lg:p-12"
        >
          <div className="mb-6">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
              Our Work
            </div>
            <h2 className="text-[clamp(22px,2.5vw,36px)] font-extrabold text-[#153426]">
              {sections.galleryTitle}
            </h2>
            {sections.galleryCopy && <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5d7467]">{sections.galleryCopy}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {safeGalleryGrid.map((img, i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-[#E8F5ED]">
                <img
                  src={img.image}
                  alt={img.title}
                  className="h-[104px] w-full object-cover transition duration-300 hover:scale-110 sm:h-[120px] lg:h-[130px]"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials – right */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="flex flex-1 flex-col justify-center bg-[#021A0D] p-5 sm:p-8 lg:p-12"
        >
          <div className="mb-7">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
              Testimonials
            </div>
            <h2 className="text-[clamp(22px,2.5vw,36px)] font-extrabold text-white">
              What Our Partners Say
            </h2>
          </div>

          {activeTestimonial && (
          <div>
            <Quote className="mb-4 h-10 w-10 text-[#52BD71]/35" />
            <p className="mb-6 max-w-full break-words text-sm leading-relaxed text-white/78 sm:text-base">
              "{activeTestimonial.text}"
            </p>
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#52BD71] text-sm font-bold text-white">
                {testimonialInitials(activeTestimonial.name)}
              </div>
              <div className="min-w-0">
                <div className="break-words font-bold text-white">{activeTestimonial.name || 'Guest'}</div>
                <div className="text-sm text-white/55">{activeTestimonial.role || 'Customer'}</div>
              </div>
            </div>
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`h-4 w-4 ${star <= activeTestimonial.rating ? 'fill-[#f3c623] text-[#f3c623]' : 'text-white/25'}`} />
              ))}
            </div>
          </div>
          )}

          {/* Controls */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActive((p) => wrapIndex(p - 1, safeTestimonials.length))}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              {safeTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 bg-[#52BD71]' : 'w-2 bg-white/30'
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setActive((p) => wrapIndex(p + 1, safeTestimonials.length))}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <form className="mt-8 grid min-w-0 gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5" onSubmit={submitFeedback}>
            <div className="text-sm font-bold text-white">Share your feedback</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="min-h-12 min-w-0 rounded-xl border border-white/10 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/40 focus:border-[#52BD71] sm:text-sm" value={feedback.name} onChange={(event) => setFeedback({ ...feedback, name: event.target.value })} placeholder="Your name" required />
              <input className="min-h-12 min-w-0 rounded-xl border border-white/10 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/40 focus:border-[#52BD71] sm:text-sm" value={feedback.role} onChange={(event) => setFeedback({ ...feedback, role: event.target.value })} placeholder="Customer / Partner" />
            </div>
            <div className="flex flex-wrap gap-1" aria-label="Rate PlastiGold">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10" type="button" onClick={() => setFeedback({ ...feedback, rating: star })} aria-label={`${star} star rating`}>
                  <Star className={`h-6 w-6 ${star <= feedback.rating ? 'fill-[#f3c623] text-[#f3c623]' : 'text-white/30'}`} />
                </button>
              ))}
            </div>
            <textarea className="min-h-28 min-w-0 resize-y rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-[#52BD71] sm:text-sm" value={feedback.text} onChange={(event) => setFeedback({ ...feedback, text: event.target.value })} placeholder="Write your feedback" required />
            <button className="min-h-12 rounded-full bg-[#52BD71] px-5 text-sm font-bold text-[#021A0D] transition hover:bg-white disabled:opacity-60" disabled={feedbackStatus === 'sending'} type="submit">
              {feedbackStatus === 'sending' ? 'Saving...' : 'Submit Feedback'}
            </button>
            {feedbackStatus === 'saved' && <p className="text-sm font-semibold text-[#52BD71]">Thank you. Your feedback is now showing.</p>}
            {feedbackStatus && !['sending', 'saved'].includes(feedbackStatus) && <p className="text-sm font-semibold text-red-300">{feedbackStatus}</p>}
          </form>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CtaBanner({ cta }) {
  return (
    <section className="relative overflow-hidden bg-[#0A5C36] py-20">
      {cta.image && (
        <img
          src={cta.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          aria-hidden="true"
        />
      )}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#52BD71]/10" />
      <div className="pointer-events-none absolute right-1/4 top-4 h-32 w-32 rounded-full border border-white/8" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
        className="relative mx-auto max-w-3xl px-5 text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#52BD71]/30 bg-[#52BD71]/12 px-4 py-2">
          <Leaf className="h-3.5 w-3.5 text-[#52BD71]" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
            Join the Movement
          </span>
        </div>
        <h2 className="mb-5 text-[clamp(28px,4vw,52px)] font-extrabold leading-tight text-white">
          {cta.title}
        </h2>
        <p className="mb-8 text-[clamp(14px,1.5vw,18px)] text-white/70">{cta.copy}</p>
        <a
          href={cta.buttonHref}
          className="inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 text-[15px] font-bold text-white transition hover:bg-white hover:text-[#0A5C36]"
        >
          {cta.buttonText} <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </section>
  );
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

const BLOG_POSTS = [
  {
    category: 'Sustainability',
    date: 'Jan 15, 2026',
    title: 'How Plastic Recycling is Transforming Kano’s Economy',
    excerpt:
      'Discover how PlastiGold is turning waste into economic opportunity while protecting the environment for future generations.',
    image: '/assets/slide-red-pellets-01.jpeg',
  },
  {
    category: 'Community',
    date: 'Feb 3, 2026',
    title: 'Community Recycling Programs: Our 2025 Impact Report',
    excerpt:
      'We served 25+ communities this year. Here is what we learned and how we plan to grow further in 2026.',
    image: '/assets/slide-brown-pellets-01.jpeg',
  },
  {
    category: 'Industry',
    date: 'Mar 20, 2026',
    title: 'The Future of Recycled Plastics in Nigerian Manufacturing',
    excerpt:
      'Local manufacturers are increasingly turning to recycled materials. PlastiGold is ready to supply at scale.',
    image: '/assets/slide-dark-pellets-01.jpeg',
  },
];

function BlogSection() {
  return (
    <section className="bg-[#F5F7F5] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="mb-14 text-center"
        >
          <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
            Latest News
          </div>
          <h2 className="mb-4 text-[clamp(28px,3.5vw,46px)] font-extrabold text-[#153426]">
            News &amp; Insights
          </h2>
          <div className="mx-auto h-1 w-14 rounded-full bg-[#52BD71]" />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="grid gap-6 md:grid-cols-3"
        >
          {BLOG_POSTS.map((post, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-full bg-[#E8F5ED] px-3 py-1 text-xs font-bold text-[#0A5C36]">
                    {post.category}
                  </span>
                  <span className="text-xs text-[#5d7467]">{post.date}</span>
                </div>
                <h3 className="mb-3 font-bold leading-snug text-[#153426]">{post.title}</h3>
                <p className="text-sm leading-relaxed text-[#5d7467]">{post.excerpt}</p>
                <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#0A5C36] transition duration-200 hover:gap-3">
                  Read More <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection({ contact, sections }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const contactItems = [
    {
      icon: MapPin,
      label: 'Our Address',
      value: contact.address,
      href: googleMapsUrlForContact(contact),
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: 'Chat with us on WhatsApp',
      href: whatsappUrlForContact(contact),
    },
  ];

  const inputCls =
    'w-full rounded-xl border border-black/10 bg-[#F5F7F5] px-4 py-3 text-sm outline-none transition focus:border-[#52BD71] focus:ring-2 focus:ring-[#52BD71]/20';

  return (
    <section id="contact" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="mb-14 text-center"
        >
          <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
            Get In Touch
          </div>
          <h2 className="mb-4 text-[clamp(28px,3.5vw,46px)] font-extrabold text-[#153426]">
            {sections.contactTitle}
          </h2>
          <div className="mx-auto h-1 w-14 rounded-full bg-[#52BD71]" />
          <p className="mx-auto mt-5 max-w-xl text-[#5d7467]">{sections.contactCopy}</p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="grid gap-10 md:grid-cols-2"
        >
          {/* Contact info */}
          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            {contactItems.map(({ icon: Icon, label, value, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-2xl border border-black/5 p-5 transition hover:border-[#52BD71]/40 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F5ED]">
                  <Icon className="h-5 w-5 text-[#0A5C36]" />
                </div>
                <div>
                  <div className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#5d7467]">
                    {label}
                  </div>
                  <div className="text-sm font-semibold text-[#153426]">{value}</div>
                </div>
              </a>
            ))}

            {/* Action buttons */}
            <div className="mt-2 flex flex-col gap-3">
              <a
                href={googleMapsUrlForContact(contact)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0A5C36] py-3.5 text-sm font-bold text-white transition hover:bg-[#086b36]"
              >
                Open Map <MapPin className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#c9a34a] py-3.5 text-sm font-bold text-white transition hover:bg-[#b69038]"
              >
                Email Us <Mail className="h-4 w-4" />
              </a>
            </div>

            {/* Map embed */}
            <div className="mt-2 overflow-hidden rounded-2xl border border-black/5 shadow-sm">
              <iframe
                src={googleMapsEmbedForContact(contact)}
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PlastiGold location"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeUp}>
            {status === 'sent' ? (
              <div className="flex h-full items-center justify-center rounded-3xl bg-[#E8F5ED] p-10 text-center">
                <div>
                  <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-[#0A5C36]" />
                  <h3 className="mb-2 text-lg font-bold text-[#153426]">Message Sent!</h3>
                  <p className="text-sm text-[#5d7467]">We'll get back to you shortly.</p>
                  <button
                    onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', message: '' }); }}
                    className="mt-5 text-sm font-bold text-[#0A5C36] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 rounded-3xl border border-black/5 p-7 shadow-sm"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#153426]">
                      Full Name *
                    </label>
                    <input
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#153426]">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#153426]">
                    Phone Number
                  </label>
                  <input
                    placeholder="+234 ..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#153426]">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your needs..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="mt-1 w-full rounded-xl bg-[#0A5C36] py-3.5 text-sm font-bold text-white transition hover:bg-[#086b36] disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>
                {status === 'error' && (
                  <p className="text-center text-sm text-red-500">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  { key: 'facebook', label: 'Facebook', Icon: Facebook },
  { key: 'twitter', label: 'Twitter', Icon: Twitter },
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
];

function Footer({ footer, navItems, services, contact }) {
  const publicNavItems = publicNavigationItems(navItems);

  return (
    <footer className="bg-[#021A0D] pb-8 pt-16 text-white">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-12 grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="#home" className="mb-5 flex items-center" aria-label="PlastiGold Recycling Ltd home">
              <img
                className="h-20 w-auto object-contain"
                src="/assets/plastigold-logo-transparent.png"
                alt="PlastiGold Recycling Ltd"
              />
            </a>
            <p className="mb-5 text-sm leading-relaxed text-white/55">{footer.description}</p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ key, label, Icon }) => (
                <a
                  key={key}
                  href={footer.socialLinks?.[key] || '#'}
                  target={footer.socialLinks?.[key]?.startsWith('http') ? '_blank' : undefined}
                  rel={footer.socialLinks?.[key]?.startsWith('http') ? 'noreferrer' : undefined}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/65 transition hover:bg-[#52BD71] hover:text-white"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-5 text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {publicNavItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-white/55 transition hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-5 text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((s, i) => (
                <li key={i}>
                  <a
                    href="#services"
                    className="text-sm text-white/55 transition hover:text-white"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-[11px] font-bold uppercase tracking-widest text-[#52BD71]">
              Contact
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5 text-sm text-white/55">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#52BD71]" />
                {contact.address}
              </li>
              <li>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2.5 text-sm text-white/55 transition hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#52BD71]" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2.5 text-sm text-white/55 transition hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#52BD71]" />
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/38">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function HomePage({ initialContent }) {
  const { content, setContent } = useContent(initialContent);

  const slides = arrayWithFallback(content.slides, defaultContent.slides);
  const gallery = arrayWithFallback(content.gallery, defaultContent.gallery);
  const story = content.story || defaultContent.story;
  const contact = content.contact || defaultContent.contact;
  const hero = content.hero || defaultContent.hero;
  const cta = content.cta || defaultContent.cta;
  const navItems = arrayWithFallback(content.navItems, defaultContent.navItems);
  const heroFeatures = arrayWithFallback(content.heroFeatures, defaultContent.heroFeatures);
  const impactStats = arrayWithFallback(content.impactStats, defaultContent.impactStats);
  const services = arrayWithFallback(content.services, defaultContent.services);
  const processSteps = arrayWithFallback(content.processSteps, defaultContent.processSteps);
  const whyCards = arrayWithFallback(content.whyCards, defaultContent.whyCards);
  const sections = content.sections || defaultContent.sections;
  const footer = content.footer || defaultContent.footer;
  const testimonials = arrayWithFallback(content.testimonials, defaultContent.testimonials);

  const galleryGrid = [...gallery, ...slides].slice(0, 6);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar navItems={navItems} />
      <HeroSection slides={slides} hero={hero} impactStats={impactStats} heroFeatures={heroFeatures} />
      <StatsSection impactStats={impactStats} sections={sections} />
      <AboutSection story={story} />
      <ServicesSection services={services} sections={sections} />
      <ProcessSection processSteps={processSteps} sections={sections} />
      <WhySection whyCards={whyCards} sections={sections} />
      <GalleryTestimonialsSection
        galleryGrid={galleryGrid}
        sections={sections}
        testimonials={testimonials}
        onFeedbackAdded={(testimonial) => setContent((current) => ({ ...current, testimonials: [testimonial, ...(current.testimonials || [])] }))}
      />
      <CtaBanner cta={cta} />
      <BlogSection />
      <ContactSection contact={contact} sections={sections} />
      <Footer footer={footer} navItems={navItems} services={services} contact={contact} />

      {/* WhatsApp FAB */}
      <a
        href={whatsappUrlForContact(contact)}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </a>
    </div>
  );
}
