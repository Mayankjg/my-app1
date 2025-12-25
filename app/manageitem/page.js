
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageItemPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/manageitem/categories');
  }, [router]);

  return null;
}