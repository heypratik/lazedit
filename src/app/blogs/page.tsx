import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "🔥 How AI is Killing Traditional Photo Editing (And Why That's Amazing)",
      excerpt: "Traditional photo editing is dead. Here's why AI-powered tools like LazyEdit are making Photoshop skills obsolete and saving creators thousands of hours.",
      date: "2025-01-15",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "⚡ From 3 Hours to 3 Seconds: Real Customer Success Stories",
      excerpt: "Meet Sarah, who went from spending entire weekends editing product photos to creating professional content in minutes.",
      date: "2025-01-12",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "🚀 Why Text-to-Edit is the Future of Content Creation",
      excerpt: "Stop learning complex software. Just tell AI what you want. Here's why natural language editing is revolutionizing creative workflows.",
      date: "2025-01-10",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop"
    },
    {
      id: 4,
      title: "💰 The Hidden Costs of Traditional Photo Editing",
      excerpt: "Software subscriptions, learning time, opportunity cost. We calculated the real price of the 'old way' - the results will shock you.",
      date: "2025-01-08",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop"
    },
    {
      id: 5,
      title: "🎯 10 LazyEdit Features That Will Blow Your Mind",
      excerpt: "From instant background removal to pose changes, here are the AI editing features that are making designers rethink everything.",
      date: "2025-01-05",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop"
    },
    {
      id: 6,
      title: "📸 Before AI vs After AI: The Editing Revolution",
      excerpt: "Side-by-side comparisons showing how AI editing produces better results in 1/100th the time of traditional methods.",
      date: "2025-01-03",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop"
    },
    {
      id: 7,
      title: "🎨 Creating Professional Product Photos with Zero Experience",
      excerpt: "How complete beginners are creating magazine-worthy product photos in seconds using AI-powered editing tools.",
      date: "2025-01-01",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
    },
    {
      id: 8,
      title: "⭐ What 1000+ Users Really Think About LazyEdit",
      excerpt: "Real reviews, honest feedback, and surprising results from our growing community of creators and business owners.",
      date: "2024-12-28",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=400&fit=crop"
    }
  ];

  const featuredPosts = blogPosts.slice(0, 3);
  const regularPosts = blogPosts.slice(3);

  return (

    <>
    <Header />
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 pattern-dots opacity-20"></div>
      <div className="absolute inset-0 pattern-grid opacity-10"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              🔥 LazyEdit Blog
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
              AI insights, success stories, and the future of image editing
            </p>
          </div>

          {/* Masonry Layout - First 3 Posts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {/* Large Featured Post */}
            <article className="lg:col-span-2 lg:row-span-2 glass p-6 group hover:scale-105 transition-transform duration-300 cursor-pointer">
              <img 
                src={featuredPosts[0].image} 
                alt={featuredPosts[0].title}
                className="w-full h-64 lg:h-80 object-cover mb-4"
              />
              
              <div className="flex items-center gap-4 mb-3 text-white/60 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(featuredPosts[0].date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {featuredPosts[0].readTime}
                </span>
              </div>
              
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                {featuredPosts[0].title}
              </h2>
              
              <p className="text-white/80 mb-6 leading-relaxed">
                {featuredPosts[0].excerpt}
              </p>
              
              <button className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors">
                Read Full Article <ArrowRight className="w-4 h-4" />
              </button>
            </article>

            {/* Two Smaller Posts */}
            {featuredPosts.slice(1).map((post) => (
              <article key={post.id} className="glass p-4 group hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-40 object-cover mb-3"
                />
                
                <div className="flex items-center gap-2 mb-2 text-white/60 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-white/70 text-sm mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <button className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
                  Read More <ArrowRight className="w-3 h-3" />
                </button>
              </article>
            ))}
          </div>

          {/* Regular Grid - Remaining Posts */}
          {regularPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <article key={post.id} className="glass p-6 group hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover mb-4"
                  />
                  
                  <div className="flex items-center gap-3 mb-3 text-white/60 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-orange-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <button className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
                    Read More <ArrowRight className="w-3 h-3" />
                  </button>
                </article>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {/* <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 hover:scale-105">
              Load More Articles
            </button>
          </div> */}
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
};

export default BlogPage;