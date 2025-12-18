//landing page
'use client';
import React from 'react'
import BackgroundBlobs from "../../components/BackgroundBlobs"
import Image from 'next/image'
import {Building, Boxes,Box,FileBox} from 'lucide-react';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/cards/ProjectCard';
const Home = () => {
  return (
    <div className='mt-20'>
      <div className="flex flex-col items-center gap-8">
        <Image src="/icons/GOMOREonly.svg" width={300} height={300} alt="GoMore Logo" className=""/>
        <Image src="/Connect More, Achieve More.svg" width={500 } height={500 } alt="Slogan" className="invert dark:invert-0"/>
        <p className="text-[#5B5B5B] dark:text-[#BEBEBE] text-[17px] font-almarai">Build a 3D Model Community--Share Knowledge,Connect Partners</p>
        <div className='flex gap-5  '>
          <a href="/sign-up">  
            <button className='font-inter  bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-red-500 transition'>Get Started</button>
          </a>
          <a href="/explore">
            <button className='font-inter font-semibold bg-transparent text-[#3C3C3C] dark:text-white text-sm  border-1.5 px-4 py-[7px] rounded-lg hover:bg-gray-300 transition'>Explore</button>
          </a>
        </div>
      </div>

      <div className='flex flex-col items-center mt-15'>
        Animation part, using gsap React, format like vite official page
      </div>
      
      <div className='flex flex-col items-center gap-6 mt-10 '>
        <div className='px-5 flex justify-between gap-5 items-center border-2 w-full border-red-500'>
          {/*text-transparent bg-gradient-to-r from-primary-400 to-secondary-400 */}
          <button onClick={() => {}} className='flex flex-col justify-center items-center gap-2 border-1 border-[#B8B8B8] rounded-[8px] h-[120px] w-[200px] hover:cursor-pointer font-abeezee text-sm text-[#B8B8B8]'>
              <Building 
                height={40}
                width={40}
                className=''
                />
              <p>Buildings</p>
          </button>
          <button onClick={() => {}} className='flex flex-col justify-center items-center gap-2 border-1 border-[#B8B8B8] rounded-[8px] h-[120px] w-[200px] hover:cursor-pointer font-abeezee text-sm text-[#B8B8B8]'>
              <Boxes 
                height={40}
                width={40}
                className=''
                />
              <p>Products</p>
          </button>
          <button onClick={() => {}} className='flex flex-col justify-center items-center gap-2 border-1 border-[#B8B8B8] rounded-[8px] h-[120px] w-[200px] hover:cursor-pointer font-abeezee text-sm text-[#B8B8B8]'>
              <Box
                height={40}
                width={40}
                className=''
                />
              <p>Elements</p>
          </button>
          <button onClick={() => {}} className='flex flex-col justify-center items-center gap-2 border-1 border-[#B8B8B8] rounded-[8px] h-[120px] w-[200px] hover:cursor-pointer font-abeezee text-sm text-[#B8B8B8]'>
              <FileBox 
                height={40}
                width={40}
                className=''
                />
              <p>2D Drawings</p>
          </button>
        </div>
          <div>
            Query: "Newest | Hottest"
          </div>
          <div>
            <div className='flex gap-3'>
              {/* Display area for model cards, reder 12 when first mounted */}
              <ProjectCard/>
              <ProjectCard/>
              <ProjectCard/>
            </div>  
            <div className='flex justify-center mt-4 mb-4 '>
              <button className='font-abeezee bg-transparent text-[#3C3C3C] dark:text-white border-1.5 px-[12px] py-[4px] rounded-lg hover:bg-gray-300 transition'>
                Load More
              </button>
            </div>
          </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Home