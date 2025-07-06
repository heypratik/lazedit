import fs from 'fs';
import path from 'path';

// Hardcode metadata for each post
const blogMetadata = {
  'free-photoshop-alternative': {
    title: "Best Free Photoshop Alternatives in 2025: Complete Guide for Beginners",
    description: "Discover the best free Photoshop alternatives in 2025, including LazeEdit's revolutionary AI technology...",
    author: "LazeEdit Team",
    publishDate: "2025-07-06",
    tags: ["free photoshop alternative", "photoshop alternatives", "ai image editor"]
  }
  // Add more posts here
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const metadata = blogMetadata[slug];
  
  if (!metadata) {
    return {
      title: 'Blog Post - LazeEdit',
      description: 'LazeEdit blog post',
    };
  }
  
  return {
    title: metadata.title,
    description: metadata.description,
    authors: [{ name: metadata.author }],
    keywords: metadata.tags,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'article',
      publishedTime: metadata.publishDate,
      authors: [metadata.author],
      tags: metadata.tags,
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = params;

  try {
    const filePath = path.join(process.cwd(), 'src/app/blogs/posts', `${slug}.html`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    return (
      <article className="prose mx-auto p-4 text-white max-w-3xl blog-post">
        <div dangerouslySetInnerHTML={{ __html: content }} />

      </article>
    );
  } catch (error) {
    return <div>Post not found</div>;
  }
}