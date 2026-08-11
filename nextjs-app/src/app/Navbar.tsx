"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/settings', label: 'Settings' },
    { href: '/profile', label: 'Profile' },
    { href: '/health-check', label: 'Health Check' },
  ];

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex flex-col md:flex-row gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-white hover:text-gray-300 ${
              pathname === link.href ? 'font-bold underline' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}