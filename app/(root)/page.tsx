//landing page
import React from 'react'
import BackgroundBlobs from "../../components/BackgroundBlobs"
import Image from 'next/image'
import { Link } from 'lucide-react';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/cards/ProjectCard';
const Home = () => {
  return (
    <div className='mt-20'>
      <div className="flex flex-col items-center gap-8">
        <Image src="/icons/GOMOREonly.svg" width={300} height={300} alt="GoMore Logo" className=""/>
        <Image src="/Connect More, Achieve More.svg" width={500 } height={500 } alt="Slogan" className=""/>
        <p className=' text-gray-500 text-[17px] font-almarai'>Build a 3D Model Community--Share Knowledge,Connect Partners</p>
        <div className='flex gap-5  '>
          <a href="/sign-up">  
            <button className='font-inter  bg-primary text-white text-sm px-[12px] py-[5px] rounded-lg hover:bg-red-500 transition'>Get Started</button>
          </a>
          <a href="/explore">
            <button className='font-inter bg-transparent text-white text-sm  border-1 px-[12px] py-[4px] rounded-lg hover:bg-gray-300 transition'>Explore</button>
          </a>
        </div>
      </div>

      <div className='flex flex-col items-center mt-15'>
        Animation part, using gsap React, format like vite official page
      </div>
      
      <div className='flex flex-col items-center gap-6 mt-10 '>
        <div className='items-center '>
            Query: "Building | Products | Elements | 2D Drawing"
        </div>
          <div>
            Query: "Newest | Hottest"
          </div>
          <div>
            <div>
              {/* Display area for model cards, reder 12 when first mounted */}
              <ProjectCard/>
            </div>  
            <div className='flex justify-center mt-4 mb-4 '>
              <button className='font-abeezee bg-transparent text-white text-sm  border-1 px-[12px] py-[4px] rounded-lg hover:bg-gray-300 transition'>Load More</button>
            </div>
          </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Home