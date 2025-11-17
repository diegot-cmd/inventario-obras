'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // No mostrar navbar en login y register
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 right-0 z-50 p-4">
      <button
        onClick={handleLogout}
        className="text-white hover:text-gray-300 transition-all p-3 rounded-full hover:bg-white/10 active:scale-95 shadow-lg backdrop-blur-sm"
        title="Cerrar Sesión"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </nav>
  );
}
