import './globals.css';

export const metadata = {
  title: 'PlastiGold Recycling Ltd',
  description: 'Plastic recycling company in Kano, Nigeria.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
