import React from 'react';

const Reviews = () => {
  const reviews = [
    {
      name: "Sarah Chen",
      role: "Photographer",
      content: "This is exactly what I needed. No more hours in Photoshop - just tell it what to do and it's done.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Content Creator",
      content: "Game changer for my workflow. I can batch edit hundreds of photos in minutes instead of days.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Marketing Director",
      content: "Our team's productivity has tripled. The quality is professional and the speed is unmatched.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Graphic Designer",
      content: "I was skeptical at first, but the results are consistently better than my manual edits.",
      rating: 5
    },
    {
      name: "Alex Thompson",
      role: "E-commerce Owner",
      content: "Transformed my product photos instantly. Sales increased by 40% after using these edited images.",
      rating: 5
    },
    {
      name: "Lisa Park",
      role: "Social Media Manager",
      content: "Creating content has never been this easy. I can produce a week's worth of posts in an hour.",
      rating: 5
    }
  ];

  const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
    <div className="glass p-6 mx-3 min-w-[300px]">
      <div className="flex mb-3">
        {[...Array(review.rating)].map((_, i) => (
          <span key={i} className="text-white text-sm">⭐</span>
        ))}
      </div>
      <p className="text-white/80 mb-4 leading-relaxed">
        "{review.content}"
      </p>
      <div>
        <p className="text-white font-medium text-sm">{review.name}</p>
        <p className="text-white/50 text-xs">{review.role}</p>
      </div>
    </div>
  );

  return (
    <section className="py-20 section-padding overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium mb-4 text-white">
            What Our Users Say
          </h2>
          <p className="text-lg text-white/70">
            Join thousands of satisfied creators
          </p>
        </div>

        <div className="space-y-8">
          {/* First row - moving left to right */}
          <div className="relative">
            <div className="flex animate-[scroll-left_30s_linear_infinite]">
              {[...reviews, ...reviews].map((review, index) => (
                <ReviewCard key={`row1-${index}`} review={review} />
              ))}
            </div>
          </div>

          {/* Second row - moving right to left */}
          <div className="relative">
            <div className="flex animate-[scroll-right_25s_linear_infinite]">
              {[...reviews.slice().reverse(), ...reviews.slice().reverse()].map((review, index) => (
                <ReviewCard key={`row2-${index}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
