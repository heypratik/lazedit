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
    <section className="py-20 section-padding">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium mb-4 text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-white/70">
            Everything you need to know
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="glass">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-white font-medium">{faq.question}</span>
                <span className="text-white/50 ml-4">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
