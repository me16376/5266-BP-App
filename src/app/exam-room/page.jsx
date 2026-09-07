'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ExamRoomRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const query = searchParams.toString();
    const destination = query ? `/model-test?${query}` : '/model-test';
    router.replace(destination);
  }, [searchParams, router]);

  return (
    <div style={{ padding: '80px 20px', textAlign: 'center', color: '#047857', fontWeight: 600 }}>
      মডেল টেস্ট রুমে রিডাইরেক্ট করা হচ্ছে...
    </div>
  );
}

export default function ExamRoomPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px 20px', textAlign: 'center', color: '#047857' }}>লোড হচ্ছে...</div>}>
      <ExamRoomRedirect />
    </Suspense>
  );
}
