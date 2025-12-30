'use client'
import React from 'react';
import SidebarUpload from '@/components/sidebar/SidebarUpload';
import { useState } from 'react';
import SidebarBlobs from '@/components/blobs/SidebarBlobs';

const Upload = () => {
    const [step,setStep] = useState(1);
    //let the children component call setStep
    const handleNextButton = () => setStep((next)=>Math.min(next + 1,3));
    const handleBackButton = () => setStep((prev)=>Math.max(prev - 1,1));
    return (
    <div className='min-h-screen  relative'>
        <div className='flex w-full min-h-screen gap-4 p-2 '>
            <div className='relative overflow-hidden rounded-lg border-[5px] border-[#FFFFFF29]'>
                    <SidebarBlobs/>
                    {/* 建立一個絕對定位的層，專門放陰影，並確保它在背景之上 */}
                    <div className='absolute inset-0 pointer-events-none shadow-[inset_0px_0px_27.1px_0px_#000000] z-10'/>
                        <SidebarUpload 
                            currentStep={step}
                            onNext={handleNextButton}
                            onBack={handleBackButton}
                            />
            </div>
            <div className='border-3 border-green-500 flex-grow'>
                {step === 1 && <div>Model Upload</div>}
                {step === 2 && <div>Cover Selection</div>}
                {step === 3 && <div>Metadata</div>}
            </div>
        </div>
    </div>  
    );
}

export default Upload