'use client';
import React from 'react';
import { AuthForm } from '@/components/forms/AuthForms';
import { signUpWithCredentials } from '@/lib/actions/auth.action';

const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      defaultValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      // 呼叫註冊 Server Action
      onSubmit={signUpWithCredentials}
    />
    
  )
}

export default SignUp