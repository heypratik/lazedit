"use client";


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoArrowForwardOutline } from 'react-icons/io5';
import Logo from './Logo';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 glass-strong">
      <div className="max-w-7xl mx-auto section-padding relative z-10">
        <div className="flex items-center justify-between h-16 px-4">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white no-underline hover:text-white transition-colors text-sm">
              Features
            </a>
            <a href="#pricing" className="text-white no-underline hover:text-white transition-colors text-sm">
              Pricing
            </a>
            <a href="/blogs" className="text-white no-underline hover:text-white transition-colors text-sm">
              Blogs
            </a>
            {/* <a href="/all-tools" className="text-white no-underline hover:text-white transition-colors text-sm">
              All Tools
            </a> */}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10 text-sm"
            >
              Sign In
            </Button>
            {/* <Button className="bg-white text-black hover:bg-white/90 font-medium text-sm px-6">
              Get Started
            </Button> */}
                        <button className="relative text-sm md:text-base px-4 md:px-4 py-2 md:py-2 font-medium border-orange-500 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 overflow-hidden w-full sm:w-auto max-w-xs sm:max-w-none">
                          {/* Noise texture overlay */}
                          <div 
                            className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
                            style={{
                              backgroundImage: 'url(/noise.webp)',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          ></div>
                          {/* Button text */}
                          <span className="relative z-10 text-white font-semibold text-sm md:text-sm flex items-center justify-center gap-2">
                            GET STARTED <IoArrowForwardOutline />
                          </span>
                        </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-5 h-5 flex flex-col justify-center space-y-1">
              <span className="w-full h-0.5 bg-white"></span>
              <span className="w-full h-0.5 bg-white"></span>
              <span className="w-full h-0.5 bg-white"></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden p-4 glass-strong mt-2 ">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-white no-underline hover:text-white transition-colors text-sm">
                Features
              </a>
              <a href="#pricing" className="text-white no-underline hover:text-white transition-colors text-sm">
                Pricing
              </a>
              <a href="#demo" className="text-white no-underline hover:text-white transition-colors text-sm">
                Examples
              </a>
              <div className="flex flex-col space-y-2 pt-0 mt-0">
                <Button variant="ghost" className="text-white/70 hover:text-white text-sm">
                  Sign In
                </Button>
                <Button className="bg-white text-black hover:bg-white/90 text-sm">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
