'use client';
import React from 'react';
import { AuthForm } from '@/components/forms/AuthForms';
import { success } from 'zod';

const SignUp = () => {
  return (
    
      <AuthForm
        formType="SIGN_UP"
        defaultValues={{
          username: "",
          name: "",
          email: "",
          password: "",
        }}
        onSubmit={
          (data) => Promise.resolve({success:true,data})
        }
      />
    
  )
}

export default SignUp