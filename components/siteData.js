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

export const products = [
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

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export const mapQuery = encodeURIComponent('Sharada Industrial Area Phase 3, Opposite Aminci Radio, Kano Nigeria');
export const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
export const whatsappUrl = 'https://wa.me/2348060990928';
export const tokenKey = 'plastigold_admin_token';
