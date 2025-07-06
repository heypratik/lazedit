import React from 'react';
import { FaArrowAltCircleRight } from "react-icons/fa";
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="mb-8 sm:mb-12">
          <div className='flex flex-col lg:flex-row items-start justify-between gap-6 sm:gap-8'>
            {/* Logo and Description */}
            <div className="flex-1 max-w-md">
              <div className="space-y-3 sm:space-y-4">
                <Logo />
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  🚀 From idea to image in seconds.<br />
                  Transform and create images with simple text commands. 
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm sm:text-base">⭐⭐⭐⭐⭐</span>
                  <span className="text-white text-sm sm:text-base">4.9/5</span>
                </div>
                <span className="text-white text-sm sm:text-base">
                  <span className="hidden sm:inline">| </span>Trusted by 1000+ businesses
                </span>
              </div>
            </div>

            {/* Referral Button */}
            <div className="w-full lg:w-auto">
              <button 
                className="relative w-full lg:w-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-5 lg:py-6 text-white font-semibold text-sm sm:text-base lg:text-lg rounded-xl overflow-hidden min-h-[64px] sm:min-h-[72px] lg:min-h-[80px] hover:scale-105 transition-transform duration-200 active:scale-95"
                style={{
                  backgroundImage: "url('/offer-bg.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: '#1f2937', // Fallback color
                }}
              >
                <span className="relative z-10 flex justify-between items-center gap-2 sm:gap-3">
                  <span className="flex-1 text-left lg:text-center">
                    Earn 30% for every referral
                  </span>
                  <FaArrowAltCircleRight 
                    className='flex-shrink-0' 
                    color='#fff' 
                    size={30}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Product */}
          <div>
            <h3 className="text-white font-medium mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide">
              Product
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white list-none !p-0 !ml-0">
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Examples
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-medium mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide">
              Resources
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white list-none !p-0  !ml-0">
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Templates
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Downloads
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-medium mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide">
              Company
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white list-none !p-0  !ml-0">
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-medium mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide">
              Support
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white list-none !p-0  !ml-0">
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-white/70 hover:text-white no-underline">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs sm:text-sm text-white/70 order-2 sm:order-1">
            © 2025 Lazy Edit. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm text-white/50 order-1 sm:order-2">
            <a href="#" className="hover:text-white transition-colors no-underline">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors no-underline">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors no-underline">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;