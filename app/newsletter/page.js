"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewsLetterPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/newsletter/TemplatesListPage');
  }, [router]);

  return null;
}
