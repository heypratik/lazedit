
import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ExampleImages from '@/components/ExampleImages';
import DemoSection from '@/components/DemoSection';
import Reviews from '@/components/Reviews';
import Comparison from '@/components/Comparison';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <>
        <Head>
        <title>LazeEdit - AI Image Editor | Best Photoshop Alternative 2025</title>
        <meta name="description" content="Edit images by just telling LazeEdit what you want. Remove backgrounds, change text, create banners - no design skills needed. Free Photoshop alternative with AI magic. Try now!" />

        {/* Open Graph (Facebook, Insta, LinkedIn) */}
        <meta property="og:title" content="LazeEdit - AI Image Editor | Best Photoshop Alternative 2025" />
        <meta property="og:description" content="Edit images by just telling LazeEdit what you want. Remove backgrounds, change text, create banners - no design skills needed. Free Photoshop alternative with AI magic. Try now!" />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        <meta property="og:url" content="https://www.lazedit.com/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LazeEdit - AI Image Editor | Best Photoshop Alternative 2025" />
        <meta name="twitter:description" content="Edit images by just telling LazeEdit what you want. Remove backgrounds, change text, create banners - no design skills needed. Free Photoshop alternative with AI magic. Try now!" />
        <meta name="twitter:image" content="https://yourdomain.com/og-image.png" />

        {/* Canonical */}
        <link rel="canonical" href="https://www.lazedit.com/" />
        <link rel="icon" href="/icon-logo.png" />
        </Head>
        <main className="min-h-screen bg-black">
        <Header />
        <Hero />
        <Features />
        <Reviews />
        <Pricing />
        <FAQ />
        <Footer />
      </main>
    </>
  );
};

export default Index;