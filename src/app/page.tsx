
import React from 'react';
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
    <div className="min-h-screen bg-black">
      <Header />
      <Hero />
      <Features />
      <Reviews />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;