'use client'
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AuthContext } from '@/contexts/AuthContext';

export default function Account() {
  const { isAuthenticaded, user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if(!loading && !isAuthenticaded)
      router.push('/login');
  }, [loading]);

  return (
    <div>
      <h1>Minha conta</h1>
      {
        loading ? "Carregando..." : JSON.stringify(user, null, 2)
      }
    </div>
  )
}
