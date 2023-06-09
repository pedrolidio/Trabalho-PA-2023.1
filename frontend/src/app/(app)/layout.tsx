import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';

import './styles.css';

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <main className="container">
      <Navbar />
      
      <div className="app-container">
      {children}
      </div>
    </main>
  )
}
