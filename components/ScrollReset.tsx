'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Reset scroll to top on any navigation or search change
    window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
}
