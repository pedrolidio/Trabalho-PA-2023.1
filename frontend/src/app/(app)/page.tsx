import Image from 'next/image';
import { FiInstagram } from 'react-icons/fi'

import photo1 from '@/assets/home-photo-1.jpg';
import photo2 from '@/assets/home-photo-2.jpg';
import photo3 from '@/assets/home-photo-3.jpg';

export default function Home() {
  return (
    <div className="home-container">
      <h1>Eliane Perrut - Sweet Cake</h1>
      <hr className="horizontal-separator"/>
      <div className="photos-container">
        <div className="crop">
          <Image src={photo1} alt="Bolo de exemplo" className="home-photos"/>
        </div>

        <div className="crop">
          <Image src={photo2} alt="Bolo de exemplo" className="home-photos"/>
        </div>

        <div className="crop">
          <Image src={photo3} alt="Bolo de exemplo" className="home-photos"/>
        </div>
      </div>

      <hr className="horizontal-separator"/>
      
      <a href="https://www.instagram.com/elianeperrutcakes/" target="_blank" rel="noopener noreferrer" className="link">
        <FiInstagram size={16} color="#F48192"/>
        <p>Siga nosso instagram para ver mais doçuras!</p>
      </a>
      
    </div>
  )
}
