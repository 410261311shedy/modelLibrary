'use client';
import React from 'react';
import { AuthForm } from '@/components/forms/AuthForms';
import { success } from 'zod';
const SignIn = () => {
  return (
    
      <AuthForm 
        formType='SIGN_IN'
        defaultValues={{username: '', password: ''}}
        onSubmit={
          (data) => Promise.resolve({success:true,data})
          // async (values) => {
          // // 在這裡處理登入邏輯，例如呼叫 API
          // console.log('Sign In values:', values);
          // // 模擬成功登入
          // return { success: true };
           // }
        }
      />
    )
}

export default SignIn