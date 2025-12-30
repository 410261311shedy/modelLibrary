import React, { ReactNode } from 'react'
import Navbarhead from '@/components/navbar/Navbarhead';
import BackgroundBlobs from '@/components/blobs/BackgroundBlobs';
const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <>
      <BackgroundBlobs/>
      <div style={{backdropFilter:'blur(100px)',}} className="flex flex-col justify-items-center min-h-screen relative z-20">
          <Navbarhead/>
        <main className='flex-grow'>
          {children}
        </main>
      </div>
    </>
  );
};

export default RootLayout