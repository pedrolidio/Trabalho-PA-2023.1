'use client'
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import CakeForm from '@/components/CakeForm';
import { AuthContext } from '@/contexts/AuthContext';

import './styles.css';

import cake1 from '@/assets/cake1.jpg';

export const metadata = {
  title: 'Encomendar Bolo - Eliane Perrut ♡ Sweet Cake',
}

export default function OrderCake() {
  const { isAuthenticaded, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if(!loading && !isAuthenticaded)
      router.push('/login');
  }, [loading]);

  return (
    <div className="order-cake-container">
      <div className="left-container">
        <h1>Monte o seu bolo!</h1>
        <Image src={cake1} alt="Bolo de exemplo" className="cake-sample"/>
        <p>* Entraremos em contato para conversar os detalhes da decoração e entrega.</p>
      </div>
      <CakeForm />
    </div>
  )
}
