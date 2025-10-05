import { url } from "inspector";

export const blogMetadata = {
  "free-photoshop-alternative": {
    title:
      "Best Free Photoshop Alternatives in 2025: Complete Guide for Beginners",
    description:
      "Discover the best free Photoshop alternatives in 2025, including LazeEdit's revolutionary AI technology that preserves faces and product details perfectly. Save money and time with our comprehensive guide.",
    author: "LazeEdit Team",
    date: "2025-07-06",
    tags: [
      "free photoshop alternative",
      "photoshop alternatives",
      "ai image editor",
      "edit images online",
      "ai photo editor",
    ],
    category: "Design Tools",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    featured: true,
    id: 1,
    url: "/blogs/free-photoshop-alternative",
  },
};

export function getAllBlogSlugs() {
  return Object.keys(blogMetadata);
}

// Helper function to get metadata for a specific post
export function getBlogMetadata(slug) {
  return blogMetadata[slug] || null;
}

// Helper function to get all blog posts with metadata
export function getAllBlogPosts() {
  return Object.entries(blogMetadata).map(([slug, metadata]) => ({
    slug,
    ...metadata,
  }));
}
