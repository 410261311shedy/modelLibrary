//landing page
import React from 'react'
import BackgroundBlobs from "../../components/BackgroundBlobs"
import Image from 'next/image'
const Home = () => {
  return (
    <div className='mt-20'>
      <div className="flex flex-col items-center gap-8">
        <Image src="/icons/GOMOREonly.svg" width={300} height={300} alt="GoMore Logo" className=""/>
        <Image src="/Connect More, Achieve More.svg" width={500 } height={500 } alt="Slogan" className=""/>
        <p className=' text-gray-500 text-[17px]'>Build a 3D Model Community--Share Knowledge,Connect Partners</p>
        <div className='flex gap-6'>

        </div>
      </div>

      <div className='flex flex-col items-center'>
        Animation part, using gsap React, format like vite official page
      </div>
      
      <div className='flex flex-col items-center gap-6 mt-10'>
        <div className='items-center'>
            Query: "Building | Products | Elements | 2D Drawing"
        </div>
          <div>
            Query: "Newest | Hottest"
          </div>
          <div>
            <div>
              Display area for model cards, reder 12 when first mounted
            </div>
            <button>Load More</button>
          </div>
      </div>
    </div>
  );
}

export default Home