"use client";

import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does AI image editing work?",
      answer: "Simply describe what you want in plain English. Our AI understands your intent and applies professional-grade edits automatically."
    },
    {
      question: "What file formats do you support?",
      answer: "We support all major formats including JPG, PNG, WEBP, HEIC, and RAW files from most cameras."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Start with 5 free edits to experience the magic. No credit card required."
    },
    {
      question: "How fast is the processing?",
      answer: "Most edits complete in under 30 seconds. Batch processing can handle hundreds of images simultaneously."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. Cancel your subscription anytime with no questions asked. No contracts or commitments."
    },
    {
      question: "Do you store my images?",
      answer: "Images are processed securely and deleted after 24 hours. We never store or share your content."
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-3 sm:mb-4 text-white leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-white/70">
            Everything you need to know
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="glass overflow-hidden">
              <button
                className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex justify-between items-start sm:items-center gap-3 sm:gap-4 hover:bg-white/5 transition-colors duration-200 active:bg-white/10"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-white font-medium text-sm sm:text-base leading-relaxed pr-2">
                  {faq.question}
                </span>
                <span className="text-white/50 text-lg sm:text-xl flex-shrink-0 mt-0.5 sm:mt-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              <div
                id={`faq-answer-${index}`}
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                  <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;