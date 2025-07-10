import React from 'react';
import Link from 'next/link';

const Comparison = () => {
  const comparisons = [
    {
      feature: "⏱️ Learning Curve",
      traditional: "❌ Weeks to master",
      lazyEdit: "✅ 5 minutes to start"
    },
    {
      feature: "⚡ Edit Time",
      traditional: "❌ 30+ minutes per image",
      lazyEdit: "✅ < 10 seconds"
    },
    {
      feature: "🔄 Custom integrations",
      traditional: "❌ Manual",
      lazyEdit: "✅ Automated with all major tools"
    },
    {
      feature: "💰 Cost",
      traditional: "❌ $50+/month subscriptions",
      lazyEdit: "✅ $20/month, 300 edits"
    },
    {
      feature: "✨ Quality",
      traditional: "❌ Depends on skill level",
      lazyEdit: "✅ Consistently professional"
    }
  ];

  return (
    <section className="py-8 md:py-12 lg:py-16 relative !pb-0">
      <div className="absolute inset-0 pattern-dots opacity-10"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-3 md:mb-4 text-white">
            🆚 Old Way vs LazyEdit
          </h2>
          <p className="text-base md:text-lg text-white px-4 md:px-0">
            See why thousands are making the switch
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Old Way Box */}
          <div className="glass p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl relative border group transition-transform duration-300">
            <div className="text-center">
              <div className="mb-4 md:mb-6">
                <div className="text-3xl md:text-4xl mb-2">😴</div>
                <h3 className="text-lg md:text-xl font-medium text-white/70 mb-3 md:mb-4">Old Way</h3>
                <p className="text-white/50 text-xs md:text-sm">Traditional editing workflow</p>
              </div>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-left">
                {comparisons.map((item, index) => (
                  <div key={index} className="flex items-start text-white/60 text-sm md:text-base bg-red-500/5 p-3 rounded-lg">
                    <span className="text-white/40 mr-2 md:mr-3 mt-0.5 flex-shrink-0">
                      {item.feature.split(' ')[0]}
                    </span>
                    <div>
                      <div className="text-white/70 font-medium text-xs md:text-sm mb-1">
                        {item.feature.substring(item.feature.indexOf(' ') + 1)}
                      </div>
                      <div className="text-white/60 text-xs md:text-sm">
                        {item.traditional}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/auth">
              <button className="relative text-sm md:text-base px-6 md:px-8 py-3 w-full text-center font-medium bg-red-500/5 overflow-hidden rounded-lg">
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
                  😞 Slow & Expensive
                </span>
              </button>
              </Link>
            </div>
          </div>

          {/* LazyEdit Box */}
          <div className="glass p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl relative !border-2 !border-orange-500 group transition-transform duration-300">
            <div className="absolute -top-2 md:-top-3 left-4 md:left-6">
              <span className="bg-orange-500 text-white px-2 md:px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full">
                ⚡ Better Choice
              </span>
            </div>
            
            <div className="text-center">
              <div className="mb-4 md:mb-6">
                <div className="text-3xl md:text-4xl mb-2">🚀</div>
                <h3 className="text-lg md:text-xl font-medium text-white mb-3 md:mb-4">With LazyEdit</h3>
                <p className="text-white/70 text-xs md:text-sm">AI-powered editing solution</p>
              </div>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-left">
                {comparisons.map((item, index) => (
                  <div key={index} className="flex items-start text-white text-sm md:text-base glass-strong p-3 rounded-lg border-0 border-white/20 hover:bg-white/10 transition-colors">
                    <span className="text-green-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0">
                      {item.feature.split(' ')[0]}
                    </span>
                    <div>
                      <div className="text-white font-medium text-xs md:text-sm mb-1">
                        {item.feature.substring(item.feature.indexOf(' ') + 1)}
                      </div>
                      <div className="text-white/90 text-xs md:text-sm font-medium">
                        {item.lazyEdit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/auth">
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
                  START WITH LAZYEDIT
                </span>
              </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-white/70 text-xs md:text-sm px-4 md:px-0">
            Join thousands who've already made the switch 🎯 • Save 70% time • 10X faster results
          </p>
        </div>
      </div>
    </section>
  );
};

export default Comparison;