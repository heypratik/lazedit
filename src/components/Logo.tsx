"use client";


import React, { useState, useRef, useEffect  } from 'react';
import Link from 'next/link';


const Logo = () => {
    const logoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const triggerSpin = () => {
      const duration = Math.random() * 2 + 1; // 1 - 3 seconds

      logo.style.animation = `spinOnce ${duration}s cubic-bezier(0.1, 0.9, 0.3, 1) forwards`;

      setTimeout(() => {
        if (logo) {
          logo.style.animation = 'none';
        }

        // Wait 5-10 sec before next spin
        const nextDelay = Math.random() * 5000 + 5000;
        setTimeout(triggerSpin, nextDelay);
      }, duration * 1000);
    };

    triggerSpin();
  }, []);
  return (
        <Link href="/" className='flex items-center space-x-4'>
                <img src="/icon-logo.png" alt="LazyEdit Logo" ref={logoRef} className="h-8 rotate-logo" />
                <img src="/text-logo.png" alt="LazyEdit Logo" className="h-7" />
        </Link>
  );
};

export default Logo;
