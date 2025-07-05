"use client";

import dynamic from 'next/dynamic';

export default function BlogPost({ params }) {
  const { slug } = params;

  console.log(`Loading blog post: ${slug}`);

  const MDXContent = dynamic(() => import(`@/app/blogs/posts/${slug}.mdx`).catch(() => () => <div>Post not found</div>), {
    ssr: true,
  });

  return (
      <article className="prose mx-auto p-4 text-white max-w-6xl">
        <MDXContent />
      </article>
  );
}
