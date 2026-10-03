'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FileToolsIndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/file-exam');
  }, [router]);

  return null;
}

