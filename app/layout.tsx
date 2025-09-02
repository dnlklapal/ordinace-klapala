import './globals.css'
import Link from 'next/link'

export const metadata = { title: 'Ordinace Klapala – Admin', description: 'Interní přehled' }

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/appointments', label: 'Objednávky' },
  { href: '/calls', label: 'Hovory' },
  { href: '/patients', label: 'Pacienti' },
  { href: '/settings', label: 'Nastavení' },
] as const

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <div className="container">
          <h1 className="h1">Ordinace Klapala – Admin</h1>
          <nav className="top">
            {links.map((item) => (
              <Link key={item.href} href={item.href as any}>
                {item.label}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </body>
    </html>
  )
}
