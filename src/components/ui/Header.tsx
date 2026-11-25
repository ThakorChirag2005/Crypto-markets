'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="main-container site-header-inner">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h4l3-7 4 14 3-7h4" />
            </svg>
          </span>
          <span>CoinPulse</span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <Link
            href="/"
            className={cn('nav-link', {
              'is-active': pathname === '/',
            })}
          >
            Home
          </Link>

          <Link href="/#coin-search" className="nav-link hidden sm:inline-flex">
            Search
          </Link>

          <Link
            href="/coins"
            className={cn('nav-link', {
              'is-active': pathname === '/coins' || pathname.startsWith('/coins/'),
            })}
          >
            Markets
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
