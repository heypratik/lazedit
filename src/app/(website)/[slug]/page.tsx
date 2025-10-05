import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ExampleImages from "@/components/ExampleImages";
import DemoSection from "@/components/DemoSection";
import Reviews from "@/components/Reviews";
import Comparison from "@/components/Comparison";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export const pageDetails = {
  "free-photoshop-alternatives": {
    hero: {
      title: "🔥 Free Photoshop Alternative",
      description: "🚀 Transform and create images with simple text commands.",
      subdescription:
        "No need to learn complex photoshop tool. LazeEdit is the best free photoshop alternative.",
    },
  },
  "ai-image-editor-with-prompt": {
    hero: {
      title: "🔥 AI Image Editor with Prompt",
      description:
        "🚀 Transform and create images by simply choosing the right prompt.",
      subdescription:
        "No need to write complex prompts. LazeEdit is the best AI image editor with prompt.",
    },
  },
  "ai-photo-editor-with-prompt": {
    hero: {
      title: "🔥 AI Photo Editor with Prompt",
      description:
        "🚀 Transform and create photos by simply choosing the right prompt.",
      subdescription:
        "No need to write complex prompts. LazeEdit is the best AI photo editor with prompt.",
    },
  },
};

export default async function DynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!(slug in pageDetails)) {
    return <div>Page not found</div>;
  }

  // @ts-ignore
  const pageData = pageDetails[slug];

  return (
    <>
      <Head>
        <title>
          LazeEdit - AI Image Editor | Best Photoshop Alternative 2025
        </title>
        <meta
          name="description"
          content="AI Image Editor Tool | Edit images by just telling LazeEdit what you want. Remove backgrounds, change text, create banners - no design skills needed. Free Photoshop alternative with AI magic."
        />

        {/* Open Graph (Facebook, Insta, LinkedIn) */}
        <meta
          property="og:title"
          content="LazeEdit - AI Image Editor | Best Photoshop Alternative 2025"
        />
        <meta
          property="og:description"
          content="AI Image Editor Tool | Edit images by just telling LazeEdit what you want. Remove backgrounds, change text, create banners - no design skills needed. Free Photoshop alternative with AI magic."
        />
        <meta
          property="og:image"
          content="https://yourdomain.com/og-image.png"
        />
        <meta property="og:url" content="https://www.lazedit.com/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="LazeEdit - AI Image Editor | Best Photoshop Alternative 2025"
        />
        <meta
          name="twitter:description"
          content="AI Image Editor Tool | Edit images by just telling LazeEdit what you want. Remove backgrounds, change text, create banners - no design skills needed. Free Photoshop alternative with AI magic."
        />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/og-image.png"
        />

        {/* Canonical */}
        <link rel="canonical" href="https://www.lazedit.com/" />
        <link rel="icon" href="/icon-logo.png" />
      </Head>
      <main className="min-h-screen bg-black">
        <Header />
        <Hero
          title={pageData["hero"].title}
          description={pageData["hero"].description}
          subdescription={pageData["hero"].subdescription}
        />
        <Features />
        <Reviews />
        <Pricing />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}
