import React from 'react';

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
    <section className="py-10 section-padding relative">
      <div className="absolute inset-0 pattern-dots opacity-10"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass-subtle p-1 rounded-2xl border border-white">
          <div className="bg-black/50 rounded-xl p-4">
            {/* Header */}
            <div className="grid grid-cols-3 gap-8 mb-8 pb-6 border-b border-white/10">
              <div className="text-center">
                <h3 className="text-white/50 text-sm uppercase tracking-wide font-medium"></h3>
              </div>
              <div className="text-center">
                <h3 className="text-white/70 text-xl uppercase tracking-wide font-medium">😴 Old Way</h3>
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl uppercase tracking-wide font-medium">🚀 With Lazy Edit</h3>
              </div>
            </div>

            {/* Comparisons */}
            <div className="space-y-6">
              {comparisons.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-8 py-4 hover:bg-white/5 transition-colors duration-300 rounded-lg px-4">
                  <div className="text-white font-medium flex items-center">
                    {item.feature}
                  </div>
                  <div className="text-white/60 flex items-center justify-center text-center text-sm">
                    {item.traditional}
                  </div>
                  <div className="text-white font-medium flex items-center justify-center text-center text-sm">
                    {item.lazyEdit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;