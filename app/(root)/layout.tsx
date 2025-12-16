import Footer from '@/components/Footer';
import React, { ReactNode } from 'react'

const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <main className='flex-grow'>
      {children}
    </main>
  );
};

export default RootLayout