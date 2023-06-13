import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import './styles.css';

import logoImg from '../../assets/logo.jpg';

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="auth-container">
        <Link href="/">
          <Image src={logoImg} alt="Voltar à página principal" className="logo"/>
        </Link>
        
        {children}
    </main>
  )
}
