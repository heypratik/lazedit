import fs from 'fs';
import path from 'path';
import { getBlogMetadata } from '../metadata';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const metadata = getBlogMetadata(slug);
  
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
      publishedTime: metadata.date,
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