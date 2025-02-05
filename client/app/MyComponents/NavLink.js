'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink = ({ href, children, className }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? 'bg-slate-100' : '' }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
