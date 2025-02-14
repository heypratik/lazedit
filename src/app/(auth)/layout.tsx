import React from 'react'

interface AuthLayoutProps {
    children: React.ReactNode;
    }

export default function AuthLayout({children}: AuthLayoutProps) {
  return (
    <div>
        <nav className='flex p-2'>
           
        </nav>
        {children}
    </div>
  )
}
