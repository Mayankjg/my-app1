"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageItemPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/manageitem/products');
    // router.push('/manageitem/categories');
    // router.push('/manageitem/lead-source');
    // router.push('/manageitem/lead-status');
  }, [router]);

  return null;
}