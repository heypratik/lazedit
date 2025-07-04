"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { IoArrowForwardOutline } from "react-icons/io5";
import People from './People';

// Sample images for the infinite scroll
const sampleImages = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551836022-aadb801c60ae?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?w=400&h=300&fit=crop"
];

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center section-padding pt-16 md:pt-20 pb-8 md:pb-12 relative overflow-hidden">
      {/* Complex background patterns */}
      <div className="absolute inset-0 pattern-dots opacity-20"></div>
      <div className="absolute inset-0 pattern-grid opacity-10"></div>
      
      {/* Floating orbs with responsive sizes and positions */}
      <div className="absolute top-10 md:top-20 left-4 md:left-10 w-16 md:w-32 h-16 md:h-32 bg-white/10 rounded-full blur-xl md:blur-3xl animate-pulse"></div>
      <div className="absolute bottom-16 md:bottom-32 right-8 md:right-16 w-24 md:w-48 h-24 md:h-48 bg-white/5 rounded-full blur-xl md:blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-32 md:w-64 h-32 md:h-64 bg-white/3 rounded-full blur-xl md:blur-3xl animate-pulse delay-500"></div>
      <div className="absolute top-16 md:top-32 right-8 md:right-32 w-12 md:w-20 h-12 md:h-20 bg-white/8 rounded-full blur-xl md:blur-2xl animate-pulse delay-700"></div>
      <div className="absolute bottom-10 md:bottom-20 left-1/4 w-18 md:w-36 h-18 md:h-36 bg-white/6 rounded-full blur-xl md:blur-3xl animate-pulse delay-300"></div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      
      <div className="max-w-full w-full mx-auto relative z-10 flex-1 flex items-center">
        <div className="text-center space-y-4 md:space-y-6 w-full px-4 md:px-0">
          <div className="space-y-3 md:space-y-4 mt-12 md:mt-20">
            <span className='inline-block p-2 md:p-1 glass-strong rounded-full text-white text-xs md:text-sm'>
              ⚡What took you 3 weeks, AI does in 3 words 
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              <span className="text-white">🔥 FIRE YOUR GRAPHIC DESIGNER TODAY</span>
              <br />
            </h1>
            
            <p className="text-base md:text-lg text-white/70 mx-auto leading-relaxed max-w-2xl px-4 md:px-0">
              🚀 Transform and create images with simple text commands.<br className="hidden md:block" />
              <span className="md:hidden"> </span>No complex tools, no learning curve, no expensive designers.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 md:pt-0">
            <button className="relative text-sm md:text-base px-6 md:px-8 py-3 md:py-3 font-medium bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 overflow-hidden w-full sm:w-auto max-w-xs sm:max-w-none">
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
              <span className="relative z-10 text-white font-semibold text-base md:text-lg flex items-center justify-center gap-2">
                Start Creating Now <IoArrowForwardOutline />
              </span>
            </button>
          </div>

          <People />

          {/* Infinite Image Scroll Section */}
          <div className="w-full mt-8 md:mt-12 relative">
            {/* Infinite scroll container - full width */}
            <div className="relative overflow-hidden w-full carousel-container">
              {/* Gradient fade effects - hidden on mobile for better visibility */}
              {/* <div className="absolute left-0 top-0 w-8 md:w-16 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none hidden md:block"></div> */}
              {/* <div className="absolute right-0 top-0 w-8 md:w-16 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none hidden md:block"></div> */}
              
              {/* Scrolling images container */}
              <div className="flex gap-2 md:gap-4 infinite-scroll">
                {/* Create enough duplicates for seamless scrolling */}
                {[...Array(3)].map((_, setIndex) => (
                  <React.Fragment key={setIndex}>
                    {sampleImages.map((image, index) => (
                      <div key={`${setIndex}-${index}`} className="image-container glass-strong rounded-2 p-[4px] md:p-[6px] shadow-lg">
                        <img
                          src={image}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-full object-cover rounded-2 shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for infinite scroll animation */}
      <style jsx>{`
        /* Full width carousel that shows 5 images on desktop */
        .carousel-container {
          width: 100%;
        }
        
        .image-container {
          flex: none;
          width: calc((100vw - 8rem) / 5 - 1rem); /* 5 images with gaps, accounting for padding */
          height: 25rem;
          min-width: 12rem; /* Minimum size */
        }
        
        .infinite-scroll {
          animation: scroll 40s linear infinite;
          width: fit-content;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-33.333% - 1.333rem));
          }
        }
        
        /* Pause animation on hover for better UX */
        .infinite-scroll:hover {
          animation-play-state: paused;
        }
        
        /* Tablet: 2 images taking full width with 50% increased height */
        @media (max-width: 768px) {
          .image-container {
            width: calc((100vw - 4rem) / 2 - 0.5rem);
            height: 18rem; /* Increased from 12rem by 50% */
            min-width: 10rem;
          }
        }
        
        /* Mobile: 1 image taking most of the width with 50% increased height */
        @media (max-width: 480px) {
          .image-container {
            width: calc(100vw - 4rem); /* Reduced padding for better mobile fit */
            height: 15rem; /* Increased from 10rem by 50% */
            min-width: 16rem;
          }
          
          .infinite-scroll {
            animation: scroll 30s linear infinite; /* Slightly faster on mobile */
          }
        }
        
        /* Extra small mobile devices */
        @media (max-width: 360px) {
          .image-container {
            width: calc(100vw - 2rem);
            height: 14rem;
            min-width: 14rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;