"use client"

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CallNavbar from '@/components/dashboard/callnavbar';
import React, { useEffect } from 'react';

const ClientComponent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (status === "unauthenticated") {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Access the client's name
  const clientName = session?.user?.name || 'Guest';

  return (
    <CallNavbar>
      <div>
        <h1>Welcome, {clientName}</h1>
      </div>
      {/* Additional components or content can be added here */}
    </CallNavbar>
  );
}

export default ClientComponent;
