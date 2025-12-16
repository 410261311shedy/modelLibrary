import React, { ReactNode } from "react";
import Image from "next/image";


const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main
            className="flex min-h-screen items-center 
        justify-center bg-cover bg-center bg-no-repeat"
        >
            <section className="bg-gray-900 rounded-[14px] pt-8 pr-8 pb-10 pl-8 shadow-md w-[448px] sm:px-8">
                <div className="flex flex-col items-center justify-between gap-2">
                    <Image
                        src="/icons/LogoSignIn.svg"
                        alt="GoMore logo"
                        width={89}
                        height={36}
                        className="object-contain"
                    />
                    <div className="space-y-2.5">
                        <h1 className="text-center text-2xl text-white">
                            Welcome Back
                        </h1>
                        <p className="text-zinc-400 font-normal text-sm leading-5 tracking-normal align-middle">
                            Log in to your account to continue
                        </p>
                    </div>
                    <div className="">
                    {children}
                    {/* <SocialAuthForm /> */}
                </div>
                </div>
                
                
            </section>
        </main>
    );
};

export default AuthLayout;
