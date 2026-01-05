'use client'
import React from 'react'
import { signOut } from 'next-auth/react';

const LogoutButton = () => {
    
    return (
        <button
            onClick={ () => {signOut({redirectTo:"/sign-in"})} }
            aria-label="Log out"
        >
            Log out
        </button>
    );
}

export default LogoutButton