import React from 'react';

const ExampleImages = () => {
  const examples = [
    {
      before: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop",
      after: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=200&fit=crop",
      command: "Remove background and enhance colors"
    },
    {
      before: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
      after: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop",
      command: "Add vintage filter and adjust brightness"
    },
    {
      before: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=200&fit=crop",
      after: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
      command: "Crop to square and sharpen details"
    }
  ];

  return (
    <section className="py-20 section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium mb-4 text-white">
            See the Magic
          </h2>
          <p className="text-lg text-white/70">
            Real examples of AI-powered transformations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <div key={index} className="glass p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-white/50 mb-2 uppercase tracking-wide">Before</p>
                    <img 
                      src={example.before} 
                      alt="Before" 
                      className="w-full aspect-square object-cover bg-white/5"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-2 uppercase tracking-wide">After</p>
                    <img 
                      src={example.after} 
                      alt="After" 
                      className="w-full aspect-square object-cover bg-white/5"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-white/80 font-medium">"{example.command}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExampleImages;
