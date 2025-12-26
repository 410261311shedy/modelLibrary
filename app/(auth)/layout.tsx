import React, { ReactNode } from "react";
import Image from "next/image";
import SocialAuthForm from "@/components/forms/SocialAuthForm";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main
            className="flex grow items-center justify-center bg-cover bg-center bg-no-repeat"
        >
            <section className="bg-[#80A4D7] dark:bg-[#27272A] rounded-[14px] pt-8 pb-10 px-6 shadow-[8px_16px_13px_rgba(0,0,0,0.32),inset_2px_1px_10px_rgba(255,255,255,0.16),inset_-2px_-5px_7px_rgba(0,0,0,0.25)] w-[400px]">
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
                        <p className="text-zinc-400 font-normal text-sm leading-5 tracking-normal align-middle invert">
                            Log in to your account to continue
                        </p>
                    </div>
                    <div className="w-full">
                        {children}
                        <SocialAuthForm />
                    </div>
                </div>
                
                
            </section>
        </main>
    );
};

export default AuthLayout;
