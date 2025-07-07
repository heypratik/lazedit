import React from 'react';
import { Button } from '@/components/ui/button';
import Comparison from '@/components/Comparison';

const Pricing = () => {
  return (
    <section id="pricing" className="py-12 md:py-20 px-4 md:px-6 lg:px-8 relative">
       <div className="absolute inset-0 pattern-dots opacity-20"></div>
      <div className="absolute inset-0 pattern-grid opacity-10"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-3 md:mb-4 text-white">
            💸 Simple Pricing
          </h2>
          <p className="text-base md:text-lg text-white px-4 md:px-0">
            Start now, scale when you conquer the world 🌍
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Individual Plan */}
          <div className="glass p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl relative !border-2 !border-orange-500 group transition-transform duration-300">
            <div className="absolute -top-2 md:-top-3 left-4 md:left-6">
              <span className="bg-white text-black px-2 md:px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full">
                🔥 Hot Deal
              </span>
            </div>
            
            <div className="text-center">
              <div className="mb-4 md:mb-6">
                <div className="text-3xl md:text-4xl mb-2">🎯</div>
                <h3 className="text-lg md:text-xl font-medium text-white mb-3 md:mb-4">Individual</h3>
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-2">
                  <span className="text-lg md:text-2xl text-white/50 line-through">$29</span>
                  <span className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">$16</span>
                  <span className="text-white/70 text-sm md:text-base">/month</span>
                </div>
                <p className="text-white/60 text-xs md:text-sm">Save $108/year 💰</p>
              </div>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-left">
                <div className="flex items-start text-white text-sm md:text-base">
                  <span className="text-white mr-2 md:mr-3 mt-0.5 flex-shrink-0">✅</span>
                  <span>350 AI image edits per month</span>
                </div>
                <div className="flex items-start text-white text-sm md:text-base">
                  <span className="text-white mr-2 md:mr-3 mt-0.5 flex-shrink-0">⚡</span>
                  <span>All AI editing features</span>
                </div>
                <div className="flex items-start text-white text-sm md:text-base">
                  <span className="text-white mr-2 md:mr-3 mt-0.5 flex-shrink-0">📸</span>
                  <span>High-resolution exports</span>
                </div>
                <div className="flex items-start text-white text-sm md:text-base">
                  <span className="text-white mr-2 md:mr-3 mt-0.5 flex-shrink-0">🚀</span>
                  <span>Priority processing</span>
                </div>
                <div className="flex items-start text-white text-sm md:text-base">
                  <span className="text-white mr-2 md:mr-3 mt-0.5 flex-shrink-0">🔧</span>
                  <span>Custom integrations</span>
                </div>
              </div>
              
              <button className="relative text-sm md:text-base px-6 md:px-8 py-3 w-full text-center font-medium bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 overflow-hidden rounded-lg">
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
                <span className="relative z-10 text-center justify-center text-white font-semibold flex items-center gap-2">
                  START NOW
                </span>
              </button>
            </div>
          </div>

          {/* Team Plan */}
          <div className="glass p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl relative border group transition-transform duration-300">
            <div className="text-center">
              <div className="mb-4 md:mb-6">
                <div className="text-3xl md:text-4xl mb-2">👥</div>
                <h3 className="text-lg md:text-xl font-medium text-white mb-3 md:mb-4">Team</h3>
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-2">
                  <span className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">$59</span>
                  <span className="text-white/70 text-sm md:text-base">/month</span>
                </div>
                <p className="text-white/60 text-xs md:text-sm">Per team (up to 5 users)</p>
              </div>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-left">
                <div className="flex items-start text-white text-sm md:text-base">
                  <span className="text-white mr-2 md:mr-3 mt-0.5 flex-shrink-0">♾️</span>
                  <span>5X more image edits</span>
                </div>
                <div className="flex items-start text-white text-sm md:text-base">
                  <span className="text-white mr-2 md:mr-3 mt-0.5 flex-shrink-0">🤝</span>
                  <span>Team collaboration tools</span>
                </div>
                <div className="flex items-start text-white text-sm md:text-base">
                  <span className="text-white mr-2 md:mr-3 mt-0.5 flex-shrink-0">⚙️</span>
                  <span>API access</span>
                </div>
                <div className="flex items-start text-white text-sm md:text-base">
                  <span className="text-white mr-2 md:mr-3 mt-0.5 flex-shrink-0">💬</span>
                  <span>Priority support</span>
                </div>
                <div className="flex items-start text-white text-sm md:text-base">
                  <span className="text-white mr-2 md:mr-3 mt-0.5 flex-shrink-0">🔧</span>
                  <span>Custom integrations</span>
                </div>
              </div>
              
              <button className="relative text-sm md:text-base px-6 md:px-8 py-3 w-full text-center font-medium bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 overflow-hidden rounded-lg">
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
                <span className="relative z-10 text-center justify-center text-white font-semibold flex items-center gap-2">
                  CONTACT US
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-white text-xs md:text-sm px-4 md:px-0">
            24/7 support 💪 • No setup fees 🚫 • Cancel anytime ✨
          </p>
        </div>
      </div>
    <Comparison />
    </section>
  );
};

export default Pricing;