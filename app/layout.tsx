import type { Metadata } from 'next';
import './globals.css';
import './visual-fixes.css';
import './product-sections.css';
import './james-clean.css';

export const metadata: Metadata = {
  title: 'LACOMUS — Silent Luxury',
  description: 'A cinematic fragrance experience for LACOMUS.',
  metadataBase: new URL('https://lacomusph.com'),
  openGraph: {
    title: 'LACOMUS — Silent Luxury',
    description: 'A cinematic fragrance experience for LACOMUS.',
    type: 'website',
    images: ['https://d8j0ntlcm91z4.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/hf_20260908_091944_bc61ad67-edb4-4e67-af1b-0535544a8d7f.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
