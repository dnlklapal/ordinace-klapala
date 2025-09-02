import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Ordinace Klapala – Admin', description: 'Interní přehled' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const links = [
    ['/', 'Dashboard'],
    ['/appointments', 'Objednávky'],
    ['/calls', 'Hovory'],
    ['/patients', 'Pacienti'],
    ['/settings', 'Nastavení'],
  ];
  return (
    <html lang="cs">
      <body>
        <div className="container">
          <h1 className="h1">Ordinace Klapala – Admin</h1>
          <nav className="top">
            {links.map(([href, label]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
