'use client'
import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { AuthContext } from '@/contexts/AuthContext';
import './styles.css';

import logoImg from '@/assets/logo.jpg';

export default function Navbar() {
  const { isAuthenticaded, user, signOut } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div>
        <Link href="/">
          <Image src={logoImg} alt="Página Inicial" className="navbar-logo"/>
        </Link>

        <ul className="navbar-links">
          <li>
            <Link href="/" className="link">Inicio</Link>
          </li>

          {
            user?.role != "admin" && user?.role != "manager" ? (
              <li>
                <Link href="/order-cake" className="link">Encomendar Bolo</Link>
              </li>
            ) : null
          }

          {isAuthenticaded ? (
            <>
              {
                user?.role == "admin" || user?.role == "manager" ? (
                  <li>
                    <Link href="/management" className="link">Gerenciamento de Pedidos</Link>
                  </li>
                ) : (
                  <li>
                    <Link href="/account" className="link">Minha Conta</Link>
                  </li>
                )
              }
              <li>
                <Link href="#" className="link" onClick={signOut}>Sair</Link>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className="link">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
