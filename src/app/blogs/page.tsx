import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogMetadata } from "./metadata";
import Link from 'next/link';

const BlogPage = () => {
  const blogPosts = Object.values(blogMetadata).map((post, index) => ({
    ...post,
    id: index + 1, // Assign a unique ID based on index
  }));

  const featuredPosts = blogPosts.slice(0, 3);
  const regularPosts = blogPosts.slice(3);

  return (
    <>
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
              <Link href={featuredPosts[0].url} passHref legacyBehavior>
                <a className="lg:col-span-2 lg:row-span-2 glass p-6 group transition-transform duration-300 cursor-pointer block">
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
                    {featuredPosts[0].description}
                  </p>

                  <button className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors">
                    Read Full Article <ArrowRight className="w-4 h-4" />
                  </button>
                </a>
              </Link>

              {/* Two Smaller Posts */}
              {featuredPosts.slice(1).map((post) => (
                <Link href={post.url} passHref legacyBehavior key={post.id}>
                  <a className="glass p-4 group transition-transform duration-300 cursor-pointer block">
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
                      {post.description}
                    </p>

                    <button className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
                      Read More <ArrowRight className="w-3 h-3" />
                    </button>
                  </a>
                </Link>
              ))}
            </div>

            {/* Regular Grid - Remaining Posts */}
            {regularPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <Link href={post.url} passHref legacyBehavior key={post.id}>
                    <a className="glass p-6 group transition-transform duration-300 cursor-pointer block">
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
                        {post.description}
                      </p>

                      <button className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
                        Read More <ArrowRight className="w-3 h-3" />
                      </button>
                    </a>
                  </Link>
                ))}
              </div>
            )}

          </div>
        </div>
      </main>
    </>
  );
};

export default BlogPage;