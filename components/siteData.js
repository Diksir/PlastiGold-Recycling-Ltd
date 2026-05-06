export const defaultContent = {
  hero: {
    title: 'PlastiGold Recycling Ltd',
    tagline: 'Turning Plastic Waste Into Sustainable Value',
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
  story: {
    about: {
      eyebrow: 'From the team',
      title: 'From recovery to recycled value',
      highlight: 'value',
      body: 'PlastiGold Recycling Ltd is building a practical recycling operation in Kano, focused on recovering plastic waste and preparing it for productive industrial reuse. We work with businesses, collectors, and local communities to move valuable material away from unmanaged waste streams and back into manufacturing supply chains.',
      quote: 'Our goal is simple: turn plastic waste into dependable recycled input while supporting cleaner communities and local economic value.',
      image: '/assets/product-material-bags.jpeg',
    },
    video: {
      title: 'Follow our story',
      caption: 'See how recovered materials move through collection, sorting, processing, and supply.',
      poster: '/assets/recycling-plant.svg',
      videoUrl: '',
    },
  },
};

export const services = [
  {
    name: 'Plastic Waste Collection',
    description: 'Efficient collection of plastic waste from households, businesses, and industries.',
    image: '/assets/product-material-bags.jpeg',
  },
  {
    name: 'Sorting and Processing',
    description: 'Advanced sorting and processing to ensure high-quality recyclable materials.',
    image: '/assets/product-white-pellets.jpeg',
  },
  {
    name: 'Recycling Solutions',
    description: 'Turning plastic waste into recycled products and raw materials for industries.',
    image: '/assets/product-dark-pellets.jpeg',
  },
  {
    name: 'Community Programs',
    description: 'Education, awareness, and community recycling programs for a sustainable future.',
    image: '/assets/gallery-yard.svg',
  },
];

export const impactStats = [
  { value: '2,450+', label: 'Tons of Plastic Recycled', detail: 'Material moved back into productive use.' },
  { value: '350+', label: 'Jobs Created', detail: 'Local work supported through sorting, handling, and operations.' },
  { value: '25+', label: 'Communities Served', detail: 'Collection relationships across Kano business and community areas.' },
  { value: '8+', label: 'Years of Operation', detail: 'Practical experience in recycling and material recovery.' },
];

export const partners = ['Manufacturers', 'Local Collectors', 'Community Groups', 'Industrial Buyers'];

export const processSteps = [
  {
    step: '01',
    title: 'Collection',
    text: 'We collect plastic waste from various sources responsibly.',
  },
  {
    step: '02',
    title: 'Sorting',
    text: 'Materials are sorted by type, color, and quality.',
  },
  {
    step: '03',
    title: 'Processing',
    text: 'Plastic waste is cleaned, shredded, and processed into flakes.',
  },
  {
    step: '04',
    title: 'Recycling',
    text: 'Processed materials are recycled into high-quality raw materials.',
  },
  {
    step: '05',
    title: 'Reuse',
    text: 'Recycled materials are used to create new products.',
  },
];

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export const mapQuery = encodeURIComponent('Sharada Industrial Area Phase 3, Opposite Aminci Radio, Kano Nigeria');
export const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
export const whatsappUrl = 'https://wa.me/2348060990928';
export const tokenKey = 'plastigold_admin_token';
