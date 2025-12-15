'use client';
import React from 'react';
import { AuthForm } from '@/components/forms/AuthForms';

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
        onSubmit={async (values) => {
          // 這裡接你的註冊 API
          console.log("sign up values", values);

          return {success: true};
        }}
      />
    
  )
}

export default SignUp