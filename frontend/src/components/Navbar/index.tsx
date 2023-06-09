import Link from 'next/link';
import Image from 'next/image';

import './styles.css';

import logoImg from '@/assets/logo.jpg';

export default function Navbar() {
  let loggedIn = true;

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

          <li>
            <Link href="/order-cake" className="link">Encomendar Bolo</Link>
          </li>

          {loggedIn ? (
            <>
              <li>
                <Link href="/account" className="link">Minha Conta</Link>
              </li>
              <li>
                <Link href="/logout" className="link">Sair</Link>
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
