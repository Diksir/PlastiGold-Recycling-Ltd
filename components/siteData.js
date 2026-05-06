export const defaultContent = {
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

export const services = [
  {
    name: 'Plastic Collection',
    description: 'Coordinated recovery of recyclable plastic materials from businesses, communities, and industrial partners across Kano.',
    image: '/assets/product-brown-pellets.jpeg',
  },
  {
    name: 'Sorting and Processing',
    description: 'Disciplined material separation, cleaning, and preparation that helps plastic waste return to useful production streams.',
    image: '/assets/product-white-pellets.jpeg',
  },
  {
    name: 'Recycled Materials Supply',
    description: 'Reliable regrind, pellets, and mixed plastic materials supplied for manufacturing and circular production.',
    image: '/assets/product-dark-pellets.jpeg',
  },
];

export const impactStats = [
  { value: '250+', label: 'Plastic Recycled', detail: 'Tons of material moved back into productive use.' },
  { value: '40+', label: 'Jobs Created', detail: 'Local work supported through sorting, handling, and operations.' },
  { value: '12+', label: 'Communities Served', detail: 'Collection relationships across Kano business and community areas.' },
];

export const partners = ['Manufacturers', 'Local Collectors', 'Community Groups', 'Industrial Buyers'];

export const processSteps = [
  {
    step: '01',
    title: 'Recover',
    text: 'Plastic materials are collected through local relationships with businesses, collectors, and communities.',
  },
  {
    step: '02',
    title: 'Sort',
    text: 'Materials are separated by type, quality, and production readiness to reduce contamination.',
  },
  {
    step: '03',
    title: 'Process',
    text: 'Recovered plastic is prepared into usable recycled material streams for industrial partners.',
  },
  {
    step: '04',
    title: 'Supply',
    text: 'Manufacturers receive consistent recycled inputs that support circular production and cleaner value chains.',
  },
];

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Impact', href: '#impact' },
  { label: 'Process', href: '#process' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Partners', href: '#partners' },
  { label: 'Contact', href: '#contact' },
];

export const mapQuery = encodeURIComponent('Sharada Industrial Area Phase 3, Opposite Aminci Radio, Kano Nigeria');
export const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
export const whatsappUrl = 'https://wa.me/2348060990928';
export const tokenKey = 'plastigold_admin_token';
