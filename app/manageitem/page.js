"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageItemPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/manageitem/products');
  }, [router]);

  return null;
}




// import { redirect } from "next/navigation";

// export default function ManageItemPage() {
//   redirect("/manageitem");
// }