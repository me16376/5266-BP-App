'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ModelTestRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const qs = searchParams.toString();
    const destination = qs ? `/job-solution-model-test/?${qs}` : '/job-solution-model-test/';
    router.replace(destination);
  }, [searchParams, router]);

  return (
    <div style={{ padding: '80px 20px', textAlign: 'center', color: '#047857', fontWeight: 600 }}>
      মডেল টেস্ট রুমে নিয়ে যাওয়া হচ্ছে...
    </div>
  );
}

export default function ModelTestPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px 20px', textAlign: 'center', color: '#047857' }}>লোড হচ্ছে...</div>}>
      <ModelTestRedirect />
    </Suspense>
  );
}
