'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ExamsRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const qs = searchParams.toString();
    const destination = qs ? `/job-solution/?${qs}` : '/job-solution/';
    router.replace(destination);
  }, [searchParams, router]);

  return (
    <div style={{ padding: '80px 20px', textAlign: 'center', color: '#047857', fontWeight: 600 }}>
      জব সলিউশন পেজে নিয়ে যাওয়া হচ্ছে...
    </div>
  );
}

export default function ExamsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px 20px', textAlign: 'center', color: '#047857' }}>লোড হচ্ছে...</div>}>
      <ExamsRedirect />
    </Suspense>
  );
}
