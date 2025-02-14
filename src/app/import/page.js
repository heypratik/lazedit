import React from 'react'
import CSVImporter from './CSV';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // Adjust path as needed

async function getStore(userId) {
  if (!userId) {
    return null;
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/settings/get`, {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
  const data = await response.json();
  return data.store;
}


async function Page() {
  const session = await getServerSession(authOptions);
  const store = await getStore(session?.user?.id ? session.user.id : null);
  return (
    <>
    <CSVImporter session={session} store={store} />
    </>
  )
}

export default Page