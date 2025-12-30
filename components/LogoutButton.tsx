'use client'
import React from 'react'
import { signOut } from 'next-auth/react';

const LogoutButton = () => {
    
    return (
        <button onClick={ () => {signOut({redirectTo:"/sign-in"})}
        }>
            Log out
        </button>
    );
}

export default LogoutButton