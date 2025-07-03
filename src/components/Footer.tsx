import React from 'react';
import { FaArrowAltCircleRight } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-16 section-padding">
        <div className="max-w-6xl mx-auto mb-12">
         <div className='flex items-start justify-between gap-8'>
            <div>
            <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white flex items-center justify-center text-black font-bold text-sm">
                LE
              </div>
              <span className="text-xl font-medium text-white">
                Lazy Edit
              </span>
            </div>
            <p className="text-white/60 text-base leading-relaxed">
              🚀 From idea to image in seconds. <br></br>Transform and create images with simple text commands. 
            </p>
          </div>
          <div className="flex items-center justify-start gap-2 mt-3">
                          <span className="text-white font-medium ">⭐⭐⭐⭐⭐</span>
                          <span className="text-white/60"> 4.9/5 | </span>
                        <span className="text-white/60 mt-0">Trusted by 1000+ businesses</span>
                        </div>
         </div>

      <button 
        className="relative px-10 py-6 text-white font-semibold text-lg rounded-xl overflow-hidden"
        style={{
          backgroundImage: 'url(https://www.aragon.ai/assets/offer-bg.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}
      >
        <span className="relative z-10 flex justify-between items-center">Earn 30% for every refferal <FaArrowAltCircleRight className='ml-3' color='#fff' size={30}/>
</span>
      </button>
         </div>
        </div>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Prod 1 */}
          <div>
            <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wide">Product</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wide">Product</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wide">Company</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wide">Support</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-white/50 mb-4 md:mb-0">
            © 2025 Lazy Edit. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-white/50">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
