import React from 'react';
import { Button } from '@/components/ui/button';
import Comparison from '@/components/Comparison';

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 section-padding relative">
       <div className="absolute inset-0 pattern-dots opacity-20"></div>
      <div className="absolute inset-0 pattern-grid opacity-10"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium mb-4 text-white">
            💸 Simple Pricing
          </h2>
          <p className="text-lg text-white/70">
            Start now, scale when you conquer the world 🌍
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Individual Plan */}
          <div className="glass p-8 rounded-2xl relative !border-2 !border-orange-500 group scale-105 hover:scale-105 transition-transform duration-300">
            <div className="absolute -top-3 left-6">
              <span className="bg-white text-black px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full">
                🔥 Hot Deal
              </span>
            </div>
            
            <div className="text-center">
              <div className="mb-6">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="text-xl font-medium text-white mb-4">Individual</h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl text-white/50 line-through">$29</span>
                  <span className="text-6xl font-bold text-white">$20</span>
                  <span className="text-white/70">/month</span>
                </div>
                <p className="text-white/60 text-sm">Save $108/year 💰</p>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start text-white/80">
                  <span className="text-white mr-3 mt-0.5">✅</span>
                  <span>300 image edits per month</span>
                </div>
                <div className="flex items-start text-white/80">
                  <span className="text-white mr-3 mt-0.5">⚡</span>
                  <span>All AI editing features</span>
                </div>
                <div className="flex items-start text-white/80">
                  <span className="text-white mr-3 mt-0.5">📸</span>
                  <span>High-resolution exports</span>
                </div>
                <div className="flex items-start text-white/80">
                  <span className="text-white mr-3 mt-0.5">🚀</span>
                  <span>Priority processing</span>
                </div>
                <div className="flex items-start text-white/80">
                  <span className="text-white mr-3 mt-0.5">🔧</span>
                  <span>Custom integrations</span>
                </div>
              </div>
              
                          <button className="relative text-base px-8 py-3 w-full text-center font-medium bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 overflow-hidden ">
                          {/* Noise texture overlay */}
                          <div 
                            className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
                            style={{
                              backgroundImage: 'url(https://assets.aceternity.com/noise.webp)',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          ></div>
                          {/* Button text */}
                          <span className="relative z-10 text-center justify-center text-white font-semibold text-base flex items-center gap-2">
                            START NOW
                          </span>
                        </button>
            </div>
          </div>

          {/* Team Plan */}
          <div className="glass p-8 rounded-2xl relative border group hover:scale-105 transition-transform duration-300">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-4xl mb-2">👥</div>
                <h3 className="text-xl font-medium text-white mb-4">Team</h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-6xl font-bold text-white">$99</span>
                  <span className="text-white/70">/month</span>
                </div>
                <p className="text-white/60 text-sm">Per team (up to 10 users)</p>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start text-white/80">
                  <span className="text-white mr-3 mt-0.5">♾️</span>
                  <span>10X more image edits</span>
                </div>
                <div className="flex items-start text-white/80">
                  <span className="text-white mr-3 mt-0.5">🤝</span>
                  <span>Team collaboration tools</span>
                </div>
                <div className="flex items-start text-white/80">
                  <span className="text-white mr-3 mt-0.5">⚙️</span>
                  <span>API access</span>
                </div>
                <div className="flex items-start text-white/80">
                  <span className="text-white mr-3 mt-0.5">💬</span>
                  <span>Priority support</span>
                </div>
                <div className="flex items-start text-white/80">
                  <span className="text-white mr-3 mt-0.5">🔧</span>
                  <span>Custom integrations</span>
                </div>
              </div>
              
              <button className="relative text-base px-8 py-3 w-full text-center font-medium bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 overflow-hidden ">
                          {/* Noise texture overlay */}
                          <div 
                            className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
                            style={{
                              backgroundImage: 'url(https://assets.aceternity.com/noise.webp)',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          ></div>
                          {/* Button text */}
                          <span className="relative z-10 text-center justify-center text-white font-semibold text-base flex items-center gap-2">
                            CONTACT US
                          </span>
                        </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-white/60 text-sm">
            24/7 support 💪 • No setup fees 🚫 • Cancel anytime ✨
          </p>
        </div>
      </div>
    <Comparison />
    </section>
  );
};

export default Pricing;