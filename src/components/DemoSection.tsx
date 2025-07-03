import React from 'react';
import { Button } from '@/components/ui/button';

const DemoSection = () => {
  return (
    <section id="demo" className="py-20 section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium mb-4 text-white">
            See It In Action
          </h2>
          <p className="text-lg text-white/70">
            Watch how simple commands create professional results
          </p>
        </div>

        {/* Video Placeholder - Modern design */}
        <div className="glass-strong p-8 mb-12">
          <div className="aspect-video bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 pattern-dots opacity-20"></div>
            <div className="text-center z-10">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="w-0 h-0 border-l-6 border-l-white border-y-4 border-y-transparent ml-1"></div>
              </div>
              <h3 className="text-xl font-medium text-white mb-4">
                Demo Video
              </h3>
              <p className="text-white/70 mb-6 text-sm">
                See real-time AI editing in action
              </p>
              <Button 
                className="bg-white text-black hover:bg-white/90 font-medium"
                size="sm"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Command Examples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-white/10 flex items-center justify-center text-2xl">
              🎨
            </div>
            <h3 className="text-base font-medium text-white mb-2">
              Style Transfer
            </h3>
            <p className="text-white/60 text-sm">
              "Make it look vintage"
            </p>
          </div>
          
          <div className="glass p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-white/10 flex items-center justify-center text-2xl">
              ✂️
            </div>
            <h3 className="text-base font-medium text-white mb-2">
              Object Removal
            </h3>
            <p className="text-white/60 text-sm">
              "Remove the person"
            </p>
          </div>
          
          <div className="glass p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-white/10 flex items-center justify-center text-2xl">
              🌟
            </div>
            <h3 className="text-base font-medium text-white mb-2">
              Enhancement
            </h3>
            <p className="text-white/60 text-sm">
              "Make colors pop"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
