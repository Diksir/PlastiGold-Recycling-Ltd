import './globals.css';

export const metadata = {
  title: 'PlastiGold Recycling Ltd',
  description: 'Plastic recycling company in Kano, Nigeria.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
