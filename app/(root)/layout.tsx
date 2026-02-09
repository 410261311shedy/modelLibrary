import React, { ReactNode } from 'react'
import Navbarhead from '@/components/navbar/Navbarhead';
import BackgroundBlobs from '@/components/blobs/BackgroundBlobs';
const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <>
      <BackgroundBlobs/>
      <div className="flex flex-col backdrop-blur-[100px] justify-items-center min-h-screen relative z-20">
          <Navbarhead/>
        <main className='grow'>
          {children}
        </main>
      </div>
    </>
  );
};

export default RootLayout