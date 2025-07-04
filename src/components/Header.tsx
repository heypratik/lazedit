"use client";


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
            <a href="#features" className="text-white/70 hover:text-white transition-colors text-sm">
              Features
            </a>
            <a href="#pricing" className="text-white/70 hover:text-white transition-colors text-sm">
              Pricing
            </a>
            <a href="#demo" className="text-white/70 hover:text-white transition-colors text-sm">
              Examples
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10 text-sm"
            >
              Sign In
            </Button>
            <Button className="bg-white text-black hover:bg-white/90 font-medium text-sm px-6">
              Get Started
            </Button>
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
          <div className="md:hidden py-4 glass-strong mt-2">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-white/70 hover:text-white transition-colors text-sm">
                Features
              </a>
              <a href="#pricing" className="text-white/70 hover:text-white transition-colors text-sm">
                Pricing
              </a>
              <a href="#demo" className="text-white/70 hover:text-white transition-colors text-sm">
                Examples
              </a>
              <div className="flex flex-col space-y-2 pt-4">
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
