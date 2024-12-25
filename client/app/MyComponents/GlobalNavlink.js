'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GNavLink = ({ href, children, className }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? 'text-blue-500' : '' }`}
    >
      {children}
    </Link>
  );
};

export default GNavLink;
